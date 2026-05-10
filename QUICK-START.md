# Quick Start Guide

Get the Developer Productivity MVP backend running in 2 minutes! 🚀

## Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

## Installation (Step by Step)

### Step 1: Navigate to Project

```bash
cd "d:\IMP Files\Developers MVP"
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install Express and CORS (takes ~10 seconds).

### Step 3: Start the Server

```bash
npm start
```

You should see:
```
═════════════════════════════════════════════════
Developer Productivity MVP - Backend Server
═════════════════════════════════════════════════
✓ Server running on http://localhost:3000
✓ Health check: http://localhost:3000/health
```

**That's it!** Your API is now running! 🎉

## Testing the API

### Option 1: Using Your Browser

Open these URLs in your browser:

1. **Health Check:** http://localhost:3000/health
2. **All Developers:** http://localhost:3000/developers
3. **Specific Developer:** http://localhost:3000/developers/DEV001
4. **Latest Metrics:** http://localhost:3000/metrics/DEV001/latest

### Option 2: Using PowerShell

```powershell
# Test health endpoint
Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing

# Get all developers
Invoke-WebRequest -Uri "http://localhost:3000/developers" -UseBasicParsing

# Get specific developer
Invoke-WebRequest -Uri "http://localhost:3000/developers/DEV001" -UseBasicParsing

# Get metrics
Invoke-WebRequest -Uri "http://localhost:3000/metrics/DEV001/latest" -UseBasicParsing
```

### Option 3: Using cURL (if available)

```bash
# Health check
curl http://localhost:3000/health

# All developers
curl http://localhost:3000/developers

# Specific developer
curl http://localhost:3000/developers/DEV001

# Latest metrics
curl http://localhost:3000/metrics/DEV001/latest
```

### Option 4: Using Postman

1. Download [Postman](https://www.postman.com/)
2. Create a new GET request
3. Enter URL: `http://localhost:3000/developers`
4. Click **Send**
5. View the JSON response

## Available Endpoints

### Developers (5 test developers included)

| Endpoint | Purpose |
|----------|---------|
| `GET /developers` | Get all developers |
| `GET /developers/:id` | Get specific developer (e.g., DEV001) |
| `GET /developers/team/:team` | Get by team (e.g., Frontend) |
| `GET /developers/stats/active` | Count active developers |

**Test Developer IDs:** DEV001, DEV002, DEV003, DEV004, DEV005

### Metrics (2 months of data per developer)

| Endpoint | Purpose |
|----------|---------|
| `GET /metrics/:developerId` | Get all metrics for developer |
| `GET /metrics/:developerId/latest` | Get latest metrics |
| `GET /metrics/:developerId/:month` | Get specific month (e.g., 2025-01) |
| `GET /metrics/:developerId/average-score` | Get average score |
| `GET /metrics/aggregated/all` | Get aggregate stats |

**Example Months:** 2024-12, 2025-01

## Common Commands

### Development Mode (with auto-restart on file changes)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Stop the Server

Press `Ctrl + C` in your terminal

## Understanding the Response

Here's what a typical response looks like:

```json
{
  "success": true,
  "data": [
    {
      "id": "DEV001",
      "name": "Alice Johnson",
      "email": "alice.johnson@company.com",
      "role": "Senior Frontend Developer",
      "team": "Frontend",
      "startDate": "2020-01-15",
      "status": "active"
    }
  ],
  "count": 5,
  "timestamp": "2026-05-10T13:04:45.767Z"
}
```

**Key Fields:**
- `success` - Whether the request succeeded (true/false)
- `data` - The actual response data
- `count` - Number of items returned
- `timestamp` - When the response was generated

## Example Requests

### 1. Get Alice's Latest Metrics

```
URL: http://localhost:3000/metrics/DEV001/latest
Method: GET

Response includes:
- 28 tasks completed
- 22 code reviews
- 95 productivity score
```

### 2. Get Frontend Team Members

```
URL: http://localhost:3000/developers/team/Frontend
Method: GET

Response includes:
- Alice Johnson (DEV001)
```

### 3. Get All Team Metrics Summary

```
URL: http://localhost:3000/metrics/aggregated/all
Method: GET

Response includes:
- 10 total metrics
- 90 average productivity score
- 24 average tasks completed
```

## Folder Structure Overview

```
developers-mvp/
├── src/
│   ├── controllers/      ← Handles HTTP requests
│   ├── routes/           ← Maps URLs to handlers
│   ├── services/         ← Business logic
│   ├── middleware/       ← Error handling & logging
│   ├── data/             ← JSON mock data
│   └── utils/            ← Helper functions
├── server.js             ← Main app file
├── package.json          ← Dependencies
├── README.md             ← Full documentation
└── API-DOCUMENTATION.md  ← Detailed API specs
```

## Next Steps

1. **Explore the Code**
   - Open `server.js` to see how everything connects
   - Check `src/routes/` to see endpoint definitions
   - Review `src/services/` to see business logic

2. **Read the Documentation**
   - [README.md](./README.md) - Project overview
   - [API-DOCUMENTATION.md](./API-DOCUMENTATION.md) - Detailed API specs
   - [TEST-REPORT.md](./TEST-REPORT.md) - Test results

3. **Modify the Data**
   - Edit `src/data/developers.json` to change developers
   - Edit `src/data/metrics.json` to change metrics
   - Server will automatically reload if using `npm run dev`

4. **Add New Endpoints**
   - Create a new service in `src/services/`
   - Create a controller in `src/controllers/`
   - Add routes in `src/routes/`
   - Restart the server

## Troubleshooting

### "Port 3000 is already in use"

**Solution:** Kill the process on port 3000 or use a different port:

```bash
# Use different port
PORT=3001 npm start
```

### "Module not found" errors

**Solution:** Install dependencies again:

```bash
npm install
```

### Server won't start

**Solution:** Check Node.js version:

```bash
node --version
```

Should be v16 or higher. If not, download the latest from nodejs.org

### Endpoint returns 404

**Solution:** Check the exact URL:
- Make sure to use correct Developer IDs (DEV001-DEV005)
- Check for typos in the endpoint name
- Make sure server is running

## Tips & Tricks

💡 **Tip 1:** Use browser DevTools (F12) to see responses  
💡 **Tip 2:** Copy any URL into the browser address bar  
💡 **Tip 3:** Use Postman for complex testing  
💡 **Tip 4:** Check the server console for request logs  
💡 **Tip 5:** Edit `src/data/` files while server is running to test  

## Need Help?

1. Check [API-DOCUMENTATION.md](./API-DOCUMENTATION.md) for endpoint specs
2. Read [README.md](./README.md) for architecture explanation
3. Review [TEST-REPORT.md](./TEST-REPORT.md) for tested endpoints
4. Check the server console for error messages

## Success!

If you can see JSON data in your browser, **the backend is working!** 🎉

You're now ready to:
- Build a frontend to consume this API
- Add more features to the backend
- Connect a real database
- Deploy to production

---

**Enjoy building!** 🚀

**Project:** Developer Productivity MVP  
**Status:** Ready for Development  
**Created:** May 2026
