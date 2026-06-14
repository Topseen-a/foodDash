import { Link,useNavigate } from 'react-router-dom'; 
import{ useAuth } from '../context/AuthContext'; 
import{ useCart } from '../context/CartContext'; 

export default function Navbar(){ 
    const{user,logout,isStaff} = useAuth(); 
    const{itemCount} = useCart(); 
    const navigate = useNavigate(); 
    return( 
        <nav className='bg-orange-500 text-white px-6 py-4 flex justify-between items-center shadow'> 
        <Link to='/' className='text-2xl font-bold'>🍔FoodDash</Link>
        <div className='flexitems-centergap-6'> 
        <Link to='/'>Menu</Link> 
        {isStaff && (
            <>
            <Link to='/staff'>Orders</Link>
            <Link to='/staff/menu'>Menu Mgmt</Link>
            </>)} {user && !isStaff&&(
                 <>
                 <Link to='/cart' className='relative'> 🛒Cart {itemCount> 0 && ( <span className='absolute top-2 right-3 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                     {itemCount} </span> )} 
                     </Link>
                     <Link to='/orders'>MyOrders</Link></> 
                    )} {user? <button onClick={()=> {
                        logout(); 
                        navigate('/');
                    }}>Logout</button> : <Link to='/login'>Login</Link>
                }
                 </div>
                 </nav> ); 
                }