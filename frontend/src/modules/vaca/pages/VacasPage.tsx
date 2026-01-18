import {
    SimpleGrid, Flex, Heading, Button, Spinner, Text, useDisclosure, Box, HStack,
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
    useToast
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { VacaCard } from '../components/VacaCard';
import { VacaForm } from '../components/VacaForm';
import { MotionBox } from '../../../shared/ui/MotionBox';
import { useState, useRef } from 'react';
import { type Vaca } from '../models';
import { useGanaderia } from '../../../shared/context/GanaderiaContext';
import { vacaService } from '../services/vaca.service';

export const VacasPage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);
    const [selectedVaca, setSelectedVaca] = useState<Vaca | null>(null);
    const [vacaToDelete, setVacaToDelete] = useState<Vaca | null>(null);
    const [deleting, setDeleting] = useState(false);
    const toast = useToast();

    const {
        ganaderia,
        loading: loadingGanaderia,
        vacas,
        vacasLoading,
        removeVaca
    } = useGanaderia();

    const [categoria, setCategoria] = useState('TODAS');
    const categories = ['TODAS', 'VACAS', 'TERNERAS', 'NOVILLAS'];

    const handleCreate = () => {
        setSelectedVaca(null);
        onOpen();
    };

    const handleEdit = (vaca: Vaca) => {
        setSelectedVaca(vaca);
        onOpen();
    };

    const handleDelete = (vaca: Vaca) => {
        setVacaToDelete(vaca);
        onDeleteOpen();
    };

    const confirmDelete = async () => {
        if (!vacaToDelete) return;
        setDeleting(true);
        try {
            await vacaService.deleteVaca(vacaToDelete.vaca_id);
            toast({
                title: 'Vaca eliminada',
                description: `${vacaToDelete.nombre} ha sido eliminada permanentemente.`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            removeVaca(vacaToDelete.vaca_id);
            onDeleteClose();
        } catch (error: any) {
            toast({
                title: 'Error al eliminar',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setDeleting(false);
            setVacaToDelete(null);
        }
    };



    const isLoading = loadingGanaderia || vacasLoading;

    // Filtered Vacas
    const filteredVacas = vacas.filter(vaca => {
        if (categoria === 'TODAS') return true;
        // Basic match for now, assuming case sensitive or map it
        return (vaca as any).categoria === categoria;
    });

    if (isLoading && vacas.length === 0) return <Flex justify="center" p={10}><Spinner size="xl" color="brand.500" /></Flex>;

    return (
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} w="full" px={{ base: 1, md: 0 }}>
            <Flex justify="space-between" align="center" mb={6} direction={{ base: 'column', sm: 'row' }} gap={4}>
                <Box alignSelf="start">
                    <Heading size="lg" color="gray.800" fontWeight="bold" letterSpacing="tight" mb={1}>Mis Vacas</Heading>
                    <Text fontSize="sm" color="gray.400">Gestión de ganado</Text>
                </Box>
                <Button
                    leftIcon={<FiPlus />}
                    colorScheme="brand"
                    variant="solid"
                    size="md"
                    borderRadius="xl"
                    boxShadow="sm"
                    onClick={handleCreate}
                    isDisabled={!ganaderia}
                    w={{ base: 'full', sm: 'auto' }}
                >
                    Nueva
                </Button>
            </Flex>

            {/* Horizontal Categories */}
            <Box mb={8} overflowX="auto" w="full" pb={2} sx={{
                '&::-webkit-scrollbar': { height: '4px' },
                '&::-webkit-scrollbar-track': { bg: 'transparent' },
                '&::-webkit-scrollbar-thumb': { bg: 'gray.200', borderRadius: 'full' },
            }}>
                <HStack spacing={3} minW="max-content" px={1}>
                    {categories.map(cat => (
                        <Button
                            key={cat}
                            variant={categoria === cat ? 'solid' : 'ghost'}
                            colorScheme={categoria === cat ? 'brand' : 'gray'}
                            size="sm"
                            borderRadius="full"
                            onClick={() => setCategoria(cat)}
                            px={6}
                            fontWeight={categoria === cat ? 'bold' : 'medium'}
                            _hover={{ bg: categoria === cat ? 'brand.600' : 'gray.100' }}
                        >
                            {cat}
                        </Button>
                    ))}
                </HStack>
            </Box>

            {filteredVacas.length === 0 ? (
                <Flex direction="column" align="center" justify="center" bg="white" p={12} rounded="3xl" shadow="sm" textAlign="center">
                    <Text fontSize="lg" fontWeight="medium" color="gray.600" mb={1}>
                        {vacas.length === 0
                            ? (!ganaderia ? 'Configura tu ganadería primero' : 'Está muy tranquilo por aquí')
                            : `No hay ${categoria.toLowerCase()} registradas`}
                    </Text>
                    <Text color="gray.400" mb={6} fontSize="sm">
                        {vacas.length === 0
                            ? (!ganaderia ? 'Ve a tu perfil para crear tu ganadería.' : 'Registra tus animales para comenzar el seguimiento.')
                            : 'Intenta cambiar de filtro o agregar un nuevo animal.'}
                    </Text>
                    {ganaderia && vacas.length === 0 && (
                        <Button leftIcon={<FiPlus />} size="lg" variant="outline" colorScheme="brand" onClick={handleCreate}>
                            Registrar primera vaca
                        </Button>
                    )}
                </Flex>
            ) : (
                <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5} minChildWidth={{ base: 'full', sm: '300px' }}>
                    {filteredVacas.map(vaca => (
                        <VacaCard
                            key={vaca.vaca_id}
                            vaca={vaca}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </SimpleGrid>
            )}

            <VacaForm
                isOpen={isOpen}
                onClose={onClose}
                vacaToEdit={selectedVaca}
                ganaderiaId={ganaderia?.ganaderia_id}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent borderRadius="2xl" mx={4}>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Eliminar Vaca
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <Text color="gray.600">
                                ¿Estás seguro de que deseas eliminar a <strong>{vacaToDelete?.nombre}</strong>?
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
