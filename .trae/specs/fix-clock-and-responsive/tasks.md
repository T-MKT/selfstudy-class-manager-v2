# 任务列表

- [x] 任务 1：修复 app.js 时钟崩溃
  - [x] `updateAnalog()` 提前获取 `clock-hands` 元素并判空，缺失则直接 return
  - [x] 确保 `updateDigital()` 和 `updateAnalog()` 互不干扰

- [x] 任务 2：修复 clock.js 元素守卫
  - [x] 在 initClockFace IIFE 开头检测 `#clock` 是否存在，不存在则 return

- [x] 任务 3：CSS 响应式重构
  - [x] 移除 `:root { font-size: calc(1vw + 1vh) }` 及媒体查询中的 font-size 覆盖
  - [x] `.mainpiece` 宽度用 `clamp(300px, 40vw, 460px)` 替代 `width: 25rem`
  - [x] 模拟表盘 `#clock` 用 `clamp()` 替代固定 `rem`
  - [x] 时间信息区用 `clamp()` 替代固定 `rem`
  - [x] 名单组件用弹性单位替代 `rem`
  - [x] 吃饭弹窗中已使用 `vw`/`vh` 的部分保持；其余 `rem` 改为 `clamp()`
  - [x] 全局复位中 `transition: opacity 0.3s` 保持不变
  - [x] `min-width: 360px` 替代 400px（更灵活）

- [x] 任务 4：验证 + push
  - [x] 确认数字时间正常更新
  - [x] 确认名单、吃饭弹窗功能正常
  - [x] 确认大小屏布局正常
  - [x] git commit && push

# 任务依赖
- 任务 1、2、3 相互独立，可并行
- 任务 4 依赖 1、2、3
