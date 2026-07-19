# Security & Credentials Management

This document outlines the security architecture, credentials configuration, and defensive patterns implemented across the **ResumeIQ AI** application to secure user data and guard against common vulnerabilities.

---

## Credentials Management

We adhere strictly to security best practices regarding secret management:

- **Zero Hardcoding**: No API keys, database credentials, secrets, or mail credentials are hardcoded anywhere in the codebase.
- **Environment Variables**: All configurations are read at runtime from system environment variables. The global configurations are documented in [.env.example](file:///C:/Users/J.N.PATHAK/CVitAI/.env.example).
- **Git Protection**: The `.gitignore` is configured to exclude local configuration overrides (`.env`), database volumes, builds, and runtime logs. This keeps secrets from leaking into Git repositories.

---

## Authentication Security

- **Password Hashing**: User passwords are encrypted using `bcryptjs` with 10 salt rounds before database insertion. The plain text passwords are never stored or logged.
- **JWT Architecture**:
  - **Access Tokens**: Short-lived (15 minutes), passed inside the `Authorization: Bearer <token>` header or `accessToken` cookie.
  - **Refresh Tokens**: Long-lived (7 days), stored in secure, **HTTP-only**, SameSite=Strict cookies. This blocks client-side JavaScript access, defending against Cross-Site Scripting (XSS) attacks.
- **Token Rotation & Security Monitoring**: 
  - Each session refresh triggers Refresh Token Rotation (re-generating both access and refresh keys).
  - To defend against session hijackings, the backend logs active refresh tokens. If a token is reused (indicating a potential breach), the backend automatically invalidates all sessions for that user.

---

## Application Hardening Middleware

We configure multiple layers of defense in the Express application [server.ts](file:///C:/Users/J.N.PATHAK/CVitAI/backend/src/server.ts):

- **Helmet**: Set secure HTTP response headers (XSS filters, Clickjacking blocks, Content Security Policies).
- **CORS Configuration**: Restricts access to a whitelist matching `CLIENT_URL` (configured via env). Supports credential handshakes for secure cookies.
- **Rate Limiting**:
  - General routes are protected by `apiLimiter` (100 requests per 15 minutes per IP).
  - Authentication endpoints are restricted by `authLimiter` (15 requests per hour) to stop brute-force hacking.
- **File Upload Safeguards**: Multer checks mime-type filters and sets strict file size limits (5MB) on resume parses, defending against file injection and denial of service.
