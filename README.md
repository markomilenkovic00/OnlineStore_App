# Project Overview

This project is an **e-commerce application** utilizing a **microservice architecture** on the backend. The system supports three types of users: **Administrator**, **Seller**, and **Customer**, each with specific authentication and authorization functionalities.

## Key Features

- **Authentication & Authorization**: Users can register and log in using personal details or via Google. 
- **User Roles**:
  - **Administrator**: Manages seller verifications and oversees order history.
  - **Seller**: Adds, updates, and deletes products; views order history.
  - **Customer**: Creates orders, manages cart items, and views order history.
- **Microservices**:
  - **ProductOrder**: Handles product and order management.
  - **User**: Manages user profiles.
- **API Gateway**: Ocelot API Gateway routes requests to appropriate microservices based on a JSON configuration file.
- **Logging**: Logs API Gateway activities to text files and console, including request details and status codes.
- **Asynchronous Communication**: All interactions use HTTP protocol, with microservices communicating as needed.
