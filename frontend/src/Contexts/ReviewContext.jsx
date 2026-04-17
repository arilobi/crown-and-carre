import { createContext, useContext, useState } from "react";
import { UserContext } from "./UserContext";
import { toast } from "react-toastify";

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
    const { authToken } = useContext(UserContext);

    const [reviews, setReviews] = useState([]);
    const [onChange, setOnChange] = useState(false);

    // FETCH REVIEWS FOR A PRODUCT
    const fetchProductReviews = (product_id) => {
        fetch(`https://crown-and-carre.onrender.com/reviews/product/${product_id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.reviews) {
                    setReviews(data.reviews);
                } else {
                    setReviews([]);
                }
            })
            .catch((err) => console.error("Failed to fetch reviews:", err));
    };

    // ADD A REVIEW
    const addReview = (product_id, rating, comment) => {
        fetch("https://crown-and-carre.onrender.com/reviews", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ product_id, rating, comment }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message) {
                    toast.success("Review added successfully!");
                    setOnChange(!onChange);
                } else if (data.error) {
                    toast.error(data.error);
                }
            })
            .catch((err) => console.error("Failed to add review:", err));
    };

    // UPDATE A REVIEW
    const updateReview = (review_id, rating, comment) => {
        fetch(`https://crown-and-carre.onrender.com/reviews/${review_id}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ rating, comment }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message) {
                    toast.success("Review updated successfully!");
                    setOnChange(!onChange);
                } else if (data.error) {
                    toast.error(data.error);
                }
            })
            .catch((err) => console.error("Failed to update review:", err));
    };

    // DELETE A REVIEW
    const deleteReview = (review_id) => {
        fetch(`https://crown-and-carre.onrender.com/reviews/${review_id}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message) {
                    toast.success("Review deleted");
                    setOnChange(!onChange);
                } else if (data.error) {
                    toast.error(data.error);
                }
            })
            .catch((err) => console.error("Failed to delete review:", err));
    };

    const data = {
        reviews,
        onChange,
        fetchProductReviews,
        addReview,
        updateReview,
        deleteReview,
    };

    return (
        <ReviewContext.Provider value={data}>
            {children}
        </ReviewContext.Provider>
    );
};