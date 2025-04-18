🎬 Movie Explorer

A React-based movie explorer app that fetches and displays popular movies from The Movie Database (TMDb). Users can search, sort, view movie details, and edit movie data. Built with Material-UI (MUI) and React Router, it provides a sleek user interface and functionality for managing movie collections.

🌟 Features

Browse Popular Movies: View the latest trending movies fetched from TMDb.

Search Movies: Search movies by title and filter through the results.

Sort Functionality: Sort movies alphabetically in ascending or descending order.

Movie Details: View detailed information about a movie, including overview, release date, runtime, and trailer.

Edit Movies: Edit and update movie information in the app.

Responsive UI: Fully responsive, built with Material-UI for seamless viewing on desktop and mobile.

🛠 Tech Stack

Frontend: React, React Router, Material-UI

State Management: React Context API

Data Fetching: Axios

Backend: The Movie Database (TMDb) API

Styling: Material-UI (MUI)

🚀 Getting Started

1. Prerequisites

Before running the app, ensure you have the following tools installed on your local machine:

Node.js (v14.x or later)

npm or yarn

2. Setup

Clone the repository to your local machine:

git clone https://github.com/nisarthpatel/Watch-Popular-Movie-Tailors.git

cd movie-explorer

3. Install Dependencies

To install all required dependencies, run:

npm install
Or, if you're using yarn:

yarn install

4. Create .env File
   Create a .env file in the root of your project with your TMDb API key:

VITE_TMDB_API_KEY=your_tmdb_api_key_here

If you are using Vite, replace the variable name with VITE_API_KEY.

5. Run the Application

To start the development server, use:

npm start

Or for yarn:

yarn start

This will launch the app in development mode. Open http://localhost:3000 to view it in your browser.

6. Build for Production

To create a production-ready build:

npm run build

7. Testing

You can add your preferred testing setup (e.g., Jest, React Testing Library) here for users who want to run tests. For example:

npm run test

🔑 API

This project uses The Movie Database API (TMDb) for fetching movie data. You need to create a free account on TMDb and obtain an API key.

Sign up at The Movie Database.

Go to your account settings and generate an API key.

Use this API key in your .env file as shown in the setup section.

✨ Key Features Breakdown

Material-UI Integration: All components are built with Material-UI for consistency, flexibility, and responsiveness.

React Context API: State management for movies and updates is handled using Context API.

Axios for API calls: Axios is used to make HTTP requests to TMDb for fetching and updating data.

📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

💡 Contributing

Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

Fork the repository.

Create a new feature branch: git checkout -b feature-name

Make your changes and commit: git commit -m 'Add some feature'

Push to the branch: git push origin feature-name

Open a Pull Request

Please ensure that your code follows the project's coding standards and guidelines.

🧑‍💻 Authors
Nisarth Patel - Movie App With MovieDB API - @nisarthpatel

📞 Contact

For any inquiries or suggestions, feel free to reach out at patelnisarth@gmail.com.

🛡

If you discover any security-related issues, please contact patelnisarth@gmail.com directly instead of using the issue tracker.

🤝 Support

If you find this project helpful or interesting, please give it a ⭐ on GitHub!

📈 Fork & Star

Fork: You can fork this project to customize and make your version.

Star: If you like the project, click the ⭐ button at the top of this repository to give it a star. Every ⭐ helps!

🔧 Future Features

User Authentication: Allow users to log in and maintain a list of favorite movies.

Movie Reviews: Integrate reviews and ratings from users.

PWA Support: Make the app a Progressive Web App (PWA) for offline use.

Thank you for using Movie Explorer! 🎬🍿
