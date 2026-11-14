"""Mezcla el audio de la temporada 2, parte 10 (La última alerta, final de la historia): voz, campanita del voto,
grillos y el mecate que cruje, pasos en silencio, el zumbido del tablero viejo, la alerta de la Coordinación, la voz de
Rosa por las bocinas (filtro de megáfono con eco de ciudad), la estampida, los pitidos en clave MANDALA ABUELA con el
lápiz, la palanca, la alerta lejana del estadio, la multitud que camina, los helicópteros que se van, los pájaros del
amanecer, el acorde tibio, el brillo del suero, el "tin" de la placa y el cierre.

Uso: python3 -I mezcla.py tl.js ../audio/t2parte10/narracion.mp3 salida.m4a
"""
import json
import subprocess
import sys

# Igual que en escenas.js: punto 1, raya 3, 1 entre pitidos, 3 entre letras, 4 extra entre palabras.
MORSE = {"A": ".-", "B": "-...", "D": "-..", "E": ".", "L": ".-..", "M": "--", "N": "-.", "U": "..-"}


def morse(texto, t0, t1):
    """Regresa los pitidos [(inicio, duración)] y cuándo termina cada letra, repartidos entre t0 y t1."""
    pasos, fin_letra, u = [], [], 0
    for c in texto:
        if c == " ":
            u += 4
            fin_letra.append(None)
            continue
        code = MORSE[c]
        for i, ch in enumerate(code):
            d = 1 if ch == "." else 3
            pasos.append((u, d))
            u += d + (1 if i < len(code) - 1 else 0)
        fin_letra.append(u)
        u += 3
    k = (t1 - t0) / (u - 3)
    return [(t0 + pu * k, pd * k) for pu, pd in pasos], [None if f is None else t0 + f * k for f in fin_letra]


def lee_tl(ruta):
    texto = open(ruta).read()
    return json.loads(texto[texto.index("{"): texto.rindex("}") + 1])


def main(tl_js, voz, salida):
    tl = lee_tl(tl_js)
    m = tl["marcas"]
    ini = {e["id"]: e["inicio"] for e in tl["escenas"]}
    dur = tl["duracion"]
    # Igual que en escenas.js
    sirena_t = m["suena"] - 0.05
    habla = m["hablaM"] - 0.1
    manda = m["mandaM"] + 0.45
    quita = m["quitas"] + 0.3
    tin = m["suenaPlaca"] - 0.55
    mandala = morse("MANDALA ABUELA", m["pitaW"] + 0.5, m["abuela"] + 1.15)
    bocinas = (m["nobajenM"] - 0.05, m["pero"] - 0.15)      # la voz de Rosa por las bocinas de la ciudad

    golpe = "aevalsrc='0.9*sin(2*PI*(42+40*exp(-9*t))*t)*exp(-2.6*t)':s=44100:d=2"
    clic = "aevalsrc='0.4*(2*random(0)-1)*exp(-120*t)':s=44100:d=0.08,highpass=f=2000"
    sti = "aevalsrc='0.045*(sin(2*PI*622*t)+sin(2*PI*659*t)+sin(2*PI*932*t))*exp(-2*t)':s=44100:d=2.2"
    tibio = "aevalsrc='0.03*(sin(2*PI*262*t)+0.8*sin(2*PI*330*t)+0.7*sin(2*PI*392*t))*min(1,t/0.6)*min(1,(2.6-t)/0.8)':s=44100:d=2.6"
    fase = "2*PI*700*t-500*cos(PI*t)"
    sirena = f"aevalsrc='0.5*sin({fase})+0.15*sin(3*({fase}))':s=44100:d={{d:.3f}},lowpass=f=2800,aecho=0.8:0.6:120:0.35"

    def ruido(etiqueta, d, color, filtros, t0):
        f.append((etiqueta, f"anoisesrc=color={color}:amplitude=0.8:d={d:.3f},{filtros}", t0))

    def latidos(etiqueta, t0, t1, vol, periodo=0.85):
        d = t1 - t0
        f.append((etiqueta, f"aevalsrc='{vol}*sin(2*PI*52*t)*(exp(-28*mod(t,{periodo}))+0.7*exp(-28*mod(t+{periodo - 0.22:.2f},{periodo})))':s=44100:d={d:.3f},"
                            f"lowpass=f=180,afade=t=in:d=0.4,afade=t=out:st={d - 0.3:.2f}:d=0.3", t0))

    def pasos(etiqueta, t0, d, vol, periodo=0.5, f0=800):
        f.append((etiqueta, f"aevalsrc='0.4*(2*random(0)-1)*exp(-45*mod(t,{periodo}))':s=44100:d={d:.3f},bandpass=f={f0}:width_type=h:w=1000,"
                            f"volume={vol},afade=t=in:d=0.3,afade=t=out:st={d - 0.4:.2f}:d=0.4", t0))

    def pitidos(etiqueta, mensaje, vol):
        p = mensaje[0]
        t0 = p[0][0] - 0.05
        d = p[-1][0] + p[-1][1] - t0 + 0.1
        compuerta = "+".join(f"clip((t-{s - t0:.3f})*250,0,1)*clip(({s - t0 + dd:.3f}-t)*250,0,1)" for s, dd in p)
        f.append((etiqueta, f"aevalsrc='{vol}*sin(2*PI*760*t)*({compuerta})':s=44100:d={d:.3f}", t0))

    def lapiz(etiqueta, mensaje, vol):
        letras = [x for x in mensaje[1] if x is not None]
        t0 = letras[0] - 0.2
        d = letras[-1] - t0 + 0.2
        w = min(0.14, 0.7 * min(b - a for a, b in zip(letras, letras[1:])))
        compuerta = "+".join(f"clip((t-{x - t0 - w:.3f})*60,0,1)*clip(({x - t0 + 0.02:.3f}-t)*60,0,1)" for x in letras)
        f.append((etiqueta, f"aevalsrc='{vol}*(2*random(0)-1)*({compuerta})':s=44100:d={d:.3f},bandpass=f=3500:width_type=h:w=3000", t0))

    f = []  # (etiqueta, filtro, inicio)
    # 1. El voto
    f.append(("cam", "aevalsrc='0.07*(sin(2*PI*880*t)+0.6*sin(2*PI*1318.5*t)+0.4*sin(2*PI*1760*t))*exp(-3*t)':s=44100:d=1.5", 0.1))
    # 2 y 3. La noche: grillos, el mecate que cruje, latidos y pasos en silencio
    d_no = ini["tablero"] - ini["mecate"]
    f.append(("gri", f"aevalsrc='0.02*sin(2*PI*4200*t)*gt(sin(2*PI*2.1*t),0.6)*gt(sin(2*PI*0.37*t),-0.3)':s=44100:d={d_no:.3f},volume=0.5,afade=t=in:d=0.6,afade=t=out:st={d_no - 0.6:.2f}:d=0.6", ini["mecate"]))
    d_cu = ini["calles"] - m["baja"]
    ruido("cru", d_cu, "brown", f"bandpass=f=420:width_type=h:w=300,volume='0.22*gt(sin(2*PI*1.6*t),0.5)':eval=frame,afade=t=in:d=0.2,afade=t=out:st={d_cu - 0.3:.2f}:d=0.3", m["baja"])
    latidos("lat1", ini["mecate"], ini["tablero"], 0.08, 0.75)
    pasos("pas", ini["calles"] + 0.1, ini["tablero"] - ini["calles"] - 0.1, 0.1)
    d_re = ini["tablero"] - ini["calles"]
    ruido("res", d_re, "pink", f"bandpass=f=240:width_type=h:w=120,volume='0.1*(0.55+0.45*sin(2*PI*0.4*t))':eval=frame,afade=t=in:d=0.6,afade=t=out:st={d_re - 0.5:.2f}:d=0.5", ini["calles"])
    # 4 y 5. El tablero viejo: su zumbido; el acorde de "corazón"; la alerta de la Coordinación
    d_ta = ini["amanece"] - ini["tablero"]
    f.append(("hum", f"aevalsrc='0.022*(sin(2*PI*50*t)+0.5*sin(2*PI*100*t))':s=44100:d={d_ta:.3f},afade=t=in:d=0.4,afade=t=out:st={d_ta - 0.6:.2f}:d=0.6", ini["tablero"]))
    f.append(("tib1", f"{tibio},volume=0.6", m["corazon"] - 0.2))
    f.append(("pal1", f"{clic},volume=0.5", m["senal"] + 0.4))
    d_si = habla - sirena_t
    f.append(("sir", sirena.format(d=d_si) + f",volume=0.09,afade=t=in:d=0.15,afade=t=out:st={d_si - 0.08:.2f}:d=0.08", sirena_t))
    f.append(("sti1", sti, m["catorce"]))
    # 6 y 7. Rosa toma el micrófono: un clic, un pitido de bocina y las ondas de su voz
    f.append(("mic", f"{clic},volume=0.6", habla))
    f.append(("fb", "aevalsrc='0.035*sin(2*PI*1750*t)*min(1,t/0.05)*min(1,(0.4-t)/0.12)':s=44100:d=0.4", habla + 0.1))
    f.append(("tib2", f"{tibio},volume=0.5", m["ciudad"]))
    # 8. Ellos corren a los postes
    d_es = ini["estadio"] - ini["postes"] + 0.3
    f.append(("est", f"aevalsrc='0.5*(2*random(0)-1)*(0.5+0.5*sin(2*PI*6.3*t))*(0.5+0.5*sin(2*PI*7.7*t+1))':s=44100:d={d_es:.3f},"
                     f"bandpass=f=500:width_type=h:w=500,afade=t=in:d=0.3,afade=t=out:st={d_es - 0.4:.2f}:d=0.4,volume=0.35", ini["postes"]))
    # 9 y 10. El estadio, donde está Evelin; la mano que tiembla
    f.append(("sti2", sti, m["dondeEvelin"]))
    latidos("lat2", m["tiembla"] - 0.3, manda, 0.09, 0.6)
    f.append(("tem", f"aevalsrc='0.02*sin(2*PI*110*t)*(0.6+0.4*sin(2*PI*9*t))':s=44100:d={ini['pita'] - m['tiembla'] + 0.3:.3f},afade=t=in:d=0.3,afade=t=out:st={ini['pita'] - m['tiembla']:.2f}:d=0.3", m["tiembla"]))
    # 11. Los pitidos de Evelin y el lápiz
    pitidos("pt", mandala, 0.055)
    lapiz("lp", mandala, 0.07)
    # 12 y 13. La palanca; la alerta lejana del estadio; la multitud que camina; los helicópteros se van
    f.append(("pal2", f"{golpe},volume=0.1", manda))
    f.append(("pal3", f"{clic},volume=0.45", manda))
    d_le = ini["amanece"] + 0.5 - manda
    f.append(("lej", sirena.format(d=d_le) + f",lowpass=f=900,volume=0.05,afade=t=in:d=0.4,afade=t=out:st={d_le - 1.0:.2f}:d=1.0", manda + 0.1))
    d_ca = ini["amanece"] - ini["caminan"]
    pasos("mul", ini["caminan"], d_ca, 0.16, 0.17, 600)
    d_he = ini["amanece"] - m["helis"] + 0.3
    ruido("hel", d_he, "brown", f"lowpass=f=300,volume='0.14*(0.5+0.5*gt(sin(2*PI*17*t),0))*max(0,1-t/{d_he:.2f})':eval=frame", m["helis"] - 0.4)
    # 14 a 19. El amanecer: pájaros, un acorde tibio largo, el frasco, el abrazo, el suero, la placa
    d_al = dur - ini["amanece"]
    f.append(("paj", f"aevalsrc='0.025*sin(2*PI*(3200+700*sin(2*PI*13*t))*t)*gt(sin(2*PI*1.3*t),0.82)+0.02*sin(2*PI*(2600+500*sin(2*PI*17*t))*t)*gt(sin(2*PI*0.9*t+2),0.86)':s=44100:d={d_al:.3f},"
                     f"afade=t=in:d=1.2,afade=t=out:st={d_al - 1.5:.2f}:d=1.5", ini["amanece"]))
    f.append(("pad", f"aevalsrc='0.016*(sin(2*PI*262*t)+0.8*sin(2*PI*330*t)+0.7*sin(2*PI*392*t)+0.4*sin(2*PI*523*t))':s=44100:d={d_al:.3f},"
                     f"afade=t=in:d=2,afade=t=out:st={d_al - 2:.2f}:d=2", ini["amanece"]))
    pasos("pev", ini["evelin"], 2.2, 0.08, 0.5, 900)
    f.append(("chi", "aevalsrc='0.04*(sin(2*PI*1568*t)+0.6*sin(2*PI*2093*t))*exp(-3*t)':s=44100:d=1.5", m["frasco"] + 0.1))
    f.append(("tib3", tibio, m["abrazan"] - 0.3))
    f.append(("bri", "aevalsrc='0.03*sin(2*PI*(900+900*t)*t)*min(1,t/0.3)*min(1,(1.8-t)/0.5)+0.02*sin(2*PI*(1400+1200*t)*t)*min(1,t/0.3)*min(1,(1.8-t)/0.5)':s=44100:d=1.8", m["retira"] - 0.1))
    ruido("roc", 0.6, "pink", "highpass=f=1500,afade=t=in:d=0.2,afade=t=out:st=0.3:d=0.3,volume=0.12", quita)
    f.append(("tin", "aevalsrc='0.12*(sin(2*PI*2400*t)+0.6*sin(2*PI*3610*t)+0.35*sin(2*PI*5120*t))*exp(-4*t)':s=44100:d=2,aecho=0.8:0.6:300|600:0.35|0.2", tin))
    # 20. El final
    f.append(("g1", f"{golpe},volume=0.05", ini["fin"]))
    f.append(("tib4", f"{tibio},volume=0.8", ini["fin"] + 0.2))

    # La voz: seca, salvo la de Rosa por las bocinas (megáfono con dos copias retrasadas: el eco de la ciudad).
    # Ojo: aecho o copias con adelay en la voz desfasan los tiempos (trampa 9 de CLAUDE.md); asetpts lo arregla abajo.
    vb = f"clip((t-{bocinas[0]:.3f})/0.04,0,1)*clip(({bocinas[1]:.3f}-t)/0.04,0,1)"
    filtros = [f"[0:a]adelay={int(tl['intro'] * 1000)}:all=1,asplit=2[vs][vb]",
               f"[vs]volume='1-({vb})':eval=frame[vseca]",
               f"[vb]highpass=f=550,lowpass=f=3300,volume='1.7*({vb})':eval=frame,asplit=3[b1][b2][b3]",
               "[b2]adelay=140:all=1,volume=0.35[b2d]",
               "[b3]adelay=330:all=1,volume=0.18[b3d]",
               "[b1][b2d][b3d]amix=inputs=3:normalize=0[vbocina]",
               "[vseca][vbocina]amix=inputs=2:normalize=0[voz]"]
    etiquetas = ["[voz]"]
    for nombre, src, t0 in f:
        filtros.append(f"{src},adelay={int(t0 * 1000)}:all=1[{nombre}]")
        etiquetas.append(f"[{nombre}]")
    filtros.append(f"{''.join(etiquetas)}amix=inputs={len(etiquetas)}:normalize=0:duration=longest,"
                   # asetpts: con copias retrasadas de la voz los tiempos se adelantan y apad ya no rellena el final
                   f"asetpts=N/SR/TB,apad=whole_dur={dur},atrim=0:{dur},loudnorm=I=-14:TP=-1.5:LRA=11[out]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", voz, "-filter_complex", ";".join(filtros),
                    "-map", "[out]", "-ar", "44100", "-c:a", "aac", "-b:a", "192k", salida], check=True)
    print("Audio listo:", salida)


if __name__ == "__main__":
    main(*sys.argv[1:4])
