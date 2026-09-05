# 背景音乐生成与混音规范

用 seed-audio skill（T2A 模式）生成 BGM，再用 ffmpeg 混入成片。

## 流程

1. **先问用户**：要活泼还是沉稳（或其他指定风格）——用户点名选择，禁止默认。
2. 用 `text_to_audio_plus` 生成一段 BGM（纯音乐、无人声）。**优先生成长 BGM**：时长按视频配音时长加余量，传 `duration`（如视频 70s 可生成 90s，在 1-120s 范围内），避免短段循环产生接缝断点；用户明确提出"1-2 分钟"等时长要求时按其要求传 `duration`。
3. 下载核验时长（长 BGM 通常 60-120s），用 ffmpeg `-t <视频时长>` 截取铺满并加淡入淡出（首 0.5s 淡入、末尾约 2.6s 淡出）；仅在生成长 BGM 不可行、只能得到 9-20s 短段时，才退回循环拼接（`-stream_loop -1`）。
4. 侧链压缩混音：**口播说话时 BGM 自动压低、停顿处恢复**，保证人声清晰同时有节奏垫底。
5. 响度验证：确认口播段清晰主导、间隙段 BGM 存在但低约 10-12dB、无削波。

## 风格 prompt 模板（可拓展）

- **活泼**：`轻快的背景音乐，用于手绘白板风知识科普短视频。手绘质感原声带风格，以清脆的木琴、尤克里里拨弦和轻快的节拍律动为主，节奏感明显但不吵闹，俏皮元气，中低音量，没有歌词没有人声`
- **沉稳**：`沉稳内敛的背景音乐，用于知识科普类口播视频垫底。以温暖的大提琴与钢琴为主，辅以柔和舒缓的弦乐铺底和低沉安静的节拍，中速偏慢，从容克制、略带思考沉淀的质感，低调有内涵但不沉闷，没有歌词没有人声`
- **其他风格**（由用户指定）：温暖治愈/科技感/国风/悬疑/史诗等，按需改乐器与氛围描述，保持"无人声、中低音量、不抢人声"三约束。

## ffmpeg 循环拼接（铺满视频时长 T）

```bash
ffmpeg -y -v error -stream_loop -1 -i bgm_raw.wav -t T \
  -af "afade=t=in:st=0:d=0.5,afade=t=out:st=T-2.6:d=2.6" \
  -ar 40000 -ac 2 assets/bgm_loop.wav
```

## 侧链 ducking 混音（关键命令）

```bash
ffmpeg -y -v error -i 成片.mp4 -i assets/bgm_loop.wav \
  -filter_complex "[1:a]volume=V[bgm];[bgm][0:a]sidechaincompress=threshold=0.03:ratio=5:attack=20:release=450[duck];[0:a][duck]amix=inputs=2:duration=first:dropout_transition=3:normalize=0,alimiter=limit=0.97[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k 成片_BGM.mp4
```

- **sidechain 方向不能反**：`[bgm][0:a]sidechaincompress`——main 是 BGM（被压对象），sidechain 是口播（触发源）。
- **必须加 `normalize=0`**：amix 默认归一化会把输入各减半（-6dB），导致口播整体变轻。
- 音量 V 依据 BGM 原始响度调整：目标 BGM 压缩后 mean 约 -30dB，`V = 10^((目标mean - BGM原始mean)/20)`，实测微调。

## 响度验证

```bash
ffmpeg -i out.mp4 -af volumedetect -f null - 2>&1 | grep -E "mean_volume|max_volume"
```
- 整体 mean 应与原口播一致（±1dB），max 不削波（< 0dBFS）。
- 口播密集段 mean 明显高于间隙段（BGM 恢复），口播始终主导。
