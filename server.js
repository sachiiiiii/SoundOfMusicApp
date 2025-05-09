const express = require('express');
const path = require('path'); // Node.js built-in module for working with file and directory paths

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies (for API requests)
app.use(express.json());


const { v4: uuidv4 } = require('uuid'); // Import the uuid package for generating unique IDs

// --- In-Memory Data (Simulating a Database) ---
// characters, songs, and locations arrays
// Each element in these arrays is an object representing a data entry.
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


// --- Custom Middleware 1: Request Logger ---
// Log details of each incoming request.
const requestLogger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - Received ${req.method} request at ${req.originalUrl}`);
    next(); // Pass control to the next middleware/route handler
};
// Apply the request logger middleware to all incoming requests
app.use(requestLogger);


// --- Custom Middleware 2: Basic Authorization Simulation ---Credit: Google
// Check for 'x-auth-token' header
const authorizeAPIRequest = (req, res, next) => {
    const authToken = req.headers['x-auth-token'];

    if (!authToken || authToken !== 'tsom1965') {
        return res.status(403).json({ message: 'Forbidden: Invalid or missing authorization token.' });
    }
    next(); // If authorized, proceed to the next middleware/route
};

// Apply the authorization middleware to specific API routes that require it
app.post('/api/characters', authorizeAPIRequest, (req, res) => {
    // Ensure required fields are present
    const { name, role, family } = req.body;
    if (!name || !role || !family) {
        return res.status(400).json({ message: 'Name, role, and family are required' });
    }

    const newCharacter = {
        id: uuidv4(), // Generate a unique ID using uuid
        name,
        role,
        family
    };

    characters.push(newCharacter); // Add the new character to our in-memory array
    res.status(201).json(newCharacter); // Respond with the created character and 201 Created status

});

app.patch('/api/songs/:id', authorizeAPIRequest, (req, res) => {
    const songId = req.params.id;
    const songIndex = songs.findIndex(s => s.id === songId);

    if (songIndex === -1) {
        return res.status(404).json({ message: 'Song not found' });
    }

    // Update only the fields that are provided in the request body
    const updatedSong = { ...songs[songIndex], ...req.body };
    songs[songIndex] = updatedSong; // Replace the old song with the updated one

    res.json(updatedSong); // Respond with the updated song
});

app.post('/api/locations', authorizeAPIRequest, (req, res) => {
    // Ensure required fields are present
    const { name, city, country, description } = req.body;
    if (!name || !city || !country || !description) {
        return res.status(400).json({ message: 'Name, city, country and description are required' });
    }

    const newLocation = {
        id: uuidv4(), // Generate a unique ID using uuid
        name,
        city,
        country,
        description
    };

    locations.push(newLocation); // Add the new character to in-memory array
    res.status(201).json(newLocation); // Respond with the created character and 201 Created status code
});

app.delete('/api/locations/:id', authorizeAPIRequest, (req, res) => {
    const locationId = req.params.id;
    const initialLength = locations.length;
    // Filter out the location with the given ID
    locations = locations.filter(loc => loc.id !== locationId);

    if (locations.length === initialLength) {
        // If length hasn't changed, no location was found/deleted
        return res.status(404).json({ message: 'Location not found' });
    }

    res.status(204).send(); // Respond with 204 No Content status code (successful deletion)
});

// --- ROUTES ---
// Basic route to render our home page
app.get('/', (req, res, next) => {
    // Render the 'index.ejs' file located in the 'views' directory
    // Pass data to the view as an object.
    res.render('index', { 
        pageTitle: 'The Sound of Music App',
        characters: characters // Pass characters array to the EJS template
    });
    next();
});

// --- API Routes for Characters ---
// GET all characters or filter by family
app.get('/api/characters', (req, res, next) => {
    const { family } = req.query;
    if (family) {
        // Filter characters by family (case-insensitive)
        const filteredCharacters = characters.filter(character =>
            character.family.toLowerCase() === family.toLowerCase()
        );
        return res.json(filteredCharacters);
    }
    res.json(characters); // Return all characters if no filter
    next();
});

// GET a single character by ID
app.get('/api/characters/:id', (req, res, next) => {
    const character = characters.find(c => c.id === req.params.id);
    if (!character) {
        return res.status(404).json({ message: 'Character not found' });
    }
    res.json(character);
    next();
});

// POST a new character
app.post('/api/characters', (req, res, next) => {
    // Ensure required fields are present
    const { name, role, family } = req.body;
    if (!name || !role || !family) {
        return res.status(400).json({ message: 'Name, role, and family are required' });
    }

    const newCharacter = {
        id: uuidv4(), // Generate a unique ID using uuid
        name,
        role,
        family
    };

    characters.push(newCharacter); // Add the new character to our in-memory array
    res.status(201).json(newCharacter); // Respond with the created character and 201 Created status
    next();
});

// --- API Routes for Songs ---
// GET all songs or filter by mood
app.get('/api/songs', (req, res, next) => {
    const { mood } = req.query; // Extract 'mood' query parameter
    if (mood) {
        // Filter songs by mood (case-insensitive)
        const filteredSongs = songs.filter(song =>
            song.mood.toLowerCase().includes(mood.toLowerCase())
        );
        return res.json(filteredSongs);
    }
    res.json(songs); // Return all songs if no filter
    next();
});

// GET a single song by ID
app.get('/api/songs/:id', (req, res, next) => {
    const song = songs.find(s => s.id === req.params.id);
    if (!song) {
        return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
    next();
});

// PATCH an existing song
app.patch('/api/songs/:id', (req, res, next) => {
    const songId = req.params.id;
    const songIndex = songs.findIndex(s => s.id === songId);

    if (songIndex === -1) {
        return res.status(404).json({ message: 'Song not found' });
    }

    // Update only the fields that are provided in the request body
    const updatedSong = { ...songs[songIndex], ...req.body };
    songs[songIndex] = updatedSong; // Replace the old song with updated one

    res.json(updatedSong); // Respond with updated song
    next();
});

// GET songs by year - this is not working
// `(\\d{4})` ensures that the 'year' parameter is exactly four digits.
// app.get('/api/songs/year/:year(\\d{4})', (req, res) => {
//     const year = parseInt(req.params.year, 10); // Convert the year string to an integer

//     if (isNaN(year)) {
//         // This check might be redundant due to regex, but good for robustness
//         return res.status(400).json({ message: 'Invalid year format. Please use YYYY (e.g., /api/songs/year/1965).' });
//     }

//     const songsInYear = songs.filter(song => song.year === year);

//     if (songsInYear.length === 0) {
//         return res.status(404).json({ message: `No songs found for the year ${year}` });
//     }

//     res.json(songsInYear);
// });

// --- API Routes for Locations ---
// GET all locations or filter by city
app.get('/api/locations', (req, res, next) => {
    const { city } = req.query; // Extract 'city' query parameter
    if (city) {
        // Filter locations by city (case-insensitive)
        const filteredLocations = locations.filter(loc =>
            loc.city.toLowerCase().includes(city.toLowerCase())
        );
        return res.json(filteredLocations);
    }
    res.json(locations); // Return all locations if no filter
    next();
});

// GET a single location by ID
app.get('/api/locations/:id', (req, res, next) => {
    const location = locations.find(l => l.id === req.params.id);
    if (!location) {
        return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location);
    next();
});

// POST a new location
app.post('/api/locations', (req, res, next) => {
    // Ensure required fields are present
    const { name, city, country, description } = req.body;
    if (!name || !city || !country || !description) {
        return res.status(400).json({ message: 'Name, city, country and description are required' });
    }

    const newLocation = {
        id: uuidv4(), // Generate a unique ID using uuid
        name,
        city,
        country,
        description
    };

    locations.push(newLocation); // Add the new location to in-memory array
    res.status(201).json(newLocation); // Respond with the created location and 201 Created status code
    next();
});

// DELETE a location
app.delete('/api/locations/:id', (req, res, next) => {
    const locationId = req.params.id;
    const initialLength = locations.length;
    // Filter out the location with the given ID
    locations = locations.filter(loc => loc.id !== locationId);

    if (locations.length === initialLength) {
        // If length hasn't changed, no location was found/deleted
        return res.status(404).json({ message: 'Location not found' });
    }

    res.status(204).send(); // Respond with 204 No Content status code (successful deletion)
    next();
});


// --- View Engine Setup ---
// Set the directory for views (template files)
app.set('views', path.join(__dirname, 'views'));
// Set EJS as the view engine
app.set('view engine', 'ejs');

// --- Static Files Setup ---
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


// --- Error-Handling Middleware ---
app.use((err, req, res, next) => {
    console.error(err.stack); // Log error stack to console for debugging purposes
    res.status(500).json({ // Send 500 Internal Server Error response
        message: 'Something went wrong!'
    });
});

// --- Server Listener ---
// Start the server and listen for incoming requests on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});