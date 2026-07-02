import { BrowserRouter,Routes,Route,Navigate } from 'react-router-dom'; 
import { AuthProvider} from './context/AuthContext'; 
import { CartProvider} from'./context/CartContext'; 
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'; 
import MenuPage from './pages/MenuPage'; 
import LoginPage from './pages/LoginPage'; 
import RegisterPage from './pages/RegisterPage';
import StaffRegisterPage from './pages/StaffRegisterPage';
import CartPage from './pages/CartPage';
import OrderPage from './pages/OrderPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
<<<<<<< HEAD
import StaffDashboard from './pages/StaffDashboard'; 
=======
import StaffDashboard from './pages/StaffDashboard';
>>>>>>> be84900 (completed)
import MenuManagementPage from './pages/MenuManagementPage';


export default function App(){
    return(
        <AuthProvider><CartProvider><BrowserRouter>
            <Navbar />
            <main className='max-w-6xl mx-auto px-4 py-6'>
                <Routes>
                    <Route path='/' element={<MenuPage/>}/>
                    <Route path='/login' element={<LoginPage/>} />
                    <Route path='/register' element={<RegisterPage/>}/>
                    <Route path='/staff/register' element={<StaffRegisterPage/>}/>
                    <Route path='/cart' element={<ProtectedRoute><CartPage
                     /></ProtectedRoute>}/> 
                    <Route path='/orders' element={<ProtectedRoute><OrderHistoryPage
                    /></ProtectedRoute>}/>
                    <Route path='/orders/:ID' element={<ProtectedRoute><OrderPage
                    /></ProtectedRoute>}/>
                    <Route path='/staff' element={<ProtectedRoute staffOnly><StaffDashboard
                    /></ProtectedRoute>}/>
                    <Route path='/staff/menu' element={<ProtectedRoute staffOnly><MenuManagementPage
<<<<<<< HEAD
                    /></ProtectedRoute>}/> 
=======
                    /></ProtectedRoute>}/>
>>>>>>> be84900 (completed)
                    <Route path='*' element={<Navigate to='/' replace/>}/>
                </Routes>
            </main>
        </BrowserRouter>
        </CartProvider>
        </AuthProvider>
    );
}