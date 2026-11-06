"""Mezcla el audio de la temporada 2, parte 3 (La tienda): voz, campanita del voto, el último golpe y el celular que
entra raspando, los pasos que suben a la azotea, los avisos de mensaje, latidos, pájaros del amanecer, el lápiz del
mapa, los pitidos de Rosa en el radio, la alerta que se corta a los 60 segundos, pasos de carrera, el llavero,
la cortina de la tienda, el reloj, el gemido de Chispa y los golpes del cierre.

Uso: python3 -I mezcla.py tl.js ../audio/t2parte3/narracion.mp3 salida.m4a
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
    celular = m["algo"] - 0.2
    alerta = m["suena"] - 0.1
    corte = m["calla"] + 0.3
    llave = m["llave"] + 0.1
    cortina = m["cortinaM"] + 0.1
    t32 = corte - 2

    golpe = "aevalsrc='0.9*sin(2*PI*(42+40*exp(-9*t))*t)*exp(-2.6*t)':s=44100:d=2"
    clic = "aevalsrc='0.4*(2*random(0)-1)*exp(-120*t)':s=44100:d=0.08,highpass=f=2000"
    pum = "aevalsrc='0.9*sin(2*PI*(60+50*exp(-30*t))*t)*exp(-14*t)+0.4*(2*random(0)-1)*exp(-60*t)':s=44100:d=0.6,lowpass=f=900"
    llaves = "aevalsrc='0.12*(2*random(0)-1)*lt(mod(t*9,1),0.12)*(sin(2*PI*4200*t)+sin(2*PI*5600*t))*exp(-2*t)':s=44100:d=1.0,highpass=f=3000"
    ding = "aevalsrc='0.06*(sin(2*PI*1318.5*t)*exp(-6*t)+0.7*sin(2*PI*1760*(t-0.12))*exp(-6*(t-0.12))*gt(t,0.12))':s=44100:d=0.9"
    fase = "2*PI*700*t-500*cos(PI*t)"
    sirena = f"aevalsrc='0.5*sin({fase})+0.15*sin(3*({fase}))':s=44100:d={{d:.3f}},lowpass=f=2800,aecho=0.8:0.6:120:0.35"

    def ruido(etiqueta, d, color, filtros, t0):
        f.append((etiqueta, f"anoisesrc=color={color}:amplitude=0.8:d={d:.3f},{filtros}", t0))

    def acorde(etiqueta, t0, t1, vol, notas="220,277.2,329.6"):
        d = t1 - t0
        suma = "+".join(f"sin(2*PI*{n}*t)" for n in notas.split(","))
        f.append((etiqueta, f"aevalsrc='{vol}*({suma})*min(1,t/1.0)':s=44100:d={d:.3f},afade=t=out:st={max(0.1, d - 1):.2f}:d=1", t0))

    def latidos(etiqueta, t0, t1, vol, periodo=0.85):
        d = t1 - t0
        f.append((etiqueta, f"aevalsrc='{vol}*sin(2*PI*52*t)*(exp(-28*mod(t,{periodo}))+0.7*exp(-28*mod(t+{periodo - 0.22:.2f},{periodo})))':s=44100:d={d:.3f},"
                            f"lowpass=f=180,afade=t=in:d=0.4,afade=t=out:st={d - 0.4:.2f}:d=0.4", t0))

    def pasos(etiqueta, t0, t1, vol, periodo):
        d = t1 - t0
        f.append((etiqueta, f"aevalsrc='{vol}*sin(2*PI*75*t)*exp(-30*mod(t,{periodo}))+{vol * 0.4}*(2*random(0)-1)*exp(-80*mod(t,{periodo}))':s=44100:d={d:.3f},lowpass=f=700,afade=t=out:st={d - 0.3:.2f}:d=0.3", t0))

    f = []  # (etiqueta, filtro, inicio)
    f.append(("amb", f"anoisesrc=color=brown:amplitude=0.6:d={dur},lowpass=f=160,volume=0.12", 0))
    # 1. El voto
    f.append(("cam", "aevalsrc='0.07*(sin(2*PI*880*t)+0.6*sin(2*PI*1318.5*t)+0.4*sin(2*PI*1760*t))*exp(-3*t)':s=44100:d=1.5", 0.1))
    # 2. El último golpe, silencio y el celular que entra raspando
    f.append(("pum", f"{pum},aecho=0.8:0.5:180:0.3,volume=0.5", ini["celular"]))
    ruido("ras", 0.6, "pink", "bandpass=f=2500:width_type=h:w=2000,afade=t=in:d=0.05,afade=t=out:st=0.4:d=0.2,volume=0.35", celular)
    f.append(("vib", "aevalsrc='0.05*sin(2*PI*160*t)*gt(mod(t,0.6),0.3)':s=44100:d=1.8,afade=t=out:st=1.4:d=0.4", celular + 0.7))
    # 3. Memo corre escaleras arriba; los de la escalera lo siguen
    pasos("pm", m["azotea"] - 1.4, m["azotea"] + 1.2, 0.14, 0.26)
    d_si = fin["arriba"] - m["todos"] + 0.3
    f.append(("sig", f"aevalsrc='0.4*(2*random(0)-1)*(0.5+0.5*sin(2*PI*3.7*t))*(0.5+0.5*sin(2*PI*5.1*t+1))':s=44100:d={d_si:.3f},bandpass=f=450:width_type=h:w=400,afade=t=in:d=0.3,afade=t=out:st={d_si - 0.5:.2f}:d=0.5,volume=0.35", m["todos"] - 0.3))
    # 4 y 5. Los mensajes
    f.append(("d1", ding, m["primera"] - 0.1))
    f.append(("d2", ding, m["operadora"] - 0.1))
    d_ms = fin["otro"] - ini["mensaje"]
    f.append(("dro", f"aevalsrc='0.025*sin(2*PI*55*t)+0.02*sin(2*PI*58*t)':s=44100:d={d_ms:.3f},afade=t=in:d=0.6,afade=t=out:st={d_ms - 0.5:.2f}:d=0.5", ini["mensaje"]))
    f.append(("sti", "aevalsrc='0.05*(sin(2*PI*740*t)+sin(2*PI*784*t)+sin(2*PI*1046.5*t))*exp(-2.5*t)':s=44100:d=2", m["traela"]))
    # 6. Rosa: latidos y un acorde triste en "mi niña"
    latidos("lat1", ini["vendio"], fin["vendio"], 0.14)
    acorde("tri", m["nina"], fin["vendio"] + 0.6, 0.018, "220,261.6,329.6")
    # 7. Amanece: pájaros lejanos y gemidos arriba
    d_am = fin["amanece"] - ini["amanece"]
    f.append(("paj", f"aevalsrc='0.02*sin(2*PI*(2600+500*sin(2*PI*9*t))*t)*gt(sin(2*PI*0.7*t),0.6)':s=44100:d={d_am:.3f},afade=t=in:d=0.5,afade=t=out:st={d_am - 0.5:.2f}:d=0.5", ini["amanece"]))
    d_ge = fin["amanece"] - m["croquetas"] + 0.3
    ruido("gem", d_ge, "pink", f"bandpass=f=300:width_type=h:w=180,volume='0.2*(0.5+0.5*sin(2*PI*1.4*t))':eval=frame,afade=t=in:d=0.4,afade=t=out:st={d_ge - 0.4:.2f}:d=0.4", m["croquetas"] - 0.3)
    # 8. El lápiz traza la ruta en la libreta
    ruido("lap", 1.2, "white", "bandpass=f=3500:width_type=h:w=3000,volume='0.18*(0.6+0.4*sin(2*PI*11*t))':eval=frame,afade=t=in:d=0.05,afade=t=out:st=1.0:d=0.2", m["patio"] - 0.4)
    # 9. Rosa pita en el radio (igual que la tecla que baja en escenas.js)
    t0p = ini["pide"]
    d_pi = m["noventa"] - t0p
    f.append(("pit", f"aevalsrc='0.05*sin(2*PI*760*t)*gt(sin(22*(t+{t0p:.3f})),0.3)':s=44100:d={d_pi:.3f},afade=t=out:st={d_pi - 0.05:.2f}:d=0.05", t0p))
    f.append(("g1", f"{golpe},volume=0.08", m["noventa"]))
    # 10 a 12. La alerta de 90 segundos que se corta a los 60; la carrera, las llaves, la cortina
    d_al = corte - alerta
    f.append(("sir", sirena.format(d=d_al) + ",volume=0.06,afade=t=in:d=0.15", alerta))
    pasos("pc", m["corres"] - 0.1, cortina - 0.1, 0.1, 0.22)
    f.append(("lla", f"{llaves},volume=0.8", llave))
    f.append(("cor", f"aevalsrc='0.5*(2*random(0)-1)*(0.5+0.5*sin(2*PI*32*t))*exp(-1.5*t)':s=44100:d=0.8,bandpass=f=1800:width_type=h:w=2500,volume=0.3", cortina))
    latidos("lat2", alerta, fin["chispa"], 0.09, 0.55)
    # 13. El reloj segundo a segundo y el corte: un golpe sordo y silencio
    for k, t0 in enumerate([t32, t32 + 1]):
        f.append((f"tic{k}", f"{clic},volume=0.7", t0))
    f.append(("g2", f"{golpe},volume=0.1", corte))
    # 14. Chispa entre ellos: gemidos y un chillido bajito
    d_ch = fin["chispa"] - ini["chispa"]
    ruido("gem2", d_ch, "pink", f"bandpass=f=280:width_type=h:w=160,volume='0.25*(0.5+0.5*sin(2*PI*1.2*t))':eval=frame,afade=t=in:d=0.4,afade=t=out:st={d_ch - 0.4:.2f}:d=0.4", ini["chispa"])
    f.append(("chi", "aevalsrc='0.035*sin(2*PI*(900*t+200*t*t)+1.5*sin(2*PI*7*t))*sin(PI*t/0.7)':s=44100:d=0.7", m["siguio"] + 0.3))
    f.append(("sti2", "aevalsrc='0.04*(sin(2*PI*622*t)+sin(2*PI*659*t)+sin(2*PI*932*t))*exp(-2*t)':s=44100:d=2.2", m["entre"]))
    # 15. La decisión
    f.append(("g3", f"{golpe},volume=0.05", ini["decide"]))
    f.append(("g4", f"{golpe},volume=0.04", m["comenta"]))

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
