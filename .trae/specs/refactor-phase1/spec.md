# 阶段一：紧急修复（P0 致命问题）Spec

## Why
当前代码存在三个 P0 级别的严重问题：CSS 属性拼写错误导致过渡动画失效、"忙等"循环存在浏览器卡死风险、使用了已废弃的 `event.keyCode` API。这些必须在重构开始前优先修复。

## What Changes
- 修复 `style/base.css` 中 `opcity` → `opacity` 拼写错误
- 消除 `while (!ready) {}` 忙等循环，改用 `DOMContentLoaded` 事件驱动
- 修复 `event.keyCode` → `event.key` 废弃 API

## Impact
- Affected specs: 无（这是新建 spec）
- Affected code: `style/base.css`, `js/alarm.js`, `js/min.js`, `js/time.js`, `js/data.js`, `js/name.js`

## ADDED Requirements

### Requirement: CSS transition 拼写修复
系统 SHALL 在 `*` 全局选择器的 `transition` 属性中使用正确的属性名 `opacity` 而非拼写错误的 `opcity`。

#### Scenario: 输入框淡入淡出动画正常
- **WHEN** 用户点击添加名字按钮
- **THEN** 输入框应有 `opacity` 从 0 到 1 的过渡动画效果

### Requirement: 移除忙等循环
系统 SHALL NOT 使用 `while (!ready) {}` 忙等循环等待数据就绪。alarm.js 的启动逻辑 SHALL 通过 `DOMContentLoaded` 事件来确保 DOM 和数据就绪后再注册吃饭闹钟。

#### Scenario: 页面正常加载且闹钟正常触发
- **WHEN** 页面加载完成
- **THEN** 控制台无 "busy-wait" 相关警告
- **WHEN** 到达吃饭时间（17:50）且用户移动鼠标
- **THEN** 吃饭弹窗正常弹出

### Requirement: 修复废弃的 event.keyCode API
系统 SHALL 使用 `event.key` 属性替代已废弃的 `event.keyCode` 来检测键盘按键。

#### Scenario: Enter 键添加名字
- **WHEN** 用户在名字输入框中按下 Enter 键
- **THEN** 输入的名字应添加到名单中
