# 阶段一任务列表

- [x] 任务 1.1：修复 CSS 拼写错误
  - [x] 在 `style/base.css` 中将 `transition: opcity 0.3s;` 改为 `transition: opacity 0.3s;`

- [x] 任务 1.2：消除忙等循环
  - [x] 删除 `js/alarm.js` 中的 `while (!ready) {}`（第 76 行）
  - [x] 删除 `js/min.js` 中的 `Ready()` 函数（第 11-14 行）
  - [x] 删除 `js/time.js` IIFE 中的 `Ready()` 调用（第 2 行）
  - [x] 删除 `js/data.js` 中的 `ready = 1;`（第 25 行）和 `var ready = 0;`（第 1 行）
  - [x] 将 `js/alarm.js` 的 IIFE 启动逻辑改为监听 `DOMContentLoaded` 事件

- [x] 任务 1.3：修复 event.keyCode 废弃 API
  - [x] 在 `js/name.js` 中将 `event.keyCode === 13` 改为 `event.key === 'Enter'`

# 任务依赖
- 三个任务相互独立，可并行执行
