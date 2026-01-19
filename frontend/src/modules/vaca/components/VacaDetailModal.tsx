import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
    Button, Text, VStack, SimpleGrid, Box, Badge, HStack, Icon
} from '@chakra-ui/react';
import { FiCalendar, FiTag, FiHash } from 'react-icons/fi';
import { type Vaca } from '../models';

interface VacaDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    vaca: Vaca | null;
}

export const VacaDetailModal = ({ isOpen, onClose, vaca }: VacaDetailModalProps) => {
    if (!vaca) return null;

    const StatusBadge = ({ estado }: { estado: string }) => {
        const statusConfig = {
            ACTIVA: { color: 'green', label: 'Activa' },
            VENDIDA: { color: 'gray', label: 'Vendida' },
            MUERTA: { color: 'red', label: 'Muerta' },
        };
        // @ts-ignore
        const config = statusConfig[estado] || { color: 'blue', label: estado };

        return (
            <Badge colorScheme={config.color} fontSize="sm" borderRadius="lg" px={2} py={1}>
                {config.label}
            </Badge>
        );
    };

    const DetailItem = ({ label, value, icon }: { label: string, value: string | undefined, icon: any }) => (
        <HStack align="flex-start" spacing={3} p={3} bg="gray.50" borderRadius="xl">
            <Box p={2} bg="white" borderRadius="lg" shadow="sm">
                <Icon as={icon} color="brand.500" boxSize={5} />
            </Box>
            <VStack align="start" spacing={0}>
                <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase" letterSpacing="wide">
                    {label}
                </Text>
                <Text fontSize="md" fontWeight="semibold" color="gray.700">
                    {value || '---'}
                </Text>
            </VStack>
        </HStack>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
            <ModalOverlay backdropFilter="blur(5px)" />
            <ModalContent borderRadius="2xl" mx={4}>
                <ModalHeader pt={6} pb={0}>
                    <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={1}>
                            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                                {vaca.nombre}
                            </Text>
                            <HStack>
                                <Badge colorScheme="brand" variant="outline" fontSize="xs" borderRadius="full" px={2}>
                                    {vaca.tipo}
                                </Badge>
                                <StatusBadge estado={vaca.estado} />
                            </HStack>
                        </VStack>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton mt={2} />

                <ModalBody py={6}>
                    <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                        <DetailItem label="Código" value={vaca.codigo} icon={FiHash} />
                        <DetailItem label="Raza" value={vaca.raza || 'No registrada'} icon={FiTag} />
                        <DetailItem
                            label="Fecha Nacimiento"
                            value={vaca.fecha_nacimiento ? new Date(vaca.fecha_nacimiento).toLocaleDateString() : '---'}
                            icon={FiCalendar}
                        />
                        {/* Peso removed as it is not in model */}
                    </SimpleGrid>
                </ModalBody>

                <ModalFooter bg="gray.50" borderBottomRadius="2xl">
                    <Button onClick={onClose} borderRadius="xl" size="lg" w="full">
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
