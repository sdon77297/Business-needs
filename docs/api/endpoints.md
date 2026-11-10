# REST API Specification (v1)

### Base URL: `/api/v1`

---

### Authentication (`/api/v1/auth`)

#### `POST /login`
Authenticates partner credentials and issues an `HttpOnly` cookie.
* **Access**: Public (Rate-limited: 10 attempts / 15 mins)
* **Payload**:
  ```json
  {
    "email": "admin@mfefwealth.com",
    "password": "MFEF_Wealth_2026!"
  }
  ```
* **Response `(200 OK)`**:
  ```json
  {
    "success": true,
    "message": "Authentication successful.",
    "token": "eyJhbGciOi...",
    "user": {
      "id": "673f...",
      "name": "Alexander Sterling, CFA",
      "email": "admin@mfefwealth.com",
      "role": "SUPER_ADMIN",
      "title": "Senior Managing Partner & CIO"
    }
  }
  ```

#### `POST /logout`
Clears session cookies and invalidates client session.
* **Access**: Authenticated

#### `GET /me`
Retrieves currently authenticated advisor's profile.
* **Access**: Authenticated

---

### Client Concierge & Inquiries (`/api/v1/inquiries`)

#### `POST /consultation`
Registers a bespoke private wealth consultation booking.
* **Access**: Public (Rate-limited: 20 per 15 mins)
* **Payload**:
  ```json
  {
    "fullName": "Sir Julian Montgomery",
    "email": "j.montgomery@montgomeryholdings.co.uk",
    "phone": "+44 7700 900142",
    "countryOrCity": "London, UK",
    "estimatedPortfolioTier": "$20M+",
    "serviceOfInterest": "Family Office Advisory & Succession Planning",
    "preferredMode": "IN_PERSON",
    "preferredDate": "2026-11-15",
    "preferredTimeSlot": "14:00 - 15:30 GMT",
    "message": "Confidential succession review."
  }
  ```
* **Response `(201 Created)`**:
  ```json
  {
    "success": true,
    "referenceNumber": "MFEF-2026-9A1F",
    "data": { ... }
  }
  ```

#### `POST /callback`
Dispatches an urgent direct partner callback request.
* **Access**: Public (Rate-limited)
* **Payload**:
  ```json
  {
    "fullName": "Dr. Robert Hastings",
    "phone": "+1 (312) 555-0188",
    "callbackWindow": "IMMEDIATE",
    "serviceOfInterest": "Discretionary Private Wealth Management"
  }
  ```
* **Response `(201 Created)`**:
  ```json
  {
    "success": true,
    "referenceNumber": "CALL-2026-7B42"
  }
  ```

#### `GET /track`
Looks up inquiry verification status by reference number.
* **Query Parameters**: `referenceNumber=MFEF-2026-XXXX`
* **Response `(200 OK)`**:
  ```json
  {
    "success": true,
    "inquiry": {
      "referenceNumber": "MFEF-2026-9A1F",
      "status": "NEW",
      "fullName": "Sir Julian Montgomery",
      "serviceOfInterest": "Family Office Advisory & Succession Planning"
    }
  }
  ```

---

### Executive Admin CRM (`/api/v1/admin`)

#### `GET /dashboard/stats`
Aggregates real-time pipeline KPIs (Total leads, new, in-review, converted, conversion rate %).
* **Access**: Authenticated

#### `GET /inquiries`
Returns paginated, searchable, and filtered leads.
* **Query Parameters**: `page=1`, `limit=10`, `status=NEW`, `inquiryType=CONSULTATION`, `search=Montgomery`
* **Access**: Authenticated

#### `PATCH /inquiries/:id/status`
Transitions inquiry status and logs system audit entry.
* **Payload**: `{ "status": "CONTACTED" }`
* **Access**: Authenticated

#### `POST /inquiries/:id/notes`
Appends a confidential internal partner note.
* **Payload**: `{ "content": "Completed discovery call. Tax review pending." }`
* **Access**: Authenticated

#### `GET /inquiries/export/csv`
Streams filtered leads as a downloadable CSV spreadsheet.
* **Access**: Authenticated
