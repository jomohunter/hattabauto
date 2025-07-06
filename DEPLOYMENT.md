# 🚀 Deployment Guide - HattabAuto

## 📋 Prerequisites
- GitHub repository: https://github.com/jomohunter/hattabauto.git
- Railway account (free tier)
- Netlify account (free tier)

## 🔧 Backend Deployment (Railway)

### Step 1: Deploy to Railway
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `hattabauto` repository
5. Set **Root Directory** to: `backend`
6. Railway will auto-detect Node.js

### Step 2: Add PostgreSQL Database
1. In Railway dashboard, click "New Service"
2. Select "Database" → "PostgreSQL"
3. Railway will provide a `DATABASE_URL`

### Step 3: Set Environment Variables
In Railway dashboard, add these environment variables:
```env
DATABASE_URL=postgresql://postgres:RhqLkqUioJZRbIQTPkjuxdTFZfcBpFLy@postgres.railway.internal:5432/railway
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
NODE_ENV=production
PORT=5002
```

### Step 4: Deploy
Railway will automatically deploy when you push to GitHub!

## 🌐 Frontend Deployment (Netlify)

### Step 1: Deploy to Netlify
1. Go to [Netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "New site from Git"
4. Select your `hattabauto` repository
5. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

### Step 2: Set Environment Variables
In Netlify dashboard, add:
```env
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app/api
```

### Step 3: Deploy
Netlify will auto-deploy when you push to GitHub!

## 🔗 Connect Frontend to Backend

### Update API URL
Once you have your Railway URL, update the frontend environment variable:
```env
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app/api
```

### Update CORS in Backend
Update the CORS origins in `backend/src/server.ts` with your actual Netlify domain.

## ✅ Verification Checklist

- [ ] Backend deployed to Railway
- [ ] PostgreSQL database connected
- [ ] Environment variables set
- [ ] Frontend deployed to Netlify
- [ ] API URL configured
- [ ] CORS origins updated
- [ ] Test the application

## 🐛 Troubleshooting

### Common Issues:
1. **Build fails**: Check Node.js version (use 18+)
2. **Database connection**: Verify DATABASE_URL format
3. **CORS errors**: Update allowed origins
4. **API not found**: Check NEXT_PUBLIC_API_URL

### Railway Commands:
```bash
# View logs
railway logs

# Check status
railway status

# Connect to database
railway connect
```

### Netlify Commands:
```bash
# Deploy manually
netlify deploy --prod

# View logs
netlify logs
```

## 🔐 Security Notes
- Change JWT_SECRET in production
- Use strong passwords
- Enable HTTPS (automatic on Railway/Netlify)
- Set up proper CORS origins

## 📞 Support
- Railway: https://railway.app/docs
- Netlify: https://docs.netlify.com
- Next.js: https://nextjs.org/docs 