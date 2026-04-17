import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Store from "./pages/Store";
import Wishlist from "./pages/Wishlist";
import SingleProduct from "./pages/SingleProduct";
import Settings from "./pages/Settings";
import Orders from "./pages/Orders";
import ManageUsers from "./pages/ManageUsers";
import ManageOrders from "./pages/ManageOrders";
import ManageProducts from "./pages/ManageProducts";
import AddProduct from "./pages/AddProduct";
import NoPage from "./pages/NoPage";
import { UserProvider } from "./Contexts/UserContext";
import { ProductProvider } from "./Contexts/ProductContext";
import { ReviewContext, ReviewProvider } from "./Contexts/ReviewContext";
import { OrderProvider } from "./Contexts/OrderContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <BrowserRouter>
      <UserProvider>
        <ProductProvider>
          <ReviewProvider>
            <OrderProvider>
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  closeOnClick
                  pauseOnHover
                />
              <Routes>
                <Route  path = "/" element={<Layout />}>
                  <Route index element={<LandingPage />} />
                  <Route path = "/about" element={<About />} />
                  <Route path ="/login" element={<Login />}/>
                  <Route path ="/register" element={<Register />}/>
                  <Route path ="/settings" element={<Settings />}/>
                  <Route path ="/orders" element={<Orders />}/>
                  <Route path ="/admin/users" element={<ManageUsers />}/>
                  <Route path ="/admin/products" element={<ManageProducts />} />
                  <Route path ="/addproduct" element={<AddProduct />}/>
                  <Route path = "/admin/orders" element={<ManageOrders />} />
                  <Route path ="/singleproduct/:id" element={<SingleProduct />}/>
                  <Route path ="/store" element={<Store />}/>
                  <Route path ="/wishlist" element={<Wishlist />}/>
                  <Route path="*" element={<NoPage />} />
                </Route>
              </Routes>
            </OrderProvider>
          </ReviewProvider>
        </ProductProvider>
      </UserProvider>
	  </BrowserRouter>
  )
}

export default App
