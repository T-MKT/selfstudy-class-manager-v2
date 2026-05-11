# 修复时钟崩溃 + 响应式重构 Spec

## Why

1. **P0 时钟崩溃**：重构阶段三统一 rAF 主循环后，`app.js` 中 `updateAnalog()` 访问不存在的 `#clock-hands` 元素导致 TypeError 抛出，中断 rAF 回调链，使**整个时钟（含数字时间）停止更新**。重构前各 `setInterval` 独立运行，单个崩溃不影响其他定时器，现在单点故障导致全局瘫痪。

2. **响应式方案不标准**：当前使用 `font-size: calc(1vw + 1vh)` 设到 `:root` 将 `rem` 当作"虚拟像素"使用，这非常规做法。需改用 `clamp()` + 弹性布局 + 媒体查询等现代方案。

## What Changes

### fix 1: 时钟崩溃
- `js/app.js`：`updateAnalog()` 加元素存在性守卫，确保 `#clock-hands` 缺失时不阻塞 rAF 循环
- `js/clock.js`：加 `#clock` 元素存在性守卫，缺失时静默跳过

### fix 2: 响应式 **BREAKING**
- `css/style.css`：移除 `:root { font-size: calc(...) }` 按视口缩放方式
- 所有原本依赖 `1rem ≈ 虚拟像素` 的尺寸改用 `clamp()` / `vw` / `max-width` / 弹性布局
- 弹窗标题已有的 `calc(vw+vh)` 字体保持不变（那是正确的现代做法）
- 布局改用 `max-width` 容器 + `flex-wrap` 实现自适应，而非依赖 `rem` 缩放

## Impact
- Affected specs: refactor-phase3, refactor-phase4
- Affected code: `js/app.js`, `js/clock.js`, `css/style.css`, `index.html`

## ADDED Requirements

### Requirement: rAF 主循环容错
系统 SHALL 在 `updateAnalog()` 中检测 `#clock-hands` 元素是否存在，缺失时静默跳过，不阻断 rAF 循环。

#### Scenario: 数字时钟正常走动
- **WHEN** 页面加载且 `#clock-hands` 元素不存在
- **THEN** 数字时间仍然每秒更新，控制台无 TypeError

### Requirement: clock.js 元素守卫
系统 SHALL 在 `clock.js` 初始化中检测 `#clock` 元素是否存在，缺失时静默跳过所有刻度初始化。

#### Scenario: 缺失模拟表盘不报错
- **WHEN** 页面加载且 `#clock` 元素不存在
- **THEN** 控制台无 TypeError

### Requirement: 现代响应式方案
系统 SHALL NOT 使用 `font-size` 缩放 `:root` 来实现响应式。改用 `clamp()`、`vw`、`max-width` 容器 + `flex-wrap` 实现各组件尺寸自适应。

#### Scenario: 大屏布局
- **WHEN** 视口宽度 ≥ 800px
- **THEN** 两个 `.mainpiece` 卡片并排居中

#### Scenario: 小屏布局
- **WHEN** 视口宽度 < 800px
- **THEN** 卡片纵向排列，尺寸适配视口

## REMOVED Requirements

### Requirement: rem 作为虚拟像素
**Reason**: 非标准方案，维护困难
**Migration**: 所有 `rem` 尺寸改为 `clamp()` 或弹性布局
