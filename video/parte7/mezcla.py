"""Mezcla el audio de la parte 7: voz, campanita del voto, sello y tachón, viento en la azotea, la puerta
que rechina, llaves, pasos, la llave en la cerradura, la escalerita, el clic de la lámpara, el CLANG del barandal,
el golpe cuando voltean, gruñidos, pasos corriendo, latidos y el cierre.

Uso: python3 -I mezcla.py tl.js ../audio/parte7/narracion.mp3 salida.m4a
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
    fin = {e["id"]: (tl["escenas"][i + 1]["inicio"] if i + 1 < len(tl["escenas"]) else dur) for i, e in enumerate(tl["escenas"])}
    # Igual que en escenas.js
    clang = m["barandal"] + 0.25
    abre_502 = m["abre"] + 0.8

    golpe = "aevalsrc='0.9*sin(2*PI*(42+40*exp(-9*t))*t)*exp(-2.6*t)':s=44100:d=2"
    rechina = ("aevalsrc='0.25*sin(2*PI*(260+120*sin(2*PI*1.3*t))*t)*(0.5+0.5*sin(2*PI*31*t))*sin(PI*t/{d})':s=44100:d={d},"
               "bandpass=f=900:width_type=h:w=1400")
    fierro = "aevalsrc='0.3*(sin(2*PI*1800*t)+0.6*sin(2*PI*2730*t))*exp(-22*t)':s=44100:d=0.3"
    clic = "aevalsrc='0.4*(2*random(0)-1)*exp(-120*t)':s=44100:d=0.08,highpass=f=2000"

    def ruido(etiqueta, d, color, filtros, t0):
        f.append((etiqueta, f"anoisesrc=color={color}:amplitude=0.8:d={d:.3f},{filtros}", t0))

    f = []  # (etiqueta, filtro, inicio)
    f.append(("amb", f"anoisesrc=color=brown:amplitude=0.6:d={dur},lowpass=f=160,volume=0.12", 0))
    # 1. El voto: una campanita
    f.append(("cam", "aevalsrc='0.12*(sin(2*PI*880*t)+0.6*sin(2*PI*1318.5*t)+0.4*sin(2*PI*1760*t))*exp(-3*t)':s=44100:d=1.5", 0.1))
    # 2. Sello y tachón
    f.append(("sel", f"{golpe},lowpass=f=400,volume=0.15", m["vieja"]))
    ruido("tx1", 0.2, "white", "bandpass=f=2500:width_type=h:w=2000,volume=0.12", m["mintio"])
    ruido("tx2", 0.2, "white", "bandpass=f=2500:width_type=h:w=2000,volume=0.12", m["mintio"] + 0.2)
    # 3 a 7. Viento en la azotea y la cornisa
    d_vi = ini["voltean"] - ini["azotea"]
    ruido("vie", d_vi, "pink", f"highpass=f=150,lowpass=f=700,volume='0.28*(0.6+0.4*sin(2*PI*0.3*t))':eval=frame,afade=t=in:d=0.6,afade=t=out:st={d_vi - 0.5:.2f}:d=0.5", ini["azotea"])
    # 3. La puerta de la azotea rechina, llaves, pasos de Memo
    f.append(("rec", rechina.format(d=1.0) + ",volume=0.5", m["rechina"]))
    f.append(("lla", "aevalsrc='0.15*(2*random(0)-1)*lt(mod(t*11,1),0.12)*(sin(2*PI*4200*t)+sin(2*PI*5600*t))':s=44100:d=1.0,highpass=f=3000", m["llavero"]))
    d_pm = fin["tinacos"] - m["lampara"]
    f.append(("pme", f"aevalsrc='0.4*sin(2*PI*70*mod(t,0.62))*exp(-40*mod(t,0.62))':s=44100:d={d_pm:.3f},lowpass=f=400,volume=0.5", m["lampara"]))
    # 4. Tus pasos rápidos y bajitos hacia los tinacos
    d_tu = m["escondes"] + 0.5 - ini["tinacos"]
    f.append(("ptu", f"aevalsrc='0.3*sin(2*PI*90*mod(t,0.22))*exp(-50*mod(t,0.22))':s=44100:d={d_tu:.3f},lowpass=f=500,volume=0.35", ini["tinacos"] + 0.3))
    # 5. La llave en la cerradura y la puerta de la bodega
    f.append(("lla2", f"{clic},volume=0.6", m["abre"] + 0.1))
    f.append(("lla3", f"{clic},volume=0.6", m["abre"] + 0.45))
    f.append(("rec2", rechina.format(d=0.7) + ",volume=0.4", abre_502))
    # 7. Un timbre suave cuando aparecen las huellas
    f.append(("hue", "aevalsrc='0.06*(sin(2*PI*659*t)+sin(2*PI*784*t))*exp(-2*t)':s=44100:d=1.6", m["huellas"]))
    # 8. La escalerita de fierro
    t_, k = ini["bajas"], 0
    while t_ < m["sigues"]:
        f.append((f"fe{k}", f"{fierro},volume=0.3", t_))
        t_ += 0.34
        k += 1
    # 9. El clic de la lámpara y el CLANG del barandal
    f.append(("cli", f"{clic},volume=0.5", m["alumbraM"] - 0.3))
    f.append(("cla", "aevalsrc='0.35*(sin(2*PI*620*t)+0.8*sin(2*PI*1013*t)+0.6*sin(2*PI*1587*t)+0.4*sin(2*PI*2390*t))*exp(-2.2*t)"
                     "+0.3*(2*random(0)-1)*exp(-60*t)':s=44100:d=2.2,aecho=0.8:0.6:180:0.3,volume=0.5", clang))
    # 10. Las cabezas voltean: golpe grave y gruñidos
    f.append(("vol", f"{golpe},volume=0.18", m["cabezas"] - 0.1))
    d_gr = fin["manos"] - m["cabezas"]
    ruido("gru", d_gr, "brown", f"lowpass=f=260,volume='0.35*(0.5+0.5*sin(2*PI*23*t))*(0.5+0.5*sin(2*PI*0.9*t))':eval=frame,afade=t=in:d=0.3,afade=t=out:st={d_gr - 0.3:.2f}:d=0.3", m["cabezas"])
    # 11. Corres: pasos rápidos sobre el concreto
    d_co = fin["manos"] - m["corres"] + 0.3
    f.append(("cor", f"aevalsrc='0.4*sin(2*PI*80*mod(t,0.18))*exp(-45*mod(t,0.18))':s=44100:d={d_co:.3f},lowpass=f=600,volume=0.3", m["corres"] - 0.3))
    # 12 y 13. Latidos hasta la ventana del 402; la jaula del gas cruje
    d_la = ini["cortina"] - ini["esquina"]
    f.append(("lat", f"aevalsrc='(sin(2*PI*52*mod(t,0.66))*exp(-22*mod(t,0.66))+0.6*sin(2*PI*48*mod(t-0.18,0.66))*exp(-22*mod(t-0.18,0.66))*gte(t,0.18))':"
                     f"s=44100:d={d_la:.3f},volume=0.17,afade=t=out:st={d_la - 0.6:.2f}:d=0.6", ini["esquina"]))
    f.append(("jau", f"{fierro},lowpass=f=1500,volume=0.3", m["jaula"] + 0.6))
    # 14. La cortina: un roce y una nota que queda en el aire
    ruido("cor2", 0.9, "pink", "bandpass=f=1500:width_type=h:w=1500,afade=t=in:d=0.3,afade=t=out:st=0.4:d=0.5,volume=0.2", ini["cortina"] + 0.2)
    d_no = dur - m["mano"]
    f.append(("not", f"aevalsrc='0.028*(sin(2*PI*220*t)+sin(2*PI*261.6*t)+sin(2*PI*329.6*t))*min(1,t/1.2)':s=44100:d={d_no:.3f},afade=t=out:st={d_no - 1:.2f}:d=1", m["mano"]))
    f.append(("fin", f"{golpe},volume=0.18", ini["final"]))

    filtros = [f"[0:a]adelay={int(tl['intro'] * 1000)}:all=1[voz]"]
    etiquetas = ["[voz]"]
    for nombre, src, t0 in f:
        filtros.append(f"{src},adelay={int(t0 * 1000)}:all=1[{nombre}]")
        etiquetas.append(f"[{nombre}]")
    filtros.append(f"{''.join(etiquetas)}amix=inputs={len(etiquetas)}:normalize=0:duration=longest,"
                   f"atrim=0:{dur},loudnorm=I=-14:TP=-1.5:LRA=11[out]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", voz, "-filter_complex", ";".join(filtros),
                    "-map", "[out]", "-ar", "44100", "-c:a", "aac", "-b:a", "192k", salida], check=True)
    print("Audio listo:", salida)


if __name__ == "__main__":
    main(*sys.argv[1:4])
