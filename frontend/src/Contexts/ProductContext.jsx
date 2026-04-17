import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const navigate = useNavigate();
    const { authToken } = useContext(UserContext);

    const [products, setProducts] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [onChange, setOnChange] = useState(true);

    // FETCH ALL PRODUCTS
    useEffect(() => {
        fetch("http://127.0.0.1:5000/products", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        })
        .then((response) => response.json())
        .then((response) => {
            setProducts(response.products);
        })
        .catch((err) => console.error("Failed to fetch products:", err));
    }, [onChange]);

    // ADD A PRODUCT
    const addProduct = (name, description, price, availability, image_filename) => {
        const toastId = toast.loading("Adding product...");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("availability", availability);
        if (image_filename) {
            formData.append("image_filename", image_filename);
        }

        fetch("http://127.0.0.1:5000/products", {
            method: "POST",
            headers: { Authorization: `Bearer ${authToken}` },
            body: formData,
        })
        .then((resp) => resp.json())
        .then((response) => {
            if (response.id) {
                toast.update(toastId, { render: "Product added successfully!", type: "success", isLoading: false, autoClose: 3000 });
                setOnChange(!onChange);
                navigate("/admin/products");
            } else if (response.error) {
                toast.update(toastId, { render: response.error, type: "error", isLoading: false, autoClose: 3000 });
            } else {
                toast.update(toastId, { render: "Failed to add product", type: "error", isLoading: false, autoClose: 3000 });
            }
        })
        .catch((err) => {
            toast.update(toastId, { render: "Failed to add product", type: "error", isLoading: false, autoClose: 3000 });
            console.error("Failed to add product:", err);
        });
    };

    // UPDATE A PRODUCT
    const updateProduct = (product_id, updatedName, updatedDescription, updatedPrice, updatedAvailability) => {
        const toastId = toast.loading("Updating product...");

        fetch(`http://127.0.0.1:5000/products/${product_id}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                name: updatedName,
                description: updatedDescription,
                price: updatedPrice,
                availability: updatedAvailability,
            }),
        })
        .then((resp) => resp.json())
        .then((response) => {
            if (response.message) {
                toast.update(toastId, { render: "Product updated successfully!", type: "success", isLoading: false, autoClose: 3000 });
                setOnChange(!onChange);
            } else if (response.error) {
                toast.update(toastId, { render: response.error, type: "error", isLoading: false, autoClose: 3000 });
            } else {
                toast.update(toastId, { render: "Failed to update product", type: "error", isLoading: false, autoClose: 3000 });
            }
        })
        .catch((err) => {
            toast.update(toastId, { render: "Failed to update product", type: "error", isLoading: false, autoClose: 3000 });
            console.error("Error updating product:", err);
        });
    };

    // DELETE A PRODUCT
    const deleteProduct = (id) => {
        const toastId = toast.loading("Deleting product...");

        fetch(`http://127.0.0.1:5000/products/${id}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        })
        .then((resp) => resp.json())
        .then((response) => {
            if (response.message) {
                toast.update(toastId, { render: response.message, type: "success", isLoading: false, autoClose: 3000 });
                setOnChange(!onChange);
            } else if (response.error) {
                toast.update(toastId, { render: response.error, type: "error", isLoading: false, autoClose: 3000 });
            } else {
                toast.update(toastId, { render: "Failed to delete product", type: "error", isLoading: false, autoClose: 3000 });
            }
        })
        .catch((err) => {
            toast.update(toastId, { render: "Failed to delete product", type: "error", isLoading: false, autoClose: 3000 });
            console.error("Failed to delete product:", err);
        });
    };

    // FETCH WISHLIST
    useEffect(() => {
        if (!authToken) return;
        fetch("http://127.0.0.1:5000/wishlist", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        })
        .then((response) => response.json())
        .then((response) => {
            setWishlist(response.wishlist);
        })
        .catch((err) => console.error("Failed to fetch wishlist:", err));
    }, [onChange]);

    // ADD TO WISHLIST
    const addToWishlist = (product_id) => {
        fetch("http://127.0.0.1:5000/wishlist", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ product_id }),
        })
        .then((resp) => resp.json())
        .then((response) => {
            if (response.message) {
                toast.success(response.message);
                setOnChange(!onChange);
            } else if (response.error) {
                toast.error(response.error);
            }
        })
        .catch((err) => console.error("Failed to add to wishlist:", err));
    };

    // REMOVE FROM WISHLIST
    const removeFromWishlist = (wishlist_id) => {
        fetch(`http://127.0.0.1:5000/wishlist/${wishlist_id}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        })
        .then((resp) => resp.json())
        .then((response) => {
            if (response.message) {
                toast.success("Item removed from wishlist");
                setOnChange(!onChange);
            } else if (response.error) {
                toast.error(response.error);
            }
        })
        .catch((err) => console.error("Failed to remove from wishlist:", err));
    };

    // CLEAR WISHLIST
    const clearWishlist = () => {
        fetch("http://127.0.0.1:5000/wishlist/clear", {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        })
        .then((resp) => resp.json())
        .then((response) => {
            if (response.message) {
                toast.success("Wishlist cleared");
                setOnChange(!onChange);
            } else if (response.error) {
                toast.error(response.error);
            }
        })
        .catch((err) => console.error("Failed to clear wishlist:", err));
    };

    const data = {
        products,
        wishlist,
        addProduct,
        updateProduct,
        deleteProduct,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
    };

    return (
        <ProductContext.Provider value={data}>
            {children}
        </ProductContext.Provider>
    );
};