# Website management at English center

This English center management web application is built with powerful toolsets **React**, **TypeScript**, **Vite** for FE and **Express** for BE, providing rapid development and superior performance. The system is designed to comprehensively support center operations, from user management (including Admin and Teachers), courses, classes, schedules, teaching content, attendance, exam organization to tracking learning results. The main goal is to automate business processes, optimize management efficiency, and create a better interactive environment for users.

_The system aims to learn_

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [ESLint & Code Quality](#eslint--code-quality)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This project provides a minimal yet powerful setup for building React applications with TypeScript and Vite. It includes hot module replacement (HMR), ESLint integration, and is easily extensible for production use.

![Login](https://github.com/user-attachments/assets/ff587aa1-a1de-4d8b-9b0c-ef3c304a5511)

![Dashboard Admin](https://github.com/user-attachments/assets/08d1e36a-630e-4eb5-84bc-c5a4c8356e37)

![Table](https://github.com/user-attachments/assets/4aa4eb9b-5c03-4785-8615-54d1b8a1a423)

---

## Features

User management:

- Manage student and lecturer information (registration, profile).

- User authorization (Admin, Lecturer).

- Training management:

- Manage courses and classes (create, edit).

- Manage class and exam schedules.

- Manage lectures and tests (store, download).

- Take attendance and manage scores.

- Issue certificates.

- Interaction support

- Notifications (send notifications to lecturers).

- Reports (study and course statistics).

- Access learning materials (videos, PDFs).

On the Lecturer side:

- Manage classes and students in charge.

- Prepare and manage lectures, tests.

- Grade and take attendance of students.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Drizzle ORM](https://orm.drizzle.team/) (for database management)
- [XAMPP](https://www.apachefriends.org/) (for local MySQL/MariaDB server) **or** [SQL Server](https://www.microsoft.com/en-us/sql-server) (for Microsoft SQL database)

### Installation

```bash
# Clone the repository
git clone https://github.com/zanzandora/EnglishMaster.git
cd EnglishMaster

# Install dependencies
npm install
# or
yarn install
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

---

## Available Scripts

- `dev` – Start the development server
- `build` – Build the app for production
- `database:push` – Create a database using drizzle
- `database:seed` – Run seed file

---

## Project Structure

```
Client
├───public
│   └───fonts
│
└───src
    ├───components
    │   ├───admin
    │   ├───common
    │   │   ├───calendar
    │   │   ├───export
    │   │   ├───forms
    │   │   ├───select
    │   │   └───table
    │   │
    │   ├───dashboard
    │   │   └───components
    │   │
    │   └───svg
    ├───context
    ├───features
    │   ├───admin
    │   │   ├───login
    │   │   ├───pages
    │   │   └───svg
    │   ├───error
    │   ├───list
    │   │   ├───result
    │   │   ├───schedule
    │   │   ├───students
    │   │   └───teachers
    │   │   ...
    │   │
    │   └───teacher
    │       └───pages
    ├───hooks
    ├───interfaces
    ├───locales
    ├───mockData
    └───utils
    └───utils
```

```
server
├───database
│   └───entity
├───helper
├───routes
│   └───database
└───service
```

---

## ESLint & Code Quality

This project uses ESLint with recommended rules for TypeScript and React.  
To expand or customize linting for production:

- Update `eslint.config.js` as needed.
- For type-aware linting, configure `parserOptions` and use `tseslint.configs.recommendedTypeChecked` or `strictTypeChecked`.
- Install and configure `eslint-plugin-react` for React-specific linting.

Example configuration:

```js
import react from 'eslint-plugin-react';

export default tseslint.config({
  settings: { react: { version: '18.3' } },
  plugins: { react },
  rules: {
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
});
```

---

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

---

## License

This project is licensed under the [MIT License](LICENSE).

---
