import { Heading, Text, VStack, Button, Box, SimpleGrid, Flex, Icon, useDisclosure, IconButton, HStack, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, Input } from '@chakra-ui/react';
import { useAuth } from '../AuthContext';
import { MotionBox } from '../../../shared/ui/MotionBox';
import { useGanaderia } from '../../../shared/context/GanaderiaContext';
import { FiLogOut, FiPlus, FiCheck, FiEdit2, FiTrash2, FiUser } from 'react-icons/fi';
import { GanaderiaForm } from '../../ganaderia/components/GanaderiaForm';
import { perfilService } from '../../perfil/services/perfil.service';
import { useState, useRef } from 'react';
import { type Ganaderia } from '../../ganaderia/models';
import { ganaderiaService } from '../../ganaderia/services/ganaderia.service';


export const ProfilePage = () => {
    const { user, perfil, signOut, refreshPerfil } = useAuth();
    const { ganaderias, ganaderia: selectedGanaderia, selectGanaderia, refreshGanaderia } = useGanaderia();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isEditProfileOpen, onOpen: onEditProfileOpen, onClose: onEditProfileClose } = useDisclosure();
    const [ganaderiaToEdit, setGanaderiaToEdit] = useState<Ganaderia | null>(null);
    const [editingName, setEditingName] = useState(perfil?.nombre || '');
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const toast = useToast();


    // Delete Confirmation
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const [ganaderiaToDelete, setGanaderiaToDelete] = useState<Ganaderia | null>(null);
    const cancelRef = useRef<HTMLButtonElement>(null);
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

    // Format date nicely
    const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A';

    return (
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} w="full">
            <Box w="full" py={{ base: 4, md: 8 }}>
                {/* Profile Section */}
                <VStack
                    spacing={6}
                    align="center"
                    bg="white"
                    p={{ base: 5, md: 8 }}
                    borderRadius="2xl"
                    boxShadow="sm"
                    mb={8}
                    w="full"
                    position="relative"
                >
                    <IconButton
                        aria-label="Editar perfil"
                        icon={<FiEdit2 />}
                        size="sm"
                        variant="ghost"
                        position="absolute"
                        top={4}
                        right={4}
                        borderRadius="full"
                        onClick={() => {
                            setEditingName(perfil?.nombre || '');
                            onEditProfileOpen();
                        }}
                    />
                    {/* <Box bg="brand.50" p={4} borderRadius="full" color="brand.500">
                        <Icon as={FiUser} boxSize={8} />
                    </Box> */}
                    <VStack spacing={1} w="full" px={2}>
                        <Heading
                            size="md"
                            color="gray.800"
                            textAlign="center"
                            wordBreak="break-word"
                            lineHeight="shorter"
                        >
                            {perfil?.nombre || 'Cargando nombre...'}
                        </Heading>

                        <Text color="gray.400" fontSize="xs">Miembro desde {joinDate}</Text>
                    </VStack>
                    <Button leftIcon={<FiLogOut />} colorScheme="red" variant="ghost" size="sm" onClick={signOut}>
                        Cerrar Sesión
                    </Button>
                </VStack>

                {/* Ganaderias Section */}
                <Box>
                    <Flex justify="space-between" align="center" mb={4}>
                        <Heading size="md" color="gray.700">Mis Ganaderías</Heading>
                        <Button leftIcon={<FiPlus />} size="sm" colorScheme="brand" onClick={handleCreate}>
                            Nueva
                        </Button>
                    </Flex>

                    {ganaderias.length === 0 ? (
                        <Flex direction="column" align="center" justify="center" bg="gray.50" p={8} borderRadius="xl" border="1px dashed" borderColor="gray.200">
                            <Text color="gray.500" mb={4}>No tienes ganaderías registradas.</Text>
                            <Button colorScheme="brand" variant="outline" size="sm" onClick={handleCreate}>Crear primera ganadería</Button>
                        </Flex>
                    ) : (
                        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                            {ganaderias.map((g) => {
                                const isSelected = selectedGanaderia?.ganaderia_id === g.ganaderia_id;
                                return (
                                    <Box
                                        key={g.ganaderia_id}
                                        p={4}
                                        bg="white"
                                        borderRadius="xl"
                                        boxShadow={isSelected ? "md" : "sm"}
                                        border="2px solid"
                                        borderColor={isSelected ? "brand.500" : "transparent"}
                                        cursor="pointer"
                                        onClick={() => selectGanaderia(g.ganaderia_id)}
                                        transition="all 0.2s"
                                        _hover={{ boxShadow: "md" }}
                                    >
                                        <Flex justify="space-between" align="start">
                                            <VStack align="start" spacing={0} flex="1">
                                                <Heading size="sm" color="gray.800" wordBreak="break-word">{g.nombre}</Heading>
                                                <Text fontSize="xs" color="gray.500" wordBreak="break-word">{g.ubicacion || 'Sin ubicación'}</Text>
                                            </VStack>
                                            <HStack spacing={1}>
                                                <IconButton
                                                    size="xs"
                                                    icon={<FiEdit2 />}
                                                    aria-label="Editar"
                                                    variant="ghost"
                                                    onClick={(e) => handleEdit(g, e)}
                                                />
                                                <IconButton
                                                    size="xs"
                                                    icon={<FiTrash2 />}
                                                    aria-label="Eliminar"
                                                    variant="ghost"
                                                    colorScheme="red"
                                                    onClick={(e) => handleDeleteClick(g, e)}
                                                />
                                                {isSelected && <Icon as={FiCheck} color="brand.500" ml={1} />}
                                            </HStack>
                                        </Flex>
                                    </Box>
                                )
                            })}
                        </SimpleGrid>
                    )}
                </Box>

                <GanaderiaForm isOpen={isOpen} onClose={onClose} ganaderiaToEdit={ganaderiaToEdit} />

                {/* Edit Profile Modal */}
                <Modal isOpen={isEditProfileOpen} onClose={onEditProfileClose} isCentered size="sm">
                    <ModalOverlay backdropFilter="blur(5px)" bg="blackAlpha.300" />
                    <ModalContent borderRadius="2xl">
                        <ModalHeader>Editar Mi Perfil</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack spacing={4}>
                                <FormControl isRequired>
                                    <Box mb={2}>
                                        <Text fontSize="xs" color="gray.500" fontWeight="bold" mb={1}>CORREO ELECTRÓNICO</Text>
                                        <Text fontSize="sm" color="gray.400" px={3} py={2} bg="gray.50" borderRadius="lg">{perfil?.email}</Text>
                                        <Text fontSize="10px" color="orange.400" mt={1}>El correo no se puede cambiar por seguridad.</Text>
                                    </Box>
                                </FormControl>
                                <FormControl isRequired>
                                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#718096' }}>NOMBRE COMPLETO</label>
                                    <Input
                                        placeholder="Tu nombre"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        mt={1}
                                        borderRadius="xl"
                                        bg="gray.50"
                                        border="none"
                                        _focus={{ bg: 'white', border: '1px solid', borderColor: 'brand.500' }}
                                    />
                                </FormControl>
                            </VStack>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="ghost" mr={3} onClick={onEditProfileClose} borderRadius="xl">Cancelar</Button>
                            <Button
                                colorScheme="brand"
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
                                borderRadius="xl"
                                px={8}
                            >
                                Guardar
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {/* Delete Confirmation Dialog */}
                <AlertDialog
                    isOpen={isDeleteOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={onDeleteClose}
                    isCentered
                >
                    <AlertDialogOverlay backdropFilter="blur(2px)">
                        <AlertDialogContent borderRadius="2xl">
                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                ¿Eliminar Ganadería?
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                Esta acción es permanente. Se eliminarán todas las vacas y registros asociados a <b>{ganaderiaToDelete?.nombre}</b>. ¿Estás seguro?
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={onDeleteClose} variant="ghost" borderRadius="xl">
                                    Cancelar
                                </Button>
                                <Button colorScheme="red" onClick={confirmDelete} ml={3} isLoading={deleteLoading} borderRadius="xl">
                                    Eliminar permanentemente
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </Box>
        </MotionBox>
    );
};
