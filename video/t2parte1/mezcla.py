"""Mezcla el audio de la temporada 2, parte 1 (Evelin): voz, campanita y sello del voto, la alerta que sigue sonando,
la estática del radio, latidos, el zumbido del centro de alerta, el reloj y el lápiz del recuerdo, la sirena lejana de la
primera noche, los pitidos en clave del radio (cortos y largos), los pasos de Memo en la escalera, el gruñido de Chispa,
el botón de prueba, la alarma de todas las zonas y los golpes del cierre.

Uso: python3 -I mezcla.py tl.js ../audio/t2parte1/narracion.mp3 salida.m4a
"""
import json
import subprocess
import sys

# Igual que en escenas.js: punto 1, raya 3, 1 entre pitidos, 3 entre letras, 7 entre palabras.
MORSE = {"A": ".-", "B": "-...", "D": "-..", "E": ".", "F": "..-.", "I": "..", "L": ".-..", "M": "--", "N": "-.", "O": "---",
         "P": ".--.", "R": ".-.", "S": "...", "T": "-", "U": "..-", "V": "...-", "Y": "-.--"}


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
    fin = {e["id"]: (tl["escenas"][i + 1]["inicio"] if i + 1 < len(tl["escenas"]) else dur) for i, e in enumerate(tl["escenas"])}
    # Igual que en escenas.js
    viva = morse("ESTOY VIVA", ini["pita"] + 0.3, m["viva"] + 0.4)
    fuiyo = morse("FUI YO", ini["fuiyo"] + 0.3, m["fui"] + 0.35)
    perdon = morse("PERDONAME ABUELA", m["fui"] + 0.55, ini["centro"] - 0.55)
    zona_evelin = ini["centro"] + 0.6

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
        w = min(0.14, 0.7 * min(b - a for a, b in zip(letras, letras[1:])))   # que no se encimen si las letras van rápido
        compuerta = "+".join(f"clip((t-{x - t0 - w:.3f})*60,0,1)*clip(({x - t0 + 0.02:.3f}-t)*60,0,1)" for x in letras)
        f.append((etiqueta, f"aevalsrc='{vol}*(2*random(0)-1)*({compuerta})':s=44100:d={d:.3f},bandpass=f=3500:width_type=h:w=3000", t0))

    def raspa(etiqueta, t0, d, vol=0.25):
        ruido(etiqueta, d, "white", f"bandpass=f=3500:width_type=h:w=3000,volume='{vol}*(0.6+0.4*sin(2*PI*11*t))':eval=frame,afade=t=in:d=0.05,afade=t=out:st={d - 0.1:.2f}:d=0.1", t0)

    f = []  # (etiqueta, filtro, inicio)
    f.append(("amb", f"anoisesrc=color=brown:amplitude=0.6:d={dur},lowpass=f=160,volume=0.12", 0))
    # 1. El voto: campanita y el sello de CASI
    f.append(("cam", "aevalsrc='0.07*(sin(2*PI*880*t)+0.6*sin(2*PI*1318.5*t)+0.4*sin(2*PI*1760*t))*exp(-3*t)':s=44100:d=1.5", 0.1))
    f.append(("sel", f"{golpe},volume=0.12", m["casi"]))
    f.append(("sel2", f"{clic},volume=0.4", m["casi"]))
    # 2 y 3. La alerta sigue sonando; el radio se prende solo con estática; Rosa se queda blanca
    d_a = fin["blanca"] + 0.6 - (ini["radio"] - 0.3)
    f.append(("sirA", sirena.format(d=d_a) + f",volume=0.1,afade=t=in:d=0.4,afade=t=out:st={d_a - 0.6:.2f}:d=0.6", ini["radio"] - 0.3))
    f.append(("per", f"{clic},volume=0.5", m["prende"] - 0.1))
    d_es = fin["blanca"] - m["prende"]
    ruido("est", d_es, "white", f"bandpass=f=3000:width_type=h:w=2500,volume='0.06*(0.5+0.5*sin(2*PI*0.9*t))':eval=frame,afade=t=in:d=0.1,afade=t=out:st={d_es - 0.5:.2f}:d=0.5", m["prende"] - 0.05)
    latidos("lat1", m["nolahice"], fin["blanca"] + 0.3, 0.25)
    f.append(("sti", "aevalsrc='0.05*(sin(2*PI*740*t)+sin(2*PI*784*t)+sin(2*PI*1046.5*t))*exp(-2.5*t)':s=44100:d=2", m["persona"]))
    # 4. Evelin: golpe con el nombre y el zumbido del centro de alerta
    f.append(("g1", f"{golpe},volume=0.12", ini["evelin"]))
    d_ev = fin["evelin"] - ini["evelin"]
    f.append(("hum", f"aevalsrc='0.03*(sin(2*PI*60*t)+0.5*sin(2*PI*120*t)+0.2*sin(2*PI*180*t))':s=44100:d={d_ev:.3f},afade=t=in:d=0.3,afade=t=out:st={d_ev - 0.3:.2f}:d=0.3", ini["evelin"]))
    for k, t0 in enumerate([m["nieta"], m["operadora"]]):
        f.append((f"bip{k}", "aevalsrc='0.04*sin(2*PI*1320*t)*lt(t,0.09)':s=44100:d=0.12", t0))
    # 5. La clave: acorde cálido, el reloj de la cocina y el lápiz
    d_cl = fin["clave"] - ini["clave"]
    acorde("cal", ini["clave"], fin["clave"] + 0.4, 0.015, "196,246.9,293.7")
    f.append(("tic", f"aevalsrc='0.3*(2*random(0)-1)*exp(-150*mod(t,0.75))':s=44100:d={d_cl:.3f},highpass=f=2500,volume=0.35", ini["clave"]))
    raspa("r1", m["tres"] - 0.4, 0.6)
    raspa("r2", m["tres"] + 0.3, 0.5)
    raspa("r3", m["esconde"], 0.5)
    raspa("r4", m["esconde"] + 0.75, 0.55)
    # 6. La primera noche: la sirena lejana, la gente que baja, la vela que se apaga
    d_pr = fin["primera"] - ini["primera"]
    f.append(("sirP", sirena.format(d=d_pr) + f",lowpass=f=900,volume=0.07,afade=t=in:d=0.4,afade=t=out:st={d_pr - 0.4:.2f}:d=0.4", ini["primera"]))
    ruido("gen", d_pr - 1.5, "pink", f"bandpass=f=600:width_type=h:w=500,volume='0.14*(0.6+0.4*sin(2*PI*1.3*t))':eval=frame,afade=t=in:d=0.5,afade=t=out:st={d_pr - 2.3:.2f}:d=0.8", ini["primera"])
    ruido("sop", 0.45, "pink", "lowpass=f=900,afade=t=in:d=0.05,afade=t=out:st=0.1:d=0.35,volume=0.5", m["rosano"])
    f.append(("g2", f"{golpe},volume=0.08", m["entendio"]))
    # 7 a 10. La alerta sigue (más bajo, para oír los pitidos), los pitidos del radio y el lápiz
    d_c = fin["fuiyo"] + 0.6 - (ini["pita"] - 0.2)
    f.append(("sirC", sirena.format(d=d_c) + f",volume=0.06,afade=t=in:d=0.4,afade=t=out:st={d_c - 0.6:.2f}:d=0.6", ini["pita"] - 0.2))
    pitidos("mv", viva, 0.06)
    lapiz("lv", viva, 0.12)
    pitidos("mf", fuiyo, 0.05)
    lapiz("lf", fuiyo, 0.12)
    pitidos("mp", perdon, 0.05)
    lapiz("lp", perdon, 0.1)
    # 8. Los pasos de Memo en la escalera y los latidos
    d_pa = m["luz"] + 0.7 - (ini["lampara"] + 0.3)
    f.append(("pas", f"aevalsrc='0.15*sin(2*PI*68*t)*exp(-22*mod(t,0.55))':s=44100:d={d_pa:.3f},lowpass=f=300,afade=t=out:st={d_pa - 0.3:.2f}:d=0.3", ini["lampara"] + 0.3))
    latidos("lat2", ini["lampara"], fin["grune"] + 0.2, 0.15, 0.7)
    # 9. Chispa le gruñe a la puerta
    d_gr = fin["grune"] - ini["grune"] + 0.2
    ruido("gru", d_gr, "brown", f"lowpass=f=300,volume='0.28*(0.5+0.5*sin(2*PI*23*t))':eval=frame,afade=t=in:d=0.2,afade=t=out:st={d_gr - 0.3:.2f}:d=0.3", ini["grune"] + 0.05)
    # 10. Acorde triste después de "abuela"
    acorde("tri", m["perdon"] + 1.1, fin["fuiyo"] + 0.8, 0.02, "220,261.6,329.6")
    # 11. El centro de alerta: zumbido, el botón de prueba, un aviso de zona y la alarma de todas las zonas
    d_ce = fin["centro"] - ini["centro"]
    f.append(("hum2", f"aevalsrc='0.03*(sin(2*PI*60*t)+0.5*sin(2*PI*120*t)+0.2*sin(2*PI*180*t))':s=44100:d={d_ce:.3f},afade=t=in:d=0.3,afade=t=out:st={d_ce - 0.3:.2f}:d=0.3", ini["centro"]))
    f.append(("bot", f"{clic},volume=0.5", zona_evelin))
    f.append(("zon", "aevalsrc='0.05*sin(2*PI*988*t)*(lt(t,0.12)+gt(t,0.2)*lt(t,0.32))':s=44100:d=0.4", zona_evelin + 0.08))
    d_al = dur - (m["toda"] - 0.4)
    f.append(("sirT", sirena.format(d=d_al) + f",volume=0.11,afade=t=in:d=0.3,afade=t=out:st={d_al - 1.5:.2f}:d=1.5", m["toda"] - 0.4))
    f.append(("g3", f"{golpe},volume=0.12", m["toda"]))
    # 12. La pregunta: golpes de cierre
    f.append(("g4", f"{golpe},volume=0.12", ini["pregunta"]))
    f.append(("g5", f"{golpe},volume=0.1", m["comenta"]))

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
