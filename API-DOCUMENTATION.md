# API Documentation

## Overview

This document provides detailed API specifications for the Developer Productivity MVP backend.

## Base URL

```
http://localhost:3000
```

## Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": { /* error details */ },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## Status Codes

- `200 OK` - Request successful
- `400 Bad Request` - Invalid parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Endpoints Reference

### 1. Developer Endpoints

#### 1.1 Get All Developers

**Request:**
```
GET /developers
```

**Description:** Retrieve a list of all developers in the system.

**Parameters:** None

**Response (200 OK):**
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
    },
    {
      "id": "DEV002",
      "name": "Bob Smith",
      "email": "bob.smith@company.com",
      "role": "Backend Developer",
      "team": "Backend",
      "startDate": "2021-06-01",
      "status": "active"
    }
  ],
  "count": 5,
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

**Notes:**
- Returns all developers regardless of status
- Results include contact information and team assignment
- Useful for building lists and team views

---

#### 1.2 Get Specific Developer

**Request:**
```
GET /developers/:id
```

**Description:** Retrieve detailed information about a specific developer.

**Parameters:**
- `id` (path) - Developer ID (e.g., DEV001)

**Examples:**
```
GET /developers/DEV001
GET /developers/DEV005
```

**Response (200 OK):**
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

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Developer with ID DEV999 not found"
}
```

**Notes:**
- Returns single developer object
- Returns 404 if developer doesn't exist

---

#### 1.3 Get Developers by Team

**Request:**
```
GET /developers/team/:team
```

**Description:** Retrieve all developers assigned to a specific team.

**Parameters:**
- `team` (path) - Team name (e.g., Frontend, Backend, Infrastructure)

**Examples:**
```
GET /developers/team/Frontend
GET /developers/team/Backend
GET /developers/team/Full Stack
```

**Response (200 OK):**
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
  "count": 1,
  "team": "Frontend",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

**Notes:**
- Case-sensitive team names
- Returns empty array if no developers in team
- Useful for team-based reporting

---

#### 1.4 Get Active Developer Count

**Request:**
```
GET /developers/stats/active
```

**Description:** Get the total count of active developers.

**Parameters:** None

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "activeDeveloperCount": 5
  },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

**Notes:**
- Only counts developers with status="active"
- Useful for dashboard statistics

---

### 2. Metrics Endpoints

#### 2.1 Get All Metrics for Developer

**Request:**
```
GET /metrics/:developerId
```

**Description:** Retrieve all historical metrics for a specific developer.

**Parameters:**
- `developerId` (path) - Developer ID (e.g., DEV001)

**Examples:**
```
GET /metrics/DEV001
GET /metrics/DEV003
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "developerId": "DEV001",
      "month": "2024-12",
      "tasksCompleted": 24,
      "codeReviewsCompleted": 18,
      "bugsFiled": 5,
      "bugsResolved": 8,
      "commitCount": 52,
      "pullRequestsCreated": 12,
      "pullRequestsReviewed": 28,
      "avgResponseTime": 2.5,
      "productivityScore": 92
    },
    {
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
    }
  ],
  "count": 2,
  "developerId": "DEV001",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

**Notes:**
- Returns array of metrics across all months
- Empty array if no metrics exist
- Sorted chronologically (oldest first)

---

#### 2.2 Get Latest Metrics

**Request:**
```
GET /metrics/:developerId/latest
```

**Description:** Retrieve the most recent metrics for a developer.

**Parameters:**
- `developerId` (path) - Developer ID

**Examples:**
```
GET /metrics/DEV001/latest
GET /metrics/DEV005/latest
```

**Response (200 OK):**
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

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "No metrics found for developer DEV999"
}
```

**Notes:**
- Returns single metrics object (most recent)
- Useful for current performance dashboard

---

#### 2.3 Get Metrics for Specific Month

**Request:**
```
GET /metrics/:developerId/:month
```

**Description:** Retrieve metrics for a developer in a specific month.

**Parameters:**
- `developerId` (path) - Developer ID
- `month` (path) - Month in YYYY-MM format (e.g., 2025-01)

**Examples:**
```
GET /metrics/DEV001/2025-01
GET /metrics/DEV003/2024-12
```

**Response (200 OK):**
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
  "month": "2025-01",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

**Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Month must be in YYYY-MM format (e.g., 2025-01)"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "No metrics found for developer DEV001 in month 2025-03"
}
```

**Notes:**
- Month format is strict: YYYY-MM
- January is 01, December is 12

---

#### 2.4 Get Average Productivity Score

**Request:**
```
GET /metrics/:developerId/average-score
```

**Description:** Calculate average productivity score for a developer across all time periods.

**Parameters:**
- `developerId` (path) - Developer ID

**Examples:**
```
GET /metrics/DEV001/average-score
GET /metrics/DEV004/average-score
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "developerId": "DEV001",
    "averageProductivityScore": 93
  },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

**Notes:**
- Calculated by averaging all productivity scores
- Rounded to nearest integer
- Returns 0 if no metrics exist

---

#### 2.5 Get Aggregated Metrics

**Request:**
```
GET /metrics/aggregated/all
```

**Description:** Retrieve aggregated statistics across all developers.

**Parameters:** None

**Response (200 OK):**
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

**Notes:**
- Aggregates data from all developers and all time periods
- Useful for org-level dashboards and reporting

---

### 3. Health Check

#### 3.1 Health Check Endpoint

**Request:**
```
GET /health
```

**Description:** Simple endpoint to verify the API is running.

**Parameters:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Developer Productivity MVP API is running",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

**Notes:**
- Always returns 200 if server is running
- Useful for monitoring and load balancer checks

---

## Error Handling

### Common Errors

**Invalid Developer ID (404):**
```json
{
  "success": false,
  "message": "Developer with ID DEV999 not found"
}
```

**Invalid Month Format (400):**
```json
{
  "success": false,
  "message": "Month must be in YYYY-MM format (e.g., 2025-01)"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "message": "Failed to retrieve developers",
  "error": "Error message details"
}
```

**Route Not Found (404):**
```json
{
  "success": false,
  "message": "Route not found: GET /invalid/route"
}
```

---

## Data Models

### Developer Object

```json
{
  "id": "string",           // Unique identifier (DEV001, DEV002, etc.)
  "name": "string",         // Full name
  "email": "string",        // Email address
  "role": "string",         // Job title
  "team": "string",         // Team assignment
  "startDate": "string",    // Start date (YYYY-MM-DD format)
  "status": "string"        // "active", "inactive", etc.
}
```

### Metrics Object

```json
{
  "developerId": "string",           // Developer ID
  "month": "string",                 // YYYY-MM format
  "tasksCompleted": "number",        // Number of completed tasks
  "codeReviewsCompleted": "number",  // Code reviews done
  "bugsFiled": "number",             // Bugs reported
  "bugsResolved": "number",          // Bugs fixed
  "commitCount": "number",           // Git commits
  "pullRequestsCreated": "number",   // PRs created
  "pullRequestsReviewed": "number",  // PRs reviewed
  "avgResponseTime": "number",       // Avg response time (hours)
  "productivityScore": "number"      // Overall score (0-100)
}
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. Future versions will include:
- API key authentication
- Rate limiting per developer/API key
- Usage tracking

---

## Versioning

API is currently at v1.0.0. Future updates will use versioning:
```
/v1/developers
/v2/developers
```

---

## Change Log

### Version 1.0.0 (January 2025)
- Initial API release
- Developer endpoints
- Metrics endpoints
- Health check endpoint

