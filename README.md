Developer Productivity MVP - Backend

A clean, beginner-friendly Node.js and Express backend for tracking developer productivity metrics.

## 🎯 Project Overview

This is the foundation of a Developer Productivity MVP that provides APIs to:
- Retrieve developer information
- Access productivity metrics
- Track performance statistics
- Get team-based insights

### Key Features

✅ **Clean Architecture** - Organized layers (routes → controllers → services → data)  
✅ **ES Modules** - Modern JavaScript module system  
✅ **Mock Data** - JSON files simulating database data  
✅ **Error Handling** - Centralized error handling middleware  
✅ **Request Logging** - Comprehensive request/response logging  
✅ **Well Commented** - Every file explains its purpose and functions  
✅ **Production Ready** - Proper middleware stack and configuration  
✅ **Easy to Extend** - Simple structure for adding new features  

## 📁 Project Structure

```text
developers-mvp/
├── src/
│   ├── controllers/          # HTTP request handlers
│   │   ├── developerController.js
│   │   └── metricsController.js
│   ├── routes/               # API route definitions
│   │   ├── developerRoutes.js
│   │   └── metricsRoutes.js
│   ├── services/             # Business logic layer
│   │   ├── developerService.js
│   │   └── metricsService.js
│   ├── middleware/           # Express middleware
│   │   ├── loggerMiddleware.js
│   │   └── errorMiddleware.js
│   ├── data/                 # Mock JSON data
│   │   ├── developers.json
│   │   └── metrics.json
│   └── utils/                # Utility functions
│       └── dataLoader.js
├── server.js                 # Main application entry point
├── package.json              # Project configuration
└── README.md                 # This file
```

### Architecture Explanation

**Three-Layer Architecture:**

1. **Routes Layer** (`src/routes/`)
- Maps HTTP requests to controllers
- Defines API endpoints
- Handles route ordering

2. **Controllers Layer** (`src/controllers/`)
- Handles HTTP requests and responses
- Validates input parameters
- Formats and returns data
- Delegates business logic to services

3. **Services Layer** (`src/services/`)
- Contains core business logic
- Interacts with data sources
- Performs calculations and filtering
- Returns processed data to controllers

4. **Data Layer** (`src/data/`)
- Mock JSON files (simulating database)
- Can be easily replaced with real database

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)

### Installation

```bash
# Navigate to project directory
cd "d:\IMP Files\Developers MVP"

# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Or start production server
npm start
```

The server will start on `http://localhost:3000`

## 📡 API Endpoints

### Developer Endpoints

#### Get All Developers
```http
GET /developers
```
Returns all developers in the system.

**Response:**
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
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

#### Get Specific Developer
```http
GET /developers/:id
```
Returns a specific developer by ID.

**Example:** `GET /developers/DEV001`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "DEV001",
    "name": "Alice Johnson",
    "email": "alice.johnson@company.com",
    "role": "Senior Frontend Developer",
    "team": "Frontend",
    "startDate": "2020-01-15",
    "status": "active"
  },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

#### Get Developers by Team
```http
GET /developers/team/:team
```
Returns all developers in a specific team.

**Example:** `GET /developers/team/Frontend`

#### Get Active Developer Count
```http
GET /developers/stats/active
```
Returns the number of active developers.

### Metrics Endpoints

#### Get All Metrics for Developer
```http
GET /metrics/:developerId
```
Returns all historical metrics for a specific developer.

**Example:** `GET /metrics/DEV001`

#### Get Latest Metrics
```http
GET /metrics/:developerId/latest
```
Returns the most recent metrics for a developer.

**Response:**
```json
{
  "success": true,
  "data": {
    "developerId": "DEV001",
    "month": "2025-01",
    "tasksCompleted": 28,
    "codeReviewsCompleted": 22,
    "bugsFiled": 3,
    "bugsResolved": 10,
    "commitCount": 61,
    "pullRequestsCreated": 14,
    "pullRequestsReviewed": 32,
    "avgResponseTime": 2.1,
    "productivityScore": 95
  },
  "developerId": "DEV001",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

#### Get Metrics for Specific Month
```http
GET /metrics/:developerId/:month
```
Returns metrics for a developer in a specific month (YYYY-MM format).

**Example:** `GET /metrics/DEV001/2025-01`

#### Get Average Productivity Score
```http
GET /metrics/:developerId/average-score
```
Returns the average productivity score across all time periods.

#### Get Aggregated Metrics
```http
GET /metrics/aggregated/all
```
Returns aggregate statistics for all developers.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalMetrics": 10,
    "averageProductivityScore": 90,
    "averageTAsksCompleted": 25
  },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

#### Health Check
```http
GET /health
```
Simple endpoint to verify API is running.

## 🔄 How Data Flows Through the Application

```text
HTTP Request
    ↓
Route (src/routes/)
    ↓
Controller (src/controllers/) - validates & formats
    ↓
Service (src/services/) - business logic
    ↓
Data Loader (src/utils/) - loads JSON
    ↓
JSON File (src/data/) - mock data
    ↓
Service returns processed data
    ↓
Controller formats response
    ↓
HTTP Response (JSON)
```

## 📝 Code Examples

### Adding a New Endpoint

1. **Add to Service** (`src/services/developerService.js`):
```javascript
function getNewData() {
  const data = loadJsonData('developers.json');
  return data.filter(/* your logic */);
}
```

2. **Add to Controller** (`src/controllers/developerController.js`):
```javascript
function getNewDataHandler(req, res) {
  try {
    const data = getNewData();
    res.status(200).json({
      success: true,
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error',
      error: error.message
    });
  }
}
```

3. **Add Route** (`src/routes/developerRoutes.js`):
```javascript
router.get('/new-endpoint', getNewDataHandler);
```

## 🧪 Testing Endpoints

### Using cURL
```bash
# Get all developers
curl http://localhost:3000/developers

# Get specific developer
curl http://localhost:3000/developers/DEV001

# Get metrics
curl http://localhost:3000/metrics/DEV001/latest
```

### Using Postman
1. Create a new request
2. Set method to GET
3. Enter endpoint URL: `http://localhost:3000/developers`
4. Click Send

## 📚 Learning Path

This project is structured for learning:

1. **Start with:** `server.js` - understand the main flow
2. **Then explore:** `src/routes/` - see how endpoints are defined
3. **Next:** `src/controllers/` - understand request handling
4. **Then:** `src/services/` - see business logic
5. **Finally:** `src/data/` & `src/utils/` - understand data loading

## 🔧 Configuration

### Environment Variables (Future)
Create a `.env` file:

```env
PORT=3000
NODE_ENV=development
```

## 📈 Future Enhancements

- [ ] Add authentication (JWT tokens)
- [ ] Replace JSON files with actual database (MongoDB/PostgreSQL)
- [ ] Add data validation middleware
- [ ] Create POST/PUT/DELETE endpoints
- [ ] Add unit tests
- [ ] Add API documentation (Swagger)
- [ ] Add rate limiting
- [ ] Add caching layer

## 📄 File Descriptions

| File | Purpose |
|------|---------|
| `server.js` | Main application entry point, sets up Express |
| `src/routes/` | Maps URLs to controllers |
| `src/controllers/` | Handles HTTP requests and responses |
| `src/services/` | Contains business logic and data operations |
| `src/middleware/` | Custom middleware for logging and errors |
| `src/data/` | Mock JSON data files |
| `src/utils/` | Utility functions like data loading |

## 📞 Support

For questions about the architecture:
1. Read the comments in each file
2. Review the file descriptions above
3. Check the code examples

## 📄 License

ISC

---

**Created:** January 2025  
**Project:** Developer Productivity MVP  
**Backend Foundation:** Node.js + Express
