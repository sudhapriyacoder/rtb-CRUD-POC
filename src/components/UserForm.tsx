import React, { useState, useEffect } from "react";
import { User } from "../types/user";

interface UserFormProps {
  initialData?: Omit<User, "id">;
  onSubmit: (user: Omit<User, "id">) => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  role?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserForm: React.FC<UserFormProps> = ({ initialData, onSubmit }) => {
  const [form, setForm] = useState<Omit<User, "id">>(
    initialData ?? { name: "", email: "", role: "viewer" }
  );

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setForm(initialData ?? { name: "", email: "", role: "viewer" });
  }, [initialData]);

  const validate = (): boolean => {
    const currentErrors: FormErrors = {};

    if (!form.name.trim()) {
      currentErrors.name = "Name is required.";
    }

    if (!form.email.trim()) {
      currentErrors.email = "Email is required.";
    } else if (!emailRegex.test(form.email)) {
      currentErrors.email = "Email is invalid.";
    }

    if (!form.role.trim()) {
      currentErrors.role = "Role is required.";
    }

    setErrors(currentErrors);

    return Object.keys(currentErrors).length === 0;
  };

  const handleChange = (key: keyof Omit<User, "id">, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit(form);
    setForm({ name: "", email: "", role: "viewer" });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, textAlign: 'center' }}>
      <h2>{initialData ? "Edit User" : "Create User"}</h2>

      <div style={{ marginBottom: 12 }}>
        <label>
          Name:
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>
        {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>
          Email:
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>
          Role:
          <select
            value={form.role}
            onChange={(e) => handleChange("role", e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </label>
        {errors.role && <p style={{ color: "red" }}>{errors.role}</p>}
      </div>

      <button type="submit" style={{ padding: "8px 16px" }}>
        {initialData ? "Save" : "Create"}
      </button>
    </form>
  );
};

export default UserForm;
