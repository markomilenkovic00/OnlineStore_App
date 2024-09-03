import './App.css';
import {Routes, Route} from 'react-router-dom'
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import "bootstrap/dist/css/bootstrap.min.css"
import {ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Home from './components/Dashboard/Home';
import PrivateRoute from './components/Auth/PrivateRoute';
import UserProfile from './components/Dashboard/UserProfile';
import NewOrder from './components/Dashboard/Buyer/NewOrder';
import OrderHistoryBuyer from './components/Dashboard/Buyer/OrderHistory'
import AddProduct from './components/Dashboard/Seller/AddProduct'
import Verification from './components/Dashboard/Admin/Verification'
import NewOrdersSeller from './components/Dashboard/Seller/NewOrders'
import OrderHistorySeller from './components/Dashboard/Seller/OrderHistory'
import OrderHistoryAdmin from './components/Dashboard/Admin/OrderHistory'
import Unauthorized from './components/Auth/Unauthorized';
import PrivateRouteAuth from './components/Auth/PrivateRouteAuth';
import Dashboard from './components/Dashboard/Dashboard';

function App() {

  return(
    <div className="App">
      <ToastContainer
        position='top-right'
        autoClose={3000}
      />

      <Routes>
        <Route path='/' element={<PrivateRouteAuth><Login/></PrivateRouteAuth>}/> 
        <Route path='/login' element={<PrivateRouteAuth><Login/></PrivateRouteAuth>}/>
        <Route path='/registration' element={<PrivateRouteAuth><Register/></PrivateRouteAuth>}/>
        <Route path='/home' element={<PrivateRoute allowedRoles={['admin','prodavac','kupac']}><Home/></PrivateRoute>}>
            <Route path="" element={<Dashboard/>}></Route>
            <Route path="profile" element={<UserProfile/>}></Route>
            <Route path="addproduct" element={<PrivateRoute allowedRoles={['prodavac']}><AddProduct /></PrivateRoute>}></Route>
            <Route path="neworder" element={<PrivateRoute allowedRoles={['kupac']}><NewOrder /></PrivateRoute>}></Route>
            <Route path="orderhistorybuyer" element={<PrivateRoute allowedRoles={['kupac']}><OrderHistoryBuyer /></PrivateRoute>}></Route>
            <Route path="verification" element={<PrivateRoute allowedRoles={['admin']}><Verification /></PrivateRoute>}></Route>
            <Route path="newordersseller" element={<PrivateRoute allowedRoles={['prodavac']}><NewOrdersSeller /></PrivateRoute>}></Route>
            <Route path="orderhistoryseller" element={<PrivateRoute allowedRoles={['prodavac']}><OrderHistorySeller /></PrivateRoute>}></Route>
            <Route path="orderhistoryadmin" element={<PrivateRoute allowedRoles={['admin']}><OrderHistoryAdmin /></PrivateRoute>}></Route> 
            <Route path="unauthorized" element={<Unauthorized/>}></Route>
        </Route>  
      </Routes>
    </div>
  )
}

export default App;
