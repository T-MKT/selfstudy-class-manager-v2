# 阶段四：CSS 重构 Spec

## Why
当前 CSS 分散在 3 个文件（base.css, clock.css, style.css）中，style.css 通过 `@import` 引入 clock.css 增加请求链。另外 3 个同名 LESS 文件实际未编译，纯属冗余。需要合并为单一 CSS 文件。

## What Changes
- 创建 `css/style.css`，合并 `base.css` + `clock.css` + `style.css` 全部内容，按模块分区
- 移除 `@import url('clock.css')`（已合并内容）
- 更新 `index.html` 中 `<link>` 引用：`./style/base.css` + `./style/style.css` → `./css/style.css`
- 删除 `style/` 目录下全部 CSS/LESS 文件

## Impact
- Affected specs: refactor-phase3
- Affected code: `index.html` link 标签, `css/style.css`(新建), `style/` 目录(删除全部)

## ADDED Requirements

### Requirement: CSS 文件合并
系统 SHALL 将所有 CSS 合并为单一 `css/style.css` 文件，按功能模块分区（字体、变量、复位、工具类、布局、时钟、时间信息、名单、吃饭弹窗）。

#### Scenario: 页面样式不变
- **WHEN** 页面加载
- **THEN** 所有视觉样式与原界面完全一致

### Requirement: 删除冗余 LESS 和旧 CSS 文件
系统 SHALL 删除 `style/` 目录下所有文件（base.css, clock.css, style.css, base.less, clock.less, style.less）。

## REMOVED Requirements
无（功能行为不变）
