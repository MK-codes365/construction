import sha256 from 'crypto-js/sha256';

// Development user seed. Passwords are stored as SHA256(password) for this demo.
// In production use bcrypt and a real database.

export type UserRecord = {
  id: string;
  username: string;
  email: string;
  passwordHash: string; // sha256 hex
  role: string;
  name?: string;
};

const users: UserRecord[] = [
  {
    id: 'u-admin',
    username: 'admin',
    email: 'admin@example.com',
    passwordHash: sha256('Passw0rd!').toString(),
    role: 'admin',
    name: 'Administrator',
  },
  {
    id: 'u-manager',
    username: 'manager_john',
    email: 'john.manager@example.com',
    passwordHash: sha256('Manager123!').toString(),
    role: 'manager',
    name: 'John Manager',
  },
  {
    id: 'u-foreman',
    username: 'foreman_anna',
    email: 'anna.foreman@example.com',
    passwordHash: sha256('Foreman123!').toString(),
    role: 'foreman',
    name: 'Anna Foreman',
  },
  {
    id: 'u-worker',
    username: 'worker_mike',
    email: 'mike.worker@example.com',
    passwordHash: sha256('Worker123!').toString(),
    role: 'worker',
    name: 'Mike Worker',
  },
  {
    id: 'u-auditor',
    username: 'auditor_sam',
    email: 'sam.auditor@example.com',
    passwordHash: sha256('Audit123!').toString(),
    role: 'auditor',
    name: 'Sam Auditor',
  },
];

export function findUserByEmailOrUsername(identifier: string) {
  return users.find(u => u.email === identifier || u.username === identifier);
}

export function addUser(user: UserRecord) {
  users.push(user);
}

export default users;
