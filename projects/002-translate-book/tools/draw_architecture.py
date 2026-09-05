"""Draw the research architecture as PNG and SVG. Requires Pillow and CJK fonts."""
import argparse
import html
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--font', default='C:/Windows/Fonts/msyh.ttc')
    parser.add_argument('--bold-font', default='C:/Windows/Fonts/msyhbd.ttc')
    args = parser.parse_args()
    width, height = 1440, 1710
    bg, ink, muted = '#F7F8F5', '#20372F', '#627269'
    palettes = {
        'script': ('#EEF3FA', '#416B9C'),
        'ai': ('#EAF4EE', '#287150'),
        'state': ('#FFF3DF', '#956222'),
        'neutral': ('#FFFFFF', '#9EAFA3'),
    }
    img = Image.new('RGB', (width, height), bg)
    draw = ImageDraw.Draw(img)
    fonts = {}
    svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
           '<title id="title">translate-book：长内容并行翻译架构</title>',
           '<desc id="desc">从文档转换分块到 AI 并行翻译，术语反馈和状态记录支撑后续批次与重译，校验后合并导出。下游阅读学习为建议，未实现。</desc>',
           f'<rect width="{width}" height="{height}" fill="{bg}"/>',
           '<g font-family="Microsoft YaHei, Noto Sans CJK SC, sans-serif">']

    def text(x, y, value, size=23, color=ink, bold=False, max_width=None):
        key = (size, bold)
        if key not in fonts:
            fonts[key] = ImageFont.truetype(args.bold_font if bold else args.font, size)
        font = fonts[key]
        if max_width is not None and draw.textlength(value, font=font) > max_width:
            raise ValueError(f'Text exceeds its box: {value}')
        draw.text((x, y), value, font=font, fill=color, anchor='lt')
        svg.append(f'<text x="{x}" y="{y + size * .88:.1f}" font-size="{size}" font-weight="{700 if bold else 400}" fill="{color}">{html.escape(value)}</text>')

    def rect(x, y, w, h, fill, stroke, dashed=False):
        draw.rounded_rectangle((x, y, x+w, y+h), radius=15, fill=fill, outline=None if dashed else stroke, width=2)
        if dashed:
            for start in range(x+12, x+w-12, 18):
                draw.line((start, y, min(start+9, x+w-12), y), fill=stroke, width=2)
                draw.line((start, y+h, min(start+9, x+w-12), y+h), fill=stroke, width=2)
            for start in range(y+12, y+h-12, 18):
                draw.line((x, start, x, min(start+9, y+h-12)), fill=stroke, width=2)
                draw.line((x+w, start, x+w, min(start+9, y+h-12)), fill=stroke, width=2)
        dash = ' stroke-dasharray="9 9"' if dashed else ''
        svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="15" fill="{fill}" stroke="{stroke}" stroke-width="2"{dash}/>')

    def box(x, y, w, h, title, lines, kind='script', title_size=26):
        fill, color = palettes[kind]
        rect(x, y, w, h, fill, color)
        text(x+22, y+21, title, title_size, color, True, w-44)
        for i, line in enumerate(lines):
            text(x+22, y+64+i*33, line, 22, ink, max_width=w-44)

    def arrow(points, color='#81958A', dashed=False):
        if dashed:
            for a, b in zip(points, points[1:]):
                length = math.dist(a, b)
                for start in range(0, int(length), 16):
                    p = tuple(a[i]+(b[i]-a[i])*start/length for i in (0, 1))
                    q = tuple(a[i]+(b[i]-a[i])*min(start+8, length)/length for i in (0, 1))
                    draw.line((p, q), fill=color, width=3)
        else:
            draw.line(points, fill=color, width=3)
        a, b = points[-2:]
        angle = math.atan2(b[1]-a[1], b[0]-a[0])
        triangle = [b] + [(b[0]-13*math.cos(angle+d), b[1]-13*math.sin(angle+d)) for d in (-.48, .48)]
        draw.polygon(triangle, fill=color)
        coords = ' '.join(f'{x},{y}' for x, y in points)
        dash = ' stroke-dasharray="8 8"' if dashed else ''
        svg.append(f'<polyline points="{coords}" fill="none" stroke="{color}" stroke-width="3"{dash}/>')
        coords = ' '.join(f'{x:.1f},{y:.1f}' for x, y in triangle)
        svg.append(f'<polygon points="{coords}" fill="{color}"/>')

    def section(y, index, title, subtitle):
        text(60, y, index, 25, '#81958A', True)
        text(113, y-2, title, 28, ink, True)
        text(580, y+2, subtitle, 21, muted)

    text(60, 44, '一本书，如何交给多个 AI 协作翻译', 42, ink, True)
    text(60, 106, 'translate-book  /  架构研究  /  2026-09-05  /  commit 5d07e733', 23, muted)
    for x, label, kind in [(60, '脚本与转换工具', 'script'), (360, 'AI 语义任务', 'ai'), (640, '共享记录', 'state')]:
        fill, color = palettes[kind]
        rect(x, 153, 20, 20, fill, color)
        text(x+33, 150, label, 22, color)
    text(960, 150, '示意图 · 非运行截图', 22, muted)

    section(220, '01', '转换与分块', '文件结构与长度驱动；不是全书语义理解')
    box(60, 270, 360, 155, '输入与格式转换', ['PDF / DOCX / EPUB', 'Calibre → HTMLZ → HTML'])
    box(490, 270, 420, 155, 'Markdown → 源文块', ['Pandoc 转换；目标约 6,000 字符', '识别标题、段落、表格等结构'])
    box(980, 270, 400, 155, '记录源文件与块清单', ['source_fingerprint.json', 'manifest.json：顺序与源文哈希'], 'state')
    arrow([(420, 347), (482, 347)])
    arrow([(910, 347), (972, 347)])
    arrow([(700, 425), (700, 468)])

    section(487, '02', '规划与并行翻译', '每块独立上下文；默认每批 8 个，依环境调整')
    box(60, 540, 1320, 130, '主 AI 代理 + run_state.py：决定哪些块需要处理', ['读取 Skill 与现有状态 → 建立 / 读取术语表 → 安排翻译、补记状态或跳过'], 'ai')
    arrow([(720, 670), (720, 709)])
    text(170, 716, '每块输入：正文 + 相关 / 高频术语 + 前后各约 300 字符只读片段', 24, muted)
    for x, title in [(60, '子代理 A · chunk0001'), (510, '子代理 B · chunk0002'), (960, '子代理 … · chunkNNNN')]:
        box(x, 766, 420, 144, title, ['AI 翻译当前块，保留内容结构', '写译文 + 独立 meta 观察文件'], 'ai', 25)
        arrow([(x+210, 910), (x+210, 944)])

    section(964, '03', '反馈与状态记录', '先记录本批次状态，再合并观察与更新术语')
    box(60, 1015, 420, 150, '术语观察与冲突', ['新实体 / 别名 / 证据', '主代理判断，脚本合并'], 'ai')
    box(510, 1015, 420, 150, 'glossary.json', ['规范译名、别名与术语约定', '主代理统一写入共享词表'], 'state')
    box(960, 1015, 420, 150, 'run_state.json', ['源文 / 译文 / 所用术语哈希', '续跑与后续局部重译的依据'], 'state')
    arrow([(480, 1080), (503, 1080)], '#956222')
    arrow([(1380, 1100), (1412, 1100), (1412, 605), (1387, 605)], '#956222', True)
    text(60, 1191, '反馈用于后续批次；已有块是否重译，由后续规划判断。共享状态由主代理统一写入。', 23, '#956222')
    arrow([(720, 1225), (720, 1260)])

    section(1279, '04', '校验与交付', '先检查文件与结构，再合并和重建排版')
    box(60, 1330, 625, 141, '脚本校验', ['缺块 / 空白 / 源文变化 / 图片引用异常', '不能证明没有漏译、误译或风格偏差'])
    box(755, 1330, 625, 141, '合并 → Pandoc / Calibre', ['Markdown → 带目录 HTML → DOCX / EPUB / PDF', '输出重新排版，不保证原书版式复刻'])
    arrow([(685, 1400), (747, 1400)])

    rect(60, 1507, 1320, 110, '#FFFFFF', '#87988C', True)
    text(82, 1524, '对我们的衔接 · 下游建议，尚未实现', 25, ink, True)
    text(82, 1567, '001 外刊来源 → 本项目翻译处理架构 → 双语对齐 → 精读、笔记与复习', 25, ink)
    text(60, 1654, '研究边界：只做源码架构梳理，未运行整本书翻译，未测评质量 / 速度 / 成本；本项目无 Web 部署。', 21, muted)
    svg.append('</g></svg>')
    assets = Path(__file__).resolve().parents[1] / 'assets'
    assets.mkdir(exist_ok=True)
    img.save(assets / 'architecture.png', optimize=True)
    (assets / 'architecture.svg').write_text('\n'.join(svg)+'\n', encoding='utf-8')
    print(f'Generated architecture.png and architecture.svg ({width} x {height}).')


if __name__ == '__main__':
    main()
