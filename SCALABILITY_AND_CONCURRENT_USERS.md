# 📊 Scalability & Concurrent User Capacity Guide

## 🎯 Quick Answer

**Current Setup (Free Tier):**
- **Estimated Concurrent Users:** 50-100 simultaneous users (active, making requests)
- **Daily Active Users:** 1,000-5,000 users per day
- **Monthly Active Users:** 10,000-50,000 users per month

**Bottlenecks:**
1. **Vercel Free Tier** - 100GB bandwidth/month, limited function execution time
2. **Supabase Free Tier** - 500MB database, 2GB bandwidth/month, 200 concurrent connections
3. **Prisma Connection Pooling** - Currently using `connection_limit=1` (single connection per function)

---

## 📈 Detailed Breakdown

### 1. **Vercel Hosting (Next.js Serverless)**

#### Free Tier Limits:
- ✅ **Bandwidth:** 100GB/month
- ✅ **Function Execution:** 10 seconds max per request
- ✅ **Build Time:** 45 minutes/month
- ✅ **Concurrent Functions:** Limited by bandwidth
- ⚠️ **Serverless Cold Starts:** ~100-500ms delay on first request

#### Hobby Tier ($20/month):
- ✅ **Bandwidth:** 1TB/month (10x more)
- ✅ **Function Execution:** 60 seconds max per request
- ✅ **Concurrent Functions:** Unlimited (within bandwidth)
- ✅ **99.9% Uptime SLA**

#### Pro Tier ($20/user/month):
- ✅ All Hobby features
- ✅ **Unlimited bandwidth**
- ✅ **Advanced Analytics**
- ✅ **Team collaboration**

**Impact on Concurrent Users:**
- **Free Tier:** ~50-100 simultaneous active users (browsing/clicking)
- **Hobby Tier:** ~500-1,000 simultaneous active users
- **Pro Tier:** Virtually unlimited (depends on database)

---

### 2. **Supabase Database (PostgreSQL)**

#### Free Tier Limits:
- ✅ **Database Size:** 500MB
- ✅ **Bandwidth:** 2GB/month egress
- ✅ **Database Connections:** 200 concurrent connections
- ✅ **API Requests:** 50,000/month (Supabase API)
- ⚠️ **Project Pause:** After 1 week of inactivity (if free tier)

#### Pro Tier ($25/month):
- ✅ **Database Size:** 8GB (16x more)
- ✅ **Bandwidth:** 50GB/month egress (25x more)
- ✅ **Database Connections:** 200 concurrent connections
- ✅ **API Requests:** Unlimited
- ✅ **No project pause**

#### Team Tier ($599/month):
- ✅ **Database Size:** 50GB
- ✅ **Bandwidth:** 250GB/month egress
- ✅ **Database Connections:** 400 concurrent connections
- ✅ **Better Performance:** Dedicated resources

**Impact on Concurrent Users:**
- **Free Tier:** ~50-100 simultaneous database queries
- **Pro Tier:** ~200-400 simultaneous database queries
- **Team Tier:** ~400-800 simultaneous database queries

**Connection Pooling:**
Your app uses `pgBouncer` with `connection_limit=1`, which means:
- Each serverless function gets **1 database connection**
- Connections are **reused efficiently**
- Max concurrent connections: **200 (free tier) / 400 (team tier)**

---

### 3. **Prisma ORM**

#### Current Configuration:
```typescript
// Single Prisma instance per serverless function
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
```

**Connection Pooling:**
- ✅ **Connection Reuse:** Prisma reuses connections efficiently
- ✅ **Query Batching:** Prisma batches queries when possible
- ⚠️ **Cold Starts:** New Prisma instance on each cold start (~50-100ms)

**Impact:**
- Each serverless function maintains **1 connection**
- Vercel can spawn **hundreds of functions simultaneously**
- Each function = **1 connection** (pooled via pgBouncer)

---

### 4. **Actual Concurrent User Capacity**

#### Scenario 1: Light Usage (Browsing, Reading)
- **Page Views:** ~5 requests per user per minute
- **Database Queries:** ~2 queries per page
- **Free Tier Capacity:** ~50-100 users simultaneously browsing
- **Pro Tier Capacity:** ~500-1,000 users simultaneously browsing

#### Scenario 2: Heavy Usage (Interactions, Forms, Quizzes)
- **Page Views:** ~10 requests per user per minute
- **Database Queries:** ~5 queries per page (writes included)
- **Free Tier Capacity:** ~20-50 users simultaneously active
- **Pro Tier Capacity:** ~200-500 users simultaneously active

#### Scenario 3: Peak Usage (All Features)
- **Page Views:** ~20 requests per user per minute
- **Database Queries:** ~10 queries per page (complex operations)
- **Free Tier Capacity:** ~10-20 users simultaneously active
- **Pro Tier Capacity:** ~100-200 users simultaneously active

---

## 🚨 Bottlenecks & Crash Points

### **Free Tier:**
1. **Vercel Bandwidth** - 100GB/month (~3.3GB/day)
   - **Crash Point:** ~1,000 daily active users with heavy usage
   
2. **Supabase Database Size** - 500MB limit
   - **Crash Point:** ~10,000-50,000 registered users (with progress data)
   
3. **Supabase Bandwidth** - 2GB/month (~67MB/day)
   - **Crash Point:** ~500 daily active users with heavy usage
   
4. **Database Connections** - 200 max
   - **Crash Point:** ~200 simultaneous serverless functions (rare)

### **Pro Tier ($45/month total):**
1. **Vercel Bandwidth** - 1TB/month (~33GB/day)
   - **Handles:** ~10,000 daily active users
   
2. **Supabase Database Size** - 8GB limit
   - **Handles:** ~100,000-500,000 registered users
   
3. **Supabase Bandwidth** - 50GB/month (~1.6GB/day)
   - **Handles:** ~5,000 daily active users
   
4. **Database Connections** - 200 max (still a limit)
   - **Handles:** ~200 simultaneous functions (usually fine)

---

## 📊 Real-World Estimates

### **Current Setup (Free Tier):**
| Metric | Capacity |
|--------|----------|
| **Concurrent Active Users** | 50-100 |
| **Daily Active Users (DAU)** | 1,000-2,000 |
| **Monthly Active Users (MAU)** | 10,000-20,000 |
| **Database Size** | Up to 500MB |
| **Monthly Bandwidth** | 100GB (Vercel) + 2GB (Supabase) |

### **Pro Tier ($45/month):**
| Metric | Capacity |
|--------|----------|
| **Concurrent Active Users** | 500-1,000 |
| **Daily Active Users (DAU)** | 5,000-10,000 |
| **Monthly Active Users (MAU)** | 50,000-100,000 |
| **Database Size** | Up to 8GB |
| **Monthly Bandwidth** | 1TB (Vercel) + 50GB (Supabase) |

### **Team Tier ($619/month):**
| Metric | Capacity |
|--------|----------|
| **Concurrent Active Users** | 1,000-2,000 |
| **Daily Active Users (DAU)** | 10,000-20,000 |
| **Monthly Active Users (MAU)** | 100,000-500,000 |
| **Database Size** | Up to 50GB |
| **Monthly Bandwidth** | Unlimited (Vercel) + 250GB (Supabase) |

---

## 🔧 How to Increase Capacity

### **1. Optimize Database Queries**
```typescript
// ❌ Bad: N+1 queries
users.map(user => prisma.profile.findUnique({ where: { userId: user.id } }))

// ✅ Good: Batch queries
prisma.profile.findMany({ where: { userId: { in: userIds } } })
```

### **2. Add Caching (Redis/Supabase Cache)**
- Cache frequently accessed data
- Reduce database queries by 50-80%
- Can increase capacity by 2-5x

### **3. Implement Database Indexes**
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_forum_threads_created_at ON forum_threads(created_at);
```

### **4. Optimize Prisma Connection Pooling**
```typescript
// Use connection pooling with more connections
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL?.replace('connection_limit=1', 'connection_limit=5')
    }
  }
})
```

### **5. Add CDN for Static Assets**
- Serve images, fonts, CSS from CDN
- Reduces Vercel bandwidth usage
- Can handle 10x more traffic

### **6. Monitor & Alert**
- Set up Vercel Analytics
- Monitor Supabase dashboard
- Alert when approaching limits

---

## 🎯 Recommended Scaling Path

### **Phase 1: Start (0-1,000 users)**
- ✅ **Free Tier** on both Vercel & Supabase
- **Cost:** $0/month
- **Capacity:** ~50 concurrent users, ~1,000 DAU

### **Phase 2: Growth (1,000-10,000 users)**
- ✅ **Vercel Hobby** ($20/month) + **Supabase Pro** ($25/month)
- **Cost:** $45/month
- **Capacity:** ~500 concurrent users, ~5,000 DAU

### **Phase 3: Scale (10,000-100,000 users)**
- ✅ **Vercel Pro** ($20/user/month) + **Supabase Team** ($599/month)
- **Cost:** ~$619/month
- **Capacity:** ~2,000 concurrent users, ~20,000 DAU

### **Phase 4: Enterprise (100,000+ users)**
- ✅ **Vercel Enterprise** + **Supabase Enterprise**
- **Cost:** Custom pricing
- **Capacity:** Virtually unlimited with proper architecture

---

## 📈 Monitoring Your App

### **Vercel Dashboard:**
- Monitor bandwidth usage
- Track function execution time
- Check error rates
- Set up alerts for limits

### **Supabase Dashboard:**
- Monitor database size
- Track connection pool usage
- Check query performance
- Set up alerts for limits

### **Key Metrics to Watch:**
1. **Bandwidth Usage** (Vercel & Supabase)
2. **Database Size** (Supabase)
3. **Active Connections** (Supabase)
4. **Error Rates** (Both platforms)
5. **Response Times** (Vercel)

---

## 🚨 When You'll See Crashes

### **Free Tier Crash Points:**
1. **Vercel Bandwidth Exceeded:**
   - Error: "Bandwidth limit exceeded"
   - Solution: Upgrade to Hobby tier

2. **Supabase Database Full:**
   - Error: "Database size limit exceeded"
   - Solution: Upgrade to Pro tier or clean old data

3. **Supabase Bandwidth Exceeded:**
   - Error: "Egress bandwidth limit exceeded"
   - Solution: Upgrade to Pro tier or optimize queries

4. **Too Many Database Connections:**
   - Error: "Too many connections"
   - Solution: Optimize connection pooling or upgrade

---

## ✅ Best Practices

### **1. Database Optimization**
- Add indexes for frequently queried columns
- Use batch queries instead of N+1 queries
- Clean up old/unused data regularly

### **2. Caching Strategy**
- Cache static content (courses, modules)
- Use Redis for session data
- Cache database queries with TTL

### **3. Code Optimization**
- Minimize database queries per request
- Use Next.js Image optimization
- Enable static generation where possible

### **4. Monitoring**
- Set up alerts for bandwidth/database limits
- Monitor error rates and response times
- Track user growth trends

---

## 🎉 Summary

**Your current setup can handle:**
- **Free Tier:** 50-100 concurrent users, ~1,000 DAU
- **Pro Tier ($45/month):** 500-1,000 concurrent users, ~5,000 DAU
- **Team Tier ($619/month):** 1,000-2,000 concurrent users, ~20,000 DAU

**Key Takeaway:**
Your architecture is **highly scalable**. The main limits are:
1. **Hosting & database costs** (not technical limits)
2. **Database connection pooling** (can be optimized)
3. **Bandwidth** (can be optimized with CDN)

**Next Steps:**
1. Monitor your usage as you grow
2. Optimize queries and add caching
3. Upgrade when you approach limits
4. Consider Redis/CDN for high traffic

You're building on a **solid, scalable foundation**! 🚀

