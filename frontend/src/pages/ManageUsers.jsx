import { useContext, useEffect, useState } from "react";
import { UserContext } from "../Contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function ManageUsers() {
    const { users, fetchAllUsers, adminDeleteUser, current_user, loading } = useContext(UserContext);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const isAdmin = current_user?.role?.toLowerCase() === "admin";

    useEffect(() => {
        if (!loading && !isAdmin) navigate("/login");
    }, [loading, isAdmin]);

    useEffect(() => {
        if (isAdmin) fetchAllUsers();
    }, [isAdmin]);

    if (loading) return <div className="mu-wrapper">Loading...</div>;
    if (!isAdmin) return null;

    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            adminDeleteUser(id);
        }
    };

    return (
        <div className="mu-wrapper">
            <div className="mu-header">
                <div className="mu-header-left">
                    <h1 className="mu-title">Manage Users</h1>
                    <span className="mu-count">{users.length} users</span>
                </div>
            </div>

            {/* Search */}
            <input
                type="text"
                className="mu-search"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {filteredUsers.length === 0 ? (
                <div className="mu-empty">
                    <p>No users found.</p>
                </div>
            ) : (
                <div className="mu-table-wrapper">
                    <table className="mu-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>#{user.id}</td>
                                    <td className="mu-name">{user.name}</td>
                                    <td className="mu-email">{user.email}</td>
                                    <td>
                                        <span className={`mu-role-badge ${user.role?.toLowerCase()}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="mu-date">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                        {/* Prevent admin from deleting themselves */}
                                        {user.id !== current_user?.id ? (
                                            <button
                                                className="mu-delete-btn"
                                                onClick={() => handleDelete(user.id, user.name)}
                                            >
                                                Delete
                                            </button>
                                        ) : (
                                            <span className="mu-you">You</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}