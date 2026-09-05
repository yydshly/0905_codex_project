"""Local adapter. --draft is a SILENT layout proof, never audio alignment evidence."""
import argparse
import html
import json
import shutil
import subprocess
import sys
import re
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ap = argparse.ArgumentParser()
ap.add_argument('--draft', action='store_true')
args = ap.parse_args()
story = json.loads((ROOT / 'story.json').read_text(encoding='utf-8'))
out = ROOT / 'composition'
(out / 'assets').mkdir(exist_ok=True)
cues, scenes, animations = [], [], []
cursor = 0.0
timing = []
pcm = []
for shot in story['shots']:
    i = shot['id']
    start = cursor
    duration = 8.0
    if not args.draft:
        wav = ROOT / 'audio' / f'shot-{i:02}.wav'
        subprocess.run(['ffmpeg','-v','error','-y','-i',str(ROOT/'audio'/f'shot-{i:02}.mp3'),'-ar','48000','-ac','1',str(wav)],check=True)
        with wave.open(str(wav)) as audio:
            duration = audio.getnframes()/audio.getframerate()
            pcm.append(audio.readframes(audio.getnframes()))
        transcript=json.loads((ROOT/'audio'/f'shot-{i:02}.subtitles.json').read_text(encoding='utf-8-sig'))
        words=[w for segment in transcript for w in segment['timestamped_words']]
        clean=lambda s: re.sub(r'[^\w\u4e00-\u9fff]', '', s)
        assert clean(''.join(w['word'] for w in words)) == clean(shot['narration']), f'Shot {i}: transcript differs from narration'
        chunks=[]
        chunk=[]
        for w in words:
            if clean(w['word']):
                chunk.append(w)
            if not clean(w['word']) or len(chunk)>=14:
                if chunk: chunks.append(chunk);chunk=[]
        if chunk: chunks.append(chunk)
        n=0
        while n<len(chunks):
            if (chunks[n][-1]['time_end']-chunks[n][0]['time_begin'])<600:
                if n+1<len(chunks) and len(chunks[n])+len(chunks[n+1])<=16:
                    chunks[n:n+2]=[chunks[n]+chunks[n+1]]
                    continue
                if n>0 and len(chunks[n-1])+len(chunks[n])<=16:
                    chunks[n-1:n+1]=[chunks[n-1]+chunks[n]]
                    n-=1
                    continue
            n+=1
        for chunk in chunks:
            text=''.join(w['word'] for w in chunk)
            s=start+chunk[0]['time_begin']/1000
            e=min(start+duration,start+chunk[-1]['time_end']/1000)
            assert e>s and s>=start and e<=start+duration
            cues.append({'start':round(s,2),'end':round(e,2),'group':i,'segs':[[text, int(any(k in text for k in ['两页','小动作','第一步','先开始']))]]})
    timing.append({'shot':i,'start':start,'duration':duration,'end':start+duration})
    cursor+=duration
    shutil.copy2(ROOT / 'assets' / shot['image'], out / 'assets' / shot['image'])
    scenes.append(f'<section id="shot{i}" class="clip scene" data-start="{start}" data-duration="{duration}" data-track-index="0"><div class="wb" id="wb{i}"><img src="assets/{shot["image"]}" alt="{html.escape(shot["title"])}"></div></section>')
    animations.append(f'tl.fromTo("#wb{i}", {{"--p":"{0 if i == 1 else 55}%"}}, {{"--p":"110%",duration:{1.8 if i == 1 else 1.5},ease:"power1.inOut"}}, {start});')
    animations.append(f'tl.fromTo("#shot{i} img", {{scale:1}}, {{scale:1.06,duration:{duration},ease:"sine.inOut"}}, {start});')
    for n, caption in enumerate(shot['captions'] if args.draft else []):
        width = 8 / len(shot['captions'])
        cues.append({'start':round(start + n * width, 2), 'end':round(start + (n+1)*width, 2), 'group':i, 'segs':[[caption, 1 if n == len(shot['captions'])-1 else 0]]})
cue_path=ROOT / ('draft-cues.json' if args.draft else 'cues.json')
cue_path.write_text(json.dumps(cues, ensure_ascii=False, indent=2), encoding='utf-8')
if not args.draft:
    with wave.open(str(out/'assets/vo.wav'),'wb') as audio:
        audio.setnchannels(1);audio.setsampwidth(2);audio.setframerate(48000);audio.writeframes(b''.join(pcm))
    (ROOT/'timing.json').write_text(json.dumps(timing,indent=2),encoding='utf-8')
upstream = ROOT.parent.parent / 'vendor/whiteboard-book-video-skill/scripts/make_subtitles.py'
subprocess.run([sys.executable, str(upstream), str(cue_path), '--out-html', str(out/'subs.html'), '--out-js', str(out/'subs.js')], check=True)
subs = (out/'subs.html').read_text(encoding='utf-8')
subjs = (out/'subs.js').read_text(encoding='utf-8')
# Compatibility shim: upstream's opacity-only entrance does not restore visibility
# after its autoAlpha:0 exit during backward seeking. Keep raw output unmodified.
subjs = subjs.replace('{ opacity: 0, scale:', '{ autoAlpha: 0, scale:').replace('{ opacity: 1, scale:', '{ autoAlpha: 1, scale:')
page = '''<!doctype html><html lang="zh-CN" data-resolution="portrait"><head><meta charset="utf-8"><meta name="viewport" content="width=1080,height=1920"><script src="assets/gsap.min.js"></script><style>
@font-face{font-family:"Microsoft YaHei";src:local("Microsoft YaHei")}*{box-sizing:border-box;margin:0}html,body,#root{width:1080px;height:1920px;overflow:hidden;background:#fff;font-family:"Microsoft YaHei",sans-serif}.clip{position:absolute;inset:0}.scene{overflow:hidden;background:white}.wb{position:absolute;inset:0;-webkit-mask-image:linear-gradient(135deg,#000 0%,#000 calc(var(--p,0%) - 7%),transparent calc(var(--p,0%)));mask-image:linear-gradient(135deg,#000 0%,#000 calc(var(--p,0%) - 7%),transparent calc(var(--p,0%)))}img{width:1080px;height:1920px;object-fit:contain}.subpill{position:absolute;left:16%;right:16%;bottom:4.5%;background:rgba(255,253,248,.96);border:3px solid #333;border-radius:24px;padding:14px 26px;text-align:center;box-shadow:0 4px 9px #0001}.subtext{color:#2b2b2b;font-size:42px;font-weight:800;line-height:1.32;white-space:nowrap}.hl{color:#d0341f}.draft{position:absolute;bottom:20px;left:0;width:100%;text-align:center;font-size:25px;color:#555}
</style></head><body><div id="root" data-composition-id="main" data-start="0" data-duration="56" data-width="1080" data-height="1920">'''
page=page.replace('data-duration="56"',f'data-duration="{cursor}"')
if not args.draft:
    page=page.replace('font-size:42px','font-size:38px')
media='<div class="draft">无声分镜草稿 · 固定时长 · 尚未配音对齐</div>' if args.draft else f'<audio id="voice" src="assets/vo.wav" data-start="0" data-duration="{cursor}" data-track-index="10" data-volume="1"></audio>'
page += '\n'.join(scenes) + subs + media + '</div><script>window.__timelines=window.__timelines||{};const tl=gsap.timeline({paused:true});'
page += '\n'.join(animations) + subjs + 'window.__timelines["main"]=tl;</script></body></html>'
(out/'index.html').write_text(page, encoding='utf-8')
print(f'Assembled: 7 shots, {cursor:.3f} s, {len(cues)} cues; draft={args.draft}.')
