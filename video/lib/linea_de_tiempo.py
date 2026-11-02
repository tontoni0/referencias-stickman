"""Arma la línea de tiempo de una parte a partir de los tiempos por palabra de ElevenLabs.

Uso: python3 -I lib/linea_de_tiempo.py parteN/cortes.json audio/.../palabras.json parteN/tl.js

cortes.json trae:
  intro, cola         segundos antes de la voz y después de la última palabra
  cortes              [[id de escena, frase donde empieza o null], ...]
  marcas              {nombre: frase} para animaciones
  rojas               palabras que van en rojo en los subtítulos
  reemplazos          [[palabras, texto], ...] p. ej. ["tres catorce", "3:14"]
  sin_subs            [[desde, hasta], ...] con "marca:x", "escena:x" o "fin"
"""
import json
import re
import sys

ANTES = 0.2  # el corte entra un poco antes de la frase


def limpia(w):
    w = re.sub(r"[^\wáéíóúñü:%]", "", w.lower())
    return re.sub(r":+$", "", w)


def main(config, entrada, salida):
    cfg = json.load(open(config))
    intro, cola = cfg["intro"], cfg["cola"]
    reemplazos = [(r[0].split(), r[1]) for r in cfg.get("reemplazos", [])]
    # las etiquetas de ElevenLabs como [whispering] no son palabras dichas
    palabras = [w for w in json.load(open(entrada))["words"]
                if w.get("type") == "word" and not w["text"].startswith("[")]

    toks, i = [], 0
    while i < len(palabras):
        for frase, texto in reemplazos:
            seg = palabras[i:i + len(frase)]
            if [limpia(w["text"]) for w in seg] == frase:
                cola_punt = re.search(r"[.,:;?!…]*$", seg[-1]["text"]).group(0)
                toks.append({"text": texto + cola_punt, "start": seg[0]["start"], "end": seg[-1]["end"]})
                i += len(frase)
                break
        else:
            toks.append({"text": palabras[i]["text"], "start": palabras[i]["start"], "end": palabras[i]["end"]})
            i += 1
    for t in toks:
        t["start"] += intro
        t["end"] += intro
    norm = [limpia(t["text"]) for t in toks]

    def busca(frase):
        # "frase@2" busca la segunda vez que aparece
        frase, _, vez = frase.partition("@")
        vez = int(vez or 1)
        ws, objetivo, j = [limpia(x) for x in frase.split()], [], 0
        while j < len(ws):
            for palabras_r, texto in reemplazos:
                if ws[j:j + len(palabras_r)] == palabras_r:
                    objetivo.append(limpia(texto))
                    j += len(palabras_r)
                    break
            else:
                objetivo.append(ws[j])
                j += 1
        for k in range(len(norm)):
            if norm[k:k + len(objetivo)] == objetivo:
                vez -= 1
                if vez == 0:
                    return toks[k]["start"]
        raise SystemExit(f"No encontré la frase: {frase}")

    escenas = [{"id": idx, "inicio": 0.0 if f is None else round(busca(f) - ANTES, 3)} for idx, f in cfg["cortes"]]
    marcas = {k: round(busca(v), 3) for k, v in cfg["marcas"].items()}
    duracion = round(toks[-1]["end"] + cola, 3)

    grupos, actual = [], []
    for t in toks:
        actual.append(t)
        if re.search(r"[.,:;?!…]$", t["text"]) or len(actual) == 3 or sum(len(x["text"]) for x in actual) > 14:
            grupos.append(actual)
            actual = []
    if actual:
        grupos.append(actual)

    rojas = {limpia(w) for w in cfg.get("rojas", [])}
    subs = []
    for g_i, g in enumerate(grupos):
        sig = grupos[g_i + 1][0]["start"] if g_i + 1 < len(grupos) else g[-1]["end"] + 0.4
        html = []
        for t in g:
            texto = re.sub(r"[,;:]$", "", t["text"]).upper()
            html.append(f'<span class="hot">{texto}</span>' if limpia(t["text"]) in rojas else texto)
        subs.append({"s": round(g[0]["start"], 3), "e": round(min(sig, g[-1]["end"] + 0.35), 3), "html": " ".join(html)})

    ini = {e["id"]: e["inicio"] for e in escenas}

    def punto(ref):
        if ref == "fin":
            return duracion + 1
        tipo, nombre = ref.split(":")
        return marcas[nombre] if tipo == "marca" else ini[nombre]

    sin_subs = [[punto(a), punto(b)] for a, b in cfg.get("sin_subs", [])]
    tl = {"duracion": duracion, "intro": intro, "escenas": escenas, "marcas": marcas, "subs": subs, "sinSubs": sin_subs}
    with open(salida, "w") as f:
        f.write("// Generado por lib/linea_de_tiempo.py. No editar a mano.\n")
        f.write("const TL = " + json.dumps(tl, ensure_ascii=False, indent=1) + ";\n")
    print(f"{len(escenas)} escenas, {len(subs)} subtítulos, {duracion} s")
    for e in escenas:
        print(f"  {e['inicio']:6.2f}  {e['id']}")


if __name__ == "__main__":
    main(*sys.argv[1:4])
