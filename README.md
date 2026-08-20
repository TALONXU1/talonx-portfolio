# TalonX Homepage

TalonX 的 AI 广告视频与视觉传达个人主页，面向 Contra、Upwork、品牌方和远程创意团队。

## 当前定位

- AI advertising video
- Campaign visual direction
- Visual communication

主页暂不展示项目案例。现有 AI 产品、拼贴图像和叙事静帧均保留为本地实验素材，不作为商业能力证明。

## 在线访问

- GitHub Pages: <https://talonxu1.github.io/talonx-portfolio/>
- 当前版本：暖色编辑感、互动 Shader、服务型个人主页

## 本地打开

可以直接双击 `index.html`，也可以在本目录启动任意静态服务器。例如：

```powershell
python -m http.server 4173
```

然后访问 `http://localhost:4173/`。

## 设计与实现

- 暖纸色、陶土橙和石墨色组成单一浅色主题。
- 首屏保留互动 Shader 与人物视觉。
- 支持响应式导航、键盘焦点和 reduced motion。
- 原生 HTML、CSS 和 JavaScript，无构建步骤。
- GitHub Pages 可直接从仓库根目录发布。

## 主要文件

- `index.html`：主页结构和文案。
- `app.js`：导航、内容 reveal 和动效控制。
- `hero-shader.js`：首屏 Shader。
- `styles.css`：响应式视觉系统。
- `assets/portrait-talonx-cutout.webp`：透明人物图。
- `assets/works/`：暂不公开的实验素材。
