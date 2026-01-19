import { VStack, Flex, Icon, Text, Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, HStack, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { FiDroplet, FiCalendar, FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { type Ordeno } from '../models';
import { type Vaca } from '../../vaca/models';

interface OrdenoListProps {
    groupedOrdenos: {
        grouped: Record<string, Ordeno[]>;
        dates: string[];
        isEmpty: boolean;
    };
    vacas: Vaca[];
    canEdit: boolean;
    canDelete: boolean;
    onEdit: (ordeno: Ordeno) => void;
    onDelete: (ordeno: Ordeno) => void;
}

export const OrdenoItem = ({
    ordeno,
    vacaNombre,
    canEdit,
    canDelete,
    onEdit,
    onDelete
}: {
    ordeno: Ordeno;
    vacaNombre: string;
    canEdit: boolean;
    canDelete: boolean;
    onEdit: (ordeno: Ordeno) => void;
    onDelete: (ordeno: Ordeno) => void;
}) => (
    <Box
        bg="white"
        p={4}
        borderRadius="2xl"
        boxShadow="sm"
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
                        {vacaNombre}
                    </Text>
                    <HStack fontSize="xs" color="gray.400" spacing={2}>
                        <Text textTransform="capitalize" color="brand.500" fontWeight="medium">
                            {ordeno.turno === 'MANANA' ? 'Mañana' : 'Noche'}
                        </Text>
                    </HStack>
                </VStack>
            </HStack>
            <HStack spacing={4}>
                <Text fontSize="lg" fontWeight="bold" color="gray.800">{ordeno.litros} L</Text>
                {(canEdit || canDelete) && (
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
                            {canEdit && <MenuItem icon={<FiEdit2 />} onClick={() => onEdit(ordeno)} fontSize="sm">Editar</MenuItem>}
                            {canDelete && <MenuItem icon={<FiTrash2 />} onClick={() => onDelete(ordeno)} color="red.500" fontSize="sm">Eliminar</MenuItem>}
                        </MenuList>
                    </Menu>
                )}
            </HStack>
        </Flex>
    </Box>
);

export const OrdenoList = ({
    groupedOrdenos,
    vacas,
    canEdit,
    canDelete,
    onEdit,
    onDelete
}: OrdenoListProps) => {
    if (groupedOrdenos.isEmpty) {
        return (
            <Flex direction="column" align="center" justify="center" bg="white" p={12} rounded="3xl" shadow="sm" textAlign="center">
                <Icon as={FiDroplet} boxSize={10} color="gray.300" mb={4} />
                <Text fontSize="lg" fontWeight="medium" color="gray.600" mb={1}>
                    Sin registros
                </Text>
                <Text color="gray.400" fontSize="sm">
                    No hay ordeños con este filtro.
                </Text>
            </Flex>
        );
    }

    return (
        <VStack spacing={3} align="stretch" pb={24}>
            <Accordion allowMultiple defaultIndex={[0]} allowToggle>
                {groupedOrdenos.dates.map((dateIso) => {
                    const displayDate = new Date(dateIso + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                    const records = groupedOrdenos.grouped[dateIso];
                    const totalLitros = records.reduce((sum, r) => sum + Number(r.litros), 0).toFixed(1);

                    return (
                        <AccordionItem key={dateIso} border="none" mb={4} bg="transparent">
                            <h2>
                                <AccordionButton bg="white" borderRadius="xl" shadow="sm" mb={2} _hover={{ bg: 'gray.50' }} py={3}>
                                    <Box flex="1" textAlign="left">
                                        <Flex justify="space-between" align="center" pr={4}>
                                            <HStack spacing={3}>
                                                <Icon as={FiCalendar} color="brand.500" />
                                                <Text fontWeight="bold" color="gray.700" textTransform="capitalize" fontSize="md">
                                                    {displayDate}
                                                </Text>
                                            </HStack>
                                            <HStack>
                                                <Text fontSize="sm" color="gray.500" fontWeight="medium">Total: {totalLitros} L</Text>
                                                <AccordionIcon color="gray.400" />
                                            </HStack>
                                        </Flex>
                                    </Box>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} px={0}>
                                <VStack spacing={3} align="stretch">
                                    {records.map((ordeno) => (
                                        <OrdenoItem
                                            key={ordeno.ordeno_id}
                                            ordeno={ordeno}
                                            vacaNombre={vacas.find(v => v.vaca_id === ordeno.vaca_id)?.nombre || ordeno.vaca?.nombre || 'Desconocida'}
                                            canEdit={canEdit}
                                            canDelete={canDelete}
                                            onEdit={onEdit}
                                            onDelete={onDelete}
                                        />
                                    ))}
                                </VStack>
                            </AccordionPanel>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </VStack>
    );
};
