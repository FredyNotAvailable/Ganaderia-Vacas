import { Heading, Text, Grid, GridItem, VStack, HStack, Icon, Flex, Spinner, Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';
import { MotionBox } from '../../../shared/ui/MotionBox';
import { FiDatabase, FiDroplet, FiTrendingUp, FiActivity, FiChevronDown } from 'react-icons/fi';
import { useGanaderia } from '../../../shared/context/GanaderiaContext';
import { useMemo, useState } from 'react';

export const DashboardPage = () => {
    const { vacas, ordenos, loading, vacasLoading, ordenosLoading } = useGanaderia();
    const [periodDays, setPeriodDays] = useState<number>(7); // 7 = Semanal, 30 = Mensual

    const stats = useMemo(() => {
        const today = new Date();
        const filterByDays = (days: number) => {
            const startDate = new Date();
            startDate.setDate(today.getDate() - days);
            const startDateStr = startDate.toISOString().split('T')[0];

            const filtered = ordenos.filter(o => o.fecha >= startDateStr);
            const totalLitros = filtered.reduce((acc, curr) => acc + curr.litros, 0);
            const cowsInPeriod = new Set(filtered.map(o => o.vaca_id)).size;
            const promedio = cowsInPeriod > 0 ? (totalLitros / cowsInPeriod).toFixed(1) : '0';

            return {
                litros: totalLitros.toFixed(1),
                promedio: promedio
            };
        };

        const currentPeriodStats = filterByDays(periodDays);
        const todayStr = today.toISOString().split('T')[0];
        const todayOrdenos = ordenos.filter(o => o.fecha === todayStr);
        const totalLitrosHoy = todayOrdenos.reduce((acc, curr) => acc + curr.litros, 0);

        return {
            totalVacas: vacas.length,
            litrosHoy: totalLitrosHoy.toFixed(1),
            promedio: currentPeriodStats.promedio
        };
    }, [vacas, ordenos, periodDays]);

    const recentActivities = useMemo(() => {
        return [...ordenos]
            .sort((a, b) => new Date(b.created_at || b.fecha).getTime() - new Date(a.created_at || a.fecha).getTime())
            .slice(0, 5);
    }, [ordenos]);

    const isDataLoading = loading || (vacasLoading && vacas.length === 0) || (ordenosLoading && ordenos.length === 0);

    return (
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <VStack align="stretch" spacing={6} mt={2}>
                <VStack align="start" spacing={1}>
                    <Heading size="lg" color="gray.800" fontWeight="bold" letterSpacing="tight">Resumen</Heading>
                    <Text color="gray.400" fontSize="sm">Producción y estadísticas de tu finca</Text>
                </VStack>

                {isDataLoading ? (
                    <Flex justify="center" py={10}><Spinner size="xl" color="brand.500" /></Flex>
                ) : (
                    <>
                        <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} gap={4} w="full">
                            <GridItem colSpan={1}>
                                <SummaryCard icon={FiDatabase} label="Total vacas" value={stats.totalVacas} color="blue" />
                            </GridItem>
                            <GridItem colSpan={1}>
                                <SummaryCard icon={FiDroplet} label="Hoy" value={`${stats.litrosHoy} L`} color="brand" />
                            </GridItem>
                            <GridItem colSpan={{ base: 2, md: 1 }}>
                                <SummaryCard
                                    icon={FiTrendingUp}
                                    label="Promedio"
                                    value={`${stats.promedio} L`}
                                    color="purple"
                                    selector={
                                        <Menu autoSelect={false}>
                                            <MenuButton
                                                as={Button}
                                                rightIcon={<FiChevronDown />}
                                                size="xs"
                                                variant="ghost"
                                                colorScheme="purple"
                                                fontWeight="bold"
                                                px={2}
                                                h="auto"
                                                py={1}
                                                borderRadius="md"
                                                _hover={{ bg: 'purple.50' }}
                                            >
                                                {periodDays === 7 ? 'Semanal' : 'Mensual'}
                                            </MenuButton>
                                            <MenuList shadow="lg" borderRadius="xl" border="none" py={1} zIndex={10}>
                                                <MenuItem onClick={() => setPeriodDays(7)} fontSize="sm" fontWeight={periodDays === 7 ? 'bold' : 'medium'}>
                                                    Semanal (7d)
                                                </MenuItem>
                                                <MenuItem onClick={() => setPeriodDays(30)} fontSize="sm" fontWeight={periodDays === 30 ? 'bold' : 'medium'}>
                                                    Mensual (30d)
                                                </MenuItem>
                                            </MenuList>
                                        </Menu>
                                    }
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
                                                Ordeño: {activity.vaca?.nombre || 'Vaca'}
                                            </Text>
                                            <HStack spacing={2} color="gray.400" fontSize="xs">
                                                <Text>{new Date(activity.fecha).toLocaleDateString()}</Text>
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

const SummaryCard = ({ icon, label, value, color, selector }: any) => {
    return (
        <MotionBox
            bg="white"
            p={5}
            borderRadius="2xl"
            boxShadow="sm"
            whileHover={{ y: -3 }}
            border="1px solid"
            borderColor="gray.50"
        >
            <HStack spacing={3} mb={2} justify="space-between">
                <HStack spacing={3}>
                    <Flex bg={`${color === 'brand' ? 'brand' : color}.50`} color={`${color === 'brand' ? 'brand' : color}.500`} p={2} borderRadius="xl">
                        <Icon as={icon} boxSize={5} />
                    </Flex>
                    <Text color="gray.500" fontSize="sm" fontWeight="medium">{label}</Text>
                </HStack>
                {selector}
            </HStack>
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">{value}</Text>
        </MotionBox>
    );
};
