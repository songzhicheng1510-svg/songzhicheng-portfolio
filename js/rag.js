const RAG_API_URL = "https://portfolio-rag-api.vercel.app/api/chat";

const ragFloating = document.querySelector("#rag-floating");
const ragFab = document.querySelector("#rag-fab");
const ragPanel = document.querySelector("#rag-panel");
const ragForm = document.querySelector("#rag-form");
const ragClose = document.querySelector("#rag-close");
const ragQuestion = document.querySelector("#rag-question");
const ragAskBtn = document.querySelector("#rag-ask-btn");
const ragAnswer = document.querySelector("#rag-answer");
const ragSuggestionButtons = document.querySelectorAll(".rag-suggestion");

class PortfolioRagError extends Error {
  constructor(message) {
    super(message);
    this.name = "PortfolioRagError";
  }
}

const setPanelOpen = (isOpen) => {
  if (!ragFloating || !ragPanel || !ragFab) return;

  ragFloating.classList.toggle("is-open", isOpen);
  ragPanel.setAttribute("aria-hidden", isOpen ? "false" : "true");
  ragFab.setAttribute("aria-expanded", isOpen ? "true" : "false");

  if (isOpen) {
    window.setTimeout(() => ragQuestion?.focus(), 80);
  } else {
    ragFab.focus();
  }
};

const setRagAnswer = (message, state = "empty") => {
  if (!ragAnswer) return;

  ragAnswer.classList.remove("is-empty", "is-loading", "is-error", "is-ready");
  ragAnswer.classList.add(`is-${state}`);
  ragAnswer.textContent = "";

  const paragraph = document.createElement("p");
  paragraph.textContent = message;
  ragAnswer.appendChild(paragraph);
};

const setRagBusy = (isBusy) => {
  if (ragAskBtn) {
    ragAskBtn.disabled = isBusy;
    ragAskBtn.textContent = isBusy ? "思考中..." : "提问";
  }

  ragSuggestionButtons.forEach((button) => {
    button.disabled = isBusy;
  });
};

const parseResponseBody = (text) => {
  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
};

const buildHttpError = (response, text, data) => {
  const normalizedText = text.trim();
  const looksLikeHtml = normalizedText.startsWith("<!DOCTYPE") || normalizedText.startsWith("<html") || normalizedText.includes("<body");

  if (response.status === 404 || normalizedText.includes("Cannot POST /api/chat") || looksLikeHtml) {
    return new PortfolioRagError("后端 /api/chat 路由未正确部署。请检查 Vercel 项目中是否存在 api/chat.js，并确认已重新部署。");
  }

  const backendError = data?.error || `HTTP ${response.status}`;
  const detail = data?.detail ? `：${data.detail}` : "";
  return new PortfolioRagError(`作品集问答服务返回错误：${backendError}${detail}`);
};

const askPortfolio = async (question) => {
  const cleanQuestion = question.trim();

  if (!cleanQuestion) {
    setRagAnswer("请先输入一个问题，或点击上方快捷问题。", "error");
    ragQuestion?.focus();
    return;
  }

  if (cleanQuestion.length > 800) {
    setRagAnswer("问题太长了，请控制在 800 字以内。", "error");
    ragQuestion?.focus();
    return;
  }

  setPanelOpen(true);
  setRagBusy(true);
  setRagAnswer("正在检索作品集知识库并生成回答...", "loading");

  try {
    const response = await fetch(RAG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: cleanQuestion }),
    });

    const text = await response.text();
    const data = parseResponseBody(text);

    if (!response.ok) {
      throw buildHttpError(response, text, data);
    }

    if (!data) {
      throw new PortfolioRagError("作品集问答服务返回了非 JSON 内容。请检查 Vercel 后端是否返回 application/json。");
    }

    const answer = data.answer;

    if (!answer || typeof answer !== "string") {
      throw new PortfolioRagError("作品集问答服务没有返回 answer 字段。");
    }

    setRagAnswer(answer, "ready");
  } catch (error) {
    console.error("Portfolio RAG request failed:", error);

    const message = error instanceof PortfolioRagError
      ? error.message
      : "暂时无法连接作品集问答服务。可能是 Vercel 后端未部署、接口地址错误或网络连接失败。";

    setRagAnswer(message, "error");
  } finally {
    setRagBusy(false);
  }
};

ragFab?.addEventListener("click", () => setPanelOpen(!ragFloating?.classList.contains("is-open")));
ragClose?.addEventListener("click", () => setPanelOpen(false));

ragFloating?.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setPanelOpen(false);
  }
});

ragForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  askPortfolio(ragQuestion?.value || "");
});

ragQuestion?.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    askPortfolio(ragQuestion.value);
  }
});

ragSuggestionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const question = button.dataset.ragQuestion || button.textContent || "";

    if (ragQuestion) {
      ragQuestion.value = question.trim();
    }

    askPortfolio(question);
  });
});