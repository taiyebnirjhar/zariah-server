# Nest App - NestJS Starter Kit

## 🚀 Introduction
Nest App is a NestJS starter kit designed to streamline backend development with a pre-configured setup. This starter kit includes essential features like database integration, validation, logging, security, and testing, making it easier to build scalable and maintainable applications.

## 🎯 Features
- **NestJS 10+** - A progressive Node.js framework for building efficient server-side applications.
- **Mongoose** - Integrated MongoDB support with Mongoose ORM.
- **Swagger** - Auto-generated API documentation.
- **Security** - Built-in security enhancements using `helmet`, `hpp`, and `cookie-parser`.
- **Logging** - Structured logging with `pino` and request logging using `morgan`.
- **Validation** - Strong input validation with `class-validator` and `class-transformer`.
- **Prettier & ESLint** - Code formatting and linting enforced.
- **Husky & Commitlint** - Git hooks for better commit message formatting and linting.
- **Jest Testing** - Unit and end-to-end testing pre-configured.

## 🏗️ Installation
```sh
# Clone the repository
git clone https://github.com/your-repo/nest-app.git
cd nest-app

# Install dependencies
npm install
```

## 🎮 Running the Project
```sh
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

## 🧪 Testing
```sh
# Run unit tests
npm run test

# Run end-to-end tests
npm run test:e2e

# Check test coverage
npm run test:cov
```

## 🔍 Linting & Formatting
```sh
# Lint and auto-fix code issues
npm run lint

# Format code
npm run format
```

## 📜 API Documentation
After running the project, you can access the Swagger API documentation at:
```
http://localhost:3000/api/docs
```

## 📂 Project Structure
```
📦 nest-app
 ┣ 📂 src
 ┃ ┣ 📂 modules       # Application modules
 ┃ ┣ 📂 common        # Shared utilities, DTOs, guards, and middlewares
 ┃ ┣ 📜 main.ts       # Entry point of the application
 ┣ 📜 .eslintrc.js    # ESLint configuration
 ┣ 📜 .prettierrc     # Prettier configuration
 ┣ 📜 package.json    # Project dependencies and scripts
 ┣ 📜 README.md       # Project documentation
```

## 🛠 Environment Variables
Create a `.env` file in the root directory and add the necessary environment variables:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/nest-app
JWT_SECRET=your_secret_key
```

## 📌 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a Pull Request

## 📄 License
This project is licensed under the **UNLICENSED** license.

---

Made with ❤️ using NestJS

