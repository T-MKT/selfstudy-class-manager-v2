# 阶段五：收尾清理 Spec

## Why
阶段二已创建 `index.html` 并移除了大部分废弃标签，但旧的 `clock.html` 仍存在。阶段五完成最终清理：删除旧文件并做全量回归验证。

## What Changes
- 删除旧文件 `clock.html`
- 全量回归验证所有功能

## Impact
- Affected specs: refactor-phase4
- Affected code: 删除 `clock.html`

## ADDED Requirements

### Requirement: 删除旧 HTML 文件
系统 SHALL 删除不再使用的 `clock.html`，以 `index.html` 作为唯一入口。

### Requirement: 全量回归验证
系统 SHALL 验证所有 16 项功能与重构前完全一致。

## REMOVED Requirements
无
