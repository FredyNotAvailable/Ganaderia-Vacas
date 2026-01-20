import { Heading, Text, VStack, Button, Box, SimpleGrid, Flex, useDisclosure, IconButton, HStack, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, FormControl, Input, Menu, MenuButton, MenuList, MenuItem, Icon, FormLabel, Badge } from '@chakra-ui/react';
import { useAuth } from '../AuthContext';
import { ROLES_SISTEMA } from '../../../shared/constants/permisos';
import { MotionBox } from '../../../shared/ui/MotionBox';
import { useGanaderia } from '../../../shared/context/GanaderiaContext';
import { FiLogOut, FiPlus, FiEdit2, FiTrash2, FiSettings, FiUser, FiAtSign, FiInfo, FiShield } from 'react-icons/fi';
import { GanaderiaForm } from '../../ganaderia/components/GanaderiaForm';
import { FincaInfoModal } from '../../../shared/components/FincaInfoModal';
import { perfilService } from '../../perfil/services/perfil.service';
import { useState, useRef } from 'react';
import { type Ganaderia } from '../../ganaderia/models';
import { ganaderiaService } from '../../ganaderia/services/ganaderia.service';

export const ProfilePage = () => {
    const { perfil, signOut, refreshPerfil } = useAuth();
    const {
        misGanaderias,
        ganaderiasVinculadas,
        ganaderia: selectedGanaderia,
        selectGanaderia,
        refreshGanaderia
    } = useGanaderia();
    const isSuperAdmin = perfil?.rol_sistema === ROLES_SISTEMA.SUPERADMIN;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isEditProfileOpen, onOpen: onEditProfileOpen, onClose: onEditProfileClose } = useDisclosure();
    const [ganaderiaToEdit, setGanaderiaToEdit] = useState<Ganaderia | null>(null);
    const [editingName, setEditingName] = useState(perfil?.nombre || '');
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const toast = useToast();

    const { isOpen: isSignOutOpen, onOpen: onSignOutOpen, onClose: onSignOutClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const { isOpen: isConfirmCloseOpen, onOpen: onConfirmCloseOpen, onClose: onConfirmCloseClose } = useDisclosure();
    const { isOpen: isInfoOpen, onOpen: onInfoOpen, onClose: onInfoClose } = useDisclosure();

    const [ganaderiaToDelete, setGanaderiaToDelete] = useState<Ganaderia | null>(null);
    const [ganaderiaForInfo, setGanaderiaForInfo] = useState<Ganaderia | null>(null);
    const cancelRef = useRef<any>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleCreate = () => {
        setGanaderiaToEdit(null);
        onOpen();
    };

    const handleEdit = (g: Ganaderia, e: React.MouseEvent) => {
        e.stopPropagation();
        setGanaderiaToEdit(g);
        onOpen();
    };

    const handleDeleteClick = (g: Ganaderia, e: React.MouseEvent) => {
        e.stopPropagation();
        setGanaderiaToDelete(g);
        onDeleteOpen();
    };

    const confirmDelete = async () => {
        if (!ganaderiaToDelete) return;
        setDeleteLoading(true);
        try {
            await ganaderiaService.deleteGanaderia(ganaderiaToDelete.ganaderia_id);
            await refreshGanaderia();
            toast({ title: 'Ganadería eliminada', status: 'success' });
            onDeleteClose();
        } catch (error) {
            console.error(error);
            toast({ title: 'Error al eliminar', status: 'error' });
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleInfoClick = (g: Ganaderia, e: React.MouseEvent) => {
        e.stopPropagation();
        setGanaderiaForInfo(g);
        onInfoOpen();
    };



    return (
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} w="full">
            <Box w="full" py={{ base: 4, md: 8 }}>
                <Flex justify="space-between" align="center" mb={6}>
                    <VStack align="start" spacing={1}>
                        {perfil?.rol_sistema && (
                            <Badge
                                colorScheme={perfil.rol_sistema === ROLES_SISTEMA.SUPERADMIN ? 'purple' : 'gray'}
                                variant="subtle"
                                fontSize="10px"
                                borderRadius="md"
                                px={2}
                            >
                                {perfil.rol_sistema}
                            </Badge>
                        )}
                        <Heading size="lg" color="gray.800" fontWeight="bold">
                            {perfil?.nombre || 'Perfil'}
                        </Heading>
                    </VStack>
                    <Menu isLazy>
                        <MenuButton
                            as={Button}
                            rightIcon={<FiSettings />}
                            colorScheme="gray"
                            variant="ghost"
                            borderRadius="xl"
                            size="md"
                        >
                            Configuración
                        </MenuButton>
                        <MenuList borderRadius="xl" shadow="xl" border="none">
                            <MenuItem icon={<FiEdit2 />} onClick={() => { setEditingName(perfil?.nombre || ''); onEditProfileOpen(); }}>
                                Editar Perfil
                            </MenuItem>
                            <MenuItem icon={<FiLogOut />} color="red.500" onClick={onSignOutOpen}>
                                Cerrar Sesión
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>

                <Box mb={8}>
                    <VStack bg="white" borderRadius="2xl" spacing={0} overflow="hidden" shadow="sm" border="1px solid" borderColor="gray.50">
                        <Flex w="full" px={4} py={3.5} align="center" justify="space-between">
                            <HStack spacing={3}>
                                <Flex color="gray.400" align="center" justify="center" w={8} h={8}>
                                    <Icon as={FiUser} boxSize={5} />
                                </Flex>
                                <Text color="gray.800" fontWeight="medium" fontSize="md">Nombre</Text>
                            </HStack>
                            <Text color="gray.400" fontSize="md">{perfil?.nombre || '---'}</Text>
                        </Flex>
                        <Box h="1px" w="full" bg="gray.50" ml={12} />
                        <Flex w="full" px={4} py={3.5} align="center" justify="space-between">
                            <HStack spacing={3}>
                                <Flex color="gray.400" align="center" justify="center" w={8} h={8}>
                                    <Icon as={FiShield} boxSize={5} />
                                </Flex>
                                <Text color="gray.800" fontWeight="medium" fontSize="md">Rol de Sistema</Text>
                            </HStack>
                            <Badge
                                colorScheme={perfil?.rol_sistema === ROLES_SISTEMA.SUPERADMIN ? 'purple' : 'gray'}
                                variant="subtle"
                                borderRadius="full"
                                px={3}
                            >
                                {perfil?.rol_sistema || 'USUARIO'}
                            </Badge>
                        </Flex>
                        <Box h="1px" w="full" bg="gray.50" ml={12} />
                        <Flex w="full" px={4} py={3.5} align="center" justify="space-between">
                            <HStack spacing={3}>
                                <Flex color="gray.400" align="center" justify="center" w={8} h={8}>
                                    <Icon as={FiAtSign} boxSize={5} />
                                </Flex>
                                <Text color="gray.800" fontWeight="medium" fontSize="md">Email</Text>
                            </HStack>
                            <Text color="gray.400" fontSize="md" wordBreak="break-all" noOfLines={1}>{perfil?.email}</Text>
                        </Flex>
                        <Box h="1px" w="full" bg="gray.50" ml={12} />
                    </VStack>
                </Box>

                <Box>
                    <Flex justify="space-between" align="center" mb={4}>
                        <Heading size="md" color="gray.700">
                            {isSuperAdmin ? 'Ganaderías (Sistema)' : 'Mis Ganaderías'}
                        </Heading>
                        <Button leftIcon={<FiPlus />} size="sm" colorScheme="brand" onClick={handleCreate}>Nueva</Button>
                    </Flex>

                    {misGanaderias.length === 0 ? (
                        <Flex direction="column" align="center" justify="center" bg="gray.50" p={8} borderRadius="xl" border="1px dashed" borderColor="gray.200">
                            <Text color="gray.500" mb={4}>
                                {isSuperAdmin ? 'No hay ganaderías en el sistema.' : 'No tienes una ganadería propia registrada.'}
                            </Text>
                            <Button colorScheme="brand" variant="outline" size="sm" onClick={handleCreate}>Crear mi ganadería</Button>
                        </Flex>
                    ) : (
                        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} mb={8}>
                            {misGanaderias.map((g) => {
                                const isSelected = selectedGanaderia?.ganaderia_id === g.ganaderia_id;
                                return (
                                    <Box key={g.ganaderia_id} p={4} bg="white" borderRadius="xl" boxShadow={isSelected ? "md" : "sm"} border="2px solid" borderColor={isSelected ? "brand.500" : "transparent"} cursor="pointer" onClick={() => selectGanaderia(g.ganaderia_id)} transition="all 0.2s" _hover={{ boxShadow: "md" }}>
                                        <Flex justify="space-between" align="start">
                                            <VStack align="start" spacing={0} flex="1">
                                                <Heading size="sm" color="gray.800" wordBreak="break-word">{g.nombre}</Heading>
                                                <Text fontSize="xs" color="gray.500" wordBreak="break-word">{g.ubicacion || 'Sin ubicación'}</Text>
                                            </VStack>
                                            <HStack spacing={1}>
                                                <IconButton size="xs" icon={<FiInfo />} aria-label="Info" variant="ghost" color="brand.500" onClick={(e) => handleInfoClick(g, e)} />
                                                <IconButton size="xs" icon={<FiEdit2 />} aria-label="Editar" variant="ghost" onClick={(e) => handleEdit(g, e)} />
                                                <IconButton size="xs" icon={<FiTrash2 />} aria-label="Eliminar" variant="ghost" colorScheme="red" onClick={(e) => handleDeleteClick(g, e)} />
                                            </HStack>
                                        </Flex>
                                    </Box>
                                )
                            })}
                        </SimpleGrid>
                    )}

                    {ganaderiasVinculadas.length > 0 && (
                        <>
                            <Heading size="md" color="gray.700" mb={4} mt={8}>Ganaderías Compartidas</Heading>
                            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                                {ganaderiasVinculadas.map((g) => {
                                    const isSelected = selectedGanaderia?.ganaderia_id === g.ganaderia_id;
                                    // Permissions check for shared farms
                                    const canEdit = g.permiso === 'EDITAR' || g.permiso === 'ELIMINAR';
                                    const canDelete = g.permiso === 'ELIMINAR';

                                    return (
                                        <Box key={g.ganaderia_id} p={4} bg="white" borderRadius="xl" boxShadow={isSelected ? "md" : "sm"} border="2px solid" borderColor={isSelected ? "blue.400" : "transparent"} cursor="pointer" onClick={() => selectGanaderia(g.ganaderia_id)} transition="all 0.2s" _hover={{ boxShadow: "md" }}>
                                            <Flex justify="space-between" align="start">
                                                <VStack align="start" spacing={0} flex="1">
                                                    <Heading size="sm" color="gray.800" wordBreak="break-word">{g.nombre}</Heading>
                                                    <Text fontSize="10px" color="blue.500" fontWeight="bold">
                                                        {g.permiso === 'LECTURA' ? 'Acceso: Solo Lectura' :
                                                            g.permiso === 'EDITAR' ? 'Acceso: Edición' :
                                                                g.permiso === 'ELIMINAR' ? 'Acceso: Control Total' :
                                                                    `Acceso: ${g.permiso}`}
                                                    </Text>
                                                </VStack>
                                                <HStack spacing={1}>
                                                    <IconButton size="xs" icon={<FiInfo />} aria-label="Info" variant="ghost" color="blue.500" onClick={(e) => handleInfoClick(g, e)} />
                                                    {canEdit && <IconButton size="xs" icon={<FiEdit2 />} aria-label="Editar" variant="ghost" onClick={(e) => handleEdit(g, e)} />}
                                                    {canDelete && <IconButton size="xs" icon={<FiTrash2 />} aria-label="Eliminar" variant="ghost" colorScheme="red" onClick={(e) => handleDeleteClick(g, e)} />}
                                                </HStack>
                                            </Flex>
                                        </Box>
                                    )
                                })}
                            </SimpleGrid>
                        </>
                    )}
                </Box>

                <GanaderiaForm isOpen={isOpen} onClose={onClose} ganaderiaToEdit={ganaderiaToEdit} />
                <FincaInfoModal isOpen={isInfoOpen} onClose={onInfoClose} ganaderia={ganaderiaForInfo} />

                {/* Modal de Editar Perfil */}
                <Modal isOpen={isEditProfileOpen} onClose={() => {
                    if (editingName !== perfil?.nombre) onConfirmCloseOpen();
                    else onEditProfileClose();
                }} isCentered size="sm">
                    <ModalOverlay backdropFilter="blur(5px)" bg="blackAlpha.300" />
                    <ModalContent borderRadius="2xl" boxShadow="2xl">
                        <ModalHeader pt={6} px={6}>
                            <Flex justify="space-between" align="center">
                                <Text fontSize="lg" fontWeight="bold">Editar Perfil</Text>
                                <Button
                                    variant="ghost"
                                    color="red.500"
                                    size="sm"
                                    onClick={() => {
                                        if (editingName !== perfil?.nombre) onConfirmCloseOpen();
                                        else onEditProfileClose();
                                    }}
                                    fontWeight="bold"
                                >
                                    Cerrar
                                </Button>
                            </Flex>
                        </ModalHeader>
                        <ModalBody px={6}>
                            <VStack spacing={4}>
                                <FormControl>
                                    <FormLabel fontSize="xs" fontWeight="bold" color="gray.500">CORREO ELECTRONICO</FormLabel>
                                    <Text fontSize="sm" color="gray.400" px={3} py={2} bg="gray.50" borderRadius="lg">{perfil?.email}</Text>
                                    <Text fontSize="10px" color="orange.400" mt={1}>El correo no se puede cambiar por seguridad.</Text>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel fontSize="xs" fontWeight="bold" color="gray.500">NOMBRE</FormLabel>
                                    <Input
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        placeholder="Tu nombre"
                                        bg="gray.50"
                                        border="none"
                                        borderRadius="xl"
                                        fontWeight="medium"
                                        _focus={{ bg: 'white', border: '1px solid', borderColor: 'brand.500' }}
                                    />
                                </FormControl>
                            </VStack>
                        </ModalBody>
                        <ModalFooter px={6} pb={6}>
                            <Button
                                colorScheme="brand"
                                w="full"
                                borderRadius="xl"
                                onClick={async () => {
                                    if (!editingName.trim()) return;
                                    setIsSavingProfile(true);
                                    try {
                                        await perfilService.updateProfile({ nombre: editingName });
                                        await refreshPerfil();
                                        toast({ title: 'Perfil actualizado', status: 'success' });
                                        onEditProfileClose();
                                    } catch (err: any) {
                                        toast({ title: 'Error al actualizar', description: err.message, status: 'error' });
                                    } finally {
                                        setIsSavingProfile(false);
                                    }
                                }}
                                isLoading={isSavingProfile}
                                isDisabled={editingName === perfil?.nombre || !editingName.trim()}
                            >
                                Guardar
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {/* Confirmación de cambios sin guardar */}
                <AlertDialog
                    isOpen={isConfirmCloseOpen && !isSignOutOpen && !ganaderiaToDelete}
                    leastDestructiveRef={cancelRef}
                    onClose={onConfirmCloseClose}
                    isCentered
                >
                    <AlertDialogOverlay backdropFilter="blur(2px)">
                        <AlertDialogContent borderRadius="2xl" mx={4}>
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">Cambios sin guardar</AlertDialogHeader>
                            <AlertDialogBody>
                                Se perderán los cambios realizados. ¿Deseas continuar?
                            </AlertDialogBody>
                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={onConfirmCloseClose} variant="ghost" borderRadius="xl">
                                    No, seguir editando
                                </Button>
                                <Button colorScheme="red" onClick={() => {
                                    onConfirmCloseClose();
                                    onEditProfileClose();
                                    onClose();
                                }} ml={3} borderRadius="xl">
                                    Sí, cerrar
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>

                <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose} isCentered>
                    <AlertDialogOverlay backdropFilter="blur(2px)">
                        <AlertDialogContent borderRadius="2xl">
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">Eliminar Ganadería?</AlertDialogHeader>
                            <AlertDialogBody>Esta acción es permanente. Se eliminarán todas las vacas y registros asociados a <b>{ganaderiaToDelete?.nombre}</b>. ¿Quieres continuar?</AlertDialogBody>
                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={onDeleteClose} variant="ghost" borderRadius="xl">Cancelar</Button>
                                <Button colorScheme="red" onClick={confirmDelete} ml={3} isLoading={deleteLoading} borderRadius="xl">Eliminar</Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>

                <AlertDialog isOpen={isSignOutOpen} leastDestructiveRef={cancelRef} onClose={onSignOutClose} isCentered>
                    <AlertDialogOverlay backdropFilter="blur(2px)">
                        <AlertDialogContent borderRadius="2xl">
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">Cerrar Sesión</AlertDialogHeader>
                            <AlertDialogBody>¿Estás seguro de que deseas salir de tu cuenta?</AlertDialogBody>
                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={onSignOutClose} variant="ghost" borderRadius="xl">Cancelar</Button>
                                <Button colorScheme="red" onClick={signOut} ml={3} borderRadius="xl">Cerrar Sesión</Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </Box>
        </MotionBox>
    );
};
