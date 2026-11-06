"""Acorta las pausas largas de una narración y la acelera un poco.

Uso: python3 -I lib/recorta_pausas.py take1.mp3 narracion.mp3 [pausa_max=0.4] [tempo=1.12]
     python3 -I lib/recorta_pausas.py take1.mp3 narracion.mp3 0.32 1.15 --palabras palabras_take1.json palabras.json

Cada silencio de más de pausa_max segundos se deja en pausa_max (se quita el centro).
Con --palabras también corre los tiempos de una transcripción hecha sobre la toma original,
para no tener que volver a transcribir el audio recortado.
"""
import json
import re
import subprocess
import sys


def silencios(entrada, minimo):
    err = subprocess.run(["ffmpeg", "-hide_banner", "-i", entrada, "-af", f"silencedetect=noise=-38dB:d={minimo}",
                          "-f", "null", "-"], capture_output=True, text=True).stderr
    ini = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", err)]
    fin = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
    return list(zip(ini, fin))


def mueve(t, tramos, tempo):
    """Tiempo en la toma original -> tiempo en la narración recortada y acelerada."""
    acumulado = 0.0
    for a, b in tramos:
        if t < a:  # cayó en una pausa recortada: se pega al inicio del tramo siguiente
            return acumulado / tempo
        if t <= b:
            return (acumulado + t - a) / tempo
        acumulado += b - a
    return acumulado / tempo


def main(entrada, salida, pausa_max=0.4, tempo=1.12, *resto):
    pausa_max, tempo = float(pausa_max), float(tempo)
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", entrada],
                               capture_output=True, text=True).stdout)
    tramos, cursor = [], 0.0
    for a, b in silencios(entrada, pausa_max):
        medio = pausa_max / 2
        tramos.append((cursor, a + medio))
        cursor = b - medio
    tramos.append((cursor, dur))
    tramos = [(round(a, 3), round(b, 3)) for a, b in tramos]
    partes = [f"[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS[p{i}]" for i, (a, b) in enumerate(tramos)]
    unir = "".join(f"[p{i}]" for i in range(len(tramos))) + f"concat=n={len(tramos)}:v=0:a=1,atempo={tempo}[out]"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", entrada, "-filter_complex", ";".join(partes + [unir]),
                    "-map", "[out]", "-ar", "44100", "-ac", "1", "-b:a", "160k", salida], check=True)
    nueva = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", salida],
                                 capture_output=True, text=True).stdout)
    print(f"{dur:.1f} s -> {nueva:.1f} s ({len(tramos) - 1} pausas recortadas)")

    if resto and resto[0] == "--palabras":
        datos = json.load(open(resto[1]))
        for w in datos["words"]:
            w["start"] = round(mueve(w["start"], tramos, tempo), 3)
            w["end"] = round(max(w["start"], mueve(w["end"], tramos, tempo)), 3)
        json.dump(datos, open(resto[2], "w"), ensure_ascii=False)
        print(f"Tiempos de {len(datos['words'])} palabras corridos -> {resto[2]}")


if __name__ == "__main__":
    main(*sys.argv[1:])
