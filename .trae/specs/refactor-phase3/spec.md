# 阶段三：模块化重构 Spec

## Why
当前 JS 代码分散在 6 个文件中，通过全局变量隐式耦合、依赖脚本加载顺序。需要将代码重构为独立模块，建立清晰的单向数据流和显式接口。

## What Changes
- 创建 `js/app.js`（主控）、`js/names.js`（名单）、`js/dinner.js`（吃饭）三个新模块
- `js/name.js` 重构为 `js/names.js`：事件委托 + createElement 替代 innerHTML 拼接
- `js/alarm.js` 重构为 `js/dinner.js`：封装歌曲列表、暴露 schedule/show/hide 接口
- `js/data.js` + `js/time.js` + clock.js 指针旋转 → 合并到 `js/app.js` 统一主循环
- `js/clock.js` 精简为仅保留刻度初始化（一次性）
- 删除旧文件：`js/min.js`, `js/data.js`, `js/time.js`, `js/alarm.js`, `js/name.js`
- 更新 `index.html` 中 `<script>` 引用

## Impact
- Affected specs: refactor-phase1, refactor-phase2
- Affected code: `js/` 目录全部重建，`index.html` 脚本引用更新

## ADDED Requirements

### Requirement: Names 模块独立封装
系统 SHALL 提供 `Names` 模块（IIFE），通过事件委托处理名单的增/删/改/清空操作，不暴露任何全局变量。

#### Scenario: 名单增删改查
- **WHEN** 用户点击 + 按钮添加名字
- **THEN** 输入框显示，输入名字按 Enter 后列表新增一项
- **WHEN** 用户点击 +/- 按钮
- **THEN** 对应名字的次数正确增减，次数 > 2 变红，次数为 0 时卡片消失
- **WHEN** 用户点击清空按钮
- **THEN** 所有名单项被清除

### Requirement: Dinner 模块独立封装
系统 SHALL 提供 `Dinner` 模块（IIFE），封装吃饭弹窗的调度、显示、倒计时和音乐播放逻辑。

#### Scenario: 吃饭弹窗正常触发
- **WHEN** 系统时间到达 classEnd 且用户移动鼠标
- **THEN** 弹窗出现，背景音乐播放，倒计时从 01:00 开始倒数

#### Scenario: 倒计时结束弹窗关闭
- **WHEN** 倒计时到达 00:00
- **THEN** 弹窗关闭，音乐停止

### Requirement: App 主控统一状态管理
系统 SHALL 提供 `App` 模块，统一管理时间状态（now, classStart, classEnd），使用单一 `requestAnimationFrame` 主循环驱动数字时间和指针旋转更新。

#### Scenario: 时钟正常走动
- **WHEN** 页面加载
- **THEN** 模拟时钟指针正常走动，数字时间每秒更新
- **WHEN** 在 17:00 前后
- **THEN** "自习课已开始"/"距离开始还有" 文字正确切换

### Requirement: 旧 JS 文件清理
系统 SHALL 删除不再使用的旧 JS 文件，最终只保留 `app.js`、`clock.js`、`names.js`、`dinner.js`。

## REMOVED Requirements
无（功能行为不变）
