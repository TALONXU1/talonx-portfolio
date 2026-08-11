# Design Notes

## Design read

面向 AI 视觉设计岗位招聘者的保留式改版。信息结构保持稳定，视觉语言调整为暖纸色、陶土红与石墨色；动态颗粒只服务于抠图人像的空间层次。

- `DESIGN_VARIANCE: 8`
- `MOTION_INTENSITY: 5`
- `VISUAL_DENSITY: 3`
- 主题：暖纸色颗粒背景、深色文字、单一陶土红强调色
- 形状语言：直角、细边框、轻编辑感
- 主动效：Canvas 低密度颗粒、指针视差、滚动出现
- 无障碍：键盘焦点、对话框焦点循环、reduced motion、打印保留反馈结论

## 信息架构

1. Resume
2. Personal information
3. ChronoAxis / vibe coding
4. Gathered Scenes
5. Between Stops / main visuals
6. Feedback

## Requirement coverage

| 要求 | 实现 |
| --- | --- |
| Resume 优先 | 全屏第一屏与固定导航第一项 |
| 个人信息第二 | `#profile` 直接位于首屏后 |
| 人像抠图动效 | 透明 WebP 人像、Canvas 颗粒、指针视差与 reduced motion |
| 图标统一放在人像下方 | 3 个等尺寸单色工具瓦片，无可见说明文字 |
| ChronoAxis 提高优先级 | 第一个案例，包含市场研究到交付路径 |
| Gathered Scenes 第二 | 独立作品章节与非对称图像编排 |
| 主视觉最后 | Between Stops 作为最后一个作品章节 |
| 直接编辑文字 | 89 个唯一 `data-edit-id`，支持 E、双击、保存与导出 |
| 留言功能 | 勾叉选择、弹窗表单、本地保存与可配置 POST 接口 |
| PDF 保留反馈 | 网站打印模式与 4 页 PDF 末页均显示反馈结论 |
| 旧版可比较 | 旧 HTML 与旧 PDF 使用日期化文件名单独保留 |

## QA record

- 1440 x 960 与 390 x 844 均无横向溢出。
- 14 张页面图片全部加载。
- 89 个 `data-edit-id` 全部唯一。
- 双击编辑、E 切换、保存、刷新恢复均通过。
- 单文件 HTML 往返打开后仍可编辑，缺图数为 0。
- 勾叉可打开留言框，本地保存成功；打印媒体中反馈区保持可见。
- 最新 PDF 为 4 页 A4，逐页渲染检查无裁切、重叠、缺字或破图。

## Design review

PASS

- 最强部分：ChronoAxis 形成从市场研究、机会定义到原型验证的完整主案例。
- 视觉边界：颗粒只用于人像舞台与纸张质感，正文保持安静。
- 部署边界：远程留言接口尚未配置，当前线上留言只保存在访问者本机。

