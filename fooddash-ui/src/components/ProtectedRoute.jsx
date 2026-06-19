import{ Navigate } from 'react-router-dom';
import{ useAuth} from'../context/AuthContext'; 

// Wraps pages requiring login.staffOnly=true also checks the 'staff' role.

export default function ProtectedRoute({ children,staffOnly=false }) {
    const{user,isStaff} =useAuth();
    if (!user)
        return <Navigate to='/login' replace/>;
    if (staffOnly && !isStaff)
        return<Navigate to='/' replace/>; 
    return children; 
} 