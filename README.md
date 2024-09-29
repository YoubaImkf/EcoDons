# EcoDons

EcoDons is an Angular-based web application that promotes the reuse of items to support a circular economy. Users can browse, donate, and request items, helping reduce waste and encourage eco-friendly practices. The application includes features such as messaging between users, item management, and a responsive, user-friendly interface.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Development Server](#development-server)
- [Usage](#usage)
- [Database](#database)
- [Scripts](#scripts)
- [Team](#team)
- [Contributing](#contributing)


## Features
- **User Authentication:** Registration, login, and secure JWT-based authentication.
- **Item Management:** Users can create, update, and browse items for donation.
- **Favorites:** Users can mark items as favorites for future reference.
- **Messaging System:** Integrated messaging feature allowing users to communicate about items, with notifications for unread messages.
- **Filtering:** Search and filter items based on categories, location, and status.
- **Responsive Design:** A user-friendly and accessible interface designed with Tailwind CSS.
- **Server-Side:** Includes a JSON server for API simulations and handling mock data.

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/YoubaImkf/EcoDons.git
   cd ecodons
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up the Development Server:**
   - To start the JSON server, run:
     ```bash
     npm run start:server
     ```
   - Also run:
     ```bash
     node server.js
     ```

## Development Server

To launch the development server:

1. **Run the Angular Application:**
   ```bash
   ng serve
   ```
2. **Open Your Browser:** 
   - Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.

## Usage

- **User Interaction:** Users can register or log in to access the full functionality of the application, including adding items, messaging, and managing favorites.
- **Contacting Donors:** Users can click on an item and contact the donor through the integrated messaging system.
- **Messaging:** The chat system allows real-time messaging with unread message notifications. Users can navigate conversations and manage messages efficiently.
- **Notifications:** The application includes a built-in notification system to alert users of various events, such as attempting to contact oneself or sending a new message.

## Database

The application uses a JSON server (`db.json`) as a mock database for testing. The `db.json` file contains:
- **Users:** User information, including favorites and locations.
- **Items:** Item listings with details such as category, status, location, and ownership.
- **Donation History:** Records of items that have been donated.
- **Conversations:** Messaging conversations between users.

## Scripts

- **Start JSON Server:** 
  ```bash
  npm run start:server
  ```
  - This will start a JSON server that simulates an API for managing user, item, and conversation data.
  
- **Start Node Server:**
  ```bash
  node server.js
  ```
  - Alternative method to start the server if custom server configurations are present.

- **Angular Development Server:**
  ```bash
  ng serve
  ```
  - Starts the Angular development server.

## Team

Meet the team behind EcoDons:
- **Redouane Belkacem** - [GitHub Profile](https://github.com/BelkacemRedouane)
- **Youba Imakhlaf** - [GitHub Profile](https://github.com/YoubaImkf)
- **Hassan Roble Abdouhraman** - [GitHub Profile](https://github.com/Abdouhramanhassanroble)

## Contribution Guidelines

Contributions to EcoDons are welcome! If you'd like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch-name`).
5. Open a pull request.


### Notes:
- Ensure you have Node.js and Angular CLI installed on your machine before starting.
- This README assumes that the project uses a local JSON server for testing purposes. For production use, consider setting up a real backend with a database.
