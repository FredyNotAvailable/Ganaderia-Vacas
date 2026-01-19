import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input, useToast, VStack, Flex, Text, useDisclosure, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { ganaderiaService } from '../services/ganaderia.service';
import { useGanaderia } from '../../../shared/context/GanaderiaContext';
import { type Ganaderia } from '../models';

interface GanaderiaFormProps {
    isOpen: boolean;
    onClose: () => void;
    ganaderiaToEdit?: Ganaderia | null;
}

export const GanaderiaForm = ({ isOpen, onClose, ganaderiaToEdit }: GanaderiaFormProps) => {
    const [nombre, setNombre] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [loading, setLoading] = useState(false);
    const { refreshGanaderia, selectGanaderia } = useGanaderia();
    const toast = useToast();
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
    const cancelRef = useRef<any>(null);

    useEffect(() => {
        if (ganaderiaToEdit) {
            setNombre(ganaderiaToEdit.nombre);
            setUbicacion(ganaderiaToEdit.ubicacion || '');
        } else {
            setNombre('');
            setUbicacion('');
        }
    }, [ganaderiaToEdit, isOpen]);

    const isEditing = !!ganaderiaToEdit;

    // Check if there are changes
    const hasChanges = isEditing
        ? nombre !== ganaderiaToEdit.nombre || ubicacion !== (ganaderiaToEdit.ubicacion || '')
        : nombre.trim().length > 0;

    const handleSubmit = async () => {
        if (!nombre.trim()) return;
        if (isEditing && !hasChanges) return;

        setLoading(true);
        try {
            if (isEditing && ganaderiaToEdit) {
                await ganaderiaService.updateGanaderia(ganaderiaToEdit.ganaderia_id, { nombre, ubicacion });
                toast({ title: 'Ganadería actualizada', status: 'success' });
            } else {
                const newGanaderia = await ganaderiaService.createGanaderia({ nombre, ubicacion });
                selectGanaderia(newGanaderia.ganaderia_id);
                toast({ title: 'Ganadería creada', status: 'success' });
            }
            await refreshGanaderia();
            onClose();
        } catch (error) {
            console.error(error);
            toast({ title: `Error al ${isEditing ? 'actualizar' : 'crear'}`, status: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCerrar = () => {
        if (hasChanges) onConfirmOpen();
        else onClose();
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={handleCerrar} size="md" isCentered>
                <ModalOverlay backdropFilter="blur(5px)" bg="blackAlpha.300" />
                <ModalContent borderRadius="2xl" boxShadow="2xl">
                    <ModalHeader pt={6} px={6}>
                        <Flex justify="space-between" align="center">
                            <Text fontSize="lg" fontWeight="bold">{isEditing ? 'Editar Ganadería' : 'Nueva Ganadería'}</Text>
                            <Button
                                variant="ghost"
                                color="red.500"
                                size="sm"
                                onClick={handleCerrar}
                                fontWeight="bold"
                            >
                                Cerrar
                            </Button>
                        </Flex>
                    </ModalHeader>
                    <ModalBody>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm">Nombre</FormLabel>
                                <Input
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Ej. Hacienda Las Nubes"
                                    autoFocus
                                    borderRadius="xl"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel fontSize="sm">Ubicación (Opcional)</FormLabel>
                                <Input
                                    value={ubicacion}
                                    onChange={(e) => setUbicacion(e.target.value)}
                                    placeholder="Ej. San Pedro, Antioquia"
                                    borderRadius="xl"
                                />
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter px={6} pb={6}>
                        <Button
                            colorScheme="brand"
                            w="full"
                            onClick={handleSubmit}
                            isLoading={loading}
                            isDisabled={!hasChanges || !nombre.trim()}
                            borderRadius="xl"
                        >
                            {isEditing ? 'Guardar Cambios' : 'Crear'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Confirmación de cambios sin guardar */}
            <AlertDialog
                isOpen={isConfirmOpen}
                leastDestructiveRef={cancelRef}
                onClose={onConfirmClose}
                isCentered
            >
                <AlertDialogOverlay backdropFilter="blur(2px)">
                    <AlertDialogContent borderRadius="2xl" mx={4}>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">Cambios sin guardar</AlertDialogHeader>
                        <AlertDialogBody>
                            Se perderán los cambios realizados. ¿Deseas continuar?
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onConfirmClose} variant="ghost" borderRadius="xl">
                                No, seguir editando
                            </Button>
                            <Button colorScheme="red" onClick={() => {
                                onConfirmClose();
                                onClose();
                            }} ml={3} borderRadius="xl">
                                Sí, cerrar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};
