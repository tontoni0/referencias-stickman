"""Mezcla el audio de la temporada 2, parte 9 (Bajen al patio): voz, campanita del voto, la alerta que sigue, los
pasos entre ellos, el gruñido de Chispa y los audífonos, el helicóptero del estadio, la reja, los guantes, la bocina de
la Coordinación (filtro de megáfono), el ¡CLANG! y el gruñido de Memo, la noche en el 402, el radio que habla solo (la
voz con filtro de radio), el aviso del chat, los pitidos en clave de Evelin y el lápiz, los latidos de Chispa, el
soplido de la vela, la puerta, la respiración de la escalera llena y los golpes del cierre.

Uso: python3 -I mezcla.py tl.js ../audio/t2parte9/narracion.mp3 salida.m4a
"""
import json
import subprocess
import sys

# Igual que en escenas.js: punto 1, raya 3, 1 entre pitidos, 3 entre letras, 4 extra entre palabras.
MORSE = {"A": ".-", "B": "-...", "C": "-.-.", "E": ".", "H": "....", "I": "..", "J": ".---", "L": ".-..", "O": "---",
         "R": ".-.", "T": "-", "U": "..-", "V": "...-", "Y": "-.--"}


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
    pone = m["pones"] + 0.6
    reja = m["abre"] + 0.1
    jalan = m["guantes"] + 0.3
    cierra = m["cierraM"] + 0.1
    pupilas = m["pupilas"] + 0.2
    apaga = m["apaga"] + 0.5
    puerta = m["abrePuerta"] + 0.25
    tablero = morse("EL TABLERO VIEJO", m["pitidosM"] + 0.75, m["viejo"] + 0.4)
    cura = morse("HAY CURA", m["viejo"] + 0.6, m["cura"] + 0.75)
    bocina = (m["noEvac"] - 0.05, m["dice"] - 0.1)          # "No evacuamos mordidos" sale de la bocina
    radio = (m["hoy"] - 0.05, m["mismo"] - 0.15)            # el radio de Rosa habla solo

    golpe = "aevalsrc='0.9*sin(2*PI*(42+40*exp(-9*t))*t)*exp(-2.6*t)':s=44100:d=2"
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

    def pasos(etiqueta, t0, d, vol, periodo=0.26, f0=900):
        f.append((etiqueta, f"aevalsrc='0.4*(2*random(0)-1)*exp(-45*mod(t,{periodo}))':s=44100:d={d:.3f},bandpass=f={f0}:width_type=h:w=1200,"
                            f"volume={vol},afade=t=in:d=0.2,afade=t=out:st={d - 0.3:.2f}:d=0.3", t0))

    def pitidos(etiqueta, mensaje, vol):
        """Un solo generador con todos los pitidos de un mensaje; cada uno sube y baja en 4 ms para que no truene."""
        p = mensaje[0]
        t0 = p[0][0] - 0.05
        d = p[-1][0] + p[-1][1] - t0 + 0.1
        compuerta = "+".join(f"clip((t-{s - t0:.3f})*250,0,1)*clip(({s - t0 + dd:.3f}-t)*250,0,1)" for s, dd in p)
        f.append((etiqueta, f"aevalsrc='{vol}*sin(2*PI*760*t)*({compuerta})':s=44100:d={d:.3f}", t0))

    def lapiz(etiqueta, mensaje, vol):
        """El lápiz raspa la hoja cada vez que Rosa termina una letra."""
        letras = [x for x in mensaje[1] if x is not None]
        t0 = letras[0] - 0.2
        d = letras[-1] - t0 + 0.2
        w = min(0.14, 0.7 * min(b - a for a, b in zip(letras, letras[1:])))
        compuerta = "+".join(f"clip((t-{x - t0 - w:.3f})*60,0,1)*clip(({x - t0 + 0.02:.3f}-t)*60,0,1)" for x in letras)
        f.append((etiqueta, f"aevalsrc='{vol}*(2*random(0)-1)*({compuerta})':s=44100:d={d:.3f},bandpass=f=3500:width_type=h:w=3000", t0))

    f = []  # (etiqueta, filtro, inicio)
    # 1. El voto
    f.append(("cam", "aevalsrc='0.07*(sin(2*PI*880*t)+0.6*sin(2*PI*1318.5*t)+0.4*sin(2*PI*1760*t))*exp(-3*t)':s=44100:d=1.5", 0.1))
    # 2 y 3. La alerta sigue; corres entre ellos; los gemidos de cientos; Chispa gruñe hasta que le pones los audífonos
    d_al = ini["lejos"] + 0.6 - ini["corres"]
    f.append(("al", sirena.format(d=d_al) + f",volume=0.075,afade=t=in:d=0.3,afade=t=out:st={d_al - 0.8:.2f}:d=0.8", ini["corres"]))
    pasos("cor", ini["corres"] + 0.1, 2.6, 0.14, 0.22)
    d_ge = ini["agarras"] - ini["corres"]
    ruido("gem", d_ge, "pink", f"bandpass=f=300:width_type=h:w=200,volume=0.25,afade=t=in:d=0.4,afade=t=out:st={d_ge - 0.4:.2f}:d=0.4", ini["corres"])
    latidos("lat1", ini["corres"], pone, 0.1, 0.55)
    d_gr = pone - ini["agarras"]
    ruido("gru", d_gr, "brown", f"bandpass=f=240:width_type=h:w=160,tremolo=f=24:d=0.9,volume=0.4,afade=t=in:d=0.2,afade=t=out:st={d_gr - 0.2:.2f}:d=0.2", ini["agarras"])
    ruido("roc", 0.5, "pink", "highpass=f=1500,afade=t=in:d=0.15,afade=t=out:st=0.25:d=0.25,volume=0.12", m["pones"])
    ruido("pon", 0.2, "brown", "lowpass=f=300,afade=t=out:st=0:d=0.2,volume=0.5", pone)
    f.append(("tib1", tibio, m["vuelve"] - 0.1))
    # 4 a 7. El estadio: el helicóptero, la reja, los guantes, la bocina, el ¡CLANG! y Memo que ya no es Memo
    d_he = cierra + 1 - ini["lejos"]
    ruido("hel", d_he, "brown", f"lowpass=f=300,volume='0.12*(0.5+0.5*gt(sin(2*PI*17*t),0))':eval=frame,afade=t=in:d=0.8,afade=t=out:st={d_he - 0.8:.2f}:d=0.8", ini["lejos"])
    d_dr = ini["vuelven"] - ini["reja"]
    f.append(("dro", f"aevalsrc='0.025*sin(2*PI*55*t)+0.02*sin(2*PI*58.3*t)':s=44100:d={d_dr:.3f},afade=t=in:d=0.6,afade=t=out:st={d_dr - 0.6:.2f}:d=0.6", ini["reja"]))
    ruido("rej", 0.9, "brown", "bandpass=f=700:width_type=h:w=900,volume='0.5*(0.6+0.4*sin(2*PI*23*t))':eval=frame,afade=t=in:d=0.1,afade=t=out:st=0.6:d=0.3", reja)
    f.append(("g1", f"{golpe},volume=0.09", jalan))
    ruido("for", 0.6, "pink", "bandpass=f=900:width_type=h:w=1200,afade=t=in:d=0.05,afade=t=out:st=0.3:d=0.3,volume=0.25", jalan)
    f.append(("sti1", sti, jalan + 0.1))
    f.append(("fb", "aevalsrc='0.04*sin(2*PI*1850*t)*min(1,t/0.05)*min(1,(0.35-t)/0.1)':s=44100:d=0.35", bocina[0] - 0.45))
    f.append(("cla", f"{golpe},volume=0.14", cierra))
    f.append(("cl2", "aevalsrc='0.08*(sin(2*PI*1300*t)+0.6*sin(2*PI*2150*t)+0.4*sin(2*PI*3400*t))*exp(-5*t)':s=44100:d=1.2", cierra))
    f.append(("sti2", sti, pupilas))
    ruido("mem", 1.6, "brown", "bandpass=f=180:width_type=h:w=140,tremolo=f=9:d=0.6,afade=t=in:d=0.4,afade=t=out:st=1.0:d=0.6,volume=0.35", m["yaNo"])
    # 8 a 11. El 402 de noche: la vela, el radio que habla solo y el aviso del chat
    d_no = ini["puerta"] - ini["vuelven"]
    f.append(("gri", f"aevalsrc='0.02*sin(2*PI*4200*t)*gt(sin(2*PI*2.1*t),0.6)*gt(sin(2*PI*0.37*t),-0.3)':s=44100:d={d_no:.3f},volume=0.5,afade=t=in:d=1,afade=t=out:st={d_no - 1:.2f}:d=1", ini["vuelven"]))
    f.append(("tib2", f"{tibio},volume=0.6", ini["vuelven"] + 0.2))
    d_es = radio[1] + 0.3 - (m["habla"] - 0.3)
    ruido("est", d_es, "white", f"bandpass=f=2500:width_type=h:w=3000,volume='0.045*(0.7+0.3*random(0))':eval=frame,afade=t=in:d=0.1,afade=t=out:st={d_es - 0.2:.2f}:d=0.2", m["habla"] - 0.3)
    f.append(("sti3", sti, m["catorce"]))
    f.append(("noti", "aevalsrc='0.06*(sin(2*PI*1046*t)*lt(t,0.12)+sin(2*PI*1568*t)*gt(t,0.12))*exp(-6*t)':s=44100:d=0.6", ini["memo1"] + 0.05))
    f.append(("sti4", sti, m["escribio"]))
    # 12. Los pitidos de Evelin y el lápiz de Rosa
    pitidos("pt", tablero, 0.055)
    pitidos("pc", cura, 0.055)
    lapiz("lt", tablero, 0.07)
    lapiz("lc", cura, 0.07)
    # 13 y 14. Chispa tiembla: latidos lentos y un gemido; Rosa sopla la vela
    latidos("lat2", ini["gris"], apaga + 1.5, 0.08, 1.0)
    f.append(("gim", "aevalsrc='0.03*sin(2*PI*(650*t+120*t*t)+2*sin(2*PI*7*t))*sin(PI*t/1.0)':s=44100:d=1.0,lowpass=f=1200", m["tiembla"]))
    ruido("sop", 0.6, "pink", "bandpass=f=1100:width_type=h:w=1400,afade=t=in:d=0.25,afade=t=out:st=0.3:d=0.3,volume=0.3", apaga - 0.35)
    # 15. La puerta; la escalera llena: la respiración de muchos y una nota
    ruido("rec", 0.9, "brown", "bandpass=f=500:width_type=h:w=600,volume='0.3*(0.5+0.5*sin(2*PI*14*t))':eval=frame,afade=t=in:d=0.2,afade=t=out:st=0.6:d=0.3", puerta)
    d_re = ini["decide"] + 0.5 - (puerta + 0.4)
    ruido("res", d_re, "pink", f"bandpass=f=240:width_type=h:w=120,volume='0.16*(0.55+0.45*sin(2*PI*0.4*t))':eval=frame,afade=t=in:d=0.8,afade=t=out:st={d_re - 0.5:.2f}:d=0.5", puerta + 0.4)
    f.append(("sti5", sti, m["llena"]))
    latidos("lat3", m["trajo"], ini["decide"] + 0.4, 0.09, 0.6)
    # 16. La decisión
    f.append(("g2", f"{golpe},volume=0.05", ini["decide"]))
    f.append(("g3", f"{golpe},volume=0.04", m["comenta"]))

    # La voz: seca, salvo la bocina (megáfono con eco) y el radio de Rosa
    def ventana(a, b):
        return f"clip((t-{a:.3f})/0.04,0,1)*clip(({b:.3f}-t)/0.04,0,1)"
    vb, vr = ventana(*bocina), ventana(*radio)
    filtros = [f"[0:a]adelay={int(tl['intro'] * 1000)}:all=1,asplit=3[vs][vb][vr]",
               f"[vs]volume='1-({vb})-({vr})':eval=frame[vseca]",
               # el eco del megáfono es una copia retrasada: aecho no deja que apad rellene el final
               f"[vb]highpass=f=600,lowpass=f=3200,volume='1.7*({vb})':eval=frame,asplit=2[vb1][vb2]",
               "[vb2]adelay=120:all=1,volume=0.35[vb3]",
               "[vb1][vb3]amix=inputs=2:normalize=0[vbocina]",
               f"[vr]highpass=f=450,lowpass=f=2800,volume='1.6*({vr})':eval=frame[vradio]",
               "[vseca][vbocina][vradio]amix=inputs=3:normalize=0[voz]"]
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
