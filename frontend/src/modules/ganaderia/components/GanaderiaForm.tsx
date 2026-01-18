import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input, useToast, VStack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
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

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
            <ModalOverlay backdropFilter="blur(2px)" />
            <ModalContent borderRadius="2xl" boxShadow="xl">
                <ModalHeader>{isEditing ? 'Editar Ganadería' : 'Nueva Ganadería'}</ModalHeader>
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
                <ModalFooter>
                    <Button variant="ghost" onClick={onClose} mr={3} borderRadius="xl">Cancelar</Button>
                    <Button
                        colorScheme="brand"
                        onClick={handleSubmit}
                        isLoading={loading}
                        isDisabled={!hasChanges || !nombre.trim()}
                        borderRadius="xl"
                        px={8}
                    >
                        {isEditing ? 'Guardar Cambios' : 'Crear'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
