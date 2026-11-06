"""Mezcla el audio de la parte 2: voz, ambiente, pluma, reloj, cajita musical, respiración y golpes.

Uso: python3 -I mezcla.py tl.js ../audio/parte2/narracion.mp3 salida.m4a
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
    para_reloj = m["tambor"] + 0.45  # igual que PARA_RELOJ en escenas.js

    ambiente = f"anoisesrc=color=brown:amplitude=0.6:d={dur},lowpass=f=160,volume=0.2"

    # Pluma sobre papel durante la escena del Día 1
    d_pluma = ini["regla1"] - 0.6
    pluma = (f"aevalsrc='(2*random(0)-1)*gt(sin(2*PI*3.1*t)+0.4*sin(2*PI*7.3*t),0.3)':s=44100:d={d_pluma},"
             f"highpass=f=2200,lowpass=f=6500,volume=0.25")

    # Tic tac que se vuelve tambor y se corta cuando sale la pila
    d_reloj = para_reloj - ini["reloj"]
    reloj = (f"aevalsrc='(0.6*(2*random(0)-1)*lt(mod(t,0.5),0.006)"
             f"+0.9*sin(2*PI*58*mod(t,0.5))*exp(-28*mod(t,0.5)))*(0.25+0.75*t/{d_reloj:.3f})':s=44100:d={d_reloj:.3f},"
             f"volume=0.5")

    # Cajita musical: primera frase de "Noche de paz" (dominio público)
    notas = [(0.0, 784), (0.75, 880), (1.0, 784), (1.5, 659)]
    expr = "+".join(
        f"between(t,{s},{s + 2.5})*(sin(2*PI*{f}*(t-{s}))+0.35*sin(2*PI*{2 * f}*(t-{s})))*exp(-3.5*(t-{s}))"
        for s, f in notas)
    cajita = f"aevalsrc='0.3*({expr})':s=44100:d=4,volume=0.35,afade=t=out:st=3:d=1"

    # Respiración del otro lado de la puerta
    d_resp = dur - m["esas"]
    respira = (f"anoisesrc=color=pink:amplitude=0.6:d={d_resp:.3f},bandpass=f=700:width_type=h:w=900,"
               f"volume='1.5*pow(sin(PI*t/1.6),2)*min(1,t/1.2)':eval=frame")

    golpe = "aevalsrc='0.9*sin(2*PI*(42+40*exp(-9*t))*t)*exp(-2.6*t)':s=44100:d=2"
    golpes = [(m["escaleras"], 0.35), (m["respira"], 0.9), (ini["parte3"], 0.8)]

    filtros = [f"[0:a]adelay={int(tl['intro'] * 1000)}:all=1[voz]", f"{ambiente}[amb]"]
    etiquetas = ["[voz]", "[amb]"]
    for nombre, src, t0 in [("plu", pluma, 0.6), ("rel", reloj, ini["reloj"]),
                            ("caj", cajita, ini["tamales"]), ("res", respira, m["esas"])]:
        filtros.append(f"{src},adelay={int(t0 * 1000)}:all=1[{nombre}]")
        etiquetas.append(f"[{nombre}]")
    for i, (t, v) in enumerate(golpes):
        filtros.append(f"{golpe},adelay={int(t * 1000)}:all=1,volume={v}[g{i}]")
        etiquetas.append(f"[g{i}]")
    filtros.append(f"{''.join(etiquetas)}amix=inputs={len(etiquetas)}:normalize=0:duration=longest,"
                   f"atrim=0:{dur},loudnorm=I=-14:TP=-1.5:LRA=11[out]")

    cmd = ["ffmpeg", "-v", "error", "-y", "-i", voz, "-filter_complex", ";".join(filtros),
           "-map", "[out]", "-ar", "44100", "-c:a", "aac", "-b:a", "192k", salida]
    subprocess.run(cmd, check=True)
    print("Audio listo:", salida)


if __name__ == "__main__":
    main(*sys.argv[1:4])
