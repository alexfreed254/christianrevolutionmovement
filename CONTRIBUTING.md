# Contributing to Christ Revolution Movement

Thank you for your interest in contributing to the Christ Revolution Movement platform! This document provides guidelines and instructions for contributing.

## 🙏 Code of Conduct

This project is built to serve the Kingdom of God and the global church. We expect all contributors to:

- Be respectful and kind
- Welcome newcomers
- Focus on what is best for the community
- Show empathy towards others
- Avoid inappropriate language or behavior

## 🚀 How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:

1. **Clear title** describing the issue
2. **Steps to reproduce** the bug
3. **Expected behavior** vs actual behavior
4. **Screenshots** if applicable
5. **Environment details** (OS, Python version, browser)

### Suggesting Features

We welcome feature suggestions! Please open an issue with:

1. **Clear description** of the feature
2. **Use case** - how would this help users?
3. **Proposed implementation** (optional)
4. **Mockups or examples** (optional)

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/christ-revolution-movement.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   - Ensure the app runs without errors
   - Test all affected features
   - Check API endpoints work correctly

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: brief description of changes"
   ```

   Use commit prefixes:
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for improvements
   - `Refactor:` for code restructuring
   - `Docs:` for documentation changes

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Request review

## 💻 Development Setup

See [README.md](README.md) for setup instructions.

## 📝 Coding Standards

### Python Code Style

- Follow [PEP 8](https://pep8.org/)
- Use meaningful variable names
- Write docstrings for functions
- Keep functions small and focused
- Maximum line length: 100 characters

```python
# Good
def calculate_engagement_score(attendance_count: int, prayer_count: int) -> int:
    """Calculate member engagement score based on activities."""
    base_score = attendance_count * 10
    bonus_score = prayer_count * 2
    return base_score + bonus_score

# Bad
def calc(a, p):
    return a*10+p*2
```

### JavaScript Code Style

- Use ES6+ features
- Use `const` and `let`, not `var`
- Use meaningful variable names
- Add comments for complex logic

```javascript
// Good
const fetchPrayerRequests = async () => {
    const response = await fetch('/api/prayers');
    const data = await response.json();
    return data;
};

// Bad
async function f() {
    var r = await fetch('/api/prayers');
    var d = await r.json();
    return d;
}
```

### HTML/CSS

- Use semantic HTML5 elements
- Keep CSS organized and commented
- Use BEM naming convention for classes
- Ensure accessibility (ARIA labels, alt text)

## 🧪 Testing

Currently, the project does not have automated tests. Contributions adding tests are highly appreciated!

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Registration flow
- [ ] Login/logout
- [ ] Member portal loads correctly
- [ ] Attendance check-in works
- [ ] Prayer wall displays and accepts new prayers
- [ ] Giving form submits correctly
- [ ] Admin dashboard (if you have admin access)
- [ ] Mobile responsiveness
- [ ] All API endpoints respond correctly

## 🌍 Areas Needing Help

We especially welcome contributions in:

1. **Testing** - Add unit tests, integration tests
2. **Documentation** - Improve setup guides, API docs
3. **Mobile** - Improve mobile responsiveness
4. **Accessibility** - WCAG compliance improvements
5. **Internationalization** - Multi-language support
6. **Security** - Security audits and improvements
7. **Performance** - Optimization and caching
8. **Payment Integration** - Stripe, M-Pesa, PayPal
9. **Email/SMS** - Notification systems
10. **Analytics** - Reporting and dashboards

## 🔒 Security

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. Email security details to: [security@christrevolution.org]
3. Include steps to reproduce
4. We'll respond within 48 hours

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙌 Recognition

All contributors will be recognized in our CONTRIBUTORS.md file!

## ❓ Questions?

Feel free to open an issue with the "question" label, or reach out to the maintainers.

---

Thank you for contributing to the Kingdom work! 🙏

*"Whatever you do, work at it with all your heart, as working for the Lord..."* - Colossians 3:23
