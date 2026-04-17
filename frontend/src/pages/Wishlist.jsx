import { useContext } from "react";
import { ProductContext } from "../Contexts/ProductContext";
import { FaHeart, FaTrash } from "react-icons/fa";
import '../components/StoreWish.css';

export default function Wishlist() {
    const { wishlist, removeFromWishlist, clearWishlist } = useContext(ProductContext);

    if (!wishlist || wishlist.length === 0) {
        return (
            <div className="wish-empty">
                <FaHeart className="wish-empty-icon" />
                <h2>Your wishlist is empty</h2>
                <p>Browse our store and add pieces you love</p>
                <a href="/store" className="wish-shop-btn">Shop Now</a>
            </div>
        );
    }

    return (
        <div className="wish-wrapper">
            <div className="wish-header">
                <h1 className="wish-title">Wishlist</h1>
                <button className="wish-clear-btn" onClick={clearWishlist}>
                    Clear All
                </button>
            </div>

            <div className="wish-grid">
                {wishlist.map((item) => (
                    <div key={item.id} className="wish-card">
                        <div className="wish-card-img-wrapper">
                            <img
                                src={`https://crown-and-carre.onrender.com/static/uploads/${item.image_filename}`}
                                alt={item.name}
                                className="wish-card-img"
                            />
                            
                            <button
                                className="wish-remove-btn"
                                onClick={() => removeFromWishlist(item.id)}
                                title="Remove from wishlist"
                            >
                                <FaTrash />
                            </button>
                        </div>

                        <div className="wish-card-info">
                            <h3 className="wish-card-title">{item.name}</h3>
                            <p className="wish-card-desc">{item.description}</p>
                            <div className="wish-card-footer">
                                <span className="wish-card-price">${item.price}.00</span>
                                {item.in_stock ? (
                                    <button className="wish-card-btn">BUY</button>
                                ) : (
                                    <button className="wish-card-btn out-of-stock" disabled>
                                        OUT OF STOCK
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}