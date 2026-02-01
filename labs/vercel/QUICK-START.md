# Vercel Labs - Quick Start Guide

Get up and running with Vercel in minutes!

## 🚀 Option 1: Deploy the Example App

### Prerequisites
```bash
node --version  # v18.17 or higher required
npm --version   # v9.0 or higher
```

### Steps

1. **Navigate to the example**
   ```bash
   cd C:\projects\ai\copilot\labs\vercel\examples\nextjs-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   copy .env.example .env.local
   ```

4. **Get API keys** (at least one required)
   
   **Anthropic (for Claude models)**:
   - Visit: https://console.anthropic.com/
   - Create account or sign in
   - Go to API Keys
   - Create new key
   - Copy to `.env.local` as `ANTHROPIC_API_KEY`
   
   **OpenAI (for GPT models)**:
   - Visit: https://platform.openai.com/api-keys
   - Create account or sign in
   - Create new secret key
   - Copy to `.env.local` as `OPENAI_API_KEY`

5. **Edit `.env.local`**
   ```env
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   OPENAI_API_KEY=sk-your-key-here
   ```

6. **Run the app**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   ```
   http://localhost:3000
   ```

### First Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Visit: https://vercel.com/new
   - Import your repository
   - Add environment variables (ANTHROPIC_API_KEY, OPENAI_API_KEY)
   - Click "Deploy"

3. **Done!** Your app is live at `https://your-project.vercel.app`

---

## 📚 Option 2: Learn from the Guides

### For Beginners

**Read**: `vercel-getting-started.md`

**Topics covered**:
- Creating Vercel account
- Installing CLI
- Understanding deployments
- Managing environment variables
- Configuring domains
- Cost management

**Time**: 30-45 minutes

### For AI Developers

**Read**: `vercel-nextjs-agents.md`

**Topics covered**:
- Next.js 15 App Router
- Vercel AI SDK
- Streaming responses
- Edge Runtime
- Server Components

**Time**: 45-60 minutes

### For Production Teams

**Read**: `vercel-deployment-patterns.md`

**Topics covered**:
- Git workflows
- Preview deployments
- Environment strategies
- Monorepos
- A/B testing

**Time**: 45-60 minutes

---

## 🎯 Common Tasks

### View Logs (Local)
```bash
# Terminal will show logs automatically
# Look for errors in red
```

### Build for Production
```bash
npm run build
npm run start
```

### Type Check
```bash
npm run type-check
```

### Lint Code
```bash
npm run lint
```

### Deploy to Vercel (CLI)
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy production
vercel --prod
```

### Update Dependencies
```bash
npm update
```

### Add New AI Model
Edit `app/api/chat/route.ts`:
```typescript
const models = {
  'claude-sonnet': anthropic('claude-sonnet-4.5'),
  'your-model': yourProvider('model-name'),
};
```

### Change System Prompt
Edit `app/api/chat/route.ts`:
```typescript
system: 'Your custom prompt here',
```

---

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# Kill the process
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

### API Key Not Working
1. Check `.env.local` has correct key
2. Restart dev server (`Ctrl+C` then `npm run dev`)
3. Verify key format (should start with `sk-ant-` or `sk-`)

### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

### Deployment Failing on Vercel
1. Check deployment logs in Vercel dashboard
2. Verify environment variables are set
3. Ensure API keys are added to production environment
4. Check for TypeScript errors: `npm run type-check`

### Chat Not Streaming
1. Verify Edge Runtime is enabled: `export const runtime = 'edge';`
2. Check browser console for errors
3. Test API endpoint directly: `curl localhost:3000/api/health`

---

## 💡 Next Steps

### Beginner
- [ ] Deploy example app locally
- [ ] Read getting-started guide
- [ ] Deploy to Vercel
- [ ] Configure custom domain

### Intermediate
- [ ] Customize the UI
- [ ] Add more AI models
- [ ] Implement rate limiting
- [ ] Add authentication

### Advanced
- [ ] Add database (Vercel Postgres)
- [ ] Implement RAG with vector search
- [ ] Set up monitoring (Sentry)
- [ ] Create A/B tests
- [ ] Implement caching strategy

---

## 📞 Getting Help

### Documentation
- **Vercel Guides**: `labs/vercel/*.md`
- **Example README**: `examples/nextjs-ai/README.md`
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs

### Community
- **Vercel Discord**: https://vercel.com/discord
- **Next.js Discord**: https://nextjs.org/discord
- **GitHub Discussions**: https://github.com/vercel/vercel/discussions

### Issues
- Check `PROJECT-SUMMARY.md` for overview
- Review troubleshooting sections in guides
- Search Vercel documentation
- Ask in Discord communities

---

## 📊 Learning Checklist

### Week 1: Basics
- [ ] Read vercel-getting-started.md
- [ ] Create Vercel account
- [ ] Deploy example app locally
- [ ] Deploy to Vercel
- [ ] Configure environment variables

### Week 2: AI Development
- [ ] Read vercel-nextjs-agents.md
- [ ] Study example code
- [ ] Customize chat interface
- [ ] Add new AI model
- [ ] Implement error handling

### Week 3: Production
- [ ] Read vercel-deployment-patterns.md
- [ ] Set up Git workflow
- [ ] Configure preview deployments
- [ ] Implement monitoring
- [ ] Add rate limiting

### Week 4: Advanced
- [ ] Add authentication
- [ ] Implement database
- [ ] Create A/B tests
- [ ] Set up CI/CD
- [ ] Optimize performance

---

## 🎉 Success Criteria

You'll know you're successful when you can:

✅ Deploy Next.js app to Vercel  
✅ Configure environment variables  
✅ Create streaming AI chat  
✅ Use preview deployments  
✅ Set up custom domains  
✅ Implement caching strategies  
✅ Monitor application performance  
✅ Debug deployment issues  

---

**Ready to build modern web applications? Start now!** 🚀

**Recommended path**: Deploy example → Read guides → Customize → Deploy production

---

*Part of The Grand Budapest Terminal Project*
