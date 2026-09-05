#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
make_subtitles.py — 白板拆书视频字幕生成器
把词级卡点的 cue 列表生成 HyperFrames 用的字幕 HTML 片段 + GSAP 动画 JS 片段。

用法：
  python3 make_subtitles.py cues.json --out-html subs.html --out-js subs.js
  python3 make_subtitles.py --demo   # 打印内置示例

cues.json 结构（JSON 数组，每项一条字幕）：
  {
    "start": 0.00, "end": 2.68, "group": 1,
    "segs": [["你有没有发现，", 0], ["越努力加班", 1], ["的人", 0]]
  }
  segs 每项 = [文本, 是否高亮(1/0)]；group = 所属镜头号（用于按镜头调整位置）。

输出：
  字幕 <div class="clip subclip" data-g=...> 片段
  GSAP tl.fromTo(...) 弹出 + tl.to(...) 淡出 + tl.set autoAlpha:0 硬清除
样式约定（与白板便签风一致，渲染装配阶段使用）：
  .subpill { position:absolute; left:18%; right:18%; bottom:4.5%;
             background:rgba(255,253,248,.94); border:3px solid #333; border-radius:26px;
             padding:22px 32px; text-align:center; }
  .subtext { color:#2b2b2b; font-size:56px; font-weight:800; line-height:1.32; }
  .subtext .hl { color:#d0341f; }
"""
import argparse
import json
import sys


def esc(t: str) -> str:
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def render(cues, out_html, out_js):
    html_lines, js_lines = [], []
    for i, c in enumerate(cues, 1):
        cid = f"sub{i:02d}"
        s = float(c["start"])
        e = float(c["end"])
        g = int(c.get("group", 1))
        inner = "".join(
            f'<span class="hl">{esc(t)}</span>' if h else esc(t)
            for t, h in c["segs"]
        )
        html_lines.append(
            f'      <div id="{cid}" class="clip subclip" data-g="{g}" '
            f'data-start="{s:.2f}" data-duration="{e - s:.2f}" data-track-index="1">\n'
            f'        <div class="subpill"><span class="subtext">{inner}</span></div>\n'
            f'      </div>'
        )
        js_lines.append(
            f'      tl.fromTo("#{cid} .subpill", {{ opacity: 0, scale: 0.96, y: 12 }}, '
            f'{{ opacity: 1, scale: 1, y: 0, duration: 0.28, ease: "power2.out" }}, {s:.2f});'
        )
        js_lines.append(
            f'      tl.to("#{cid} .subpill", {{ opacity: 0, y: -8, duration: 0.16, ease: "power1.in" }}, {e - 0.16:.2f});'
        )
        js_lines.append(
            f'      tl.set("#{cid} .subpill", {{ autoAlpha: 0 }}, {e:.2f});'
        )
    open(out_html, "w", encoding="utf-8").write("\n".join(html_lines))
    open(out_js, "w", encoding="utf-8").write("\n".join(js_lines))
    print(f"ok: {len(cues)} cues -> {out_html} ({len(html_lines)} lines) + {out_js} ({len(js_lines)} lines)")


DEMO = [
    {"start": 0.00, "end": 2.68, "group": 1, "segs": [["你有没有发现，", 0], ["越努力加班", 1], ["的人", 0]]},
    {"start": 2.68, "end": 3.64, "group": 1, "segs": [["往往越穷", 1]]},
    {"start": 4.24, "end": 6.34, "group": 1, "segs": [["《纳瓦尔宝典》里有一句", 0], ["扎心", 1], ["的话", 0]]},
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("cues", nargs="?", help="cues JSON 文件路径")
    ap.add_argument("--out-html", default="subs.html")
    ap.add_argument("--out-js", default="subs.js")
    ap.add_argument("--demo", action="store_true", help="打印内置示例")
    args = ap.parse_args()

    if args.demo or not args.cues:
        render(DEMO, args.out_html, args.out_js)
        return
    with open(args.cues, encoding="utf-8") as f:
        cues = json.load(f)
    render(cues, args.out_html, args.out_js)


if __name__ == "__main__":
    sys.exit(main())
