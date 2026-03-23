import { User } from "../types/user";

let mockUsers: User[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "admin" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "editor" },
  { id: "3", name: "Carol Davis", email: "carol@example.com", role: "viewer" },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getUsers(): Promise<User[]> {
  await delay(150);
  return [...mockUsers];
}

export async function addUser(newUser: Omit<User, "id">): Promise<User> {
  await delay(150);
  const id = String(Date.now() + Math.floor(Math.random() * 1000));
  const created = { id, ...newUser };
  mockUsers = [...mockUsers, created];
  return created;
}

export async function updateUser(id: string, updates: Partial<Omit<User, "id">>): Promise<User | null> {
  await delay(150);
  const index = mockUsers.findIndex((u) => u.id === id);
  if (index === -1) return null;

  const updatedUser = { ...mockUsers[index], ...updates };
  mockUsers = mockUsers.map((u) => (u.id === id ? updatedUser : u));
  return updatedUser;
}

export async function deleteUser(id: string): Promise<boolean> {
  await delay(150);
  const exists = mockUsers.some((u) => u.id === id);
  if (!exists) return false;

  mockUsers = mockUsers.filter((u) => u.id !== id);
  return true;
}
