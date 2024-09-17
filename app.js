
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(express.static('.'));

// Set up SQLite3 database
const db = new sqlite3.Database('./tickers.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});


// Create a table to store the API data
db.run(`
  CREATE TABLE IF NOT EXISTS tickers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    last REAL NOT NULL,
    buy REAL NOT NULL,
    sell REAL NOT NULL,
    volume REAL NOT NULL,
    base_unit TEXT NOT NULL
  );
`);

// Fetch top 10 results from API and store in database
app.get('/api/tickers', async (req, res) => {
  const apiResponse = await fetch('https://api.wazirx.com/api/v2/tickers');
  const data = await apiResponse.json();
  for (const key in data) {
    const ticker = data[key];
    const { name, last, buy, sell, volume, base_unit } = ticker;
    db.run(`
      INSERT INTO tickers (name, last, buy, sell, volume, base_unit)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, last, buy, sell, volume, base_unit], (err) => {
      if (err) {
        console.error(err.message);
      }
    });
  }

  res.json({ message: 'Data stored successfully' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.get('/api/data', async (req, res) => {
  db.all('SELECT * FROM tickers ORDER BY id ASC LIMIT 10', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error retrieving data');
      return;
    }
    res.json(rows);
  });
});

// Close the database connection when the server shuts down
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the database connection.');
    process.exit(0);
  });
});