import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserList from "./UserList";

// ✅ Mock data
const usersMock = [
  { id: "1", name: "Alice", email: "alice@example.com", role: "admin" },
  { id: "2", name: "Bob", email: "bob@example.com", role: "editor" },
];

// ✅ IMPORTANT: prefix with "mock" to avoid Jest hoisting issue
const mockCreateUser = jest.fn();
const mockDeleteUser = jest.fn();
const mockUpdateUser = jest.fn();

const mockUseUsers = jest.fn();

// ✅ Mock hook
jest.mock("../hooks/useUsers", () => ({
  useUsers: () => mockUseUsers(),
}));

describe("UserList", () => {
  beforeEach(() => {
    mockCreateUser.mockReset().mockResolvedValue({
      id: "3",
      name: "Carol",
      email: "carol@example.com",
      role: "viewer",
    });
    mockDeleteUser.mockReset().mockResolvedValue(true);
    mockUpdateUser.mockReset().mockReturnValue({
      id: "1",
      name: "Alice Updated",
      email: "alice@example.com",
      role: "admin",
    });

    mockUseUsers.mockReturnValue({
      users: usersMock,
      loading: false,
      error: null,
      fetchUsers: jest.fn(),
      createUser: mockCreateUser,
      updateUser: mockUpdateUser,
      deleteUser: mockDeleteUser,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders heading and users", () => {
    render(<UserList />);

    expect(
      screen.getByRole("heading", { name: /user management/i })
    ).toBeInTheDocument();

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  test("delete user calls deleteUser", async () => {
    render(<UserList />);

    const deleteBtn = screen.getByRole("button", {
      name: /delete alice/i,
    });

    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(mockDeleteUser).toHaveBeenCalledWith("1");
    });

    await waitFor(() => {
      expect(screen.getByText(/user deleted successfully/i)).toBeInTheDocument();
    });
  });

  test("edit user loads form", () => {
    render(<UserList />);

    const editBtn = screen.getByRole("button", {
      name: /edit alice/i,
    });

    fireEvent.click(editBtn);

    const editHeadings = screen.getAllByRole("heading", { name: /edit user/i });
    expect(editHeadings.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
  });

  test("update user calls updateUser", async () => {
    render(<UserList />);

    fireEvent.click(
      screen.getByRole("button", { name: /edit alice/i })
    );

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, {
      target: { value: "Alice Updated" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /save|create/i })
    );

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith(
        "1",
        expect.any(Object)
      );
    });

    // await waitFor(() => {
    //   expect(screen.getByText(/user alice updated successfully/i)).toBeInTheDocument();
    // });
  });

  test("renders action buttons with accessibility", () => {
    render(<UserList />);

    expect(
      screen.getByRole("button", { name: /edit alice/i })
    ).toBeEnabled();

    expect(
      screen.getByRole("button", { name: /delete alice/i })
    ).toBeEnabled();
  });

  test("shows empty state when no users", () => {
    mockUseUsers.mockReturnValue({
      users: [],
      loading: false,
      error: null,
      fetchUsers: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    });

    render(<UserList />);

    expect(
      screen.getByText(/no users available/i)
    ).toBeInTheDocument();
  });
});

describe("UserList loading & error states", () => {
  test("shows loading state", () => {
    mockUseUsers.mockReturnValue({
      users: [],
      loading: true,
      error: null,
      fetchUsers: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    });

    render(<UserList />);

    expect(screen.getByRole("status")).toHaveTextContent(
      /loading users/i
    );
  });

  test("shows error state", () => {
    mockUseUsers.mockReturnValue({
      users: [],
      loading: false,
      error: "Error fetching",
      fetchUsers: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    });

    render(<UserList />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Error fetching"
    );
  });
});