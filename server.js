const express = require('express');
const path = require('path'); // Node.js built-in module for working with file and directory paths

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse URL-encoded bodies (for form submissions)
// This is important for handling data sent from HTML forms with method="POST"
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies (for API requests)
app.use(express.json());

// --- View Engine Setup ---
// Set the directory for views (template files)
// `path.join(__dirname, 'views')` ensures that the path is correct regardless of
// where the script is run from. `__dirname` is the current directory of the file.
app.set('views', path.join(__dirname, 'views'));
// Set EJS as the view engine
app.set('view engine', 'ejs');

// --- Static Files Setup ---
// Serve static files from the 'public' directory
// For example, `public/css/style.css` will be accessible via `/css/style.css`
app.use(express.static(path.join(__dirname, 'public')));

// --- Routes ---
// Basic route to render our home page
app.get('/', (req, res) => {
    // Renders the 'index.ejs' file located in the 'views' directory
    // We can pass data to the view as an object.
    res.render('index', { pageTitle: 'The Sound of Music App' });
});

// --- Server Listener ---
// Start the server and listen for incoming requests on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});