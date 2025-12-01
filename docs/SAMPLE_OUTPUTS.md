# Invoice Due Amount API - Sample Outputs

## Successful Response (200 OK)

### Request
```
GET /api/invoices/123/dueamount?api_key=your-api-key-here
```

### Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "invoice_id": 123,
    "amount_due": 150.75,
    "is_paid": false,
    "total_amount": 150.75,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Paid Invoice Example
```json
{
  "success": true,
  "statusCode": 200,
  "message": "OK",
  "data": {
    "invoice_id": 124,
    "amount_due": 0.00,
    "is_paid": true,
    "total_amount": 299.99,
    "created_at": "2024-01-10T14:20:00.000Z",
    "updated_at": "2024-01-12T09:15:00.000Z"
  }
}
```

## Error Responses

### 401 Unauthorized - Missing API Key

### Request
```
GET /api/invoices/123/dueamount
```

### Response
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized",
  "data": {
    "name": "Unauthorized",
    "message": "Your request was made with invalid or missing API key.",
    "code": 0,
    "status": 401
  }
}
```

### 401 Unauthorized - Invalid API Key

### Request
```
GET /api/invoices/123/dueamount?api_key=invalid-key
```

### Response
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized",
  "data": {
    "name": "Unauthorized",
    "message": "Your request was made with invalid or missing API key.",
    "code": 0,
    "status": 401
  }
}
```

### 404 Not Found - Invoice Not Found

### Request
```
GET /api/invoices/999999/dueamount?api_key=valid-api-key
```

### Response
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Not Found",
  "data": {
    "name": "NotFound",
    "message": "Invoice not found",
    "code": 0,
    "status": 404
  }
}
```

### 400 Bad Request - Invalid Invoice ID

### Request
```
GET /api/invoices/invalid-id/dueamount?api_key=valid-api-key
```

### Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Bad Request",
  "data": {
    "name": "BadRequest",
    "message": "Invalid invoice ID provided",
    "code": 0,
    "status": 400
  }
}
```

### 405 Method Not Allowed

### Request
```
POST /api/invoices/123/dueamount?api_key=valid-api-key
```

### Response
```json
{
  "success": false,
  "statusCode": 405,
  "message": "Method not allowed",
  "data": {
    "name": "MethodNotAllowed",
    "message": "Only GET requests are allowed for this endpoint",
    "code": 0,
    "status": 405
  }
}
```

### 500 Internal Server Error

### Response
```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal Server Error",
  "data": {
    "name": "InternalServerError",
    "message": "An unexpected error occurred while processing your request",
    "code": 0,
    "status": 500
  }
}
```

# Purchase Orders API - Sample Outputs

## Successful Response (200 OK)

### Request
```
GET /api/purchaseorders?api_key=your-api-key&page=1&pagesize=10
```

### Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "OK",
  "purchaseOrderListData": [
    {
      "id": 1,
      "item_name": "iPhone 15 Pro Screen",
      "manufacturer": "Apple",
      "purchase_order_status": "pending",
      "po_order_id": "PO-2024-001",
      "supplier": "TechParts Inc.",
      "sku": "IPH15P-SCR-001",
      "created_date": "2024-01-15T10:00:00Z",
      "createdd_date": "2024-01-15T10:00:00Z"
    },
    {
      "id": 2,
      "item_name": "Samsung S24 Battery",
      "manufacturer": "Samsung",
      "purchase_order_status": "approved",
      "po_order_id": "PO-2024-002",
      "supplier": "MobileParts Ltd.",
      "sku": "SAM-S24-BAT-001",
      "created_date": "2024-01-16T14:30:00Z",
      "createdd_date": "2024-01-16T14:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalItems": 2,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### With Filters Example
```json
{
  "success": true,
  "statusCode": 200,
  "message": "OK",
  "purchaseOrderListData": [
    {
      "id": 1,
      "item_name": "iPhone 15 Pro Screen",
      "manufacturer": "Apple",
      "purchase_order_status": "pending",
      "po_order_id": "PO-2024-001",
      "supplier": "TechParts Inc.",
      "sku": "IPH15P-SCR-001",
      "created_date": "2024-01-15T10:00:00Z",
      "createdd_date": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalItems": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

## Error Responses

### 401 Unauthorized - Missing API Key

### Request
```
GET /api/purchaseorders?page=1&pagesize=10
```

### Response
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized",
  "data": {
    "name": "Unauthorized",
    "message": "Your request was made with invalid or missing API key.",
    "code": 0,
    "status": 401
  }
}
```

### 401 Unauthorized - Invalid API Key

### Request
```
GET /api/purchaseorders?api_key=invalid-key&page=1&pagesize=10
```

### Response
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized",
  "data": {
    "name": "Unauthorized",
    "message": "Your request was made with invalid or missing API key.",
    "code": 0,
    "status": 401
  }
}
```

### 400 Bad Request - Missing Page Parameter

### Request
```
GET /api/purchaseorders?api_key=valid-api-key&pagesize=10
```

### Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Bad Request",
  "data": {
    "name": "BadRequest",
    "message": "Invalid or missing page parameter",
    "code": 0,
    "status": 400
  }
}
```

### 400 Bad Request - Invalid Page Parameter

### Request
```
GET /api/purchaseorders?api_key=valid-api-key&page=invalid&pagesize=10
```

### Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Bad Request",
  "data": {
    "name": "BadRequest",
    "message": "Invalid or missing page parameter",
    "code": 0,
    "status": 400
  }
}
```

### 400 Bad Request - Missing PageSize Parameter

### Request
```
GET /api/purchaseorders?api_key=valid-api-key&page=1
```

### Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Bad Request",
  "data": {
    "name": "BadRequest",
    "message": "Invalid or missing pagesize parameter",
    "code": 0,
    "status": 400
  }
}
```

### 405 Method Not Allowed

### Request
```
POST /api/purchaseorders?api_key=valid-api-key&page=1&pagesize=10
```

### Response
```json
{
  "success": false,
  "statusCode": 405,
  "message": "Method not allowed",
  "data": {
    "name": "MethodNotAllowed",
    "message": "Only GET requests are allowed for this endpoint",
    "code": 0,
    "status": 405
  }
}
```

### 500 Internal Server Error

### Response
```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal Server Error",
  "data": {
    "name": "InternalServerError",
    "message": "An unexpected error occurred while processing your request",
    "code": 0,
    "status": 500
  }
}
```

## Usage Examples

### Using curl
```bash
# Successful request
curl -X GET "http://localhost:3000/api/purchaseorders?api_key=your-api-key&page=1&pagesize=10" \
  -H "Content-Type: application/json"

# With filters
curl -X GET "http://localhost:3000/api/purchaseorders?api_key=your-api-key&page=1&pagesize=10&manufacturer=Apple&status=pending" \
  -H "Content-Type: application/json"

# With API key in header
curl -X GET "http://localhost:3000/api/purchaseorders?page=1&pagesize=10" \
  -H "x-api-key: your-api-key" \
  -H "Content-Type: application/json"
```

### Using JavaScript/fetch
```javascript
// Successful request
const response = await fetch('/api/purchaseorders?api_key=your-api-key&page=1&pagesize=10');
const data = await response.json();

if (data.success) {
  console.log('Purchase orders:', data.purchaseOrderListData);
  console.log('Pagination:', data.pagination);
} else {
  console.error('Error:', data.message);
}

// With filters
const filteredResponse = await fetch('/api/purchaseorders?api_key=your-api-key&page=1&pagesize=10&manufacturer=Apple');
const filteredData = await filteredResponse.json();
```

### Using Python/requests
```python
import requests

# Successful request
response = requests.get(
    'http://localhost:3000/api/purchaseorders',
    params={
        'api_key': 'your-api-key',
        'page': 1,
        'pagesize': 10
    }
)

data = response.json()
if data['success']:
    print(f"Purchase orders: {data['purchaseOrderListData']}")
    print(f"Pagination: {data['pagination']}")
else:
    print(f"Error: {data['message']}")

# With filters
filtered_response = requests.get(
    'http://localhost:3000/api/purchaseorders',
    params={
        'api_key': 'your-api-key',
        'page': 1,
        'pagesize': 10,
        'manufacturer': 'Apple',
        'purchase_order_status': 'pending'
    }
)
```

## Usage Examples

### Using curl
```bash
# Successful request
curl -X GET "http://localhost:3000/api/invoices/123/dueamount?api_key=your-api-key" \
  -H "Content-Type: application/json"

# With API key in header
curl -X GET "http://localhost:3000/api/invoices/123/dueamount" \
  -H "x-api-key: your-api-key" \
  -H "Content-Type: application/json"
```

### Using JavaScript/fetch
```javascript
// Successful request
const response = await fetch('/api/invoices/123/dueamount?api_key=your-api-key');
const data = await response.json();

if (data.success) {
  console.log('Amount due:', data.data.amount_due);
  console.log('Is paid:', data.data.is_paid);
} else {
  console.error('Error:', data.message);
}
```

### Using Python/requests
```python
import requests

response = requests.get(
    'http://localhost:3000/api/invoices/123/dueamount',
    params={'api_key': 'your-api-key'}
)

data = response.json()
if data['success']:
    print(f"Amount due: {data['data']['amount_due']}")
    print(f"Is paid: {data['data']['is_paid']}")
else:
    print(f"Error: {data['message']}")
