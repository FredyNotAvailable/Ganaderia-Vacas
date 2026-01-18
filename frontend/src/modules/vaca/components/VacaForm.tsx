import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    VStack,
    useToast,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useBreakpointValue
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { type CreateVacaDTO, type Vaca } from '../models';
import { vacaService } from '../services/vaca.service';
import { useGanaderia } from '../../../shared/context/GanaderiaContext';

interface VacaFormProps {
    isOpen: boolean;
    onClose: () => void;
    vacaToEdit?: Vaca | null;
    ganaderiaId?: string;
}

export const VacaForm = ({ isOpen, onClose, vacaToEdit, ganaderiaId }: VacaFormProps) => {
    const [nombre, setNombre] = useState('');
    const [codigo, setCodigo] = useState('');
    const [raza, setRaza] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    // const [peso, setPeso] = useState(0); // Removing peso as it's not in backend
    const [estado, setEstado] = useState<string>('ACTIVA'); // Default backend state?
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { addVaca, updateVaca } = useGanaderia();

    const isMobile = useBreakpointValue({ base: true, md: false });

    useEffect(() => {
        if (vacaToEdit) {
            setNombre(vacaToEdit.nombre || '');
            setCodigo(vacaToEdit.codigo);
            setRaza(vacaToEdit.raza || '');
            setFechaNacimiento(vacaToEdit.fecha_nacimiento || '');
            setEstado(vacaToEdit.estado || 'ACTIVA');
        } else {
            setNombre('');
            setCodigo('');
            setRaza('');
            setFechaNacimiento('');
            setEstado('ACTIVA');
        }
    }, [vacaToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure we have props.ganaderiaId if creating
        if (!isOpen) return;

        setLoading(true);

        try {
            if (!ganaderiaId && !vacaToEdit) {
                // throw new Error("No se identificó la ganadería.");
                // Graceful fallback or error logic
            }

            const data: CreateVacaDTO = {
                nombre,
                codigo,
                raza,
                fecha_nacimiento: fechaNacimiento,
                estado,
                ganaderia_id: ganaderiaId || vacaToEdit?.ganaderia_id || ''
            };

            if (vacaToEdit) {
                const updatedVaca = await vacaService.updateVaca(vacaToEdit.vaca_id, data);
                updateVaca(updatedVaca);
                toast({ title: 'Vaca actualizada', status: 'success' });
            } else {
                const newVaca = await vacaService.createVaca(data);
                addVaca(newVaca);
                toast({ title: 'Vaca creada', status: 'success' });
            }
            onClose();
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, status: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const FormContent = (
        <VStack spacing={5} py={2}>
            <FormControl isRequired>
                <FormLabel color="gray.600" fontSize="sm">Código / Arete</FormLabel>
                <Input
                    value={codigo}
                    onChange={e => setCodigo(e.target.value)}
                    placeholder="Ej. 001"
                    bg="gray.50"
                    border="none"
                    _focus={{ bg: 'white', border: '1px solid', borderColor: 'brand.500', boxShadow: 'none' }}
                />
            </FormControl>
            <FormControl isRequired>
                <FormLabel color="gray.600" fontSize="sm">Nombre de la Vaca</FormLabel>
                <Input
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    placeholder="Ej. Lola"
                    bg="gray.50"
                    border="none"
                    _focus={{ bg: 'white', border: '1px solid', borderColor: 'brand.500', boxShadow: 'none' }}
                />
            </FormControl>
            <FormControl>
                <FormLabel color="gray.600" fontSize="sm">Raza</FormLabel>
                <Input
                    value={raza}
                    onChange={e => setRaza(e.target.value)}
                    placeholder="Ej. Holstein"
                    bg="gray.50"
                    border="none"
                    _focus={{ bg: 'white', border: '1px solid', borderColor: 'brand.500', boxShadow: 'none' }}
                />
            </FormControl>
            <FormControl>
                <FormLabel color="gray.600" fontSize="sm">Fecha Nacimiento</FormLabel>
                <Input
                    type="date"
                    value={fechaNacimiento}
                    onChange={e => setFechaNacimiento(e.target.value)}
                    bg="gray.50"
                    border="none"
                    _focus={{ bg: 'white', border: '1px solid', borderColor: 'brand.500', boxShadow: 'none' }}
                />
            </FormControl>

            <FormControl isRequired>
                <FormLabel color="gray.600" fontSize="sm">Estado</FormLabel>
                <Select
                    value={estado}
                    onChange={e => setEstado(e.target.value as any)}
                    bg="gray.50"
                    border="none"
                    _focus={{ bg: 'white', border: '1px solid', borderColor: 'brand.500', boxShadow: 'none' }}
                >
                    <option value="ACTIVA">Activa</option>
                    <option value="VENDIDA">Vendida</option>
                    <option value="MUERTA">Muerta</option>
                </Select>
            </FormControl>
        </VStack>
    );

    // Use Drawer for Mobile, Modal for Desktop
    if (isMobile) {
        return (
            <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent borderTopRadius="2xl">
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="0">
                        {vacaToEdit ? 'Editar Vaca' : 'Nueva Vaca'}
                    </DrawerHeader>
                    <DrawerBody>
                        <form id="vaca-form" onSubmit={handleSubmit}>
                            {FormContent}
                        </form>
                    </DrawerBody>
                    <DrawerFooter borderTopWidth="0" pb={8}>
                        <Button variant="ghost" mr={3} onClick={onClose} borderRadius="xl" size="lg">Cancelar</Button>
                        <Button colorScheme="brand" type="submit" form="vaca-form" isLoading={loading} w="full" borderRadius="xl" size="lg" shadow="xl">
                            {vacaToEdit ? 'Actualizar' : 'Guardar'}
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
            <ModalOverlay backdropFilter="blur(5px)" bg="blackAlpha.300" />
            <ModalContent borderRadius="2xl" boxShadow="2xl">
                <ModalHeader borderBottomWidth="0" pt={6} px={6}>{vacaToEdit ? 'Editar Vaca' : 'Registrar Vaca'}</ModalHeader>
                <ModalCloseButton top={4} right={4} />
                <ModalBody px={6}>
                    <form id="vaca-form-modal" onSubmit={handleSubmit}>
                        {FormContent}
                    </form>
                </ModalBody>
                <ModalFooter px={6} pb={6} borderTopWidth="0">
                    <Button variant="ghost" mr={3} onClick={onClose} borderRadius="xl">Cancelar</Button>
                    <Button colorScheme="brand" type="submit" form="vaca-form-modal" isLoading={loading} px={8} borderRadius="xl" shadow="lg">
                        {vacaToEdit ? 'Actualizar' : 'Guardar'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
