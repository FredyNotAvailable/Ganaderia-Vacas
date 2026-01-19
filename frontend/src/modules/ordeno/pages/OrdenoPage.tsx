import { useState, useRef, useMemo } from 'react';
import {
    Heading, Spinner, Flex, Button, useDisclosure,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Input, useToast,
    Text, VStack, HStack, Icon, Box, IconButton, Menu, MenuButton, MenuList, MenuItem,
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
    Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon
} from '@chakra-ui/react';
import { FiPlus, FiDroplet, FiMoreVertical, FiEdit2, FiTrash2, FiCalendar } from 'react-icons/fi';
import { ordenoService } from '../services/ordeno.service';
import { type CreateOrdenoDTO, type Ordeno } from '../models';
import { useGanaderia } from '../../../shared/context/GanaderiaContext';
import { MotionBox } from '../../../shared/ui/MotionBox';
import { usePermisosFinca } from '../../../shared/hooks/usePermisosFinca';

export const OrdenoPage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
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

    const { can } = usePermisosFinca();

    // State for CRUD
    const [ordenoToEdit, setOrdenoToEdit] = useState<Ordeno | null>(null);
    const [ordenoToDelete, setOrdenoToDelete] = useState<Ordeno | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const toast = useToast();

    // Helpers
    const getLocalDatetime = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        return new Date(now.getTime() - offset).toISOString().slice(0, 16);
    };

    const getTurnoFromTime = (dateTimeStr: string): 'MANANA' | 'TARDE' => {
        if (!dateTimeStr) return 'MANANA';
        const date = new Date(dateTimeStr);
        // Si no es una fecha válida (vacaId por error), fallback
        if (isNaN(date.getTime())) return 'MANANA';
        const hour = date.getHours();
        return hour < 12 ? 'MANANA' : 'TARDE';
    };

    // --- LÓGICA DE FILTRADO Y REGISTRO ---
    // --- LÓGICA DE FILTRADO Y REGISTRO ---
    const [filtroJornada, setFiltroJornada] = useState<'TODOS' | 'MANANA' | 'TARDE'>('TODOS');

    // Agrupación y Ordenamiento con useMemo
    const groupedOrdenos = useMemo(() => {
        // 1. Filtrar por Jornada
        const filteredByJornada = ordenos.filter(o => filtroJornada === 'TODOS' || o.turno === filtroJornada);

        // 2. Agrupar por Fecha (ISO YYYY-MM-DD en zona horaria Ecuador/Local)
        const grouped = filteredByJornada.reduce((acc, ordeno) => {
            const d = new Date(ordeno.fecha_ordeno);
            const isoDate = new Intl.DateTimeFormat('fr-CA', { timeZone: 'America/Guayaquil' }).format(d);
            if (!acc[isoDate]) acc[isoDate] = [];
            acc[isoDate].push(ordeno);
            return acc;
        }, {} as Record<string, Ordeno[]>);

        // 3. Obtener fechas ordenadas descendente
        const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

        return { grouped, dates, isEmpty: filteredByJornada.length === 0 };
    }, [ordenos, filtroJornada]);
    const [turnoActivoModal, setTurnoActivoModal] = useState<'MANANA' | 'TARDE'>('MANANA');
    const [fechaMasiva, setFechaMasiva] = useState<string>(''); // YYYY-MM-DD

    // Buffer global para persistir cambios al navegar entre fechas/turnos
    // Key: `${fecha}_${turno}` -> Value: Record<vacaId, litrosString>
    const [registroMasivoBuffer, setRegistroMasivoBuffer] = useState<Record<string, Record<string, string>>>({});

    // const [registroMasivo, setRegistroMasivo] = useState<Record<string, { litros: string, original: string, ordeno_id?: string }>>({}); // Removed in favor of buffer
    // const [hasChanges, setHasChanges] = useState(false); // Removed, derived now
    const { isOpen: isConfirmCloseOpen, onOpen: onConfirmCloseOpen, onClose: onConfirmCloseClose } = useDisclosure();

    const validateLitros = (value: string) => {
        if (value === "") return true;
        // Regex: Max 2 dígitos enteros, punto opcional, max 2 decimales
        const regex = /^\d{0,2}(\.\d{0,2})?$/;
        return regex.test(value);
    };

    // Helper para obtener el valor a mostrar (Buffer > Backend > "0")
    const getLitrosValue = (vacaId: string, fecha: string, turno: string) => {
        const key = `${fecha}_${turno}`;
        // 1. Si hay cambio local, usarlo
        if (registroMasivoBuffer[key] && registroMasivoBuffer[key][vacaId] !== undefined) {
            return registroMasivoBuffer[key][vacaId];
        }
        // 2. Si no, buscar en la data original
        const existing = ordenos.find(o => {
            const d = new Date(o.fecha_ordeno);
            const iso = new Intl.DateTimeFormat('fr-CA', { timeZone: 'America/Guayaquil' }).format(d);
            return o.vaca_id === vacaId && iso === fecha && o.turno === turno;
        });

        return existing ? existing.litros.toString() : "";
    };

    const handleOpenRegistroMasivo = () => {
        if (!ganaderia) {
            toast({ title: 'Configura tu ganadería primero', status: 'warning' });
            return;
        }
        // Calcular fecha hoy en Ecuador para input date
        const todayIso = new Intl.DateTimeFormat('fr-CA', { timeZone: 'America/Guayaquil' }).format(new Date());
        setFechaMasiva(todayIso);

        // Limpiar buffer al abrir para asegurar estado limpio
        setRegistroMasivoBuffer({});

        const currentTurno = getTurnoFromTime(getLocalDatetime());
        setTurnoActivoModal(currentTurno);
        onOpen();
    };

    const handleCambiarTurnoModal = (nuevoTurno: 'MANANA' | 'TARDE') => {
        setTurnoActivoModal(nuevoTurno);
    };

    const handleCambiarFechaModal = (nuevaFecha: string) => {
        setFechaMasiva(nuevaFecha);
    };

    const handleInputChange = (vacaId: string, value: string) => {
        let cleanValue = value;

        // Regla de oro: si borra todo, dejarlo vacío o en "0" para permitir escribir
        if (cleanValue === "") {
            /* Allow empty string in buffer */
        } else if (cleanValue.length > 1 && cleanValue.startsWith('0') && cleanValue[1] !== '.') {
            cleanValue = cleanValue.substring(1);
        }

        if (validateLitros(cleanValue)) {
            const key = `${fechaMasiva}_${turnoActivoModal}`;
            setRegistroMasivoBuffer(prev => ({
                ...prev,
                [key]: {
                    ...(prev[key] || {}),
                    [vacaId]: cleanValue
                }
            }));
        }
    };

    const handleGuardarMasivo = async () => {
        setSubmitting(true);
        try {
            // Guardar SOLO lo que está en el buffer para la fecha/jornada ACTUAL
            const key = `${fechaMasiva}_${turnoActivoModal}`;
            const changes = registroMasivoBuffer[key];

            if (!changes || Object.keys(changes).length === 0) {
                toast({ title: 'No hay cambios para guardar en esta vista', status: 'info' });
                setSubmitting(false);
                return;
            }

            const promises = Object.entries(changes).map(async ([vacaId, litrosStr]) => {
                const fechaOrdeno = new Date(`${fechaMasiva}T12:00:00`).toISOString();
                const litrosNum = Number(litrosStr) || 0;

                const existing = ordenos.find(o => {
                    const d = new Date(o.fecha_ordeno);
                    const iso = new Intl.DateTimeFormat('fr-CA', { timeZone: 'America/Guayaquil' }).format(d);
                    return o.vaca_id === vacaId && iso === fechaMasiva && o.turno === turnoActivoModal;
                });

                const dto: CreateOrdenoDTO = {
                    vaca_id: vacaId,
                    ganaderia_id: ganaderia!.ganaderia_id,
                    fecha_ordeno: fechaOrdeno,
                    turno: turnoActivoModal,
                    litros: litrosNum
                };

                if (existing) {
                    if (existing.litros !== litrosNum) {
                        const updated = await ordenoService.updateOrdeno(existing.ordeno_id, dto);
                        updateOrdeno(updated);
                    }
                } else if (litrosNum > 0) {
                    const created = await ordenoService.createOrdeno(dto);
                    addOrdeno(created);
                }
            });

            await Promise.all(promises);

            // Limpiar buffer para esta key solamente
            setRegistroMasivoBuffer(prev => {
                const copy = { ...prev };
                delete copy[key];
                return copy;
            });

            toast({ title: 'Registros guardados con éxito', status: 'success' });
            onClose();
        } catch (error: any) {
            toast({ title: 'Error al guardar', description: error.message, status: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleOpenEdit = (ordeno: Ordeno) => {
        setOrdenoToEdit(ordeno);
        onEditOpen();
    };

    const handleOpenDelete = (ordeno: Ordeno) => {
        setOrdenoToDelete(ordeno);
        onDeleteOpen();
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

    const handleCerrarModal = () => {
        if (Object.keys(registroMasivoBuffer).length > 0) {
            onConfirmCloseOpen();
        } else {
            onClose();
        }
    };

    const isLoading = loadingGanaderia || ordenosLoading;

    // Verificar si hay cambios pendientes en la vista actual para habilitar botón
    const currentViewKey = `${fechaMasiva}_${turnoActivoModal}`;
    const hasChangesInView = !!registroMasivoBuffer[currentViewKey] && Object.keys(registroMasivoBuffer[currentViewKey]).length > 0;

    return (
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} w="full">
            <Flex justify="space-between" align="center" mb={6}>
                <Box>
                    <Heading size="lg" color="gray.800" fontWeight="bold" letterSpacing="tight" mb={1}>Ordeños</Heading>
                    <Text fontSize="sm" color="gray.400">Hoy en {ganaderia?.nombre || 'la finca'}</Text>
                </Box>
                <Button
                    leftIcon={<FiPlus />}
                    colorScheme="brand"
                    variant="solid"
                    size="md"
                    borderRadius="xl"
                    boxShadow="md"
                    onClick={handleOpenRegistroMasivo}
                    isDisabled={!ganaderia || !can('crear')}
                    display={can('crear') ? 'flex' : 'none'}
                >
                    Registrar
                </Button>
            </Flex>

            {/* Filtros de Jornada */}
            <HStack spacing={2} mb={6} overflowX="auto" pb={2}>
                <Button
                    size="sm"
                    borderRadius="full"
                    variant={filtroJornada === 'TODOS' ? 'solid' : 'ghost'}
                    colorScheme={filtroJornada === 'TODOS' ? 'brand' : 'gray'}
                    onClick={() => setFiltroJornada('TODOS')}
                >
                    Todos
                </Button>
                <Button
                    size="sm"
                    borderRadius="full"
                    variant={filtroJornada === 'MANANA' ? 'solid' : 'ghost'}
                    colorScheme={filtroJornada === 'MANANA' ? 'brand' : 'gray'}
                    onClick={() => setFiltroJornada('MANANA')}
                >
                    Mañana
                </Button>
                <Button
                    size="sm"
                    borderRadius="full"
                    variant={filtroJornada === 'TARDE' ? 'solid' : 'ghost'}
                    colorScheme={filtroJornada === 'TARDE' ? 'brand' : 'gray'}
                    onClick={() => setFiltroJornada('TARDE')}
                >
                    Noche
                </Button>
            </HStack>

            {isLoading ? (
                <Flex justify="center" py={10}><Spinner size="xl" color="brand.500" thickness="3px" /></Flex>
            ) : (
                <VStack spacing={3} align="stretch" pb={24}>
                    {groupedOrdenos.isEmpty ? (
                        <Flex direction="column" align="center" justify="center" bg="white" p={12} rounded="3xl" shadow="sm" textAlign="center">
                            <Icon as={FiDroplet} boxSize={10} color="gray.300" mb={4} />
                            <Text fontSize="lg" fontWeight="medium" color="gray.600" mb={1}>
                                {!ganaderia ? 'Configura tu ganadería' : 'Sin registros'}
                            </Text>
                            <Text color="gray.400" fontSize="sm">
                                {!ganaderia ? 'Ve a tu perfil para configurar una ganadería.' : 'No hay ordeños con este filtro.'}
                            </Text>
                        </Flex>
                    ) : (
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
                                                    <Box
                                                        key={ordeno.ordeno_id}
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
                                                                        {vacas.find(v => v.vaca_id === ordeno.vaca_id)?.nombre || ordeno.vaca?.nombre || 'Desconocida'}
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
                                                                {(can('editar') || can('eliminar')) && (
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
                                                                            {can('editar') && <MenuItem icon={<FiEdit2 />} onClick={() => handleOpenEdit(ordeno)} fontSize="sm">Editar</MenuItem>}
                                                                            {can('eliminar') && <MenuItem icon={<FiTrash2 />} onClick={() => handleOpenDelete(ordeno)} color="red.500" fontSize="sm">Eliminar</MenuItem>}
                                                                        </MenuList>
                                                                    </Menu>
                                                                )}
                                                            </HStack>
                                                        </Flex>
                                                    </Box>
                                                ))}
                                            </VStack>
                                        </AccordionPanel>
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    )}
                </VStack>
            )}

            {/* Modal de Registro Masivo */}
            <Modal
                isOpen={isOpen}
                onClose={handleCerrarModal}
                size={{ base: "full", md: "4xl" }}
                scrollBehavior="inside"
            >
                <ModalOverlay backdropFilter="blur(5px)" bg="blackAlpha.300" />
                <ModalContent borderRadius={{ base: 0, md: "2xl" }} maxHeight={{ base: "100%", md: "80vh" }}>
                    <ModalHeader pt={6} px={6} borderBottomWidth={1} borderColor="gray.100">
                        <VStack align="stretch" spacing={4}>
                            <Flex justify="space-between" align="center">
                                <Text fontSize="xl" fontWeight="bold">Registro Masivo</Text>
                                <Button
                                    variant="ghost"
                                    color="red.500"
                                    size="sm"
                                    onClick={handleCerrarModal}
                                    fontWeight="bold"
                                >
                                    Cerrar
                                </Button>
                            </Flex>

                            {/* Selector de Fecha y Jornada */}
                            <VStack spacing={3} align="stretch" bg="gray.50" p={2} borderRadius="xl">
                                <HStack>
                                    <Box flex="1">
                                        <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={1} ml={1}>FECHA</Text>
                                        <Input
                                            type="date"
                                            value={fechaMasiva}
                                            onChange={(e) => handleCambiarFechaModal(e.target.value)}
                                            bg="white"
                                            border="1px solid"
                                            borderColor="gray.200"
                                            borderRadius="lg"
                                            size="sm"
                                            fontWeight="semibold"
                                            color="gray.700"
                                        />
                                    </Box>

                                    <Box flex="1">
                                        <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={1} ml={1}>JORNADA</Text>
                                        <HStack bg="gray.100" p={1} borderRadius="lg" spacing={1}>
                                            <Button
                                                flex={1}
                                                size="sm"
                                                fontSize="xs"
                                                borderRadius="md"
                                                variant="ghost"
                                                bg={turnoActivoModal === 'MANANA' ? 'gray.200' : 'transparent'}
                                                color={turnoActivoModal === 'MANANA' ? 'green.600' : 'gray.500'}
                                                fontWeight="bold"
                                                border="1px solid"
                                                borderColor={turnoActivoModal === 'MANANA' ? 'green.500' : 'transparent'}
                                                onClick={() => handleCambiarTurnoModal('MANANA')}
                                                _hover={{ bg: turnoActivoModal === 'MANANA' ? 'gray.200' : 'gray.50' }}
                                                _focus={{ boxShadow: 'none' }}
                                                h="32px"
                                            >
                                                Mañana
                                            </Button>
                                            <Button
                                                flex={1}
                                                size="sm"
                                                fontSize="xs"
                                                borderRadius="md"
                                                variant="ghost"
                                                bg={turnoActivoModal === 'TARDE' ? 'gray.200' : 'transparent'}
                                                color={turnoActivoModal === 'TARDE' ? 'green.600' : 'gray.500'}
                                                fontWeight="bold"
                                                border="1px solid"
                                                borderColor={turnoActivoModal === 'TARDE' ? 'green.500' : 'transparent'}
                                                onClick={() => handleCambiarTurnoModal('TARDE')}
                                                _hover={{ bg: turnoActivoModal === 'TARDE' ? 'gray.200' : 'gray.50' }}
                                                _focus={{ boxShadow: 'none' }}
                                                h="32px"
                                            >
                                                Noche
                                            </Button>
                                        </HStack>
                                    </Box>
                                </HStack>
                            </VStack>
                        </VStack>
                    </ModalHeader>

                    <ModalBody p={0}>
                        <Box overflowX="auto">
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #EDF2F7', textAlign: 'left', background: '#F7FAFC' }}>
                                        <th style={{ padding: '12px 16px', color: '#4A5568', fontSize: '14px' }}>Nº</th>
                                        <th style={{ padding: '12px 16px', color: '#4A5568', fontSize: '14px' }}>Vaca</th>
                                        <th style={{ padding: '12px 16px', color: '#4A5568', fontSize: '14px' }}>Litros</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vacas.filter(v => v.estado === 'ACTIVA').map((vaca, index) => (
                                        <tr key={vaca.vaca_id} style={{ borderBottom: '1px solid #EDF2F7' }}>
                                            <td style={{ padding: '16px', color: '#718096', fontSize: '14px' }}>{index + 1}</td>
                                            <td style={{ padding: '16px' }}>
                                                <Text fontWeight="medium" color="gray.700" fontSize="sm">
                                                    {vaca.nombre}
                                                </Text>
                                            </td>
                                            <td style={{ padding: '16px', width: '150px' }}>
                                                <Input
                                                    placeholder="0"
                                                    value={getLitrosValue(vaca.vaca_id, fechaMasiva, turnoActivoModal)}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(vaca.vaca_id, e.target.value)}
                                                    onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.select()}
                                                    bg="gray.50"
                                                    border="none"
                                                    textAlign="right"
                                                    fontWeight="bold"
                                                    _focus={{ bg: 'white', border: '1px solid', borderColor: 'brand.500', boxShadow: 'none' }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Box>
                    </ModalBody>

                    <ModalFooter px={6} py={4} borderTopWidth={1} borderColor="gray.100">
                        <Button
                            colorScheme="brand"
                            w="full"
                            onClick={handleGuardarMasivo}
                            isLoading={submitting}
                            isDisabled={!hasChangesInView}
                            borderRadius="xl"
                            size="lg"
                            shadow="lg"
                        >
                            Guardar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Modal de Edición Individual */}
            <Modal isOpen={isEditOpen} onClose={() => {
                const hasChangesInd = ordenoToEdit && ordenos.find(o => o.ordeno_id === ordenoToEdit.ordeno_id)?.litros !== Number(ordenoToEdit.litros);
                if (hasChangesInd) onConfirmCloseOpen();
                else onEditClose();
            }} isCentered size="sm">
                <ModalOverlay backdropFilter="blur(5px)" bg="blackAlpha.300" />
                <ModalContent borderRadius="2xl" boxShadow="2xl">
                    <ModalHeader pt={6} px={6}>
                        <Flex justify="space-between" align="center">
                            <Text fontSize="lg" fontWeight="bold">Editar Registro</Text>
                            <Button
                                variant="ghost"
                                color="red.500"
                                size="sm"
                                onClick={() => {
                                    const hasChangesInd = ordenoToEdit && ordenos.find(o => o.ordeno_id === ordenoToEdit.ordeno_id)?.litros !== Number(ordenoToEdit.litros);
                                    if (hasChangesInd) onConfirmCloseOpen();
                                    else onEditClose();
                                }}
                                fontWeight="bold"
                            >
                                Cerrar
                            </Button>
                        </Flex>
                    </ModalHeader>
                    <ModalBody px={6}>
                        <VStack spacing={4}>
                            <Box w="full">
                                <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={1}>VACA</Text>
                                <Text fontWeight="medium" color="gray.800">
                                    {vacas.find(v => v.vaca_id === ordenoToEdit?.vaca_id)?.nombre || 'Vaca'}
                                </Text>
                            </Box>
                            <Box w="full">
                                <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={1}>LITROS</Text>
                                <Input
                                    value={ordenoToEdit?.litros ?? ""}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (validateLitros(val)) {
                                            setOrdenoToEdit(prev => prev ? { ...prev, litros: val as any } : null);
                                        }
                                    }}
                                    onFocus={(e) => e.target.select()}
                                    bg="gray.50"
                                    border="none"
                                    fontWeight="bold"
                                    _focus={{ bg: 'white', border: '1px solid', borderColor: 'brand.500' }}
                                />
                            </Box>
                        </VStack>
                    </ModalBody>
                    <ModalFooter px={6} pb={6}>
                        <Button
                            colorScheme="brand"
                            w="full"
                            borderRadius="xl"
                            onClick={async () => {
                                if (!ordenoToEdit) return;
                                setSubmitting(true);
                                try {
                                    const updated = await ordenoService.updateOrdeno(ordenoToEdit.ordeno_id, {
                                        litros: Number(ordenoToEdit.litros)
                                    });
                                    updateOrdeno(updated);
                                    toast({ title: 'Actualizado', status: 'success' });
                                    onEditClose();
                                } catch (err: any) {
                                    toast({ title: 'Error', description: err.message, status: 'error' });
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                            isLoading={submitting}
                            isDisabled={!ordenoToEdit || (ordenos.find(o => o.ordeno_id === ordenoToEdit.ordeno_id)?.litros === Number(ordenoToEdit.litros))}
                        >
                            Guardar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Confirmación al Cerrar */}
            <AlertDialog
                isOpen={isConfirmCloseOpen}
                leastDestructiveRef={cancelRef}
                onClose={onConfirmCloseClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent borderRadius="2xl" mx={4}>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">Cambios sin guardar</AlertDialogHeader>
                        <AlertDialogBody>
                            Se perderán los cambios realizados. ¿Deseas continuar?
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onConfirmCloseClose} variant="ghost" borderRadius="xl">
                                No, seguir editando
                            </Button>
                            <Button colorScheme="red" onClick={() => {
                                onConfirmCloseClose();
                                onClose();
                                onEditClose();
                            }} ml={3} borderRadius="xl">
                                Sí, cerrar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

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
