"""Mezcla el audio de la temporada 2, parte 6 (El centro de alerta): voz, campanita del voto, el túnel (retumbe y
goteras), latidos, olfateos, la mordida y el chillido de Chispa, la estampida, la carrera, la escalera de metal, la
puerta y la luz, viento afuera, gemidos de Chispa, el reloj, el zumbido de la sala, el teclado del registro, el "bip"
de la tarjeta, la puerta que se abre, la risa de Memo y los golpes del cierre.

Uso: python3 -I mezcla.py tl.js ../audio/t2parte6/narracion.mp3 salida.m4a
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
    mordida = m["muerdeM"] + 0.15
    luz = m["luz"] - 0.05
    bip = m["tarjeta"] + 0.5

    golpe = "aevalsrc='0.9*sin(2*PI*(42+40*exp(-9*t))*t)*exp(-2.6*t)':s=44100:d=2"
    clic = "aevalsrc='0.4*(2*random(0)-1)*exp(-120*t)':s=44100:d=0.08,highpass=f=2000"
    sti = "aevalsrc='0.045*(sin(2*PI*622*t)+sin(2*PI*659*t)+sin(2*PI*932*t))*exp(-2*t)':s=44100:d=2.2"

    def ruido(etiqueta, d, color, filtros, t0):
        f.append((etiqueta, f"anoisesrc=color={color}:amplitude=0.8:d={d:.3f},{filtros}", t0))

    def latidos(etiqueta, t0, t1, vol, periodo=0.85):
        d = t1 - t0
        f.append((etiqueta, f"aevalsrc='{vol}*sin(2*PI*52*t)*(exp(-28*mod(t,{periodo}))+0.7*exp(-28*mod(t+{periodo - 0.22:.2f},{periodo})))':s=44100:d={d:.3f},"
                            f"lowpass=f=180,afade=t=in:d=0.4,afade=t=out:st={d - 0.3:.2f}:d=0.3", t0))

    def olfateo(etiqueta, t0, vol=0.25):
        ruido(etiqueta, 0.5, "pink", f"bandpass=f=2200:width_type=h:w=1500,volume='{vol}*gt(sin(2*PI*5*t),0)':eval=frame,afade=t=out:st=0.3:d=0.2", t0)

    def chillido(etiqueta, t0, d=0.45, vol=0.06):
        f.append((etiqueta, f"aevalsrc='{vol}*sin(2*PI*(1500*t-600*t*t/{d}))*sin(PI*t/{d})':s=44100:d={d},lowpass=f=3500", t0))

    f = []  # (etiqueta, filtro, inicio)
    # Ambiente: abajo el retumbe y las goteras; afuera viento; adentro el zumbido de la sala
    f.append(("abj", f"anoisesrc=color=brown:amplitude=0.6:d={luz:.3f},lowpass=f=110,volume=0.16,afade=t=out:st={luz - 0.3:.2f}:d=0.3", 0))
    f.append(("got", f"aevalsrc='0.25*sin(2*PI*(1400+300*sin(t))*t)*exp(-40*mod(t,1.7))*gt(sin(2*PI*0.37*t+1),-0.2)':s=44100:d={ini['muerde']:.3f},aecho=0.8:0.6:300:0.4,volume=0.12", 0))
    d_vi = ini["sala"] - luz
    f.append(("vie", f"anoisesrc=color=pink:amplitude=0.6:d={d_vi:.3f},lowpass=f=500,volume='0.09*(0.6+0.4*sin(2*PI*0.3*t))':eval=frame,afade=t=in:d=0.3,afade=t=out:st={d_vi - 0.4:.2f}:d=0.4", luz))
    d_hu = ini["decide"] + 0.5 - ini["sala"]
    f.append(("hum", f"aevalsrc='0.025*(sin(2*PI*60*t)+0.5*sin(2*PI*120*t))+0.004*sin(2*PI*7800*t)':s=44100:d={d_hu:.3f},afade=t=in:d=0.4,afade=t=out:st={d_hu - 0.6:.2f}:d=0.6", ini["sala"]))
    # 1. El voto
    f.append(("cam", "aevalsrc='0.07*(sin(2*PI*880*t)+0.6*sin(2*PI*1318.5*t)+0.4*sin(2*PI*1760*t))*exp(-3*t)':s=44100:d=1.5", 0.1))
    # 2. Te rozan y te huelen
    latidos("lat1", ini["rozan"], mordida, 0.12)
    olfateo("ol1", m["huelen"])
    olfateo("ol2", m["cara"] + 0.2, 0.3)
    # 3. Se agacha y la muerde; Chispa chilla
    d_te = mordida - m["agacha"]
    f.append(("ten", f"aevalsrc='0.025*sin(2*PI*(50+30*t/{d_te:.2f})*t)+0.02*sin(2*PI*(53+31*t/{d_te:.2f})*t)':s=44100:d={d_te:.3f},afade=t=out:st={d_te - 0.05:.2f}:d=0.05", m["agacha"]))
    ruido("mor", 0.25, "white", "lowpass=f=2500,afade=t=out:st=0.05:d=0.2,volume=0.5", mordida)
    f.append(("g1", f"{golpe},volume=0.1", mordida))
    chillido("chi1", mordida + 0.05, 0.5, 0.07)
    chillido("chi2", m["chillaM"] - 0.05, 0.7, 0.05)
    # 4. El túnel entero se te viene encima: gruñidos y estampida que crecen
    d_es = luz - m["tunel"]
    ruido("est", d_es, "pink", f"bandpass=f=320:width_type=h:w=220,volume='0.5*min(1,t/0.8)':eval=frame,afade=t=out:st={d_es - 0.3:.2f}:d=0.3", m["tunel"] - 0.1)
    f.append(("pis", f"aevalsrc='0.5*(2*random(0)-1)*(0.5+0.5*sin(2*PI*6.3*t))*(0.5+0.5*sin(2*PI*7.7*t+1))':s=44100:d={d_es:.3f},bandpass=f=500:width_type=h:w=500,afade=t=out:st={d_es - 0.3:.2f}:d=0.3,volume=0.4", m["tunel"]))
    # 5. Corres; la escalera de metal; la puerta; la luz
    d_co = m["escalera"] - ini["corres"]
    f.append(("cor", f"aevalsrc='0.12*sin(2*PI*75*t)*exp(-30*mod(t,0.24))':s=44100:d={d_co:.3f},lowpass=f=700", ini["corres"]))
    d_lad = m["puerta"] - m["escalera"]
    f.append(("lad", f"aevalsrc='0.3*(sin(2*PI*1900*t)+0.6*sin(2*PI*2700*t))*exp(-25*mod(t,0.3))':s=44100:d={d_lad:.3f},volume=0.12", m["escalera"]))
    f.append(("pta", f"{golpe},volume=0.12", m["puerta"] + 0.1))
    ruido("whi", 0.6, "pink", "bandpass=f=1500:width_type=h:w=2000,afade=t=in:d=0.3,afade=t=out:st=0.3:d=0.3,volume=0.35", luz - 0.3)
    # 6 a 8. Chispa tiembla: gemidos, latidos lentos y el reloj
    f.append(("gim", "aevalsrc='0.03*sin(2*PI*(650*t+120*t*t)+2*sin(2*PI*7*t))*sin(PI*t/1.0)':s=44100:d=1.0,lowpass=f=1200", m["tiembla"]))
    latidos("lat2", ini["pata"], ini["sala"], 0.1)
    d_di = ini["sala"] - ini["dias"]
    f.append(("tic", f"aevalsrc='0.3*(2*random(0)-1)*exp(-150*mod(t,1))':s=44100:d={d_di:.3f},highpass=f=2500,volume=0.3", ini["dias"]))
    f.append(("sti1", sti, m["dias2"]))
    # 9 a 11. El registro: bip de la pantalla y el teclado
    f.append(("pbe", "aevalsrc='0.05*sin(2*PI*1320*t)*lt(t,0.1)':s=44100:d=0.12", m["pantalla"]))
    for k, (t0, d) in enumerate([(m["dos"] - 0.6, 1.5), (m["usuario1"], 0.6), (m["cinco"] - 0.6, 1.2), (m["usuario2"], 0.8)]):
        f.append((f"tec{k}", f"aevalsrc='0.4*(2*random(0)-1)*exp(-90*mod(t,0.07))':s=44100:d={d:.3f},highpass=f=1800,volume=0.18", t0))
    f.append(("sti2", sti, m["usuario2"] + 0.4))
    # 12. La tarjeta: bip y la puerta que se abre
    f.append(("bip", "aevalsrc='0.07*(sin(2*PI*1800*t)*lt(t,0.1)+sin(2*PI*2400*t)*gt(t,0.13)*lt(t,0.24))':s=44100:d=0.3", bip))
    ruido("abr", 0.9, "brown", "lowpass=f=600,afade=t=in:d=0.2,afade=t=out:st=0.5:d=0.4,volume=0.4", bip + 0.2)
    # 13 a 15. Memo: un zumbido grave, su risa y la nota de "ya somos dos"
    d_me = ini["decide"] - ini["memo"]
    f.append(("dro", f"aevalsrc='0.025*sin(2*PI*55*t)+0.02*sin(2*PI*58.3*t)':s=44100:d={d_me:.3f},afade=t=in:d=0.6,afade=t=out:st={d_me - 0.5:.2f}:d=0.5", ini["memo"]))
    for k in range(4):
        ruido(f"je{k}", 0.13, "pink", "bandpass=f=900:width_type=h:w=700,afade=t=in:d=0.02,afade=t=out:st=0.06:d=0.07,volume=0.3", m["rie"] - 0.05 + k * 0.18)
    f.append(("sti3", sti, m["somos"]))
    # 16. La decisión
    f.append(("g2", f"{golpe},volume=0.05", ini["decide"]))
    f.append(("g3", f"{golpe},volume=0.04", m["comenta"]))

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
