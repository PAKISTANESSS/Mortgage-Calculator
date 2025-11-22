# Contributing to Mortgage Calculator

Thank you for your interest in contributing to the Mortgage Calculator project! We welcome contributions from everyone.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Git

### Setup Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/Mortage-Calculator.git
   cd Mortage-Calculator
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:5173`

## 📝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots (if applicable)
- Browser and OS information

### Suggesting Features

We love feature suggestions! Please create an issue with:
- A clear description of the feature
- Why this feature would be useful
- Any implementation ideas you have

### Submitting Pull Requests

1. **Create a new branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   or
   ```bash
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**:
   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic
   - Test your changes thoroughly

3. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** on GitHub

## 🎨 Code Style Guidelines

### JavaScript/React

- Use functional components with hooks
- Use meaningful variable and function names
- Keep components focused and single-purpose
- Use `const` for variables that don't change, `let` otherwise
- Add JSX file extension when component contains JSX syntax

### CSS

- Use existing CSS classes when possible
- Follow BEM naming convention for new classes
- Use CSS variables for theme colors
- Keep styles organized by component

### File Organization

```
src/
├── components/      # Reusable React components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── Calculator.css  # Main styles
└── main.jsx        # App entry point
```

## 🌍 Adding Translations

To add or update translations:

1. Open `src/hooks/useLanguage.jsx`
2. Add your translation keys to all language objects (`en`, `pt`, `fr`, `de`, `es`)
3. Use the translation in components: `{t.yourKey}`

Example:
```javascript
// In useLanguage.jsx
en: {
  yourNewKey: 'Your English Text',
  // ...
},
pt: {
  yourNewKey: 'Seu Texto em Português',
  // ...
}

// In your component
const { t } = useLanguage()
return <div>{t.yourNewKey}</div>
```

## 🎨 Adding New Themes

To add a new theme:

1. Open `src/hooks/useTheme.js`
2. Add your theme to the `themes` object:
   ```javascript
   yourTheme: {
     name: 'Your Theme Name',
     primary: '#hexcolor',
     secondary: '#hexcolor',
     gradient: 'linear-gradient(...)',
     background: 'linear-gradient(...)',
   }
   ```

## 🧪 Testing

Before submitting a PR, please test:

- [ ] All calculator features work correctly
- [ ] Calculations are accurate
- [ ] UI is responsive on mobile/tablet/desktop
- [ ] All themes display correctly
- [ ] All languages display correctly
- [ ] PDF export works properly
- [ ] No console errors

## 📋 Commit Message Guidelines

Use clear, descriptive commit messages:

- `feat: Add new feature X`
- `fix: Fix calculation error in Y`
- `style: Update button styling`
- `docs: Update README`
- `refactor: Simplify calculation logic`
- `perf: Improve PDF generation speed`
- `test: Add tests for component X`

## ❓ Questions?

If you have questions, feel free to:
- Open an issue for discussion
- Reach out to the maintainers

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

## 🙏 Thank You!

Your contributions help make this project better for everyone. We appreciate your time and effort!

