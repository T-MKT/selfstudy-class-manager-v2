# 阶段三验证清单

- [x] `js/names.js` 使用事件委托处理 +/- 按钮点击
- [x] `js/names.js` 使用 `createElement` 而非 `innerHTML` 拼接创建名单项
- [x] `js/names.js` 不暴露全局变量（除 `Names` 模块外）
- [x] `js/dinner.js` 歌曲列表封装为常量
- [x] `js/dinner.js` 暴露 `schedule`、`show`、`hide` 接口
- [x] `js/dinner.js` 使用 `DOMContentLoaded` 事件驱动
- [x] `js/app.js` 使用单一 `requestAnimationFrame` 主循环
- [x] `js/app.js` 每秒仅更新一次（lastSecond 去重）
- [x] `js/clock.js` 刻度初始化只执行一次（非 setInterval）
- [x] `js/clock.js` 指针旋转已移入 app.js
- [x] 旧文件 `min.js`, `data.js`, `time.js`, `alarm.js`, `name.js` 已删除
- [x] `index.html` 脚本引用顺序正确：clock.js → names.js → dinner.js → app.js
- [x] 所有功能与重构前一致（添加/删除名字、时钟走动、吃饭弹窗）
