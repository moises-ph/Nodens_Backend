# Nodens Backend 🎶

**Nodens** is a professional networking platform specifically designed for the musical ecosystem, functioning as a strategic bridge between musicians and organizers (clients or recruiters). Inspired by LinkedIn’s networking model, this platform addresses the absence of a centralized digital marketplace for artistic talent.

This repository contains the project's business logic, developed under a robust and scalable **microservices architecture**.

---

## 🏗️ System Architecture

The project implements a **Polyglot Microservices** approach, allowing each component to utilize the most efficient stack for its specific task. Traffic is managed through **Azure API Gateway**, and deployment is standardized using **Docker** on **Azure Web Apps**.

### Services and Tech Stack

| Service | Language / Framework | Database | Responsibility |
| :--- | :--- | :--- | :--- |
| **Users & Auth** | C# / .NET 6.0 | SQL Server | Identity, JWT, and Security |
| **Musician Service** | Python / Flask | MongoDB | Artist profiles and portfolios |
| **Organizers Service** | Python / Flask | MongoDB | Recruiter and client management |
| **Offers Service** | TypeScript / Fastify | MongoDB | Job posting and application management |
| **Post Service** | Java / Spring Boot | MongoDB | Social media feed and news updates |
| **Mail Service** | TypeScript / Fastify | - | Notifications and alerts |

---

## ✨ Key Features

* **Music Networking:** Musicians can create professional profiles and upload multimedia content to attract interest from organizers.
* **Specialized Job Board:** A system for publishing and applying to exclusive job offers within the music sector.
* **Social Interaction:** A dedicated post wall (Feed) to foster connection among community members.
* **Security:** Implementation of centralized authentication via **JSON Web Tokens (JWT)**.
* **Containerization:** Each service includes its own `Dockerfile`, ensuring a consistent environment between development and production.

---

## 🛠️ Installation Requirements

To run the service mesh locally, ensure you meet the following requirements:

### Option A: Docker (Recommended)
* **Docker Desktop** and **Docker Compose** installed.

### Option B: Local Environments
* **Node.js** (v18+) / **TypeScript** 4.9.5
* **Python** 3.11.0 (Flask 2.2.3)
* **.NET SDK** 6.0
* **Java JDK** 17+ (Spring Boot 3.1.0)
* Active instances of **MongoDB** and **SQL Server**.

---

## 🚀 Configuration and Usage

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/moises-ph/Nodens_Backend.git](https://github.com/moises-ph/Nodens_Backend.git)
    cd Nodens_Backend
    ```

2.  **Environment Variables:**
    Configure the `.env` files (or `appsettings.json` for .NET) within each service folder following the provided template files.

3.  **Deployment with Docker Compose:**
    ```bash
    docker-compose up --build
    ```

---

## 🎓 Academic Context
Nodens was developed as an **Academic Capstone Project**, demonstrating the integration of multiple modern technologies, management of both relational and NoSQL databases, and professional cloud deployment.

---
*Developed by [Moisés Pineda](https://github.com/moises-ph)*
