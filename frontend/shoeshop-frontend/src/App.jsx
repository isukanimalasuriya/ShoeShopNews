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
import Orders from "./pages/Orders";
import AllOrders from "./pages/AllOrders"
import ReviewSection from "./pages/Reviews";
import Employees from "./pages/Employees";
import Leave from "./pages/Leave";
import HRDashboard from "./pages/HRDashboard";
import Department from "./pages/Department";

import Attendance from "./pages/Attendance";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Applyleave from "./pages/Applyleave";
import SalaryPromotion from "./pages/SalaryPromotion";
import AddNewEmployee from "./pages/AddNewEmployee";

import TrackingBonus from "./pages/TrackingBonus";
import Salary from "./pages/Salary";
import EMAttendance from "./pages/EMAttendance";

import EmployeeOT from "./pages/EmployeeOT";
import EmployeeBonusTracking from "./pages/EmployeeBonusTracking";
import SalesPerformance from "./pages/SalesPerformance";
import AttendancePage from "./pages/Attendance";
import AddNewAttendance from "./pages/AddNewAttendance";
import AddSalary from "./pages/AddSalary";






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
  const noFooterRoutes = ['/customerlogin', '/login', '/customerregister', '/customerdashboard', '/employeelogin', '/admindashboard','/shoes', '/dashboard','/categories','/restock','/shoes/add','/shoes/:id/edit'];
  const noHeaderRoutes = ['/employeelogin', '/admindashboard', '/dashboard','/shoes','/dashboard','/categories','/restock','/shoes/add','/shoes/:id/edit'];
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
        <Route path="/orders"  element={<Orders/>}/>
        <Route path="/allorders"  element={<AllOrders />}/>
        <Route path="/reviews" element={<ReviewSection/>}/>
        <Route path="/employee"element={<Employees/>}/>
        <Route path="/leaves" element={<Leave />} /> 
        <Route path="/hrdashboard" element={<HRDashboard />} />
        <Route path="/department" element={<Department />} />
      
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/employeeDashboard" element={<EmployeeDashboard />} />
        <Route path="/applyleave" element={<Applyleave />} />
        <Route path="/salary&promotion" element={<SalaryPromotion />} />
       <Route path="/AddNewEmployee" element={<AddNewEmployee />} />
       <Route path="/trackingbonus" element={<TrackingBonus/>}/>
       <Route path="/Salary" element={<Salary />}/>
       <Route path="/EmAttendance" element={<EMAttendance />} />
       <Route path="/EmAttendance" element={<EMAttendance />} />
    
       <Route path="/EmployeeOT" element={< EmployeeOT/>} />
        
       <Route path="/EmployeeBonusTracking" element={< EmployeeBonusTracking/>} />
       <Route path="/SalesPerformance" element={<SalesPerformance/>} />
       <Route path="/AddNewAttendance" element={<AddNewAttendance/>} />
       <Route path="/AddSalary" element={<AddSalary/>} />
       

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
