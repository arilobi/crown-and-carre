import { useContext, useState } from "react";
import { ProductContext } from "../Contexts/ProductContext";
import { UserContext } from "../Contexts/UserContext";
import { useScrollAnimation } from "../components/hooks/useScrollAnimations";
import { FaHeart } from "react-icons/fa";
import '../components/StoreWish.css';
import { useNavigate } from "react-router-dom";

const PRODUCTS_PER_PAGE = 8;

export default function Store(){
    const { products, addToWishlist, wishlist } = useContext(ProductContext);
    const { current_user } = useContext(UserContext);
    const isAdmin = current_user?.role?.toLowerCase() === "admin";
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const currentProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

    const isInWishlist = (product_id) => 
        wishlist?.some((item) => item.product_id === product_id);

    useScrollAnimation();

    return(
        <div className="store-wrapper animate-fadeUp" style={{ transitionDelay: '0.1s' }}>
            <div className="store-grid">
                {currentProducts.map((product, index) => (
                    <div
                        key={product.id}
                        className="store-card stagger-item"
                        style={{ transitionDelay: `${index * 0.15}s` }}
                    >
                        {/* Image */}
                        <div
                            className="store-card-img-wrapper"
                            onClick={() => navigate(`/singleproduct/${product.id}`)}
                            style={{ cursor: "pointer" }}
                        >
                            <img
                                src={`http://127.0.0.1:5000/static/uploads/${product.image_filename}`}
                                alt={product.name}
                                className="store-card-img"
                            />
                            {/* Wishlist icon */}
                            {!isAdmin && (
                                <button
                                    className={`wishlist-btn ${isInWishlist(product.id) ? "wishlisted" : ""}`}
                                    onClick={(e) => {
                                        e.stopPropagation(); // prevent navigating to product page
                                        addToWishlist(product.id);
                                    }}
                                    title={isInWishlist(product.id) ? "In your wishlist" : "Add to wishlist"}
                                >
                                    <FaHeart />
                                </button>
                            )}
                        </div>

                        {/* Info */}
                        <div
                            className="store-card-info"
                            onClick={() => navigate(`/singleproduct/${product.id}`)}
                            style={{ cursor: "pointer" }}
                        >
                            <h3 className="store-card-title">{product.name}</h3>
                            <div className="store-card-footer">
                                <span className="store-card-price">${product.price}.00</span>
                                {product.availability > 0 ? (
                                    <button
                                        className="store-card-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/singleproduct/${product.id}`);
                                        }}
                                    >
                                        GET
                                    </button>
                                ) : (
                                    <button className="store-card-btn out-of-stock" disabled>
                                        OUT OF STOCK
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="store-pagination">
                    <button
                        className="store-page-btn"
                        onClick={() => setCurrentPage((p) => p - 1)}
                        disabled={currentPage === 1}
                    >
                        &larr; Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            className={`store-page-btn ${currentPage === page ? "active" : ""}`}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        className="store-page-btn"
                        onClick={() => setCurrentPage((p) => p + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next &rarr;
                    </button>
                </div>
            )}
        </div>
    );
}