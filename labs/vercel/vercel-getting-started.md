# Vercel Getting Started Guide

**Complete Beginner's Guide to Vercel Platform**

*Learn deployment automation, serverless functions, edge computing, and modern web hosting*

---

## Table of Contents

1. [Introduction to Vercel](#introduction-to-vercel)
2. [Account Setup](#account-setup)
3. [Vercel CLI Installation](#vercel-cli-installation)
4. [Project Creation and Linking](#project-creation-and-linking)
5. [Environment Variables](#environment-variables)
6. [Domain Configuration](#domain-configuration)
7. [Analytics and Monitoring](#analytics-and-monitoring)
8. [Cost Management](#cost-management)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

---

## Introduction to Vercel

Vercel is a cloud platform for static sites and serverless functions that fits perfectly with modern frontend frameworks. It provides:

- **Instant global deployment** via CDN
- **Automatic HTTPS** with free SSL certificates
- **Git integration** for continuous deployment
- **Preview deployments** for every pull request
- **Edge Network** with 100+ data centers worldwide
- **Serverless Functions** for backend logic
- **Edge Functions** for ultra-low latency responses
- **Analytics** for performance insights

### What Makes Vercel Different?

**Zero-Config Deployments**: Vercel automatically detects your framework (Next.js, React, Vue, Svelte, etc.) and configures optimal build settings.

**Edge-First Architecture**: Content is distributed globally and served from the nearest edge location to your users.

**Developer Experience**: Preview URLs for every commit, instant rollbacks, and seamless Git integration create an unmatched developer workflow.

### Use Cases

- **Frontend Applications**: React, Next.js, Vue, Angular, Svelte apps
- **Static Sites**: Documentation, blogs, marketing sites
- **Full-Stack Apps**: Next.js with API routes and serverless functions
- **Edge Computing**: Real-time personalization, A/B testing, authentication
- **Jamstack Projects**: Headless CMS with static generation

---

## Account Setup

### Creating a Vercel Account

1. **Visit** [vercel.com/signup](https://vercel.com/signup)

2. **Choose Sign-Up Method**:
   - GitHub (Recommended - enables automatic deployments)
   - GitLab
   - Bitbucket
   - Email

3. **Authorize Access**: If using Git provider, grant Vercel repository access

4. **Complete Profile**: Add username and team name (if applicable)

### Account Tiers Comparison

#### Hobby (Free)

**Best for**: Personal projects, portfolios, learning

**Includes**:
- Unlimited deployments
- 100 GB bandwidth per month
- Serverless function executions (100 GB-hours)
- 1000 Edge Function invocations per day
- Automatic HTTPS
- Preview deployments
- Web Analytics (500 events/month)

**Limitations**:
- Personal use only (non-commercial)
- Community support
- 10-second serverless function timeout
- 1 MB Edge Function size limit

#### Pro ($20/month per user)

**Best for**: Freelancers, professional developers, small commercial projects

**Includes**:
- Everything in Hobby
- **1 TB bandwidth** per month
- Commercial use allowed
- **Unlimited** Edge Function invocations
- **Unlimited** Web Analytics events
- Password protection for deployments
- Team collaboration (pay per user)
- Email support
- Advanced analytics
- 60-second serverless function timeout
- 4 MB Edge Function size limit

**Additional Costs**:
- Extra bandwidth: $40 per 100 GB
- Additional users: $20/user/month

#### Enterprise (Custom Pricing)

**Best for**: Large teams, mission-critical applications

**Includes**:
- Everything in Pro
- Custom bandwidth allocation
- 99.99% SLA
- SSO/SAML authentication
- Advanced security features
- Dedicated support
- Custom contracts
- Audit logs
- Team hierarchies

**Contact**: [vercel.com/contact/sales](https://vercel.com/contact/sales)

### Choosing the Right Tier

**Start with Hobby if**:
- Building personal projects
- Learning web development
- Creating portfolio sites
- Prototyping ideas

**Upgrade to Pro when**:
- Launching commercial projects
- Need more bandwidth (>100 GB/month)
- Require team collaboration
- Want advanced analytics
- Need password-protected previews

**Consider Enterprise if**:
- Large organization (10+ developers)
- Require SLA guarantees
- Need SSO/SAML
- Want dedicated support

### Team Setup

1. **Create a Team**:
   - Dashboard → "Add New..." → "Team"
   - Choose team name and URL slug
   - Invite team members via email

2. **Team Roles**:
   - **Owner**: Full access, billing management
   - **Member**: Deploy, manage projects, view analytics
   - **Viewer**: Read-only access (Enterprise only)

3. **Team Management**:
   - Projects belong to teams or personal accounts
   - Transfer projects between accounts
   - Separate billing per team

---

## Vercel CLI Installation

### Installation Methods

#### npm (Recommended)

```bash
npm install -g vercel
```

#### yarn

```bash
yarn global add vercel
```

#### pnpm

```bash
pnpm add -g vercel
```

### Verify Installation

```bash
vercel --version
# Output: Vercel CLI 33.0.1
```

### Authentication

```bash
vercel login
```

**Options**:
1. **Email**: Receive magic link
2. **GitHub**: OAuth authentication
3. **GitLab**: OAuth authentication
4. **Bitbucket**: OAuth authentication

**Token-Based Authentication** (for CI/CD):

```bash
# Create token at vercel.com/account/tokens
vercel --token YOUR_TOKEN_HERE
```

### CLI Configuration

View current configuration:

```bash
vercel whoami
# Shows: currently logged in user and team
```

Switch teams:

```bash
vercel switch
# Interactive team selector
```

List all teams:

```bash
vercel teams list
```

---

## Project Creation and Linking

### Creating a New Project from Template

```bash
# Create Next.js app
npx create-next-app@latest my-vercel-app
cd my-vercel-app
```

### Deploying for the First Time

```bash
vercel
```

**Interactive Setup**:
1. Set up and deploy? → **Yes**
2. Which scope? → Select your account/team
3. Link to existing project? → **No**
4. Project name? → Accept default or customize
5. Directory with code? → `.` (current directory)
6. Override build settings? → **No** (unless needed)

**Result**: 
- Production deployment created
- Project linked to Vercel
- `.vercel` directory created locally

### Project Linking

**Manual Linking**:

```bash
vercel link
```

Select existing project or create new one.

**Link Configuration** (`.vercel/project.json`):

```json
{
  "projectId": "prj_xxxxxxxxxxxx",
  "orgId": "team_xxxxxxxxxxxx"
}
```

### Project Structure

Vercel auto-detects frameworks:

**Next.js**:
```
my-app/
├── app/              # Next.js 13+ App Router
├── pages/            # Next.js Pages Router
├── public/           # Static assets
├── package.json
└── next.config.js
```

**React (Vite)**:
```
my-app/
├── src/
├── public/
├── index.html
├── package.json
└── vite.config.js
```

**Static Site**:
```
my-app/
├── index.html
├── css/
├── js/
└── images/
```

### Build Configuration

**Automatic Detection**: Vercel detects framework and configures:
- Build command
- Output directory
- Install command
- Development command

**Manual Override** (vercel.json):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "framework": "nextjs"
}
```

### Deployment Commands

**Production Deployment**:

```bash
vercel --prod
```

**Preview Deployment**:

```bash
vercel
```

**Deploy with Custom Domain**:

```bash
vercel --prod --name my-custom-deployment
```

**Skip Build Cache**:

```bash
vercel --force
```

---

## Environment Variables

Environment variables are essential for API keys, database URLs, and configuration. Vercel provides multiple scopes for different deployment contexts.

### Environment Scopes

**Production**: Used only in production deployments
**Preview**: Used in preview deployments (PRs, branches)
**Development**: Used with `vercel dev` locally

### Adding Environment Variables

#### Via Dashboard

1. **Navigate**: Project → Settings → Environment Variables
2. **Add Variable**:
   - Name: `DATABASE_URL`
   - Value: `postgres://...`
   - Scope: Select Production, Preview, and/or Development
3. **Click**: "Save"

#### Via CLI

```bash
# Add production variable
vercel env add DATABASE_URL production

# Add preview variable
vercel env add API_KEY preview

# Add development variable
vercel env add DEBUG_MODE development
```

**Add to All Environments**:

```bash
vercel env add SECRET_TOKEN
# Select: Production, Preview, Development (all)
```

#### Via vercel.json (Not Recommended for Secrets)

```json
{
  "env": {
    "PUBLIC_API_URL": "https://api.example.com",
    "FEATURE_FLAG": "true"
  }
}
```

**⚠️ Warning**: Never commit secrets to Git. Use dashboard or CLI for sensitive data.

### Environment Variable Types

**System Variables** (Automatic):

```javascript
// Available in all deployments
process.env.VERCEL                    // "1"
process.env.VERCEL_ENV                // "production" | "preview" | "development"
process.env.VERCEL_URL                // Deployment URL
process.env.VERCEL_GIT_COMMIT_SHA     // Git commit hash
process.env.VERCEL_GIT_COMMIT_REF     // Git branch/tag
process.env.VERCEL_GIT_COMMIT_AUTHOR_NAME
```

**Custom Variables** (User-Defined):

```javascript
process.env.DATABASE_URL
process.env.API_KEY
process.env.STRIPE_SECRET_KEY
```

### Accessing Environment Variables

**Next.js Server Components** (App Router):

```typescript
// app/page.tsx
export default async function Page() {
  const apiKey = process.env.API_KEY; // Server-only
  
  return <div>Secure API key used</div>;
}
```

**Next.js API Routes**:

```typescript
// app/api/data/route.ts
export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  // Use in server-side logic
  
  return Response.json({ data: '...' });
}
```

**Client-Side Variables** (Next.js):

```javascript
// Must be prefixed with NEXT_PUBLIC_
const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
```

**⚠️ Security Warning**: `NEXT_PUBLIC_` variables are embedded in the client bundle and visible to users. Never use for secrets.

### Local Development

**Pull Environment Variables**:

```bash
# Download all development environment variables
vercel env pull .env.local
```

Creates `.env.local` file:

```env
DATABASE_URL="postgres://localhost:5432/mydb"
API_KEY="dev_key_123"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

**Local .env Files** (Priority Order):

1. `.env.local` (Highest priority)
2. `.env.development` (Development-specific)
3. `.env` (Default)

### Best Practices

**✅ DO**:
- Use different values for production/preview/development
- Prefix client-side variables with `NEXT_PUBLIC_`
- Pull variables with `vercel env pull` for local dev
- Add `.env*.local` to `.gitignore`
- Use descriptive variable names
- Document required variables in README

**❌ DON'T**:
- Commit secrets to Git
- Use production keys in preview/development
- Share API keys in client-side code
- Hard-code sensitive values

### Updating Variables

**Redeploy Required**: Changing environment variables requires redeployment:

```bash
# After updating variables in dashboard
vercel --prod
```

**Instant Rollout**: Use Edge Config for dynamic configuration without redeployment.

---

## Domain Configuration

### Default Vercel Domains

Every deployment gets automatic domains:

**Production**:
```
your-project.vercel.app
```

**Preview** (per deployment):
```
your-project-git-branch-username.vercel.app
your-project-abc123.vercel.app
```

### Adding Custom Domains

#### Via Dashboard

1. **Navigate**: Project → Settings → Domains
2. **Add Domain**: Enter `example.com` or `www.example.com`
3. **Configure DNS**: Follow Vercel's instructions

#### Via CLI

```bash
vercel domains add example.com
```

### DNS Configuration

**Option 1: Vercel Nameservers** (Recommended)

Transfer full DNS management to Vercel:

1. **Add Domain**: In Vercel dashboard
2. **Update Nameservers**: At your domain registrar:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
3. **Wait**: DNS propagation (up to 48 hours)

**Benefits**:
- Automatic SSL certificate management
- Optimal DNS configuration
- DDoS protection
- Automatic HTTPS redirects

**Option 2: External DNS** (A/CNAME Records)

Keep DNS at current provider:

**For Root Domain** (example.com):
```
Type: A
Name: @
Value: 76.76.21.21
```

**For Subdomain** (www.example.com):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**⚠️ Note**: Root domains require A record or ANAME/ALIAS (provider-dependent).

### Domain Verification

**Verify Ownership**:

If not using Vercel nameservers, add TXT record:

```
Type: TXT
Name: _vercel
Value: vc-domain-verify=xxxxxxxxxxxxx
```

### SSL Certificates

**Automatic**: Vercel automatically provisions SSL certificates via Let's Encrypt.

**Custom Certificates**: 
- Upload custom SSL certificate (Enterprise only)
- Required for specific compliance needs

### WWW vs Non-WWW

**Redirect Configuration**:

```json
// vercel.json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [
        {
          "type": "host",
          "value": "example.com"
        }
      ],
      "destination": "https://www.example.com/:path*",
      "permanent": true
    }
  ]
}
```

**Or Use Dashboard**: Automatic redirect toggle in domain settings.

### Multiple Domains

Add multiple domains to one project:

```bash
vercel domains add example.com
vercel domains add www.example.com
vercel domains add example.org
```

All domains serve the same deployment.

### Domain Management Commands

**List Domains**:
```bash
vercel domains ls
```

**Remove Domain**:
```bash
vercel domains rm example.com
```

**Inspect Domain**:
```bash
vercel domains inspect example.com
```

### Troubleshooting Domains

**DNS Not Propagating**:
- Check DNS with: `dig example.com` or `nslookup example.com`
- Wait up to 48 hours for full propagation
- Clear DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

**SSL Certificate Issues**:
- Ensure DNS points to Vercel
- Wait for automatic certificate provisioning (up to 24 hours)
- Remove and re-add domain if stuck

**"Domain Not Verified"**:
- Add TXT record for verification
- Check TXT record: `dig TXT _vercel.example.com`

---

## Analytics and Monitoring

### Web Analytics

**Enable Analytics**:

1. **Navigate**: Project → Analytics
2. **Click**: "Enable Analytics"
3. **Deploy**: Redeploy to activate tracking

**What's Tracked**:
- Page views
- Unique visitors
- Top pages
- Referrer sources
- Countries
- Devices/browsers

**Privacy-Friendly**: No cookies, compliant with GDPR/CCPA.

**Free Tier Limits**: 500 events/month (Hobby), Unlimited (Pro).

### Speed Insights

**Real User Metrics**:

```bash
npm install @vercel/speed-insights
```

**Next.js Integration**:

```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

**Metrics Collected**:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)
- Time to First Byte (TTFB)

### Deployment Logs

**Real-Time Logs**:

```bash
vercel logs
```

**Production Logs**:

```bash
vercel logs --prod
```

**Function Logs**:

```bash
vercel logs --output
```

**Follow Logs**:

```bash
vercel logs -f
```

### Error Tracking

**Integration with Sentry**:

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.VERCEL_ENV,
});
```

### Performance Monitoring

**Dashboard Metrics**:
- Deployment frequency
- Build duration
- Success/failure rate
- Bandwidth usage
- Function invocations
- Edge function performance

**Lighthouse Scores**: Automatic Lighthouse audits on every deployment (Pro).

---

## Cost Management

### Understanding Billing

**Bandwidth**: 
- Measured per calendar month
- Includes: HTML, CSS, JS, images, API responses
- Excludes: Build logs, analytics data
- Overage: $40 per 100 GB (Pro)

**Serverless Function Execution**:
- Measured in GB-hours
- Formula: Memory (GB) × Execution time (hours)
- Example: 1024 MB function running 1 second = 0.0002833 GB-hours
- Hobby: 100 GB-hours/month included
- Pro: 1000 GB-hours/month included
- Overage: $40 per 100 GB-hours (Pro)

**Edge Function Invocations**:
- Hobby: 1000/day
- Pro: Unlimited
- Enterprise: Custom limits

### Monitoring Usage

**Dashboard**:
- Navigate: Account Settings → Usage
- View: Current month usage
- Track: Bandwidth, function executions, builds

**CLI**:

```bash
vercel inspect
```

### Optimization Tips

**Reduce Bandwidth**:
1. **Optimize Images**: Use WebP, AVIF formats
   ```javascript
   // next.config.js
   module.exports = {
     images: {
       formats: ['image/avif', 'image/webp'],
     },
   };
   ```

2. **Enable Compression**: Gzip/Brotli (automatic on Vercel)

3. **Cache Headers**: Set long cache times
   ```javascript
   // next.config.js
   module.exports = {
     async headers() {
       return [
         {
           source: '/static/:path*',
           headers: [
             {
               key: 'Cache-Control',
               value: 'public, max-age=31536000, immutable',
             },
           ],
         },
       ];
     },
   };
   ```

4. **Use CDN**: Vercel's CDN is automatic; leverage it with proper cache headers

**Reduce Function Execution Time**:

1. **Optimize Cold Starts**:
   - Minimize bundle size
   - Use Edge Runtime where possible
   - Keep dependencies lean

2. **Cache Responses**:
   ```typescript
   // app/api/data/route.ts
   export async function GET() {
     return Response.json({ data: '...' }, {
       headers: {
         'Cache-Control': 's-maxage=60, stale-while-revalidate=30',
       },
     });
   }
   ```

3. **Use Edge Functions**: Near-instant execution
   ```typescript
   export const runtime = 'edge';
   ```

**Reduce Build Minutes**:
- Use build cache (default)
- Optimize build commands
- Skip unnecessary builds with Ignored Build Step

### Free Tier Limits

**Hobby Plan**:
- 100 GB bandwidth/month
- 100 GB-hours serverless execution
- 1000 Edge Function invocations/day
- Unlimited projects
- Unlimited deployments

**What Happens When Exceeded**:
- **Bandwidth**: Site may become unavailable
- **Functions**: Executions may fail
- **Solution**: Upgrade to Pro or wait for next month

### Cost Estimation

**Example Scenario**:
- Blog with 10,000 monthly visitors
- Average page size: 500 KB
- 2 page views per visitor
- Bandwidth: 10,000 × 2 × 0.5 MB = 10 GB/month
- **Result**: Well within Hobby tier

**E-commerce Site**:
- 100,000 monthly visitors
- Average page: 1 MB
- 3 pages per visitor
- API calls: 200,000/month (avg 200ms, 512 MB)
- Bandwidth: 300 GB/month → Pro tier + $80 overage
- Function execution: ~5.6 GB-hours → Within Pro tier
- **Monthly Cost**: $100 (Pro) + $80 (bandwidth) = $180

---

## Troubleshooting

### Common Issues and Solutions

#### Build Failures

**Issue**: Build command not found

```
Error: Command "npm run build" not found
```

**Solution**: Verify `package.json` scripts:

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}
```

**Issue**: Out of memory during build

```
Error: JavaScript heap out of memory
```

**Solution**: Increase Node.js memory in build command:

```json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

#### Deployment Issues

**Issue**: Environment variables not working

**Solution**:
1. Verify variables are set in correct environment (Production/Preview/Development)
2. Redeploy after adding variables
3. Check variable names (case-sensitive)
4. Pull variables locally: `vercel env pull`

**Issue**: 404 on custom domain

**Solution**:
1. Verify DNS configuration: `dig yourdomain.com`
2. Check domain is assigned to project
3. Wait for DNS propagation (up to 48 hours)
4. Ensure SSL certificate is provisioned

#### Runtime Errors

**Issue**: Serverless function timeout

```
Error: Task timed out after 10.00 seconds
```

**Solution**:
1. Optimize function code (reduce database queries, parallelize)
2. Upgrade to Pro (60-second timeout)
3. Consider Edge Runtime for faster execution
4. Move long-running tasks to background jobs

**Issue**: Module not found in production

```
Error: Cannot find module 'some-package'
```

**Solution**:
1. Ensure package is in `dependencies` (not `devDependencies`)
2. Clear build cache: `vercel --force`
3. Check `.vercelignore` doesn't exclude necessary files

#### Performance Issues

**Issue**: Slow page loads

**Solution**:
1. Enable Speed Insights to identify bottlenecks
2. Optimize images with Next.js Image component
3. Use incremental static regeneration (ISR)
4. Implement caching strategies
5. Check bundle size: `npm run build`

**Issue**: High bandwidth usage

**Solution**:
1. Optimize assets (compress images, minify JS/CSS)
2. Use CDN cache headers
3. Implement lazy loading
4. Monitor usage in dashboard

### Debug Commands

**Inspect Deployment**:

```bash
vercel inspect DEPLOYMENT_URL
```

**View Build Logs**:

```bash
vercel logs BUILD_ID
```

**Check Project Configuration**:

```bash
vercel project ls
vercel project inspect
```

**Test Function Locally**:

```bash
vercel dev
```

### Getting Help

**Documentation**: [vercel.com/docs](https://vercel.com/docs)

**Community**:
- GitHub Discussions: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- Discord: [vercel.com/discord](https://vercel.com/discord)

**Support**:
- Hobby: Community support
- Pro: Email support
- Enterprise: Dedicated support team

---

## Best Practices

### Security

1. **Never Commit Secrets**:
   ```gitignore
   # .gitignore
   .env*.local
   .vercel
   ```

2. **Use Environment Variables**: For all sensitive data

3. **Enable Branch Protection**: Require reviews before merging

4. **Use Preview Deployments**: Test changes before production

5. **Implement Authentication**: For admin routes and APIs

### Performance

1. **Optimize Images**:
   ```typescript
   import Image from 'next/image';
   
   <Image
     src="/photo.jpg"
     width={800}
     height={600}
     alt="Description"
     loading="lazy"
   />
   ```

2. **Use Edge Runtime**: For dynamic content requiring low latency

3. **Implement Caching**:
   ```typescript
   export const revalidate = 60; // Revalidate every 60 seconds
   ```

4. **Code Splitting**: Automatic with Next.js, leverage dynamic imports

### Development Workflow

1. **Use Git Branches**: Create feature branches for development

2. **Review Preview Deployments**: Test on preview URL before merging

3. **Automate Testing**: Run tests before deployment
   ```json
   {
     "scripts": {
       "vercel-build": "npm run test && npm run build"
     }
   }
   ```

4. **Monitor Deployments**: Check build status and runtime logs

5. **Document Environment Variables**: In README or `.env.example`

### Cost Optimization

1. **Monitor Usage**: Regularly check bandwidth and function execution

2. **Optimize Bundle Size**: Remove unused dependencies

3. **Use Static Generation**: When possible (cheaper than SSR)

4. **Implement Smart Caching**: Reduce redundant function executions

---

## Conclusion

Vercel provides a powerful platform for modern web development with:

- **Zero-config deployments** that just work
- **Global CDN** for instant content delivery
- **Preview deployments** for every change
- **Serverless functions** for backend logic
- **Edge computing** for ultra-low latency

### Next Steps

1. **Deploy Your First Project**: Try `vercel` in any project directory
2. **Explore Next.js**: Vercel's optimal framework integration
3. **Set Up Custom Domain**: Make your project production-ready
4. **Learn Advanced Features**: Explore Edge Functions, Middleware, ISR
5. **Join the Community**: Discord, GitHub Discussions, forums

### Additional Resources

- **Official Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Examples**: [github.com/vercel/vercel/tree/main/examples](https://github.com/vercel/vercel/tree/main/examples)
- **Templates**: [vercel.com/templates](https://vercel.com/templates)
- **Blog**: [vercel.com/blog](https://vercel.com/blog)

---

**Happy Deploying! 🚀**

*Created for The Grand Budapest Terminal Project*
