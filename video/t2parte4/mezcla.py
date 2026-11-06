"""Mezcla el audio de la temporada 2, parte 4 (Los escombros): voz, campanita del voto, latidos, el reloj de la tienda,
la segunda alerta de Evelin, los aullidos de Chispa, el recuerdo de los escombros (sirena lejana, polvo, la losa y el
aullido de cachorra), el silbido, la cuenta regresiva, el salto sobre el mostrador, el corte, el gemido bajo tu mano,
los pasos de los que regresan, el retumbe del túnel y los golpes del cierre.

Uso: python3 -I mezcla.py tl.js ../audio/t2parte4/narracion.mp3 salida.m4a
"""
import json
import subprocess
import sys


def lee_tl(ruta):
    texto = open(ruta).read()
    return json.loads(texto[texto.index("{"): texto.rindex("}") + 1])


def aullido(d, periodo=2.8, largo=2.3, tono=480):
    """Aullidos repetidos (como en la parte 5 de la temporada 1): sube y baja de tono con vibrato."""
    u = f"mod(t,{periodo})"
    fase = (f"(2*PI*{tono}*{u}-{tono * 0.92:.0f}*{largo}*cos(PI*min({u},{largo})/{largo})"
            f"-(9/6)*cos(2*PI*6*{u}))")
    env = f"(min(1,{u}/0.25)*min(1,max(0,{largo}-{u})/0.6))"
    return (f"aevalsrc='0.3*{env}*(sin({fase})+0.35*sin(2*{fase})+0.12*sin(3*{fase}))':s=44100:d={d:.3f},"
            f"lowpass=f=2500")


def main(tl_js, voz, salida):
    tl = lee_tl(tl_js)
    m = tl["marcas"]
    ini = {e["id"]: e["inicio"] for e in tl["escenas"]}
    dur = tl["duracion"]
    fin = {e["id"]: (tl["escenas"][i + 1]["inicio"] if i + 1 < len(tl["escenas"]) else dur) for i, e in enumerate(tl["escenas"])}
    # Igual que en escenas.js
    alerta = m["vuelve"] - 0.1
    corte = m["calla"] + 0.25
    silbido = m["silbas"] + 0.05
    salta = m["salta"] + 0.25
    # Los segundos del reloj: 0:05 en "cinco", 0:04 en "cuatro" y de ahí a 0:00 parejo hasta el corte
    tics = [m["cinco"], m["cuatro"]] + [m["cuatro"] + k * (corte - m["cuatro"]) / 4 for k in (1, 2, 3)]

    golpe = "aevalsrc='0.9*sin(2*PI*(42+40*exp(-9*t))*t)*exp(-2.6*t)':s=44100:d=2"
    clic = "aevalsrc='0.4*(2*random(0)-1)*exp(-120*t)':s=44100:d=0.08,highpass=f=2000"
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

    def gemidos(etiqueta, t0, t1, vol):
        d = t1 - t0
        ruido(etiqueta, d, "pink", f"bandpass=f=290:width_type=h:w=170,volume='{vol}*(0.5+0.5*sin(2*PI*1.3*t))':eval=frame,afade=t=in:d=0.4,afade=t=out:st={d - 0.4:.2f}:d=0.4", t0)

    f = []  # (etiqueta, filtro, inicio)
    f.append(("amb", f"anoisesrc=color=brown:amplitude=0.6:d={dur},lowpass=f=160,volume=0.12", 0))
    # 1. El voto
    f.append(("cam", "aevalsrc='0.07*(sin(2*PI*880*t)+0.6*sin(2*PI*1318.5*t)+0.4*sin(2*PI*1760*t))*exp(-3*t)':s=44100:d=1.5", 0.1))
    # 2. Detrás del mostrador: latidos y ellos afuera
    latidos("lat1", ini["mostrador"], alerta, 0.12)
    gemidos("gem1", ini["mostrador"], ini["minutos"] + 0.5, 0.15)
    # 3. El reloj de la pared corre
    d_mi = ini["suena"] - ini["minutos"]
    f.append(("tic", f"aevalsrc='0.3*(2*random(0)-1)*exp(-150*mod(t,0.22))':s=44100:d={d_mi:.3f},highpass=f=2500,volume=0.3", ini["minutos"]))
    # 4 y 5. La alerta vuelve a sonar; ellos corren; Chispa aúlla
    f.append(("sir", sirena.format(d=ini["recuerdo"] - alerta) + f",volume=0.09,afade=t=in:d=0.15,afade=t=out:st={ini['recuerdo'] - alerta - 0.4:.2f}:d=0.4", alerta))
    d_co = ini["aulla"] + 1 - (alerta + 0.3)
    f.append(("cor", f"aevalsrc='0.4*(2*random(0)-1)*(0.5+0.5*sin(2*PI*4.1*t))*(0.5+0.5*sin(2*PI*5.3*t+1))':s=44100:d={d_co:.3f},bandpass=f=450:width_type=h:w=400,afade=t=out:st={d_co - 0.4:.2f}:d=0.4,volume=0.35", alerta + 0.3))
    d_au = ini["recuerdo"] - (m["aulla"] - 0.1)
    f.append(("aul", f"{aullido(d_au)},volume=0.17,afade=t=out:st={d_au - 0.5:.2f}:d=0.5", m["aulla"] - 0.1))
    # 6 y 7. Recuerdo: sirena lejana, polvo, la losa y el aullido de cachorra
    d_re = ini["silbas"] - ini["recuerdo"]
    f.append(("sir2", sirena.format(d=d_re) + f",lowpass=f=900,volume=0.05,afade=t=in:d=0.4,afade=t=out:st={d_re - 0.4:.2f}:d=0.4", ini["recuerdo"]))
    ruido("pol", d_re, "pink", f"lowpass=f=600,volume=0.12,afade=t=in:d=0.6,afade=t=out:st={d_re - 0.5:.2f}:d=0.5", ini["recuerdo"])
    ruido("los", 1.2, "brown", "lowpass=f=500,volume='0.5*(0.5+0.5*sin(2*PI*14*t))':eval=frame,afade=t=out:st=0.8:d=0.4", m["losa"] - 0.1)
    d_cc = ini["silbas"] - m["aullaba"] + 0.3
    f.append(("cac", f"{aullido(d_cc, 2.2, 1.8, 760)},volume=0.15,afade=t=out:st={d_cc - 0.4:.2f}:d=0.4", m["aullaba"] - 0.3))
    acorde("rec", ini["recuerdo"], ini["silbas"] + 0.3, 0.012, "196,246.9,293.7")
    # 8. La alerta sigue; Chispa aúlla hasta que silbas; el silbido; corre hacia ti
    f.append(("sir3", sirena.format(d=corte - ini["silbas"]) + ",volume=0.07,afade=t=in:d=0.2", ini["silbas"]))
    d_a2 = silbido + 0.3 - ini["silbas"]
    f.append(("aul2", f"{aullido(d_a2 + 0.6)},volume=0.2,afade=t=out:st={d_a2:.2f}:d=0.4", ini["silbas"]))
    f.append(("fiu", "aevalsrc='0.08*sin(2*PI*(1700*t+700*t*t))*min(1,t/0.05)*min(1,(0.7-t)/0.1)':s=44100:d=0.7", silbido))
    d_pa = salta - silbido
    f.append(("pat", f"aevalsrc='0.3*(2*random(0)-1)*exp(-60*mod(t,0.13))':s=44100:d={d_pa:.3f},bandpass=f=1200:width_type=h:w=1500,volume=0.25", silbido + 0.3))
    latidos("lat2", ini["silbas"], ini["regresan"], 0.1, 0.55)
    # 9. La cuenta regresiva y el salto
    for k, t0 in enumerate(tics):
        f.append((f"tc{k}", f"{clic},volume=0.6", t0))
    ruido("sal", 0.5, "pink", "bandpass=f=900:width_type=h:w=900,afade=t=in:d=0.2,afade=t=out:st=0.25:d=0.25,volume=0.3", salta - 0.35)
    f.append(("ate", "aevalsrc='0.5*sin(2*PI*90*t)*exp(-25*t)':s=44100:d=0.3,volume=0.5", salta + 0.4))
    # 10. Se calla: un golpe sordo, silencio y el gemido bajo tu mano
    f.append(("g1", f"{golpe},volume=0.1", corte))
    f.append(("gim", "aevalsrc='0.03*sin(2*PI*(600*t+150*t*t)+2*sin(2*PI*7*t))*sin(PI*t/0.9)':s=44100:d=0.9,lowpass=f=900", m["tapas"] + 0.2))
    # 11. Los que regresan del poste
    d_rg = fin["regresan"] - ini["regresan"]
    f.append(("reg", f"aevalsrc='0.4*(2*random(0)-1)*(0.5+0.5*sin(2*PI*2.7*t))*(0.5+0.5*sin(2*PI*3.9*t+1))':s=44100:d={d_rg:.3f},bandpass=f=420:width_type=h:w=350,afade=t=in:d=0.4,afade=t=out:st={d_rg - 0.5:.2f}:d=0.5,volume=0.3", ini["regresan"]))
    gemidos("gem2", ini["regresan"], fin["regresan"], 0.18)
    f.append(("sti", "aevalsrc='0.04*(sin(2*PI*622*t)+sin(2*PI*659*t)+sin(2*PI*932*t))*exp(-2*t)':s=44100:d=2.2", m["novolver"]))
    # 12 y 13. La salida y el túnel: un zumbido grave y el retumbe de abajo
    d_sa = ini["decide"] - ini["salida"]
    f.append(("dro", f"aevalsrc='0.025*sin(2*PI*55*t)+0.02*sin(2*PI*58.3*t)':s=44100:d={d_sa:.3f},afade=t=in:d=0.6,afade=t=out:st={d_sa - 0.5:.2f}:d=0.5", ini["salida"]))
    d_tu = ini["decide"] - ini["tunel"] + 0.5
    ruido("ret", d_tu, "brown", f"lowpass=f=120,volume='0.35*(0.6+0.4*sin(2*PI*0.5*t))':eval=frame,afade=t=in:d=0.5,afade=t=out:st={d_tu - 0.5:.2f}:d=0.5", ini["tunel"])
    # 14. La decisión
    f.append(("g2", f"{golpe},volume=0.05", ini["decide"]))
    f.append(("g3", f"{golpe},volume=0.04", m["comenta"]))

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
