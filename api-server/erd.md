# 📦 Test_School Platform - Database Design (MongoDB)

## 1. users
Stores all platform users (Admin, Student, Supervisor).

| Field            | Type           | Description |
|------------------|---------------|-------------|
| _id              | ObjectId      | Primary key |
| fullName         | String        | User's full name |
| email            | String (unique) | Email address |
| password         | String (hashed) | Hashed with bcrypt |
| role             | String (enum: 'admin', 'student', 'supervisor') | User role |
| isVerified       | Boolean       | Email/OTP verification status |
| createdAt        | Date          | Auto timestamp |
| updatedAt        | Date          | Auto timestamp |

---

## 2. otp_codes
Stores OTPs for email or SMS verification.

| Field     | Type       | Description |
|-----------|-----------|-------------|
| _id       | ObjectId  | Primary key |
| userId    | ObjectId (ref: users) | Linked user |
| code      | String    | OTP code |
| type      | String (enum: 'email', 'sms') | Verification type |
| expiresAt | Date      | Expiration time |
| createdAt | Date      | Auto timestamp |

---

## 3. questions
Stores the question pool categorized by competency and level.

| Field          | Type        | Description |
|----------------|------------|-------------|
| _id            | ObjectId   | Primary key |
| competency     | String     | E.g., "Data Analysis", "Cybersecurity" |
| level          | String (enum: 'A1','A2','B1','B2','C1','C2') | Question level |
| questionText   | String     | Question text |
| options        | [String]   | Multiple choice options |
| correctAnswer  | String     | Correct option |
| createdBy      | ObjectId (ref: users) | Admin who added it |
| createdAt      | Date       | Auto timestamp |
| updatedAt      | Date       | Auto timestamp |

---

## 4. exam_attempts
Stores each exam attempt per user, step-by-step.

| Field         | Type        | Description |
|---------------|------------|-------------|
| _id           | ObjectId   | Primary key |
| userId        | ObjectId (ref: users) | User taking the test |
| step          | Number (1, 2, 3) | Which exam step |
| questions     | [Object]   | List of question IDs with selected answers |
| ├── questionId| ObjectId (ref: questions) | Linked question |
| ├── selected  | String     | User's answer |
| score         | Number     | Percentage score |
| passedLevel   | String     | Level achieved in this step |
| status        | String (enum: 'completed', 'failed') | Attempt status |
| startedAt     | Date       | Start time |
| endedAt       | Date       | End time |
| createdAt     | Date       | Auto timestamp |

---

## 5. certificates
Stores generated certificates for users.

| Field         | Type        | Description |
|---------------|------------|-------------|
| _id           | ObjectId   | Primary key |
| userId        | ObjectId (ref: users) | Certificate owner |
| level         | String (enum: 'A1','A2','B1','B2','C1','C2') | Certification level |
| pdfUrl        | String     | Path to generated PDF |
| issuedAt      | Date       | Issue date |
| sentByEmail   | Boolean    | Whether email sent |
| createdAt     | Date       | Auto timestamp |

---

## 6. settings (optional)
Stores configurable platform settings.

| Field     | Type    | Description |
|-----------|--------|-------------|
| _id       | ObjectId | Primary key |
| key       | String | Setting key |
| value     | Mixed  | Setting value |
| updatedAt | Date   | Last update |

---

## 📌 Relationships
- `users` → `otp_codes` (1-to-many)
- `users` → `exam_attempts` (1-to-many)
- `users` → `certificates` (1-to-many)
- `questions` → `exam_attempts` (many-to-many via embedded array)
- `users` (admin role) → `questions` (1-to-many)

---

## 🛠 Indexing Plan
- `users.email` → unique index
- `otp_codes.userId` + `otp_codes.expiresAt` → compound index
- `questions.level` + `questions.competency` → compound index for fast retrieval
- `exam_attempts.userId` + `exam_attempts.step` → compound index
- `certificates.userId` → index for quick lookup
