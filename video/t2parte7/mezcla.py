"""Mezcla el audio de la temporada 2, parte 7 (La antena): voz, campanita del voto, la puerta de la sala que se cierra,
los golpes de Memo en el vidrio, el viento de la azotea, la llave de tuercas, olfateos y el recuerdo de Rosa, la ráfaga,
el gruñido de Chispa y el ¡CLAC!, los audífonos que apagan todo, la pluma de la regla 5, el radio que truena, la voz
de la Coordinación con filtro de radio, el "shh" de Memo y los golpes del cierre.

Uso: python3 -I mezcla.py tl.js ../audio/t2parte7/narracion.mp3 salida.m4a
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
    # Igual que en escenas.js
    portazo = m["encierrasM"] + 0.35
    golpes = [m["golpea"] + 0.05, m["golpea"] + 0.45, m["vidrio"] + 0.05, m["vidrio"] + 0.45]
    rafaga = m["sopla"] - 0.1
    clac = m["mordidaM"] + 0.55
    pone = m["pone"] + 0.5
    truena = m["truena"] - 0.1
    radio1 = (m["traenos"] - 0.05, m["diceVoz"] - 0.1)
    radio2 = (m["yTe"] - 0.05, m["esMemo"] - 0.15)

    golpe = "aevalsrc='0.9*sin(2*PI*(42+40*exp(-9*t))*t)*exp(-2.6*t)':s=44100:d=2"
    clic = "aevalsrc='0.4*(2*random(0)-1)*exp(-120*t)':s=44100:d=0.08,highpass=f=2000"
    sti = "aevalsrc='0.045*(sin(2*PI*622*t)+sin(2*PI*659*t)+sin(2*PI*932*t))*exp(-2*t)':s=44100:d=2.2"
    tibio = "aevalsrc='0.03*(sin(2*PI*262*t)+0.8*sin(2*PI*330*t)+0.7*sin(2*PI*392*t))*min(1,t/0.6)*min(1,(2.6-t)/0.8)':s=44100:d=2.6"

    def ruido(etiqueta, d, color, filtros, t0):
        f.append((etiqueta, f"anoisesrc=color={color}:amplitude=0.8:d={d:.3f},{filtros}", t0))

    def latidos(etiqueta, t0, t1, vol, periodo=0.85):
        d = t1 - t0
        f.append((etiqueta, f"aevalsrc='{vol}*sin(2*PI*52*t)*(exp(-28*mod(t,{periodo}))+0.7*exp(-28*mod(t+{periodo - 0.22:.2f},{periodo})))':s=44100:d={d:.3f},"
                            f"lowpass=f=180,afade=t=in:d=0.4,afade=t=out:st={d - 0.3:.2f}:d=0.3", t0))

    def olfateo(etiqueta, t0, vol=0.25):
        ruido(etiqueta, 0.5, "pink", f"bandpass=f=2200:width_type=h:w=1500,volume='{vol}*gt(sin(2*PI*5*t),0)':eval=frame,afade=t=out:st=0.3:d=0.2", t0)

    def metal(etiqueta, t0, vol=0.05):
        f.append((etiqueta, f"aevalsrc='{vol}*(sin(2*PI*2500*t)+0.7*sin(2*PI*3710*t)+0.4*sin(2*PI*5230*t))*exp(-9*t)':s=44100:d=0.8", t0))

    f = []  # (etiqueta, filtro, inicio)
    # Ambiente: el zumbido de la sala; arriba, el viento (se apaga cuando Chispa trae los audífonos)
    d_hu = ini["azotea"] - 0.0
    f.append(("hum", f"aevalsrc='0.025*(sin(2*PI*60*t)+0.5*sin(2*PI*120*t))':s=44100:d={d_hu:.3f},afade=t=in:d=0.3,afade=t=out:st={d_hu - 0.4:.2f}:d=0.4", 0))
    d_v1 = pone - ini["azotea"]
    ruido("vie1", d_v1, "pink", f"lowpass=f=600,volume='0.1*(0.6+0.4*sin(2*PI*0.3*t))':eval=frame,afade=t=in:d=0.6,afade=t=out:st={d_v1 - 0.15:.2f}:d=0.15", ini["azotea"])
    d_vs = ini["regla"] - pone
    ruido("vsor", d_vs, "pink", f"lowpass=f=160,volume=0.05,afade=t=in:d=0.1,afade=t=out:st={d_vs - 0.4:.2f}:d=0.4", pone)
    d_v2 = dur - ini["regla"]
    ruido("vie2", d_v2, "pink", f"lowpass=f=600,volume='0.08*(0.6+0.4*sin(2*PI*0.3*t))':eval=frame,afade=t=in:d=1", ini["regla"])
    d_si = ini["huele"] - m["vientoM"]
    f.append(("sil", f"aevalsrc='0.012*sin(2*PI*(820+60*sin(2*PI*0.4*t))*t)':s=44100:d={d_si:.3f},afade=t=in:d=1,afade=t=out:st={d_si - 1:.2f}:d=1", m["vientoM"]))
    # 1. El voto
    f.append(("cam", "aevalsrc='0.07*(sin(2*PI*880*t)+0.6*sin(2*PI*1318.5*t)+0.4*sin(2*PI*1760*t))*exp(-3*t)':s=44100:d=1.5", 0.1))
    # 2. La puerta que corre y se cierra; Memo golpea el vidrio; la tarjeta
    d_co = portazo - ini["encierras"]
    ruido("cor", d_co, "brown", f"lowpass=f=500,volume='0.35*t/{d_co:.2f}':eval=frame", ini["encierras"])
    f.append(("pta", f"{golpe},volume=0.14", portazo))
    ruido("ptn", 0.3, "brown", "lowpass=f=900,afade=t=out:st=0:d=0.3,volume=0.35", portazo)
    f.append(("cer", f"{clic},volume=0.6", portazo + 0.08))
    for k, g in enumerate(golpes):
        f.append((f"gv{k}", f"{golpe},volume=0.07", g))
        ruido(f"vi{k}", 0.25, "white", "bandpass=f=3500:width_type=h:w=3000,afade=t=out:st=0:d=0.25,volume=0.14", g)
    f.append(("sti1", sti, m["tarjeta"]))
    # 3. La azotea: pasos y la antena
    f.append(("pas", f"aevalsrc='0.4*(2*random(0)-1)*exp(-45*mod(t,0.5))':s=44100:d=2.4,bandpass=f=1500:width_type=h:w=2000,volume=0.1", ini["azotea"] + 0.1))
    # 4 y 5. La llave de tuercas: un tintineo, tensión y latidos
    metal("ll1", m["apuntaM"] - 0.15)
    d_te = ini["huele"] - m["apuntaM"]
    f.append(("ten", f"aevalsrc='0.022*sin(2*PI*(50+25*t/{d_te:.2f})*t)+0.018*sin(2*PI*(53+26*t/{d_te:.2f})*t)':s=44100:d={d_te:.3f},afade=t=in:d=0.5,afade=t=out:st={d_te - 0.5:.2f}:d=0.5", m["apuntaM"]))
    latidos("lat1", m["apuntaM"], ini["huele"] + 0.3, 0.1)
    ruido("swe", 0.6, "pink", "bandpass=f=1200:width_type=h:w=1600,afade=t=in:d=0.3,afade=t=out:st=0.3:d=0.3,volume=0.25", ini["evelin"] - 0.1)
    # 6 y 7. Chispa la huele; el recuerdo de Rosa; baja la llave
    olfateo("ol1", m["laHuele"])
    olfateo("ol2", m["laHuele"] + 0.6, 0.2)
    f.append(("tib1", tibio, m["huele2"] - 0.1))
    metal("ll2", m["bajaM"] + 0.6, 0.035)
    # 8. La ráfaga; Chispa voltea y empieza a gruñir
    d_ra = ini["ojos"] + 0.3 - rafaga
    ruido("raf", d_ra, "pink", f"lowpass=f=900,volume='0.22*min(1,t/0.6)*(0.7+0.3*sin(2*PI*0.9*t))':eval=frame,afade=t=out:st={d_ra - 0.4:.2f}:d=0.4", rafaga)
    f.append(("aul", f"aevalsrc='0.02*sin(2*PI*(1100+200*sin(2*PI*0.7*t))*t)':s=44100:d={d_ra:.3f},afade=t=in:d=0.5,afade=t=out:st={d_ra - 0.4:.2f}:d=0.4", rafaga + 0.2))
    ruido("pap", d_ra, "white", f"highpass=f=2500,volume='0.04*gt(sin(2*PI*9*t),0.2)':eval=frame,afade=t=out:st={d_ra - 0.4:.2f}:d=0.4", rafaga + 0.1)
    ruido("whv", 0.5, "pink", "bandpass=f=900:width_type=h:w=1200,afade=t=in:d=0.15,afade=t=out:st=0.2:d=0.3,volume=0.3", m["voltea"])
    d_gr = pone - (m["voltea"] + 0.2)
    ruido("gru", d_gr, "brown", f"bandpass=f=240:width_type=h:w=160,tremolo=f=24:d=0.9,volume='0.4*min(1,t/0.8)':eval=frame,afade=t=out:st={d_gr - 0.25:.2f}:d=0.25", m["voltea"] + 0.2)
    # 9 y 10. Los ojos blancos; el ¡CLAC!
    f.append(("sti2", f"{sti},volume=0.7", m["ojosM"] + 0.1))
    f.append(("clk", f"{clic},volume=0.7", clac))
    ruido("snp", 0.12, "white", "highpass=f=1200,afade=t=out:st=0:d=0.12,volume=0.3", clac)
    f.append(("g1", f"{golpe},volume=0.1", clac))
    # 11. Se quita los audífonos y se los pone a Chispa: un roce y un golpe sordo
    ruido("roc", 0.6, "pink", "highpass=f=1500,afade=t=in:d=0.2,afade=t=out:st=0.3:d=0.3,volume=0.12", m["quita"])
    ruido("pon", 0.2, "brown", "lowpass=f=300,afade=t=out:st=0:d=0.2,volume=0.5", pone)
    # 12. Silencio: latidos lentos y un acorde tibio cuando vuelve a ser Chispa
    latidos("lat2", pone + 0.3, ini["regla"], 0.06, 1.1)
    f.append(("tib2", f"{tibio},volume=0.7", m["vuelve"] - 0.1))
    # 13. La regla 5: la pluma
    for k, (t0, d) in enumerate([(ini["regla"] + 0.05, 0.6), (m["mordidos"], 0.7), (m["jala"] - 0.1, 0.8), (m["sinRuido"], 0.5), (m["calman"] - 0.1, 0.5)]):
        ruido(f"plu{k}", d, "pink", f"bandpass=f=3200:width_type=h:w=2500,volume='0.05*(0.5+0.5*sin(2*PI*11*t))':eval=frame,afade=t=out:st={d - 0.1:.2f}:d=0.1", t0)
    # 14. El radio truena detrás del tinaco
    ruido("tru", 0.9, "white", "bandpass=f=2000:width_type=h:w=3000,volume='0.3*gt(random(0),0.35)':eval=frame,afade=t=out:st=0.5:d=0.4", truena)
    f.append(("sq0", "aevalsrc='0.05*sin(2*PI*1600*t)*lt(t,0.08)':s=44100:d=0.1", truena + 0.9))
    # 15. La voz de la Coordinación: estática debajo y un clic al soltar
    for k, (a, b) in enumerate([radio1, radio2]):
        d = b - a + 0.2
        ruido(f"est{k}", d, "white", f"bandpass=f=2500:width_type=h:w=3000,volume='0.05*(0.7+0.3*random(0))':eval=frame,afade=t=in:d=0.05,afade=t=out:st={d - 0.1:.2f}:d=0.1", a - 0.1)
        ruido(f"sq{k + 1}", 0.15, "white", "highpass=f=1500,afade=t=out:st=0:d=0.15,volume=0.25", b + 0.05)
    # 16. Es Memo: un zumbido grave, latidos y su "shh"
    d_me = ini["decide"] + 0.5 - ini["memo"]
    f.append(("dro", f"aevalsrc='0.025*sin(2*PI*55*t)+0.02*sin(2*PI*58.3*t)':s=44100:d={d_me:.3f},afade=t=in:d=0.6,afade=t=out:st={d_me - 0.5:.2f}:d=0.5", ini["memo"]))
    f.append(("sti3", sti, m["esMemo"]))
    latidos("lat3", m["nadie"], ini["decide"] + 0.3, 0.09, 0.6)
    ruido("shh", 0.7, "pink", "highpass=f=2800,afade=t=in:d=0.08,afade=t=out:st=0.35:d=0.35,volume=0.22", m["masQueTu"] + 0.45)
    # 17. La decisión
    f.append(("g2", f"{golpe},volume=0.05", ini["decide"]))
    f.append(("g3", f"{golpe},volume=0.04", m["comenta"]))

    # La voz: seca, salvo lo que dice la Coordinación, que suena por radio
    ventana = "+".join(f"clip((t-{a:.3f})/0.04,0,1)*clip(({b:.3f}-t)/0.04,0,1)" for a, b in (radio1, radio2))
    filtros = [f"[0:a]adelay={int(tl['intro'] * 1000)}:all=1,asplit=2[vs][vr]",
               f"[vs]volume='1-({ventana})':eval=frame[vseca]",
               f"[vr]highpass=f=450,lowpass=f=2800,volume='1.6*({ventana})':eval=frame[vradio]",
               "[vseca][vradio]amix=inputs=2:normalize=0[voz]"]
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
