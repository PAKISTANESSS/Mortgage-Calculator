# Mortgage Calculator

A beautiful and modern React-based mortgage calculator that helps you calculate your monthly mortgage payments based on loan amount, term, Euribor rate, and spread.

## Features

- 🏠 **Loan Amount**: Enter the amount you need to borrow
- 📅 **Loan Term**: Specify the number of months for repayment
- 📊 **Euribor Rate**: Current Euribor reference rate
- 💰 **Spread**: Bank's additional interest rate
- 📈 **Real-time Calculation**: Instantly see your monthly payment
- 📱 **Responsive Design**: Works perfectly on all devices
- ✨ **Modern UI**: Beautiful gradient design with smooth animations

## Calculation Details

The calculator shows:
- **Monthly Payment**: Your regular payment amount
- **Total Interest Rate**: Combined Euribor + Spread
- **Total Amount Paid**: Full amount over the loan period
- **Total Interest**: How much interest you'll pay

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Mortage-Calculator.git
cd Mortage-Calculator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## How It Works

The calculator uses the standard mortgage payment formula:

```
M = P × [r(1 + r)^n] / [(1 + r)^n - 1]
```

Where:
- M = Monthly payment
- P = Principal (loan amount)
- r = Monthly interest rate (Annual rate / 12 / 100)
- n = Number of months

The annual interest rate is calculated as: `Euribor + Spread`

## Technology Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **CSS3** - Modern styling with gradients and animations
- **JavaScript (ES6+)** - Logic and calculations

## Browser Support

This application works in all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
