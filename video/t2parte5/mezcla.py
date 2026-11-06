"""Mezcla el audio de la temporada 2, parte 5 (El metro): voz, campanita del voto, viento afuera, el gemido de Chispa,
polvo que cae, el crujido de la losa y el ¡CRAC!, la caída con piedras y su eco por el túnel, goteras, latidos, un paso
con eco, pasos en la grava, la respiración del andén, la cinta que se despega, el "tin" de la placa en silencio,
las cabezas que giran y los golpes del cierre.

Uso: python3 -I mezcla.py tl.js ../audio/t2parte5/narracion.mp3 salida.m4a
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
    crac = m["cede"] + 0.35
    golpe_t = m["caes"] + 0.85
    tin = m["unavez"] - 0.75
    giran = m["giran"] - 0.1

    golpe = "aevalsrc='0.9*sin(2*PI*(42+40*exp(-9*t))*t)*exp(-2.6*t)':s=44100:d=2"
    clic = "aevalsrc='0.4*(2*random(0)-1)*exp(-120*t)':s=44100:d=0.08,highpass=f=2000"

    def ruido(etiqueta, d, color, filtros, t0):
        f.append((etiqueta, f"anoisesrc=color={color}:amplitude=0.8:d={d:.3f},{filtros}", t0))

    def latidos(etiqueta, t0, t1, vol, periodo=0.85):
        d = t1 - t0
        f.append((etiqueta, f"aevalsrc='{vol}*sin(2*PI*52*t)*(exp(-28*mod(t,{periodo}))+0.7*exp(-28*mod(t+{periodo - 0.22:.2f},{periodo})))':s=44100:d={d:.3f},"
                            f"lowpass=f=180,afade=t=in:d=0.4,afade=t=out:st={d - 0.3:.2f}:d=0.3", t0))

    f = []  # (etiqueta, filtro, inicio)
    # Ambiente: viento afuera; abajo, un zumbido grave y goteras
    f.append(("vie", f"anoisesrc=color=pink:amplitude=0.6:d={ini['caes']:.3f},lowpass=f=500,volume='0.09*(0.6+0.4*sin(2*PI*0.3*t))':eval=frame,afade=t=out:st={ini['caes'] - 0.5:.2f}:d=0.5", 0))
    d_ab = dur - ini["caes"]
    f.append(("abj", f"anoisesrc=color=brown:amplitude=0.6:d={d_ab:.3f},lowpass=f=110,volume=0.16,afade=t=in:d=1", ini["caes"]))
    d_go = dur - ini["silencio"]
    f.append(("got", f"aevalsrc='0.25*sin(2*PI*(1400+300*sin(t))*t)*exp(-40*mod(t,1.7))*gt(sin(2*PI*0.37*t+1),-0.2)':s=44100:d={d_go:.3f},aecho=0.8:0.6:300:0.4,volume=0.12", ini["silencio"]))
    # 1. El voto
    f.append(("cam", "aevalsrc='0.07*(sin(2*PI*880*t)+0.6*sin(2*PI*1318.5*t)+0.4*sin(2*PI*1760*t))*exp(-3*t)':s=44100:d=1.5", 0.1))
    # 2. Chispa reconoce el edificio: un gemido y el eco del aullido de cachorra
    f.append(("gim", "aevalsrc='0.03*sin(2*PI*(650*t+120*t*t)+2*sin(2*PI*7*t))*sin(PI*t/0.9)':s=44100:d=0.9,lowpass=f=1200", m["quieta"]))
    f.append(("rec", "aevalsrc='0.03*sin(2*PI*(760*t-300*cos(PI*min(t,1.6)/1.6)))*min(1,t/0.2)*min(1,max(0,1.8-t)/0.5)':s=44100:d=1.8,lowpass=f=1500,aecho=0.8:0.7:300:0.5", m["reconoce"]))
    # 3. El sótano: polvo que cae
    d_so = ini["cede"] - ini["sotano"]
    ruido("pol", d_so, "pink", f"highpass=f=2000,volume='0.05*(0.4+0.6*abs(sin(2*PI*1.1*t)))':eval=frame,afade=t=in:d=0.4,afade=t=out:st={d_so - 0.4:.2f}:d=0.4", ini["sotano"])
    # 4. La losa cruje y cede
    d_cr = crac - (m["pisas"] + 0.4)
    ruido("cru", d_cr, "brown", f"lowpass=f=400,volume='0.15*(0.4+0.6*abs(sin(2*PI*5*t)))*t/{d_cr:.2f}':eval=frame", m["pisas"] + 0.4)
    ruido("crk", 0.4, "white", "highpass=f=800,afade=t=out:st=0:d=0.4,volume=0.3", crac)
    f.append(("crg", f"{golpe},volume=0.12", crac))
    # 5. La caída con piedras, el golpe y el eco por el túnel
    d_pi = golpe_t - (crac + 0.3)
    f.append(("pie", f"aevalsrc='0.5*(2*random(0)-1)*exp(-35*mod(t,0.11))':s=44100:d={d_pi:.3f},bandpass=f=900:width_type=h:w=1200,volume=0.35", crac + 0.3))
    f.append(("cae", f"{golpe},volume=0.25,aecho=0.8:0.7:250|500|800:0.5|0.35|0.2", golpe_t))
    ruido("cae2", 0.5, "brown", "lowpass=f=800,afade=t=out:st=0:d=0.5,volume=0.8", golpe_t)
    f.append(("reb", "aevalsrc='0.4*sin(2*PI*(55+30*exp(-20*t))*t)*exp(-6*t)':s=44100:d=1,aecho=0.8:0.75:300|600|900:0.5|0.35|0.25,volume=0.4", m["rebota"]))
    # 6 a 9. Silencio con latidos; un paso con eco; pasos en la grava
    latidos("lat1", ini["silencio"] + 1.0, ini["anden"], 0.1)
    f.append(("pas", "aevalsrc='0.5*(2*random(0)-1)*exp(-40*t)':s=44100:d=0.3,bandpass=f=700:width_type=h:w=800,aecho=0.8:0.7:280|560:0.45|0.3,volume=0.5", m["haces"] - 0.1))
    d_vi = fin["vias"] - ini["vias"]
    f.append(("gra", f"aevalsrc='0.4*(2*random(0)-1)*exp(-45*mod(t,0.52))':s=44100:d={d_vi:.3f},bandpass=f=1500:width_type=h:w=2000,volume=0.12", ini["vias"]))
    # 10 y 11. El andén: la respiración de cientos, tensión que sube, latidos más rápidos
    d_an = tin - ini["anden"]
    ruido("res", d_an, "pink", f"bandpass=f=240:width_type=h:w=120,volume='0.15*(0.55+0.45*sin(2*PI*0.4*t))':eval=frame,afade=t=in:d=1,afade=t=out:st={d_an - 0.05:.2f}:d=0.05", ini["anden"])
    f.append(("ten", f"aevalsrc='0.025*sin(2*PI*(50+20*t/{d_an:.2f})*t)+0.02*sin(2*PI*(53+21*t/{d_an:.2f})*t)':s=44100:d={d_an:.3f},afade=t=out:st={d_an - 0.05:.2f}:d=0.05", ini["anden"]))
    latidos("lat2", ini["anden"], tin, 0.09, 0.6)
    # 12. La cinta se despega
    ruido("rip", 0.35, "white", "highpass=f=3000,volume='0.12*(0.5+0.5*sin(2*PI*60*t))':eval=frame,afade=t=out:st=0.2:d=0.15", m["dedos"] - 0.2)
    # 13. El "tin" de la placa, en silencio total
    f.append(("tin", "aevalsrc='0.12*(sin(2*PI*2400*t)+0.6*sin(2*PI*3610*t)+0.35*sin(2*PI*5120*t))*exp(-4*t)':s=44100:d=2,aecho=0.8:0.7:350|700|1050:0.5|0.35|0.2", tin))
    # 14. Las cabezas giran: un barrido, el gemido de cientos y un golpe
    ruido("bar", 0.7, "pink", "bandpass=f=800:width_type=h:w=1200,afade=t=in:d=0.25,afade=t=out:st=0.3:d=0.4,volume=0.5", giran - 0.2)
    d_gi = ini["decide"] - giran + 0.5
    ruido("gem", d_gi, "pink", f"bandpass=f=300:width_type=h:w=200,volume='0.35*min(1,t/0.4)':eval=frame,afade=t=out:st={d_gi - 0.6:.2f}:d=0.6", giran)
    f.append(("g1", f"{golpe},volume=0.12", giran))
    f.append(("sti", "aevalsrc='0.045*(sin(2*PI*622*t)+sin(2*PI*659*t)+sin(2*PI*932*t))*exp(-2*t)':s=44100:d=2.2", giran + 0.05))
    # 15. La decisión
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
