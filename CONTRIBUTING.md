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
├── hooks/          # Custom React hooks (useLanguage, useTheme, useLocalStorage)
├── locales/        # Translation files (one per language)
│   ├── en.js       # English translations
│   ├── pt.js       # Portuguese translations
│   ├── fr.js       # French translations
│   ├── de.js       # German translations
│   ├── es.js       # Spanish translations
│   └── index.js    # Exports all locales
├── utils/          # Utility functions (calculations, PDF export)
├── Calculator.css  # Main styles
└── main.jsx        # App entry point
```

## 🌍 Adding Translations

The application uses a modular translation system with separate files for each language.

### File Structure

Each language has its own file in `src/locales/`:
- `en.js` - English (default)
- `pt.js` - Portuguese
- `fr.js` - French
- `de.js` - German
- `es.js` - Spanish

### To Add New Translation Keys:

1. **Add the key to ALL language files** to maintain consistency
2. Each locale file exports a default object with translation keys
3. Use descriptive key names (e.g., `monthlyPayment`, `totalInterest`)

**Example - Adding a new translation:**

```javascript
// In src/locales/en.js
export default {
  // ... existing translations
  yourNewKey: 'Your English Text',
}

// In src/locales/pt.js
export default {
  // ... existing translations
  yourNewKey: 'Seu Texto em Português',
}

// Repeat for fr.js, de.js, es.js
```

### To Use Translations in Components:

```javascript
import { useLanguage } from '../hooks/useLanguage'

function YourComponent() {
  const { t } = useLanguage()
  
  return <div>{t.yourNewKey}</div>
}
```

### To Add a New Language:

1. Create a new file in `src/locales/` (e.g., `it.js` for Italian)
2. Copy the structure from `en.js` and translate all keys
3. Add the language to `src/locales/index.js`:
   ```javascript
   import it from './it'
   
   export const locales = {
     // ... existing
     it
   }
   
   export const languages = {
     // ... existing
     it: { name: 'Italiano', flag: '🇮🇹', code: 'IT' }
   }
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

