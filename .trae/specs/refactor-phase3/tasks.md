# 阶段三任务列表

- [x] 任务 3.1：创建新 JS 文件骨架
  - [x] 创建 `js/app.js`（空文件，后续填入主控逻辑）
  - [x] 创建 `js/names.js`（复制 name.js 内容）
  - [x] 创建 `js/dinner.js`（复制 alarm.js 内容）

- [x] 任务 3.2：重构 names.js 模块
  - [x] 用事件委托替代逐个元素绑定（+/- 按钮点击由父容器统一处理）
  - [x] 将 `names_input`、`names_addPerson`、`names_clear` 改为模块内部函数
  - [x] 暴露 `init()` 接口，在 IIFE 中绑定 add/clear/Enter 事件
  - [x] `addPerson` 中 `innerHTML` 拼接改为 `createElement` 构建 DOM

- [x] 任务 3.3：重构 dinner.js 模块
  - [x] 歌曲列表封装为 `SONGS` 常量
  - [x] 封装 `schedule(classEnd, now)` 方法
  - [x] 封装 `show()` 和 `hide()` 方法
  - [x] 倒计时使用 `String.padStart` 替代 `toTimeFmt`

- [x] 任务 3.4：创建 app.js 主控模块
  - [x] 合并 data.js 的时间范围计算逻辑
  - [x] 合并 time.js 的数字时间更新逻辑
  - [x] 合并 clock.js 的指针旋转逻辑
  - [x] 创建统一 `requestAnimationFrame` 主循环
  - [x] 实现 `pad()` 工具函数（替代 toTimeFmt 调用）

- [x] 任务 3.5：精简 clock.js（只保留刻度初始化）
  - [x] 保留表盘刻度和数字位置的一次性初始化代码
  - [x] 删除指针旋转逻辑（已移入 app.js）

- [x] 任务 3.6：删除旧文件并更新 HTML 引用
  - [x] 删除 `js/min.js`
  - [x] 删除 `js/data.js`
  - [x] 删除 `js/time.js`
  - [x] 删除 `js/alarm.js`
  - [x] 删除 `js/name.js`
  - [x] 更新 `index.html` 中 `<script>` 引用为：`clock.js`, `names.js`, `dinner.js`, `app.js`

# 任务依赖
- 任务 3.1 必须先完成（创建骨架文件）
- 任务 3.2、3.3、3.4、3.5 可并行（互不依赖）
- 任务 3.6 依赖 3.2、3.3、3.4、3.5 全部完成
