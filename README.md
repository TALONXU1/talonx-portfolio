# TalonX Portfolio

许天乐（TalonX）的 AI 视觉设计、UI/UX 与 AI-native 个人作品集。

## 在线访问

- GitHub Pages: <https://talonxu1.github.io/talonx-portfolio/>
- 当前版本：暖纸色颗粒主题
- 旧版比较：`TalonX-portfolio-dark-spectral-2026-08-11.html`

## 内容顺序

1. Resume 首屏
2. 个人信息与创作判断路径
3. ChronoAxis / vibe coding / 市场研究到交付
4. Gathered Scenes
5. Between Stops 主视觉
6. 评价与留言

## 本地打开

可以直接双击 `index.html`，也可以在本目录运行：

```powershell
python -m http.server 4173
```

然后访问 `http://localhost:4173/`。

## 编辑文字

1. 点击左上角隐藏编辑热区、按 `E`，或直接双击任意正文。
2. 89 个文字元素都可以独立修改。
3. 点击“保存”，或按 `Ctrl+S` / `Cmd+S`，修改会保存在当前浏览器。
4. 点击“导出 HTML”，可以下载包含当前文字、页面图片和简历 PDF 的单文件版本。
5. “恢复默认”会清除当前浏览器保存的文字修改。

## 留言功能

- 页面底部的勾和叉都会打开留言框。
- 未配置接口时，留言保存在访问者当前浏览器的 `localStorage`。
- 如需集中收取留言，在 `#feedback` 上填写 `data-feedback-endpoint`，页面会 POST JSON。
- 请求字段：`reaction`、`name`、`contact`、`message`、`page`、`createdAt`。
- 远程提交失败时仍保留本地副本。
- 打印时保留“值得继续聊吗？”版块，隐藏编辑器和留言弹窗。

## 设计与实现

- 暖纸色、陶土红与石墨色组成单一浅色主题。
- 人像舞台使用低密度 Canvas 颗粒动效，移动端自动减量。
- 系统开启“减少动态效果”时，颗粒保持静态。
- 网站为原生 HTML、CSS 和 JavaScript，无构建步骤。
- GitHub Pages 直接从 `main` 分支根目录发布。

## 主要文件

- `index.html`：响应式网站、动效、文字编辑器与留言功能。
- `assets/portrait-talonx-cutout.webp`：透明底人像网页版本。
- `assets/works/`：网页优化后的作品 WebP。
- `assets/icons/`：统一风格的 Illustrator、Photoshop 与 Codex SVG 图标。
- `assets/TalonX_AI视觉设计师简历.pdf`：当前 4 页 A4 简历作品集。
- `assets/TalonX_AI视觉设计师简历-dark-spectral-2026-08-11.pdf`：旧深色版比较文件。

## 部署说明

仓库不需要安装依赖或执行构建命令。推送到 `main` 后，GitHub Pages 会直接发布根目录中的 `index.html`。

