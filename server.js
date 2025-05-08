const express = require('express');
const path = require('path'); // Node.js built-in module for working with file and directory paths

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse URL-encoded bodies (for form submissions)
// This is important for handling data sent from HTML forms with method="POST"
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies (for API requests)
app.use(express.json());


const { v4: uuidv4 } = require('uuid'); // Import the uuid package for generating unique IDs

// --- In-Memory Data (Simulating a Database) ---
// characters, songs, and locations arrays
//  Each element in these arrays is an object representing a data entry.
// Each object has an id generated using uuidv4()
let characters = [
    { id: uuidv4(), name: 'Maria', role: 'Governess', family: 'Non-Von Trapp' },
    { id: uuidv4(), name: 'Captain Georg von Trapp', role: 'Father', family: 'Von Trapp' },
    { id: uuidv4(), name: 'Liesl von Trapp', role: 'Eldest Daughter', family: 'Von Trapp' },
    { id: uuidv4(), name: 'Friedrich von Trapp', role: 'Son', family: 'Von Trapp' },
    { id: uuidv4(), name: 'Louisa von Trapp', role: 'Daughter', family: 'Von Trapp' },
    { id: uuidv4(), name: 'Kurt von Trapp', role: 'Son', family: 'Von Trapp' },
    { id: uuidv4(), name: 'Brigitta von Trapp', role: 'Daughter', family: 'Von Trapp' },
    { id: uuidv4(), name: 'Marta von Trapp', role: 'Daughter', family: 'Von Trapp' },
    { id: uuidv4(), name: 'Gretl von Trapp', role: 'Youngest Daughter', family: 'Von Trapp' },
    { id: uuidv4(), name: 'Baroness Elsa Schraeder', role: 'Captain\'s Fiancee', family: 'Non-Von Trapp' },
    { id: uuidv4(), name: 'Max Detweiler', role: 'Friend/Promoter', family: 'Non-Von Trapp' },
    { id: uuidv4(), name: 'Mother Abbess', role: 'Head of Abbey', family: 'Non-Von Trapp' }
];

let songs = [
    { id: uuidv4(), title: 'Do-Re-Mi', artist: 'Maria & Children', duration: '4:00', mood: 'Uplifting', year: 1965 },
    { id: uuidv4(), title: 'My Favorite Things', artist: 'Maria', duration: '2:30', mood: 'Comforting', year: 1965 },
    { id: uuidv4(), title: 'Edelweiss', artist: 'Captain von Trapp', duration: '2:00', mood: 'Patriotic', year: 1965 },
    { id: uuidv4(), title: 'Sixteen Going on Seventeen', artist: 'Liesl & Rolf', duration: '3:20', mood: 'Romantic', year: 1965 },
    { id: uuidv4(), title: 'The Sound of Music', artist: 'Maria', duration: '2:10', mood: 'Inspirational', year: 1965 },
    { id: uuidv4(), title: 'So Long, Farewell', artist: 'Children', duration: '2:25', mood: 'Playful', year: 1965 }
];

let locations = [
    { id: uuidv4(), name: 'Nonnberg Abbey', city: 'Salzburg', country: 'Austria', description: 'Maria\'s convent' },
    { id: uuidv4(), name: 'Von Trapp Villa', city: 'Salzburg', country: 'Austria', description: 'The family home' },
    { id: uuidv4(), name: 'Mirabell Gardens', city: 'Salzburg', country: 'Austria', description: 'Iconic filming location' },
    { id: uuidv4(), name: 'Salzburg Residenz Fountain', city: 'Salzburg', country: 'Austria', description: 'Featured in Do-Re-Mi' }
];


// --- API Routes for Characters ---
// GET all characters or filter by family
app.get('/api/characters', (req, res) => {
    const { family } = req.query; // Extract 'family' query parameter
    if (family) {
        // Filter characters by family (case-insensitive)
        const filteredCharacters = characters.filter(char =>
            char.family.toLowerCase().includes(family.toLowerCase())
        );
        return res.json(filteredCharacters);
    }
    res.json(characters); // Return all characters if no filter
});

// GET a single character by ID
app.get('/api/characters/:id', (req, res) => {
    const character = characters.find(c => c.id === req.params.id);
    if (!character) {
        return res.status(404).json({ message: 'Character not found' });
    }
    res.json(character);
});

// --- API Routes for Songs ---
// GET all songs or filter by mood
app.get('/api/songs', (req, res) => {
    const { mood } = req.query; // Extract 'mood' query parameter
    if (mood) {
        // Filter songs by mood (case-insensitive)
        const filteredSongs = songs.filter(song =>
            song.mood.toLowerCase().includes(mood.toLowerCase())
        );
        return res.json(filteredSongs);
    }
    res.json(songs); // Return all songs if no filter
});

// GET a single song by ID
app.get('/api/songs/:id', (req, res) => {
    const song = songs.find(s => s.id === req.params.id);
    if (!song) {
        return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
});

// --- API Routes for Locations ---
// GET all locations or filter by city
app.get('/api/locations', (req, res) => {
    const { city } = req.query; // Extract 'city' query parameter
    if (city) {
        // Filter locations by city (case-insensitive)
        const filteredLocations = locations.filter(loc =>
            loc.city.toLowerCase().includes(city.toLowerCase())
        );
        return res.json(filteredLocations);
    }
    res.json(locations); // Return all locations if no filter
});

// GET a single location by ID
app.get('/api/locations/:id', (req, res) => {
    const location = locations.find(l => l.id === req.params.id);
    if (!location) {
        return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location);
});


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