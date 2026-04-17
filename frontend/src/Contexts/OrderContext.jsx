import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { toast } from "react-toastify";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const { authToken } = useContext(UserContext);

    const [orders, setOrders] = useState([]);
    const [userOrders, setUserOrders] = useState([]);
    const [onChange, setOnChange] = useState(false);

    // FETCH ALL ORDERS (admin)
    const fetchAllOrders = () => {
        fetch("http://127.0.0.1:5000/orders", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.orders) setOrders(data.orders);
        })
        .catch((err) => console.error("Failed to fetch all orders:", err));
    };

    // FETCH USER ORDERS
    const fetchUserOrders = () => {
        if (!authToken) return;
        fetch("http://127.0.0.1:5000/orders/user", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.orders) setUserOrders(data.orders);
            else setUserOrders([]);
        })
        .catch((err) => console.error("Failed to fetch user orders:", err));
    };

    // CHECKOUT ALL
    const checkoutAll = () => {
        if (userOrders.length === 0) {
            toast.error("You have no orders to checkout.");
            return;
        }

        const toastId = toast.loading("Processing checkout...");
        const unpaidOrders = userOrders.filter(order => order.payment_status !== "paid");

        setTimeout(() => {
            Promise.all(
                unpaidOrders.map(order =>
                    fetch(`http://127.0.0.1:5000/orders/${order.id}`, {
                        method: "DELETE",
                        headers: {
                            "Content-type": "application/json",
                            Authorization: `Bearer ${authToken}`,
                        },
                    })
                )
            )
            .then(() => {
                toast.update(toastId, {
                    render: `✓ Checkout successful! ${unpaidOrders.length} order(s) confirmed. Thank you!`,
                    type: "success",
                    isLoading: false,
                    autoClose: 4000
                });
                setOnChange(!onChange);
            })
            .catch((err) => {
                toast.update(toastId, { render: "Checkout failed", type: "error", isLoading: false, autoClose: 3000 });
                console.error("Checkout failed:", err);
            });
        }, 1500);
    };

    // CANCEL AN ORDER
    const cancelOrder = (order_id) => {
        fetch(`http://127.0.0.1:5000/orders/${order_id}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.message) {
                toast.success("Order cancelled successfully");
                setOnChange(!onChange);
            } else if (data.error) {
                toast.error(data.error);
            }
        })
        .catch((err) => console.error("Failed to cancel order:", err));
    };

    useEffect(() => {
        if (authToken) {
            fetchUserOrders();
            fetchAllOrders();
        }
    }, [authToken, onChange]);

    const data = {
        orders,
        userOrders,
        onChange,
        fetchAllOrders,
        fetchUserOrders,
        checkoutAll,
        cancelOrder,
    };

    return (
        <OrderContext.Provider value={data}>
            {children}
        </OrderContext.Provider>
    );
};