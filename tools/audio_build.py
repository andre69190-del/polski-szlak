#!/usr/bin/env python3
"""Erzeugt Tondateien mit kostenlosen Piper-Stimmen (MIT, Datensätze CC0) für alle Texte aus tools/audio_corpus.json.
   python3 tools/audio_build.py <modell-ordner> [stimme ...]   -> audio/<stimme>/<key>.mp3 und audio/voices.json
   Bereits vorhandene Dateien werden übersprungen (nur Neues erzeugen)."""
import json, sys, wave, pathlib, subprocess, tempfile, os, time
from concurrent.futures import ThreadPoolExecutor
from piper import PiperVoice
ROOT = pathlib.Path(__file__).resolve().parent.parent
MOD = pathlib.Path(sys.argv[1]); VOICES = sys.argv[2:] or ['gosia', 'darkman']
corpus = json.loads((ROOT / 'tools' / 'audio_corpus.json').read_text(encoding='utf-8'))
tmp = pathlib.Path(tempfile.mkdtemp())
def enc(wav, mp3):
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(wav), '-ac', '1', '-ar', '22050', '-b:a', '40k', str(mp3)], check=True); wav.unlink()
for v in VOICES:
    out = ROOT / 'audio' / v; out.mkdir(parents=True, exist_ok=True)
    voice = PiperVoice.load(str(MOD / f'pl_PL-{v}-medium.onnx'))
    todo = [(k, t) for k, t in corpus.items() if not (out / f'{k}.mp3').exists()]
    t0 = time.time(); pool = ThreadPoolExecutor(2); futs = []
    for i, (k, t) in enumerate(todo):
        w = tmp / f'{v}-{k}.wav'
        with wave.open(str(w), 'wb') as wf: voice.synthesize_wav(t.replace(' / ', ', '), wf)
        futs.append(pool.submit(enc, w, out / f'{k}.mp3'))
        if i % 200 == 0: print(v, i, '/', len(todo), '%.0fs' % (time.time() - t0), flush=True)
    [f.result() for f in futs]; pool.shutdown()
keys = sorted(k for k in corpus if all((ROOT / 'audio' / v / f'{k}.mp3').exists() for v in ['gosia', 'darkman']))
(ROOT / 'audio' / 'voices.json').write_text(json.dumps({'v': 1, 'voices': ['gosia', 'darkman'], 'keys': keys}, separators=(',', ':')), encoding='utf-8')
print('OK', len(keys), 'Texte mit beiden Stimmen')
