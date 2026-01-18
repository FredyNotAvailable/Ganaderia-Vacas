import { Badge, Text, HStack, IconButton, Menu, MenuButton, MenuList, MenuItem, VStack } from '@chakra-ui/react';
import { FiMoreVertical, FiEdit, FiTrash } from 'react-icons/fi';
import { type Vaca } from '../models';
import { MotionBox } from '../../../shared/ui/MotionBox';

interface VacaCardProps {
    vaca: Vaca;
    onEdit?: (vaca: Vaca) => void;
    onDelete?: (vaca: Vaca) => void;
}

export const VacaCard = ({ vaca, onEdit, onDelete }: VacaCardProps) => {
    const statusConfig = {
        ACTIVA: { color: 'brand', label: 'Activa', bg: 'brand.50' },
        VENDIDA: { color: 'gray', label: 'Vendida', bg: 'gray.100' },
        MUERTA: { color: 'gray', label: 'Muerta', bg: 'gray.200' },
        // Fallback or mapped
        lactancia: { color: 'brand', label: 'Lactancia', bg: 'brand.50' },
        gestacion: { color: 'brand', label: 'Gestación', bg: 'brand.50' },
        seca: { color: 'gray', label: 'Seca', bg: 'gray.100' },
        enferma: { color: 'gray', label: 'Enferma', bg: 'gray.200' },
    };

    // Safe access
    // @ts-ignore
    const config = statusConfig[vaca.estado] || statusConfig['ACTIVA'];

    return (
        <MotionBox
            bg="white"
            borderRadius="2xl"
            overflow="hidden"
            boxShadow="sm"
            whileHover={{ y: -2, boxShadow: 'md' }}
            transition={{ duration: 0.2 }}
            p="5"
        >
            <HStack justify="space-between" align="start" mb={4}>
                <VStack align="start" spacing={0} flex="1">
                    <HStack spacing={2} align="center" mb={1}>
                        <Text fontSize="lg" fontWeight="bold" color="gray.800" lineHeight="short" noOfLines={1}>
                            {vaca.nombre}
                        </Text>
                        <Badge
                            bg={config.bg}
                            color={config.color === 'brand' ? 'brand.600' : 'gray.600'}
                            px={2}
                            py={0.5}
                            borderRadius="lg"
                            textTransform="capitalize"
                            fontWeight="bold"
                            fontSize="10px"
                        >
                            {config.label}
                        </Badge>
                    </HStack>
                    <Text fontSize="sm" color="gray.400" fontWeight="medium">
                        {vaca.raza}
                    </Text>
                </VStack>

                <Menu isLazy>
                    <MenuButton
                        as={IconButton}
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        size="sm"
                        aria-label="Opciones"
                        color="gray.400"
                        _hover={{ color: 'gray.600', bg: 'gray.50' }}
                        borderRadius="full"
                    />
                    <MenuList borderRadius="xl" shadow="lg" border="none" zIndex={10}>
                        <MenuItem icon={<FiEdit />} onClick={() => onEdit?.(vaca)} fontSize="sm">Editar</MenuItem>
                        <MenuItem icon={<FiTrash />} color="red.500" onClick={() => onDelete?.(vaca)} fontSize="sm">Eliminar</MenuItem>
                    </MenuList>
                </Menu>
            </HStack>

            <HStack pt={3} borderTop="1px solid" borderColor="gray.50" justify="space-between">
                <Text fontSize="xs" color="gray.400" fontWeight="medium">Código</Text>
                <Text fontSize="sm" color="gray.700" fontWeight="bold">{vaca.codigo}</Text>
            </HStack>
        </MotionBox>
    );
};
