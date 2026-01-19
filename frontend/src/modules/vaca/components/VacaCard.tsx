import { Badge, Text, HStack, IconButton, Menu, MenuButton, MenuList, MenuItem, VStack, Portal } from '@chakra-ui/react';
import { FiMoreVertical, FiEdit, FiTrash } from 'react-icons/fi';
import { type Vaca } from '../models';
import { MotionBox } from '../../../shared/ui/MotionBox';

interface VacaCardProps {
    vaca: Vaca;
    onEdit?: (vaca: Vaca, e: React.MouseEvent) => void;
    onDelete?: (vaca: Vaca, e: React.MouseEvent) => void;
    onClick?: (vaca: Vaca) => void;
}

export const VacaCard = ({ vaca, onEdit, onDelete, onClick }: VacaCardProps) => {
    // ... (statusConfig logic remains same)

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
            whileHover={{ y: -2, boxShadow: 'md', cursor: 'pointer' }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            p="5"
            onClick={() => onClick?.(vaca)}
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
                    <HStack spacing={2} align="center">
                        <Badge variant="subtle" colorScheme="blue" fontSize="9px" borderRadius="full" px={2}>
                            {vaca.tipo}
                        </Badge>
                        {/* Breed removed as requested */}
                    </HStack>
                </VStack>

                {(onEdit || onDelete) && (
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
                            onClick={(e) => {
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                            }}
                        />
                        <Portal>
                            <MenuList
                                borderRadius="xl"
                                shadow="2xl"
                                border="none"
                                zIndex={9999}
                                minW="180px"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {onEdit && (
                                    <MenuItem
                                        icon={<FiEdit />}
                                        onClick={(e) => onEdit?.(vaca, e)}
                                        fontSize="sm"
                                        py={3}
                                    >
                                        Editar
                                    </MenuItem>
                                )}
                                {onDelete && (
                                    <MenuItem
                                        icon={<FiTrash />}
                                        color="red.500"
                                        onClick={(e) => onDelete?.(vaca, e)}
                                        fontSize="sm"
                                        py={3}
                                    >
                                        Eliminar
                                    </MenuItem>
                                )}
                            </MenuList>
                        </Portal>
                    </Menu>
                )}
            </HStack>

            <HStack pt={3} borderTop="1px solid" borderColor="gray.50" justify="space-between">
                <Text fontSize="xs" color="gray.400" fontWeight="medium">Código</Text>
                <Text fontSize="sm" color="gray.700" fontWeight="bold">{vaca.codigo}</Text>
            </HStack>
        </MotionBox>
    );
};
