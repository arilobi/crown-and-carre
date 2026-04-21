import { useContext, useEffect, useState } from "react";
import { OrderContext } from "../Contexts/OrderContext";
import { useNavigate } from "react-router-dom";
import '../components/Orders.css'; 

export default function Orders() {
    const { userOrders, fetchUserOrders, cancelOrder, checkoutAll } = useContext(OrderContext);
    const navigate = useNavigate();
    const [checking, setChecking] = useState(false);

    useEffect(() => {
        fetchUserOrders();
    }, []);

    const handleCheckout = () => {
        setChecking(true);
        setTimeout(() => {
            checkoutAll();
            setChecking(false);
        }, 1500);
    };

    // Total
    const grandTotal = userOrders.reduce((sum, order) => sum + order.total_price, 0);

    return (
        <div className="mo-wrapper">
            <div className="mo-header">
                <h1 className="mo-title">My Orders</h1>
                <span className="mo-count">{userOrders.length} orders</span>
            </div>

            {userOrders.length === 0 ? (
                <div className="mo-empty">
                    <p>You haven't placed any orders yet.</p>
                    <button className="mo-shop-btn" onClick={() => navigate("/store")}>
                        Browse Products
                    </button>
                </div>
            ) : (
                <>
                    <div className="mo-table-wrapper">
                        <table className="mo-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Name</th>
                                    <th>Qty</th>
                                    <th>Total</th>
                                    <th>Payment</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td>
                                            <img
                                                src={`https://crown-and-carre.onrender.com/static/uploads/${order.product_image}`}
                                                alt={order.product_name}
                                                className="mo-table-img"
                                            />
                                        </td>
                                        <td>{order.product_name}</td>
                                        <td>{order.quantity}</td>
                                        <td>${order.total_price}</td>
                                        <td>
                                            <span className={`mo-badge ${order.payment_status === "paid" ? "paid" : "unpaid"}`}>
                                                {order.payment_status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="mo-cancel-btn"
                                                onClick={() => cancelOrder(order.id)}
                                                disabled={order.payment_status === "paid"}
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Checkout */}
                    <div className="mo-checkout-bar">
                        <div className="mo-grand-total">
                            Grand Total: <strong>${grandTotal.toFixed(2)}</strong>
                        </div>
                        <button
                            className="mo-checkout-btn"
                            onClick={handleCheckout}
                            disabled={checking}
                        >
                            {checking ? "Processing..." : "Checkout"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}