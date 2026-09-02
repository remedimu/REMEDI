# REMEDI Website

## How to edit content (NO CODING NEEDED)

Everything that changes often — blog posts by interest group, video courses,
updates/announcements, and team members — lives in ONE file:

    data/content.json

Open it in VS Code (or even directly on github.com by clicking the file and
the pencil ✏️ "edit" icon), change the text between the quotes, save, and
push. The website updates automatically. You never need to touch index.html,
style.css, or script.js for routine updates.

Examples:
- To add a new blog post, copy one of the `{ ... }` blocks inside `"groups"`
  and change the tag/title/leader/summary/pdf link.
- To add a new video course, copy a block inside `"courses"` and paste the
  YouTube video ID (the part after `watch?v=` in a YouTube URL).
- To add a team member, copy a block inside `"team" > "core"` or
  `"committees"` and fill in name/role/bio. Add a photo by uploading it to
  the `images/` folder and writing its filename, e.g. `"images/lama.jpg"`.
- To connect your real Google Form, paste its link into `"googleForm"` under
  `"links"`. Until you do, the Contact form will just open the visitor's
  email app instead.
- To connect your YouTube channel, paste the link into `"youtubeChannel"`.

## Run it on your computer (before publishing)

1. Open this folder in VS Code.
2. Install the "Live Server" extension (Extensions icon on the left sidebar → search "Live Server" → Install).
3. Right-click `index.html` → "Open with Live Server".
4. Your site opens in the browser and updates live as you edit.

## Publish it for free

### Step 1 — Push to GitHub
In VS Code's terminal (Terminal → New Terminal):
```
git init
git add .
git commit -m "REMEDI website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/remedi-website.git
git push -u origin main
```

### Step 2 — Deploy on Netlify
1. Go to netlify.com and sign up with your GitHub account.
2. Click "Add new site" → "Import an existing project" → choose your
   `remedi-website` repo.
3. Leave build settings blank (this is a plain HTML site, no build step needed).
4. Click Deploy. You'll get a live link in under a minute.
5. From then on, every time you push a change to GitHub, Netlify updates the
   live site automatically.

## Later upgrade: editing content without GitHub at all

If typing into a `.json` file ever feels like too much, the next free step
up is "Decap CMS" — it gives you a simple admin webpage
(yoursite.com/admin) where you fill in a form and click Publish, no GitHub
required at that point. Ask me when you're ready and I'll set it up — it
takes about 15 extra minutes.
