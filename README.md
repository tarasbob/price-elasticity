# Price Elasticity Quiz

An interactive web application for testing your knowledge of price elasticity of demand for various goods and services.

## Features

- **Interactive Quiz**: Test your knowledge with randomly selected goods from the dataset
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Score Tracking**: Keep track of your score, accuracy, and answer streak
- **Visual Feedback**: Color-coded feedback based on how close your guess is to the actual value
- **Educational**: Learn about price elasticity while playing

## How to Play

1. A random good or service will be displayed
2. Enter your guess for its price elasticity of demand (typically a negative number between 0 and -5)
3. Submit your answer to see how close you were
4. Get instant feedback with color-coded results:
   - 🟢 Green: Excellent! (within 0.1 of actual value)
   - 🟡 Yellow: Very close! (within 0.3)
   - 🟠 Orange: Good try! (within 0.5)
   - 🔴 Red: Keep practicing! (more than 0.5 off)

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd price-elasticity-quiz
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Understanding Price Elasticity

Price elasticity of demand measures how responsive the quantity demanded is to changes in price:

- **Elastic goods** (closer to -5): Large change in demand when price changes
  - Example: Luxury items, entertainment
- **Inelastic goods** (closer to 0): Small change in demand when price changes
  - Example: Necessities, addictive goods

## Technologies Used

- **Next.js 15**: React framework for production
- **TypeScript**: Type-safe development
- **Tailwind CSS 3.x**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions

## Dataset

The quiz uses a curated dataset of price elasticity values for various goods and services, including:
- Consumer goods (cigarettes, alcohol, soft drinks)
- Transportation (airline travel, bus travel, car fuel)
- Food items (rice, eggs, chicken)
- Services (cinema, healthcare, education)
- And more!

## Building for Production

To create an optimized production build:

```bash
npm run build
npm start
```

## License

This project is open source and available under the MIT License.