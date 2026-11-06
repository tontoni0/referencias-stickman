"""Mete silencios en puntos exactos de la narración y corre los tiempos por palabra.

Uso: python3 -I lib/inserta_silencios.py entrada.mp3 palabras.json salida.mp3 salida.json 5.75:0.6 34.05:0.7

Sirve para devolver una pausa dramática que se perdió al recortar, sin volver a transcribir.
"""
import json
import subprocess
import sys


def main(entrada, palabras, salida, salida_json, *puntos):
    cortes = sorted((float(a), float(b)) for a, b in (p.split(":") for p in puntos))
    partes, unir, desde = [], "", 0.0
    for i, (t, d) in enumerate(cortes):
        partes.append(f"[0:a]atrim={desde}:{t},asetpts=PTS-STARTPTS[a{i}]")
        partes.append(f"anullsrc=r=44100:cl=mono,atrim=0:{d}[s{i}]")
        unir += f"[a{i}][s{i}]"
        desde = t
    partes.append(f"[0:a]atrim={desde},asetpts=PTS-STARTPTS[fin]")
    unir += f"[fin]concat=n={2 * len(cortes) + 1}:v=0:a=1[out]"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", entrada, "-filter_complex", ";".join(partes + [unir]),
                    "-map", "[out]", "-ar", "44100", "-ac", "1", "-b:a", "160k", salida], check=True)

    datos = json.load(open(palabras))
    for w in datos["words"]:
        extra = sum(d for t, d in cortes if w["start"] >= t)
        w["start"] = round(w["start"] + extra, 3)
        w["end"] = round(w["end"] + extra, 3)
    json.dump(datos, open(salida_json, "w"), ensure_ascii=False)
    print(f"{len(cortes)} silencios, +{sum(d for _, d in cortes):.2f} s")


if __name__ == "__main__":
    main(*sys.argv[1:])
