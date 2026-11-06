"""Mezcla el audio de la parte 1: voz, sirena, ambiente y golpes.

Uso: python3 -I mezcla.py tl.js ../audio/narracion.wav salida.m4a
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
    fin_sirena = ini["vaso"]  # "la alerta se calla"

    # Sirena genérica que sube y baja (no es la grabación oficial). Fuerte en el intro, baja bajo la voz.
    fase = "2*PI*700*t-500*cos(PI*t)"
    sirena = (f"aevalsrc='0.5*sin({fase})+0.15*sin(3*({fase}))':s=44100:d={fin_sirena},"
              f"lowpass=f=2800,aecho=0.8:0.6:120:0.35,"
              f"volume='if(lt(t,{tl['intro']}),0.9,0.11)':eval=frame,afade=t=out:st={fin_sirena - 0.05}:d=0.05")
    ambiente = f"anoisesrc=color=brown:amplitude=0.6:d={dur},lowpass=f=160,volume=0.2"
    golpe = "aevalsrc='0.9*sin(2*PI*(42+40*exp(-9*t))*t)*exp(-2.6*t)':s=44100:d=2"
    golpes = [ini["vaso"], m["grita"], ini["parte2"]]
    vibra = "aevalsrc='0.35*sgn(sin(2*PI*160*t))*lt(mod(t,0.32),0.16)':s=44100:d=0.5,lowpass=f=900"

    entradas = ["-i", voz]
    filtros = [f"[0:a]adelay={int(tl['intro'] * 1000)}:all=1,volume=1.0[voz]"]
    etiquetas = ["[voz]"]
    filtros.append(f"{sirena}[sir]"); etiquetas.append("[sir]")
    filtros.append(f"{ambiente}[amb]"); etiquetas.append("[amb]")
    for i, t in enumerate(golpes):
        filtros.append(f"{golpe},adelay={int(t * 1000)}:all=1,volume=0.8[g{i}]")
        etiquetas.append(f"[g{i}]")
    filtros.append(f"{vibra},adelay={int(m['mensaje'] * 1000)}:all=1[vib]"); etiquetas.append("[vib]")
    filtros.append(f"{''.join(etiquetas)}amix=inputs={len(etiquetas)}:normalize=0:duration=longest,"
                   f"atrim=0:{dur},loudnorm=I=-14:TP=-1.5:LRA=11[out]")

    cmd = ["ffmpeg", "-v", "error", "-y", *entradas, "-filter_complex", ";".join(filtros),
           "-map", "[out]", "-ar", "44100", "-c:a", "aac", "-b:a", "192k", salida]
    subprocess.run(cmd, check=True)
    print("Audio listo:", salida)


if __name__ == "__main__":
    main(*sys.argv[1:4])
