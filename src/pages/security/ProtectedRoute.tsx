import React, {ReactNode, useEffect} from 'react';
import {useNavigate} from "react-router-dom";

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token){
            navigate("/")
        }
    }, [token, navigate]);

    return token ? <>{children}</> : null;
};

export default ProtectedRoute;
