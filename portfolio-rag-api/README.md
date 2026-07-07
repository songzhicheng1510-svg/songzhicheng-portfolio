# Portfolio RAG API

This folder is a standalone Vercel Serverless Function project for the GitHub Pages portfolio RAG Assistant.

The GitHub Pages frontend must not store API keys directly. It should call only:

```txt
https://portfolio-rag-api.vercel.app/api/chat
```

## Required Vercel Environment Variables

Configure these variables in the Vercel project settings:

```bash
DASHSCOPE_API_KEY=你的百炼APIKey
BAILIAN_APP_ID=你的百炼应用APP_ID
DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/api/v1
ALLOWED_ORIGIN=https://songzhicheng1510-svg.github.io
```

`DASHSCOPE_BASE_URL` defaults to `https://dashscope.aliyuncs.com/api/v1`. This default is for the China mainland edition / Beijing region. If you use the international edition or Singapore region, change `DASHSCOPE_BASE_URL` to the base URL shown in the Bailian console for that region.

If the Bailian application is in the default workspace, only `BAILIAN_APP_ID` is required. If the application is in a sub-workspace, also configure:

```bash
DASHSCOPE_WORKSPACE_ID=你的子业务空间ID
```

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

In the Vercel web dashboard, set **Root Directory** to:

```txt
portfolio-rag-api
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

If environment variables are missing, the API returns a JSON error such as:

```json
{
  "error": "DASHSCOPE_API_KEY is missing."
}
```

## If You Still See `Cannot POST /api/chat` or 404

It means the Vercel route is not deployed correctly. Common causes:

- `api/chat.js` is not in the Vercel project root `api` folder.
- Vercel is deploying a different repository or a different root directory.
- The Vercel Root Directory is not set to `portfolio-rag-api`.
- The project was not redeployed after adding or changing `api/chat.js`.
- The domain is not attached to the current Vercel project.
- The current project is not using the Vercel Serverless Function structure.

After fixing the structure, environment variables, or region base URL, redeploy the Vercel project.
