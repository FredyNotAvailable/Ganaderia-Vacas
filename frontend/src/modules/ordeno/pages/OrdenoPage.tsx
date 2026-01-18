import { useState, useRef } from 'react';
import {
    Heading, Spinner, Flex, Button, useDisclosure,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
    FormControl, FormLabel, Input, Select, useToast,
    Text, VStack, HStack, Icon, Box, IconButton, Menu, MenuButton, MenuList, MenuItem,
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay
} from '@chakra-ui/react';
import { FiPlus, FiDroplet, FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { ordenoService } from '../services/ordeno.service';
import { type CreateOrdenoDTO, type Ordeno } from '../models';
import { useGanaderia } from '../../../shared/context/GanaderiaContext';
import { MotionBox } from '../../../shared/ui/MotionBox';

export const OrdenoPage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);
    const {
        ganaderia,
        loading: loadingGanaderia,
        ordenos,
        ordenosLoading,
        vacas,
        addOrdeno,
        updateOrdeno,
        removeOrdeno
    } = useGanaderia();

    // State for CRUD
    const [ordenoToEdit, setOrdenoToEdit] = useState<Ordeno | null>(null);
    const [ordenoToDelete, setOrdenoToDelete] = useState<Ordeno | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const toast = useToast();

    // Form State
    const [selectedVacaId, setSelectedVacaId] = useState('');
    const [litros, setLitros] = useState(0);
    const [turno, setTurno] = useState<'MANANA' | 'TARDE'>('MANANA');
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

    const handleOpenCreate = () => {
        if (!ganaderia) {
            toast({ title: 'Configura tu ganadería primero', status: 'warning' });
            return;
        }
        setOrdenoToEdit(null);
        setSelectedVacaId('');
        setLitros(0);
        setTurno('MANANA');
        setFecha(new Date().toISOString().split('T')[0]);
        onOpen();
    };

    const handleOpenEdit = (ordeno: Ordeno) => {
        setOrdenoToEdit(ordeno);
        setSelectedVacaId(ordeno.vaca_id);
        setLitros(ordeno.litros);
        setTurno(ordeno.turno || 'MANANA');
        setFecha(ordeno.fecha);
        onOpen();
    };

    const handleOpenDelete = (ordeno: Ordeno) => {
        setOrdenoToDelete(ordeno);
        onDeleteOpen();
    };

    const handleSubmit = async () => {
        if (!selectedVacaId || litros <= 0 || !ganaderia) {
            toast({ title: 'Completa los datos correctamente', status: 'warning' });
            return;
        }

        setSubmitting(true);
        try {
            const dto: CreateOrdenoDTO = {
                vaca_id: selectedVacaId,
                fecha,
                litros: Number(litros),
                turno: turno,
                ganaderia_id: ganaderia.ganaderia_id
            };

            if (ordenoToEdit) {
                const updated = await ordenoService.updateOrdeno(ordenoToEdit.ordeno_id, dto);
                updateOrdeno(updated);
                toast({ title: 'Registro actualizado', status: 'success' });
            } else {
                const created = await ordenoService.createOrdeno(dto);
                addOrdeno(created);
                toast({ title: 'Ordeño registrado', status: 'success' });
            }

            onClose();
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, status: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!ordenoToDelete) return;
        setDeleting(true);
        try {
            await ordenoService.deleteOrdeno(ordenoToDelete.ordeno_id);
            toast({ title: 'Registro eliminado', status: 'success' });
            removeOrdeno(ordenoToDelete.ordeno_id);
            onDeleteClose();
        } catch (error: any) {
            toast({ title: 'Error al eliminar', description: error.message, status: 'error' });
        } finally {
            setDeleting(false);
        }
    };

    const isLoading = loadingGanaderia || ordenosLoading;

    return (
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} w="full">
            <Flex justify="space-between" align="end" mb={6}>
                <Box>
                    <Heading size="lg" color="gray.800" fontWeight="bold" letterSpacing="tight" mb={1}>Ordeños</Heading>
                    <Text fontSize="sm" color="gray.400"> registro de leche</Text>
                </Box>
                <Button
                    leftIcon={<FiPlus />}
                    colorScheme="brand"
                    variant="solid"
                    size="md"
                    borderRadius="xl"
                    boxShadow="sm"
                    onClick={handleOpenCreate}
                >
                    Registrar
                </Button>
            </Flex>

            {isLoading ? (
                <Flex justify="center" py={10}><Spinner size="xl" color="brand.500" thickness="3px" /></Flex>
            ) : (
                <VStack spacing={3} align="stretch" pb={24}>
                    {ordenos.length === 0 ? (
                        <Flex direction="column" align="center" justify="center" bg="white" p={12} rounded="3xl" shadow="sm" textAlign="center">
                            <Icon as={FiDroplet} boxSize={10} color="gray.300" mb={4} />
                            <Text fontSize="lg" fontWeight="medium" color="gray.600" mb={1}>Sin registros</Text>
                            <Text color="gray.400" fontSize="sm">Comienza a registrar la producción.</Text>
                        </Flex>
                    ) : (
                        ordenos.map((ordeno) => (
                            <Box
                                key={ordeno.ordeno_id}
                                bg="white"
                                p={4}
                                borderRadius="2xl"
                                boxShadow="sm"
                                transition="all 0.2s"
                                _hover={{ boxShadow: 'md' }}
                                border="1px solid"
                                borderColor="gray.50"
                            >
                                <Flex justify="space-between" align="center">
                                    <HStack spacing={4}>
                                        <Flex bg="gray.100" p={2.5} borderRadius="xl" color="gray.500" align="center" justify="center">
                                            <Icon as={FiDroplet} boxSize={5} />
                                        </Flex>
                                        <VStack align="start" spacing={0}>
                                            <Text fontWeight="semibold" color="gray.800" fontSize="md">
                                                {ordeno.vaca?.nombre || 'Desconocida'}
                                            </Text>
                                            <HStack fontSize="xs" color="gray.400" spacing={2}>
                                                <Text>{new Date(ordeno.fecha).toLocaleDateString()}</Text>
                                                <Text>•</Text>
                                                <Text textTransform="capitalize" color="brand.500" fontWeight="medium">
                                                    {ordeno.turno === 'MANANA' ? 'Mañana' : 'Tarde'}
                                                </Text>
                                            </HStack>
                                        </VStack>
                                    </HStack>
                                    <HStack spacing={4}>
                                        <Text fontSize="lg" fontWeight="bold" color="gray.800">{ordeno.litros} L</Text>
                                        <Menu isLazy>
                                            <MenuButton
                                                as={IconButton}
                                                icon={<FiMoreVertical />}
                                                variant="ghost"
                                                size="sm"
                                                borderRadius="full"
                                                color="gray.400"
                                            />
                                            <MenuList borderRadius="xl" border="none" shadow="lg" zIndex={10}>
                                                <MenuItem icon={<FiEdit2 />} onClick={() => handleOpenEdit(ordeno)} fontSize="sm">Editar</MenuItem>
                                                <MenuItem icon={<FiTrash2 />} onClick={() => handleOpenDelete(ordeno)} color="red.500" fontSize="sm">Eliminar</MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </HStack>
                                </Flex>
                            </Box>
                        ))
                    )}
                </VStack>
            )}

            {/* Modal for Create/Edit */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
                <ModalOverlay backdropFilter="blur(5px)" bg="blackAlpha.300" />
                <ModalContent borderRadius="2xl" boxShadow="2xl">
                    <ModalHeader pt={6} px={6} borderBottomWidth={0}>
                        {ordenoToEdit ? 'Editar Ordeño' : 'Registrar Ordeño'}
                    </ModalHeader>
                    <ModalCloseButton top={4} right={4} />
                    <ModalBody px={6}>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel color="gray.600" fontSize="sm">Vaca</FormLabel>
                                <Select
                                    placeholder="Seleccionar vaca"
                                    value={selectedVacaId}
                                    onChange={e => setSelectedVacaId(e.target.value)}
                                    bg="gray.50" border="none"
                                    _focus={{ bg: 'white', border: '1px solid', borderColor: 'brand.500', boxShadow: 'none' }}
                                >
                                    {vacas.map(v => (
                                        <option key={v.vaca_id} value={v.vaca_id}>{v.nombre}</option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel color="gray.600" fontSize="sm">Fecha</FormLabel>
                                <Input
                                    type="date"
                                    value={fecha}
                                    onChange={e => setFecha(e.target.value)}
                                    bg="gray.50" border="none"
                                    _focus={{ bg: 'white', border: '1px solid', borderColor: 'brand.500', boxShadow: 'none' }}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel color="gray.600" fontSize="sm">Jornada</FormLabel>
                                <Select
                                    value={turno}
                                    onChange={e => setTurno(e.target.value as any)}
                                    bg="gray.50" border="none"
                                    _focus={{ bg: 'white', border: '1px solid', borderColor: 'brand.500', boxShadow: 'none' }}
                                >
                                    <option value="MANANA">Mañana</option>
                                    <option value="TARDE">Tarde</option>
                                </Select>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel color="gray.600" fontSize="sm">Litros</FormLabel>
                                <Input
                                    type="number"
                                    min={0}
                                    step="0.1"
                                    value={litros}
                                    onChange={(e) => setLitros(Number(e.target.value))}
                                    bg="gray.50" border="none"
                                    _focus={{ bg: 'white', border: '1px solid', borderColor: 'brand.500', boxShadow: 'none' }}
                                />
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter px={6} pb={6} borderTopWidth={0}>
                        <Button mr={3} onClick={onClose} variant="ghost" borderRadius="xl">Cancelar</Button>
                        <Button colorScheme="brand" onClick={handleSubmit} isLoading={submitting} borderRadius="xl" px={6} shadow="lg">Guardar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Delete Confirmation Alert */}
            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent borderRadius="2xl" mx={4}>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Eliminar Registro
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <Text color="gray.600">
                                ¿Estás seguro de que deseas eliminar este registro de producción?
                            </Text>
                            <Text mt={2} color="red.500" fontWeight="semibold" fontSize="sm">
                                Esta acción es permanente y no se puede deshacer.
                            </Text>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onDeleteClose} variant="ghost" borderRadius="xl">
                                Cancelar
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={confirmDelete}
                                ml={3}
                                borderRadius="xl"
                                isLoading={deleting}
                            >
                                Eliminar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </MotionBox>
    );
};
