"""Mezcla el audio de la parte 8 (final): voz, campanita del voto, la ventana y el seguro, el gemido feliz de Chispa,
un acorde de alivio, el grito que se apaga, el llavero que cae y pega en el patio, el cerillo, la estática del radio,
la sirena del recuerdo, el golpe agudo de "no la activé", la alerta que vuelve a sonar, el clic de la lámpara y el cierre.

Uso: python3 -I mezcla.py tl.js ../audio/parte8/narracion.mp3 salida.m4a
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
    llaves_piso = ini["patio"] + 0.45
    cerillo = ini["vela"] + 0.25

    golpe = "aevalsrc='0.9*sin(2*PI*(42+40*exp(-9*t))*t)*exp(-2.6*t)':s=44100:d=2"
    clic = "aevalsrc='0.4*(2*random(0)-1)*exp(-120*t)':s=44100:d=0.08,highpass=f=2000"
    llaves = "aevalsrc='0.12*(2*random(0)-1)*lt(mod(t*9,1),0.12)*(sin(2*PI*4200*t)+sin(2*PI*5600*t))*exp(-2*t)':s=44100:d=1.2,highpass=f=3000"
    fase = "2*PI*700*t-500*cos(PI*t)"
    sirena = f"aevalsrc='0.5*sin({fase})+0.15*sin(3*({fase}))':s=44100:d={{d:.3f}},lowpass=f=2800,aecho=0.8:0.6:120:0.35"

    def ruido(etiqueta, d, color, filtros, t0):
        f.append((etiqueta, f"anoisesrc=color={color}:amplitude=0.8:d={d:.3f},{filtros}", t0))

    def acorde(etiqueta, t0, t1, vol, notas="220,277.2,329.6"):
        d = t1 - t0
        suma = "+".join(f"sin(2*PI*{n}*t)" for n in notas.split(","))
        f.append((etiqueta, f"aevalsrc='{vol}*({suma})*min(1,t/1.0)':s=44100:d={d:.3f},afade=t=out:st={max(0.1, d - 1):.2f}:d=1", t0))

    f = []  # (etiqueta, filtro, inicio)
    f.append(("amb", f"anoisesrc=color=brown:amplitude=0.6:d={dur},lowpass=f=160,volume=0.12", 0))
    # 1. El voto
    f.append(("cam", "aevalsrc='0.07*(sin(2*PI*880*t)+0.6*sin(2*PI*1318.5*t)+0.4*sin(2*PI*1760*t))*exp(-3*t)':s=44100:d=1.5", 0.1))
    # 2. La ventana baja y el seguro
    ruido("ven", 0.6, "pink", "bandpass=f=700:width_type=h:w=600,afade=t=in:d=0.2,afade=t=out:st=0.3:d=0.3,volume=0.4", m["cierraV"] - 0.1)
    f.append(("seg", f"{clic},volume=0.6", m["cierraV"] + 0.45))
    # 3. Chispa: un gemido feliz y un acorde de alivio
    f.append(("gim", "aevalsrc='0.05*sin(2*PI*(700*t+300*t*t)+2*sin(2*PI*8*t))*sin(PI*t/0.8)':s=44100:d=0.8", m["lameM"]))
    acorde("ali", ini["lame"], ini["cae"], 0.02)
    # 4. El grito de Memo que se apaga y el llavero que cae
    ruido("gri", 1.2, "white", "bandpass=f=1100:width_type=h:w=600,volume='0.18*(0.6+0.4*sin(2*PI*9*t))':eval=frame,lowpass=f=1500,afade=t=out:st=0.6:d=0.6", m["apagan"] - 1.0)
    d_ca = m["llavero"] + 0.5 - m["cayendo"]
    ruido("whi", d_ca, "pink", f"bandpass=f=900:width_type=h:w=1200,volume='0.25*t/{d_ca:.2f}':eval=frame,afade=t=out:st={d_ca - 0.3:.2f}:d=0.3", m["cayendo"] + 0.15)
    # 5. El llavero pega en el patio; gruñidos
    f.append(("pis", llaves, llaves_piso))
    f.append(("pis2", f"{clic},volume=0.5", llaves_piso))
    d_gr = fin["patio"] - llaves_piso
    ruido("gru", d_gr, "brown", f"lowpass=f=260,volume='0.3*(0.5+0.5*sin(2*PI*23*t))':eval=frame,afade=t=in:d=0.4,afade=t=out:st={d_gr - 0.4:.2f}:d=0.4", llaves_piso + 0.2)
    # 6. El cerillo
    ruido("cer", 0.5, "white", "highpass=f=2500,afade=t=out:st=0:d=0.5,volume=0.3", cerillo)
    acorde("cal", ini["vela"] + 0.5, ini["mesa"], 0.015, "196,246.9,293.7")
    # 8 a 10. Estática del radio y la perilla
    d_es = fin["libreta"] - ini["mesa"]
    ruido("est", d_es, "white", f"bandpass=f=3000:width_type=h:w=2500,volume='0.05*(0.5+0.5*sin(2*PI*0.7*t))':eval=frame,afade=t=in:d=0.5,afade=t=out:st={d_es - 0.5:.2f}:d=0.5", ini["mesa"])
    for k in range(3):
        f.append((f"per{k}", f"{clic},volume=0.4", m["sonar"] + k * 0.22))
    # 11. Recuerdo: la sirena lejana y apagada
    d_re = fin["rato"] - ini["rato"]
    f.append(("rec", sirena.format(d=d_re) + f",lowpass=f=900,volume=0.06,afade=t=in:d=0.3,afade=t=out:st={d_re - 0.4:.2f}:d=0.4", ini["rato"]))
    # 12 y 13. Acorde suave; tensión que sube; golpe agudo en "no la activé"
    acorde("gra", ini["gracias"], ini["primera"], 0.015)
    d_pr = ini["suena"] - ini["primera"]
    f.append(("ten", f"aevalsrc='0.03*sin(2*PI*(55+20*t/{d_pr:.2f})*t)+0.02*sin(2*PI*(58.3+21*t/{d_pr:.2f})*t)':s=44100:d={d_pr:.3f},afade=t=out:st={d_pr - 0.2:.2f}:d=0.2", ini["primera"]))
    f.append(("sti", "aevalsrc='0.05*(sin(2*PI*740*t)+sin(2*PI*784*t)+sin(2*PI*1046.5*t))*exp(-2.5*t)':s=44100:d=2", m["noactive"]))
    # 14 a 16. La alerta vuelve a sonar hasta el final; estática del radio; la lámpara; golpes de cierre
    d_si = dur - (m["suenaM"] - 0.4)
    f.append(("sir", sirena.format(d=d_si) + f",volume=0.1,afade=t=in:d=0.2,afade=t=out:st={d_si - 1.2:.2f}:d=1.2", m["suenaM"] - 0.4))
    ruido("es2", 2.0, "white", "bandpass=f=2500:width_type=h:w=2500,volume=0.06,afade=t=out:st=1:d=1", m["suenaM"])
    f.append(("lam", f"{clic},volume=0.5", m["prende"] + 0.1))
    f.append(("g1", f"{golpe},volume=0.1", ini["sospechosos"]))
    f.append(("g2", f"{golpe},volume=0.12", m["temporada"]))

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
