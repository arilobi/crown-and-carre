import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(() => sessionStorage.getItem("token"));
  const [current_user, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // LOGIN
  const login = (email, password) => {
    const toastId = toast.loading("Logging you in...");

    fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((resp) => resp.json())
      .then((response) => {
        if (response.access_token) {
          sessionStorage.setItem("token", response.access_token);
          setAuthToken(response.access_token);
          setCurrentUser(response.user);
          toast.update(toastId, { render: "Login successful!", type: "success", isLoading: false, autoClose: 3000 });
          if (response.user?.role?.toLowerCase() === "admin") {
            navigate("/admin/orders");
          } else {
            navigate("/store");
          }
        } else if (response.error) {
          toast.update(toastId, { render: response.error, type: "error", isLoading: false, autoClose: 3000 });
        } else {
          toast.update(toastId, { render: "Failed to login", type: "error", isLoading: false, autoClose: 3000 });
        }
      })
      .catch((err) => {
        toast.update(toastId, { render: "Failed to login", type: "error", isLoading: false, autoClose: 3000 });
        console.error("Login error:", err);
      });
  };

  // LOGOUT
  const logout = () => {
    const toastId = toast.loading("Logging out...");

    fetch("http://127.0.0.1:5000/logout", {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((resp) => resp.json())
      .then((response) => {
        if (response.success) {
          sessionStorage.removeItem("token");
          setAuthToken(null);
          setCurrentUser(null);
          setLoading(false);
          toast.update(toastId, { render: "Successfully logged out", type: "success", isLoading: false, autoClose: 3000 });
          navigate("/login");
        } else if (response.error) {
          toast.update(toastId, { render: response.error, type: "error", isLoading: false, autoClose: 3000 });
        }
      })
      .catch((err) => {
        toast.update(toastId, { render: "Logout failed", type: "error", isLoading: false, autoClose: 3000 });
        console.error("Logout error:", err);
      });
  };

  // FETCH CURRENT USER
  const fetchCurrentUser = () => {
    fetch("http://127.0.0.1:5000/current_user", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          sessionStorage.removeItem("token");
          setAuthToken(null);
          setCurrentUser(null);
          return null;
        }
        return response.json();
      })
      .then((response) => {
        if (!response) return;
        if (response.email) {
          setCurrentUser(response);
        }
      })
      .catch((err) => console.error("Failed to fetch current user:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (authToken) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [authToken]);

  // REGISTER
  const addUser = (name, email, password) => {
    const toastId = toast.loading("Registering...");

    fetch("http://127.0.0.1:5000/users", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
      .then((resp) => resp.json())
      .then((response) => {
        if (response.message) {
          toast.update(toastId, { render: "Registered successfully!", type: "success", isLoading: false, autoClose: 3000 });
          navigate("/store");
        } else if (response.error) {
          toast.update(toastId, { render: response.error, type: "error", isLoading: false, autoClose: 3000 });
        } else {
          toast.update(toastId, { render: "Failed to register", type: "error", isLoading: false, autoClose: 3000 });
        }
      })
      .catch((err) => {
        toast.update(toastId, { render: "Failed to register", type: "error", isLoading: false, autoClose: 3000 });
        console.error("Register error:", err);
      });
  };

  // FETCH ALL USERS
  const fetchAllUsers = () => {
    fetch("http://127.0.0.1:5000/users", {
        method: "GET",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("Users response:", data); 
      if (data.users) setUsers(data.users);
    })
    .catch((err) => console.error("Failed to fetch users:", err));
};

  // UPDATE USER
  const updateUser = (user_id, updatedName, updatedEmail) => {
    const toastId = toast.loading("Updating user...");

    fetch(`http://127.0.0.1:5000/users/${user_id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ name: updatedName, email: updatedEmail }),
    })
      .then((resp) => resp.json())
      .then((response) => {
        if (response.message) {
          toast.update(toastId, { render: "User updated successfully!", type: "success", isLoading: false, autoClose: 3000 });
          fetchCurrentUser();
        } else if (response.error) {
          toast.update(toastId, { render: response.error, type: "error", isLoading: false, autoClose: 3000 });
        } else {
          toast.update(toastId, { render: "Failed to update user", type: "error", isLoading: false, autoClose: 3000 });
        }
      })
      .catch((err) => {
        toast.update(toastId, { render: "Failed to update user", type: "error", isLoading: false, autoClose: 3000 });
        console.error("Update user error:", err);
      });
  };

  // DELETE USER - (Admin)
  const adminDeleteUser = (user_id) => {
    const toastId = toast.loading("Deleting user...");

    fetch(`http://127.0.0.1:5000/users/${user_id}`, {
        method: "DELETE",
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.message) {
            toast.update(toastId, { render: "User deleted successfully!", type: "success", isLoading: false, autoClose: 3000 });
            fetchAllUsers(); // refresh list
        } else if (data.error) {
            toast.update(toastId, { render: data.error, type: "error", isLoading: false, autoClose: 3000 });
        }
    })
    .catch((err) => {
        toast.update(toastId, { render: "Failed to delete user", type: "error", isLoading: false, autoClose: 3000 });
        console.error(err);
    });
};

  // DELETE USER - (User)
  const deleteUser = (user_id) => {
    const toastId = toast.loading("Deleting user...");

    fetch(`http://127.0.0.1:5000/users/${user_id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((resp) => resp.json())
      .then((response) => {
        if (response.message) {
          toast.update(toastId, { render: "User deleted successfully!", type: "success", isLoading: false, autoClose: 3000 });
          logout();
        } else if (response.error) {
          toast.update(toastId, { render: response.error, type: "error", isLoading: false, autoClose: 3000 });
        } else {
          toast.update(toastId, { render: "Failed to delete user", type: "error", isLoading: false, autoClose: 3000 });
        }
      })
      .catch((err) => {
        toast.update(toastId, { render: "Failed to delete user", type: "error", isLoading: false, autoClose: 3000 });
        console.error("Delete user error:", err);
      });
  };

  const data = {
    authToken,
    current_user,
    loading,
    login,
    logout,
    addUser,
    users,           
    fetchAllUsers,   
    adminDeleteUser,
    updateUser,
    deleteUser,
  };

  return (
    <UserContext.Provider value={data}>
      {children}
    </UserContext.Provider>
  );
};