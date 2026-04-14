# 🎨 图片颜色聚类可视化系统

## 📋 项目概述

一个基于 **K-means 聚类算法** 的智能图像颜色分析系统，集成 ECharts 图表浏览和 AI 颜色评价功能。支持 RGB 和 LAB 两种颜色空间，能够自动识别图片中的主色调并进行美学分析。

**运行示例**
![neko](https://res.cloudinary.com/dzcjdspdy/image/upload/v1776144905/PixPin_2026-04-14_13-08-27_m1ik8q.png)
![lingyin](https://res.cloudinary.com/dzcjdspdy/image/upload/v1776144913/PixPin_2026-04-14_13-15-19_g6gqzp.png)

**核心特性：**
- ✅ 上传图片自动提取颜色数据
- ✅ 可调节 K 值（3-10）实时聚类
- ✅ RGB/LAB 两种颜色空间切换
- ✅ 多种图表展示方式（饼图/柱状图）
- ✅ AI 驱动的颜色搭配评价
- ✅ 颜色分布块状展示

---

## 🏗️ 项目结构

```
ColorVisualization/
├── index.html          # UI 框架
├── main.js             # 核心逻辑入口
├── kmeans.js           # K-means 聚类算法
├── color.js            # RGB ↔ LAB 颜色空间转换
├── Echarts.js          # 图表渲染引擎
├── process.js          # 图像像素提取
├── ai.js               # AI 颜色分析
└── README.md           # 项目说明文档
```

---


## 🚀 使用指南

### 基础操作

1. **打开应用**
   - 在浏览器中打开 `index.html`
   - 或直接打开[http://sumire233.github.io/ColorVisualization](http://sumire233.github.io/ColorVisualization) ，代码已托管在github pages

2. **上传图片**
   - 点击"选择文件"按钮
   - 选择 PNG、JPG、GIF 等格式的图片

3. **调节 K 值**
   - 拖动滑块选择聚类数量（3-10）
   - 实时更新聚类结果

4. **切换设置**
   - 图表类型：饼图 / 柱状图
   - 颜色空间：RGB / LAB

### 高级配置

**RGB vs LAB 选择建议：**
- RGB：快速预览，计算量小
- LAB：更符合人眼感知，聚类效果更优

**K 值选择建议：**
- K = 3-5：适合简洁风格
- K = 5-8：适合多彩设计
- K = 8-10：适合复杂分析

---

## 📊 数据流程图

```
用户上传图片
     ↓
getImagePixels() 提取像素
     ↓
根据 colorSpace 转换
  (RGB or LAB)
     ↓
kmeans() 聚类
     ↓
计算聚类统计
(color, count)
     ↓
├─→ renderChart() 绘制图表
├─→ renderColorBlocks() 绘制颜色块
└─→ analyzeColors() AI 分析
     ↓
展示结果
```

---

## 📦 核心模块说明

### 1. **index.html** - 用户界面层
负责搭建整个应用的界面框架，使用 Tailwind CSS 美化样式。

**主要区块：**
- 顶部标题栏
- 控制面板：文件上传、K 值调节、图表类型选择、颜色空间切换
- 原图预览区
- 图表展示区（动态渲染）
- AI 分析结果展示
- 颜色分布块展示

**依赖库：**
- [Tailwind CSS](https://cdn.tailwindcss.com) - UI 样式框架
- [ECharts](https://cdnjs.cloudflare.com/ajax/libs/echarts/5.4.0/echarts.min.js) - 图表库

### 2. **main.js** - 应用核心逻辑
整合所有模块，管理全局状态和交互流程。

**关键变量：**
- `currentK` - 当前聚类数量
- `currentPixels` - 提取的图像像素数据
- `currentChartType` - 图表类型（pie/bar）
- `currentColorSpace` - 颜色空间（rgb/lab）

**核心流程：**
```
1. 用户上传图片
   ↓
2. 提取像素数据（process.js）
   ↓
3. 根据颜色空间转换数据（color.js）
   ↓
4. K-means 聚类（kmeans.js）
   ↓
5. 渲染图表（Echarts.js）
   ↓
6. 调用 AI 分析（ai.js）
   ↓
7. 展示颜色分布块
```

**主要函数：**
- `runKmeansAndRender()` - 执行聚类并渲染结果
- 事件监听器处理用户交互

### 3. **kmeans.js** - 聚类算法实现
实现标准的 K-means 聚类算法。

**算法流程：**
1. 随机初始化 K 个聚类中心
2. 循环迭代（最多 10 次）：
   - 将每个点分配到最近的中心
   - 根据分配结果更新中心
3. 返回最终的中心点和聚类结果

**关键函数：**
- `kmeans(data, k, maxIter=10)` - 主算法
  - `data`: 点数组 `[[r,g,b], ...]`
  - `k`: 聚类数量
  - 返回：`{centroids, clusters}`
- `distance(a, b)` - 欧几里得距离计算
- `mean(cluster)` - 计算聚类中心

**优化点：**
- 空聚类处理：若某聚类为空，随机选择一个点作为新中心
- 迭代次数固定，避免无限循环

### 4. **color.js** - 颜色空间转换
提供 RGB 和 LAB 颜色空间的相互转换。

**RGB vs LAB 对比：**

| 特性 | RGB | LAB |
|------|-----|-----|
| 定义 | 设备相关 | 感知均匀 |
| 用途 | 显示设备 | 人眼感知 |
| 聚类效果 | 较差 | 更优 |
| 计算复杂度 | 低 | 高 |

**转换公式：**
```
RGB [0-255] → RGB [0-1]
     ↓
Gamma 校正
     ↓
RGB → XYZ
     ↓
归一化（D65 白点）
     ↓
XYZ → LAB
```

**关键函数：**
- `rgb2lab([r, g, b])` - RGB 转 LAB
  - 输入：RGB 值 0-255
  - 输出：LAB 值 L[0-100], A[-128-127], B[-128-127]

### 5. **process.js** - 图像处理
从用户上传的图像提取像素数据。

**优化策略：**

| 优化 | 目的 | 方法 |
|------|------|------|
| 尺寸限制 | 加速处理 | 长边 ≤ 200px |
| 像素抽样 | 降低计算量 | 每 4 个取 1 个 |
| 透明过滤 | 去除噪声 | 过滤 α < 10 |

**关键函数：**
- `getImagePixels(img)` - 提取图像像素
  - 输入：Image 对象
  - 输出：`[[r,g,b], ...]` 数组

### 6. **Echarts.js** - 图表渲染
使用 ECharts 库渲染交互式图表。

**支持的图表类型：**

1. **饼图（Pie Chart）**
   - 显示各颜色的像素比例
   - 颜色块自动着色
   - 便于查看主色调占比

2. **柱状图（Bar Chart）**
   - X 轴：颜色值
   - Y 轴：像素数量
   - 柱子颜色自动着色

**关键函数：**
- `renderChart(data, type='pie')` - 渲染图表
  - `data`: `[{color: [r,g,b], count: n}, ...]`
  - `type`: 'pie' 或 'bar'

### 7. **ai.js** - AI 颜色分析
集成 Moonshot API，使用 AI 评价颜色搭配。

**功能：**
- 判断颜色搭配是否和谐
- 描述整体风格
- 推荐适用场景

**API 配置：**
- 服务商：Moonshot（Kimi）
- 模型：`moonshot-v1-8k`
- 请求方式：HTTPS POST

**关键函数：**
- `analyzeColors(colors)` - 分析颜色
  - 输入：颜色值数组 `['rgb(255,0,0)', ...]`
  - 返回：Promise，解析为评价文本

---