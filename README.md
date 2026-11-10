# Threadly — Nested Comments & Replies

A responsive React + Vite + Tailwind CSS discussion board demonstrating recursive, multi-level threaded comments.

## Features
- Add top-level comments
- Reply to any comment or reply
- Unlimited nested reply levels using a recursive component
- Threaded layout with indentation and connector lines
- Like/unlike comments
- Delete a comment and its entire reply branch
- Edit your own comments and replies
- Sort top-level discussions by newest, oldest or most liked
- Search through comments and replies
- Comment and reply counts
- localStorage persistence across refreshes
- Responsive design with Unsplash imagery

## Run locally
1. Install Node.js (LTS).
2. Extract this ZIP and open the project folder in VS Code.
3. Run:

```bash
npm install
npm run dev
```

4. Open the local URL shown in the terminal (usually http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```

## Deploy
Push this project to its own GitHub repository, then import that repository into Vercel.
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

The Unsplash image and Google Fonts are loaded online. Comment data is stored in this browser's localStorage; it is a frontend demo and does not sync across different devices or users.
