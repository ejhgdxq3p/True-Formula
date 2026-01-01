# TRUE FORMULA - 真配方

> **从视频内容到科学管理** - AI驱动的补剂冲突检测与智能排程

---

## 🎯 项目愿景

将"看补剂视频"这一被动娱乐行为，转化为"科学管理身体"的主动能力。

**核心价值：**
- 💰 **省钱**：去伪存真，不买垃圾补剂
- 🧠 **省心**：自动排程，无需手动规划
- ⚕️ **保命**：避免危险的成分冲突（如铁+钙、鱼油+抗凝药）

---

## 🏗️ 架构设计

```
┌─────────────────┐
│  Video Input    │ (用户粘贴YouTube/B站链接或文字描述)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI Analyzer    │ (Claude提取补剂信息，去除营销BS)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Conflict Engine │ (检测相生相克，生成力场图)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Scheduler    │ (生成24小时最优排程)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Visualization  │ (冲突力场图 + 日晷时间轴)
└─────────────────┘
```

---

## 📦 技术栈

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Visualization**: D3.js (力场图), Recharts (时间轴)
- **AI**: Anthropic Claude API
- **Database**: Prisma + SQLite (开发) / PostgreSQL (生产)
- **State**: Zustand

---

## 🚀 快速开始 (包工头已搭好架子，Cursor开始干活)

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env，填入你的 ANTHROPIC_API_KEY
```

### 3. 初始化数据库

```bash
npx prisma db push
```

### 4. 启动开发服务器

```bash
npm run dev
```

---

## 📝 TODO清单 (Cursor按照优先级实现)

### Phase 1: 核心功能 (MVP)

#### 1.1 数据库与补剂库
- [ ] **补充 Prisma schema** (`prisma/schema.prisma`)
  - 添加 `Ingredient` 表
  - 添加多对多关系 (supplements ↔ ingredients)
  - 添加 citations 字段到 Conflict 表

- [ ] **实现 seedDatabase** (`src/lib/supplement-db/index.ts:59`)
  - 创建至少20个常见补剂的seed数据
  - 重点包括：Vitamin C/D/E/B-complex, 钙/镁/锌/铁, Omega-3, 蛋白粉
  - 添加常见冲突（如：铁+钙，钙+镁，鱼油+维E）
  - 添加常见synergies（如：Vit D+钙，镁+B6）

- [ ] **实现 findSupplement** (`src/lib/supplement-db/index.ts:20`)
  - 模糊匹配（Fuse.js 或 简单的 Levenshtein 距离）
  - 支持别名（如 "Vit C" → "Vitamin C"）

- [ ] **实现 detectConflicts & findSynergies** (`src/lib/supplement-db/index.ts:30`)

#### 1.2 AI视频分析
- [ ] **实现 analyzeVideoContent** (`src/lib/ai-analyzer/index.ts:27`)
  - 设计Claude提示词，要求输出结构化JSON
  - 示例输出格式：
    ```json
    {
      "supplements": [
        {
          "name": "Vitamin D3",
          "dosage": "2000 IU",
          "timing": "morning with breakfast",
          "reasoning": "Video claims better absorption with fats"
        }
      ],
      "warnings": ["No citations provided for dosage claims"],
      "credibilityScore": 65
    }
    ```
  - 处理Claude API响应并解析

- [ ] **实现 API route** (`src/app/api/analyze-video/route.ts`)
  - 接收 `{ content: string, contentType: "transcript" | "description" }`
  - 调用 `analyzeVideoContent`
  - 返回结果

#### 1.3 冲突引擎
- [ ] **实现 buildConflictGraph** (`src/lib/conflict-engine/index.ts:31`)
  - 生成D3.js需要的 `{ nodes, edges }` 格式
  - 示例：
    ```typescript
    {
      nodes: [
        { id: "supp-1", name: "Iron", category: "MINERAL" },
        { id: "supp-2", name: "Calcium", category: "MINERAL" }
      ],
      edges: [
        {
          source: "supp-1",
          target: "supp-2",
          type: "conflict",
          severity: "HIGH",
          mechanism: "Calcium inhibits iron absorption in intestine"
        }
      ]
    }
    ```

- [ ] **实现 isCombinationSafe** (`src/lib/conflict-engine/index.ts:43`)

#### 1.4 智能排程
- [ ] **实现 generateSchedule** (`src/lib/schedule-optimizer/index.ts:37`)
  - 算法思路：
    1. 根据 `TimingPreference` 分组
    2. 检测冲突，需要时间间隔的分开放置
    3. 有synergy的放在一起
    4. 考虑用户meal times
  - 输出示例：
    ```typescript
    {
      time: "08:00",
      supplements: [
        { id: "1", name: "Vitamin D", dosage: "2000 IU" },
        { id: "2", name: "Calcium", dosage: "500 mg" }
      ],
      reasoning: "Vitamin D enhances calcium absorption; best with breakfast"
    }
    ```

- [ ] **实现 API route** (`src/app/api/generate-schedule/route.ts`)

#### 1.5 UI组件
- [ ] **VideoAnalyzer组件** (`src/components/VideoAnalyzer/index.tsx`)
  - Textarea输入视频transcript或描述
  - "Analyze"按钮，loading状态
  - 显示提取的supplements列表（带credibility score）
  - 允许用户勾选想要的supplements

- [ ] **ConflictGraph组件** (`src/components/ConflictGraph/index.tsx`)
  - 使用D3.js force simulation
  - 节点：圆形，颜色按category
  - 边：红色=冲突，绿色=synergy，粗细表示severity/benefit
  - 点击边：显示Modal/Tooltip，展示药理学mechanism

- [ ] **TimelineWheel组件** (`src/components/TimelineWheel/index.tsx`)
  - 24小时圆环（类似时钟）
  - 在对应时间点放置supplement图标
  - Hover显示dosage和reasoning

- [ ] **主页整合** (`src/app/page.tsx`)
  - Step 1: VideoAnalyzer
  - Step 2: 显示ConflictGraph
  - Step 3: 显示TimelineWheel
  - 添加状态管理（Zustand store）

---

### Phase 2: 增强功能

- [ ] **批量视频分析** (`src/lib/ai-analyzer/index.ts:58`)
  - 分析播放列表
  - 合并结果，标注冲突建议

- [ ] **用户偏好设置**
  - 保存meal times, workout time
  - 保存supplement清单
  - 历史schedule记录

- [ ] **成本优化** (`src/lib/schedule-optimizer/index.ts:75`)
  - 对接iHerb API
  - 推荐性价比最高的产品组合

- [ ] **移动端响应式设计**

- [ ] **导出功能**
  - 导出schedule为PDF/Calendar (ICS)
  - 打印友好的版本

---

### Phase 3: 社交与变现

- [ ] **分享功能**
  - 生成可分享的schedule链接
  - 社交媒体卡片预览

- [ ] **联盟营销**
  - iHerb/淘宝affiliate链接
  - 从推荐购买中获得佣金

- [ ] **用户社区**
  - 分享自己的supplement stack
  - 投票最佳schedule

---

## 📂 项目结构

```
supplement-scheduler/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 主页
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── api/               # API routes
│   │       ├── analyze-video/
│   │       └── generate-schedule/
│   ├── components/            # React组件
│   │   ├── VideoAnalyzer/     # 视频分析UI
│   │   ├── ConflictGraph/     # 冲突力场图 (D3.js)
│   │   └── TimelineWheel/     # 日晷时间轴
│   ├── lib/                   # 核心业务逻辑
│   │   ├── supplement-db/     # 补剂数据库查询
│   │   ├── ai-analyzer/       # Claude AI分析
│   │   ├── conflict-engine/   # 冲突检测
│   │   └── schedule-optimizer/# 排程算法
│   ├── types/                 # TypeScript类型定义
│   │   └── supplement.ts
│   └── utils/                 # 工具函数
├── prisma/
│   └── schema.prisma          # 数据库schema
├── public/                    # 静态资源
└── package.json
```

---

## 🎨 视觉设计指引

### 冲突力场图 (ConflictGraph)
- **节点**：圆形粒子，带supplement name
- **颜色**：按category (Vitamin=蓝, Mineral=绿, 等)
- **边**：
  - 冲突：红色虚线，粗细表示severity
  - Synergy：绿色实线
- **交互**：
  - 拖拽节点
  - 点击边显示mechanism tooltip
  - 缩放/平移

### 日晷时间轴 (TimelineWheel)
- **外观**：24小时圆环，0点在顶部
- **标记**：6, 12, 18小时刻度
- **图标**：supplement pill图标放置在对应时间
- **连线**：同一时段的supplements用弧线连接

---

## 🔑 关键文件说明

### 类型定义 (`src/types/supplement.ts`)
所有核心数据结构都在这里定义，包括：
- `Supplement`: 补剂基础信息
- `Conflict`: 冲突关系
- `Synergy`: 协同关系
- `ScheduleSlot`: 排程时间槽

### 数据库模块 (`src/lib/supplement-db/`)
负责：
- 模糊搜索supplements
- 检测conflicts和synergies
- Seed初始数据

### AI分析器 (`src/lib/ai-analyzer/`)
负责：
- 调用Claude API分析视频内容
- 提取补剂信息
- 评估内容可信度

### 冲突引擎 (`src/lib/conflict-engine/`)
负责：
- 生成D3.js可视化数据
- 检查组合安全性
- 推荐替代方案

### 排程优化器 (`src/lib/schedule-optimizer/`)
负责：
- 生成最优daily schedule
- 验证schedule有效性
- 成本优化（未来）

---

## 💡 实现建议

### 1. 先实现最小可用版本 (MVP)
优先级顺序：
1. 手动添加supplement → 检测冲突 → 生成schedule
2. 添加AI视频分析
3. 添加可视化组件

### 2. 测试数据准备
创建以下测试场景：
- ✅ **安全组合**: Vitamin D + Calcium
- ⚠️ **中度冲突**: Calcium + Magnesium (竞争吸收)
- 🚫 **严重冲突**: Iron + Calcium (严重抑制)

### 3. Claude提示词优化
示例prompt模板：
```
You are a supplement expert analyzing health content.

Extract ALL supplements mentioned in this text:
- Name (use scientific names when possible)
- Dosage (if mentioned)
- Timing recommendations
- Reasoning/claims made

Also evaluate:
- Are claims backed by citations?
- Is dosage reasonable and safe?
- Any red flags (too good to be true, dangerous combinations)?

Output as JSON with this schema:
{
  "supplements": [...],
  "warnings": [...],
  "credibilityScore": 0-100
}

Content: [USER_INPUT]
```

### 4. D3.js力场图实现
使用 `d3-force` 模拟：
```typescript
const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(edges).id(d => d.id))
  .force("charge", d3.forceManyBody().strength(-100))
  .force("center", d3.forceCenter(width / 2, height / 2));
```

---

## 🐛 常见问题

### Q: Prisma生成client失败？
```bash
npx prisma generate
npx prisma db push
```

### Q: Claude API超时？
增加timeout，或实现重试机制：
```typescript
const response = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 2048,
  timeout: 60000, // 60s
  // ...
});
```

### Q: D3.js在Next.js中报错？
确保组件是client-side：
```typescript
"use client";
import * as d3 from "d3";
```

---

## 📚 参考资源

- [Anthropic Claude API文档](https://docs.anthropic.com/)
- [D3.js力场图教程](https://d3-graph-gallery.com/network.html)
- [Prisma文档](https://www.prisma.io/docs)
- [补剂相互作用数据库](https://www.drugs.com/drug_interactions.html)

---

## 🎯 成功指标

MVP完成标志：
- [ ] 用户可以粘贴视频描述，AI提取supplements
- [ ] 系统检测出至少3种常见冲突
- [ ] 生成24小时schedule，无冲突
- [ ] 力场图可交互（拖拽、点击边查看详情）
- [ ] 时间轴正确显示supplement分布

---

**开始愉快地coding吧，Cursor! 包工头已经把架子搭好了，剩下的就靠你了！** 💪
