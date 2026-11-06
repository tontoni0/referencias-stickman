"""Mezcla el audio de la parte 3: voz, viento, tensión del gancho, rebobinado, gemido, latidos y golpes.

Uso: python3 -I mezcla.py tl.js ../audio/parte3/narracion.mp3 salida.m4a
"""
import json
import subprocess
import sys


def lee_tl(ruta):
    texto = open(ruta).read()
    return json.loads(texto[texto.index("{"): texto.rindex("}") + 1])


def main(tl_js, voz, salida):
    tl = lee_tl(tl_js)
    m = tl["marcas"]
    ini = {e["id"]: e["inicio"] for e in tl["escenas"]}
    dur = tl["duracion"]
    congela = ini["rebobina"] - 0.75          # igual que en escenas.js (ganchoVidrio)
    llega_memo = ini["chatmemo"] + 1.1        # igual que en escenas.js (chatmemo)

    fuentes = []  # (etiqueta, filtro, inicio en segundos)
    fuentes.append(("amb", f"anoisesrc=color=brown:amplitude=0.6:d={dur},lowpass=f=160,volume=0.2", 0))
    fuentes.append(("vie", f"anoisesrc=color=pink:amplitude=0.5:d={ini['sacude']},highpass=f=150,lowpass=f=700,"
                           f"volume='0.35*(0.6+0.4*sin(2*PI*0.23*t))':eval=frame,afade=t=out:st={ini['sacude'] - 1}:d=1", 0))
    # Tono que sube durante el gancho y se corta en seco al congelar
    fuentes.append(("ten", f"aevalsrc='0.09*sin(2*PI*(180*t+60*t*t/{congela:.2f}))*(0.3+0.7*t/{congela:.2f})':s=44100:d={congela:.3f}", 0))
    # Golpe y soplido al congelar
    fuentes.append(("cg1", "aevalsrc='0.9*sin(2*PI*(42+40*exp(-9*t))*t)*exp(-2.6*t)':s=44100:d=2,volume=0.9", congela))
    fuentes.append(("cg2", "anoisesrc=color=white:amplitude=0.6:d=0.6,highpass=f=1500,afade=t=out:st=0:d=0.6,volume=0.5", congela))
    # Rebobinado: chirrido de cinta que baja de tono
    d_rew = ini["dia2"] - ini["rebobina"]
    fuentes.append(("rew", f"aevalsrc='0.13*sin(2*PI*(2400*t-1000*t*t/{d_rew:.2f}))*(0.6+0.4*sin(2*PI*18*t))':s=44100:d={d_rew:.3f},"
                           f"afade=t=out:st={d_rew - 0.2:.2f}:d=0.2", ini["rebobina"]))
    # Tensión mientras la botella se acerca al vidrio
    d_giro = ini["chillido"] - m["acerca"]
    fuentes.append(("ten2", f"aevalsrc='0.08*sin(2*PI*(220*t+55*t*t/{d_giro:.2f}))*(0.3+0.7*t/{d_giro:.2f})':s=44100:d={m['pega'] + 0.6 - m['acerca']:.3f}",
                    m["acerca"]))
    # Gemido de Chispa: dos quejidos cortos
    gemido = ("aevalsrc='0.3*(between(t,0,0.45)*sin(2*PI*(1050*t-300*t*t))*sin(PI*t/0.45)"
              "+between(t,0.55,0.9)*sin(2*PI*(980*(t-0.55)-260*(t-0.55)*(t-0.55)))*sin(PI*(t-0.55)/0.35))"
              "*(1+0.15*sin(2*PI*9*t))':s=44100:d=1")
    fuentes.append(("gem", gemido, m["chillido"] + 0.45))
    # Latidos mientras aguantas la respiración
    d_lat = ini["mano"] - m["mueve"]
    latido = (f"aevalsrc='(sin(2*PI*52*mod(t,0.87))*exp(-22*mod(t,0.87))"
              f"+0.6*sin(2*PI*48*mod(t-0.2,0.87))*exp(-22*mod(t-0.2,0.87))*gte(t,0.2))*(0.5+0.5*t/{d_lat:.2f})':s=44100:d={d_lat:.3f},volume=0.9")
    fuentes.append(("lat", latido, m["mueve"]))
    golpe = "aevalsrc='0.9*sin(2*PI*(42+40*exp(-9*t))*t)*exp(-2.6*t)':s=44100:d=2"
    fuentes.append(("g1", f"{golpe},volume=0.7", ini["memo"]))
    fuentes.append(("g2", f"{golpe},volume=0.8", ini["parte4"]))
    fuentes.append(("vib", "aevalsrc='0.35*sgn(sin(2*PI*160*t))*lt(mod(t,0.32),0.16)':s=44100:d=0.5,lowpass=f=900", llega_memo))

    filtros = [f"[0:a]adelay={int(tl['intro'] * 1000)}:all=1[voz]"]
    etiquetas = ["[voz]"]
    for nombre, src, t0 in fuentes:
        filtros.append(f"{src},adelay={int(t0 * 1000)}:all=1[{nombre}]")
        etiquetas.append(f"[{nombre}]")
    filtros.append(f"{''.join(etiquetas)}amix=inputs={len(etiquetas)}:normalize=0:duration=longest,"
                   f"atrim=0:{dur},loudnorm=I=-14:TP=-1.5:LRA=11[out]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", voz, "-filter_complex", ";".join(filtros),
                    "-map", "[out]", "-ar", "44100", "-c:a", "aac", "-b:a", "192k", salida], check=True)
    print("Audio listo:", salida)


if __name__ == "__main__":
    main(*sys.argv[1:4])
