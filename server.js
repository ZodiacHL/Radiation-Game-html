const express = require('express');
const path = require('path');
const app = express();

// Serve static files (like CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve your HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});