import {BrowserRouter, Routes, Route} from "react-router-dom";
import { Link } from 'react-router-dom';
import './App.css';
import './index.css'
import  { Toaster} from 'react-hot-toast';
import CustomerDashboard from "./pages/customerDashboard";
import { FloatingShape } from "./components/FloatingShape";
import CustomerSignup from "./pages/CustomerSignup";
import CustomerLoginPage from "./pages/CustomerLoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NavBar2 from "./components/NavBar2";
import Footer from "./components/Footer";
import Home from "../src/pages/Home";
import Collection from "./pages/Collection";
import Product from "../src/pages/Product";
import Cart from "../src/pages/Cart";
import PlaceOrder from "../src/pages/PlaceOrder";
import { Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from "react-router-dom";
import Payment_success from "./pages/Payment_success";
import Payment_cancel from "./pages/Payment_cancel";
import Notify from "./pages/Notify";
import EmployeeRoutes from "./pages/EmployeeRoutes";
import EmployeeLogin from "./pages/EmployeeLogin";


//inventory
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/ShoeDashboard';
import ShoeListPage from './pages/ShoeListPage';
import AddShoePage from './pages/AddShoe';

import RestockPage from './pages/RestockPage';
import ShoeDetailPage from './pages/ShoeDetailPage';
import EditShoePage from './pages/EditShoe';
import CategoryPage from './pages/CategoryPage'; 



const RedirectAuthenticatedUser = ({children})=>{
  const {isAuthenticated, user} = useAuthStore();

  if(isAuthenticated && user.isVerified){
    return <Navigate to="/" replace />
  }
  return children
}

function App() {
  const { isAuthenticated, checkAuth, user } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth])

  console.log("isAuthen", isAuthenticated)
  console.log("user", user)

  const location = useLocation();
  const noFooterRoutes = ['/customerlogin', '/login', '/customerregister', '/customerdashboard', '/employeelogin', '/admindashboard','/shoes'];
  const noHeaderRoutes = ['/employeelogin', '/admindashboard', '/dashboard','/shoes'];
  const sidebarRoutes = ['/dashboard', '/shoes', '/shoes/add', '/restock', '/shoes/:id', '/shoes/:id/edit', '/categories'];

const showSidebar = sidebarRoutes.some(path => location.pathname.startsWith(path));

  return (
    <>
      <Toaster position="top-right"/>
      <ToastContainer />
      {!noHeaderRoutes.includes(location.pathname) && <NavBar2 />}
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/customerlogin" element={<CustomerLoginPage />}/>
        <Route path="/customerdashboard" element={<CustomerDashboard />}/>

        <Route path="/customerregister" element={
          <RedirectAuthenticatedUser>
            <CustomerSignup />
          </RedirectAuthenticatedUser>
        }/>

        <Route path="/floating" element={<FloatingShape />}/>
        <Route path="/verify-email" element={<EmailVerificationPage />}/>
        <Route path="/forgot-password" element={<ForgotPasswordPage />}/>
        <Route path="/reset-password/:token" element={<ResetPasswordPage />}/>

        <Route path="/collection" element={<Collection/>}/>
        <Route path="/product/:productId" element={<Product/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/placeOrder" element={<PlaceOrder/>} />
        <Route path="/Payment_success" element={<Payment_success/>} />
        <Route path="/Payment_cancel" element={<Payment_cancel/>} />
        <Route path="/Notify" element={<Notify/>} />
        
    
      </Routes>

      {showSidebar && (
  <div style={{ display: 'flex' }}>
    <Sidebar />
    <div style={{ flex: 1, padding: '20px' }}>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/shoes" element={<ShoeListPage />} />
        <Route path="/shoes/add" element={<AddShoePage />} />
        <Route path="/restock" element={<RestockPage />} />
        <Route path="/shoes/:id" element={<ShoeDetailPage />} />
        <Route path="/shoes/:id/edit" element={<EditShoePage />} />
        <Route path="/categories" element={<CategoryPage />} />
      </Routes>
    </div>
  </div>
)}


      <EmployeeRoutes />
      {!noFooterRoutes.includes(location.pathname) && <Footer />}
    </>
  )
}

export default App
