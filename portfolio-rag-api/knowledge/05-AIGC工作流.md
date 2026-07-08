# 05-AIGC工作流

## AIGC 工作流概览

宋志诚作品集中的 AIGC 工作流不是单一的“文生图”展示，而是围绕建筑空间表达、室内更新、城市街景视频、建筑图像理解和分析图生成展开。

主要相关案例包括：

- EditPanorama
- AI-Driven Street-View Video Generation
- AI-Assisted Architectural Image Analysis & Generation
- Text to Massing 中的 LLM-to-Rhino 生成流程

## 工作流一：全景室内更新

代表项目：EditPanorama。

该工作流以全景图为输入，结合 Prompt 生成、局部重绘、家具替换、风格切换和 360 度展示，形成可用于室内改造沟通的 AIGC 全景流程。

关键工具包括 Stable Diffusion、ComfyUI、ControlNet、Inpainting 和全景缝合修复。

## 工作流二：街景视频再生成

代表项目：AI-Driven Street-View Video Generation。

该工作流从街景视频输入出发，结合 prompt、AIGC 图像、AI 图像编辑命令和 depth map-conditioned control，对城市更新场景进行可控视频再生成。

项目价值在于将静态街景效果图扩展为动态视频表达，使城市更新设计意图能够在连续空间中展示。

## 工作流三：建筑图像分析与生成

代表项目：AI-Assisted Architectural Image Analysis & Generation。

该工作流从建筑图像中提取楼梯、窗等构件，进行建筑体量简化和 mesh 转换，并探索 Image-to-BIM/IFC，把建筑图像转化为可编辑 BIM/IFC 模型。

同时，该工作流也基于任务书、气候数据、风格参考、表皮逻辑和构造描述生成分析图与渲染图。

## 工作流四：自然语言到建筑体量

代表项目：Text to Massing。

该工作流将自然语言 brief、设计约束和评估指标组织为 Prompt Pack，再由 LLM 生成 Rhino Python 体量脚本。它强调可执行脚本、指标评估和可复现设计过程。

## AIGC 工作流的共同特点

- 以建筑真实场景为起点，例如室内更新、街景更新、建筑图像分析和办公体量生成。
- 不只生成视觉结果，也关注输入条件、控制条件、可编辑输出和展示链路。
- 强调工具组合，而不是依赖单一模型。
- 关注客户沟通、方案比较、空间连续性和后续编辑。
- 适合连接建筑研究、AIGC 原型和产品化应用。

## 适合回答的问题

- 宋志诚有哪些 AIGC 工作流经验？
- AIGC 如何用于室内更新和城市更新？
- 他的 AIGC 能力是否只是画图？
- 他如何把 AIGC 和建筑设计流程结合？
- AIGC 工作流适合哪些实习或产品岗位？
