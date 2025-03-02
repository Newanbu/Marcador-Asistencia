import { useState, useEffect } from "react";
import { VStack, FormControl, Input, FormLabel, Button, Heading } from "@chakra-ui/react";
import Swal from "sweetalert2";
import {addHoraSalida, get_user } from "../../endpoints/api";

const AgregarHoraSalida = () => {
    const [hora, setHora] = useState("");
    const [user, setUser] = useState({ id: "", nombre_completo: "" }); // ✅ Corrección aquí

    useEffect(() => {
        const now = new Date().toISOString().slice(0, 16); // ✅ Formato compatible con datetime-local
        setHora(now);
    
        const fetchUser = async () => {
            try {
                const response = await get_user();
                if (response) {
                    setUser({
                        id: response.id || "Sin ID",
                        nombre_completo: response.nombre_completo || "Sin Nombre"
                    });
                    console.log("Usuario obtenido:", response); // ✅ Verificar que los datos están presentes
                } else {
                    console.log("⚠️ No se recibieron datos del usuario");
                    setUser({ id: "N/A", nombre_completo: "Usuario Desconocido" });
                }
            } catch (error) {
                console.error("Error al obtener el usuario:", error);
                setUser({ id: "N/A", nombre_completo: "Usuario Desconocido" });
            }
        };
    
        fetchUser();
    }, []);

    const handleSubmit = async () => {
        try {
            if (!user.id) {
                Swal.fire({
                    title: "Error",
                    text: "No se ha obtenido el usuario autenticado.",
                    icon: "error",
                    confirmButtonText: "Ok",
                });
                return;
            }
    
            // ✅ Genera la hora actual en formato UTC (ISO 8601)
            const now = new Date().toISOString(); 
    
            console.log("📌 Hora enviada:", now);
            console.log("📌 Usuario enviado:", user.id);
    
            await addHoraSalida(hora, user.id);
    
            Swal.fire({
                title: "Hora Registrada",
                text: "Se ha registrado la hora correctamente.",
                icon: "success",
                confirmButtonText: "Ok",
            });
    
            // ✅ Actualizar la hora después del registro
            setHora(new Date().toISOString().slice(0, 16));
        } catch (error) {
            console.error("Error al registrar la hora:", error);
            Swal.fire({
                title: "Error",
                text: "Hubo un problema al registrar la hora.",
                icon: "error",
                confirmButtonText: "Ok",
            });
        }
    };
    

    return (
        <VStack 
        spacing={6} 
        p={6} 
        bg="gray.100" 
        minH="100vh" 
        align="center"
        w="full"
        >
            <Heading size="lg" mb={4} textAlign="center">Registrar Salida</Heading>

            <FormControl>
                <FormLabel>Fecha y Hora</FormLabel>
                <Input 
                    type="datetime-local" 
                    value={hora} 
                    isReadOnly 
                    w="full" // ✅ Se ajusta al tamaño del contenedor
                />
            </FormControl>

            <FormControl>
                <FormLabel>Usuario ID</FormLabel>
                <Input 
                    type="text" 
                    value={user.id} 
                    isReadOnly 
                    w="full" 
                />
            </FormControl>

            <FormControl>
                <FormLabel>Nombre Completo</FormLabel>
                <Input 
                    type="text" 
                    value={user.nombre_completo} 
                    isReadOnly 
                    w="full" 
                />
            </FormControl>

            <Button 
                colorScheme="teal" 
                onClick={handleSubmit} 
                mt={4} 
                w="full"
                fontSize={{ base: "sm", md: "md" }} // ✅ Botón más pequeño en móviles
            >
                Registrar Hora
            </Button>
        </VStack>
    );
};

export default AgregarHoraSalida;
