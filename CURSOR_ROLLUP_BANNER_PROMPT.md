# 真成分易拉宝生成器 - 复古游戏机风格

## 📋 核心要求

⚠️ **必须100%复刻现有UI的视觉风格！参考 `src/app/globals.css` 和所有组件的设计！**

### 文件规格
- **格式**：PDF
- **尺寸**：80cm × 200cm（竖版）
- **分辨率**：150 DPI
- **像素尺寸**：4724 × 11811 px
- **色彩**：CMYK

### 内容来源
- **严格使用** `海报文本.txt` 中的文案
- **不得修改任何文字**

---

## 🎨 UI设计精髓（参考现有组件）

### 核心配色
```css
--retro-green: #009640;     /* 主背景 */
--retro-yellow: #FDE700;    /* 强调色 */
--retro-black: #0F380F;     /* 深绿黑 */
--retro-white: #FAFAFA;     /* 纯白 */
--retro-gray: #8BAC0F;      /* 辅助色 */
```

### 关键设计元素（从现有UI提取）

#### 1. 3D立体效果（核心特征！）
```css
/* 参考 MyList 页签的实现 */
.card-3d {
  position: relative;
}
.card-3d::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--retro-black);
  transform: translate(12px, 12px); /* 大阴影！ */
  z-index: -1;
}
.card-3d-content {
  background: white;
  border: 6px solid var(--retro-black); /* 超粗边框 */
  position: relative;
  z-index: 1;
}
```

#### 2. 黑底黄字标题块（参考 Sundial 标题）
```css
.title-block {
  background: var(--retro-black);
  color: var(--retro-yellow);
  border: 6px solid var(--retro-yellow);
  padding: 40px 60px;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 900;
  font-size: 100px; /* 超大！ */
  text-transform: uppercase;
  letter-spacing: 8px;
}
```

#### 3. retro-border 卡片（复用现有class）
```css
.retro-border {
  border: 6px solid var(--retro-black);
  box-shadow:
    inset 0 0 0 4px var(--retro-yellow),  /* 内嵌黄边 */
    12px 12px 0 0 var(--retro-black);      /* 硬阴影 */
  background: white;
  padding: 60px;
}
```

#### 4. retro-button 按钮风格
```css
.retro-button {
  background: var(--retro-yellow);
  border: 6px solid var(--retro-black);
  color: var(--retro-black);
  box-shadow:
    inset -4px -4px 0 0 rgba(0,0,0,0.2),
    8px 8px 0 0 var(--retro-black);
  font-weight: 900;
  font-size: 50px;
  text-transform: uppercase;
  letter-spacing: 4px;
  padding: 30px 60px;
  font-family: 'JetBrains Mono', monospace;
}
```

#### 5. 字体规范（超重要！）
```css
/* 主标题 */
font-family: 'Noto Sans SC', sans-serif;
font-weight: 900; /* BLACK */
font-size: 180px; /* 巨大！ */
text-transform: uppercase;

/* 章节标题 */
font-family: 'JetBrains Mono', monospace;
font-weight: 900;
font-size: 80px;

/* 正文中文 */
font-family: 'Noto Sans SC', sans-serif;
font-weight: 400;
font-size: 50px; /* 不要小！ */
line-height: 1.8;

/* 正文英文 */
font-family: 'JetBrains Mono', monospace;
font-style: italic;
font-size: 44px;
line-height: 1.6;
```

#### 6. 装饰元素
- **旋转指针**（RotatingPointer 组件风格）：
  ```html
  <svg width="60" height="60" style="animation: rotate 2s linear infinite;">
    <polygon points="10,10 10,50 30,30 50,50 50,10" fill="#FDE700" stroke="#0F380F" stroke-width="3"/>
    <polygon points="30,30 50,10 50,50" fill="#009640" stroke="#0F380F" stroke-width="3"/>
  </svg>
  ```

- **粗分割线**：
  ```css
  height: 12px;
  background: var(--retro-yellow);
  box-shadow: 0 8px 0 var(--retro-black);
  margin: 100px 0;
  ```

---

## 📐 海报布局设计（5个区块）

### 整体画布设置
```css
#rollup-banner {
  width: 4724px;
  height: 11811px;
  background: #009640; /* 绿色背景 */
  background-image:
    linear-gradient(rgba(253, 231, 0, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(253, 231, 0, 0.08) 1px, transparent 1px);
  background-size: 48px 48px; /* 网格 */
  padding: 200px 250px;
  overflow: hidden;
}
```

---

### 区块1：顶部巨幅标题（占15%，~1770px）

```html
<!-- 3D立体标题 -->
<div class="header-section" style="margin-bottom: 250px;">
  <!-- 3D阴影层 -->
  <div style="position: relative;">
    <div style="position: absolute; inset: 0; background: #0F380F; transform: translate(20px, 20px);"></div>

    <!-- 主标题块 -->
    <div style="background: #0F380F; border: 8px solid #FDE700; padding: 80px; text-align: center; position: relative;">
      <!-- 旋转指针装饰 -->
      <div style="display: flex; align-items: center; justify-content: center; gap: 40px;">
        <svg width="80" height="80" class="rotating-pointer">...</svg>

        <h1 style="font-size: 200px; font-weight: 900; color: #FDE700; letter-spacing: 20px; font-family: 'Noto Sans SC', sans-serif;">
          真成分
        </h1>

        <svg width="80" height="80" class="rotating-pointer">...</svg>
      </div>

      <div style="font-size: 80px; color: #FAFAFA; font-family: 'JetBrains Mono', monospace; letter-spacing: 12px; margin-top: 20px;">
        TRUE FORMULA
      </div>
    </div>
  </div>

  <!-- 粗黄色分割线 -->
  <div style="height: 16px; background: #FDE700; box-shadow: 0 10px 0 #0F380F; margin: 100px 0;"></div>

  <!-- 宣言文字（白底黑字卡片）-->
  <div class="retro-border" style="text-align: center; padding: 80px;">
    <p style="font-size: 60px; font-weight: 700; color: #0F380F; margin-bottom: 30px;">
      拒绝营销滤镜，还原内容真相。
    </p>
    <p style="font-size: 52px; font-style: italic; color: #009640; font-family: 'JetBrains Mono', monospace;">
      Decode the Noise. Design Your Biology.
    </p>
  </div>
</div>
```

**样式重点**：
- ✅ 3D translate阴影（20px偏移）
- ✅ 黑底黄字
- ✅ 超粗边框（8px）
- ✅ 旋转指针装饰
- ✅ 字号巨大（200px标题）

---

### 区块2：项目愿景（占25%，~2950px）

```html
<div class="content-section" style="margin-bottom: 300px;">
  <!-- 章节标题（3D黄色块）-->
  <div style="position: relative; margin-bottom: 120px;">
    <div style="position: absolute; inset: 0; background: #0F380F; transform: translate(15px, 15px);"></div>
    <div style="background: #FDE700; border: 6px solid #0F380F; padding: 50px 70px; position: relative;">
      <h2 style="font-size: 90px; font-weight: 900; color: #0F380F; font-family: 'JetBrains Mono', monospace; letter-spacing: 6px;">
        01. 项目愿景 / VISION
      </h2>
    </div>
  </div>

  <!-- 内容卡片（白底，带内嵌黄边）-->
  <div class="retro-border" style="padding: 80px;">
    <p style="font-size: 52px; line-height: 1.8; color: #0F380F; margin-bottom: 60px; font-weight: 400;">
      在算法推荐的时代，我们的身体成为了营销号的试验场。海量的健康建议中，有效信息仅占 1%，其余皆为情绪煽动与伪科学。
    </p>
    <p style="font-size: 46px; line-height: 1.6; color: #009640; font-style: italic; margin-bottom: 80px; font-family: 'JetBrains Mono', monospace;">
      In the era of algorithmic recommendations, our bodies have become testing grounds for marketing. Amidst massive health advice, only 1% is valid information; the rest is emotional manipulation and pseudoscience.
    </p>

    <p style="font-size: 52px; line-height: 1.8; color: #0F380F; margin-bottom: 60px; font-weight: 400;">
      我们不做信息的搬运工，我们是生物数据的编译器。
    </p>
    <p style="font-size: 46px; line-height: 1.6; color: #009640; font-style: italic; margin-bottom: 80px; font-family: 'JetBrains Mono', monospace;">
      We are not information couriers; we are compilers of biological data.
    </p>

    <p style="font-size: 52px; line-height: 1.8; color: #0F380F; margin-bottom: 60px; font-weight: 700;">
      True Formula 将非结构化的视频流视为待处理的杂乱代码，通过多模态 AI 进行"蒸馏"，提取出纯净、可执行的<span style="background: #FDE700; padding: 0 20px;">生物代码 (Bio-Code)</span>。
    </p>
    <p style="font-size: 46px; line-height: 1.6; color: #009640; font-style: italic; font-family: 'JetBrains Mono', monospace;">
      True Formula treats unstructured video streams as messy code to be processed, "distilling" them through Multimodal AI to extract pure, executable <span style="background: #FDE700; padding: 0 10px; color: #0F380F;">Bio-Code</span>.
    </p>
  </div>

  <!-- 细分割线 -->
  <div style="height: 4px; background: rgba(255,255,255,0.3); margin: 150px 0;"></div>
</div>
```

---

### 区块3：运作机理（占25%，~2950px）

```html
<div class="content-section" style="margin-bottom: 300px;">
  <!-- 章节标题 -->
  <div style="position: relative; margin-bottom: 120px;">
    <div style="position: absolute; inset: 0; background: #0F380F; transform: translate(15px, 15px);"></div>
    <div style="background: #FDE700; border: 6px solid #0F380F; padding: 50px 70px; position: relative;">
      <h2 style="font-size: 90px; font-weight: 900; color: #0F380F; font-family: 'JetBrains Mono', monospace; letter-spacing: 6px;">
        02. 运作机理 / MECHANISM
      </h2>
    </div>
  </div>

  <!-- 列表项（绿色边框卡片）-->
  <div style="display: flex; flex-direction: column; gap: 60px;">
    <!-- 项目1 -->
    <div style="border: 6px solid #009640; background: white; padding: 60px; position: relative;">
      <div style="display: flex; gap: 40px; align-items: start;">
        <div style="width: 60px; height: 60px; background: #FDE700; border: 4px solid #0F380F; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 50px; font-weight: 900;">
          •
        </div>
        <div>
          <h3 style="font-size: 56px; font-weight: 900; color: #0F380F; margin-bottom: 30px; font-family: 'JetBrains Mono', monospace;">
            输入源 (INPUT):
          </h3>
          <p style="font-size: 48px; line-height: 1.6; color: #0F380F;">
            非结构化短视频流 (TikTok / Douyin / Reels)
          </p>
          <p style="font-size: 42px; line-height: 1.5; color: #009640; font-style: italic; margin-top: 20px; font-family: 'JetBrains Mono', monospace;">
            Unstructured Short Video Streams
          </p>
        </div>
      </div>
    </div>

    <!-- 项目2 -->
    <div style="border: 6px solid #009640; background: white; padding: 60px;">
      <div style="display: flex; gap: 40px; align-items: start;">
        <div style="width: 60px; height: 60px; background: #FDE700; border: 4px solid #0F380F; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 50px; font-weight: 900;">
          •
        </div>
        <div>
          <h3 style="font-size: 56px; font-weight: 900; color: #0F380F; margin-bottom: 30px; font-family: 'JetBrains Mono', monospace;">
            处理核心 (PROCESSOR):
          </h3>
          <p style="font-size: 48px; line-height: 1.6; color: #0F380F; font-weight: 700;">
            <span style="background: #FDE700; padding: 5px 20px;">DeepSeek R1</span> (推理层) + <span style="background: #FDE700; padding: 5px 20px;">Qwen2-VL</span> (感知层)
          </p>
          <p style="font-size: 42px; line-height: 1.5; color: #009640; font-style: italic; margin-top: 20px; font-family: 'JetBrains Mono', monospace;">
            Reasoning Layer + Perception Layer
          </p>
        </div>
      </div>
    </div>

    <!-- 项目3 -->
    <div style="border: 6px solid #009640; background: white; padding: 60px;">
      <div style="display: flex; gap: 40px; align-items: start;">
        <div style="width: 60px; height: 60px; background: #FDE700; border: 4px solid #0F380F; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 50px; font-weight: 900;">
          •
        </div>
        <div>
          <h3 style="font-size: 56px; font-weight: 900; color: #0F380F; margin-bottom: 30px; font-family: 'JetBrains Mono', monospace;">
            第一性原理核查 (FIRST PRINCIPLES CHECK):
          </h3>
          <p style="font-size: 48px; line-height: 1.6; color: #0F380F;">
            系统内置药理学与生化代谢路径知识库。不依赖博主口述，而是基于分子式与代谢动力学进行逻辑推演。
          </p>
          <p style="font-size: 42px; line-height: 1.5; color: #009640; font-style: italic; margin-top: 20px; font-family: 'JetBrains Mono', monospace;">
            Built-in pharmacology and biochemical metabolic pathway knowledge base. We rely on molecular formulas and pharmacokinetics logic, not influencer claims.
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- 细分割线 -->
  <div style="height: 4px; background: rgba(255,255,255,0.3); margin: 150px 0;"></div>
</div>
```

---

### 区块4：核心能力（占25%，~2950px）

```html
<div class="content-section" style="margin-bottom: 300px;">
  <!-- 章节标题 -->
  <div style="position: relative; margin-bottom: 120px;">
    <div style="position: absolute; inset: 0; background: #0F380F; transform: translate(15px, 15px);"></div>
    <div style="background: #FDE700; border: 6px solid #0F380F; padding: 50px 70px; position: relative;">
      <h2 style="font-size: 90px; font-weight: 900; color: #0F380F; font-family: 'JetBrains Mono', monospace; letter-spacing: 6px;">
        03. 核心能力 / CAPABILITIES
      </h2>
    </div>
  </div>

  <!-- 功能块（带 > 符号）-->
  <div style="display: flex; flex-direction: column; gap: 80px;">
    <!-- 功能1 -->
    <div style="border: 6px solid #0F380F; background: #FDE700; padding: 60px; position: relative;">
      <div style="display: flex; gap: 40px; align-items: start;">
        <div style="font-size: 80px; color: #0F380F; font-weight: 900; flex-shrink: 0;">&gt;</div>
        <div>
          <h3 style="font-size: 60px; font-weight: 900; color: #0F380F; margin-bottom: 30px; font-family: 'JetBrains Mono', monospace;">
            鹰眼提取 (Deep Extraction)
          </h3>
          <p style="font-size: 48px; line-height: 1.6; color: #0F380F;">
            视听双通道交叉验证。当博主口述"两粒"但画面标签显示"200mg"时，系统自动捕捉视觉真值，修正数据偏差。
          </p>
          <p style="font-size: 42px; line-height: 1.5; color: #009640; font-style: italic; margin-top: 20px; font-family: 'JetBrains Mono', monospace;">
            Cross-check visual & audio data. System captures visual ground truth to correct verbal data deviations.
          </p>
        </div>
      </div>
    </div>

    <!-- 功能2 -->
    <div style="border: 6px solid #0F380F; background: white; padding: 60px;">
      <div style="display: flex; gap: 40px; align-items: start;">
        <div style="font-size: 80px; color: #FDE700; font-weight: 900; flex-shrink: 0; text-shadow: 3px 3px 0 #0F380F;">&gt;</div>
        <div>
          <h3 style="font-size: 60px; font-weight: 900; color: #0F380F; margin-bottom: 30px; font-family: 'JetBrains Mono', monospace;">
            冲突计算 (Conflict Computation)
          </h3>
          <p style="font-size: 48px; line-height: 1.6; color: #0F380F;">
            基于成分的化学性质构建"对抗/协同图谱"。自动识别如 <span style="background: #FDE700; padding: 0 15px;">[锌/铜拮抗]</span>、<span style="background: #FDE700; padding: 0 15px;">[维A光敏]</span> 等潜在生物化学冲突。
          </p>
          <p style="font-size: 42px; line-height: 1.5; color: #009640; font-style: italic; margin-top: 20px; font-family: 'JetBrains Mono', monospace;">
            Construct "Antagonism/Synergy Graphs" based on chemical properties. Automatically identify biochemical conflicts like Zinc/Copper antagonism.
          </p>
        </div>
      </div>
    </div>

    <!-- 功能3 -->
    <div style="border: 6px solid #0F380F; background: #009640; padding: 60px;">
      <div style="display: flex; gap: 40px; align-items: start;">
        <div style="font-size: 80px; color: #FDE700; font-weight: 900; flex-shrink: 0;">&gt;</div>
        <div>
          <h3 style="font-size: 60px; font-weight: 900; color: #FAFAFA; margin-bottom: 30px; font-family: 'JetBrains Mono', monospace;">
            动态堆栈 (Dynamic Stacking)
          </h3>
          <p style="font-size: 48px; line-height: 1.6; color: #FAFAFA;">
            将静态的成分列表转化为符合昼夜节律 (Circadian Rhythm) 的时间轴。早晨皮质醇管理，夜间褪黑素诱导，自动排程。
          </p>
          <p style="font-size: 42px; line-height: 1.5; color: #FDE700; font-style: italic; margin-top: 20px; font-family: 'JetBrains Mono', monospace;">
            Transform static ingredient lists into circadian-aligned timelines. Automatic scheduling for morning cortisol management and night melatonin induction.
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- 粗黄色分割线 -->
  <div style="height: 16px; background: #FDE700; box-shadow: 0 10px 0 #0F380F; margin: 150px 0;"></div>
</div>
```

---

### 区块5：系统参数（占10%，~1180px）

```html
<div class="footer-section">
  <!-- 黑底白字参数块 -->
  <div style="background: #0F380F; border: 6px solid #FDE700; padding: 80px; text-align: center;">
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 50px; line-height: 2.0; color: #FAFAFA;">
      <div style="margin-bottom: 40px;">
        <span style="color: #8BAC0F; font-weight: 400;">SYSTEM STATUS:</span>
        <span style="color: #FDE700; font-weight: 900; margin-left: 20px;">ACTIVE</span>
        <span style="display: inline-block; width: 20px; height: 20px; background: #00FF00; border-radius: 50%; margin-left: 15px; animation: pulse 1s infinite;"></span>
      </div>

      <div style="margin-bottom: 40px;">
        <span style="color: #8BAC0F; font-weight: 400;">VERSION:</span>
        <span style="color: #FAFAFA; font-weight: 700; margin-left: 20px;">1.0.0 (Hackathon Build)</span>
      </div>

      <div style="height: 2px; background: #FDE700; margin: 60px 0;"></div>

      <div style="margin-bottom: 40px;">
        <div style="color: #8BAC0F; font-weight: 400; margin-bottom: 20px;">TECH STACK:</div>
        <div style="color: #FAFAFA; font-weight: 700; font-size: 46px;">
          Python / Streamlit / Google Gemini / DeepSeek / Vector Database
        </div>
      </div>

      <div style="height: 2px; background: #FDE700; margin: 60px 0;"></div>

      <div>
        <div style="color: #8BAC0F; font-weight: 400; margin-bottom: 20px;">DEVELOPED BY:</div>
        <div style="color: #FDE700; font-weight: 900; font-size: 70px; letter-spacing: 8px;">
          三叶虫
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## 💻 完整HTML模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>真成分易拉宝生成器</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,700;0,900;1,400&family=Noto+Sans+SC:wght@400;700;900&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --retro-green: #009640;
      --retro-yellow: #FDE700;
      --retro-black: #0F380F;
      --retro-white: #FAFAFA;
      --retro-gray: #8BAC0F;
    }

    body {
      background: #222;
      padding: 20px;
    }

    /* 预览容器 */
    #preview-wrapper {
      transform: scale(0.12);
      transform-origin: top left;
      width: 4724px;
      height: 11811px;
    }

    /* 主画布 */
    #rollup-banner {
      width: 4724px;
      height: 11811px;
      background: var(--retro-green);
      background-image:
        linear-gradient(rgba(253, 231, 0, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(253, 231, 0, 0.08) 1px, transparent 1px);
      background-size: 48px 48px;
      padding: 200px 250px;
      overflow: hidden;
      position: relative;
    }

    /* retro-border 样式（复刻现有UI）*/
    .retro-border {
      border: 6px solid var(--retro-black);
      box-shadow:
        inset 0 0 0 4px var(--retro-yellow),
        12px 12px 0 0 var(--retro-black);
      background: white;
    }

    /* 旋转指针动画 */
    @keyframes rotate {
      0% { transform: perspective(800px) rotateY(0deg); }
      100% { transform: perspective(800px) rotateY(360deg); }
    }

    .rotating-pointer {
      animation: rotate 2s linear infinite;
      filter: drop-shadow(4px 4px 0px rgba(0,0,0,0.3));
    }

    /* 脉冲动画 */
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    /* 控制面板 */
    #controls {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    #controls button {
      padding: 20px 40px;
      font-size: 18px;
      font-weight: 900;
      background: var(--retro-yellow);
      border: 4px solid var(--retro-black);
      color: var(--retro-black);
      cursor: pointer;
      font-family: 'JetBrains Mono', monospace;
      text-transform: uppercase;
      box-shadow: 4px 4px 0 var(--retro-black);
      transition: all 0.1s;
    }

    #controls button:hover {
      transform: translate(2px, 2px);
      box-shadow: 2px 2px 0 var(--retro-black);
    }

    #controls button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  </style>
</head>
<body>
  <!-- 预览区域 -->
  <div id="preview-wrapper">
    <div id="rollup-banner">
      <!-- 在这里粘贴上面5个区块的完整HTML -->
    </div>
  </div>

  <!-- 控制面板 -->
  <div id="controls">
    <button id="download-pdf">📄 下载 PDF</button>
    <button id="download-png">🖼️ 下载 PNG</button>
  </div>

  <!-- 库引入 -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

  <script>
    // PDF导出
    document.getElementById('download-pdf').addEventListener('click', async () => {
      const btn = document.getElementById('download-pdf');
      btn.textContent = '⏳ 生成中...';
      btn.disabled = true;

      try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [4724, 11811],
          compress: true
        });

        const canvas = await html2canvas(document.getElementById('rollup-banner'), {
          scale: 1,
          useCORS: true,
          backgroundColor: '#009640',
          logging: false,
          width: 4724,
          height: 11811
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imgData, 'JPEG', 0, 0, 4724, 11811);
        pdf.save('真成分易拉宝_80x200cm_150dpi.pdf');

        btn.textContent = '✅ 下载完成';
        setTimeout(() => {
          btn.textContent = '📄 下载 PDF';
          btn.disabled = false;
        }, 2000);
      } catch (error) {
        console.error('导出失败:', error);
        alert('导出失败: ' + error.message);
        btn.textContent = '❌ 导出失败';
        btn.disabled = false;
      }
    });

    // PNG导出
    document.getElementById('download-png').addEventListener('click', async () => {
      const btn = document.getElementById('download-png');
      btn.textContent = '⏳ 生成中...';
      btn.disabled = true;

      try {
        const canvas = await html2canvas(document.getElementById('rollup-banner'), {
          scale: 1,
          useCORS: true,
          backgroundColor: '#009640',
          logging: false,
          width: 4724,
          height: 11811
        });

        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = '真成分易拉宝_4724x11811px.png';
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);

          btn.textContent = '✅ 下载完成';
          setTimeout(() => {
            btn.textContent = '🖼️ 下载 PNG';
            btn.disabled = false;
          }, 2000);
        }, 'image/png');
      } catch (error) {
        console.error('导出失败:', error);
        alert('导出失败: ' + error.message);
        btn.textContent = '❌ 导出失败';
        btn.disabled = false;
      }
    });
  </script>
</body>
</html>
```

---

## 🎯 关键实现要点

### ✅ 必须实现的视觉效果

1. **3D立体阴影**（所有标题块）
   ```css
   position: relative;
   /* 阴影层 */
   ::before {
     position: absolute;
     background: #0F380F;
     transform: translate(15-20px, 15-20px);
   }
   ```

2. **超粗边框**（6px+）
   ```css
   border: 6px solid var(--retro-black);
   ```

3. **内嵌黄色边框**
   ```css
   box-shadow: inset 0 0 0 4px var(--retro-yellow);
   ```

4. **旋转指针装饰**
   - SVG多边形
   - 3D旋转动画
   - 黄绿双色

5. **超大字号**
   - 主标题：200px
   - 章节标题：90px
   - 正文中文：50px+
   - **不要小字！**

6. **高对比度配色**
   - 黑底黄字
   - 黄底黑字
   - 绿底白字
   - 白底黑字

---

## 📦 交付清单

- [ ] `public/rollup-banner.html` - 完整独立HTML文件
- [ ] 确认3D效果正确实现
- [ ] 确认字号够大（≥50px正文）
- [ ] 确认旋转指针动画正常
- [ ] 测试PDF导出（4724×11811px）
- [ ] 测试PNG导出

---

## ⚠️ 绝对禁止

- ❌ 小字号（<40px）
- ❌ 细边框（<4px）
- ❌ 没有3D效果
- ❌ 修改文案内容
- ❌ 使用渐变（只用纯色）
- ❌ 圆角（必须直角）

---

## 🚀 开始开发

```bash
# 创建文件
public/rollup-banner.html

# 浏览器打开
open public/rollup-banner.html

# 点击按钮导出
```

**预计时间**：3-4小时
**风格要求**：100%复刻现有UI的复古游戏机风格
**核心**：3D + 粗边框 + 超大字 + 旋转指针
