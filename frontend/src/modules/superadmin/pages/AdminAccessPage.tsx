import { useState } from 'react';
import {
    Box,
    Heading,
    Text,
    Button,
    VStack,
    HStack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Select,
    IconButton,
    useToast,
    Spinner,
    Flex,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Input,
    InputGroup,
    InputLeftElement,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2, FiUserCheck, FiChevronDown, FiSearch } from 'react-icons/fi';
import { adminService } from '../services/admin.service';
import { MotionBox } from '../../../shared/ui/MotionBox';
import { useAdmin } from '../context/AdminContext';

export const AdminAccessPage = () => {
    const {
        users,
        ganaderias,
        roles,
        loading,
        refreshData,
        updateUserInState,
        removeAccessInState
    } = useAdmin();

    const [actionLoading, setActionLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    // Form state
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedGanaderia, setSelectedGanaderia] = useState('');
    const [selectedRole, setSelectedRole] = useState('');

    const filteredUsers = users.filter(u =>
        u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAssign = async () => {
        if (!selectedUser || !selectedGanaderia || !selectedRole) {
            toast({
                title: 'Campos incompletos',
                status: 'warning',
            });
            return;
        }

        setActionLoading(true);
        try {
            await adminService.assignAccess(selectedUser, selectedGanaderia, selectedRole);
            toast({
                title: 'Acceso asignado/actualizado',
                status: 'success',
            });
            onClose();
            await refreshData();
            setSelectedUser('');
            setSelectedGanaderia('');
            setSelectedRole('');
        } catch (error: any) {
            toast({
                title: 'Error al procesar',
                description: error.message,
                status: 'error',
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateFarmRole = async (userId: string, ganaderiaId: string, roleId: string) => {
        setActionLoading(true);
        try {
            await adminService.assignAccess(userId, ganaderiaId, roleId);
            toast({
                title: 'Rol de ganadería actualizado',
                status: 'success',
            });
            await refreshData(); // Full refresh to get the new role names correctly
        } catch (error: any) {
            toast({
                title: 'Error al actualizar rol',
                description: error.message,
                status: 'error',
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemove = async (userId: string, ganaderiaId: string) => {
        if (!confirm('¿Estás seguro de eliminar este acceso?')) return;

        setActionLoading(true);
        try {
            await adminService.removeAccess(userId, ganaderiaId);
            toast({
                title: 'Acceso eliminado',
                status: 'success',
            });
            removeAccessInState(userId, ganaderiaId);
        } catch (error: any) {
            toast({
                title: 'Error al eliminar',
                description: error.message,
                status: 'error',
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateSystemRole = async (userId: string, newRole: string) => {
        setActionLoading(true);
        try {
            await adminService.updateUserRole(userId, newRole);
            toast({
                title: 'Rol de sistema actualizado',
                status: 'success',
            });
            updateUserInState(userId, { rol_sistema: newRole as any });
        } catch (error: any) {
            toast({
                title: 'Error al actualizar rol',
                description: error.message,
                status: 'error',
            });
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" h="60vh">
                <Spinner size="xl" color="brand.500" thickness="4px" />
            </Flex>
        );
    }

    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={4}>
                <Box>
                    <Heading size="lg" color="gray.800" mb={1}>Administración</Heading>
                    <Text color="gray.600" fontSize="sm">Gestiona usuarios, roles y propiedad de fincas.</Text>
                </Box>
                <Button
                    leftIcon={<FiPlus />}
                    colorScheme="brand"
                    variant="solid"
                    onClick={onOpen}
                    size="md"
                    borderRadius="xl"
                    shadow="sm"
                >
                    Nuevo Acceso
                </Button>
            </Flex>

            <Box mb={6}>
                <InputGroup>
                    <InputLeftElement pointerEvents="none">
                        <FiSearch color="gray.300" />
                    </InputLeftElement>
                    <Input
                        placeholder="Buscar usuarios..."
                        bg="white"
                        borderRadius="xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </InputGroup>
            </Box>

            {/* Layout desktop */}
            <Box display={{ base: 'none', lg: 'block' }} bg="white" borderRadius="2xl" shadow="sm" overflow="hidden" border="1px solid" borderColor="gray.100">
                <Table variant="simple">
                    <Thead bg="gray.50">
                        <Tr>
                            <Th color="gray.500">Usuario</Th>
                            <Th color="gray.500">Rol Sistema</Th>
                            <Th color="gray.500">Ganaderías y Roles</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredUsers.map((user) => (
                            <Tr key={user.user_id} _hover={{ bg: 'gray.50/50' }}>
                                <Td>
                                    <VStack align="start" spacing={0}>
                                        <Text fontWeight="bold" color="gray.700">{user.nombre}</Text>
                                        <Text fontSize="xs" color="gray.500">{user.email}</Text>
                                    </VStack>
                                </Td>
                                <Td>
                                    <SystemRoleMenu
                                        currentRole={user.rol_sistema}
                                        onSelect={(role) => handleUpdateSystemRole(user.user_id, role)}
                                        isDisabled={actionLoading}
                                    />
                                </Td>
                                <Td>
                                    <VStack align="stretch" spacing={2}>
                                        {user.accesses && user.accesses.length > 0 ? (
                                            user.accesses.map((acc, idx) => (
                                                <AccessItem
                                                    key={idx}
                                                    acc={acc}
                                                    roles={roles}
                                                    onUpdateRole={(roleId) => handleUpdateFarmRole(user.user_id, acc.ganaderias.ganaderia_id, roleId)}
                                                    onRemove={() => handleRemove(user.user_id, acc.ganaderias.ganaderia_id)}
                                                    isDisabled={actionLoading}
                                                />
                                            ))
                                        ) : (
                                            <Text fontSize="xs" color="gray.400" fontStyle="italic">Sin ganaderías vinculadas</Text>
                                        )}
                                    </VStack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            {/* Layout mobile/tablet */}
            <VStack display={{ base: 'flex', lg: 'none' }} spacing={4} align="stretch">
                {filteredUsers.map((user) => (
                    <Box key={user.user_id} bg="white" p={4} borderRadius="2xl" shadow="sm" border="1px solid" borderColor="gray.100">
                        <Flex justify="space-between" align="start" mb={4}>
                            <VStack align="start" spacing={0}>
                                <Text fontWeight="bold" color="gray.700" fontSize="md">{user.nombre}</Text>
                                <Text fontSize="xs" color="gray.500">{user.email}</Text>
                            </VStack>
                            <SystemRoleMenu
                                currentRole={user.rol_sistema}
                                onSelect={(role) => handleUpdateSystemRole(user.user_id, role)}
                                isDisabled={actionLoading}
                            />
                        </Flex>

                        <Text fontSize="xs" fontWeight="bold" color="gray.400" mb={2} textTransform="uppercase">Ganaderías:</Text>
                        <VStack align="stretch" spacing={2}>
                            {user.accesses && user.accesses.length > 0 ? (
                                user.accesses.map((acc, idx) => (
                                    <AccessItem
                                        key={idx}
                                        acc={acc}
                                        roles={roles}
                                        onUpdateRole={(roleId) => handleUpdateFarmRole(user.user_id, acc.ganaderias.ganaderia_id, roleId)}
                                        onRemove={() => handleRemove(user.user_id, acc.ganaderias.ganaderia_id)}
                                        isDisabled={actionLoading}
                                    />
                                ))
                            ) : (
                                <Text fontSize="xs" color="gray.400" fontStyle="italic">Sin accesos configurados</Text>
                            )}
                        </VStack>
                    </Box>
                ))}
            </VStack>

            {/* Modal de Asignación */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
                <ModalOverlay backdropFilter="blur(4px)" />
                <ModalContent borderRadius="3xl" p={2}>
                    <ModalHeader borderBottomWidth="1px" borderColor="gray.50">
                        <HStack spacing={3}>
                            <Box bg="brand.50" p={2} borderRadius="xl">
                                <FiUserCheck color="var(--chakra-colors-brand-500)" />
                            </Box>
                            <Text>Asignar Acceso</Text>
                        </HStack>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py={6}>
                        <VStack spacing={5}>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm" fontWeight="bold" color="gray.600">Usuario</FormLabel>
                                <Select
                                    placeholder="Seleccionar usuario"
                                    value={selectedUser}
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                    borderRadius="xl"
                                    h="50px"
                                >
                                    {users.map(u => (
                                        <option key={u.user_id} value={u.user_id}>
                                            {u.nombre} ({u.email})
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel fontSize="sm" fontWeight="bold" color="gray.600">Ganadería</FormLabel>
                                <Select
                                    placeholder="Seleccionar ganadería"
                                    value={selectedGanaderia}
                                    onChange={(e) => setSelectedGanaderia(e.target.value)}
                                    borderRadius="xl"
                                    h="50px"
                                >
                                    {ganaderias.map(g => (
                                        <option key={g.ganaderia_id} value={g.ganaderia_id}>
                                            {g.nombre}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel fontSize="sm" fontWeight="bold" color="gray.600">Rol en Ganadería</FormLabel>
                                <Select
                                    placeholder="Seleccionar rol"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    borderRadius="xl"
                                    h="50px"
                                >
                                    {roles.map(r => (
                                        <option key={r.rol_id} value={r.rol_id}>
                                            {r.nombre} ({r.codigo})
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter bg="gray.50" borderBottomRadius="3xl" p={4}>
                        <Button variant="ghost" mr={3} onClick={onClose} borderRadius="xl">
                            Cancelar
                        </Button>
                        <Button
                            colorScheme="brand"
                            onClick={handleAssign}
                            isLoading={actionLoading}
                            borderRadius="xl"
                            loadingText="Asignando..."
                            px={8}
                        >
                            Confirmar Acceso
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </MotionBox>
    );
};

// Subcomponent for Access Item with Role Menu
const AccessItem = ({ acc, roles, onUpdateRole, onRemove, isDisabled }: any) => {
    return (
        <HStack justify="space-between" bg="gray.50" p={2} borderRadius="xl" border="1px solid" borderColor="gray.100">
            <Box>
                <HStack spacing={2}>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                        {acc.ganaderias?.nombre || 'Desconocida'}
                    </Text>
                    {acc.is_owner && (
                        <Badge colorScheme="orange" variant="solid" fontSize="8px" borderRadius="full" px={2}>
                            PROPIETARIO
                        </Badge>
                    )}
                </HStack>
                {!acc.is_owner ? (
                    <Menu>
                        <MenuButton
                            as={Button}
                            size="xs"
                            variant="link"
                            colorScheme="brand"
                            fontSize="10px"
                            rightIcon={<FiChevronDown />}
                            isDisabled={isDisabled}
                        >
                            {acc.roles?.nombre || 'Sin Rol'}
                        </MenuButton>
                        <MenuList borderRadius="xl" border="none" shadow="xl">
                            {roles.map((r: any) => (
                                <MenuItem key={r.rol_id} onClick={() => onUpdateRole(r.rol_id)} fontSize="sm">
                                    {r.nombre}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                ) : (
                    <Badge variant="subtle" colorScheme="orange" fontSize="9px">
                        Control Total
                    </Badge>
                )}
            </Box>
            {!acc.is_owner && (
                <IconButton
                    aria-label="Remove access"
                    icon={<FiTrash2 />}
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    onClick={onRemove}
                    isDisabled={isDisabled}
                />
            )}
        </HStack>
    );
};

// Subcomponent for the System Role Menu
const SystemRoleMenu = ({ currentRole, onSelect, isDisabled }: { currentRole: string, onSelect: (role: string) => void, isDisabled: boolean }) => (
    <Menu>
        <MenuButton
            as={Button}
            rightIcon={<FiChevronDown />}
            size="xs"
            variant="ghost"
            colorScheme={currentRole === 'SUPERADMIN' ? 'purple' : 'gray'}
            borderRadius="lg"
            px={2}
            py={0.5}
            fontSize="10px"
            isDisabled={isDisabled}
        >
            {currentRole}
        </MenuButton>
        <MenuList borderRadius="xl" shadow="lg" border="none">
            <MenuItem onClick={() => onSelect('SUPERADMIN')}>SUPERADMIN</MenuItem>
            <MenuItem onClick={() => onSelect('USUARIO')}>USUARIO</MenuItem>
            <MenuItem onClick={() => onSelect('SOPORTE')}>SOPORTE</MenuItem>
        </MenuList>
    </Menu>
);
