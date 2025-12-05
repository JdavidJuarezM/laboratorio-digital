// client/src/components/ProtectedRoute.jsx

import React from "react";
import {Navigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

function ProtectedRoute({children}) {

    const {isAuthenticated, isLoading} = useAuth();


    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center">
                    <div
                        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600 font-semibold">Cargando sesión...</p>
                </div>
            </div>
        );
    }


    if (!isAuthenticated) {
        return <Navigate to="/" replace/>;
    }


    return children;
}

export default ProtectedRoute;