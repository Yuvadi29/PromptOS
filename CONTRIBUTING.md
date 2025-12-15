# Contributing to PromptOS

We love your input! We want to make contributing to PromptOS as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## 🚀 Development Workflow

We use a standard GitHub flow for development.

### 1. Fork and Clone
Fork the repo on GitHub, then clone your fork locally:

```bash
git clone https://github.com/Yuvadi29/promptos.git
cd promptos
```

### 2. Create a Branch
Always create a new branch for your work. Use descriptive names:

- `feature/my-new-feature`
- `fix/login-bug`
- `docs/update-readme`

```bash
git checkout -b feature/amazing-feature
```

### 3. Install Dependencies
We use `npm`.

```bash
npm install
```

### 4. Development Server
Start the local server to see your changes:

```bash
npm run dev
```

### 5. Commit and Push
Commit your changes with clear messages.

```bash
git add .
git commit -m "feat: add amazing new feature"
git push origin feature/amazing-feature
```

### 6. Open a Pull Request
Go to the original PromptOS repository on GitHub and open a Pull Request (PR) from your fork.

---

## ✍️ How to Write a Blog Post

We welcome community contributions to our blog! IF you have insights on prompt engineering, AI, or LLMs, here is how to add a post.

### 1. Create the File
Create a new `.mdx` file in the `posts/` directory. The filename will be the URL slug.

**Example:** `posts/my-awesome-guide.mdx` -> `promptos.ai/blog/my-awesome-guide`

### 2. Add Frontmatter
Every post **must** start with the following metadata:

```yaml
---
title: 'My Awesome Guide to Prompting'
subtitle: 'A deep dive into how to talk to machines.'
author: 'Your Name'
date: '12/25/2025'
readingTime: '5 min read'
coverImage: '/images/blog/my-cover-image.png'
tags: ['Tutorial', 'AI', 'Prompt Engineering']
---
```

### 3. Add Images
If you have a cover image or internal images:
1.  Place the image file in `public/images/blog/`.
2.  Reference it in the frontmatter (`coverImage`) or content (`![Alt Text](/images/blog/filename.png)`).

### 4. Write Content (MDX)
You can use standard Markdown and our custom components.

**Available Components:**

- **Callouts**:
  ```jsx
  <Callout type="info" title="Pro Tip">
    This is a helpful tip.
  </Callout>
  ```
  Types: `info`, `warning`, `danger`, `success`.

- **Internal Links**:
  Use standard markdown links for internal navigation.

### 5. Verify
Run the app locally (`npm run dev`) and visit `/blog/your-slug` to see how it looks. Ensure the cover image loads and formatting is correct.
