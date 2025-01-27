import { toast } from "sonner";

export interface User {
  id: number;
  name: string;
  email: string;
  department?: string;
}

const BASE_URL = 'https://jsonplaceholder.typicode.com/users';

// Keep track of deleted users locally since JSONPlaceholder doesn't actually delete
const deletedUserIds = new Set<number>();

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  const users = await response.json();
  // Filter out any previously deleted users
  return users.filter((user: User) => !deletedUserIds.has(user.id));
};

export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(userData),
    headers: {
      'Content-type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  return response.json();
};

export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
    headers: {
      'Content-type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to update user');
  }
  return response.json();
};

export const deleteUser = async (id: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
  // Add the deleted user ID to our local set
  deletedUserIds.add(id);
};
