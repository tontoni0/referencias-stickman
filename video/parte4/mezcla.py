"""Mezcla el audio de la parte 4: voz, viento, tensión del gancho, congelado, rebobinado,
golpes en el vidrio, paloma, latidos, gruñido, raspón, alivio y sirena.

Uso: python3 -I mezcla.py tl.js ../audio/parte4/narracion.mp3 salida.m4a
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
    congela = ini["rebobina"] - 0.85          # igual que en escenas.js (ganchoPata)

    golpe = "aevalsrc='0.9*sin(2*PI*(42+40*exp(-9*t))*t)*exp(-2.6*t)':s=44100:d=2"
    vibra = "aevalsrc='0.3*sgn(sin(2*PI*160*t))*lt(mod(t,0.32),0.16)':s=44100:d=0.5,lowpass=f=900"
    aleteo = "anoisesrc=color=white:amplitude=0.5:d={d},bandpass=f=900:width_type=h:w=700,volume='0.5*(0.5+0.5*sin(2*PI*14*t))':eval=frame"
    arrullo = ("aevalsrc='0.25*(between(t,0,0.5)*sin(2*PI*(380*t-80*t*t))*sin(PI*t/0.5)"
               "+between(t,0.6,1.3)*sin(2*PI*(360*(t-0.6)-60*(t-0.6)*(t-0.6)))*sin(PI*(t-0.6)/0.7))*(1+0.3*sin(2*PI*28*t))':s=44100:d=1.4")

    def viento(d):
        return (f"anoisesrc=color=pink:amplitude=0.5:d={d:.3f},highpass=f=150,lowpass=f=700,"
                f"volume='0.4*(0.6+0.4*sin(2*PI*0.3*t))':eval=frame,afade=t=in:d=0.3,afade=t=out:st={d - 0.4:.3f}:d=0.4")

    f = []  # (etiqueta, filtro, inicio)
    f.append(("amb", f"anoisesrc=color=brown:amplitude=0.6:d={dur},lowpass=f=160,volume=0.2", 0))
    f.append(("vi1", viento(congela), 0))
    f.append(("vi2", viento(ini["adentro"] - ini["salta"]), ini["salta"]))
    # Gancho: tensión que sube y se corta en seco al congelar
    f.append(("ten", f"aevalsrc='0.09*sin(2*PI*(170*t+70*t*t/{congela:.2f}))*(0.3+0.7*t/{congela:.2f})':s=44100:d={congela:.3f}", 0))
    f.append(("cg1", f"{golpe},volume=0.9", congela))
    f.append(("cg2", "anoisesrc=color=white:amplitude=0.6:d=0.6,highpass=f=1500,afade=t=out:st=0:d=0.6,volume=0.5", congela))
    d_rew = ini["dia3"] - ini["rebobina"]
    f.append(("rew", f"aevalsrc='0.13*sin(2*PI*(2400*t-1000*t*t/{d_rew:.2f}))*(0.6+0.4*sin(2*PI*18*t))':s=44100:d={d_rew:.3f},"
                     f"afade=t=out:st={d_rew - 0.2:.2f}:d=0.2", ini["rebobina"]))
    # Celular en silencio: solo vibra con los mensajes
    f.append(("vb1", vibra, m["latas"]))
    f.append(("vb2", vibra, m["afuera"]))
    # Recuerdo: manos golpeando el vidrio, apagadas
    d_rec = ini["regla3"] - ini["recuerdo"]
    f.append(("vid", f"aevalsrc='(sin(2*PI*70*mod(t,0.37))*exp(-30*mod(t,0.37))+0.7*sin(2*PI*60*mod(t+0.15,0.53))*exp(-30*mod(t+0.15,0.53)))*0.3':"
                     f"s=44100:d={d_rec:.3f},lowpass=f=400,afade=t=out:st={d_rec - 0.3:.2f}:d=0.3", ini["recuerdo"]))
    # Paloma: aterriza aleteando y arrulla
    f.append(("al1", aleteo.format(d=1.0), m["paloma"] - 0.1))
    f.append(("arr", arrullo, m["paloma"] + 1.1))
    # Chispa salta: soplido y la paloma huye
    f.append(("sop", "anoisesrc=color=pink:amplitude=0.7:d=0.6,bandpass=f=1200:width_type=h:w=1500,afade=t=in:d=0.25,afade=t=out:st=0.25:d=0.35,volume=0.6", ini["salta"]))
    f.append(("al2", aleteo.format(d=0.9), ini["salta"] + 0.1))
    # Latidos desde que está en la cornisa hasta que la agarras
    d_lat = m["agarras"] - ini["cornisa"]
    f.append(("lat", f"aevalsrc='(sin(2*PI*52*mod(t,0.8))*exp(-22*mod(t,0.8))+0.6*sin(2*PI*48*mod(t-0.2,0.8))*exp(-22*mod(t-0.2,0.8))*gte(t,0.2))"
                     f"*(0.35+0.65*t/{d_lat:.2f})':s=44100:d={d_lat:.3f},volume=0.85", ini["cornisa"]))
    # La paloma aletea y Chispa gruñe cada vez más fuerte
    f.append(("al3", aleteo.format(d=1.4), m["aletea"] - 0.1))
    d_gru = m["ladrar"] + 1.0 - m["gruneM"]
    f.append(("gru", f"anoisesrc=color=brown:amplitude=0.8:d={d_gru:.3f},lowpass=f=260,volume='(0.5+0.5*sin(2*PI*26*t))*(0.4+0.8*t/{d_gru:.2f})':eval=frame,"
                     f"afade=t=out:st={d_gru - 0.15:.2f}:d=0.15,volume=0.9", m["gruneM"]))
    # La pata resbala: raspón y migajas
    f.append(("ras", "anoisesrc=color=white:amplitude=0.6:d=0.45,highpass=f=2500,afade=t=out:st=0:d=0.45,volume=0.6", m["pata"] + 0.15))
    f.append(("mig", "aevalsrc='0.5*(2*random(0)-1)*lt(mod(t*7.3,1),0.04)*exp(-2*t)':s=44100:d=1.2,highpass=f=3000", m["pata"] + 0.25))
    # La agarras: golpe seco. Luego, alivio
    f.append(("agr", f"{golpe},volume=0.5", m["agarras"]))
    d_ali = ini["alerta"] - ini["adentro"]
    f.append(("ali", f"aevalsrc='0.05*(sin(2*PI*220*t)+sin(2*PI*277.2*t)+sin(2*PI*329.6*t))*min(1,t/1.5)':s=44100:d={d_ali:.3f},"
                     f"afade=t=out:st={d_ali - 1:.2f}:d=1", ini["adentro"]))
    # Esa noche: la sirena otra vez
    fase = "2*PI*700*t-500*cos(PI*t)"
    d_sir = dur - (m["suena"] - 0.3)
    f.append(("sir", f"aevalsrc='0.5*sin({fase})+0.15*sin(3*({fase}))':s=44100:d={d_sir:.3f},lowpass=f=2800,aecho=0.8:0.6:120:0.35,"
                     f"volume=0.11,afade=t=in:d=0.2,afade=t=out:st={d_sir - 0.8:.2f}:d=0.8", m["suena"] - 0.3))
    f.append(("fin", f"{golpe},volume=0.8", ini["parte5"]))

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
