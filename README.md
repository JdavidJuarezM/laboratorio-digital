<div align="center">

# 🧪 Laboratorio Digital

**A modern, full-stack educational web application**

[![Java](https://img.shields.io/badge/Java_21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](#)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](#)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
[![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)](#)

*An interactive learning platform featuring game-based modules like Virtual Garden, Supermarket, Recycling, and Vocabulary, backed by a robust Java Spring Boot API and secured with JWT.*

</div>

<br />

## 📑 Table of Contents
- [✨ Key Features](#-key-features)
- [🏗️ Architecture & Structure](#️-architecture--structure)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup-spring-boot)
  - [Frontend Setup](#frontend-setup-react)
- [🛠️ Tech Stack](#️-tech-stack)

---

## ✨ Key Features

* **✔️ Interactive Educational Modules:** Gamified learning experiences including *Huerto Virtual*, *Reciclaje*, *Supermercado*, and *Vocabulario*.
* **✔️ Teacher Dashboard:** Dedicated panels for teachers to manage students and track learning progress.
* **✔️ Secure Authentication:** Robust user authentication and authorization using Spring Security and JSON Web Tokens (JWT).
* **✔️ Dynamic UI/UX:** Built with React, featuring animations with Framer Motion and 3D/Canvas elements via Three.js and Pixi.js.

---

## 🏗️ Architecture & Structure

This project follows a decoupled client-server architecture:

```text
laboratorio-digital/
├── backend/                       # Spring Boot REST API
│   ├── src/main/java/...          # Java source code (Controllers, Services, Models, Repositories)
│   ├── src/main/resources/        # Configuration files (application.properties)
│   └── pom.xml                    # Maven dependencies
├── frontend/                      # React SPA
│   ├── src/components/            # Game modules, UI components, and layouts
│   ├── src/services/              # Axios API integrations
│   └── package.json               # Node.js dependencies
└── README.md                      # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine before starting:
* **Java Development Kit (JDK):** Version 21
* **Node.js:** v18 or higher (and `npm`)
* **MySQL:** Running locally or remotely

---

### Backend Setup (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure your database credentials in `src/main/resources/application.properties`.
3. Build and run the application using Maven Wrapper:
   ```bash
   # On Windows
   mvnw.cmd spring-boot:run

   # On macOS/Linux
   ./mvnw spring-boot:run
   ```
*The backend server will start on `http://localhost:8080` (or your configured port).*

---

### Frontend Setup (React)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
*The frontend application will be available at `http://localhost:5173`.*

---

## 🛠️ Tech Stack

**Frontend:**
* React 19 + Vite
* Tailwind CSS + PostCSS
* Framer Motion (Animations)
* Three.js & Pixi.js (Graphics/Canvas)
* Axios (HTTP Client)

**Backend:**
* Java 21
* Spring Boot 3.5.x (Web, Data JPA, Security)
* MySQL Connector
* JWT (io.jsonwebtoken)

<br />

<div align="center">
  <i>Developed with ☕ for the Emiliano Zapata elementary school.</i>
</div>
