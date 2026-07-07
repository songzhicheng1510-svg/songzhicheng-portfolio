const RAG_API_URL = "https://portfolio-rag-api.vercel.app/api/chat";

const ragForm = document.querySelector("#rag-form");
const ragTextarea = document.querySelector("#rag-question");
const ragSubmit = document.querySelector("#rag-submit");
const ragAnswer = document.querySelector("#rag-answer");
const ragPromptButtons = document.querySelectorAll(".rag-prompt");

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
  if (ragSubmit) {
    ragSubmit.disabled = isBusy;
    ragSubmit.textContent = isBusy ? "思考中..." : "提问";
  }

  ragPromptButtons.forEach((button) => {
    button.disabled = isBusy;
  });
};

const askPortfolio = async (question) => {
  const message = question.trim();

  if (!message) {
    setRagAnswer("请先输入一个问题，或点击上方快捷问题。", "error");
    ragTextarea?.focus();
    return;
  }

  setRagBusy(true);
  setRagAnswer("正在检索作品集内容并生成回答...", "loading");

  try {
    const response = await fetch(RAG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const answer = data.answer || data.response || data.message;

    if (!answer) {
      throw new Error("No answer field returned");
    }

    setRagAnswer(answer, "ready");
  } catch (error) {
    setRagAnswer("暂时无法连接作品集问答服务。请稍后再试，或直接通过邮箱联系我。", "error");
  } finally {
    setRagBusy(false);
  }
};

if (ragForm && ragTextarea) {
  ragForm.addEventListener("submit", (event) => {
    event.preventDefault();
    askPortfolio(ragTextarea.value);
  });

  ragTextarea.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      askPortfolio(ragTextarea.value);
    }
  });
}

ragPromptButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const question = button.dataset.ragQuestion || button.textContent || "";

    if (ragTextarea) {
      ragTextarea.value = question.trim();
      ragTextarea.focus();
    }

    askPortfolio(question);
  });
});