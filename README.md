# 悖论的灰烬：冰层之下 v5.4 (Paradox Ashes: Beneath the Ice)
---

## 🧊 版本更新日志 (Changelog v5.4)

本次更新代号 **"Beneath the Ice"**，是对核心体验的深度重制与扩展。

* **✨ 新增：冰层深潜 (The Glacier Sub-layer)**
    * 引入了 **WebGL Fragment Shader**，在浏览器中实时渲染动态的冰层裂隙、气泡与光影折射。
    * 新增“潜入”交互模式，探索被冻结的文明底层日志。
* **🎵 音频引擎重构 (Audio Engine v5.4)**
    * **Audio Soften:** 优化了混音算法，减少了高频刺耳感，增加了动态压缩 (Compressor)。
    * **Procedural Music:** 现在的背景音不再只是轰鸣，而是基于数学逻辑生成的 **Synthwave (合成波)** 旋律，包含随机琶音 (Arpeggios) 和基于小调音阶的 Pad 铺底。
* **🛠️ UI/UX 修复**
    * 修复了移动端侧边栏的交互逻辑。
    * 新增“紧急上浮”界面与磨砂玻璃 (Backdrop Blur) UI 组件。
<img width="2554" height="1387" alt="image" src="https://github.com/user-attachments/assets/943a0de1-5fe5-44a7-80c2-546488d96564" />

---

## 🌌 项目简介 (Introduction)

《悖论的灰烬》是一个**纯前端的互动式视听艺术作品**。

在这个版本中，我们将视角从地表的灰烬延伸到了地底的**永久冻土**。用户不仅是观测者，更是考古学家，通过终端指令和视觉交互，拼凑出一个关于“效率与浪漫”共致毁灭的文明拼图。

这不是一个网页，而是一个运行在浏览器里的“数字挖掘现场”。

## ✨ 核心特性 (Features)

### 1. 原生 WebGL 冰层渲染
摒弃了贴图，使用 GLSL 着色器语言 (Shader) 实时计算每一个像素：
* **FBM (分形布朗运动):** 模拟冰面自然的裂痕走向。
* **动态光影:** 模拟深海/深冰下的幽闭光感。

### 2. 沉浸式程序化音频 (Procedural Audio)
所有声音均由 **Web Audio API** 实时合成，**没有任何 MP3 文件**：
* **智能作曲:** 代码内置了乐理逻辑（音阶、小节），每次打开网页听到的旋律都是独一无二的随机组合。
* **物理模拟:** 列车的撞击声、全息图的故障音、光束的充能声均由振荡器实时演算。

### 3. 动态粒子生态
* **Beam:** 粒子爆发与物理下落模拟。
* **Snow:** 堆积算法，雪会随着时间在屏幕底部积聚。
* **Train:** 视觉暂留模拟的高速列车线条。
![Uploading image.png…]()

## 🚀 如何运行 (How to Run)

保持了该项目一贯的极简主义（Zero-Dependency）：

1.  **下载:** 获取本仓库代码。
2.  **运行:** 双击 v5.4.html直接在浏览器打开。
3.  **注意:** 请务必**点击屏幕并开启音频**，这是体验的核心部分。

## 🕹️ 隐藏指令 (Easter Eggs)

* 尝试在侧边栏点击底部的 `0x5F2A...`。
* 在“冻土”章节，寻找潜入冰层的按钮。
* 列车速度可以被超频至 `INF` (无限)。

## 🤖 关于创作者 (Credits)

**Concept & Direction:** Inderwish
**Code Generation & Shader Logic:**Gemini 3 Pro Preview

> *开发者注：*
> v5.4 是对这个虚拟世界物理规则的一次完善。我们不仅制造了灰烬，现在还冻结了时间。希望你在那些破碎的冰层代码中，能听到前文明的最后一声叹息。

## 📜 开源协议 (License)

MIT License. 所有的代码、着色器和音频算法均开放给所有人学习与修改。

---

*System State: FROZEN. Waiting for input...*
