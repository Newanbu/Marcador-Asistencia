import {
    Flex,
    Heading,
    Input,
    Button,
    InputGroup,
    Stack,
    InputLeftElement,
    Box,
    Avatar,
    FormControl,
    InputRightElement
} from "@chakra-ui/react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login, get_user } from "../endpoints/api";


const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const nav = useNavigate();

    const handleShowClick = () => setShowPassword(!showPassword);

    const handleLogin = async () => {
        try {
            if (!email || !password) {
                Swal.fire({
                    title: "Error de autenticación",
                    text: "Por favor ingresa los campos",
                    icon: "error",
                    confirmButtonText: "Ok",
                });
                return;
            }

            const response = await login(email, password);

            if (response.success) {
                // ✅ Obtener el rol del usuario tras iniciar sesión
                const userResponse = await get_user();
                if (userResponse) {
                    const userRole = userResponse.rol_usuario;
                    
                    // ✅ Redirigir según el rol del usuario
                    if (userRole === "admin_general") {
                        nav("/usuarios"); // Admin va a Usuarios
                    } else {
                        nav("/entrada"); // Usuario va a Marcar Entrada
                    }
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "No se pudo obtener el rol del usuario.",
                        icon: "error",
                        confirmButtonText: "Ok",
                    });
                }
            } else {
                Swal.fire({
                    title: "Error",
                    text: response.message || "Credenciales incorrectas",
                    icon: "error",
                    confirmButtonText: "Ok",
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error",
                text: "Ocurrió un problema al iniciar sesión",
                icon: "error",
                confirmButtonText: "Ok",
            });
        }
    };

    return (
        <Flex
            flexDirection="column"
            width="100wh"
            height="100vh"
            backgroundColor="gray.200"
            justifyContent="center"
            alignItems="center"
        >
            <Stack flexDir="column" mb="2" justifyContent="center" alignItems="center">
                <Avatar bg="teal.500" />
                <Heading color="teal.400">Bienvenido</Heading>
                <Box minW={{ base: "90%", md: "468px" }}>
                    <Stack spacing={4} p="1rem" backgroundColor="white" boxShadow="md" rounded={20}>
                        <FormControl>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" />
                                <Input type="email" onChange={(e) => setEmail(e.target.value.trim())} value={email} placeholder="Correo Electrónico" />
                            </InputGroup>
                        </FormControl>
                        <FormControl>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none" color="gray.300" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Contraseña"
                                    onChange={(e) => setPassword(e.target.value.trim())}
                                    value={password}
                                />
                                <InputRightElement width="4.5rem">
                                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                                        {showPassword ? "Esconder" : "Mostrar"}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Button borderRadius={0} variant="solid" colorScheme="teal" width="full" onClick={handleLogin}>
                            Login
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
};

export default Login;
