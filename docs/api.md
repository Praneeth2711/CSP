# API Documentation - EMPOWERRURAL

The Express API backend exposes REST endpoints under the `/api` prefix, listening by default on port `5000`.

---

## 🔒 Authentication Headers

All endpoints except `GET /api/jobs`, `GET /api/courses`, `GET /api/schemes`, and `POST /api/schemes/check-eligibility` require an Authorization header:
```text
Authorization: Bearer <token>
```
*Note: In offline mock mode, providing any placeholder token string (or none) will automatically link your session to the Ramesh Kumar developer profile.*

---

## 📁 Endpoints Registry

### 1. Health Check
* **`GET /health`**
  * **Description:** Verify backend operational status.
  * **Response:**
    ```json
    {
      "status": "ok",
      "timestamp": "2026-07-06T13:29:24Z",
      "mode": "offline-mock",
      "environment": "development"
    }
    ```

### 2. Profile Management
* **`GET /api/auth/me`**
  * **Description:** Retrieve current authenticated profile metadata.
* **`PUT /api/auth/profile`**
  * **Description:** Update user demographic properties.
  * **Payload:** `{ full_name, mobile, gender, age, income_annual, qualification, state, district, bio, skills[] }`
* **`GET /api/auth/skills`**
  * **Description:** Fetch the list of core skill types.

### 3. Jobs Portal
* **`GET /api/jobs`**
  * **Query Params:** `search`, `type`, `state`, `district`, `qualification`
  * **Description:** Query and filter jobs index.
* **`GET /api/jobs/:id`**
  * **Description:** Fetch details of a single job.
* **`POST /api/jobs`**
  * **Description:** Post a new job posting *(Requires role: admin/panchayat)*.
* **`DELETE /api/jobs/:id`**
  * **Description:** Delete a job listing *(Requires role: admin/panchayat)*.
* **`POST /api/jobs/:id/apply`**
  * **Payload:** `{ resume_url }`
  * **Description:** Submit a job application.
* **`GET /api/jobs/applications/me`**
  * **Description:** List applications sent by active user.
* **`POST /api/jobs/:id/bookmark`**
  * **Description:** Toggle job bookmark status.

### 4. Government Schemes
* **`GET /api/schemes`**
  * **Query Params:** `category`, `sponsor`
* **`POST /api/schemes/check-eligibility`**
  * **Payload:** `{ age, gender, income, state, qualification }`
  * **Description:** Return schemes that match rules.
* **`GET /api/schemes/:id`**
  * **Description:** Fetch detail of a single scheme.
* **`POST /api/schemes/:id/bookmark`**
  * **Description:** Toggle scheme bookmark status.

### 5. Learning Portal
* **`GET /api/courses`**
  * **Query Params:** `category`, `provider`, `price_type`, `type`
* **`GET /api/courses/progress/me`**
  * **Description:** Retrieve active learning progress logs.
* **`POST /api/courses/:id/progress`**
  * **Payload:** `{ progress_percent }`
  * **Description:** Set progress. Completion triggers certificate.
* **`POST /api/courses/:id/bookmark`**
  * **Description:** Toggle course bookmark status.

### 6. Resume System
* **`GET /api/resume`**
  * **Description:** Fetch user's stored resume JSON structure.
* **`POST /api/resume`**
  * **Payload:** `{ resume_data, template_name }`
  * **Description:** Upsert user resume data.

### 7. Conversational AI Assistant
* **`POST /api/ai/chat`**
  * **Payload:** `{ message, module, context }`
  * **Description:** Connects to Gemini API if key exists, or evaluates locally using semantic matching.
  * **Modules:** `coach`, `resume`, `interview`, `scheme`, `skills`, `advisor`

### 8. Mock Interview Coach
* **`GET /api/ai/interview/questions`**
  * **Query Params:** `category`
* **`POST /api/ai/interview/evaluate`**
  * **Payload:** `{ questionId, answer }`
  * **Description:** Returns AI score, hints, feedback, and sample answer.

### 9. Notifications Hub
* **`GET /api/notifications`**
  * **Description:** Retrieve unread notifications list.
* **`PUT /api/notifications/:id/read`**
  * **Description:** Mark alert row as read.
* **`POST /api/notifications/broadcast`**
  * **Payload:** `{ title, message }`
  * **Description:** Dispatches notifications to all user accounts *(Requires role: admin)*.
