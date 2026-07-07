# Portfolio RAG API

This folder is a standalone Vercel Serverless Function project for the GitHub Pages portfolio RAG Assistant.

The GitHub Pages frontend must not store or call OpenAI API keys directly. It should call only:

```txt
https://portfolio-rag-api.vercel.app/api/chat
```

## Required Vercel Environment Variables

Configure these variables in the Vercel project settings:

```bash
OPENAI_API_KEY=你的 OpenAI API Key
OPENAI_VECTOR_STORE_ID=你的 Vector Store ID
OPENAI_MODEL=gpt-4.1-mini
ALLOWED_ORIGIN=https://songzhicheng1510-svg.github.io
```

`OPENAI_MODEL` is optional. If omitted, the API uses `gpt-4.1-mini`.

## Deploy to Vercel

Deploy this folder, not the GitHub Pages static site root, as a Vercel project.

The required structure is:

```txt
portfolio-rag-api/
  api/
    chat.js
  package.json
  README.md
```

The route must be available as:

```txt
POST /api/chat
```

Do not move `api/chat.js` into `src/api`, `pages/api`, or `server/api` unless you intentionally convert the backend to another framework. This project does not need Express or `server.js`.

## Test After Deployment

```bash
curl -X POST https://portfolio-rag-api.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Text to Massing 项目是什么？\"}"
```

Expected response:

```json
{
  "answer": "..."
}
```

## If You Still See `Cannot POST /api/chat`

It means the Vercel route is not deployed correctly. Common causes:

- `api/chat.js` is not in the Vercel project root `api` folder.
- Vercel is deploying a different repository or a different root directory.
- The project was not redeployed after adding `api/chat.js`.
- The domain is not attached to the current Vercel project.
- The current project is not using the Vercel Serverless Function structure.

After fixing the structure or environment variables, redeploy the Vercel project.