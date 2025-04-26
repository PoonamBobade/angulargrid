const jsonServer = require('json-server');
const fs = require('fs');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));  // Path to your db.json file
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Update employee (PUT request)
server.put('/employees/:id', (req, res) => {
  const employeeId = req.params.id;
  const updatedEmployee = req.body;  // Get the updated employee data from the request body
  
  // Find the employee in the db.json and update it
  const employees = router.db.get('employees').value();
  const employeeIndex = employees.findIndex(emp => emp.id === employeeId);
  
  if (employeeIndex !== -1) {
    // Replace the old employee data with the new one
    employees[employeeIndex] = { ...employees[employeeIndex], ...updatedEmployee };
    
    // Write the updated data back to db.json
    fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(router.db.getState(), null, 2));

    res.status(200).json(employees[employeeIndex]);  // Return the updated employee
  } else {
    res.status(404).send('Employee not found');
  }
});

// Add new employee (POST request)
server.post('/employees', (req, res) => {
  const newEmployee = req.body;  // Get the new employee data from the request body
  
  // Add the new employee to the db.json
  const employees = router.db.get('employees').value();
  employees.push(newEmployee);
  
  // Write the updated data back to db.json
  fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(router.db.getState(), null, 2));

  res.status(201).json(newEmployee);  // Return the newly added employee
});

// Save updated database to db.json after each request (optional)
router.render = (req, res) => {
  res.jsonp(res.locals.data);
  fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(router.db.getState(), null, 2));
};

server.use(router);

server.listen(3000, () => {
  console.log('🚀 JSON Server is running at http://localhost:3000');
});
