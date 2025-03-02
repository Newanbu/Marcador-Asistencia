import { createContext, useContext, useEffect, useState } from "react";
import { is_authenticated, login } from "../endpoints/api";  // Asegúrate de importar `login`
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation(); // ✅ Obtiene la ubicación de React Router

    const get_authenticated = async () => {
        try {
            const success = await is_authenticated();
            setIsAuthenticated(success);
        } catch {
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login_user = async (email, password) => {
        const success = await login(email, password);
        if (success) {
            setIsAuthenticated(true);
            navigate("/"); // ✅ Usa navigate en lugar de nav
        }
    };

    useEffect(() => {
        get_authenticated(); // ✅ Llamar solo una vez al montar
    }, []);

    useEffect(() => {
        if (!loading && !isAuthenticated && location.pathname !== "/login") {
            navigate("/login"); // ✅ Redirigir si no está autenticado y no está en /login
        }
    }, [loading, isAuthenticated, location.pathname, navigate]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, login_user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
