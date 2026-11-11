"""Genera el resumen visual de un episodio: tabla de escenas (escenas.md) y hoja con un cuadro por escena.

Uso: python3 -I lib/resumen_episodio.py parteN/tl.js ruta/al/video.mp4 carpeta/del/episodio

Solo necesita ffmpeg. El cuadro de cada escena se toma a la mitad de la escena.
"""
import json
import os
import re
import subprocess
import sys
import tempfile

FUENTE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "fonts", "Oswald.ttf")


def lee_tl(ruta):
    texto = open(ruta).read()
    return json.loads(texto[texto.index("{"): texto.rindex("}") + 1])


def main(tl_js, video, carpeta):
    tl = lee_tl(tl_js)
    escenas = tl["escenas"]
    for i, e in enumerate(escenas):
        e["fin"] = escenas[i + 1]["inicio"] if i + 1 < len(escenas) else tl["duracion"]

    filas = ["| # | Escena | Inicio | Fin | Dura | Lo que dice la voz al empezar |", "|---|---|---|---|---|---|"]
    for i, e in enumerate(escenas, 1):
        textos = [re.sub(r"<[^>]+>", "", s["html"]) for s in tl["subs"] if e["inicio"] <= s["s"] < e["fin"]]
        frase = " ".join(textos)[:70]
        filas.append(f"| {i} | `{e['id']}` | {e['inicio']:.2f} | {e['fin']:.2f} | {e['fin'] - e['inicio']:.1f} s | {frase} |")
    with open(os.path.join(carpeta, "escenas.md"), "w") as f:
        f.write("# Escenas\n\nGenerado por `video/lib/resumen_episodio.py` a partir de `tl.js`. Tiempos en segundos.\n\n")
        f.write("\n".join(filas) + "\n")

    with tempfile.TemporaryDirectory() as tmp:
        for i, e in enumerate(escenas, 1):
            t = (e["inicio"] + e["fin"]) / 2
            etiqueta = f"{i}  {e['id']}  {e['inicio']:.1f}s"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.2f}", "-i", video, "-frames:v", "1",
                            "-vf", f"scale=270:-2,drawtext=fontfile='{FUENTE}':text='{etiqueta}':x=10:y=10:"
                                   "fontsize=24:fontcolor=white:box=1:boxcolor=black@0.65:boxborderw=6",
                            os.path.join(tmp, f"f{i:02d}.png")], check=True)
        columnas = 6
        filas_img = -(-len(escenas) // columnas)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", "1", "-i", os.path.join(tmp, "f%02d.png"),
                        "-vf", f"tile={columnas}x{filas_img}:padding=4:color=black", "-frames:v", "1", "-q:v", "4",
                        os.path.join(carpeta, "hoja_de_escenas.jpg")], check=True)
    print(f"{len(escenas)} escenas -> {carpeta}/escenas.md y hoja_de_escenas.jpg")


if __name__ == "__main__":
    main(*sys.argv[1:4])
