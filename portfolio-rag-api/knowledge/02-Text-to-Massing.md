# 02-Text-to-Massing

## 项目名称

Text to Massing

英文副标题：A human-AI workflow for 3D massing design

## 项目状态

CAADRIA 2026 论文源文件相关研究。

## 角色

主理人 / 第一作者相关研究。

公开作品集中的贡献描述为：研究问题定义、Prompt Pack 框架、Rhino Python 工作流、实验指标整理。

## 项目问题

早期办公建筑体量设计依赖人工经验和反复调整。自然语言任务书很难直接变成稳定、可复查、可审计的建筑体量生成过程。

项目要解决的问题是：如何把建筑 brief、设计约束和评估指标转化为可运行的 Rhino 体量生成脚本，并让 LLM 生成结果可以被检查、复用和比较。

## 方法流程

Text to Massing 将任务书、规范和设计策略拆解为五类 Prompt Pack：

- Objectives
- Constraints
- Priorities
- Examples
- Inspection

项目使用 GPT-5 Thinking 生成 Rhino Python 代码，并通过 corridor-first 组织、功能块合并、指标监测和错误修复推进迭代。

研究围绕 25 个办公建筑体量场景评估 Merge Rate、Programme Ratio Deviation 与直接基线模型差异。

## 关键技术

- GPT-5 Thinking
- Rhino Python
- JSON 约束
- 参数化体量
- Prompt Pack
- 可运行脚本生成
- 设计指标评估

## 成果价值

该项目形成了从自然语言 brief 到可运行体量脚本的 Human-AI Workflow。它的价值不是只生成一张概念图，而是将建筑设计知识外化为可检查、可复用、可比较的结构化规则和代码流程。

项目体现了宋志诚在 AI 建筑研究中的三个能力：

- 能将建筑设计问题抽象为结构化 AI 工作流。
- 能把 LLM 输出落到 Rhino Python 和参数化几何生成。
- 能使用实验指标评估 AI 生成方案，而不是只凭主观视觉判断。

## 可回答问题

- Text to Massing 项目是什么？
- Text to Massing 如何把自然语言转化为 Rhino 体量？
- Prompt Pack 在项目中有什么作用？
- 宋志诚在 Text to Massing 中的贡献是什么？
- 这个项目为什么适合体现 AI 建筑研究能力？
