// in-memory data store for mock API with file persistence
import fs from 'fs';
import path from 'path';

let nextId = 1;
const users = [
    { id: 1, email: 'user@example.com', password: 'password', name: 'Demo User' }
];

const dataFilePath = path.join(process.cwd(), 'data.json');

// Load data from file or use defaults
let destinations: Array<any> = [];
try {
  const data = fs.readFileSync(dataFilePath, 'utf8');
  const parsed = JSON.parse(data);
  destinations = parsed.destinations || [];
} catch (e) {
  // File doesn't exist or invalid, use sample
  destinations = [
    { id: '1759132901860', title: 'Sample Destination', description: 'A sample destination for testing', todos: [] }
  ];
}

// Function to save data to file
function saveData() {
  const data = { destinations };
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

export { users, destinations, nextId, saveData };
