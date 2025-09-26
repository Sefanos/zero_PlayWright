// in-memory data store for mock API
let nextId = 1;
const users = [
    { id: 1, email: 'user@example.com', password: 'password', name: 'Demo User' }
];

const destinations: Array<any> = [];
export { users, destinations, nextId };
