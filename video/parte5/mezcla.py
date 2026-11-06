"""Mezcla el audio de la parte 5: voz, sirena desde el primer segundo, aullidos de Chispa
(claros, tapados y el último con eco), estampida, silla, lata, latidos, el silencio y el golpe final.

Uso: python3 -I mezcla.py tl.js ../audio/parte5/narracion.mp3 salida.m4a
"""
import json
import subprocess
import sys


def lee_tl(ruta):
    texto = open(ruta).read()
    return json.loads(texto[texto.index("{"): texto.rindex("}") + 1])


def aullido(d, periodo=2.8, largo=2.3):
    """Aullidos repetidos: sube y baja de tono con vibrato. Cada uno dura `largo` s y se repite cada `periodo` s."""
    u = f"mod(t,{periodo})"
    fase = (f"(2*PI*480*{u}-440*{largo}*cos(PI*min({u},{largo})/{largo})"
            f"-(9/6)*cos(2*PI*6*{u}))")
    env = f"(min(1,{u}/0.25)*min(1,max(0,{largo}-{u})/0.6))"
    return (f"aevalsrc='0.3*{env}*(sin({fase})+0.35*sin(2*{fase})+0.12*sin(3*{fase}))':s=44100:d={d:.3f},"
            f"lowpass=f=2500")


def main(tl_js, voz, salida):
    tl = lee_tl(tl_js)
    m = tl["marcas"]
    ini = {e["id"]: e["inicio"] for e in tl["escenas"]}
    dur = tl["duracion"]
    # Igual que en escenas.js
    silla = (m["silla"] + 0.1, m["nada1"] - 0.15)
    lata = m["lata"] + 0.55

    golpe = "aevalsrc='0.9*sin(2*PI*(42+40*exp(-9*t))*t)*exp(-2.6*t)':s=44100:d=2"
    vibra = "aevalsrc='0.1*sgn(sin(2*PI*160*t))*lt(mod(t,0.32),0.16)':s=44100:d=0.5,lowpass=f=900"

    f = []  # (etiqueta, filtro, inicio)
    f.append(("amb", f"anoisesrc=color=brown:amplitude=0.6:d={dur},lowpass=f=160,volume=0.14", 0))
    # Sirena desde el primer cuadro hasta que se calla, con corte seco. Más fuerte junto al poste.
    fase = "2*PI*700*t-500*cos(PI*t)"
    d_sir = m["calla"]
    a, b = ini["amontonan"], ini["vacio"]
    f.append(("sir", f"aevalsrc='0.5*sin({fase})+0.15*sin(3*({fase}))':s=44100:d={d_sir:.3f},lowpass=f=2800,aecho=0.8:0.6:120:0.35,"
                     f"volume='0.085*(1+0.5*between(t,{a:.2f},{b:.2f}))':eval=frame,afade=t=out:st={d_sir - 0.03:.3f}:d=0.03", 0))
    # Chispa aúlla desde "empieza a aullar" hasta que se calla la alerta.
    # Tapada (más apagada) un momento cuando te lanzas y desde que le tapas el hocico.
    t0 = m["aullar"] - 0.1
    d_au = m["calla"] - 0.05 - t0
    tapas = [(m["hocico"] + 0.1 - t0, m["hocico"] + 1.3 - t0), (m["tapas"] - t0, d_au)]
    apaga = "+".join(f"between(t,{x:.2f},{y:.2f})" for x, y in tapas)
    f.append(("aul", f"{aullido(d_au)},lowpass=f=380:enable='{apaga}',volume='0.26*(1-0.55*({apaga}))':eval=frame,"
                     f"aecho=0.8:0.5:90:0.3,afade=t=out:st={d_au - 0.05:.3f}:d=0.05", t0))
    # El último aullido: sale limpio justo cuando la alerta se calla y se queda flotando con eco.
    f.append(("ult", f"{aullido(2.4, 9, 2.2)},apad=pad_dur=2,volume=0.3,aecho=0.8:0.75:280|560|840:0.45|0.3|0.18,"
                     f"afade=t=out:st=3.4:d=1", m["calla"] - 0.05))
    # Te lanzas: soplido y golpe sordo
    f.append(("sop", "anoisesrc=color=pink:amplitude=0.7:d=0.6,bandpass=f=900:width_type=h:w=1200,afade=t=in:d=0.3,afade=t=out:st=0.3:d=0.3,volume=0.5", ini["lanzas"] + 0.1))
    f.append(("tum", f"{golpe},lowpass=f=300,volume=0.15", m["hocico"] + 0.1))
    # Estampida: pasos rápidos de muchos hacia el poste
    d_est = m["poste"] + 1.2 - m["corren"]
    f.append(("est", f"anoisesrc=color=brown:amplitude=0.9:d={d_est:.3f},lowpass=f=500,"
                     f"volume='0.31*(0.4+0.6*abs(sin(2*PI*5.3*t))*abs(sin(2*PI*3.1*t+1)))':eval=frame,"
                     f"afade=t=in:d=0.4,afade=t=out:st={d_est - 0.8:.2f}:d=0.8", m["corren"]))
    # Temporizador: bip al iniciar
    f.append(("bip", "aevalsrc='0.09*sin(2*PI*1320*t)*lt(t,0.12)':s=44100:d=0.2", m["noventa"]))
    # La silla raspa el piso
    d_si = silla[1] - silla[0]
    f.append(("sil", f"anoisesrc=color=brown:amplitude=0.9:d={d_si:.3f},bandpass=f=420:width_type=h:w=500,"
                     f"volume='0.6*(0.5+0.5*sin(2*PI*24*t))':eval=frame,afade=t=in:d=0.08,afade=t=out:st={d_si - 0.12:.2f}:d=0.12", silla[0]))
    # La lata: golpe metálico, rebote y rueda
    clank = ("aevalsrc='0.45*(sin(2*PI*1250*t)+0.7*sin(2*PI*1870*t)+0.5*sin(2*PI*2630*t))*exp(-9*t)"
             "+0.3*(2*random(0)-1)*exp(-40*t)':s=44100:d=0.8")
    f.append(("ck1", f"{clank},volume=0.3", lata))
    f.append(("ck2", f"{clank},volume=0.12", lata + 0.24))
    f.append(("rod", "anoisesrc=color=white:amplitude=0.4:d=0.6,bandpass=f=2200:width_type=h:w=1500,"
                     "volume='0.4*(0.5+0.5*sin(2*PI*14*t))':eval=frame,afade=t=out:st=0.2:d=0.4", lata + 0.35))
    # Latidos que se aceleran en la cuenta regresiva y paran en seco con la alerta
    d_lat = m["calla"] - m["diez"]
    f.append(("lat", f"aevalsrc='(sin(2*PI*52*mod(t,0.62))*exp(-22*mod(t,0.62))+0.6*sin(2*PI*48*mod(t-0.18,0.62))*exp(-22*mod(t-0.18,0.62))*gte(t,0.18))"
                     f"*(0.4+0.6*t/{d_lat:.2f})':s=44100:d={d_lat:.3f},volume=0.2", m["diez"]))
    # Silencio: queda solo el viento
    d_vi = ini["regla4"] - m["calla"]
    f.append(("vie", f"anoisesrc=color=pink:amplitude=0.5:d={d_vi:.3f},highpass=f=150,lowpass=f=700,"
                     f"volume='0.35*(0.6+0.4*sin(2*PI*0.3*t))':eval=frame,afade=t=in:d=1,afade=t=out:st={d_vi - 0.6:.2f}:d=0.6", m["calla"]))
    # Las cabezas giran: golpe grave y un zumbido que crece
    f.append(("gir", f"{golpe},volume=0.2", m["giran"] - 0.35))
    d_zu = ini["regla4"] - (m["giran"] - 0.35)
    f.append(("zum", f"aevalsrc='0.05*sin(2*PI*55*t)*(0.3+0.7*t/{d_zu:.2f})+0.025*sin(2*PI*82.5*t)':s=44100:d={d_zu:.3f},"
                     f"afade=t=out:st={d_zu - 0.4:.2f}:d=0.4", m["giran"] - 0.35))
    # Memo escribe: el celular vibra
    f.append(("vb1", vibra, ini["memo"] + 0.3))
    f.append(("vb2", vibra, m["memo"]))
    f.append(("fin", f"{golpe},volume=0.25", ini["parte6"]))

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
