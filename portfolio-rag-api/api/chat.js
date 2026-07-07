import OpenAI from "openai";

const DEFAULT_ALLOWED_ORIGIN = "https://songzhicheng1510-svg.github.io";

const SYSTEM_PROMPT = `你是宋志诚作品集网站的 RAG 问答助手。
你只能基于检索到的作品集知识库回答。
知识库范围包括：个人简介、研究方向、Text to Massing、EditPanorama、Voice-Aided Rhino Modeling、AIGC 工作流、产品原型经历、建筑 AI 研究、Rhino 自动化与公开项目说明。
如果知识库中没有明确依据，请回答：“目前公开作品集资料中没有明确信息。”
回答要专业、简洁，适合建筑学、AI Architecture、产品原型与研究展示场景。
优先使用中文回答；如果用户用英文提问，则使用英文回答。
不要编造经历、论文、奖项、联系方式或未公开信息。
不要输出手机号、私人简历、未公开论文全文或任何未在公开资料中确认的信息。`;

const setCorsHeaders = (req, res) => {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN;
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");
};

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
};

const readJsonBody = async (req) => {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    return req.body ? JSON.parse(req.body) : {};
  }

  let rawBody = "";
  for await (const chunk of req) {
    rawBody += chunk;
  }

  return rawBody ? JSON.parse(rawBody) : {};
};

export default async function handler(req, res) {
  setCorsHeaders(req, res);

  console.log("[portfolio-rag-api] method:", req.method);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed. Use POST /api/chat." });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const message = body?.message;
    const hasMessage = typeof message === "string" && message.trim().length > 0;
    const hasVectorStore = Boolean(process.env.OPENAI_VECTOR_STORE_ID);

    console.log("[portfolio-rag-api] has message:", hasMessage);
    console.log("[portfolio-rag-api] has OPENAI_VECTOR_STORE_ID:", hasVectorStore);

    if (!hasMessage) {
      sendJson(res, 400, { error: "message is required and must be a non-empty string." });
      return;
    }

    const cleanMessage = message.trim();
    if (cleanMessage.length > 800) {
      sendJson(res, 400, { error: "message must be 800 characters or fewer." });
      return;
    }

    if (!process.env.OPENAI_API_KEY) {
      sendJson(res, 500, { error: "OPENAI_API_KEY is missing." });
      return;
    }

    if (!process.env.OPENAI_VECTOR_STORE_ID) {
      sendJson(res, 500, { error: "OPENAI_VECTOR_STORE_ID is missing." });
      return;
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions: SYSTEM_PROMPT,
      input: cleanMessage,
      tools: [
        {
          type: "file_search",
          vector_store_ids: [process.env.OPENAI_VECTOR_STORE_ID],
          max_num_results: 5
        }
      ]
    });

    sendJson(res, 200, {
      answer: response.output_text || "没有生成有效回答。"
    });
  } catch (error) {
    console.error("[portfolio-rag-api] OpenAI/RAG call failed:", error);
    sendJson(res, 500, {
      error: "RAG request failed.",
      detail: error.message
    });
  }
}