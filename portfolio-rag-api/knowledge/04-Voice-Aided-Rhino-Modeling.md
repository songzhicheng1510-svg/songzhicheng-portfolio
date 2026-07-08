# 04-Voice-Aided-Rhino-Modeling

## 项目名称

Voice-Aided Rhino Modeling

英文副标题：Speech or text becomes Rhino script through ASR, RAG, LLM generation, and plugin execution

## 项目状态

eCAADe 2025 相关成果。

## 角色

主要设计参与 / 协作研究。

公开作品集中的贡献描述为：参与系统流程、语音/文本交互逻辑、Rhino 执行链路与案例测试表达。

## 项目问题

建筑建模命令复杂，Rhino 脚本门槛较高。建筑师希望通过自然语言、语音或文本快速完成创建、修改、删除和复杂建模任务。

项目要解决的问题是：如何将用户的口头建模意图转化为可执行 Rhino 脚本，并在脚本报错后形成可持续修复的反馈闭环。

## 方法流程

项目构建了 ASR、RAG、LLM 脚本生成、Rhino 插件执行和反馈记录的系统架构。

基本流程是：

- 用户通过语音或文本提出建模需求。
- ASR 将语音转为文本。
- RAG 检索 Rhino API 示例、错误日志、脚本模板或相关建模知识。
- LLM 基于用户需求和检索证据生成 Rhino 脚本。
- Rhino 插件执行脚本并记录结果。
- 如果出现错误，系统利用 Rhino 错误日志与 API 示例为 LLM 提供针对性修复证据。
- 多轮脚本历史被保留，使后续 prompt 能基于前文继续迭代建模。

## RAG 的作用

在 Voice-Aided Rhino Modeling 中，RAG 的作用是把 LLM 的脚本生成过程从“凭空生成”变成“基于 Rhino 相关知识和错误证据生成”。

RAG 可以检索：

- Rhino API 示例
- 既有脚本片段
- 常见错误日志
- 建模命令解释
- 当前项目的历史脚本和反馈

这样可以提高脚本生成的可解释性和可修复性，尤其适合建筑建模这种对 API、几何对象和命令顺序有要求的场景。

## 关键技术

- ASR
- RAG
- LLM
- Rhino Plugin
- Rhino Python / Rhino 脚本
- 错误日志反馈
- 多轮脚本历史
- 语音辅助建模

## 成果价值

项目覆盖创建、修改、删除和复杂建模的语音辅助原型链路。公开作品集显示，50 条指令试验中基础与修改任务成功率较强，复杂任务自动化耗时相对手工有明显下降，主要瓶颈集中在响应速度。

该项目体现了宋志诚在 AI 工具原型、建筑软件交互、RAG 应用和 Rhino 自动化建模方面的综合能力。

## 可回答问题

- Voice-Aided Rhino Modeling 是什么？
- 该项目如何使用 ASR、RAG 和 LLM？
- Voice-Aided Rhino Modeling 如何使用 RAG？
- 宋志诚在项目中的贡献是什么？
- 这个项目为什么适合 AI 产品原型或设计科技岗位？
