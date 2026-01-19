import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, Text, VStack, HStack, Icon, Badge, Box, Divider, List, ListItem, ListIcon
} from '@chakra-ui/react';
import { FiInfo, FiCheckCircle, FiLock, FiHome, FiUsers } from 'react-icons/fi';
import { usePermisosFinca } from '../hooks/usePermisosFinca';
import { type Ganaderia } from '../../modules/ganaderia/models';
import { puede, getDescripcionPermiso, type AccionType } from '../auth/permission.models';

interface FincaInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    ganaderia?: Ganaderia | null;
}

export const FincaInfoModal = ({ isOpen, onClose, ganaderia: propGanaderia }: FincaInfoModalProps) => {
    const context = usePermisosFinca();

    // Resolve which data to use
    const g = propGanaderia || null;
    const esDueno = g ? (g.rol === 'DUEÑO') : context.esDueno;
    const permisoActual = g ? (g.permiso || 'LECTURA') : context.permisoActual;
    const rolDetalle = g ? g.rol_detalle : context.rolDetalle;
    const nombreFinca = g ? g.nombre : context.nombreFinca;
    const descripcionPermiso = g ? getDescripcionPermiso(permisoActual) : context.descripcionPermiso;

    const canLocal = (accion: AccionType): boolean => {
        if (esDueno) return true;
        return puede(permisoActual, accion);
    };

    const permisosList = [
        { key: 'leer', label: 'Ver datos de la finca', check: canLocal('leer') },
        { key: 'crear', label: 'Registrar vacas y ordeños', check: canLocal('crear') },
        { key: 'editar', label: 'Editar información existente', check: canLocal('editar') },
        { key: 'eliminar', label: 'Eliminar registros permanentemente', check: canLocal('eliminar') },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
            <ModalContent borderRadius="3xl" p={2}>
                <ModalHeader pb={0}>
                    <HStack spacing={3}>
                        <Icon as={FiInfo} color="brand.500" boxSize={5} />
                        <Text fontSize="xl" fontWeight="bold">Información de Finca</Text>
                    </HStack>
                </ModalHeader>
                <ModalBody py={6}>
                    <VStack align="stretch" spacing={5}>
                        <Box>
                            <Text fontSize="xs" color="gray.400" fontWeight="bold" textTransform="uppercase" mb={1}>Finca</Text>
                            <Text fontSize="lg" fontWeight="extrabold" color="gray.800">{nombreFinca}</Text>
                        </Box>

                        <Box bg="gray.50" p={4} borderRadius="2xl" border="1px solid" borderColor="gray.100">
                            <HStack justify="space-between" mb={2}>
                                <Text fontSize="xs" color="gray.500" fontWeight="bold">TIPO DE ACCESO</Text>
                                <Badge colorScheme={esDueno ? 'brand' : 'blue'} borderRadius="lg" px={3} variant="solid">
                                    {esDueno ? 'Principal' : 'Compartida'}
                                </Badge>
                            </HStack>
                            <HStack spacing={2} mb={3}>
                                <Icon as={esDueno ? FiHome : FiUsers} boxSize={4} color={esDueno ? 'brand.500' : 'blue.500'} />
                                <Text fontSize="md" fontWeight="bold" color="gray.700">
                                    {esDueno ? 'Dueño Directo' : (rolDetalle ? `Rol: ${rolDetalle.nombre}` : `Permiso: ${permisoActual}`)}
                                </Text>
                            </HStack>
                            <Text fontSize="sm" color="gray.600" lineHeight="tall">
                                {esDueno ? 'Tienes control total sobre esta finca al ser el propietario.' : descripcionPermiso}
                            </Text>
                        </Box>

                        <Divider />

                        <Box>
                            <Text fontSize="xs" color="gray.400" fontWeight="bold" textTransform="uppercase" mb={3}>Tus capacidades</Text>
                            <List spacing={3}>
                                {permisosList.map((p) => (
                                    <ListItem key={p.key} display="flex" alignItems="center">
                                        <ListIcon
                                            as={p.check ? FiCheckCircle : FiLock}
                                            color={p.check ? 'brand.500' : 'gray.300'}
                                            boxSize={4}
                                        />
                                        <Text fontSize="sm" color={p.check ? 'gray.700' : 'gray.400'} fontWeight={p.check ? 'medium' : 'normal'}>
                                            {p.label}
                                        </Text>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </VStack>
                </ModalBody>
                <ModalFooter pt={0}>
                    <Button w="full" onClick={onClose} bg="brand.500" color="white" _hover={{ bg: 'brand.600' }} borderRadius="2xl">
                        Entendido
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
