import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserForm from "./UserForm";

describe("UserForm", () => {
  test("renders create user form with default states", () => {
    const onSubmit = jest.fn();
    render(<UserForm onSubmit={onSubmit} />);

    expect(screen.getByRole("heading", { name: /create user/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toHaveValue("");
    expect(screen.getByLabelText(/email/i)).toHaveValue("");
    expect(screen.getByLabelText(/role/i)).toHaveValue("viewer");
    expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();
  });

  test("shows validation errors when submitting empty form", () => {
    const onSubmit = jest.fn();
    render(<UserForm onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("shows invalid email message", () => {
    const onSubmit = jest.fn();
    render(<UserForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Foo" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "bad-email" } });
    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    expect(screen.getByText(/email is invalid/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("calls onSubmit with valid values and clears form", () => {
    const onSubmit = jest.fn();
    render(<UserForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Alice" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "alice@example.com" } });
    fireEvent.change(screen.getByLabelText(/role/i), { target: { value: "admin" } });

    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Alice",
      email: "alice@example.com",
      role: "admin",
    });
    expect(screen.getByLabelText(/name/i)).toHaveValue("");
    expect(screen.getByLabelText(/email/i)).toHaveValue("");
    expect(screen.getByLabelText(/role/i)).toHaveValue("viewer");
  });

  test("renders edit mode when initialData is provided", () => {
    const onSubmit = jest.fn();
    render(
      <UserForm
        initialData={{ name: "Bob", email: "bob@example.com", role: "editor" }}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByRole("heading", { name: /edit user/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toHaveValue("Bob");
    expect(screen.getByLabelText(/email/i)).toHaveValue("bob@example.com");
    expect(screen.getByLabelText(/role/i)).toHaveValue("editor");
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });
});