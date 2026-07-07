const DEFAULT_BASE_URL = "https://dashscope.aliyuncs.com/api/v1";
const DEFAULT_ALLOWED_ORIGIN = "https://songzhicheng1510-svg.github.io";

const setCorsHeaders = (res) => {
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
  setCorsHeaders(res);

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

    console.log("[portfolio-rag-api] has message:", hasMessage);
    console.log("[portfolio-rag-api] has BAILIAN_APP_ID:", Boolean(process.env.BAILIAN_APP_ID));
    console.log("[portfolio-rag-api] has DASHSCOPE_WORKSPACE_ID:", Boolean(process.env.DASHSCOPE_WORKSPACE_ID));

    if (!hasMessage) {
      sendJson(res, 400, { error: "message is required and must be a non-empty string." });
      return;
    }

    const cleanMessage = message.trim();
    if (cleanMessage.length > 800) {
      sendJson(res, 400, { error: "message must be 800 characters or fewer." });
      return;
    }

    if (!process.env.DASHSCOPE_API_KEY) {
      sendJson(res, 500, { error: "DASHSCOPE_API_KEY is missing." });
      return;
    }

    if (!process.env.BAILIAN_APP_ID) {
      sendJson(res, 500, { error: "BAILIAN_APP_ID is missing." });
      return;
    }

    const baseUrl = process.env.DASHSCOPE_BASE_URL || DEFAULT_BASE_URL;
    const url = `${baseUrl.replace(/\/$/, "")}/apps/${process.env.BAILIAN_APP_ID}/completion`;
    const headers = {
      Authorization: `Bearer ${process.env.DASHSCOPE_API_KEY}`,
      "Content-Type": "application/json",
      ...(process.env.DASHSCOPE_WORKSPACE_ID
        ? { "X-DashScope-WorkSpace": process.env.DASHSCOPE_WORKSPACE_ID }
        : {})
    };

    const bailianResponse = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        input: { prompt: cleanMessage },
        parameters: {},
        debug: {}
      })
    });

    const responseText = await bailianResponse.text();
    let data = null;

    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch (error) {
      sendJson(res, 502, {
        error: "Bailian API returned non-JSON response.",
        detail: responseText.slice(0, 500)
      });
      return;
    }

    if (!bailianResponse.ok) {
      sendJson(res, bailianResponse.status, {
        error: "Bailian API request failed.",
        detail: data?.message || data?.error || JSON.stringify(data)
      });
      return;
    }

    const answer = data?.output?.text;

    if (!answer || typeof answer !== "string") {
      sendJson(res, 502, {
        error: "Bailian API response missing output.text.",
        detail: JSON.stringify(data)
      });
      return;
    }

    sendJson(res, 200, { answer });
  } catch (error) {
    console.error("[portfolio-rag-api] Bailian request failed:", error);
    sendJson(res, 500, {
      error: "RAG request failed.",
      detail: error.message
    });
  }
}
