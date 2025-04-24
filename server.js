const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const dataFilePath = path.join(__dirname, 'employees.json');

// Middleware to parse JSON requests
app.use(express.json());

// Route to save employee data to a JSON file
app.post('/save-employees', (req, res) => {
  const employees = req.body; // Get employee data from request
  fs.writeFileSync(dataFilePath, JSON.stringify(employees, null, 2)); // Save to employees.json
  res.status(200).send('Data saved successfully');
});

// Route to get employee data from the JSON file
app.get('/get-employees', (req, res) => {
  try {
    const rawData = fs.readFileSync(dataFilePath);
    const employees = JSON.parse(rawData.toString());
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).send('Error reading data');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
