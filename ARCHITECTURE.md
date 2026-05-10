# Architecture Guide

Deep dive into the Developer Productivity MVP backend architecture and design patterns.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Layer Breakdown](#layer-breakdown)
3. [Design Patterns](#design-patterns)
4. [Data Flow](#data-flow)
5. [Best Practices](#best-practices)
6. [Extending the Application](#extending-the-application)

---

## Architecture Overview

This project follows a **Three-Layer Architecture** pattern, a proven approach that separates concerns and makes the code maintainable and testable.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│         Client (Browser / Mobile / Desktop)             │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP Requests
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Routing Layer                              │
│  (Express Routes - src/routes/)                        │
│  ├─ GET /developers                                    │
│  ├─ GET /developers/:id                                │
│  ├─ GET /metrics/:developerId                          │
│  └─ GET /metrics/:developerId/latest                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│           Controllers Layer                             │
│  (Request Handlers - src/controllers/)                 │
│  ├─ developerController.js                            │
│  │  ├─ getDevelopersHandler()                         │
│  │  ├─ getDeveloperByIdHandler()                      │
│  │  └─ getDevelopersByTeamHandler()                   │
│  └─ metricsController.js                              │
│     ├─ getMetricsHandler()                            │
│     └─ getLatestMetricsHandler()                      │
│                                                        │
│  Responsibilities:                                    │
│  • Validate input parameters                          │
│  • Handle HTTP request/response lifecycle             │
│  • Format responses                                   │
│  • Delegate to services                               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│            Services Layer                              │
│  (Business Logic - src/services/)                      │
│  ├─ developerService.js                               │
│  │  ├─ getAllDevelopers()                             │
│  │  ├─ getDeveloperById()                             │
│  │  └─ getDevelopersByTeam()                          │
│  └─ metricsService.js                                 │
│     ├─ getMetricsForDeveloper()                       │
│     ├─ getLatestMetricsForDeveloper()                │
│     └─ getAverageSocreForDeveloper()                 │
│                                                        │
│  Responsibilities:                                    │
│  • Core business logic                                │
│  • Data filtering and transformation                  │
│  • Calculations and aggregations                      │
│  • Data retrieval coordination                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         Data Access Layer                              │
│  (Utilities & Data - src/utils/ & src/data/)          │
│  ├─ dataLoader.js                                      │
│  │  └─ loadJsonData()                                 │
│  ├─ developers.json                                    │
│  └─ metrics.json                                       │
│                                                        │
│  Responsibilities:                                    │
│  • Load JSON mock data                                │
│  • (Future: Connect to database)                      │
│  • Parse and structure data                           │
└─────────────────────────────────────────────────────────┘
```

---

## Layer Breakdown

### 1. Routing Layer (`src/routes/`)

**Purpose:** Map HTTP requests to controllers

**Key Files:**
- `developerRoutes.js` - Developer endpoints
- `metricsRoutes.js` - Metrics endpoints

**Responsibilities:**
- Define URL paths
- Bind handlers to routes
- Specify HTTP methods (GET, POST, etc.)
- Handle route ordering for Express

**Key Principle:** Keep routes thin - only map URLs to handlers

**Example:**
```javascript
// src/routes/developerRoutes.js
router.get('/', getDevelopersHandler);
router.get('/:id', getDeveloperByIdHandler);
```

**Why This Layer?**
- Centralized endpoint definitions
- Easy to see all available endpoints
- Simple to add/modify routes
- Clean separation from business logic

### 2. Controllers Layer (`src/controllers/`)

**Purpose:** Handle HTTP request/response lifecycle

**Key Files:**
- `developerController.js` - Developer request handlers
- `metricsController.js` - Metrics request handlers

**Responsibilities:**
- Receive HTTP requests
- Validate input parameters
- Call appropriate service methods
- Format responses
- Handle errors with proper status codes

**Key Principle:** Keep controllers lean - they orchestrate, not execute logic

**Example Pattern:**
```javascript
function getDevelopersHandler(req, res) {
  try {
    // 1. Validate input (if needed)
    // 2. Call service
    const developers = getAllDevelopers();
    
    // 3. Format response
    res.status(200).json({
      success: true,
      data: developers,
      count: developers.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // 4. Handle errors
    res.status(500).json({
      success: false,
      message: 'Error message',
      error: error.message
    });
  }
}
```

**Why This Layer?**
- Separates HTTP concerns from business logic
- Consistent response formatting
- Centralized error handling
- Easy to test separately

### 3. Services Layer (`src/services/`)

**Purpose:** Contain core business logic and data operations

**Key Files:**
- `developerService.js` - Developer business logic
- `metricsService.js` - Metrics business logic

**Responsibilities:**
- Fetch data from data layer
- Filter and transform data
- Perform calculations
- Implement business rules
- Return processed data to controllers

**Key Principle:** Services have no knowledge of HTTP

**Example Pattern:**
```javascript
function getDevelopersByTeam(team) {
  const developers = loadJsonData('developers.json');
  return developers.filter(dev => dev.team === team);
}
```

**Why This Layer?**
- Reusable business logic (can be called from CLI, batch jobs, etc.)
- Easier to test (no HTTP concerns)
- Easy to swap implementations (JSON → Database)
- Single Responsibility Principle

### 4. Data Access Layer (`src/utils/` & `src/data/`)

**Purpose:** Load and provide access to data

**Key Files:**
- `dataLoader.js` - Centralized data loading utility
- `developers.json` - Mock developer data
- `metrics.json` - Mock metrics data

**Responsibilities:**
- Load data from sources
- Parse JSON files
- Provide consistent data interface
- Handle loading errors

**Key Principle:** All data access goes through dataLoader

**Example:**
```javascript
// In services
const developers = loadJsonData('developers.json');
```

**Why This Layer?**
- Single point for data access
- Easy to swap implementation later (JSON → MongoDB)
- Consistent error handling
- Testable

---

## Design Patterns

### 1. Middleware Pattern (Express)

Middleware intercepts requests and responses.

**Used For:**
- Request logging
- Error handling
- CORS headers
- JSON parsing

**How It Works:**
```
Request → loggerMiddleware → parseJSON → routes → response
```

**Files:**
- `src/middleware/loggerMiddleware.js`
- `src/middleware/errorMiddleware.js`

### 2. Repository Pattern

The `dataLoader.js` acts as a repository - a single interface for data access.

**Benefits:**
- Easy to swap implementations
- Centralized error handling
- Consistent data access

### 3. Dependency Injection

Services and controllers use functions passed to them (imported functions).

```javascript
// Controllers import and use services
import { getAllDevelopers } from '../services/developerService.js';

// This is dependency injection - the service is injected
const developers = getAllDevelopers();
```

### 4. Separation of Concerns

Each layer has one responsibility:
- Routes: URL mapping
- Controllers: HTTP handling
- Services: Business logic
- Data: Storage/retrieval

---

## Data Flow

### Example: GET /developers/:id

```
1. HTTP Request
   └─ GET http://localhost:3000/developers/DEV001

2. Express Routing
   └─ Matches route: GET /developers/:id
   └─ Calls: getDeveloperByIdHandler(req, res)

3. Controller Layer
   └─ Extracts ID from req.params: "DEV001"
   └─ Calls service: getDeveloperById("DEV001")

4. Service Layer
   └─ Loads JSON data via dataLoader
   └─ Filters: find developer with id === "DEV001"
   └─ Returns: Developer object

5. Back to Controller
   └─ Receives developer object
   └─ Formats response with success flag and timestamp
   └─ Sends 200 status code

6. Response
   └─ JSON with developer data and metadata
   └─ Client receives and processes
```

### Response Format

All responses follow this pattern:

**Success Response (200):**
```json
{
  "success": true,
  "data": { /* actual data */ },
  "timestamp": "2026-05-10T13:04:50.963Z"
}
```

**Error Response (404, 500, etc):**
```json
{
  "success": false,
  "message": "Error description",
  "timestamp": "2026-05-10T13:04:50.963Z"
}
```

---

## Best Practices Implemented

### 1. Error Handling
- Try-catch blocks in controllers
- Global error middleware
- Consistent error responses
- Logged errors for debugging

### 2. Logging
- Request logging middleware
- Response time tracking
- Timestamp on all responses
- Console logs for debugging

### 3. Code Organization
- Clear folder structure
- Logical file naming
- Related code in same folder
- Utilities in separate folder

### 4. Comments and Documentation
- Comments in every important file
- Function documentation
- Architecture explanation
- Usage examples

### 5. Configuration
- Environment-ready (PORT can be set via env var)
- Configurable CORS
- Default values for all settings
- .env.example provided

### 6. ES Modules
- Modern JavaScript syntax
- `import`/`export` instead of `require`
- Cleaner code
- Better for tree-shaking in future

---

## Extending the Application

### Adding a New Endpoint

**Example: Add GET /developers/role/:role**

**Step 1: Add Service** (`src/services/developerService.js`)
```javascript
function getDevelopersByRole(role) {
  const developers = loadJsonData('developers.json');
  return developers.filter(dev => dev.role.includes(role));
}
```

**Step 2: Add Controller** (`src/controllers/developerController.js`)
```javascript
function getDevelopersByRoleHandler(req, res) {
  try {
    const { role } = req.params;
    const developers = getDevelopersByRole(role);
    res.status(200).json({
      success: true,
      data: developers,
      count: developers.length,
      role: role,
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

**Step 3: Add Route** (`src/routes/developerRoutes.js`)
```javascript
import { getDevelopersByRoleHandler } from '../controllers/developerController.js';

router.get('/role/:role', getDevelopersByRoleHandler);
```

**Step 4: Test**
```
GET http://localhost:3000/developers/role/Frontend
```

### Switching from JSON to Database

**Step 1: Update dataLoader.js**
```javascript
// Replace JSON loading with database query
async function loadJsonData(collection) {
  // Connect to MongoDB or PostgreSQL
  const data = await db.collection(collection).find({}).toArray();
  return data;
}
```

**Step 2: Update Services** (may need async/await)
```javascript
async function getAllDevelopers() {
  const developers = await loadJsonData('developers');
  return developers;
}
```

**Step 3: Update Controllers** (if adding async)
```javascript
async function getDevelopersHandler(req, res) {
  try {
    const developers = await getAllDevelopers();
    // ... rest of code
  } catch (error) {
    // ... error handling
  }
}
```

### Adding Authentication

**Step 1: Create Auth Middleware** (`src/middleware/authMiddleware.js`)
```javascript
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
  // Verify token...
  next();
}
```

**Step 2: Apply to Routes** (`src/routes/developerRoutes.js`)
```javascript
router.use(authMiddleware); // Protect all developer routes
```

---

## Performance Considerations

### Current Performance
- Average response time: 15.8ms
- No database latency (JSON files)
- No caching overhead

### Future Optimizations
1. **Caching** - Cache frequently accessed data
2. **Pagination** - Limit result sets
3. **Indexing** - Index frequently queried fields
4. **Database** - Use optimized queries
5. **Clustering** - Scale horizontally

### Scalability Roadmap
1. **Small** (current) - JSON files, single server
2. **Medium** - Database, caching, load balancer
3. **Large** - Microservices, message queues, CDN

---

## Testing Strategy

### Unit Testing (Future)
- Test each service function in isolation
- Mock data inputs
- Verify outputs

### Integration Testing (Future)
- Test controller + service together
- Verify data flows correctly

### API Testing (Current)
- Manual endpoint testing
- See TEST-REPORT.md for results

---

## Deployment Considerations

### Prerequisites
- Node.js installed on server
- Environment variables configured
- Firewall allows port 3000

### Steps
1. Clone repository
2. Run `npm install`
3. Set `NODE_ENV=production`
4. Run `npm start`
5. Use reverse proxy (nginx) for port 80

### Environment Variables
```
PORT=3000
NODE_ENV=production
CORS_ORIGIN=yourdomain.com
```

---

## Maintenance

### Regular Tasks
- Monitor error logs
- Update dependencies
- Review response times
- Backup data

### Common Issues
- Out of memory - increase available RAM
- Slow responses - optimize queries or add caching
- High error rate - check logs and data integrity

---

## Architecture Principles

### 1. Separation of Concerns
Each layer handles one responsibility.

### 2. DRY (Don't Repeat Yourself)
Reusable functions in services, not duplicated in controllers.

### 3. Single Responsibility Principle
Each function does one thing well.

### 4. Open/Closed Principle
Easy to extend (new routes), hard to break (changes don't affect other layers).

### 5. Dependency Inversion
High-level modules don't depend on low-level modules; both depend on abstractions.

---

## Glossary

| Term | Definition |
|------|-----------|
| Route | URL path that maps to a controller |
| Controller | Function that handles HTTP request/response |
| Service | Function with business logic |
| Middleware | Function that runs before/after routes |
| Handler | Function that processes a request |
| Request | HTTP request from client |
| Response | HTTP response sent to client |
| Endpoint | Complete URL path (e.g., GET /developers) |
| Status Code | HTTP response code (200, 404, 500, etc.) |

---

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [RESTful API Design](https://restfulapi.net/)
- [Three-Tier Architecture](https://en.wikipedia.org/wiki/Multitier_architecture)

---

**Created:** May 2026  
**Project:** Developer Productivity MVP  
**Architecture Version:** 1.0
