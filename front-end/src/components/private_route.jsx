import { Heading } from "@chakra-ui/react";
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login");
        }
    }, [loading, isAuthenticated, navigate]);

    if (loading) {
        return <Heading>Loading...</Heading>;
    }

    return isAuthenticated ? children : null;
};

export default PrivateRoute;
