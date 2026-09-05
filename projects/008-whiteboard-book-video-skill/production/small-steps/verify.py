"""Check the delivered video's streams, actual timing, transcript coverage and cues."""
import json
import re
import subprocess
from pathlib import Path

root=Path(__file__).resolve().parent
def probe(path):
    return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(path)]))
video=probe(root/'web-video.mp4')
v=next(s for s in video['streams'] if s['codec_type']=='video')
a=next(s for s in video['streams'] if s['codec_type']=='audio')
assert (v['width'],v['height'],v['codec_name'],v['r_frame_rate'])==(1080,1920,'h264','30/1')
assert a['codec_name']=='aac'
timing=json.loads((root/'timing.json').read_text())
assert abs(float(video['format']['duration'])-timing[-1]['end'])<.1
cues=json.loads((root/'cues.json').read_text(encoding='utf-8'))
assert all(c['end']-c['start']>=.44 for c in cues)
assert all(x['end']<=y['start'] for x,y in zip(cues,cues[1:]))
clean=lambda s: re.sub(r'[^\w\u4e00-\u9fff]','',s)
story=json.loads((root/'story.json').read_text(encoding='utf-8'))
for shot in story['shots']:
    group=[c for c in cues if c['group']==shot['id']]
    assert clean(''.join(t for c in group for t,_ in c['segs']))==clean(shot['narration'])
    t=timing[shot['id']-1]
    assert all(c['start']>=t['start']-.01 and c['end']<=t['end']+.01 for c in group)
report={'resolution':'1080x1920','fps':30,'video':'h264','audio':'aac','duration_seconds':float(video['format']['duration']),'voice_seconds':timing[-1]['end'],'cue_count':len(cues),'script_coverage':'all narration characters, punctuation removed','timing_source':'MiniMax provider word timestamps; not independently ASR-verified','music':'none; sidechain mixing not exercised','subtitle_shim':'opacity entrance replaced with autoAlpha after upstream script generation'}
(root/'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False))
