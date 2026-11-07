"""Mezcla el audio de la temporada 2, parte 8 (Noventa segundos): voz, campanita del voto, viento de la azotea, el
susurro, los pasos de Memo, el recuerdo de la primera noche (zumbido de la sala, el botón, la alerta en una zona y
luego en todas, la ciudad), la pluma del plan, la primera alerta y la estampida, el puente lleno, el aullido de Chispa
con eco, la última alerta, el forcejeo de Memo y Evelin, el jalón de Chispa y los golpes del cierre.

Uso: python3 -I mezcla.py tl.js ../audio/t2parte8/narracion.mp3 salida.m4a
"""
import json
import subprocess
import sys


def lee_tl(ruta):
    texto = open(ruta).read()
    return json.loads(texto[texto.index("{"): texto.rindex("}") + 1])


def aullido(d, periodo=2.8, largo=2.3, tono=480):
    """Aullidos repetidos (como en la temporada 2, parte 4): sube y baja de tono con vibrato."""
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
    # Igual que en escenas.js
    prueba = m["prueba"] + 0.1
    todas = m["tomo"]
    alerta1 = m["primeraM"] - 0.1
    aullido_t = m["aullaM"] - 0.05
    boton = m["boton"] + 0.25
    alerta2 = m["suena"] - 0.05
    agarra = m["agarraM"] + 0.1
    ojos = m["ojos"] + 0.1

    golpe = "aevalsrc='0.9*sin(2*PI*(42+40*exp(-9*t))*t)*exp(-2.6*t)':s=44100:d=2"
    sti = "aevalsrc='0.045*(sin(2*PI*622*t)+sin(2*PI*659*t)+sin(2*PI*932*t))*exp(-2*t)':s=44100:d=2.2"
    fase = "2*PI*700*t-500*cos(PI*t)"
    sirena = f"aevalsrc='0.5*sin({fase})+0.15*sin(3*({fase}))':s=44100:d={{d:.3f}},lowpass=f=2800,aecho=0.8:0.6:120:0.35"

    def ruido(etiqueta, d, color, filtros, t0):
        f.append((etiqueta, f"anoisesrc=color={color}:amplitude=0.8:d={d:.3f},{filtros}", t0))

    def latidos(etiqueta, t0, t1, vol, periodo=0.85):
        d = t1 - t0
        f.append((etiqueta, f"aevalsrc='{vol}*sin(2*PI*52*t)*(exp(-28*mod(t,{periodo}))+0.7*exp(-28*mod(t+{periodo - 0.22:.2f},{periodo})))':s=44100:d={d:.3f},"
                            f"lowpass=f=180,afade=t=in:d=0.4,afade=t=out:st={d - 0.3:.2f}:d=0.3", t0))

    def pasos(etiqueta, t0, d, vol, periodo=0.26, f0=900):
        f.append((etiqueta, f"aevalsrc='0.4*(2*random(0)-1)*exp(-45*mod(t,{periodo}))':s=44100:d={d:.3f},bandpass=f={f0}:width_type=h:w=1200,"
                            f"volume={vol},afade=t=in:d=0.2,afade=t=out:st={d - 0.3:.2f}:d=0.3", t0))

    def estampida(etiqueta, t0, d, vol):
        f.append((etiqueta, f"aevalsrc='0.5*(2*random(0)-1)*(0.5+0.5*sin(2*PI*6.3*t))*(0.5+0.5*sin(2*PI*7.7*t+1))':s=44100:d={d:.3f},"
                            f"bandpass=f=500:width_type=h:w=500,afade=t=in:d=0.3,afade=t=out:st={d - 0.4:.2f}:d=0.4,volume={vol}", t0))

    def pluma(etiqueta, t0, d):
        ruido(etiqueta, d, "pink", f"bandpass=f=3200:width_type=h:w=2500,volume='0.08*(0.5+0.5*sin(2*PI*11*t))':eval=frame,afade=t=out:st={d - 0.1:.2f}:d=0.1", t0)

    f = []  # (etiqueta, filtro, inicio)
    # 1. El voto
    f.append(("cam", "aevalsrc='0.07*(sin(2*PI*880*t)+0.6*sin(2*PI*1318.5*t)+0.4*sin(2*PI*1760*t))*exp(-3*t)':s=44100:d=1.5", 0.1))
    # 2 a 4. La azotea: viento, el susurro, los pasos de Memo y una tensión baja
    d_az = ini["prueba"] - ini["cuentas"]
    ruido("vie", d_az, "pink", f"lowpass=f=600,volume='0.08*(0.6+0.4*sin(2*PI*0.3*t))':eval=frame,afade=t=in:d=0.4,afade=t=out:st={d_az - 0.6:.2f}:d=0.6", ini["cuentas"])
    ruido("pss", 0.6, "pink", "highpass=f=3000,afade=t=in:d=0.05,afade=t=out:st=0.3:d=0.3,volume=0.1", m["tinaco"] - 0.1)
    pasos("pme", ini["rinde"] + 0.05, 1.1, 0.12, 0.45, 700)
    f.append(("sti1", sti, m["rindo"] - 0.05))
    d_tn = ini["prueba"] - ini["rinde"]
    f.append(("ten", f"aevalsrc='0.02*sin(2*PI*55*t)+0.016*sin(2*PI*58.3*t)':s=44100:d={d_tn:.3f},afade=t=in:d=0.6,afade=t=out:st={d_tn - 0.6:.2f}:d=0.6", ini["rinde"]))
    ruido("rec", 0.8, "pink", "bandpass=f=1200:width_type=h:w=1600,afade=t=in:d=0.4,afade=t=out:st=0.4:d=0.4,volume=0.25", ini["prueba"] - 0.4)
    # 5 a 7. El recuerdo: la sala, el botón, la alerta en una zona y luego en todas, la ciudad
    d_sa = ini["patios"] - ini["prueba"]
    f.append(("hum", f"aevalsrc='0.025*(sin(2*PI*60*t)+0.5*sin(2*PI*120*t))':s=44100:d={d_sa:.3f},afade=t=in:d=0.3,afade=t=out:st={d_sa - 0.4:.2f}:d=0.4", ini["prueba"]))
    f.append(("bip", "aevalsrc='0.06*sin(2*PI*1320*t)*lt(t,0.12)':s=44100:d=0.15", prueba))
    d_s1 = todas - prueba
    f.append(("sr1", sirena.format(d=d_s1) + f",lowpass=f=900,volume=0.035,afade=t=in:d=0.2,afade=t=out:st={d_s1 - 0.2:.2f}:d=0.2", prueba + 0.1))
    d_s2 = ini["plan"] - todas
    f.append(("sr2", sirena.format(d=d_s2) + f",volume=0.07,afade=t=in:d=0.1,afade=t=out:st={d_s2 - 0.8:.2f}:d=0.8", todas))
    f.append(("g1", f"{golpe},volume=0.1", todas))
    f.append(("sti2", sti, m["coord"]))
    d_ci = ini["plan"] - ini["patios"]
    ruido("ciu", d_ci, "pink", f"bandpass=f=400:width_type=h:w=300,volume='0.25*min(1,t/1.5)':eval=frame,afade=t=out:st={d_ci - 0.5:.2f}:d=0.5", ini["patios"])
    # 8. El plan: la pluma
    for k, (t0, d) in enumerate([(ini["plan"] + 0.05, 0.5), (m["noventa"], 0.8), (m["zona"], max(0.5, m["rosa"] - m["zona"] + 0.2)), (m["rosa"] - 0.1, 0.4)]):
        pluma(f"plu{k}", t0, d)
    # 9. Primera alerta: la sirena, la estampida hacia el poste y ustedes corriendo
    d_a1 = ini["puente"] + 0.6 - alerta1
    f.append(("al1", sirena.format(d=d_a1) + f",volume=0.11,afade=t=in:d=0.15,afade=t=out:st={d_a1 - 0.8:.2f}:d=0.8", alerta1))
    estampida("es1", m["corren"] - 0.3, ini["puente"] - m["corren"] + 0.3, 0.4)
    pasos("cor1", m["pasan"] - 0.6, ini["puente"] - m["pasan"] + 0.6, 0.12, 0.22)
    # 10. Bajo el puente: la respiración de cientos, latidos y una nota en "lleno"
    d_pu = aullido_t - ini["puente"]
    ruido("res", d_pu, "pink", f"bandpass=f=240:width_type=h:w=120,volume='0.15*(0.55+0.45*sin(2*PI*0.4*t))':eval=frame,afade=t=in:d=0.8,afade=t=out:st={d_pu - 0.1:.2f}:d=0.1", ini["puente"])
    latidos("lat1", ini["puente"], aullido_t, 0.1, 0.65)
    f.append(("sti3", sti, m["lleno"]))
    # 11 y 12. Le quitas los audífonos; Chispa aúlla con eco; la estampida tras ella; patitas de regreso
    ruido("qui", 0.5, "pink", "highpass=f=1500,afade=t=in:d=0.15,afade=t=out:st=0.25:d=0.25,volume=0.12", m["quitas"] + 0.1)
    d_au = ini["ultima"] - aullido_t
    f.append(("aul", f"{aullido(d_au, 2.6, 2.2)},aecho=0.8:0.7:300|600:0.45|0.3,volume=0.25,afade=t=out:st={d_au - 0.5:.2f}:d=0.5", aullido_t))
    estampida("es2", m["lleva"] - 0.2, ini["ultima"] - m["lleva"], 0.24)
    f.append(("pat", f"aevalsrc='0.3*(2*random(0)-1)*exp(-60*mod(t,0.13))':s=44100:d=1.4,bandpass=f=1200:width_type=h:w=1500,volume=0.22", m["regresaM"] - 0.3))
    # 13. Última zona: el botón y la alerta, que sigue hasta el final
    f.append(("bt", "aevalsrc='0.4*(2*random(0)-1)*exp(-120*t)':s=44100:d=0.08,highpass=f=2000,volume=0.6", boton))
    d_a2 = ini["decide"] + 0.4 - alerta2
    f.append(("al2", sirena.format(d=d_a2) + f",volume=0.075,afade=t=in:d=0.15,afade=t=out:st={d_a2 - 0.6:.2f}:d=0.6", alerta2))
    # 14. Memo la agarra: un golpe, un forcejeo y el arrastre
    f.append(("sti4", sti, m["yaNo"]))
    f.append(("g2", f"{golpe},volume=0.12", agarra))
    ruido("for", 0.7, "pink", "bandpass=f=900:width_type=h:w=1200,afade=t=in:d=0.05,afade=t=out:st=0.3:d=0.4,volume=0.3", agarra)
    d_ar = ini["jala"] - m["seLleva"]
    ruido("arr", d_ar, "brown", f"bandpass=f=600:width_type=h:w=500,volume='0.25*(0.5+0.5*sin(2*PI*2.2*t))':eval=frame,afade=t=in:d=0.3,afade=t=out:st={d_ar - 0.3:.2f}:d=0.3", m["seLleva"])
    latidos("lat2", agarra, ini["decide"], 0.09, 0.55)
    # 15 y 16. La alerta jala a Chispa: un soplido, la nota de los ojos blancos y la estampida al poste
    ruido("whj", 0.5, "pink", "bandpass=f=900:width_type=h:w=1200,afade=t=in:d=0.15,afade=t=out:st=0.2:d=0.3,volume=0.3", m["jalaM"])
    f.append(("sti5", sti, ojos))
    estampida("es3", m["correPoste"] - 0.2, ini["decide"] - m["correPoste"] + 0.5, 0.32)
    # 17. La decisión
    f.append(("g3", f"{golpe},volume=0.05", ini["decide"]))
    f.append(("g4", f"{golpe},volume=0.04", m["comenta"]))

    filtros = [f"[0:a]adelay={int(tl['intro'] * 1000)}:all=1[voz]"]
    etiquetas = ["[voz]"]
    for nombre, src, t0 in f:
        filtros.append(f"{src},adelay={int(t0 * 1000)}:all=1[{nombre}]")
        etiquetas.append(f"[{nombre}]")
    filtros.append(f"{''.join(etiquetas)}amix=inputs={len(etiquetas)}:normalize=0:duration=longest,"
                   f"apad=whole_dur={dur},atrim=0:{dur},loudnorm=I=-14:TP=-1.5:LRA=11[out]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", voz, "-filter_complex", ";".join(filtros),
                    "-map", "[out]", "-ar", "44100", "-c:a", "aac", "-b:a", "192k", salida], check=True)
    print("Audio listo:", salida)


if __name__ == "__main__":
    main(*sys.argv[1:4])
