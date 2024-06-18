// Import required modules 
const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { readDb, writeDb } = require('./public/assets/js/utils.js');

// Create an instance of an express server
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for static files and parsing JSON
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// GET notes from the db.json file
app.get('/api/notes', (req, res) => {
  readDb((error, notes) => {
    if (error) {
      console.error('Error reading notes from database:', error);
      return res.status(500).json({ error: 'Error reading notes:', error });
    }
    res.json(notes);
  });
});

// POST a new note to the db.json file
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();
  readDb((error, notes) => {
    if (error) {
      console.error('Error reading notes from database:', error);
      return res.status(500).json({ error: 'Error reading notes:', error });
    }
    notes.push(newNote);
    writeDb(notes, (writeError) => {
      if (writeError) {
        console.error('Error writing note to database:', writeError);
        return res.status(500).json({ error: 'Unable to save note:', writeError });
      }
      res.json(newNote);
    });
  });
});

// DELETE a note from the db.json file
app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  readDb((error, notes) => {
    if (error) {
      console.error('Error reading notes:', error);
      return res.status(500).json({ error: 'Error reading notes:', error });
    }
    const updatedNotes = notes.filter(note => note.id !== id);
    writeDb(updatedNotes, (writeError) => {
      if (writeError) {
        console.error('Error deleting note from database:', writeError);
        return res.status(500).json({ error: 'Unable to delete note:', writeError });
      }
      res.json({ ok: true });
    });
  });
});

// GET Route for homepage
app.get('/', (req, res) => 
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes 
app.get('/notes', (req, res) => 
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.listen(PORT, () => 
  console.log(`App listening at http://localhost:${PORT}`)
);
