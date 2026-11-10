# Database Architecture & Mongoose Data Models

### Database Engine: MongoDB (Mongoose ORM)
Database Name: `mfef_private_wealth`

---

### Collection 1: `users`
Stores authenticated partners, advisors, and administrators.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Primary Key | MongoDB Unique Identifier |
| `name` | `String` | Required, Max 100 | Full name & credentials (e.g. CFA, TEP) |
| `email` | `String` | Required, Unique, Lowercase, Indexed | Partner login email |
| `passwordHash` | `String` | Required, Hidden by default (`select: false`) | Bcrypt salt=12 hashed password |
| `role` | `String` | Enum: `SUPER_ADMIN`, `MANAGING_PARTNER`, `SENIOR_ADVISOR` | Role-Based Access Level |
| `title` | `String` | Default: `Private Wealth Partner` | Formal corporate title |
| `isActive` | `Boolean` | Default: `true` | Account active status |
| `lastLogin` | `Date` | Optional | Timestamp of last authenticated session |

---

### Collection 2: `inquiries`
Stores prospective consultation bookings, urgent callback requests, and CRM workflow records.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Primary Key | Unique lead ID |
| `referenceNumber` | `String` | Required, Unique, Indexed | Formatted tracking code (`MFEF-2026-XXXX`) |
| `inquiryType` | `String` | Enum: `CONSULTATION`, `CALLBACK`, `GENERAL` | Channel categorization |
| `status` | `String` | Enum: `NEW`, `CONTACTED`, `IN_REVIEW`, `CONVERTED`, `ARCHIVED` | CRM workflow status |
| `fullName` | `String` | Required, Trimmed | Prospect full name |
| `email` | `String` | Required, Lowercase | Client contact email |
| `phone` | `String` | Required | Client contact phone |
| `estimatedPortfolioTier` | `String` | Enum: `$1M-$5M`, `$5M-$20M`, `$20M+`, `CONFIDENTIAL` | Investable balance sheet bracket |
| `serviceOfInterest` | `String` | Indexed | Requested advisory practice |
| `preferredMode` | `String` | Enum: `IN_PERSON`, `SECURE_VIDEO`, `TELEPHONE` | Preferred meeting protocol |
| `preferredDate` | `Date` | Optional | Scheduled date |
| `assignedAdvisor` | `ObjectId` | Ref: `User` | Managing partner assigned to this lead |
| `internalNotes` | `[Subdocument]` | Array of notes | Confidential partner note thread |
| `ipAddress` | `String` | Audit field | Submitting IP address |

---

### Collection 3: `serviceofferings`
Stores active practice areas, deliverables, and minimum mandate thresholds.

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `slug` | `String` | Required, Unique, Indexed | URL path parameter |
| `title` | `String` | Required | Formal practice title |
| `tagline` | `String` | Required | Value proposition summary |
| `category` | `String` | Required | Practice grouping |
| `summary` | `String` | Required | Short overview |
| `detailedOverview` | `String` | Required | Institutional mandate explanation |
| `keyDeliverables` | `[String]` | Array | Fiduciary deliverables list |
| `minimumThreshold` | `String` | String | Minimum capital threshold |
| `displayOrder` | `Number` | Default 0 | UI sorting order |
| `isActive` | `Boolean` | Indexed, Default `true` | Public visibility flag |
