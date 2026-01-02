# TRUE FORMULA - 真配方

> **拒绝营销滤镜，还原内容真相** - AI驱动的补剂冲突检测与智能排程

**Decode the Noise. Design Your Biology.**

## 🌐 在线体验

**🚀 立即访问: [https://true-formula.vercel.app/](https://true-formula.vercel.app/)**

无需安装，浏览器直接使用！

---

## 🎯 项目简介

True Formula 是一个AI驱动的补剂与饮食规划师，帮助用户将复杂的健康视频内容直接转化为可执行的每日服用清单。

**核心价值：**
- 💰 **省钱**：AI识别成分，去除营销干扰，不买垃圾补剂
- 🧠 **省心**：智能排程，自动检测冲突，无需手动规划
- ⚕️ **保命**：避免危险的成分冲突（如钙片+铁剂、VC空腹烧胃）

**解决三个核心问题：**
1. 这瓶该不该吃？
2. 吃多少才有效？
3. 具体几点钟吃？

---

## 🏗️ 系统架构

```
用户输入文本
    ↓
AI识别产品（DeepSeek V3.2-Fast ⚡ 或 Claude）
    ↓
模糊匹配产品库（600+产品）
    ↓
冲突检测引擎（7条规则）
    ↓
日晷智能排程（24小时优化）
    ↓
AI生成用药点评（DeepSeek R1）
```

### 核心数据流

1. **产品识别**: 用户输入文本 → Claude API提取产品信息 → 返回结构化数据
2. **产品匹配**: AI提取的产品名 → 模糊匹配算法 → 数据库中的标准产品
3. **冲突检测**: 用户选择的产品列表 → 检测冲突规则 → 标记冲突产品对
4. **日晷排程**: 产品列表 → 时间槽分配算法 → 24小时最优排程
5. **AI点评**: 排程结果 → DeepSeek R1深度分析 → 专业用药建议

---

## 📦 技术栈

### 前端框架
- **Next.js 14.2.22** - React全栈框架（App Router）
- **React 18** - UI组件库
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架

### 数据库
- **Prisma 6.1.0** - ORM
- **SQLite** (开发) / **PostgreSQL** (生产)
- **600+ 预置产品数据**
- **70+ 营养成分数据**

### AI集成
- **Anthropic Claude API** (Sonnet 4.5) - 产品识别与智能分析
- **DeepSeek V3.2-Fast** - 快速文本分析与产品提取 ⚡
- **DeepSeek R1** - 药理学深度思考与用药点评（可切换）
- **Qwen2-VL** - 配料表视觉识别（规划中）

### 可视化
- **日晷组件** - 24小时圆环时间轴
- **产品卡片** - 支持拖拽调整时间
- **冲突预警** - 实时高亮显示冲突

### 状态管理
- **React Hooks** (useState, useEffect)
- **自定义Hooks** (useProductSearch, useConflictDetection)

---

## 🚀 快速开始

> **💡 提示**: 不想本地搭建？直接访问在线版本 👉 [https://true-formula.vercel.app/](https://true-formula.vercel.app/)

### 本地部署步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
# 创建 .env 文件，配置AI API密钥
cp .env.example .env

# 编辑 .env 文件内容：
# Claude API（可选）
ANTHROPIC_API_KEY=your_claude_api_key_here

# DeepSeek API（推荐，更快更便宜）⚡
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://www.sophnet.com/api/open-apis/v1
DEEPSEEK_MODEL=DeepSeek-V3.2-Fast

# AI Provider 选择（claude 或 deepseek）
AI_PROVIDER=deepseek
```

> **💡 提示**:
> - DeepSeek V3.2-Fast 速度快、成本低，推荐使用
> - Claude Sonnet 4.5 分析更深入，适合复杂场景
> - 可随时在 `.env` 中切换 `AI_PROVIDER`

### 3. 初始化数据库

```bash
# 推送数据库schema
npx prisma db push

# 导入产品数据（600+产品）
npx tsx prisma/seed.ts
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000` 即可使用。

---

## 📂 项目结构

```
true-formula/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # 主页
│   │   ├── layout.tsx                # 全局布局
│   │   ├── globals.css               # 全局样式
│   │   └── api/                      # API路由
│   │       ├── ai-chat/              # AI对话接口
│   │       ├── analyze-text/         # 文本分析接口
│   │       ├── generate-schedule/    # 排程生成接口
│   │       └── products/             # 产品查询接口
│   │
│   ├── components/                   # React组件（18个）
│   │   ├── AILoadingAnimation/       # AI加载动画
│   │   ├── AnimatedTitle/            # 动画标题
│   │   ├── HeroSection/              # 首屏区域
│   │   ├── InputSection/             # 输入区域
│   │   ├── MyList/                   # 我的清单
│   │   ├── Sundial/                  # 日晷时间轴（核心）
│   │   ├── ProductCard/              # 产品卡片
│   │   ├── WorkbenchModal/           # 工作台弹窗
│   │   └── ...                       # 其他组件
│   │
│   ├── lib/                          # 核心业务逻辑
│   │   ├── ai-analyzer/              # AI分析器
│   │   │   └── index.ts              # Claude API调用
│   │   ├── conflict-detector/        # 冲突检测引擎
│   │   │   └── index.ts              # 7条冲突规则
│   │   ├── product-matcher/          # 产品匹配
│   │   │   └── index.ts              # 模糊匹配算法
│   │   └── schedule-optimizer/       # 排程优化器
│   │       └── index.ts              # 时间槽分配算法
│   │
│   ├── types/                        # TypeScript类型
│   │   └── supplement.ts             # 核心类型定义
│   │
│   └── utils/                        # 工具函数
│
├── prisma/
│   ├── schema.prisma                 # 数据库Schema
│   ├── seed.ts                       # 数据库种子文件
│   └── dev.db                        # SQLite数据库（开发）
│
├── public/
│   ├── rollup-banner.html            # 宣传海报（易拉宝）
│   └── ...                           # 其他静态资源
│
└── package.json
```

---

## 🔑 核心功能详解

### 1. AI产品识别 (`/api/analyze-text`)

**功能**: 从用户输入的文本中提取补剂产品信息

**技术实现**:
- 使用Claude Sonnet 4.5解析自然语言
- 提取产品名称、剂量、服用时间
- 返回结构化JSON数据

**请求示例**:
```typescript
POST /api/analyze-text
{
  "text": "我每天早上吃维生素D3 2000IU和钙片500mg"
}
```

**响应示例**:
```json
{
  "products": [
    {
      "name": "维生素D3",
      "dosage": "2000 IU",
      "timing": "早上"
    },
    {
      "name": "钙片",
      "dosage": "500 mg",
      "timing": "早上"
    }
  ]
}
```

---

### 2. 产品模糊匹配 (`src/lib/product-matcher`)

**功能**: 将AI提取的产品名匹配到数据库中的标准产品

**算法**:
- **编辑距离算法** (Levenshtein Distance)
- **别名映射** (如 "Vit C" → "维生素C")
- **相似度阈值** (0.6以上才匹配)

**数据库规模**:
- 600+ 标准产品
- 70+ 营养成分
- 支持中英文名称

**匹配示例**:
```typescript
输入: "维C泡腾片"
匹配: "维生素C" (相似度: 0.75)

输入: "钙尔奇D"
匹配: "钙片+维生素D" (相似度: 0.82)
```

---

### 3. 冲突检测引擎 (`src/lib/conflict-detector`)

**功能**: 检测产品之间的冲突关系

**7条核心规则**:
1. **钙与铁**: 钙会抑制铁的吸收
2. **钙与镁**: 竞争吸收，建议分开服用
3. **锌与铜**: 高剂量锌抑制铜吸收
4. **脂溶性维生素**: Vit A/D/E/K 过量中毒
5. **咖啡因与钙**: 咖啡因促进钙流失
6. **纤维与矿物质**: 纤维素阻碍矿物质吸收
7. **空腹刺激**: VC等空腹服用刺激胃部

**检测示例**:
```typescript
输入: ["钙片", "铁剂"]
输出: {
  conflict: true,
  severity: "HIGH",
  message: "钙片会严重抑制铁的吸收，建议间隔4小时以上"
}
```

---

### 4. 日晷智能排程 (`src/lib/schedule-optimizer`)

**功能**: 生成24小时最优服用时间表

**算法思路**:
1. **时间槽分配**: 将24小时划分为8个时段
2. **冲突分离**: 有冲突的产品分配到不同时段
3. **协同组合**: 有协同效应的产品放在同一时段
4. **优先级排序**: 空腹/饭后/睡前等特殊要求优先

**可视化组件**:
- **日晷圆环**: 24小时环形布局
- **产品卡片**: 拖拽调整时间
- **冲突预警**: 红色高亮显示

**排程示例**:
```
08:00 - 维生素D + 钙片（协同吸收）
12:00 - 铁剂（避开钙片）
20:00 - 镁片（助眠效果）
```

---

### 5. AI用药点评 (`/api/ai-chat`)

**功能**: 对用户的排程方案进行专业点评

**技术实现**:
- 使用DeepSeek R1进行深度药理学分析
- 评估剂量合理性
- 指出潜在风险
- 提供优化建议

**点评示例**:
```
您的排程方案总体合理，但有以下建议：

✅ 优点:
- 维生素D与钙片同时服用，吸收效率高
- 铁剂单独服用，避免了与钙片的冲突

⚠️ 注意:
- 镁片剂量建议不超过400mg/天
- 建议在铁剂前后1小时避免喝茶或咖啡

💡 优化建议:
- 可考虑将维生素D调整至午餐后，随脂肪食物吸收更佳
```

---

## 🗄️ 数据库Schema

### Product (产品表)

```prisma
model Product {
  id          Int       @id @default(autoincrement())
  name        String    @unique
  nameEn      String?
  category    String
  dosage      String?
  timing      String?
  description String?
  nutrients   Nutrient[]
}
```

### Nutrient (营养成分表)

```prisma
model Nutrient {
  id       Int       @id @default(autoincrement())
  name     String    @unique
  category String
  products Product[]
}
```

### Conflict (冲突关系表)

```prisma
model Conflict {
  id          Int    @id @default(autoincrement())
  product1    String
  product2    String
  severity    String // HIGH, MEDIUM, LOW
  mechanism   String
  suggestion  String
}
```

---

## 🎨 UI设计特色

### 日晷组件 (Sundial)
- **24小时圆环**: 0点在顶部，顺时针排列
- **时段标记**: 00:00, 06:00, 12:00, 18:00
- **产品卡片**: 拖拽式交互，自由调整时间
- **冲突高亮**: 冲突产品自动标红

### 产品卡片 (ProductCard)
- **拖拽支持**: 直接拖到日晷上
- **剂量显示**: 标准剂量 + 用户自定义
- **服用时间**: 智能推荐最佳时间
- **冲突标记**: 红色边框 + 提示文字

### 工作台弹窗 (WorkbenchModal)
- **文本输入**: 粘贴视频文字或描述
- **AI识别**: 实时提取产品信息
- **产品选择**: 勾选想要添加的产品
- **一键导入**: 批量添加到日晷

---

## 🔧 开发指南

### 添加新产品

编辑 `prisma/seed.ts`:

```typescript
await prisma.product.create({
  data: {
    name: "辅酶Q10",
    nameEn: "Coenzyme Q10",
    category: "抗氧化剂",
    dosage: "100mg",
    timing: "早餐后",
    description: "支持心脏健康，提升细胞能量"
  }
});
```

运行种子脚本:
```bash
npx tsx prisma/seed.ts
```

---

### 添加新冲突规则

编辑 `src/lib/conflict-detector/index.ts`:

```typescript
export const conflictRules = [
  {
    products: ["产品A", "产品B"],
    severity: "HIGH",
    mechanism: "产品A会抑制产品B的吸收",
    suggestion: "建议间隔4小时以上服用"
  },
  // 添加更多规则...
];
```

---

### 自定义AI提示词

编辑 `src/lib/ai-analyzer/index.ts`:

```typescript
const systemPrompt = `
你是一个专业的补剂分析师。
请从用户输入中提取所有补剂产品信息...
`;
```

---

## 🐛 常见问题

### Q: API调用失败？
**A**: 检查 `.env` 文件中的 `ANTHROPIC_API_KEY` 是否正确配置。

### Q: 数据库连接错误？
**A**: 运行 `npx prisma db push` 重新推送schema。

### Q: 产品匹配不准确？
**A**: 调整 `src/lib/product-matcher/index.ts` 中的相似度阈值。

### Q: 日晷组件不显示？
**A**: 确保组件使用了 `"use client"` 指令（客户端组件）。

---

## 📚 参考资源

- [Anthropic Claude API文档](https://docs.anthropic.com/)
- [Prisma文档](https://www.prisma.io/docs)
- [Next.js 14文档](https://nextjs.org/docs)
- [补剂相互作用数据库](https://www.drugs.com/drug_interactions.html)

---

## 🎯 已完成功能

- ✅ 双AI支持（DeepSeek V3.2-Fast ⚡ + Claude Sonnet 4.5）
- ✅ AI产品识别（文本分析与食材提取）
- ✅ 产品模糊匹配（600+产品库）
- ✅ 冲突检测引擎（7条核心规则）
- ✅ 日晷智能排程（24小时可视化）
- ✅ 拖拽式交互（产品卡片 → 日晷）
- ✅ AI用药点评（DeepSeek R1深度分析）
- ✅ 工作台批量导入
- ✅ 实时冲突预警
- ✅ Vercel云端部署

---

## 🚧 规划中功能

- [ ] 视频内容分析（支持YouTube/抖音链接）
- [ ] 配料表OCR识别（Qwen2-VL）
- [ ] 用户偏好保存（餐食时间、运动时间）
- [ ] 历史排程记录
- [ ] 导出功能（PDF/日历ICS）
- [ ] 成本优化（对接iHerb API）
- [ ] 社交分享功能

---

## 📄 License

MIT License

---

**让健康管理从「收藏视频」变成「执行清单」。** 💊⏰
