<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.
https://ai.studio/apps/2bba26cc-9984-4c37-9038-03bcc485e532

## Run Locally

**Prerequisites:** Node.js **20.11.1**. Install it whichever way you prefer —
download it from [nodejs.org](https://nodejs.org/), use your OS package manager
(e.g. `brew install node@20`), or a Node version manager. The committed
[.nvmrc](.nvmrc) pins the version for anyone using nvm/fnm/Volta (`nvm use`),
and `package.json`'s `engines` field records it for npm.


1. Install dependencies:
   `npm install`
2. Create your Firebase config:
   `cp firebase-applet-config.example.json firebase-applet-config.json`
   then fill in your Firebase project's values (Firebase Console → Project settings → Your apps → web app config). This file is gitignored.
3. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
4. Run the app:
   `npm run dev`