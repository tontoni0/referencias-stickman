"""Mezcla el audio de la temporada 2, parte 2 (La puerta): voz, los tres toques, la alerta que sigue sonando y se calla
de golpe, el gruñido de Chispa, el recuerdo de la mordida en la azotea, el tronido del cuello de Memo, los latidos,
los pasos de los infectados que regresan, los golpes de Memo en la puerta con su eco en el edificio y el cierre.

Uso: python3 -I mezcla.py tl.js ../audio/t2parte2/narracion.mp3 salida.m4a
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
    tocs = [0.25, 0.85, 1.45]
    snap = m["voltea"] - 0.05
    corte = m["calla"] + 0.32
    golpes = []
    x = m["golpeaM"] - 0.15
    while x < ini["dilema"] - 0.3:
        golpes.append(x)
        x += 0.62

    golpe = "aevalsrc='0.9*sin(2*PI*(42+40*exp(-9*t))*t)*exp(-2.6*t)':s=44100:d=2"
    clic = "aevalsrc='0.4*(2*random(0)-1)*exp(-120*t)':s=44100:d=0.08,highpass=f=2000"
    toc = "aevalsrc='0.8*sin(2*PI*150*t)*exp(-38*t)+0.35*(2*random(0)-1)*exp(-90*t)':s=44100:d=0.35,lowpass=f=1500"
    pum = "aevalsrc='0.9*sin(2*PI*(60+50*exp(-30*t))*t)*exp(-14*t)+0.4*(2*random(0)-1)*exp(-60*t)':s=44100:d=0.6,lowpass=f=900"
    fase = "2*PI*700*t-500*cos(PI*t)"
    sirena = f"aevalsrc='0.5*sin({fase})+0.15*sin(3*({fase}))':s=44100:d={{d:.3f}},lowpass=f=2800,aecho=0.8:0.6:120:0.35"

    def ruido(etiqueta, d, color, filtros, t0):
        f.append((etiqueta, f"anoisesrc=color={color}:amplitude=0.8:d={d:.3f},{filtros}", t0))

    def acorde(etiqueta, t0, t1, vol, notas="220,277.2,329.6"):
        d = t1 - t0
        suma = "+".join(f"sin(2*PI*{n}*t)" for n in notas.split(","))
        f.append((etiqueta, f"aevalsrc='{vol}*({suma})*min(1,t/1.0)':s=44100:d={d:.3f},afade=t=out:st={max(0.1, d - 1):.2f}:d=1", t0))

    def latidos(etiqueta, t0, t1, vol, periodo=0.85):
        d = t1 - t0
        f.append((etiqueta, f"aevalsrc='{vol}*sin(2*PI*52*t)*(exp(-28*mod(t,{periodo}))+0.7*exp(-28*mod(t+{periodo - 0.22:.2f},{periodo})))':s=44100:d={d:.3f},"
                            f"lowpass=f=180,afade=t=in:d=0.4,afade=t=out:st={d - 0.4:.2f}:d=0.4", t0))

    def grunido(etiqueta, t0, t1, vol):
        d = t1 - t0
        ruido(etiqueta, d, "brown", f"lowpass=f=300,volume='{vol}*(0.5+0.5*sin(2*PI*23*t))':eval=frame,afade=t=in:d=0.2,afade=t=out:st={d - 0.3:.2f}:d=0.3", t0)

    f = []  # (etiqueta, filtro, inicio)
    # Ambiente: se apaga un segundo cuando la alerta se calla
    f.append(("amb", f"anoisesrc=color=brown:amplitude=0.6:d={corte:.3f},lowpass=f=160,volume=0.12", 0))
    f.append(("amb2", f"anoisesrc=color=brown:amplitude=0.6:d={dur - corte - 1.2:.3f},lowpass=f=160,volume=0.12,afade=t=in:d=1.5", corte + 1.2))
    # La alerta de Evelin sigue sonando (se oye desde adentro) hasta que se calla de golpe
    f.append(("sir", sirena.format(d=corte) + ",lowpass=f=1600,volume=0.07,afade=t=in:d=0.3", 0))
    f.append(("sir2", sirena.format(d=corte - ini["calla"]) + ",volume=0.05", ini["calla"]))
    # 1. Tres toques despacio y Chispa gruñe
    for k, t0 in enumerate(tocs):
        f.append((f"toc{k}", f"{toc},volume=0.9", t0))
    grunido("gr1", 0.3, ini["mirilla"], 0.18)
    # 2. La mirilla
    f.append(("mir", f"{clic},volume=0.5", ini["mirilla"] + 0.05))
    latidos("lat1", ini["mirilla"], fin["brazo"], 0.14)
    # 3. El brazo: una nota aguda cuando el gris llega a la muñeca
    f.append(("sti", "aevalsrc='0.05*(sin(2*PI*740*t)+sin(2*PI*784*t)+sin(2*PI*1046.5*t))*exp(-2.5*t)':s=44100:d=2", m["muneca"]))
    # 4. La azotea: gemidos, la mordida y un grito corto
    d_az = fin["azotea"] - ini["azotea"]
    ruido("gem", d_az, "pink", f"bandpass=f=320:width_type=h:w=200,volume='0.25*(0.5+0.5*sin(2*PI*1.7*t))':eval=frame,afade=t=in:d=0.2,afade=t=out:st={d_az - 0.3:.2f}:d=0.3", ini["azotea"])
    ruido("mor", 0.25, "white", "lowpass=f=2500,afade=t=out:st=0.05:d=0.2,volume=0.5", m["mordieron"])
    ruido("gri", 0.9, "white", "bandpass=f=1100:width_type=h:w=600,volume='0.16*(0.6+0.4*sin(2*PI*9*t))':eval=frame,lowpass=f=1500,afade=t=out:st=0.4:d=0.5", m["mordieron"] + 0.05)
    # 5. Memo susurra del otro lado de la puerta
    d_su = m["nieta"] + 0.6 - m["susurra"]
    ruido("sus", d_su, "pink", f"highpass=f=2500,volume='0.05*(0.4+0.6*abs(sin(2*PI*2.3*t)))':eval=frame,afade=t=in:d=0.3,afade=t=out:st={d_su - 0.3:.2f}:d=0.3", m["susurra"])
    # 6. Rosa: acorde suave
    acorde("ros", ini["rosa"], fin["rosa"] + 0.5, 0.012, "196,246.9,293.7")
    # 7. Chispa gruñe y la cabeza de Memo truena al voltear
    grunido("gr2", ini["grune"], snap + 0.3, 0.22)
    f.append(("cue", "aevalsrc='0.5*(2*random(0)-1)*exp(-70*t)+0.6*sin(2*PI*90*t)*exp(-25*t)':s=44100:d=0.25,lowpass=f=3000,volume=0.4", snap))
    f.append(("sti2", "aevalsrc='0.05*(sin(2*PI*622*t)+sin(2*PI*659*t)+sin(2*PI*932*t))*exp(-2*t)':s=44100:d=2.2", snap + 0.02))
    # 8. Memo se tapa la cara: un zumbido que sube y latidos
    d_ta = fin["tapa"] - ini["tapa"]
    f.append(("zum", f"aevalsrc='0.02*sin(2*PI*(55+25*t/{d_ta:.2f})*t)+0.015*sin(2*PI*(58+27*t/{d_ta:.2f})*t)':s=44100:d={d_ta:.3f},afade=t=in:d=0.5,afade=t=out:st={d_ta - 0.2:.2f}:d=0.2", ini["tapa"]))
    latidos("lat2", ini["tapa"], corte, 0.12, 0.75)
    # 9. La alerta se calla: un golpe sordo justo en el corte y luego nada
    f.append(("g1", f"{golpe},volume=0.1", corte))
    # 10. Pasos que regresan de los postes: muchos, arrastrados
    d_pa = fin["pasos"] - ini["pasos"] + 0.4
    f.append(("pas", f"aevalsrc='0.5*(2*random(0)-1)*(0.5+0.5*sin(2*PI*3.1*t))*(0.5+0.5*sin(2*PI*4.3*t+1))*min(1,t/2)':s=44100:d={d_pa:.3f},bandpass=f=500:width_type=h:w=500,afade=t=out:st={d_pa - 0.5:.2f}:d=0.5,volume=0.7", ini["pasos"]))
    ruido("gem2", d_pa, "pink", f"bandpass=f=280:width_type=h:w=160,volume='0.3*(0.5+0.5*sin(2*PI*1.3*t))*min(1,t/2)':eval=frame,afade=t=out:st={d_pa - 0.5:.2f}:d=0.5", ini["pasos"])
    # 11 y 12. Los golpes de Memo en la puerta, con eco en el edificio
    for k, t0 in enumerate(golpes):
        f.append((f"pum{k}", f"{pum},aecho=0.8:0.5:180|360:0.35|0.2,volume=0.55", t0))
    latidos("lat3", ini["golpea"], fin["dilema"], 0.16, 0.6)
    # 13. El dilema: tensión baja
    d_di = fin["dilema"] - ini["dilema"]
    f.append(("ten", f"aevalsrc='0.025*sin(2*PI*49*t)+0.02*sin(2*PI*51.5*t)':s=44100:d={d_di:.3f},afade=t=in:d=0.6,afade=t=out:st={d_di - 0.4:.2f}:d=0.4", ini["dilema"]))
    # 14. La decisión
    f.append(("g2", f"{golpe},volume=0.08", ini["decide"]))
    f.append(("g3", f"{golpe},volume=0.07", m["comenta"]))

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
