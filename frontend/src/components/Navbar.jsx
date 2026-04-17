import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import ccLogo from "../assets/ccLogo.png";
import { FaHeart, FaPlus, FaClipboardList, FaUsers, FaSignOutAlt, FaCog } from "react-icons/fa";
import { UserContext } from "../Contexts/UserContext";

const LOGGED_OUT_LINKS = [
  { label: "About", to: "/about" },
  { label: "Log in", to: "/login" },
];

const LOGGED_IN_LINKS = [
  { label: "About", to: "/about" },
  { label: "Products", to: "/store" },
  { label: "Orders", to: "/orders" },
];

const ADMIN_LINKS = [
  { label: "All Orders", to: "/admin/orders" },
  { label: "Manage Products", to: "/admin/products" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { authToken, current_user, loading } = useContext(UserContext);
  const isLoggedIn = !!authToken;
  const isAdmin = current_user?.role?.toLowerCase() === "admin";

  // To change color when scrolling down for visibility
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading) return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src={ccLogo} alt="Logo of Crown and Carre" className="logo-image" />
      </Link>
    </nav>
  );

  const NAV_LINKS = !isLoggedIn
    ? LOGGED_OUT_LINKS
    : isAdmin
      ? ADMIN_LINKS
      : LOGGED_IN_LINKS;

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        {/* Logo */}
        <Link to="/" className="logo">
          <img src={ccLogo} alt="Logo of Crown and Carre" className="logo-image" />
        </Link>

        {/* Desktop Links */}
        <ul className="nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}

          {isLoggedIn && (
            <>
              {isAdmin ? (
                <>
                  <li>
                    <Link to="/addproduct" className="admin-icon" title="Add a product">
                      <FaPlus />
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/users" className="admin-icon" title="Manage users">
                      <FaUsers />
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/wishlist" className="wishlist-icon" title="Wishlist">
                    <FaHeart />
                  </Link>
                </li>
              )}

              <li>
                <Link to="/settings" className="admin-icon" title="Settings">
                    <FaCog />
                </Link>
              </li>
            </>
          )}

          {!isLoggedIn && (
            <li>
              <Link to="https://mail.google.com/mail/?view=cm&fs=1&to=marionnabulobi@gmail.com" target="_blank" className="nav-cta">Get in touch</Link>
            </li>
          )}
        </ul>

        {/* Hamburger button */}
        <button
          className={`hamburger${menuOpen ? " open" : ""}`}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile Dropdown */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}

        {isLoggedIn && (
          <>
            {isAdmin ? (
              <>
                <Link to="/addproduct" onClick={() => setMenuOpen(false)}>
                  <FaPlus /> Add Product
                </Link>
                <Link to="/admin/orders" onClick={() => setMenuOpen(false)}>
                  <FaClipboardList /> All Orders
                </Link>
                <Link to="/admin/users" onClick={() => setMenuOpen(false)}>
                  <FaUsers /> Manage Users
                </Link>
              </>
            ) : (
              <Link to="/wishlist" onClick={() => setMenuOpen(false)}>
                <FaHeart /> Wishlist
              </Link>
            )}

            <Link to="/settings" onClick={() => setMenuOpen(false)}>
              <FaCog /> Settings
            </Link>
          </>
        )}

        {!isLoggedIn && (
          <Link to="https://mail.google.com/mail/?view=cm&fs=1&to=marionnabulobi@gmail.com" target="_blank" className="mobile-cta" onClick={() => setMenuOpen(false)}>
            Get in touch
          </Link>
        )}
      </div>
    </>
  );
}