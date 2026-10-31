"""Arma la línea de tiempo de la parte 1 a partir de los tiempos por palabra de ElevenLabs.

Uso: python3 -I linea_de_tiempo.py ../audio/palabras.json tl.js
"""
import json
import re
import sys

INTRO = 1.2  # segundos de sirena antes de que empiece la voz
COLA = 1.8   # segundos al final sobre la tarjeta de la parte 2

# Escena -> primeras palabras de la frase donde empieza
CORTES = [
    ("alerta", None),
    ("unidad", "y esa noche"),
    ("cama", "te levantas"),
    ("objetos", "celular"),
    ("puerta", "ya estás"),
    ("patio", "te asomas"),
    ("vaso", "la alerta se calla"),
    ("avenida", "entonces los ves"),
    ("ojos", "alguien grita"),
    ("piso", "cierras la cortina"),
    ("chat", "a las tres cuarenta"),
    ("parte2", "sígueme"),
]

MARCAS = {
    "celular": "celular", "llaves": "llaves", "chanclas": "chanclas",
    "gruñe": "le gruñe", "nunca": "chispa nunca",
    "reunion": "punto de reunión", "simulacros": "simulacros",
    "decenas": "decenas", "ruido": "hacia el ruido",
    "grita": "grita", "voltean": "voltean",
    "mensaje": "mensaje", "susurro": "no hagan ruido",
}

ROJAS = {"3:14", "3:40", "alerta", "sísmica", "peor", "gruñe", "simulacros",
         "movió", "decenas", "ruido", "grito", "escaleras", "hocico"}

ANTES = 0.2  # el corte entra un poco antes de la frase


def limpia(w):
    return re.sub(r"[^\wáéíóúñü:]", "", w.lower())


def main(entrada, salida):
    palabras = [w for w in json.load(open(entrada))["words"] if w.get("type") == "word"]

    # "tres catorce" -> "3:14", "tres cuarenta" -> "3:40", "dos." -> "2."
    toks = []
    i = 0
    while i < len(palabras):
        w = palabras[i]
        sig = palabras[i + 1] if i + 1 < len(palabras) else None
        if limpia(w["text"]) == "tres" and sig and limpia(sig["text"]) in ("catorce", "cuarenta"):
            num = "3:14" if limpia(sig["text"]) == "catorce" else "3:40"
            toks.append({"text": num + sig["text"][len(limpia(sig["text"])):], "start": w["start"], "end": sig["end"]})
            i += 2
            continue
        texto = "2." if w["text"].lower() == "dos." else w["text"]
        toks.append({"text": texto, "start": w["start"], "end": w["end"]})
        i += 1
    for t in toks:
        t["start"] += INTRO
        t["end"] += INTRO

    norm = [limpia(t["text"]) for t in toks]

    def busca(frase):
        frase = frase.replace("tres catorce", "3:14").replace("tres cuarenta", "3:40")
        objetivo = [limpia(x) for x in frase.split()]
        for k in range(len(norm)):
            if norm[k:k + len(objetivo)] == objetivo:
                return toks[k]["start"]
        raise SystemExit(f"No encontré la frase: {frase}")

    escenas = []
    for idx, frase in CORTES:
        inicio = 0.0 if frase is None else round(busca(frase) - ANTES, 3)
        escenas.append({"id": idx, "inicio": inicio})

    marcas = {k: round(busca(v), 3) for k, v in MARCAS.items()}
    duracion = round(toks[-1]["end"] + COLA, 3)

    # Subtítulos: de 1 a 3 palabras, cortando en signos de puntuación
    grupos, actual = [], []
    for t in toks:
        actual.append(t)
        fin_frase = re.search(r"[.,:;?!]$", t["text"])
        largo = sum(len(x["text"]) for x in actual)
        if fin_frase or len(actual) == 3 or largo > 14:
            grupos.append(actual)
            actual = []
    if actual:
        grupos.append(actual)

    subs = []
    for g_i, g in enumerate(grupos):
        s = g[0]["start"]
        sig = grupos[g_i + 1][0]["start"] if g_i + 1 < len(grupos) else g[-1]["end"] + 0.4
        e = min(sig, g[-1]["end"] + 0.35)
        html = []
        for t in g:
            texto = re.sub(r"[,;:]$", "", t["text"]).upper()
            caliente = limpia(t["text"]) in ROJAS
            html.append(f'<span class="hot">{texto}</span>' if caliente else texto)
        subs.append({"s": round(s, 3), "e": round(e, 3), "html": " ".join(html)})

    sin_subs = [[marcas["susurro"], duracion + 1], [escenas[-1]["inicio"], duracion + 1]]

    tl = {"duracion": duracion, "intro": INTRO, "escenas": escenas, "marcas": marcas,
          "subs": subs, "sinSubs": sin_subs}
    with open(salida, "w") as f:
        f.write("// Generado por linea_de_tiempo.py. No editar a mano.\n")
        f.write("const TL = " + json.dumps(tl, ensure_ascii=False, indent=1) + ";\n")
    print(f"{len(escenas)} escenas, {len(subs)} subtítulos, {duracion} s")
    for e in escenas:
        print(f"  {e['inicio']:6.2f}  {e['id']}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
