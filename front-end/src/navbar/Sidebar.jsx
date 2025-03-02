import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    Button, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, 
    DrawerCloseButton, VStack, useDisclosure, IconButton, Spinner 
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { logout, get_user } from "../endpoints/api";

const Sidebar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null); // Estado para almacenar el rol
    const [loading, setLoading] = useState(true); // Estado de carga
    const nav = useNavigate();

    // Obtener el rol del usuario
    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await get_user();
                if (response) {
                    setUserRole(response.rol_usuario);
                } else {
                    setUserRole(null);
                }
            } catch (error) {
                console.error("Error al obtener el usuario:", error);
                setUserRole(null);
            } finally {
                setLoading(false);
            }
        };

        const token = document.cookie.includes("access_token");
        setIsAuthenticated(token);

        if (token) {
            fetchUserRole();
        } else {
            setLoading(false);
        }
    }, []);

    // Función para cerrar sesión
    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            nav('/login');
        }
    };

    if (!isAuthenticated || loading) return null; // Ocultar sidebar mientras carga

    return (
        <>
            <IconButton 
                icon={<HamburgerIcon />} 
                onClick={onOpen} 
                position="absolute"
                top="4" 
                left="4" 
                zIndex="overlay" 
                colorScheme="teal"
            />

            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent w={{ base: "80%", sm: "250px" }}> {/* ✅ Responsive */}
                    <DrawerCloseButton />
                    <DrawerHeader>Menú</DrawerHeader>
                    <DrawerBody>
                        <VStack align="start" spacing={4}>
                            {/* 🔒 Solo "admin_general" puede ver Registro Horas y Usuarios */}
                            {userRole === "admin_general" && (
                                <>
                                    <Button as={Link} to="/" onClick={onClose} w="full">
                                        Registro Horas
                                    </Button>
                                    <Button as={Link} to="/usuarios" onClick={onClose} w="full">
                                        Usuarios
                                    </Button>
                                </>
                            )}

                            <Button as={Link} to="/entrada" onClick={onClose} w="full">
                                Marcar Entrada
                            </Button>
                            <Button as={Link} to="/salida" onClick={onClose} w="full">
                                Marcar Salida
                            </Button>

                            <Button colorScheme="red" onClick={handleLogout} w="full">
                                Cerrar Sesión
                            </Button>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default Sidebar;
