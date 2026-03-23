import React, { useCallback, useEffect, useMemo, useState } from "react";
import UserForm from "./UserForm";
import { useUsers } from "../hooks/useUsers";
import { User } from "../types/user";

type UserFormValues = Omit<User, "id">;

const MESSAGE_TIMEOUT = 3000;

const buttonStyle = {
  border: "none",
  borderRadius: 4,
  padding: "6px 10px",
  cursor: "pointer",
};

const UserList: React.FC = () => {
  const { users, loading, error, createUser, deleteUser, updateUser } = useUsers();
  const [notification, setNotification] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    if (!notification) return;
    const timer = window.setTimeout(() => setNotification(null), MESSAGE_TIMEOUT);

    return () => window.clearTimeout(timer);
  }, [notification]);

  const showMessage = useCallback((msg: string) => setNotification(msg), []);

  const handleCreateUser = useCallback(async (userData: UserFormValues) => {
    const created = await createUser(userData);
    if (created) {
      showMessage(`User ${created.name} created successfully.`);
    } else {
      showMessage("Failed to create user.");
    }
  }, [createUser, showMessage]);

  const handleDeleteUser = useCallback(async (id: string) => {
    const deleted = await deleteUser(id);
    if (deleted) {
      setEditingUser((current) => (current?.id === id ? null : current));
      showMessage("User deleted successfully.");
    } else {
      showMessage("Failed to delete user.");
    }
  }, [deleteUser, showMessage]);

  const handleEditUser = useCallback((user: User) => {
    setEditingUser(user);
    setNotification(null);
  }, []);

  const handleUpdateUser = useCallback(async (formData: UserFormValues) => {
    if (!editingUser) return;
    const updated = await updateUser(editingUser.id, formData);
    if (updated) {
      setEditingUser(null);
      showMessage(`User ${updated.name} updated successfully.`);
    } else {
      showMessage("Failed to update user.");
    }
  }, [editingUser, updateUser, showMessage]);

  const actionButtons = useCallback((user: User) => (
    <>
      <button
        onClick={() => handleEditUser(user)}
        style={{ ...buttonStyle, backgroundColor: "#2563eb", color: "white", marginRight: 8 }}
        aria-label={`Edit ${user.name}`}
      >
        Edit
      </button>
      <button
        onClick={() => handleDeleteUser(user.id)}
        style={{ ...buttonStyle, backgroundColor: "#b91c1c", color: "white" }}
        aria-label={`Delete ${user.name}`}
      >
        Delete
      </button>
    </>
  ), [handleDeleteUser, handleEditUser]);

  const userRows = useMemo(() => {
    if (users.length === 0) {
      return (
        <tr>
          <td colSpan={4} style={{ textAlign: "center", padding: "12px" }}>
            No users available.
          </td>
        </tr>
      );
    }

    return users.map((user) => (
      <tr key={user.id}>
        <td style={{ border: "1px solid #ccc", padding: "8px" }}>{user.name}</td>
        <td style={{ border: "1px solid #ccc", padding: "8px" }}>{user.email}</td>
        <td style={{ border: "1px solid #ccc", padding: "8px" }}>{user.role}</td>
        <td style={{ border: "1px solid #ccc", padding: "8px" }}>{actionButtons(user)}</td>
      </tr>
    ));
  }, [users, actionButtons]);

  if (loading) return <p role="status">Loading users...</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <header style={{ marginBottom: 24 }}>
        <h1>User Management</h1>
        {notification && (
          <p role="status" style={{ color: "#166534", marginTop: 8 }}>
            {notification}
          </p>
        )}
      </header>

      <section aria-labelledby="user-form-heading" style={{ marginBottom: 24 }}>
        <h2 id="user-form-heading">{editingUser ? "Edit User" : "Create User"}</h2>
        <UserForm
          key={editingUser?.id || "create"}
          initialData={editingUser ? { name: editingUser.name, email: editingUser.email, role: editingUser.role } : undefined}
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
        />

        {editingUser && (
          <button
            type="button"
            onClick={() => setEditingUser(null)}
            style={{ marginTop: 12, ...buttonStyle, backgroundColor: "#6b7280", color: "white" }}
          >
            Cancel Edit
          </button>
        )}
      </section>

      <section aria-labelledby="user-list-heading">
        <h2 id="user-list-heading">User List</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Name</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Email</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Role</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>{userRows}</tbody>
        </table>
      </section>
    </main>
  );
};

export default React.memo(UserList);

