import { useState, useEffect } from 'react';
import { delete_user, get_roles, get_users, register, update_user } from '../endpoints/api';
import { 
    Box, Flex, Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Heading, 
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
    FormControl, FormLabel, Input, VStack, Stack, Select, useDisclosure
} from '@chakra-ui/react';
import Swal from 'sweetalert2';

const Listado = () => {
    const [user, setUser] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [rol, setRol] = useState([]); // Estado para almacenar los roles
    const [selectedRol, setSelectedRol] = useState(''); // Estado para el rol seleccionado
    const { 
        isOpen: isEditOpen, 
        onOpen: onEditOpen, 
        onClose: onEditClose 
    } = useDisclosure();




    useEffect(() => {
        const fetchUser = async () => {
            const users = await get_users();
            setUser(users);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchRole = async () => {
            const rolUser = await get_roles();
            setRol(rolUser);
            console.log("Roles obtenidos:", rolUser);
        };
        fetchRole();
    }, []);

    const [editUserId, setEditUserId] = useState(null);
    const [editFullname, setEditFullname] = useState('');
    const [editRut, setEditRut] = useState('');
    const [editAddress, setEditAddress] = useState('');
    const [editTelefono, setEditTelefono] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editCargo, setEditCargo] = useState('');
    const [editContrato, setEditContrato] = useState('');
    const [editFechaIngreso, setEditFechaIngreso] = useState('');
    const [editFechaDesvinculacion, setEditFechaDesvinculacion] = useState('');
    const [editRol, setEditRol] = useState('');



    // Estado del formulario de registro
    const [fullname, setFullname] = useState('');
    const [rut, setRut] = useState('');
    const [address, setAddress] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [cargo, setCargo] = useState('');
    const [contrato, setContrato] = useState('');
    const [fecha_ingreso, setFechaIngreso] = useState('');
    const [fecha_desvinculacion, setFechaDesvinculacion] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [search, setSearch] = useState(""); // 🔍 Estado del filtro
    const handleEditUser = (usuario) => {
        setEditUserId(usuario.id);
        setEditFullname(usuario.nombre_completo);
        setEditRut(usuario.rut);
        setEditAddress(usuario.direccion || '');
        setEditTelefono(usuario.numero_telefonico || '');
        setEditEmail(usuario.email);
        setEditCargo(usuario.cargo || '');
        setEditContrato(usuario.contrato_asignado || '');
        setEditFechaIngreso(usuario.fecha_ingreso || '');
        setEditFechaDesvinculacion(usuario.fecha_desvinculacion || '');
        setEditRol(usuario.rol_usuario || '');
    
        onEditOpen(); // 🔥 Abrir modal de edición
    };


    const handleUpdateUser = async () => {
        try {
            const updatedData = {
                nombre_completo: editFullname,
                rut: editRut,
                direccion: editAddress,
                numero_telefonico: editTelefono,
                email: editEmail,
                cargo: editCargo,
                contrato_asignado: editContrato,
                fecha_ingreso: editFechaIngreso,
                fecha_desvinculacion: editFechaDesvinculacion || null, // Si está vacío, enviamos `null`
                rol_usuario: editRol
            };
    
            await update_user(editUserId, updatedData);
    
            Swal.fire({
                title: "Usuario Actualizado",
                text: `El usuario ${editFullname} fue actualizado correctamente.`,
                icon: "success",
                confirmButtonText: "Ok"
            });
    
            window.location.reload(); // 🔄 Recargar lista de usuarios
            onEditClose(); // 🔥 Cerrar modal de edición
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "No se pudo actualizar el usuario.",
                icon: "error",
                confirmButtonText: "Ok"
            });
            console.log(error)
        }
    };
    
    const formatRut = (value) => {
        // 🔍 Eliminar cualquier carácter que no sea número o 'k' (último dígito del RUT)
        let rut = value.replace(/[^\dkK]/g, "");
    
        // 🔄 Separar el último dígito (verificador)
        let cuerpo = rut.slice(0, -1);
        let dv = rut.slice(-1);
    
        // 📏 Agregar puntos cada 3 dígitos
        cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
        // 🔄 Retornar RUT formateado con guión antes del último dígito
        return cuerpo ? `${cuerpo}-${dv}` : rut;
    };

    const formattedFechaDesvinculacion = fecha_desvinculacion ? fecha_desvinculacion : null;
    const handleRegister = async () => {
        try {
            if (!fullname || !password || !confirmPassword || !rut || !address || !telefono || !email || !cargo || !contrato || !fecha_ingreso || !rol) {
                Swal.fire({
                    title: "Error de Registro",
                    text: 'Por favor, completa los campos obligatorios',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
                return;
            }

            // Verificar si las contraseñas coinciden
            if (password !== confirmPassword) {
                Swal.fire({
                    title: "Error",
                    text: "Las contraseñas no coinciden",
                    icon: "error",
                    confirmButtonText: "Ok"
                });
                return;
            }
            await register(fullname, rut, address, telefono, email, cargo, contrato, selectedRol , fecha_ingreso, formattedFechaDesvinculacion, password);
            Swal.fire({
                title: 'Usuario Registrado',
                text: 'El usuario ha sido registrado exitosamente',
                icon: 'success',
                confirmButtonText: 'Ok'
            });
            onClose(); // Cerrar el modal después del registro
        } catch (error) {
            console.log(error);
        }
    };


    const filteredUsers = user.filter((u) => 
        u.nombre_completo.toLowerCase().includes(search.toLowerCase()) ||
        u.rut.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.rol_usuario.toLowerCase().includes(search.toLowerCase())
    );

    


    const handleDelete = async (id) => {
        Swal.fire({
          title: "¿Estás seguro?",
          text: "¡No podrás revertir esto!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#facc15",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, eliminar!",
          cancelButtonText: "Cancelar",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await delete_user(id);
              window.location.reload()
            } catch (error) {
              console.error("Error al eliminar al usuario:", error);
            }
          }
        });
      };
    return (
            <Box p={5} pl="60px">
                {/* 🔹 Encabezado */}
                <Heading size="lg" color="teal.600" mb={4}>
                    Usuarios
                </Heading>

    {/* 🔍 Campo de búsqueda */}
    <Flex mb={4} justify="space-between" align="center">
        <Input
            placeholder="Buscar por nombre, RUT, email o rol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            width={{ base: "100%", md: "400px" }}
            bg="white"
            boxShadow="sm"
            borderRadius="md"
            px={4}
        />
        <Button colorScheme="teal" onClick={onOpen}>
            Registrar Usuario
        </Button>
    </Flex>

    {/* 📋 Tabla de usuarios */}
    <TableContainer boxShadow="md" borderRadius="md" overflowX="auto">
            <Table variant="striped" colorScheme="teal">
                <Thead bg="teal.500">
                    <Tr>
                        <Th color="white">Rut</Th>
                        <Th color="white">Nombre</Th>
                        <Th color="white">Email</Th>
                        <Th color="white">Teléfono</Th>
                        <Th color="white">Cargo</Th>
                        <Th color="white">Contrato</Th>
                        <Th color="white">Rol</Th>
                        <Th color="white">Ingreso</Th>
                        <Th color="white">Desvinculación</Th>
                        <Th color="white">Acciones</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {filteredUsers.length === 0 ? (
                        <Tr>
                            <Td colSpan="10" textAlign="center" color="gray.500">
                                No hay usuarios que coincidan con la búsqueda.
                            </Td>
                        </Tr>
                    ) : (
                        filteredUsers.map((usuario) => (
                            <Tr key={usuario.id}>
                                <Td>{formatRut(usuario.rut)}</Td>
                                <Td>{usuario.nombre_completo}</Td>
                                <Td>{usuario.email}</Td>
                                <Td>{usuario.numero_telefonico}</Td>
                                <Td>{usuario.cargo}</Td>
                                <Td>{usuario.contrato_asignado}</Td>
                                <Td>{usuario.rol_usuario}</Td>
                                <Td>{usuario.fecha_ingreso}</Td>
                                <Td>{usuario.fecha_desvinculacion || 'Indefinido'}</Td>
                                <Td>
                                    <Button colorScheme="red" size="sm" onClick={() => handleDelete(usuario.id)}>
                                        Eliminar
                                    </Button>
                                    <Button colorScheme="blue" size="sm" m={2} onClick={() => handleEditUser(usuario)}>
                                        Editar
                                    </Button>
                                </Td>
                            </Tr>
                        ))
                    )}
                </Tbody>
            </Table>
        </TableContainer>
            {/* Modal de Registro */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Registrar Usuario</ModalHeader>
                    <ModalCloseButton />
                    {/* Habilitar scroll dentro del modal */}
                    <ModalBody maxH="70vh" overflowY="auto">  
                        <VStack spacing={4} align="stretch">
                            <FormControl>
                                <Stack spacing={3}>
                                    <Box>
                                        <FormLabel>Nombre Completo *</FormLabel>
                                        <Input type="text" onChange={(e) => setFullname(e.target.value)} value={fullname} />
                                    </Box>
                                    <Box>
                                        <FormLabel>RUT *</FormLabel>
                                        <Input 
                                            type="text" 
                                            value={rut}
                                            onChange={(e) => setRut(formatRut(e.target.value))} 
                                        />
                                    </Box>
                                    <Box>
                                        <FormLabel>Contraseña *</FormLabel>
                                        <Input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                                    </Box>
                                    <Box>
                                        <FormLabel>Confirmar Contraseña *</FormLabel>
                                        <Input type="password" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
                                    </Box>
                                    <Box>
                                        <FormLabel>Dirección *</FormLabel>
                                        <Input type="text" onChange={(e) => setAddress(e.target.value)} value={address} />
                                    </Box>
                                    <Box>
                                        <FormLabel>Número Telefónico *</FormLabel>
                                        <Input type="tel" onChange={(e) => setTelefono(e.target.value)} value={telefono} />
                                    </Box>
                                    <Box>
                                        <FormLabel>Correo Electrónico *</FormLabel>
                                        <Input type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
                                    </Box>
                                    <Box>
                                        <FormLabel>Cargo *</FormLabel>
                                        <Input type="text" onChange={(e) => setCargo(e.target.value)} value={cargo} />
                                    </Box>
                                    <Box>
                                        <FormLabel>Contrato Asignado *</FormLabel>
                                        <Input type="text" onChange={(e) => setContrato(e.target.value)} value={contrato} />
                                    </Box>
                                    <Box>
                                        <FormLabel>Rol de Usuario *</FormLabel>
                                        <Select onChange={(e) => setSelectedRol(e.target.value)} value={selectedRol}>
                                            <option value="">Selecciona un Rol</option>
                                            {rol.map((rolItem) => (
                                                <option key={rolItem.id} value={rolItem.value}>
                                                    {rolItem.nombre}
                                                </option>
                                            ))}
                                        </Select>
                                    </Box>
                                    <Box>
                                        <FormLabel>Fecha de Ingreso *</FormLabel>
                                        <Input type="date" onChange={(e) => setFechaIngreso(e.target.value)} value={fecha_ingreso} />
                                    </Box>
                                    <Box>
                                        <FormLabel>Fecha de Desvinculación</FormLabel>
                                        <Input type="date" onChange={(e) => setFechaDesvinculacion(e.target.value)} value={fecha_desvinculacion} />
                                    </Box>

                                    <Button colorScheme="teal" onClick={handleRegister} mt={4} w="full">
                                        Registrar
                                    </Button>
                                </Stack>
                            </FormControl>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>

            <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Editar Usuario</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody maxH="70vh" overflowY="auto">
                        <VStack spacing={4} align="stretch">
                            <FormControl>
                                <Stack spacing={3}>
                                    <Box>
                                        <FormLabel>Nombre Completo *</FormLabel>
                                        <Input type="text" onChange={(e) => setEditFullname(e.target.value)} value={editFullname} />
                                    </Box>
                                    <Box>
                                        <FormLabel>RUT *</FormLabel>
                                        <Input 
                                            type="text" 
                                            value={editRut}
                                            onChange={(e) => setEditRut(formatRut(e.target.value))} 
                                        />
                                    </Box>
                                    <Box>
                                        <FormLabel>Dirección *</FormLabel>
                                        <Input type="text" onChange={(e) => setEditAddress(e.target.value)} value={editAddress} />
                                    </Box>
                                    <Box>
                                        <FormLabel>Número Telefónico *</FormLabel>
                                        <Input type="tel" onChange={(e) => setEditTelefono(e.target.value)} value={editTelefono} />
                                    </Box>
                                    <Box>
                                        <FormLabel>Correo Electrónico *</FormLabel>
                                        <Input type="email" onChange={(e) => setEditEmail(e.target.value)} value={editEmail} />
                                    </Box>
                                    <Box>
                                        <FormLabel>Cargo *</FormLabel>
                                        <Input type="text" onChange={(e) => setEditCargo(e.target.value)} value={editCargo} />
                                    </Box>
                                    <Box>
                                        <FormLabel>Contrato Asignado *</FormLabel>
                                        <Input type="text" onChange={(e) => setEditContrato(e.target.value)} value={editContrato} />
                                    </Box>
                                    <Box>
                                        <FormLabel>Rol de Usuario *</FormLabel>
                                        <Select onChange={(e) => setEditRol(e.target.value)} value={editRol}>
                                            <option value="">Selecciona un Rol</option>
                                            {rol.map((rolItem) => (
                                                <option key={rolItem.id} value={rolItem.value}>
                                                    {rolItem.nombre}
                                                </option>
                                            ))}
                                        </Select>
                                    </Box>
                                    <Box>
                                        <FormLabel>Fecha de Ingreso *</FormLabel>
                                        <Input type="date" onChange={(e) => setEditFechaIngreso(e.target.value)} value={editFechaIngreso} />
                                    </Box>
                                    <Box>
                                        <FormLabel>Fecha de Desvinculación</FormLabel>
                                        <Input type="date" onChange={(e) => setEditFechaDesvinculacion(e.target.value)} value={editFechaDesvinculacion} />
                                    </Box>

                                    <Button colorScheme="blue" onClick={handleUpdateUser} mt={4} w="full">
                                        Guardar Cambios
                                    </Button>
                                </Stack>
                            </FormControl>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>

        </Box>
    );
};

export default Listado;
