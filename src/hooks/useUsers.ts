import { useCallback, useEffect, useState } from "react";
import { User } from "../types/user";

export type UserPayload = Omit<User, "id">;

export interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  createUser: (payload: UserPayload) => Promise<User | null>;
  updateUser: (id: string, payload: Partial<UserPayload>) => Promise<User | null>;
  deleteUser: (id: string) => Promise<boolean>;
}

const STATIC_USERS_URL = `${process.env.PUBLIC_URL || ""}/assets/mockUsers.json`;
const LOCAL_STORAGE_KEY = "usersData";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};

const loadFromLocalStorage = (): User[] | null => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveToLocalStorage = (users: User[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.warn("Failed to save users to localStorage:", err);
  }
};

export function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // First, try to load from localStorage (for persisted changes)
      const localData = loadFromLocalStorage();
      if (localData) {
        setUsers(localData);
        setLoading(false);
        return;
      }

      // Otherwise, fetch from asset
      const response = await fetch(STATIC_USERS_URL);
      if (!response.ok) {
        throw new Error(`Unable to load users: ${response.status} ${response.statusText}`);
      }

      const text = await response.text();
      if (!text.trim().startsWith("[")) {
        throw new Error("Invalid mockUsers.json response: not JSON array");
      }

      const data = JSON.parse(text) as User[];
      setUsers(data);
      saveToLocalStorage(data); // Save initial data to localStorage
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (payload: UserPayload) => {
    setLoading(true);
    setError(null);

    try {
      const newUser: User = { id: Date.now().toString(), ...payload };
      setUsers((prev) => {
        const updated = [...prev, newUser];
        saveToLocalStorage(updated);
        return updated;
      });
      return newUser;
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, payload: Partial<UserPayload>) => {
    setLoading(true);
    setError(null);

    try {
      const existing = users.find((u) => u.id === id);
      if (!existing) throw new Error("User not found");

      const updated = { ...existing, ...payload };
      setUsers((prev) => {
        const updatedList = prev.map((u) => (u.id === id ? updated : u));
        saveToLocalStorage(updatedList);
        return updatedList;
      });
      return updated;
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, [users]);

  const deleteUser = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const exists = users.some((u) => u.id === id);
      if (!exists) throw new Error("User not found");

      setUsers((prev) => {
        const updated = prev.filter((u) => u.id !== id);
        saveToLocalStorage(updated);
        return updated;
      });
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, [users]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}
