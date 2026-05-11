# 自习课 2.0 — 重构计划

> **重构原则**：功能完全不变，只优化代码结构。保持纯原生 HTML/CSS/JS 技术栈，不引入任何构建工具或框架。

---

## 一、现状总览

### 1.1 当前文件结构

```
e:\自习课2.0\
├── clock.html              ← 主页面（含内联事件、注释掉的旧代码）
├── js/
│   ├── data.js             ← 时间范围数据 + 全局变量
│   ├── time.js             ← 数字时间更新（每秒 setInterval）
│   ├── clock.js            ← 模拟表盘刻度 + 指针旋转
│   ├── name.js             ← 名单增删（内联 HTML 拼接）
│   ├── alarm.js            ← 吃饭弹窗 + 背景音乐
│   └── min.js              ← 工具函数 + Ready() 空等逻辑
├── style/
│   ├── base.css / base.less       ← 全局复位 + CSS 变量
│   ├── clock.css / clock.less     ← 模拟表盘样式
│   └── style.css / style.less     ← 主体布局样式（@import clock.css）
├── img/                    ← 图标 + 背景图 + 指针 SVG
├── sound/                  ← 背景音乐 (ogg/wav/mp3)
└── HarmonyOS_Sans_SC.ttf   ← 数字等宽字体
```

### 1.2 代码量统计

| 类型 | 文件数 | 总行数（约） |
|------|--------|-------------|
| HTML | 1      | 119 行      |
| JS   | 6      | ~200 行     |
| CSS  | 3      | ~400 行     |
| LESS | 3      | ~380 行（与 CSS 重复，实际未编译） |

### 1.3 数据流现状（混乱）

```
data.js  ─── now, class_start, class_end (全局变量)
  ├──→ time.js   直接读取 now, class_start, class_end 更新数字时间
  ├──→ clock.js  直接读取 now 更新指针
  └──→ alarm.js  直接读取 now, class_end 设置闹钟 + 忙等 while(!ready){}

各文件之间零显式接口，全凭全局变量和脚本加载顺序隐式耦合。
```

---

## 二、问题清单（按严重程度分级）

### 🔴 严重问题（必须修复）

| # | 问题 | 位置 | 影响 |
|---|------|------|------|
| 1 | `while (!ready) {}` 忙等循环 | alarm.js:72 | 潜在浏览器卡死风险 |
| 2 | 16+ 全局变量污染 | 所有 JS 文件 | 命名冲突、不可维护 |
| 3 | 4 个 setInterval 各自运行 | data/time/clock.js | 性能浪费、难以管理 |
| 4 | 隐式脚本加载顺序强依赖 | clock.html | 换顺序就崩溃 |

### 🟡 中等问题（应该修复）

| # | 问题 | 位置 |
|---|------|------|
| 5 | 内联事件 `onclick="..."` / `onkeydown="..."` | clock.html |
| 6 | `event.keyCode` 已废弃 | name.js |
| 7 | `children[0]` / `children[2]` 硬编码索引 | time.js |
| 8 | innerHTML 拼接 HTML 字符串 | name.js |
| 9 | 时钟表盘刻度每秒重绘 (`setInterval(fn, 0)`) | clock.js |
| 10 | `opcity` 拼写错误 | base.css |
| 11 | 注释掉的大段旧代码 | clock.html / alarm.js |
| 12 | 空 IIFE | name.js |

### 🟢 优化问题（建议改善）

| # | 问题 | 位置 |
|---|------|------|
| 13 | `<center>` 标签已废弃 | clock.html |
| 14 | `<div>` 包裹 `<script>` 不必要 | clock.html |
| 15 | CSS 通过 `@import` 导入，增加请求链 | style.css |
| 16 | LESS 文件与 CSS 文件并存，实际只用 CSS | style/ |
| 17 | 文件名 `clock.html` 不够直观 | 根目录 |

---

## 三、目标架构

### 3.1 目标文件结构

```
e:\自习课2.0\
├── index.html                  ← 重命名自 clock.html，清理内联事件和旧代码
├── css/
│   └── style.css               ← 合并 base + clock + style，按模块分区
├── js/
│   ├── app.js                  ← 主入口：初始化 → 主循环（单一 rAF）→ 模块编排
│   ├── names.js                ← 名单模块：增/删/渲染 + 事件委托
│   └── dinner.js               ← 吃饭模块：闹钟 → 弹窗 → 倒计时 → 音乐
├── img/                        ← 不变
├── sound/                      ← 不变
└── HarmonyOS_Sans_SC.ttf       ← 不变
```

### 3.2 目标数据流（清晰单向）

```
                    ┌─────────────────────────────────────────┐
                    │              app.js (主控)               │
                    │                                         │
                    │  state = {                              │
                    │    now: Date,                            │
                    │    classStart: Date,                     │
                    │    classEnd: Date                         │
                    │  }                                       │
                    │                                         │
                    │  requestAnimationFrame 主循环：           │
                    │    1. 更新 state.now                     │
                    │    2. 每秒触发一次 UI 更新                 │
                    │       ├── updateDigitalClock(state)       │
                    │       └── updateAnalogClock(state)        │
                    │    3. 一次性 setTimeout 处理吃饭闹钟      │
                    │                                         │
                    └────┬──────────────┬─────────────────────┘
                         │              │
                    ┌────▼────┐   ┌─────▼──────┐
                    │ names.js│   │ dinner.js  │
                    │         │   │            │
                    │ - init  │   │ - schedule │
                    │ - 增/删  │   │ - show     │
                    │ - 事件委托│   │ - 倒计时   │
                    └─────────┘   └────────────┘
```

### 3.3 模块接口设计

```js
// ============ app.js ============
// 持有全局状态，编排所有模块
const App = {
    state: { now: new Date(), classStart: null, classEnd: null },
    init() { /* 计算时间范围 → 启动 rAF 主循环 → 初始化子模块 */ }
};

// ============ names.js ============
// 名单管理，完全自治，不依赖外部状态
const Names = {
    init(container) { /* 绑定事件委托、挂载 DOM */ },
    add(name)      { /* 添加一个人 */ },
    clear()        { /* 清空名单 */ }
};

// ============ dinner.js ============
// 弹窗 + 闹钟，接收 classEnd 和 now 作为参数
const Dinner = {
    schedule(classEnd) { /* 计算 delay → setTimeout → 触发显示 */ },
    show()             { /* 显示弹窗 + 播放音乐 */ },
    hide()             { /* 隐藏弹窗 + 停止音乐 */ }
};
```

---

## 四、分步重构计划

重构遵循 **小步快跑、每步可验证** 的原则。每一步完成后都能正常运行。

---

### 阶段一：紧急修复（P0 致命问题）

#### 步骤 1.1 — 修复 CSS 拼写错误

**文件**：`style/base.css` 第 25 行

**操作**：
- 将 `transition: opcity .3s;` 改为 `transition: opacity .3s;`

**验证**：添加名字时的输入框淡入淡出动画应正常工作。

---

#### 步骤 1.2 — 消除忙等循环

**文件**：`js/alarm.js`、`js/min.js`、`js/data.js`

**操作**：
1. 删除 `alarm.js` 中的 `while (!ready) {}`（第 72 行）
2. 删除 `min.js` 中的 `Ready()` 函数（第 9-11 行）
3. 删除 `time.js` IIFE 中的 `Ready()` 调用（第 2 行）
4. 删除 `data.js` 末尾的 `ready = 1;`（第 26 行）
5. 将 `alarm.js` 的启动逻辑改为监听 `DOMContentLoaded` 事件

**修改后的 alarm.js 启动逻辑**（伪代码）：
```js
// 原来：while (!ready) {} → 直接执行
// 改为：
document.addEventListener('DOMContentLoaded', () => {
    if (class_end - now >= 0) {
        document.addEventListener('mouseover', () => {
            setTimeout(dinnerCount, class_end - now);
        }, { once: true });
    }
});
```

**验证**：页面正常加载，到吃饭时间弹窗正常出现。

---

#### 步骤 1.3 — 修复 `event.keyCode` 废弃 API

**文件**：`js/name.js` 第 18 行

**操作**：
- 将 `if (event.keyCode === 13)` 改为 `if (event.key === 'Enter')`

**验证**：在名字输入框中按 Enter 能正常添加名字。

---

### 阶段二：合并与清理（P1 结构问题）

#### 步骤 2.1 — 合并 / 重命名 HTML 文件

**操作**：
1. 删除 `clock.html` 中被注释掉的旧 HTML 块（第 42-68 行）
2. 去除包裹 `<script>` 的 `<div id="scripts" style="display: none">`
3. 将 `<center>` 标签替换为 CSS `text-align: center`
4. 将文件重命名为 `index.html`
5. 更新 `<link>` 路径引用：`./style/base.css` → `./css/style.css`、删除 `./style/style.css`
6. 更新 `<script>` 路径引用

**修改后的 index.html 骨架**：
```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="utf-8"/>
    <title>自习课</title>
    <link href="./css/style.css" rel="stylesheet">
</head>
<body>
    <main>
        <!-- 时钟区域 -->
        <!-- 名单区域 -->
        <!-- 吃饭弹窗 -->
    </main>
    <script src="./js/data.js"></script>
    <script src="./js/time.js"></script>
    <script src="./js/clock.js"></script>
    <script src="./js/name.js"></script>
    <script src="./js/alarm.js"></script>
</body>
</html>
```

**验证**：页面布局不变，所有功能正常。

---

#### 步骤 2.2 — 去除内联事件处理器

**文件**：`index.html`、`js/name.js`

**操作**：
1. 从 HTML 中删除所有内联事件属性：
   - `<button onclick="names_input();">` → `<button id="names-additem">`
   - `<button onclick="names_clear()">` → `<button id="names-clear">`
   - `<input onkeydown="names_addPerson(event)">` → `<input id="names-add-input-value">`
2. 为这些元素补充 `id` 属性（如果缺失）
3. 在 `name.js` 的 IIFE 中绑定事件：

```js
(function() {
    document.getElementById('names-additem').addEventListener('click', names_input);
    document.getElementById('names-clear').addEventListener('click', names_clear);
    document.getElementById('names-add-input-value').addEventListener('keydown', names_addPerson);
})();
```

**验证**：添加按钮、清空按钮、Enter 添加名字均正常工作。

---

#### 步骤 2.3 — 消除硬编码 DOM 索引

**文件**：`js/time.js`

**操作**：
1. 为 time.js 中通过 `children[index]` 访问的元素添加 `id` 属性
2. 改为直接 `getElementById` 获取

**需要补充 id 的元素**：
- "自习课已开始" 文字所在的 `<span>`：添加 `id="info-starts-label"`
- 分钟 `<span>`：已有 `id="info-starts-m"` 和 `id="info-starts-s"` ✓
- 秒钟 `<span>`：已有 ✓

**修改后的 time.js 核心逻辑**：
```js
// 原来：
starter.parentNode.children[0].innerHTML = (diff > 0) ? '自习课已开始' : '距离开始还有';
starter.children[0].innerHTML = toTimeFmt(...);
starter.children[2].innerHTML = toTimeFmt(...);

// 改为：
document.getElementById('info-starts-label').textContent = (diff > 0) ? '自习课已开始' : '距离开始还有';
document.getElementById('info-starts-m').textContent = toTimeFmt(...);
document.getElementById('info-starts-s').textContent = toTimeFmt(...);
```

**同步修改 HTML**：在 `#info-starts` 的第一个 `<span>` 上添加 `id="info-starts-label"`

**验证**：数字时间正常更新，文字在开始前后正确切换。

---

#### 步骤 2.4 — 修复时钟表盘无意义重绘

**文件**：`js/clock.js`

**操作**：
1. 将 `setInterval(drawClock, 0)` 中的 `drawClock` 函数提取出来，**只在页面初始化时执行一次**
2. 保留 `setInterval(handsRorate, 1000)` 用于指针旋转（这是正确的每秒更新）

**修改逻辑**：
```js
// 原来：setInterval(function drawClock() { ... }, 0);  // 疯狂重绘
// 改为：在 IIFE 中直接调用一次
(function initClockLines() {
    // 计算并设置所有刻度和数字位置（只需一次）
    for (let min = 0; min < 60; ++min) { ... }
})();

// 保留：
setInterval(function handsRotate() { ... }, 1000);
```

**验证**：表盘正常显示，指针正常走动，CPU 占用明显降低。

---

### 阶段三：模块化重构（P1 架构优化）

#### 步骤 3.1 — 创建 JS 模块文件骨架

**操作**：
1. 创建 `js/app.js` — 空文件，后续填入主控逻辑
2. 创建 `js/names.js` — 先复制 name.js 的内容
3. 创建 `js/dinner.js` — 先复制 alarm.js 的内容
4. 删除旧文件 `js/min.js`（工具函数合并到 app.js）

此时新文件只有框架，功能仍由旧文件驱动。**暂不删除旧文件**。

---

#### 步骤 3.2 — 重构 names.js 模块

**目标**：将 name.js 改造为独立 IIFE 模块，无全局变量。

**操作**：

1. **使用事件委托替代逐个绑定**：

```js
const Names = (function() {
    const list = document.getElementById('names-list');

    function init() {
        // 事件委托：父容器统一处理点击
        list.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const piece = btn.closest('.names-piece');
            const timesEl = piece.querySelector('.names-piece-times');

            if (btn.classList.contains('names-increase')) {
                const n = Number(timesEl.textContent) + 1;
                timesEl.textContent = n;
                timesEl.setAttribute('times', n);
            }
            if (btn.classList.contains('names-decrease')) {
                const n = Number(timesEl.textContent) - 1;
                if (n === 0) {
                    piece.remove();
                } else {
                    timesEl.textContent = n;
                    timesEl.setAttribute('times', n);
                }
            }
        });
    }

    function addPerson(name) { /* 创建 DOM 并追加到 list */ }

    function clear() { list.innerHTML = ''; }

    function showInput() { /* 显示输入框 */ }

    return { init, addPerson, clear, showInput };
})();
```

2. **改造 `names_addPerson`**：将 `innerHTML` 拼接改为 `createElement`：

```js
function addPerson(name) {
    const piece = document.createElement('div');
    piece.className = 'names-piece';

    const left = document.createElement('div');
    left.className = 'names-piece-l';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'names-piece-name';
    nameSpan.textContent = name;

    const timesSpan = document.createElement('span');
    timesSpan.className = 'names-piece-times circle';
    timesSpan.setAttribute('times', '1');
    timesSpan.textContent = '1';

    left.appendChild(nameSpan);
    left.appendChild(timesSpan);

    const right = document.createElement('div');
    right.className = 'names-piece-r';

    const incBtn = document.createElement('button');
    incBtn.className = 'names-increase';
    incBtn.innerHTML = '<img src="./img/icon/add_circle.svg" alt="+"/>';

    const decBtn = document.createElement('button');
    decBtn.className = 'names-decrease';
    decBtn.innerHTML = '<img src="./img/icon/remove_circle.svg" alt="-"/>';

    right.appendChild(incBtn);
    right.appendChild(decBtn);

    piece.appendChild(left);
    piece.appendChild(right);

    list.appendChild(piece);
}
```

3. **外部事件绑定移入 IIFE**（不再依赖全局函数）

**验证**：添加/删除/修改名字次数完全正常，且不会在 `window` 上暴露额外变量。

---

#### 步骤 3.3 — 重构 dinner.js 模块

**目标**：将 alarm.js 改造为独立模块，去掉忙等和全局变量。

**操作**：

1. **歌曲列表封装为常量**：
```js
const SONGS = {
    0: 'Morning Light.ogg',  // Sunday
    1: 'Morning Light.ogg',
    2: 'StudentAge.wav',     // Tuesday
    3: 'Flourish.ogg',
    4: 'Dream It Possible-38.mp3', // Thursday
    5: 'Morning Light.ogg',  // Friday
    6: 'Morning Light.ogg',
};
```

2. **模块暴露清晰接口**：
```js
const Dinner = (function() {
    const el = document.getElementById('dinner');
    const timeNumEl = document.getElementById('dinner-time-num');
    const day = new Date().getDay();
    const audio = new Audio(`./sound/${SONGS[day]}`);
    let countdownId = null;

    function schedule(classEnd, now) {
        const delay = classEnd - now;
        if (delay < 0) return;

        document.addEventListener('mouseover', () => {
            setTimeout(show, delay);
        }, { once: true });
    }

    function show() {
        el.style.display = 'initial';
        requestAnimationFrame(() => el.setAttribute('show', '1'));
        audio.play();

        let remaining = 60;
        timeNumEl.textContent = '01:00';
        countdownId = setInterval(() => {
            remaining--;
            if (remaining < 0) {
                hide();
            } else {
                timeNumEl.textContent = `00:${String(remaining).padStart(2, '0')}`;
            }
        }, 1000);
    }

    function hide() {
        el.style.display = 'none';
        audio.pause();
        audio.currentTime = 0;
        clearInterval(countdownId);
        el.setAttribute('show', '0');
    }

    return { schedule, show, hide };
})();
```

**验证**：吃饭时间到弹窗正常弹出、音乐播放、倒计时结束弹窗关闭。

---

#### 步骤 3.4 — 创建 app.js 主控模块

**目标**：统一管理状态和时间循环。

**操作**：

1. **合并 data.js 的时间范围计算逻辑**到 app.js
2. **合并 time.js 的数字时间更新**到 app.js
3. **合并 clock.js 的指针旋转**到 app.js（表盘刻度部分保留在 clock.js 初始化）
4. **创建统一主循环**：

```js
const App = (function() {
    const state = {
        now: new Date(),
        classStart: null,
        classEnd: null
    };

    // ── 时间范围计算 ──
    function calcTimeRange() {
        const today = new Date().toLocaleDateString();
        const startList = [new Date(`${today} 17:00:00`)];
        const endList   = [new Date(`${today} 17:50:00`)];

        state.now = new Date();
        for (let i = 0; i < endList.length; i++) {
            if ((i === 0 || state.now >= endList[i - 1]) && state.now <= endList[i]) {
                state.classStart = startList[i];
                state.classEnd = endList[i];
            }
        }
    }

    // ── 数字时间显示 ──
    function updateDigital() {
        const nowtime = document.getElementById('clock-nowtime');
        nowtime.textContent = state.now.toLocaleTimeString();

        const diff = Math.floor((state.now - state.classStart) / 1000);
        document.getElementById('info-starts-label').textContent =
            (diff > 0) ? '自习课已开始' : '距离开始还有';
        document.getElementById('info-starts-m').textContent =
            pad(Math.floor(Math.abs(diff) / 60) % 60);
        document.getElementById('info-starts-s').textContent =
            pad(Math.abs(diff) % 60);

        const until = Math.floor((state.now - state.classEnd) / 1000);
        document.getElementById('info-ends-m').textContent =
            pad(Math.floor(Math.abs(until) / 60) % 60);
        document.getElementById('info-ends-s').textContent =
            pad(Math.abs(until) % 60);
    }

    // ── 指针旋转 ──
    function updateAnalog() {
        const hands = document.getElementById('clock-hands').children;
        const t = state.now.toLocaleTimeString().split(':').map(Number);
        hands[0].style.transform =
            `translate(-50%, -89.476%) rotate(${30 * t[0] + 0.5 * t[1] + 1/120 * t[2]}deg)`;
        hands[1].style.transform =
            `translate(-50%, -90.833%) rotate(${6 * t[1] + 0.1 * t[2]}deg)`;
        hands[2].style.transform =
            `translate(-50%, -89.476%) rotate(${6 * t[2]}deg)`;
    }

    // ── 主循环 ──
    let lastSecond = -1;
    function loop() {
        state.now = new Date();
        const s = state.now.getSeconds();
        if (s !== lastSecond) {
            lastSecond = s;
            updateDigital();
            updateAnalog();
        }
        requestAnimationFrame(loop);
    }

    // ── 初始化 ──
    function init() {
        calcTimeRange();
        Names.init();
        Dinner.schedule(state.classEnd, state.now);
        requestAnimationFrame(loop);
    }

    function pad(n) {
        return String(n).padStart(2, '0');
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);
```

**验证**：时钟走动、数字更新、名单功能、吃饭弹窗全部正常。

---

#### 步骤 3.5 — 重构 clock.js：表盘刻度初始化

**文件**：`js/clock.js`

**操作**：clock.js 只保留表盘刻度初始化逻辑（一次性的），不再包含指针旋转（指针旋转已移入 app.js）。

```js
(function initClockFace() {
    const clock = document.getElementById('clock');
    const r = clock.offsetHeight / 2;
    const r1 = (1 - 0.040) * r;
    const r2 = (1 - 0.288) * r;

    for (let min = 0; min < 60; min++) {
        const rad = 6 * min * Math.PI / 180;
        const line = clock.children[0].children[min];
        line.style.left = (r + r1 * Math.sin(rad) - 3.5) + 'px';
        line.style.top  = (r - r1 * Math.cos(rad)) + 'px';

        if (min % 5 === 0) {
            const num = clock.children[1].children[min / 5];
            num.style.left = (r + r2 * Math.sin(rad)) + 'px';
            num.style.top  = (r - r2 * Math.cos(rad)) + 'px';
        }
    }
})();
```

**验证**：表盘刻度和数字位置正确，指针正常走动。

---

#### 步骤 3.6 — 删除旧文件，确认最终结构

**操作**：
1. 删除 `js/min.js`
2. 删除 `js/data.js`
3. 删除 `js/time.js`
4. 删除 `js/alarm.js`
5. 保留 `js/clock.js`（只含刻度初始化）
6. `js/name.js` → 已被 `names.js` 替代，删除
7. 最终 JS 文件：`app.js`、`clock.js`、`names.js`、`dinner.js`
8. 更新 `index.html` 中的 `<script>` 引用：

```html
<script src="./js/clock.js"></script>
<script src="./js/names.js"></script>
<script src="./js/dinner.js"></script>
<script src="./js/app.js"></script>
```

**注意**：`clock.js` / `names.js` / `dinner.js` 必须在 `app.js` 之前加载（因为 `app.js` 调用它们的接口）。

**验证**：完整回归测试——所有功能正常。

---

### 阶段四：CSS 重构（P2 样式优化）

#### 步骤 4.1 — 创建合并后的 CSS 文件

**操作**：
1. 创建 `css/style.css`，按以下结构合并三个 CSS 文件的内容：

```css
/* ============================================================
   1. 字体声明
   ============================================================ */
@font-face {
    font-family: HarmonyOSHans;
    src: url(../HarmonyOS_Sans_SC.ttf);
}

/* ============================================================
   2. CSS 自定义属性
   ============================================================ */
:root {
    --color-blue: #0A59F7;
    --color-grey: #F1F3F5;
    --color-orange: #F9A01E;
    --color-red: #E84026;
    --color-bg2: #FFFC;
}

/* ============================================================
   3. 全局复位
   ============================================================ */
*, ::before, ::after { ... }

/* ============================================================
   4. 工具类
   ============================================================ */
.shadow { ... }
.circle { ... }
.dialog { ... }
.num { ... }
.mainpiece { ... }

/* ============================================================
   5. 布局与响应式
   ============================================================ */
@media (min-width: 800px) { ... }
@media (max-width: 799.99px) { ... }
body { ... }
main { ... }

/* ============================================================
   6. 时钟组件
   ============================================================ */
#clock { ... }
.clock-line { ... }
.clock-lineBold { ... }
.clock-num { ... }
#clock-hands > img { ... }

/* ============================================================
   7. 时间信息区
   ============================================================ */
#clocktime { ... }
#info-times { ... }

/* ============================================================
   8. 名单组件
   ============================================================ */
#info-names { ... }

/* ============================================================
   9. 吃饭弹窗
   ============================================================ */
#dinner-content { ... }
```

2. 修复 `opcity` → `opacity`
3. 移除 `@import url('clock.css')`（已合并内容）

**验证**：所有样式与原界面完全一致。

---

#### 步骤 4.2 — 更新 HTML 引用并删除旧 CSS/LESS 文件

**操作**：
1. `index.html` 中 `<link>` 改为 `./css/style.css`（仅一个）
2. 删除 `style/base.css`、`style/clock.css`、`style/style.css`
3. 删除 `style/base.less`、`style/clock.less`、`style/style.less`
4. 如果 `style/` 目录为空，删除该目录

**验证**：页面样式完全不变。

---

### 阶段五：收尾清理（P3 规范化）

#### 步骤 5.1 — 移除 `<center>` 标签

**文件**：`index.html`

**操作**：
```html
<!-- 原来 -->
<center id="dinner-title-big">吃饭啦!</center>
<center id="dinner-title-small">快快充电，回来继续肝作业鸭~</center>

<!-- 改为 -->
<div id="dinner-title-big">吃饭啦!</div>
<div id="dinner-title-small">快快充电，回来继续肝作业鸭~</div>
```

在 CSS 中已有对应样式（`text-align: center` 作为 `center` 等效），但需确认 `#dinner-title-big` 和 `#dinner-title-small` 具备居中样式。如没有，补充：
```css
#dinner-title-big,
#dinner-title-small {
    text-align: center;
}
```

**验证**：弹窗标题文字仍居中显示。

---

#### 步骤 5.2 — `clock.html` → `index.html` 重命名

如果尚未在步骤 2.1 中完成，此时执行。

---

#### 步骤 5.3 — 最终回归验证

**全量验证清单**：

| # | 验证项 | 预期结果 |
|---|--------|----------|
| 1 | 页面加载 | 无控制台错误 |
| 2 | 模拟时钟指针 | 正常走动，与系统时间一致 |
| 3 | 数字时间 | 每秒更新，与系统时间一致 |
| 4 | "自习课已开始" / "距离开始还有" | 在 17:00 前后正确切换文字 |
| 5 | 距离吃饭倒计时 | 数字正确递减 |
| 6 | 添加名字 | Enter 或点击 + 按钮，名字出现在列表中 |
| 7 | 修改次数 | 点击 +/- ，次数变化；次数 > 2 变红 |
| 8 | 删除名字 | 次数减到 0 时卡片消失 |
| 9 | 清空名单 | 点击删除按钮，所有名字清除 |
| 10 | 输入框动画 | 点击添加按钮，输入框淡入 |
| 11 | 吃饭弹窗 | 17:50 弹出（需鼠标移动触发） |
| 12 | 弹窗倒计时 | 从 00:60 倒数到 00:00 |
| 13 | 弹窗背景音乐 | 弹出时自动播放 |
| 14 | 弹窗关闭 | 倒计时结束自动关闭，音乐停止 |
| 15 | 响应式布局 | 缩小浏览器窗口，布局自适应 |
| 16 | 全局变量 | `window` 上无多余变量（除必要模块） |

---

## 五、重构顺序总览图

```
阶段一（P0 致命修复）
  ├── 1.1 修复 CSS 拼写 opcity → opacity
  ├── 1.2 消除 while(!ready){} 忙等
  └── 1.3 修复 event.keyCode → event.key

阶段二（P0 结构清理）
  ├── 2.1 合并/重命名 HTML（清理旧代码、改名 index.html）
  ├── 2.2 去除内联事件处理器
  ├── 2.3 消除 children[n] 硬编码
  └── 2.4 修复时钟表盘无意义重绘

阶段三（P1 模块化）
  ├── 3.1 创建新 JS 文件骨架
  ├── 3.2 重构 names.js（事件委托 + createElement）
  ├── 3.3 重构 dinner.js（模块化 + 清晰接口）
  ├── 3.4 创建 app.js（统一主循环 + 状态管理）
  ├── 3.5 精简 clock.js（只保留刻度初始化）
  └── 3.6 删除旧 JS 文件，确认最终结构

阶段四（P2 CSS）
  ├── 4.1 合并 3 个 CSS → 1 个，按模块分区
  └── 4.2 删除旧 CSS/LESS，更新 HTML 引用

阶段五（P3 收尾）
  ├── 5.1 移除 <center> 标签
  ├── 5.2 重命名 clock.html → index.html
  └── 5.3 全量回归验证
```

---

## 六、风险与回退策略

| 风险 | 应对 |
|------|------|
| 步骤 3.2 事件委托行为不一致 | 保留旧 name.js，并在新 names.js 中逐一对比功能 |
| 步骤 3.4 统一主循环漏更新某项 | 每个 setInterval 迁移前记录当前行为，迁移后对比 |
| CSS 合并后样式错乱 | 保持旧 CSS 文件不动，新 CSS 先用不同文件名测试 |
| 音频自动播放被浏览器阻止 | 保留 `mouseover` 首次交互策略不变 |

**回退方案**：每完成一个阶段，在浏览器中做一个完整的快照测试。如果某一步出问题，回退到上一个阶段的代码即可。

---

## 七、重构前后对比

| 维度 | 重构前 | 重构后 |
|------|--------|--------|
| JS 文件数 | 6 个 | 4 个 |
| CSS 文件数 | 3 个 (+ 3 个无用 LESS) | 1 个 |
| HTML 文件 | 1 个 (`clock.html`) | 1 个 (`index.html`) |
| 全局变量 | 16+ | 4（App, Names, Dinner 模块 + clock 初始化） |
| setInterval 数量 | 4 | 1（弹窗倒计时） |
| 主循环 | 各自独立 | 统一 `requestAnimationFrame` |
| 忙等循环 | 有 | 无 |
| 内联事件 | 有 | 无 |
| 废弃 API | `keyCode`, `<center>` | 无 |
| 事件绑定方式 | 逐个元素绑定 | 事件委托 |
| 子元素访问 | `children[n]` 硬编码 | `getElementById` |
| 跨文件耦合 | 隐式（全局变量） | 显式（模块接口调用） |
| 可维护性 | 低 | 高 |
| 性能 | CPU 浪费（高频重绘） | 优化 |
```

