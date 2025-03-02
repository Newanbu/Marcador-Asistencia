import { Heading, VStack, Text, Box, Divider, Stack, Icon, SimpleGrid, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getHoraEntrada, getHoraSalida } from "../endpoints/api";
import { FiClock } from "react-icons/fi";
import { format } from "date-fns";

const Menu = () => {
    const [notesEntrada, setNotesEntrada] = useState([]);
    const [notesSalida, setNotesSalida] = useState([]);
    const [search, setSearch] = useState(""); 
    useEffect(() => {
        const fetchEntradas = async () => {
            const entradas = await getHoraEntrada();
            setNotesEntrada(entradas);
        };
        fetchEntradas();
    }, []);

    useEffect(() => {
        const fetchSalidas = async () => {
            const salidas = await getHoraSalida();
            setNotesSalida(salidas);
        };
        fetchSalidas();
    }, []);

    const filteredEntradas = notesEntrada.filter(note => 
        note.owner?.nombre_completo.toLowerCase().includes(search.toLowerCase())
    );

    const filteredSalidas = notesSalida.filter(note => 
        note.owner?.nombre_completo.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <VStack spacing={6} p={6} bg="gray.100" minH="100vh" align="center" w="full">
            <Heading color="teal.600" textAlign="center" fontSize={{ base: "xl", md: "2xl" }}>
                Registro de Horas
            </Heading>

            <Input
                placeholder="Buscar por usuario..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                width={{ base: "90%", md: "400px" }}
                mb={4}
                bg="white"
                boxShadow="sm"
            />

            {/* ✅ Diseño en columnas en desktop y en filas en móviles */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full" maxW="1200px">
                {/* 🔵 SECCIÓN DE ENTRADAS */}
                <Box 
                    w="full"
                    bg="white"
                    p={5}
                    boxShadow="lg"
                    borderRadius="md"
                    maxH="600px" // ✅ Limita altura y activa scroll
                    overflowY="auto"
                >
                    <Heading size="md" color="blue.600" mb={4} textAlign="center">
                        Horas de Entrada
                    </Heading>
                    {filteredEntradas.length === 0 ? (
                        <Text textAlign="center" color="gray.500">No hay registros de entrada.</Text>
                    ) : (
                        <VStack spacing={4} align="stretch">
                            {filteredEntradas.map((note, index) => (
                                <Box key={index} p={4} bg="gray.50" borderRadius="md" boxShadow="sm">
                                    <Stack direction="column" spacing={3}>
                                        <Icon as={FiClock} color="blue.500" w={6} h={6} />
                                        <VStack align="start" spacing={0}>
                                            <Text fontWeight="bold" color="gray.700">
                                                Fecha: {note.hora_entrada ? format(new Date(note.hora_entrada), "dd/MM/yyyy HH:mm") : "Sin fecha"}
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                Propietario: {note.owner?.nombre_completo || "Desconocido"}
                                            </Text>
                                            <Text fontSize="sm" color="blue.500" fontWeight="bold">
                                                Tipo: Entrada
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                Correo: {note.owner?.email || "No disponible"}
                                            </Text>
                                        </VStack>
                                    </Stack>
                                    {index !== filteredEntradas.length - 1 && <Divider mt={3} />}
                                </Box>
                            ))}
                        </VStack>
                    )}
                </Box>

                <Box 
                    w="full"
                    bg="white"
                    p={5}
                    boxShadow="lg"
                    borderRadius="md"
                    maxH="600px" 
                    overflowY="auto"
                >
                    <Heading size="md" color="red.600" mb={4} textAlign="center">
                        Horas de Salida
                    </Heading>
                    {filteredSalidas.length === 0 ? (
                        <Text textAlign="center" color="gray.500">No hay registros de salida.</Text>
                    ) : (
                        <VStack spacing={4} align="stretch">
                            {filteredSalidas.map((note, index) => (
                                <Box key={index} p={4} bg="gray.50" borderRadius="md" boxShadow="sm">
                                    <Stack direction="column" spacing={3}>
                                        <Icon as={FiClock} color="red.500" w={6} h={6} />
                                        <VStack align="start" spacing={0}>
                                            <Text fontWeight="bold" color="gray.700">
                                                Fecha: {note.hora_salida ? format(new Date(note.hora_salida), "dd/MM/yyyy HH:mm") : "Sin fecha"}
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                Propietario: {note.owner?.nombre_completo || "Desconocido"}
                                            </Text>
                                            <Text fontSize="sm" color="red.500" fontWeight="bold">
                                                Tipo: Salida
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                Correo: {note.owner?.email || "No disponible"}
                                            </Text>
                                        </VStack>
                                    </Stack>
                                    {index !== filteredSalidas.length - 1 && <Divider mt={3} />}
                                </Box>
                            ))}
                        </VStack>
                    )}
                </Box>
            </SimpleGrid>
        </VStack>
    );
};

export default Menu;