import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
    Button, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, 
    DrawerCloseButton, VStack, useDisclosure, IconButton, Flex, Box, Spacer,Image,Heading
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { logout, get_user } from "../endpoints/api";

const Sidebar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();

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

    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            nav('/login');
        }
    };

    if (!isAuthenticated || loading) return null;

    return (
        <>
            <Flex as="nav" bg="teal.500" p={4} color="white" align="center">
            
            <Box display="flex" alignItems="center" gap={4}>
                    <Image src="/src/assets/logo_transparente.webp" w={20} />
                    <Heading size="md">Serving - Entrada</Heading>
                </Box>
             

                <Spacer />
                
                {/* Menú en pantalla grande */}
                <Box display={{ base: "none", md: "flex" }} gap={4}>
                    {userRole === "admin_general" && (
                        <>
                            <Button as={Link} to="/" variant="ghost" color="white">Registro Horas</Button>
                            <Button as={Link} to="/usuarios" variant="ghost" color="white">Usuarios</Button>
                        </>
                    )}
                    <Button as={Link} to="/entrada" variant="ghost" color="white">Marcar Entrada</Button>
                    <Button as={Link} to="/salida" variant="ghost" color="white">Marcar Salida</Button>
                    <Button colorScheme="red" onClick={handleLogout}>Cerrar Sesión</Button>
                </Box>
                
                {/* Botón menú hamburguesa en móvil */}
                <IconButton 
                    icon={<HamburgerIcon />} 
                    onClick={onOpen} 
                    display={{ base: "block", md: "none" }}
                    colorScheme="whiteAlpha"
                />
            </Flex>

            {/* Menú móvil */}
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent w={{ base: "80%", sm: "250px" }}>
                    <DrawerCloseButton />
                    <DrawerHeader>Menú</DrawerHeader>
                    <DrawerBody>
                        <VStack align="start" spacing={4}>
                            {userRole === "admin_general" && (
                                <>
                                    <Button as={Link} to="/" onClick={onClose} w="full">Registro Horas</Button>
                                    <Button as={Link} to="/usuarios" onClick={onClose} w="full">Usuarios</Button>
                                </>
                            )}
                            <Button as={Link} to="/entrada" onClick={onClose} w="full">Marcar Entrada</Button>
                            <Button as={Link} to="/salida" onClick={onClose} w="full">Marcar Salida</Button>
                            <Button colorScheme="red" onClick={handleLogout} w="full">Cerrar Sesión</Button>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default Sidebar;
