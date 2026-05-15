# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

"自习课"是一个纯静态前端网页应用，无构建工具、无框架、无依赖。功能包括：模拟时钟（指针+数字）、自习课开始/结束倒计时、点名名单管理、以及下课后弹出"吃饭时间"倒计时和背景音乐。

## 开发命令

无构建步骤。直接用浏览器打开 `index.html` 即可预览。

## 架构

四个 JS 文件按顺序通过 `<script>` 标签加载，各自用 IIFE 模式导出：

| 文件 | 模块 | 职责 |
|---|---|---|
| `js/clock.js` | 无（匿名 IIFE） | 初始化模拟表盘的刻度线和数字位置 |
| `js/names.js` | `Names` | 名单的增加、删除、次数加减，DOM 事件绑定 |
| `js/dinner.js` | `Dinner` | 下课后的弹窗、音频播放、60 秒排队倒计时 |
| `js/app.js` | `App` | 主控：计算上课时间范围、驱动数字/模拟时钟更新、协调 `Names.init()` 和 `Dinner.schedule()` |

**关键数据流：**
1. `App.init()` 在 `DOMContentLoaded` 时执行
2. 硬编码上课时间 `17:00:00`（开始）和 `17:50:00`（结束），位于 `app.js:14-19`
3. `calcTimeRange()` 判断当前时间所在的时间段
4. `requestAnimationFrame(loop)` 驱动每秒钟的表盘更新
5. `Dinner.schedule()` 计算 `classEnd - now` 的延迟，在用户首次 `mouseover` 时设置 `setTimeout` 触发下课弹窗
6. 每天播放不同的下课音乐（通过 `new Date().getDay()` 索引 `SONGS` 对象，位于 `dinner.js:2-10`）

**CSS 架构（`css/style.css`）：**
- 全局复位使用 `::before, ::after` 选择器
- 用 `clamp()` 实现全响应式布局，移动端优先
- 唯一的媒体断点在 `799px`——控制名单列表区域从绝对定位切换到相对定位
- `[show]` 属性配合 `opacity` 过渡控制输入框和弹窗的显示/隐藏
- 模拟表盘使用绝对定位的刻度线 + JS 动态计算三角函数位置

## 注意事项

- `js/clock.js` 生成的表盘刻度线依赖 HTML 中预渲染的 DOM 结构（`#clock > div:first-child` 有 60 个子元素、`#clock > div:nth-child(2)` 有 12 个子元素）。如果修改了 `index.html` 中的 `#clock` 模板结构，需要同步检查此文件。
- CSS 中 `.num` 类使用 `font-feature-settings: "ss01"` 和 `font-family: HarmonyOSHans`，依赖项目根目录的 `HarmonyOS_Sans_SC.ttf` 字体文件（约 20MB）。
- 代码用 ES5 语法（`var`、IIFE），无 TS、无模块系统，兼容老旧浏览器。
