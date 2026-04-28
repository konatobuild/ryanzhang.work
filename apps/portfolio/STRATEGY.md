# Portfolio Strategy — ryanzhang.work

> 本文档是 portfolio 站点重构的完整决策与执行参考。
> 编写于 2026-04-26，更新于 2026-04-26 第二轮 session 后。
> 当对某项决策有疑问时，回到这里查；不要回头翻聊天记录。

---

## 0. 一句话策略

> **保留你已有的视觉 DNA（Klein blue + archival mono indexing），把它演化成一个 design-engineer 视角的站点（而非 designer-led），完全服务于 FlutterFlow / Rebolt / OpenWork 这类 AI 工程公司的 hiring manager 阅读模式，以 Stash 为主门面、gnovi 退到 study tier 作为 exploration、瞄准 rauno.me 级的视觉纪律但只做一个签名级 craft demo。**

---

## 0a. Session 2 实施记录（2026-04-26 后）

这一轮做完的事，按层次列出。详细 spec 散在下面各章节。

### A. 战略调整

- **Stash 上位 / gnovi 下沉**：原计划 gnovi 作 Featured #1，现改成 Stash（macOS Taste Library，currently building，design-focused）。gnovi 移到 study tier 作 exploration，详情见 §5.3 重写。
- **Hero 内容彻底改写**：从"Designing and building AI-native interfaces"等通用句改成 7 行三级嵌套 manifesto，详情见 §6.4。

### B. 视觉系统已落地

| 项 | 状态 | 文件位置 |
|---|---|---|
| globals.css design tokens（颜色、字号、间距、easing 等） | ✅ 已落 | [globals.css](app/globals.css) |
| `em, i { font-family: Georgia, serif }` 编辑斜体规则 | ✅ 已落 | globals.css §base |
| Klein blue P3 wide-gamut override | ✅ 已落 | globals.css :root override |
| Display-P3 ::selection klein-blue | ✅ 已落 | globals.css base |

### C. 首页 deck 已落地

| 项 | 状态 | 备注 |
|---|---|---|
| Fixed-position deck stage + 6 张统一 card | ✅ | [VerticalDeck.tsx](components/VerticalDeck.tsx) |
| Native scroll spacer 计算（`(n-1) × effectiveStep + 8`）| ✅ | recalc effect |
| Scale-spring（position-based，rauno-faithful）| ✅ | 详见 §6.2 |
| translateY = -scrollY（Y-轴 1:1）| ✅ | tick |
| Top chrome（"RYAN ZHANG · 02/06"，最简化） | ✅ | DeckChrome |
| 右侧 hairline progress markers | ✅ | DeckProgress |
| Nav / Footer 在 home 隐藏（pathname check） | ✅ | Nav.tsx, Footer.tsx |
| Hero clip-reveal manifesto（7 行错落） | ✅ | IdentityBody + globals .clip-line |
| Page-load cohort fade（非 hero 卡）| ✅ | globals .deck-card[data-card-index]:not |
| 每张卡内文字 clip-line wrappers | ✅ | StashBody / WorkSlotBody / ContactBody |
| Scroll-stop 文字 replay（每张卡 re-entry 重播） | ✅ | useEffect with debounced replay |
| Per-card body parallax drifting（scroll-driven） | ✅ | tick 中的 parallax 循环 |

### D. cases.ts 数据层

- `tier: "feature" \| "study"` 字段已加
- `buildMeta`、`repoUrl`、`year`、`category: "ai-system"` 已加
- Stash 加为 feature tier（status: placeholder, in development）
- gnovi 移为 study tier（status: live，标注 "exploration"）
- 18 个 placeholder demo 全部 tier = study
- `featureCases` / `studyCases` 便捷过滤已 export

### E. 动画系统的核心数学（已实现）

```
HOME_SCALE = 1
DECK_SCALE = 0.78
effectiveStep = cardStep / DECK_SCALE   ≈ 1054px per card

scale 过渡：
  scrollY ≤ effectiveStep × 0.7   →  cosine ramp from 1 to 0.78
  scrollY > effectiveStep × 0.7   →  sustained at 0.78

scale damping factor: 0.4   (≈3 帧沉降，~100ms 临界阻尼)
spacer height: (cardCount - 1) × effectiveStep + 8

parallax:
  per-card distance = scrollY - (cardIdx × effectiveStep)
  target = clamp(distance × 0.18, [-90, 90])
  damping factor: 0.35
  applied to .deck-card__body via translateY
```

### F. 关键认知修正（来自亲自读 rauno JS）

1. **Agent 报告之前说错**：rauno 的 scale 不是"momentum 停后弹回 1"。实际上 F 只在 `scrollY === 0` 时被显式 set 回 1。其他时候停在最后一次 set 的值。
2. **rauno 实际行为**：scrollY > 0 时 scale 持续往 0.6 ratchet down 然后撞下限稳住。回到 scrollY=0 才弹回 1。
3. **我们的 position-based 实现**比 rauno 的 velocity-based 更平滑（不会"一跳一跳"），但 sustained-at-0.78 的整体感觉是一致的。
4. **rauno 的 per-frame parallax** 用 `useSpring(0, {stiffness:500, damping:40})` 跟随 scrollX 的变化，作用在 slide-variant frame 内部内容上。我们在 §G 的 vertical 适配版本里复现了这个机制。



---

## 1. 受众与定位

### 1.1 目标受众（按优先级）

| # | 受众 | 阅读模式 | 决策影响 |
|---|---|---|---|
| 1 | **AI 工程公司 hiring manager**（FlutterFlow / Rebolt / OpenWork） | 工程师阅读模式：扫描式、判断"能不能 ship"、要看真东西（代码、commit、demo） | 整个站点的设计 |
| 2 | 同行 design engineer（次要 audience） | 看 craft、看 taste、看观点 | 视觉纪律的 bar |
| 3 | 设计客户（被牺牲） | 看视觉精致度 | 不再服务这个 audience |
| 4 | 设计圈媒体 / 奖项 | 看叙事故事 | ID 训练叙事在 /about 里有支撑就够 |

### 1.2 自我定位（design-leaning balanced，重心略偏均衡）

- **主轴**：AI-native builder（design engineer 的当代版本）
- **差异化支撑**：ID-trained（工业设计训练 + 国际奖项）
- **现实身份证据**：gnovi（你 2026 年 2 月做完的 Electron + multi-provider AI desktop chat）

> **关键判断**：ID 训练叙事**不是主门面**，是 about 里的"为什么我比一般 design engineer 更深"的支撑。主门面是 AI-native builder。

### 1.3 已经放弃的方向（不要回头）

- ❌ **多 surface 战略**（ryanzhang.work + GitHub + Upwork + 投递 portfolio 各服务不同 audience）—— 用户判断这会分散精力，决定聚焦
- ❌ **服务通用 product designer audience** —— 9 demo 网格本来是这个方向，已经放弃
- ❌ **Upwork 路径**（暂不做）
- ❌ **设计师 audience 路径**（短期内放弃）

---

## 2. 视觉策略

### 2.1 三档参考的取舍

| 档位 | 范例 | 是否合适 | 理由 |
|---|---|---|---|
| **Kraft 级** | [samuelkraft.com](https://samuelkraft.com) | ❌ 用户不接受 | 太模板化（avatar + project tile grid），没有视觉论点 |
| **Rauno 级** | [rauno.me](https://rauno.me) | ⚠️ 精神可借鉴，工作量不可复制 | 78 个 craft demos 是 6 年复利，不可短期匹配 |
| **你 DNA + ID 参考 + Rauno 纪律** | （目标位置） | ✅ 这是中点 | 保留你已有的 Klein blue + archival mono，把每个细节提到 rauno 级纪律 |

### 2.2 核心思路："Handcraft 是纪律问题，不是工作量问题"

来自 rauno.me 深度分析的核心洞察：

> **rauno.me 的"旧时代手工精致"感不来自工作量，来自"哪里都不是 default"的纪律。**
>
> 工作量决定**密度**（rauno 有 78 个 craft demo，这是密度）。
> 纪律决定**质感**（每个细节是不是没有 default 痕迹，这是质感）。
> 你能短期匹配的：**他的纪律，不是他的密度**。

### 2.3 印刷血统作为视觉 DNA 来源

rauno.me 的视觉论点不是来自其他 design engineer 网站，是**把印刷设计的工作方式搬上 web**。证据：

- `em, i { font-family: Georgia, serif }`（印刷世界的斜体衬线传统）
- 单字重做所有事（Aicher / Vignelli 的"层级靠尺寸不靠粗细"）
- 严格 8px 网格（≈印刷书的 6pt baseline grid）
- 不用纯黑纯白（印刷油墨的物理性）
- 1px hairline 替代 drop shadow（印刷的线条传统）
- 长文页 `padding: 128px` + `max-width: 960px`（≈ Phaidon 画册比例）

**用户的 ID 训练让他天然懂这个语法**——这是 portfolio 战略里最稀缺的差异化资产。

### 2.4 参考集（其他 design engineer 不去的池子）

#### 编辑/出版设计
- [032c](https://032c.com) — 柏林杂志，archival 排版
- [Apartamento](https://www.apartamentomagazine.com) — 设计 + 生活的杂志气质
- [Lars Müller Publishers](https://www.lars-mueller-publishers.com) — 瑞士设计书
- [The Gentlewoman](https://thegentlewoman.co.uk) — 克制 + 编辑感
- [IDEA Magazine](https://www.idea-mag.com/) — 日本平面设计杂志

#### 工业设计画册 / 专著
- Naoto Fukasawa monograph (Phaidon)
- Jasper Morrison "A World Without Words"
- Vitra Design Museum 展览图录
- Konstantin Grcic 作品集
- Dieter Rams archive

#### 有品味的工程文档
- [Stripe Press](https://press.stripe.com) — 书的 web 版排版
- [Linear Changelog](https://linear.app/changelog) — 极致克制的工程更新页
- [Vercel Design](https://vercel.com/design) — 系统化品牌呈现

#### 信息/数据设计
- Tufte 的 *Visual Display of Quantitative Information*
- Otl Aicher 1972 慕尼黑奥运视觉系统
- Massimo Vignelli 的 NYC 地铁图

---

## 3. Design Engineer 圈子参考（已研究）

### 3.1 Top 10（深度分析在另一份研究报告里，这里只放结论）

| # | URL | 谁 | 一句话 |
|---|---|---|---|
| 1 | [rauno.me](https://rauno.me) | Vercel staff design eng | 节制即炫技。**风格主参考。** |
| 2 | [emilkowal.ski](https://emilkowal.ski) | Linear design eng | 极简 + 真实开源（Sonner、Vaul） |
| 3 | [paco.me](https://paco.me) | Linear "Webmaster" | 像样式化的 README（cmdk） |
| 4 | [brianlovin.com](https://brianlovin.com) | 前 GitHub / Campsite | 站点本身做成产品（app shell + feed） |
| 5 | [samuelkraft.com](https://samuelkraft.com) | Raycast design eng | 标准 design-engineer 模板。**用户不取**。 |
| 6 | [jhey.dev](https://www.jhey.dev) | Shopify staff design eng | live widget hero（Spotify、weather） |
| 7 | [henryheffernan.com](https://henryheffernan.com) | Vercel senior design eng | 整站是 3D 90s 办公室。**反面参考**。 |
| 8 | [tonsky.me](https://tonsky.me) | Clojure 独立 | 只有博客 + 观点权威 |
| 9 | [skirano.com](https://skirano.com) | MagicPath 创始人，前 Anthropic | **整站是 AI 聊天**，最 AI-native 范式 |
| 10 | [shud.in](https://shud.in) | Vercel (Next.js / v0 / AI SDK) | 极简到底线，三行链接 |

### 3.2 次推荐（值得看）

- [ansonyu.me](https://ansonyu.me) — **工业设计训练 + 软件**，背景最接近用户
- [maxleiter.com](https://maxleiter.com) — v0 共创者
- [leerob.com](https://leerob.com) — 现在在 Cursor，AI-native 写作型
- [alexanderobenauer.com](https://www.alexanderobenauer.com) — "个人计算研究实验室" framing

### 3.3 跨站观察的核心模式

**强模式（top 10 共有）**：
- Hero 第一行是"职位 + 公司"，不是故事
- 项目 = 名字 + 一句动词主导描述（不是 case-study card）
- 写作是工程证据的关键载体（top 10 里 9 个有技术写作）
- Live signal > static badge
- 选定一种 archetype（Identity-led / Work-led / Experiment-led / Feed-led），不要混

**反模式（top 10 普遍不做的）**：
- 没有 stock hero illustration
- 没有 tech stack logo 墙
- 没有"Powered by Vercel/Tailwind"badge
- 没有 Dribbble 风 mosaic gallery
- 没有 quantitative-flex bullets（revenue / users / lift %）

---

## 4. 视觉系统规格（从 rauno.me 提取的具体值）

> 这一节是 Phase A0 的硬性规格。所有值都从 rauno.me 真实 CSS 提取，可直接复用。

### 4.1 颜色系统（Radix Gray 12-step + Klein blue）

```css
:root {
  /* Radix Gray light mode — 不用纯黑纯白 */
  --gray1:  hsl(0 0% 99.0%);   /* 页面背景 */
  --gray2:  hsl(0 0% 97.3%);
  --gray3:  hsl(0 0% 95.1%);   /* card hover bg, fake-button bg */
  --gray4:  hsl(0 0% 93.0%);   /* fake-button hover */
  --gray5:  hsl(0 0% 90.9%);   /* tile border, hairline */
  --gray6:  hsl(0 0% 88.7%);
  --gray7:  hsl(0 0% 85.8%);
  --gray8:  hsl(0 0% 78.0%);
  --gray9:  hsl(0 0% 56.1%);   /* focus ring, tertiary text */
  --gray10: hsl(0 0% 52.3%);   /* hairline pulse mid-state */
  --gray11: hsl(0 0% 43.5%);   /* secondary text, labels */
  --gray12: hsl(0 0% 9.0%);    /* 主文字 — 不是 #000 */

  /* Dark mode */
  --gray1-d:  hsl(0 0% 8.5%);   /* 页面背景 — 不是 #000 */
  --gray12-d: hsl(0 0% 93.0%);  /* 主文字 — 不是 #fff */

  /* Klein blue —— 你的品牌色，演化成"机构色"角色 */
  --klein: #002fa7;
}

/* P3 宽色域 override —— Mac 显示器上更饱和 */
@supports (color: color(display-p3 1 1 1)) {
  :root {
    --klein: color(display-p3 0 0.18 0.65);
  }
}
```

**Klein blue 使用规则**（必须严格）：
- ✅ Live 状态点（小圆点）
- ✅ Selection 高亮 (`::selection { background: var(--klein); color: white }`)
- ✅ Link hover state
- ✅ Active nav indicator
- ✅ 当前 frame 在 minimap 上的标记
- ❌ 大面积背景
- ❌ 装饰性 accent
- ❌ 任何"为了好看"的位置

### 4.2 字体系统（单字体单字重，从 rauno.me 学来）

```css
:root {
  /* Display + body —— 同一个字体做所有 */
  --font-sans: "Söhne", "PP Neue Montreal", -apple-system, BlinkMacSystemFont,
                "Segoe UI", Roboto, sans-serif;
  /* Mono */
  --font-mono: "JetBrains Mono", Menlo, monospace;
  /* Italic —— 关键的印刷传统：斜体走衬线 */
  --font-italic: Georgia, serif;
}

/* 关键全局规则 */
em, i { font-family: var(--font-italic); }

/* 抗锯齿 */
*, *::before, *::after {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**字体购买/替代**：
- 首选：[Söhne by Klim](https://klim.co.nz/retail-fonts/sohne/) (~$200/年，瑞士书设计气质)
- 次选：[General Sans](https://www.fontshare.com/fonts/general-sans)（免费，类似比例）
- 兜底：Inter Tight（免费，最接近替代品）

**字重纪律**（rauno.me 的核心规则）：
- 只用 **400** 和 **500**
- h1, h2, h3 → `font-weight: 500`
- body, links → `font-weight: 400`
- **绝不用 700/800（不用 bold）**
- 层级靠 **尺寸**，不靠 **粗细**

### 4.3 字号阶梯（跳跃式，不连续）

```css
:root {
  --fs-10: 10px;  --fs-12: 12px;  --fs-14: 14px;
  --fs-16: 16px;  --fs-20: 20px;  --fs-24: 24px;
  --fs-32: 32px;  --fs-40: 40px;  --fs-48: 48px;
  --fs-display: clamp(64px, 8vw, 85px);   /* hero 文字 */
}
/* 没有 18, 22, 28 —— 跳跃是有意的 */
```

### 4.4 行高（4px 倍数绝对值）

```css
:root {
  --lh-12: 12px;  --lh-16: 16px;  --lh-20: 20px;
  --lh-24: 24px;  --lh-28: 28px;  --lh-32: 32px;
  --lh-40: 40px;  --lh-48: 48px;
}
/* 14px body 配 28px line-height = 2.0 比例（rauno 的选择，编辑性十足）*/
```

**强制规则**：所有 line-height 都是 px 绝对值，不用 unitless 倍数（如 1.5, 1.6）。

### 4.5 间距（严格 8px 网格）

```css
:root {
  --space-1:  8px;   --space-2:  16px;  --space-3:  24px;
  --space-4:  32px;  --space-5:  40px;  --space-6:  48px;
  --space-7:  56px;  --space-8:  64px;  --space-9:  72px;
  --space-10: 80px;  --space-11: 88px;
  --space-print: 128px;   /* 长文页 padding */
}
/* 禁止 4px、12px、20px、28px 等非 8 倍数值 */
```

### 4.6 Easing 系统（一条签名 + 一条默认）

```css
:root {
  --ease-snappy: cubic-bezier(0.2, 0.8, 0.2, 1);  /* 签名曲线 */
  --ease-default: ease;
}
```

**纪律**：
- 所有"有性格"的 transition 用 `--ease-snappy`（hover、reveal、entrance）
- 所有"次要"的 transition 用 `ease`（tertiary fades）
- **绝不用 `ease-in-out`**（这是 default 痕迹）
- **绝不用 `transition-all`**（每处独立指定）

**duration 阶梯**：
- 150ms — color/bg hover
- 200ms — minimap、gradient overlay
- 350ms — entrance reveal
- 500ms — text reveal with filter
- 1000ms — "drawing" animations（hairline draw）

### 4.7 圆角

```css
:root {
  --radius-1: 4px;
  --radius-2: 8px;
  --radius-3: 12px;
  --radius-round: 9999px;
}
/* 没有 16px、24px 大圆角 —— rauno 全站最大用 12px */
```

### 4.8 阴影（极弱）

```css
:root {
  --shadow-small:   0 5px 10px  rgba(0, 0, 0, 0.12);
  --shadow-medium:  0 8px 30px  rgba(0, 0, 0, 0.12);
  --shadow-large:   0 30px 60px rgba(0, 0, 0, 0.12);
  --shadow-tooltip: 0px 4px 8px 0px rgba(0, 0, 0, 0.04),
                    0px 1px 1px 0px rgba(0, 0, 0, 0.02);
}
```

**纪律**：层级靠 1px hairline 边线，不靠 drop shadow。阴影只用在浮层 / 弹窗 / tooltip。

### 4.9 选区高亮

```css
::selection { background: var(--klein); color: white; }
```

### 4.10 Cursor 语义化

```css
.copy-button     { cursor: copy;       }
.editable-code   { cursor: text;       }
.drag-handle-x   { cursor: ew-resize;  }
.drag-handle-y   { cursor: ns-resize;  }
.drag-handle-xy  { cursor: move;       }
```

### 4.11 标点符号纪律

- ✅ 真正的 em-dash `—` (U+2014)
- ✅ 弯引号 `"..."` (U+201C/D)
- ✅ 真正的省略号 `…` (U+2026)
- ❌ 直接打的 `--`、`"`、`...`

---

## 5. 信息架构（IA）

### 5.1 页面清单

```
/                       Hero + 纵向 deck（核心 surface）
/work/[slug]            案例详情页（gnovi 是首选）
/about                  ID-trained → DE → AI builder 叙事
/studies                9 demo 收纳处（重命名为 "Interface studies"）
/industrial-design      ID 项目页（保留，撤下主导航）
/contact                保留或合并进 /about footer
```

### 5.2 主导航（极简）

```
Work · About · Contact         （右上 / 顶部）
GitHub                         （外链，与上面同等视觉权重）
```

不放 Studies（次级页面），不放 Industrial Design（撤下）。

### 5.3 数据层调整（cases.ts）

新增字段：

```typescript
export interface CaseEntry {
  // 现有字段保留
  slug: string;
  title: string;
  // ...
  
  // 新增
  tier: "feature" | "study";        // feature = 主页 deck 显示，study = /studies 页显示
  buildMeta?: {
    framework?: string;             // "Next.js 16" / "Electron 34"
    deployedAt?: string;            // ISO date
    repoUrl?: string;
    demoVideoUrl?: string;
  };
}
```

迁移：
- `gnovi` 新增，`tier: "feature"`，置顶
- 现有 9 demo 全部 `tier: "study"`
- 之后挑 1-2 个 ID 获奖项目 / ADA 等加入 feature tier

---

## 6. 主门面：纵向 deck 设计

### 6.1 思路总览

灵感来自 [rauno.me](https://rauno.me) 横向 deck，**改造为纵向以适配 web-native scroll 行为**。核心特征：

- 6 帧纵向排列，每帧占 1 屏
- 帧之间有"呼吸 gray 空气"（不填满 viewport）
- `scroll-snap-type: y proximity`（温柔吸附，不强制）
- 每帧入场动画（IntersectionObserver 触发）
- 右侧 1px hairline 进度尺
- 顶部 sticky mono 标签（"INDEXED 2026 · 03 / 06"）
- 没有 fixed center cross（去掉 rauno 横向版本的这个元素，因为纵向不需要）

### 6.2 6 帧的内容编排

| Frame | 内容 | 视觉重心 | label |
|---|---|---|---|
| 01 | **Identity** — RYAN ZHANG + 一行 positioning + 一行 mono meta | 大字 + 留白 + 小尺寸肖像（可选） | `HOME` |
| 02 | **gnovi** — 标题 + autoplay demo video + 一段 thesis + repo/case 链接 | 视频是主角 | `FOCUS · GNOVI` |
| 03 | **Selected work / 01** — ADA 或获奖项目 | 静态封面 + 一行说明 | `WORK 01` |
| 04 | **Selected work / 02** | 同上 | `WORK 02` |
| 05 | **Selected work / 03** | 同上 | `WORK 03` |
| 06 | **About + Contact** — 简短叙事 + email + GitHub | 文字 + links | `MAKE CONTACT` |

### 6.3 关键 CSS 模式

```css
.deck {
  background: var(--gray3);
  scroll-snap-type: y proximity;     /* 不是 mandatory */
  scroll-snap-stop: normal;           /* 不是 always */
}

.deck-chrome {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 16px 32px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--gray11);
  background: linear-gradient(to bottom, var(--gray3) 70%, transparent);
}

.frame {
  min-height: 100dvh;                 /* dvh, 不是 vh */
  display: grid;
  place-items: center;
  scroll-snap-align: center;
  position: relative;
  padding-block: 10vh;
}

.frame > .label {
  position: absolute;
  top: calc(50% - min(36vw, 360px) - 28px);
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--gray11);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.frame > .card {
  width: min(1200px, 90vw);
  aspect-ratio: 16 / 10;
  background: white;
  border: 1px solid var(--gray5);
  border-radius: 8px;

  opacity: 0;
  transform: scale(0.97) translateY(8px);
  transition:
    opacity 400ms var(--ease-snappy),
    transform 600ms var(--ease-snappy);
}

.frame.in-view > .card {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.hairline-progress {
  position: fixed;
  right: 32px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--gray5);
}

.hairline-progress > .marker {
  position: absolute;
  width: 1px;
  height: 16px;
  background: var(--gray9);
  transform: translateX(-50%);
  transition: background 200ms ease;
}

.hairline-progress > .marker.active {
  background: var(--klein);
}

@media (prefers-reduced-motion: reduce) {
  .frame > .card {
    opacity: 1;
    transform: none;
    transition: none;
  }
  .deck { scroll-snap-type: none; }
}
```

### 6.4 入场触发（IntersectionObserver）

```js
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
    }
  });
}, {
  threshold: 0.5,
  rootMargin: '-10% 0px',
});

document.querySelectorAll('.frame').forEach(f => io.observe(f));
```

### 6.5 移动端注意

- 用 `100dvh` 不要 `100vh`（避免 Safari 地址栏问题）
- `aspect-ratio: 16 / 10` 在窄屏下会变得太矮，加 `min-height: 60vh` 兜底
- 进度 hairline 在 < 768px 时改成底部横向（或直接隐藏，让原生 scroll bar 承担）

### 6.6 三个常见坑

1. **纵向 deck 的 frame 1 必须是 hero**：必须在 0 滚动时承担"我是谁 + 在做什么"的判断责任。
2. **Snap 和 scroll-driven animations 在 Safari 上冲突**：初版用 IntersectionObserver，等 Safari 普及度更高再上 `animation-timeline: scroll()`。
3. **不要硬 snap**（mandatory）：会让滚动感觉被劫持，违反"clean"诉求。

---

## 7. 案例详情页（/work/[slug]）

### 7.1 模板结构（工程师阅读模式）

```
1. Hero            项目名 + 一行 scenario + meta（年份、栈、行业）+ 状态
2. Cover           完整封面图 / autoplay 视频
3. Context         50 字：为谁做、解决什么、约束
4. Decisions       2-3 个具体决策展开
                   每条 = "考虑过 A，选了 B，因为 X"
                   配局部对比图、代码片段、组件状态对比
5. Outcome         live URL + 关键数字 / 状态
6. Build meta      框架版本、关键依赖、deploy 信息（紧凑一行）
7. Reflection      "What I'd build differently"（如果有）
8. Next/Prev       下一个 case
```

### 7.2 gnovi 详情页（首推）

参考用户已写好的 [gnovi README](https://github.com/?/gnovi) 的结构（用户分享过完整版）：

- **Hero**: "AI Chat with Draggable Workspace"
- **What this demo demonstrates**（4 条 novel）
  1. Universal drag primitive across 8 heterogeneous surfaces (`application/x-context-reference` MIME)
  2. Inline browser workspace AI can drive (6 browser tools)
  3. Polished interaction layer without heavyweight deps (no dnd-kit, no framer-motion)
  4. Multi-provider AI streaming (Anthropic / OpenAI / Gemini behind unified orchestrator)
- **Tech stack table**
- **Code map** (curated 7 entry files)
- **Git history** (19 commits as design narrative)
- **What I'd build differently**

把这些转成**有视觉处理的 portfolio 长文**——不是 GitHub README 的 plain markdown，而是：
- inline 视频 / GIF
- 真实代码片段（带 syntax highlight）
- 架构图（ASCII 升级成真实图）
- 决策叙事（不是 bullet list）

### 7.3 长文版式（Phaidon 画册密度）

```css
.case-study {
  max-width: 960px;
  margin-inline: auto;
  padding: var(--space-print);   /* 128px desktop */
  display: flex;
  flex-direction: column;
  gap: 28px;                      /* 等于 line-height-28，行间留白对齐 */
}

@media (max-width: 768px) {
  .case-study { padding: var(--space-3); }   /* 24px mobile */
}
```

---

## 8. /about 重写

### 8.1 结构

```
1. 一段叙事（150 字）   "I trained as an industrial designer..."
                       ID → 产品设计 → AI-native building 的转化故事

2. How I work          150 字以内的一段
                       worktree + Claude design handoff + multi-provider 流程
                       纯文字，不要图表

3. Recognition         4 个奖项紧凑陈列
                       AWARD_NN · YEAR · INSTITUTION mono 索引格式

4. Industrial design   一句话 + 链接到 /industrial-design
                       "Trained as an industrial designer; the foundation
                        still informs how I think about object/interaction."

5. Contact             email + 社交链接，inline
```

### 8.2 肖像位置

肖像从主页 hero 撤下后，**放在 /about**。尺寸大约 200-300px，不再是全幅"fashion editorial"。位置在叙事段落旁边，作为 portrait of subject 而非 hero element。

---

## 9. /studies（9 demo 的归宿）

### 9.1 重新框定

把 9 demo 从"Featured Work"重新命名为 **"Interface studies"** 或 **"Client-style explorations"**——明确**它们是练习/探索，不是代表作**。

### 9.2 视觉处理

- 不在主导航
- 入口在 /about footer 或 /work 末尾的小链接："More — interface studies (n=9)"
- 页面本身用紧凑列表，不用主页的 80vh 全屏封面
- 每条仅显示：编号、名字、行业、`live` / `placeholder` 状态、年份

### 9.3 不要做的事

- ❌ 不要试图给每个 study 写 case study
- ❌ 不要继续在 ROADMAP 里把"完成 9 demo"当主线 KPI
- ✅ 但**保留 worktree 工作流**——9 demo 可以继续做，作为练习场，只是不再是 portfolio 主门面

---

## 10. Phase A 执行计划

### 10.1 总览

总周期：5-6 周。前提是用户接受当前定位 + 视觉策略 + IA 决策。

| Phase | 内容 | 时间 |
|---|---|---|
| **A0** | 视觉 token 系统落地（globals.css）+ 字体购买 | 2-3 天 |
| **A1** | 首页 hero 重写 + identity frame + 纵向 deck 骨架 | 1 周 |
| **A2** | /work/gnovi 长文（Phaidon 密度）| 2 周 |
| **A3** | WorkStream → 纵向 deck 改造 + /about 重写 + /studies 页面 | 1.5 周 |
| **A4** | gnovi drag 微 demo（签名级 craft） | 3-4 天 |
| **A5** | 全局 hover/focus 系统化 + 上线前 polish | 3-4 天 |

### 10.2 A0 任务清单（最优先）

文件：`apps/portfolio/app/globals.css`

- [ ] 引入 Söhne / 替代字体的 @font-face
- [ ] 加上面 §4 全部 CSS variables（颜色、字号、行高、间距、easing、radius、shadow）
- [ ] 全局规则：`em, i { font-family: Georgia, serif }`
- [ ] 全局规则：`::selection { background: var(--klein); color: white }`
- [ ] 全局规则：抗锯齿
- [ ] 暗色模式 `[data-theme="dark"]` overrides（如果暗色模式要做）
- [ ] P3 `@supports` block

文件：可能要改 `tailwind.config.ts`（如果用 Tailwind）：
- [ ] colors 改成引用 CSS variables
- [ ] spacing 改成 8px 严格制
- [ ] fontSize 改成跳跃阶梯
- [ ] fontFamily 引用 CSS variables

### 10.3 A1 任务清单

- [ ] 移除现有 page.tsx 的 hero 巨型字 + 全幅肖像
- [ ] 写新 hero：名字 + positioning sentence + GitHub 链接 + email
- [ ] 实现 deck 容器结构（`.deck`、`.frame`、`.card`、`.label`、`.hairline-progress`）
- [ ] 实现 IntersectionObserver hook
- [ ] 实现顶部 sticky mono chrome（"INDEXED 2026 · 03 / 06"）
- [ ] Frame 01（Identity）+ Frame 06（Contact）填内容

### 10.4 A2 任务清单

- [ ] 建 /work/gnovi 路由
- [ ] 提取 gnovi 视频成 2 个 GIF（drag、browser slide-in）+ 主 demo 视频
- [ ] 把 gnovi README 改写成 portfolio 版本（hero / what's novel / interaction / architecture / reflection / footer）
- [ ] 应用 Phaidon 长文样式（128px padding, 960px max-width, 28px gap）
- [ ] inline 真实代码片段
- [ ] 架构 ASCII 图升级成 SVG / Figma 出图

### 10.5 A3 任务清单

- [ ] cases.ts 加 `tier: "feature" | "study"` 字段
- [ ] gnovi 加入 cases.ts，置顶，feature
- [ ] WorkStream 改成纵向 deck 中的 Frame 02-05
- [ ] /studies 路由 + 紧凑列表组件
- [ ] /about 重写：叙事段 + How I work + 紧凑奖项 + 肖像
- [ ] /industrial-design 撤下主导航，从 /about 链入
- [ ] /contact 决定保留 or 合并

### 10.6 A4 任务清单

- [ ] 从 gnovi 抽出 universal drag MIME 核心代码
- [ ] 在站点上做最小可行版本：访客可以拖站上元素到一个 input，元素被识别为 ContextReference
- [ ] 放在 /work/gnovi 的"Interaction"段，或独立放在主页一帧

### 10.7 A5 任务清单

- [ ] 全局禁用 `transition-all`，改成各处独立指定
- [ ] 所有 transition 用 `--ease-snappy` 或 `ease`，禁用 `ease-in-out`
- [ ] 所有 hover state 加 transform 微变化（不只是颜色）
- [ ] 自定义 focus ring（`outline: 2px solid var(--gray9); outline-offset: 2px`）
- [ ] 标点纪律：em-dash、弯引号、真省略号
- [ ] `cursor: copy` / `cursor: text` 应用到对应元素
- [ ] 错误页 / 加载态 / 空态全部设计

---

## 11. 反目标（绝对不做）

### 11.1 视觉层面

- ❌ 黑底 + 绿/紫霓虹（cyberpunk dev-bro）
- ❌ Terminal 仿真 widget
- ❌ Matrix 代码雨
- ❌ 自定义鼠标光标（除非绝对必要）
- ❌ Scroll-jacking / 过度 parallax
- ❌ "I'm building in public" tagline
- ❌ Stock hero illustration
- ❌ Tech stack logo 墙
- ❌ "Powered by Vercel/Tailwind" badge

### 11.2 内容层面

- ❌ 空 blog（没有 3 条以上内容前不开 /notes）
- ❌ Tagline 式标语
- ❌ Testimonial 块
- ❌ Quantitative-flex bullet（revenue / users / lift %）
- ❌ "Now playing" / "Currently reading"（与 AI-builder 主轴无关）
- ❌ Year-in-review 大改版（破坏 archival 调性）

### 11.3 IA 层面

- ❌ /lab 独立页面（暂不做，看后续）
- ❌ /uses 独立页面（暂不做）
- ❌ Stack/Tools 页面
- ❌ RSS / newsletter（管理成本不对等）
- ❌ 主导航 5 个以上 item
- ❌ 在主页加交互 demo embed（破坏 deck 节奏）

### 11.4 工作流层面

- ❌ 在 Phase A 期间开新 demo worktree
- ❌ 同时改设计语言 + 写 case study + 做 craft demo（要串行）
- ❌ 追求第一版完美（A4/A5 可以上线后渐进）

---

## 12. 待决问题

执行 Phase A 之前需要确认：

### 12.1 内容层面

- [ ] **gnovi 的 public 状态**：repo 公开吗？demo 视频在哪？README 的 GIF 占位符已有素材吗？
- [ ] **ADA 是什么**：能成为 Featured #2 吗，还是不够强？
- [ ] **OpenWork / FlutterFlow / Rebolt 的具体 target**：是岗位还是公司类型？时间窗口几个月？

### 12.2 视觉层面

- [ ] **是否接受肖像从主页撤下**（移到 /about）
- [ ] **字体预算**：Söhne 商业字体 ~$200/年，or 用 General Sans 免费？
- [ ] **是否做暗色模式**：rauno.me 有，但你站如果不需要可以省

### 12.3 范围层面

- [ ] **9 demo 移到 /studies 心理上接受吗**（这是 strategy 转向最大的舍）
- [ ] **`/contact` 保留独立 vs 合并进 about footer**
- [ ] **Phase A 期间停止投递 FlutterFlow/Rebolt**（换更好的 surface）

### 12.4 资源层面

- [ ] **总时间预算**：5-6 周可行吗？
- [ ] **是否有 demo 视频已剪好**（gnovi 那个）
- [ ] **GitHub profile README** 同步写吗（30 分钟事，零成本加分）

---

## 13. 文档维护

- 每完成一个 Phase 阶段，回到 §10 勾选完成项
- 每做一个新决策，回到 §12 移除 / 更新待决问题
- 如果做完 Phase A 后想加 /lab 或 /notes，新开一份 `STRATEGY-PHASE-B.md`，不要在这份里追加（避免文档臃肿）
- 视觉 token 系统（§4）实施后，**以 globals.css 为单一真相源**——本文档的 CSS 仅作记录，遇到冲突以代码为准

---

## 14. Session 2 Motion Model Deep-Dive

> 这一节是 2026-04-26 第二轮 session 的实施记录。
> §6 是初版规划（scroll-snap + IntersectionObserver），**已被本节内容取代**——
> 新方案是 fixed-position deck + JS-driven motion，更接近 rauno.me 的真实架构。

### 14.1 我们抛弃的初版方案

§6 写的纵向 deck 用 `scroll-snap-type: y proximity` + IntersectionObserver 触发入场。落地后发现两个问题：

1. **scroll-snap 让用户感觉被劫持** —— 即使 proximity 模式，scroll 行为也不够"自由"
2. **per-frame 入场动画**和 rauno 的物理感不一致 —— rauno 的 frame 在 scroll 中是**静态刚体**，整体只通过 deck-level scale + 内容 parallax 动

### 14.2 实际落地的方案（Session 2）

```
架构：
  Body 中有一个 hidden spacer，决定可滚动距离
  Fixed-position deck stage 占满 viewport
  Track 在 stage 内 absolute 定位，包含 6 张统一 card
  JS 每帧读 scrollY，应用：
    - translateY = -scrollY               (Y-轴 1:1)
    - scale = position-based cosine       (1 ↔ 0.78)
    - per-card parallax on body content   (subtle drifting)
```

### 14.3 Scale 数学（position-based，verified by reading rauno's JS）

我亲自读了 [rauno.me/_next/static/chunks/pages/index-25e30adbdf1f855a.js](https://rauno.me/_next/static/chunks/pages/index-25e30adbdf1f855a.js) 的第 303-311 行，确认 rauno 的 scale 机制：

```js
F = useSpring(1, { stiffness: 500, damping: 50 })

function X(e) {                      // e = scrollY
  let t = o.current;                  // o.current ≈ 1 (fit scale)
  if (e > 0) {
    t = clamp(F.get() - 0.0001 * e, [0.6, o.current]);
  }
  F.set(t);
}
```

**Agent 之前报告"momentum 停后弹回 1"是错的**。实际上 F 只在 `scrollY === 0` 时被显式 set 回 1。其他时候停在最后一次 set 的值，且每次 scroll 事件都会让目标 ratchet down 一些。

视觉效果：滚动时 scale 持续往 0.6 下限减，撞底之后稳住；滚回 scrollY=0 才弹回 1。

**我们的纵向适配**：

```typescript
const HOME_SCALE = 1
const DECK_SCALE = 0.78       // 比 rauno 的 0.6 温和；纵向不需要那么强的压缩
const damping_factor = 0.4    // 临界阻尼，~3 帧（~50ms）沉降

// 在 tick 函数里
if (effectiveStep > 0) {
  const range = effectiveStep * 0.7    // transition 在 0.7 cardStep 内完成
  const t = Math.min(scrollY / range, 1)
  const eased = (1 - cos(t * π)) / 2
  targetScale = HOME_SCALE + (DECK_SCALE - HOME_SCALE) * eased
}
scale += (targetScale - scale) * 0.4
```

**为什么用 position-based 而不是 rauno 的 velocity-based**：rauno 的 velocity-based 在 mouse wheel 上会"一跳一跳"（每个 wheel notch 触发一次脉冲收缩）。Position-based 用 scrollY 直接驱动，跨设备一致、平滑，**比 rauno 实现更好**（不是 inferior 替代品）。

### 14.4 effectiveStep 补偿

scroll 时 deck scale 0.78，**1px scroll = 0.78px 视觉移动**。所以一张卡的视觉移动 = 822px CSS 实际需要 822/0.78 = 1054px scroll。

```
effectiveStep = cardStep / DECK_SCALE
spacer height = (cardCount - 1) × effectiveStep + 8
activeIndex = round(scrollY / effectiveStep)
scrollToIndex(N).scrollY = N × effectiveStep
```

不补偿的话用户滚到 scrollY=822 时 chrome 会标 "02/06"，但视觉上 Stash 还没居中——会困惑。

### 14.5 Per-card body parallax (drifting)

来自 rauno JS 第 541-553 行的 per-frame slide spring：

```js
k = useSpring(0, { stiffness: 500, damping: 40 })
useMotionValueEvent(translateX, "change", e => {
  let t = -1 * e
  if (t > N) {
    let parallax = clamp(t - N, [0, j])    // j = max parallax for this frame
    k.set(-1 * parallax)
  }
})
// 然后 frame 内容用 style={{ x: k }}
```

**纵向适配**（已实现，see §0a）：

```typescript
const PARALLAX_FACTOR = 0.18
const PARALLAX_MAX = 90

for each card (i):
  cardCenter = i × effectiveStep
  distance = scrollY - cardCenter
  target = clamp(distance × 0.18, [-90, 90])
  current += (target - current) × 0.35
  card.body.transform = translateY(${current}px)
```

视觉效果：
- **卡进入屏幕时**：内容预先偏离（往上扎），随卡到位 settle to natural
- **卡居中时**：内容在自然位置
- **卡离开时**：内容下沉，赖在视野里比卡多停一拍（trailing）

这是"settle/trail"方向。rauno 是"escape"方向（内容飞出比卡更快）。两个都合法，纵向 + sustained-scale 的语境下 trail 更稳重。

要切换 escape 方向：把 `translateY(${current}px)` 改成 `translateY(${-current}px)`。

### 14.6 Clip-reveal text replay (scroll-stop)

每张卡内的关键文字都包了 `.clip-line`：

| Card | Beats |
|---|---|
| Hero | 8（7 行 manifesto + 按钮）|
| Stash | 4（标题 / 描述 / bullets / CTA）|
| Work × 3 | 3（标题 / 描述 / footer）|
| Contact | 3（标题 / 描述 / CTA）|

**初次加载行为**：
- Hero：CSS clip-line 动画跑（每行错落 100ms × 800ms duration）
- 其他卡：CSS 设了 `transform: translateY(0); animation: none` —— 静态。Card 整体由 `deck-card-load-fade` 在 800ms 处一次性 fade in

**Re-entry 行为**（JS replay）：
- 监听 scroll，220ms 停下后触发 replay
- 检查 active card 是否和上次播过的不同；同则跳过
- 用 Web Animations API：cancel 旧动画，重播 `translateY(110%) → 0`
- 80ms × i stagger，800ms duration，`cubic-bezier(0.2, 0.8, 0.2, 1)`，fill: 'both'
- 用户首次 mount 时 `lastReplayedIdx = 0`（hero 已被 CSS 揭示），跳过首播

### 14.7 Hero manifesto（三级语义嵌套）

7 行结构（用户写的最终版）：

```
Ryan Zhang                               [indent 0]
    is a design engineer                 [indent 1]
        designing with coding agents     [indent 2]
    making AI-native interfaces          [indent 1]
        that ship as they're designed    [indent 2]
    currently building                   [indent 1]
Stash — a macOS Taste Library            [indent 0, italic Stash]
```

视觉规范：
- font-size: clamp(28px, 3.6vw, 56px)
- font-weight: 400（不是 500，向 rauno 印刷血统靠）
- line-height: 1.12
- indent 1: clamp(var(--space-2), 2.4vw, 36px)
- indent 2: clamp(var(--space-4), 4.8vw, 72px)
- "Stash" 用 `<em>` 触发全局 italic Georgia 衬线规则
- em-dash 用真符号 `—`（U+2014）
- punchline 行（最后一行）上方有微小额外间距

每行用 `.clip-line` 包裹，data-delay 0-7 错落 100ms（hero 这是初始 CSS 动画，replay 用 JS 各 80ms）。

### 14.8 视觉系统已落地的具体值

详见 §4，但实际生效的关键：

```css
:root {
  /* Radix Gray scale — 文字背景全部远离纯黑白 */
  --color-gray-1:  hsl(0 0% 99%);
  --color-gray-3:  hsl(0 0% 95.1%);     /* deck stage background */
  --color-gray-5:  hsl(0 0% 90.9%);     /* card border */
  --color-gray-9:  hsl(0 0% 56.1%);     /* tertiary text */
  --color-gray-11: hsl(0 0% 43.5%);     /* secondary text, mono labels */
  --color-gray-12: hsl(0 0% 9%);        /* primary text */

  /* Klein blue + P3 override */
  --color-klein: #002fa7;               /* sRGB fallback */
  /* P3: color(display-p3 0 0.184 0.655) on capable displays */

  /* 唯一 signature easing */
  --ease-snappy: cubic-bezier(0.2, 0.8, 0.2, 1);

  /* 严格 8px 间距 + 跳跃式字号 */
  --fs-display: clamp(56px, 8vw, 96px);
  /* 14px / 28px 行距是 editorial 印刷比例 */
}

/* 印刷血统 */
em, i { font-family: Georgia, "Times New Roman", serif; }
::selection { background: var(--color-klein); color: white; }
```

Card 统一规范：
- 1200 × 750 (16:10) 桌面，min(1200px, calc(100vw - 64px)) × auto 移动端
- White background，1px gray-5 border，12px radius
- Padding clamp(32px, 4vw, 56px)
- 6 张卡完全统一（包括 hero）

---

## 15. 待决 / 下一轮要讨论的（Pending）

### 15.1 Scroll-bound element animations（待讨论 + 实施）

**问题描述**（来自用户 Session 2 末尾）：现在卡内的元素只在两个时机动——初次加载（CSS）+ scroll-stop（JS replay）。用户希望**滚动过程中**卡内元素也"在动"，而且**手停就停**（动画时间轴绑死在 scroll position）。

**已讨论的方向**（用户 prefer 1+4）：

| 方向 | 描述 | 视觉量 |
|---|---|---|
| 1 | 单一焦点元素（h2 标题）跟 scroll subtle scale/move | 极低 |
| 2 | 卡内 bullets 按 progress 错落 reveal | 中 |
| 3 | secondary 元素（demo placeholder、accent dot）持续运动 | 极低 ambient |
| 4 | mono 数字 / 标签 micro-transition | 极低 |
| 5 | 卡的 emphasis 状态（边框、阴影）渐变 | 低 |

**推荐组合**：方向 1 + 4。
- 主角元素（每张卡 h2）随 scroll progress subtle scale 0.95 ↔ 1.0
- chrome 的数字、active marker 在过渡时有 micro-animation

**实现路径**：
- A. CSS `animation-timeline: scroll() / view()`（原生，最高效，Safari 26+ 已支持）
- B. JS 在现有 tick loop 加每张卡的 progress (0..1)，逐元素 apply transform
- C. Web Animations API + 把 `animation.currentTime` 绑定到 scroll progress

**推荐 B**（和现有架构最贴）。

**未决参数**：
- 主角元素 scale 量级（5% / 10% / 20%）
- 是否所有卡都做，还是只 hero + Stash
- chrome 是否也加 micro-animation

### 15.2 STRATEGY 之外的待办（来自 §10 / §12）

按重要性排序：

- [ ] **gnovi 公开化**：repo public + demo video → portfolio surface（影响 SURFACE 2 = GitHub profile）
- [ ] **/work/stash 路由**：deck Card 02 的 "Read case study" 链接当前会 404，需要写 Stash 长文（Phaidon 密度）
- [ ] **/about 重写**：ID-trained → DE → AI builder 叙事 + How I work + 紧凑 awards
- [ ] **/studies 路由**：把 18 个 placeholder 收纳，紧凑列表（gnovi 也在这里作 exploration）
- [ ] **GitHub profile README**：10 行以内，链接 portfolio
- [ ] **字体购买决策**：Söhne ($200/年) vs Inter Tight (免费)。当前用 Inter，若要更进印刷气质需升级
- [ ] **是否做暗色模式**

### 15.3 Phase A 进度 vs §10 计划

| Phase | 状态 |
|---|---|
| A0（视觉 token 系统） | ✅ 完成 |
| A1（首页 deck 改造） | ✅ 完成 + 大量超出原计划的运动系统 |
| A2（/work/gnovi 长文） | ❌ 未开始（且现在变成 /work/stash 优先） |
| A3（WorkStream 改造 + /about 重写 + /studies） | 部分完成（WorkStream 已替换为 deck，/about /studies 未做） |
| A4（gnovi drag 微 demo） | ❌ 未开始 |
| A5（全局 hover/focus 系统化） | 部分完成（Klein blue focus ring 已加；hover 微动效未系统化） |

---

## 16. 文档维护说明（再次声明）

- 本文档的 §0a / §14 / §15 是 Session 2 后新增的。如果未来还有第三轮 session，再加 §17 或开 STRATEGY-PHASE-B.md
- 所有具体 CSS 值以 [globals.css](app/globals.css) 为单一真相源；本文档仅记录决策与原始动机
- 所有动画行为以 [VerticalDeck.tsx](components/VerticalDeck.tsx) 为单一真相源
- Session 2 共改动文件：[globals.css](app/globals.css), [page.tsx](app/page.tsx), [VerticalDeck.tsx](components/VerticalDeck.tsx)（新建）, [cases.ts](lib/cases.ts), [Nav.tsx](components/Nav.tsx), [Footer.tsx](components/Footer.tsx)

---

## 附录 A：研究报告原件

完整研究报告（agent 输出原件）保存在以下两份文件，作为本策略的支撑材料：

- 设计工程师圈子调研：top 10 + 次推荐 + 跨站模式分析
- rauno.me 技术深度拆解：tech stack、字体、颜色、动画、交互细节、复制清单
- **rauno.me motion deep-dive**（Session 2 第三份调研）：scroll-snap=zero, scale-spring 真实行为, per-frame parallax 机制
- **rauno.me JS 直接阅读**（Session 2 我亲自做的）：第 303-311 行 scale 逻辑，第 541-553 行 parallax 逻辑

如需查询具体 CSS 值或动画曲线的来源验证，去原报告。

## 附录 B：关键链接快速索引

- 风格主参考：[rauno.me](https://rauno.me)
- 排版同源：[paco.me](https://paco.me) · [emilkowal.ski](https://emilkowal.ski)
- AI-native 范式：[skirano.com](https://skirano.com)
- ID + 软件双训背景：[ansonyu.me](https://ansonyu.me)
- 反面参考：[henryheffernan.com](https://henryheffernan.com)
- 编辑灵感：[032c.com](https://032c.com) · [thegentlewoman.co.uk](https://thegentlewoman.co.uk)
- 印刷工程同源：[press.stripe.com](https://press.stripe.com) · [linear.app/changelog](https://linear.app/changelog)
- 字体首选：[Söhne by Klim](https://klim.co.nz/retail-fonts/sohne/)
- 字体次选（免费）：[General Sans](https://www.fontshare.com/fonts/general-sans)
