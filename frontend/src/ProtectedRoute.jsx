import React, {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({children}) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(!isAuthenticated) {
            navigate('/')
        }

    }, [navigate, isAuthenticated])

    return children;
};

export default ProtectedRoute;
