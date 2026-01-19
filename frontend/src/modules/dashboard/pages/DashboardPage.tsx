import { Heading, Text, Grid, GridItem, VStack, HStack, Icon, Flex, Spinner, Box, Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';
import { MotionBox } from '../../../shared/ui/MotionBox';
import { FiDatabase, FiDroplet, FiActivity, FiChevronDown } from 'react-icons/fi';
import { useGanaderia } from '../../../shared/context/GanaderiaContext';
import { useMemo, useState } from 'react';

type Periodo = 'HOY' | 'SEMANA' | 'MES' | 'ANO';

export const DashboardPage = () => {
    const { vacas, ordenos, loading, vacasLoading, ordenosLoading } = useGanaderia();
    const [selectedPeriod, setSelectedPeriod] = useState<Periodo>('HOY');

    const stats = useMemo(() => {
        const getEcuadorDateString = (dateInput: Date | string) => {
            if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) return dateInput;
            try {
                return new Intl.DateTimeFormat('fr-CA', { timeZone: 'America/Guayaquil' }).format(new Date(dateInput));
            } catch (e) { return ""; }
        };

        const today = new Date();
        const todayStr = getEcuadorDateString(today);



        // Start Dates
        const getMonday = (d: Date) => {
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            return new Date(d.setDate(diff));
        };
        const startOfWeek = getEcuadorDateString(getMonday(new Date()));
        const startOfMonth = getEcuadorDateString(new Date(today.getFullYear(), today.getMonth(), 1));
        const startOfYear = getEcuadorDateString(new Date(today.getFullYear(), 0, 1));

        // 1. Vacas
        const vacasActivas = vacas.filter(v => v.estado === 'ACTIVA').length;

        // 2. Agrupación Litros
        const litros = {
            HOY: 0,
            SEMANA: 0,
            MES: 0,
            ANO: 0
        };

        const comparisons = {
            HOY: 0, // Ayer
            SEMANA: 0, // Semana pasada
            MES: 0, // Mes pasado
            ANO: 0 // Año pasado
        };

        // Calculo actual
        ordenos.forEach(o => {
            const dStr = getEcuadorDateString(o.fecha_ordeno);
            if (dStr === todayStr) litros.HOY += o.litros;
            if (dStr >= startOfWeek && dStr <= todayStr) litros.SEMANA += o.litros;
            if (dStr >= startOfMonth && dStr <= todayStr) litros.MES += o.litros;
            if (dStr >= startOfYear && dStr <= todayStr) litros.ANO += o.litros;
        });

        // Calculo comparativo (Simplificado: Ayer para hoy, no implementamos complejos por ahora para no sobrecargar)
        // Ayer
        const yesterday = new Date();
        yesterday.setTime(today.getTime() - (24 * 60 * 60 * 1000));
        const yesterdayStr = getEcuadorDateString(yesterday);
        comparisons.HOY = ordenos.filter(o => getEcuadorDateString(o.fecha_ordeno) === yesterdayStr).reduce((acc, c) => acc + c.litros, 0);

        return {
            todayStr,
            totalVacas: vacasActivas,
            litros,
            comparisons
        };
    }, [vacas, ordenos]);

    const recentActivities = useMemo(() => {
        return [...ordenos]
            .sort((a, b) => new Date(b.fecha_ordeno).getTime() - new Date(a.fecha_ordeno).getTime())
            .slice(0, 5);
    }, [ordenos]);

    const isDataLoading = loading || (vacasLoading && vacas.length === 0) || (ordenosLoading && ordenos.length === 0);



    const getComparisonText = () => {
        if (selectedPeriod === 'HOY') {
            const diff = stats.litros.HOY - stats.comparisons.HOY;
            const sign = diff >= 0 ? '+' : '';
            return `${sign}${diff.toFixed(1)} L que ayer`;
        }
        return null; // Solo mostrar comparación para hoy por simplicidad o falta de datos históricos complejos
    };

    return (
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <VStack align="stretch" spacing={6} mt={2}>
                <VStack align="start" spacing={1}>
                    <Heading size="lg" color="gray.800" fontWeight="bold" letterSpacing="tight">Inicio</Heading>
                    <Text color="gray.400" fontSize="sm">Estado actual de la ganadería</Text>
                </VStack>

                {isDataLoading ? (
                    <Flex justify="center" py={10}><Spinner size="xl" color="brand.500" /></Flex>
                ) : (
                    <>
                        <Grid templateColumns="repeat(2, minmax(0, 1fr))" gap={4} w="full">
                            <GridItem colSpan={1}>
                                <SummaryCard icon={FiDatabase} label="Vacas activas" value={stats.totalVacas} color="blue" />
                            </GridItem>
                            <GridItem colSpan={1}>
                                <SummaryCard
                                    icon={FiDroplet}
                                    label={
                                        <Menu>
                                            <MenuButton as={Button} size="xs" variant="ghost" rightIcon={<FiChevronDown />} borderRadius="lg" colorScheme="gray" fontWeight="bold" px={2} _hover={{ bg: 'gray.100' }} _active={{ bg: 'gray.200' }} minW="110px" textAlign="right">
                                                <Text as="span" isTruncated display="block" textAlign="right" w="full">
                                                    {selectedPeriod === 'ANO' ? 'Este Año' :
                                                        selectedPeriod === 'MES' ? 'Este Mes' :
                                                            selectedPeriod === 'SEMANA' ? 'Esta Semana' : 'Hoy'}
                                                </Text>
                                            </MenuButton>
                                            <MenuList zIndex={10} minW="100px" fontSize="sm">
                                                <MenuItem fontWeight={selectedPeriod === 'HOY' ? 'bold' : 'normal'} color={selectedPeriod === 'HOY' ? 'brand.500' : 'inherit'} onClick={() => setSelectedPeriod('HOY')}>Hoy</MenuItem>
                                                <MenuItem fontWeight={selectedPeriod === 'SEMANA' ? 'bold' : 'normal'} color={selectedPeriod === 'SEMANA' ? 'brand.500' : 'inherit'} onClick={() => setSelectedPeriod('SEMANA')}>Semana</MenuItem>
                                                <MenuItem fontWeight={selectedPeriod === 'MES' ? 'bold' : 'normal'} color={selectedPeriod === 'MES' ? 'brand.500' : 'inherit'} onClick={() => setSelectedPeriod('MES')}>Mes</MenuItem>
                                                <MenuItem fontWeight={selectedPeriod === 'ANO' ? 'bold' : 'normal'} color={selectedPeriod === 'ANO' ? 'brand.500' : 'inherit'} onClick={() => setSelectedPeriod('ANO')}>Año</MenuItem>
                                            </MenuList>
                                        </Menu>
                                    }
                                    value={`${stats.litros[selectedPeriod].toFixed(1)} L`}
                                    color="brand"
                                    subValue={getComparisonText()}
                                    subValueColor={(stats.litros.HOY - stats.comparisons.HOY) >= 0 ? 'green.500' : 'red.500'}
                                />
                            </GridItem>
                        </Grid>


                        <Heading size="md" color="gray.800" fontWeight="bold" pt={4}>Actividad Reciente</Heading>

                        <VStack w="full" spacing={3} align="stretch" pb={24}>
                            {recentActivities.length === 0 ? (
                                <Flex direction="column" align="center" justify="center" bg="white" p={10} rounded="2xl" shadow="sm">
                                    <Icon as={FiActivity} boxSize={8} color="gray.100" mb={3} />
                                    <Text color="gray.400" fontSize="sm">Sin actividad reciente</Text>
                                </Flex>
                            ) : (
                                recentActivities.map((activity) => (
                                    <Flex
                                        key={activity.ordeno_id}
                                        p={4}
                                        bg="white"
                                        rounded="2xl"
                                        shadow="sm"
                                        align="center"
                                        gap={4}
                                        border="1px solid"
                                        borderColor="gray.50"
                                    >
                                        <Flex bg="brand.50" p={2.5} rounded="xl" color="brand.500">
                                            <Icon as={FiDroplet} boxSize={4} />
                                        </Flex>
                                        <VStack align="start" spacing={0} flex="1">
                                            <Text fontWeight="semibold" fontSize="sm" color="gray.800">
                                                Ordeño: {vacas.find(v => v.vaca_id === activity.vaca_id)?.nombre || activity.vaca?.nombre || 'Vaca'}
                                            </Text>
                                            <HStack spacing={2} color="gray.400" fontSize="xs">
                                                <Text>
                                                    {new Intl.DateTimeFormat('es-EC', {
                                                        timeZone: 'America/Guayaquil',
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    }).format(new Date(activity.fecha_ordeno))}
                                                </Text>
                                                <Text>•</Text>
                                                <Text textTransform="capitalize">{activity.turno?.toLowerCase() || ''}</Text>
                                            </HStack>
                                        </VStack>
                                        <Text fontWeight="bold" color="gray.800" fontSize="md">{activity.litros}L</Text>
                                    </Flex>
                                ))
                            )}
                        </VStack>
                    </>
                )}
            </VStack>
        </MotionBox>
    );
};

const SummaryCard = ({ icon, label, value, color, selector, subValue, subValueColor }: any) => {
    return (
        <MotionBox
            bg="white"
            p={5}
            borderRadius="2xl"
            boxShadow="sm"
            whileHover={{ y: -3 }}
            border="1px solid"
            borderColor="gray.50"
            h="full"
        >
            <HStack spacing={3} mb={2} justify="space-between" h="32px">
                <HStack spacing={3} flex="1" minW="0">
                    <Flex bg={`${color === 'brand' ? 'brand' : color}.50`} color={`${color === 'brand' ? 'brand' : color}.500`} p={2} borderRadius="xl" flexShrink={0}>
                        <Icon as={icon} boxSize={5} />
                    </Flex>
                    <Box flex="1" minW="0">
                        {typeof label === 'string' ? (
                            <Text color="gray.500" fontSize="sm" fontWeight="medium" noOfLines={1}>{label}</Text>
                        ) : (
                            label
                        )}
                    </Box>
                </HStack>
                {selector}
            </HStack>
            <VStack align="start" spacing={0} h="50px" justify="center">
                <Text fontSize="2xl" fontWeight="bold" color="gray.800" lineHeight="1.2">{value}</Text>
                <Box h="20px" w="full">
                    {subValue ? (
                        <Text fontSize="xs" fontWeight="bold" color={subValueColor || 'gray.400'} noOfLines={1}>
                            {subValue}
                        </Text>
                    ) : null}
                </Box>
            </VStack>
        </MotionBox>
    );
};
