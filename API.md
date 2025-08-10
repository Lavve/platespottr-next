# API Documentation

## Rate Limiting

All API endpoints are subject to rate limiting to prevent abuse and ensure fair usage. Each endpoint has its own rate limit that operates independently.

### Rate Limit Response

When a rate limit is exceeded, the API returns:

**Status Code:** `429 Too Many Requests`

**Response Body:**

```json
{
  "error": "Too many requests. Please try again later."
}
```

### Rate Limits by Endpoint

| Endpoint              | Method | Rate Limit  | Time Window |
| --------------------- | ------ | ----------- | ----------- |
| Create User           | POST   | 1 request   | per minute  |
| Delete User           | DELETE | 1 request   | per minute  |
| Get User              | GET    | 30 requests | per minute  |
| Login                 | POST   | 5 requests  | per minute  |
| Logout                | POST   | 10 requests | per minute  |
| Add Friend            | POST   | 10 requests | per minute  |
| Confirm Friend        | POST   | 10 requests | per minute  |
| Remove Friend         | DELETE | 10 requests | per minute  |
| Get Friends           | GET    | 30 requests | per minute  |
| Get Friend Status     | GET    | 30 requests | per minute  |
| Get Incoming Requests | GET    | 30 requests | per minute  |
| Get Outgoing Requests | GET    | 30 requests | per minute  |
| Add Number            | POST   | 30 requests | per minute  |
| Remove Number         | DELETE | 20 requests | per minute  |
| Save settings         | POST   | 5 requests  | per minute  |
| Get settings          | GET    | 5 requests  | per minute  |

### Best Practices

1. **Batch Operations**: Combine multiple operations when possible
2. **Cache Responses**: Cache GET requests to reduce API calls
3. **Graceful Degradation**: Provide offline functionality when rate limited

---

## User Management

### Create User

- **Path:** `/api/user.php`
- **Method:** POST
- **Headers:** `Content-Type: application/json`
- **Body:** `{"name": "string", "pin": "string"}`
- **Response:** `{"success": true, "user": {"id": "uuid", "name": "string", "slug": "string"}}`
- **Rate Limit:** 1 request per minute

### Get User (Basic)

- **Path:** `/api/user.php`
- **Method:** GET
- **Query Params:** `userId=uuid` OR `slug=string`
- **Response:** `{"success": true, "user": {"id": "uuid", "name": "string", "slug": "string", "member_since": "timestamp"}}`
- **Rate Limit:** 30 requests per minute

### Get User (Detailed)

- **Path:** `/api/user.php`
- **Method:** GET
- **Query Params:** `userId=uuid&details=true` OR `slug=string&details=true`
- **Response:** `{"success": true, "user": {"id": "uuid", "name": "string", "slug": "string", "member_since": "timestamp", "numbers": ["timestamp"], "friends": [{"id": "uuid", "name": "string", "slug": "string", "member_since": "timestamp", "status": "string", "friends_since": "timestamp", "requested_at": "timestamp", "number_count": 0}]}}`
- **Rate Limit:** 30 requests per minute

### Delete User

- **Path:** `/api/user.php`
- **Method:** DELETE
- **Headers:** `Content-Type: application/json`
- **Body:** `{"userId": "uuid", "pin": "string"}`
- **Response:** `{"success": true, "message": "string"}`
- **Rate Limit:** 1 request per minute

## Authentication

### Login

- **Path:** `/api/login.php`
- **Method:** POST
- **Headers:** `Content-Type: application/json`
- **Body:** `{"name": "string", "pin": "string"}`
- **Response:** `{"success": true, "user": {"id": "uuid", "name": "string", "slug": "string", "member_since": "timestamp"}}`
- **Rate Limit:** 5 requests per minute

### Logout

- **Path:** `/api/logout.php`
- **Method:** POST
- **Headers:** `Content-Type: application/json`
- **Body:** `{"userId": "uuid"}`
- **Response:** `{"success": true, "message": "Successfully logged out"}`
- **Rate Limit:** 10 requests per minute

## Friend Management

### Add Friend Request

- **Path:** `/api/add-friend.php`
- **Method:** POST
- **Headers:** `Content-Type: application/json`
- **Body:** `{"requesterId": "uuid", "receiverSlug": "string"}`
- **Response:** `{"success": true, "message": "Friend request sent successfully"}`
- **Rate Limit:** 10 requests per minute

### Confirm Friend Request

- **Path:** `/api/confirm-friend.php`
- **Method:** POST
- **Headers:** `Content-Type: application/json`
- **Body:** `{"receiverId": "uuid", "requesterId": "uuid"}`
- **Response:** `{"success": true, "message": "Friend request confirmed successfully"}`
- **Rate Limit:** 10 requests per minute

### Get Friend List

- **Path:** `/api/friends.php`
- **Method:** GET
- **Query Params:** `userId=uuid`
- **Response:** `{"success": true, "friends": [{"id": "uuid", "name": "string", "slug": "string", "member_since": "timestamp", "status": "string", "friends_since": "timestamp", "requested_at": "timestamp", "number_count": 0}]}`
- **Rate Limit:** 30 requests per minute

### Get Friend Status

- **Path:** `/api/friend-status.php`
- **Method:** GET
- **Query Params:** `userId=uuid&otherUserId=uuid`
- **Response:** `{"success": true, "status": "string"}`
- **Rate Limit:** 30 requests per minute

### Remove Friend

- **Path:** `/api/friend.php`
- **Method:** DELETE
- **Headers:** `Content-Type: application/json`
- **Body:** `{"userId": "uuid", "otherUserSlug": "string"}`
- **Response:** `{"success": true, "message": "Friend relationship removed successfully"}`
- **Rate Limit:** 10 requests per minute

### Get Incoming Friend Requests

- **Path:** `/api/friend-requests/incoming.php`
- **Method:** GET
- **Query Params:** `userId=uuid`
- **Response:** `{"success": true, "incoming_requests": [{"id": "uuid", "name": "string", "slug": "string", "member_since": "timestamp", "requested_at": "timestamp", "number_count": 0}]}`
- **Rate Limit:** 30 requests per minute

### Get Outgoing Friend Requests

- **Path:** `/api/friend-requests/outgoing.php`
- **Method:** GET
- **Query Params:** `userId=uuid`
- **Response:** `{"success": true, "outgoing_requests": [{"id": "uuid", "name": "string", "slug": "string", "member_since": "timestamp", "requested_at": "timestamp", "number_count": 0}]}`
- **Rate Limit:** 30 requests per minute

## User Numbers

### Add Number

- **Path:** `/api/user-numbers.php`
- **Method:** POST
- **Headers:** `Content-Type: application/json`
- **Body:** `{"userId": "uuid"}`
- **Response:** `{"success": true, "message": "Number added successfully"}`
- **Rate Limit:** 30 requests per minute

### Remove Last Number

- **Path:** `/api/user-numbers.php`
- **Method:** DELETE
- **Headers:** `Content-Type: application/json`
- **Body:** `{"userId": "uuid"}`
- **Response:** `{"success": true, "message": "Last number removed successfully"}`
- **Rate Limit:** 20 requests per minute

### Remove All Numbers

- **Path:** `/api/user-numbers.php`
- **Method:** DELETE
- **Headers:** `Content-Type: application/json`
- **Body:** `{"userId": "uuid", "removeAll": true}`
- **Response:** `{"success": true, "message": "All numbers removed successfully"}`
- **Rate Limit:** 20 requests per minute

## Settings API

### GET /api/settings

Gets the user settings

**Parameters:**

- `user_id` (query parameter) - Användar-ID

**Response:**

```json
{
  "success": true,
  "settings": {
    "theme": "dark",
    "language": "sv",
    "country": "s",
    "themeChoice": "dark",
    "initialRulesDialogOpen": true,
    "supressedInstallAt": 1234567890,
    "vibrate": "on",
    "latlang": "off",
    "installedVersion": "1.0.0"
  },
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-16T14:45:00.000Z"
}
```

### POST /api/settings

Saves the user settings

**Body:**

```json
{
  "user_id": "user-uuid-here",
  "settings": "{\"theme\":\"dark\",\"language\":\"sv\",\"country\":\"s\"}"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Settings saved successfully"
}
```

**Error Responses:**

```json
{
  "success": false,
  "error": "Missing required field: user_id"
}
```

```json
{
  "success": false,
  "error": "Invalid JSON in settings field"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "error": "Missing required fields: name"
}
```

### 401 Unauthorized

```json
{
  "error": "Invalid credentials"
}
```

### 404 Not Found

```json
{
  "error": "User not found"
}
```

### 405 Method Not Allowed

```json
{
  "error": "Method not allowed"
}
```

### 429 Too Many Requests

```json
{
  "error": "Too many requests. Please try again later."
}
```

### 500 Internal Server Error

```json
{
  "error": "Database error occurred"
}
```

## Data Types

- **UUID:** `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- **Timestamp:** `YYYY-MM-DDTHH:MM:SS.sssZ` (ISO 8601 format)
- **Slug:** `adjective-noun-verb` (Swedish words, supports åäö)
- **Name:** Letters, spaces, hyphens, Swedish characters (åäöÅÄÖ)
- **Pin:** Four integers (I.E. 1234)
