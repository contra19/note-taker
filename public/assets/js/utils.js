// Import required modules
const fs = require('fs');
const path = require('path');
const dbPath = path.resolve(__dirname, '../../..', 'db', 'db.json');

// Function to read the database
const readDb = (callback) => {
  fs.readFile(dbPath, 'utf8', (error, data) => {
    if (error) {
      console.error('Error reading database:', error);
      return callback(error);
    }
    try {
      const notes = JSON.parse(data);
      callback(null, notes);
    } catch (parseError) {
      console.error('Error parsing database:', parseError);
      callback(parseError);
    }
  });
};

// Function to write to the database
const writeDb = (notes, callback) => {
  fs.writeFile(dbPath, JSON.stringify(notes, null, 2), 'utf8', (error) => {
    if (error) {
      console.error('Error writing to database:', error);
      return callback(error);
    }
    callback(null);
  });
};

// Export the functions
module.exports = { readDb, writeDb };
