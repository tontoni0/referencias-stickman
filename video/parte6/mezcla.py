"""Mezcla el audio de la parte 6: voz, golpe inicial, estampida, manos en el vidrio, grietas y vidrio
que revienta, pasos en la escalera, golpes en la puerta, silla, chillido de Chispa, la puerta que cede,
viento en la cornisa, uñas de Chispa, escalerita de fierro, la bodega, vibraciones del celular y la tarjeta final.

Uso: python3 -I mezcla.py tl.js ../audio/parte6/narracion.mp3 salida.m4a
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
    fin = {e["id"]: (tl["escenas"][i + 1]["inicio"] if i + 1 < len(tl["escenas"]) else dur) for i, e in enumerate(tl["escenas"])}
    # Igual que en escenas.js
    golpes, x = [], ini["golpes"] + 0.15
    while x < m["cede"] - 0.1:
        golpes.append(x)
        x += 0.62
    cierra = m["encierras"] + 0.3
    grietas = [m["revienta"] - 2.2, m["revienta"] - 1.2, m["revienta"] - 0.45]

    golpe = "aevalsrc='0.9*sin(2*PI*(42+40*exp(-9*t))*t)*exp(-2.6*t)':s=44100:d=2"
    vibra = "aevalsrc='0.06*sgn(sin(2*PI*160*t))*lt(mod(t,0.32),0.16)':s=44100:d=0.5,lowpass=f=900"
    grieta = "anoisesrc=color=white:amplitude=0.8:d=0.3,highpass=f=2500,afade=t=out:st=0:d=0.3,volume=0.1"
    madera = ("aevalsrc='(0.8*sin(2*PI*95*t)*exp(-18*t)+0.5*(2*random(0)-1)*exp(-35*t))':s=44100:d=0.6,"
              "lowpass=f=1400")
    fierro = "aevalsrc='0.3*(sin(2*PI*1800*t)+0.6*sin(2*PI*2730*t))*exp(-22*t)':s=44100:d=0.3"

    def ruido(etiqueta, d, color, filtros, t0):
        f.append((etiqueta, f"anoisesrc=color={color}:amplitude=0.8:d={d:.3f},{filtros}", t0))

    f = []  # (etiqueta, filtro, inicio)
    f.append(("amb", f"anoisesrc=color=brown:amplitude=0.6:d={dur},lowpass=f=160,volume=0.14", 0))
    # 1. Golpe de entrada y estampida hacia el edificio
    f.append(("g0", f"{golpe},volume=0.15", 0))
    d_est = ini["escalera"] - m["paga"]
    ruido("est", d_est, "brown", f"lowpass=f=500,volume='0.3*(0.4+0.6*abs(sin(2*PI*5.3*t))*abs(sin(2*PI*3.1*t+1)))':eval=frame,"
          f"afade=t=in:d=0.3,afade=t=out:st={d_est - 0.5:.2f}:d=0.5", m["paga"])
    # 2. Manos contra el vidrio, grietas y el vidrio que revienta
    d_pal = m["revienta"] - ini["vidrio"]
    f.append(("pal", f"aevalsrc='0.5*(sin(2*PI*70*mod(t,0.29))*exp(-30*mod(t,0.29))+0.7*sin(2*PI*85*mod(t+0.11,0.41))*exp(-30*mod(t+0.11,0.41)))':"
                     f"s=44100:d={d_pal:.3f},lowpass=f=600,volume=0.14", ini["vidrio"]))
    for i, g in enumerate(grietas):
        f.append((f"gr{i}", grieta, g))
    ruido("rev", 1.6, "white", "highpass=f=1200,afade=t=out:st=0:d=1.6,volume=0.15", m["revienta"])
    f.append(("tin", "aevalsrc='0.25*(sin(2*PI*3100*t)*exp(-6*t)+sin(2*PI*4200*(t-0.13))*exp(-7*(t-0.13))*gte(t,0.13)"
                     "+sin(2*PI*3600*(t-0.31))*exp(-8*(t-0.31))*gte(t,0.31))':s=44100:d=1.2,volume=0.4", m["revienta"] + 0.05))
    f.append(("g1", f"{golpe},volume=0.2", m["revienta"]))
    # 3 y 4. Pasos en la escalera; en el 402 se oyen apagados
    d_pas = fin["escalera"] - ini["escalera"]
    pasos = "aevalsrc='(sin(2*PI*60*mod(t,0.13))*exp(-40*mod(t,0.13)))*(0.6+0.4*sin(2*PI*1.7*t))':s=44100:d={d:.3f},lowpass=f={lp}"
    f.append(("pas", f"{pasos.format(d=d_pas, lp=700)},volume=0.17", ini["escalera"]))
    d_ro = fin["rosa"] - ini["rosa"]
    f.append(("pa2", f"{pasos.format(d=d_ro, lp=250)},volume=0.17,afade=t=out:st={d_ro - 1:.2f}:d=1", ini["rosa"]))
    # 5. Golpes en tu puerta, la silla y Chispa que chilla bajito
    for i, g in enumerate(golpes):
        f.append((f"gp{i}", f"{madera},volume=0.15", g))
        f.append((f"gq{i}", f"{golpe},lowpass=f=200,volume=0.08", g))
    ruido("sil", 0.5, "brown", "bandpass=f=420:width_type=h:w=500,volume='0.5*(0.5+0.5*sin(2*PI*24*t))':eval=frame,afade=t=out:st=0.35:d=0.15", m["silla"] - 0.2)
    f.append(("chi", "aevalsrc='0.06*sin(2*PI*(900*t-150*t*t)+3*sin(2*PI*7*t))*sin(PI*t/0.9)':s=44100:d=0.9", m["tiembla"] + 0.1))
    # 6. La puerta cede
    ruido("cru", 0.8, "white", "bandpass=f=900:width_type=h:w=1400,afade=t=out:st=0:d=0.8,volume=0.3", m["cede"])
    f.append(("g2", f"{golpe},volume=0.15", m["cede"]))
    # 7 a 9. Viento en la cornisa, la mano que sale, uñas de Chispa que se alejan
    d_vi = ini["nombre"] - ini["ventana"]
    ruido("vie", d_vi, "pink", f"highpass=f=150,lowpass=f=700,volume='0.3*(0.6+0.4*sin(2*PI*0.3*t))':eval=frame,afade=t=in:d=0.4,afade=t=out:st={d_vi - 0.4:.2f}:d=0.4", ini["ventana"])
    ruido("gru", 0.7, "brown", "lowpass=f=260,volume='0.5*(0.5+0.5*sin(2*PI*26*t))':eval=frame,afade=t=out:st=0.5:d=0.2", m["manoM"])
    d_un = m["pierde"] + 0.6 - m["suelta"]
    f.append(("una", f"aevalsrc='0.2*(2*random(0)-1)*lt(mod(t*9,1),0.08)*max(0,1-t/{d_un:.2f})':s=44100:d={d_un:.3f},highpass=f=2500", m["suelta"]))
    # 10. Latido fuerte
    d_la = ini["azotea"] - ini["nombre"]
    f.append(("lat", f"aevalsrc='(sin(2*PI*52*mod(t,0.62))*exp(-22*mod(t,0.62))+0.6*sin(2*PI*48*mod(t-0.18,0.62))*exp(-22*mod(t-0.18,0.62))*gte(t,0.18))':"
                     f"s=44100:d={d_la:.3f},volume=0.17", ini["nombre"]))
    # 11. Escalerita de fierro y la puerta de la bodega
    t_ = ini["azotea"]
    k = 0
    while t_ < m["azoteaM"]:
        f.append((f"fe{k}", f"{fierro},volume=0.35", t_))
        t_ += 0.34
        k += 1
    f.append(("pue", f"{madera},volume=0.32", cierra))
    # 12. En la bodega: abajo se arrastran pasos
    d_ab = ini["vibra"] - m["casa"]
    ruido("aba", d_ab, "brown", f"lowpass=f=180,volume='0.4*(0.3+0.7*abs(sin(2*PI*0.7*t)))':eval=frame,afade=t=in:d=0.6,afade=t=out:st={d_ab - 0.5:.2f}:d=0.5", m["casa"])
    # 13 a 15. El celular vibra; tensión que sube con la foto; un golpe agudo en la placa
    f.append(("vb1", vibra, m["vibra"] - 0.1))
    f.append(("vb2", vibra, m["tengo"] - 0.1))
    d_te = fin["nota"] - ini["foto"]
    f.append(("ten", f"aevalsrc='0.027*sin(2*PI*(110+40*t/{d_te:.2f})*t)+0.018*sin(2*PI*(116.5+42*t/{d_te:.2f})*t)':s=44100:d={d_te:.3f},"
                     f"afade=t=in:d=1,afade=t=out:st={d_te - 0.4:.2f}:d=0.4", ini["foto"]))
    f.append(("pla", "aevalsrc='0.07*(sin(2*PI*1568*t)+sin(2*PI*1661*t))*exp(-3*t)':s=44100:d=1.5", m["placa"]))
    f.append(("vb3", vibra, ini["baja"] + 0.15))
    f.append(("vb4", vibra, m["subo"]))
    f.append(("vb5", vibra, m["llave"]))
    # 17. La decisión: golpe y un pulso grave hasta el final
    f.append(("g3", f"{golpe},volume=0.15", ini["decide"]))
    d_de = dur - ini["decide"]
    f.append(("pul", f"aevalsrc='0.04*sin(2*PI*55*t)*(0.5+0.5*sin(2*PI*1.2*t))':s=44100:d={d_de:.3f},afade=t=in:d=0.5,afade=t=out:st={d_de - 1:.2f}:d=1", ini["decide"]))

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
