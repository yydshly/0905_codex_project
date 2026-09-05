"""MiniMax adapter for this reproduction; NOT part of the upstream skill.
Credentials are loaded locally and never written into outputs or printed.
"""
import argparse
import json
import os
from pathlib import Path
from urllib.parse import urlparse
import requests

ROOT = Path(__file__).resolve().parent

def local_settings(filename):
    settings = {}
    if filename:
        path = Path(filename).expanduser()
        raw = path.read_text(encoding='utf-8-sig')
        if path.suffix.lower() == '.json':
            settings = json.loads(raw)
        else:
            for line in raw.splitlines():
                line = line.strip()
                if not line or line.startswith('#') or '=' not in line:
                    continue
                name, value = line.removeprefix('export ').split('=', 1)
                settings[name.strip()] = value.strip().strip('\"\'')
    return settings

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', help='Local .env or JSON; never commit this file')
    parser.add_argument('--voice', default='male-qn-qingse')
    parser.add_argument('--model', default='speech-2.8-hd')
    parser.add_argument('--only', type=int)
    args = parser.parse_args()
    cfg = local_settings(args.config)
    key = os.environ.get('MINIMAX_API_KEY') or cfg.get('MINIMAX_API_KEY') or cfg.get('api_key')
    base = cfg.get('MINIMAX_API_BASE') or os.environ.get('MINIMAX_API_BASE') or 'https://api.minimax.cn'
    if not key:
        raise SystemExit('MiniMax credential not configured; provide a local config path.')
    if urlparse(base).scheme != 'https' or urlparse(base).hostname not in {'api.minimax.cn','api.minimax.io','api.minimaxi.com','api-bj.minimaxi.com','api-uw.minimax.io'}:
        raise SystemExit('API endpoint must be an explicitly supported official MiniMax host.')
    out = ROOT / 'audio'
    out.mkdir(exist_ok=True)
    story = json.loads((ROOT / 'story.json').read_text(encoding='utf-8-sig'))
    for shot in story['shots']:
        number = shot['id']
        if args.only and number != args.only:
            continue
        destination = out / f'shot-{number:02}.mp3'
        if destination.exists():
            print(f'shot {number}: existing audio retained')
            continue
        payload = {'model':args.model, 'text':shot['narration'], 'stream':False,
                   'voice_setting':{'voice_id':args.voice,'speed':1.0,'vol':1.0,'pitch':0},
                   'audio_setting':{'sample_rate':32000,'bitrate':128000,'format':'mp3','channel':1},
                   'language_boost':'Chinese','subtitle_enable':True,'subtitle_type':'word','output_format':'hex'}
        response = requests.post(base.rstrip('/')+'/v1/t2a_v2',json=payload,
                                 headers={'Authorization':'Bearer '+key},timeout=180)
        if not response.ok:
            raise SystemExit(f'MiniMax request failed: HTTP {response.status_code}; credential not printed.')
        data = response.json()
        if data.get('base_resp',{}).get('status_code') != 0:
            raise SystemExit(f"MiniMax rejected request, code {data.get('base_resp',{}).get('status_code')}; inspect account locally.")
        audio = data.get('data',{}).get('audio')
        if not audio:
            raise SystemExit('MiniMax returned no audio; no output fabricated.')
        destination.write_bytes(bytes.fromhex(audio))
        subtitle = data.get('data',{}).get('subtitle_file')
        if subtitle:
            transcript_response = requests.get(subtitle,timeout=60)
            transcript_response.raise_for_status()
            (out/f'shot-{number:02}.subtitles.json').write_bytes(transcript_response.content)
        # Persist only nonsecret provider/format metadata, never signed URLs or keys.
        metadata = {'provider':'MiniMax','model':args.model,'voice_id':args.voice,
                    'extra_info':data.get('extra_info',{}),'has_subtitles':bool(subtitle)}
        (out/f'shot-{number:02}.meta.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2),encoding='utf-8')
        print(f'shot {number}: audio saved, subtitle_file={bool(subtitle)}')

if __name__ == '__main__':
    main()
