# Security Policy

## Supported Versions

Currently, only the latest version is supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability in the Christ Revolution Movement platform, please follow these steps:

### 1. Contact Us Privately

Email security details to: **security@christrevolution.org** (or create a GitHub Security Advisory)

Include:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if you have one)

### 2. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 5 business days
- **Fix Timeline**: Depends on severity (see below)

### 3. Severity Levels

| Severity | Response Time | Examples |
|----------|---------------|----------|
| Critical | 24-48 hours | Authentication bypass, SQL injection, RCE |
| High | 3-7 days | XSS, CSRF, data exposure |
| Medium | 7-14 days | Information disclosure, DoS |
| Low | 14-30 days | Minor issues, best practice improvements |

### 4. Disclosure Policy

- We follow **coordinated disclosure**
- Security fixes will be released before public disclosure
- We'll credit security researchers (unless they prefer anonymity)
- Public disclosure after 90 days or when fix is deployed

## Security Best Practices

### For Developers

1. **Never commit secrets**
   - Use `.env` files (gitignored)
   - Use environment variables
   - Review code before committing

2. **Input Validation**
   - Always validate user input
   - Use Pydantic models
   - Sanitize HTML/SQL

3. **Authentication**
   - Use strong password hashing
   - Implement session expiration
   - Use HTTPS only

4. **Database**
   - Use parameterized queries
   - Enable Row Level Security (RLS)
   - Regular backups

### For Deployers

1. **Environment Variables**
   - Set strong `SESSION_SECRET`
   - Use `service_role` key (not `anon` key)
   - Rotate keys periodically

2. **CORS Configuration**
   - Set `ALLOWED_ORIGINS` to specific domains
   - Don't use `*` in production

3. **Monitoring**
   - Enable Render logging
   - Monitor Supabase metrics
   - Set up error tracking (Sentry)

4. **Updates**
   - Keep dependencies updated
   - Monitor security advisories
   - Apply patches promptly

## Known Security Considerations

### Current Implementation

1. **Sessions**: Token-based, 30-day expiration
2. **Password Hashing**: SHA-256 with salt
3. **CORS**: Configurable via environment variable
4. **RLS**: Enabled in Supabase

### Planned Improvements

- [ ] Add rate limiting
- [ ] Implement 2FA
- [ ] Add CAPTCHA for registration
- [ ] Implement CSP headers
- [ ] Add security headers (HSTS, X-Frame-Options)
- [ ] Implement audit logging
- [ ] Add email verification
- [ ] Implement password strength requirements

## Compliance

This platform handles personal data and should comply with:

- **GDPR** (if serving EU users)
- **CCPA** (if serving California residents)
- **General data protection** best practices

Ensure you:
- Have a privacy policy
- Obtain user consent
- Allow data export/deletion
- Encrypt data in transit and at rest

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [Supabase Security](https://supabase.com/docs/guides/auth/row-level-security)

## Contact

For non-security issues, use GitHub Issues.
For security concerns, email: **security@christrevolution.org**

---

*"The name of the Lord is a fortified tower; the righteous run to it and are safe."* - Proverbs 18:10
