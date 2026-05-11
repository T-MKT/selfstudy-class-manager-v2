# 阶段四任务列表

- [x] 任务 4.1：创建合并后的 CSS 文件
  - [x] 创建 `css/` 目录
  - [x] 创建 `css/style.css`，按模块分区合并 base.css + clock.css + style.css
  - [x] 确认 `opacity` 拼写正确（已在阶段一修复）
  - [x] 移除 `@import url('clock.css')`

- [x] 任务 4.2：更新 HTML 引用并删除旧文件
  - [x] `index.html` 中 `<link>` 改为 `./css/style.css`（仅一个）
  - [x] 删除 `style/base.css`、`style/clock.css`、`style/style.css`
  - [x] 删除 `style/base.less`、`style/clock.less`、`style/style.less`

# 任务依赖
- 任务 4.2 依赖 4.1
