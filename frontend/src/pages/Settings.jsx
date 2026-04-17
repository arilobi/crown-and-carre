import { useContext, useState } from "react";
import { UserContext } from "../Contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function Settings() {
    const { current_user, updateUser, deleteUser, logout } = useContext(UserContext);
    const navigate = useNavigate();

    const [name, setName] = useState(current_user?.name || "");
    const [email, setEmail] = useState(current_user?.email || "");
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        if (!name || !email) {
            return;
        }
        updateUser(current_user.id, name, email);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setName(current_user?.name || "");
        setEmail(current_user?.email || "");
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
            deleteUser(current_user.id);
        }
    };

    return (
        <div className="settings-wrapper">
            <h1 className="settings-title">Settings</h1>

            {/* Profile Section */}
            <div className="settings-card">
                <div className="settings-card-header">
                    <h2 className="settings-section-title">Profile</h2>
                    {!isEditing && (
                        <button
                            className="settings-edit-btn"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <form onSubmit={handleSave} className="settings-form">
                        <div className="settings-field">
                            <label>Name</label>
                            <input
                                type="text"
                                className="settings-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name"
                            />
                        </div>
                        <div className="settings-field">
                            <label>Email</label>
                            <input
                                type="email"
                                className="settings-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email"
                            />
                        </div>
                        <div className="settings-form-actions">
                            <button type="submit" className="settings-save-btn">
                                Save Changes
                            </button>
                            <button
                                type="button"
                                className="settings-cancel-btn"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="settings-info">
                        <div className="settings-info-row">
                            <span className="settings-info-label">Name</span>
                            <span className="settings-info-value">{current_user?.name}</span>
                        </div>
                        <div className="settings-info-row">
                            <span className="settings-info-label">Email</span>
                            <span className="settings-info-value">{current_user?.email}</span>
                        </div>
                        <div className="settings-info-row">
                            <span className="settings-info-label">Role</span>
                            <span className="settings-info-value">
                                <span className={`settings-role-badge ${current_user?.role?.toLowerCase()}`}>
                                    {current_user?.role}
                                </span>
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Account Actions */}
            <div className="settings-card">
                <h2 className="settings-section-title">Account</h2>
                <div className="settings-actions">
                    <div className="settings-action-row">
                        <div>
                            <p className="settings-action-label">Log Out</p>
                            <p className="settings-action-desc">Sign out of your account</p>
                        </div>
                        <button className="settings-logout-btn" onClick={logout}>
                            Log Out
                        </button>
                    </div>
                    <div className="settings-action-row danger">
                        <div>
                            <p className="settings-action-label">Delete Account</p>
                            <p className="settings-action-desc">Permanently delete your account and all data</p>
                        </div>
                        <button className="settings-delete-btn" onClick={handleDelete}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}