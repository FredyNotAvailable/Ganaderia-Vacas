import { Box, Flex, Icon, Text, Container, VStack, Link, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Button, HStack } from '@chakra-ui/react';
import { NavLink as RouterLink, Outlet, useLocation } from 'react-router-dom';
import { FiHome, FiDatabase, FiDroplet, FiUser, FiAlertCircle, FiChevronDown, FiPlus } from 'react-icons/fi';
import { MotionBox } from '../ui/MotionBox';
import { useGanaderia } from '../context/GanaderiaContext';
import { useFincaActiva } from '../hooks/useFincaActiva';

export const MainLayout = () => {
    const { ganaderia, loading } = useGanaderia();
    const { misFincas, fincasVinculadas, cambiarFinca } = useFincaActiva();
    const location = useLocation();

    // Hide selector in profile page
    const showSelector = !location.pathname.startsWith('/perfil');

    return (
        <Flex minH="100vh" bg="gray.50" overflowX="hidden">
            {/* Desktop Sidebar (Left) */}
            <Box
                display={{ base: 'none', md: 'block' }}
                w="64"
                bg="white"
                borderRight="1px solid"
                borderColor="gray.100"
                position="fixed"
                h="full"
                py={8}
                px={6}
            >
                <Text fontSize="2xl" fontWeight="bold" color="brand.500" mb={10} letterSpacing="tight">
                    Ganadería
                </Text>
                <VStack spacing={2} align="stretch">
                    <SidebarItem to="/" icon={FiHome} label="Inicio" />
                    <SidebarItem to="/vacas" icon={FiDatabase} label="Vacas" />
                    <SidebarItem to="/ordeno" icon={FiDroplet} label="Ordeños" />
                    <SidebarItem to="/perfil" icon={FiUser} label="Perfil" />
                </VStack>
            </Box>

            {/* Main Content Area */}
            <Box
                flex="1"
                minW="0" // Critical for Flexbox not to overflow
                ml={{ base: 0, md: '64' }} // Offset for sidebar on desktop
                pb={{ base: '32', md: '8' }} // Increased padding for bottom nav clearance
                pt={{ base: showSelector ? 0 : 4, md: '8' }}
            >
                <Container maxW={{ base: '100%', md: 'container.xl' }} px={{ base: 2, md: 6 }}>
                    {/* Global Farm Selector Header */}
                    {showSelector && (
                        <Flex
                            justify="space-between"
                            align="center"
                            mb={6}
                            mt={0}
                            bg={{ base: 'white', md: 'transparent' }}
                            p={{ base: 3, md: 0 }}
                            borderRadius={{ base: 'none', md: 'none' }}
                            boxShadow={{ base: 'sm', md: 'none' }}
                            position={{ base: 'sticky', md: 'static' }}
                            top={{ base: 0, md: 'auto' }}
                            zIndex={{ base: 99, md: 'auto' }}
                            mx={{ base: -2, md: 0 }} // Negative margin to offset Container padding on mobile
                            px={{ base: 4, md: 0 }}
                        >

                            <Box display={{ base: 'none', md: 'block' }} /> {/* Spacer */}

                            <HStack spacing={2} w="full">
                                <Menu matchWidth>
                                    <MenuButton
                                        as={Button}
                                        variant="ghost"
                                        size="md"
                                        borderRadius="2xl"
                                        bg="white"
                                        shadow="sm"
                                        border="1px solid"
                                        borderColor="gray.100"
                                        _hover={{ shadow: 'md', bg: 'white' }}
                                        _active={{ bg: 'white' }}
                                        px={{ base: 4, md: 5 }}
                                        h="45px"
                                        w="full"
                                        textAlign="left"
                                    >
                                        <HStack spacing={3} justify="space-between" w="full">
                                            <Text
                                                fontWeight="bold"
                                                color="brand.600"
                                                fontSize="md"
                                                noOfLines={1}
                                                // maxW removed to allow full usage, or kept for text truncation
                                                maxW={{ base: "calc(100% - 30px)", md: "200px" }}
                                                textAlign="left"
                                            >
                                                {ganaderia ? ganaderia.nombre : 'Seleccionar'}
                                            </Text>
                                            <Flex
                                                bg="gray.50"
                                                p={1}
                                                borderRadius="md"
                                                border="1px solid"
                                                borderColor="gray.200"
                                                align="center"
                                                justify="center"
                                                minW="24px"
                                            >
                                                <Icon as={FiChevronDown} color="gray.600" boxSize={3} />
                                            </Flex>
                                        </HStack>
                                    </MenuButton>
                                    <MenuList zIndex={20} borderRadius="2xl" shadow="2xl" border="none" p={2} minW={{ base: "full", md: "220px" }}>
                                        {/* Principales */}
                                        {misFincas.length > 0 && (
                                            <>
                                                <Box px={3} py={1}>
                                                    <Text fontSize="10px" fontWeight="bold" color="gray.400" textTransform="uppercase">Mis Ganaderías</Text>
                                                </Box>
                                                {misFincas.map((g: any) => {
                                                    const isActive = ganaderia?.ganaderia_id === g.ganaderia_id;
                                                    return (
                                                        <MenuItem
                                                            key={g.ganaderia_id}
                                                            onClick={() => cambiarFinca(g.ganaderia_id)}
                                                            borderRadius="xl"
                                                            mx={1}
                                                            mb={1}
                                                            bg={isActive ? "brand.50" : "transparent"}
                                                            color={isActive ? "brand.600" : "gray.700"}
                                                            fontWeight={isActive ? "bold" : "medium"}
                                                            _hover={{ bg: isActive ? "brand.100" : "gray.50" }}
                                                        >
                                                            <Text fontSize="sm">{g.nombre}</Text>
                                                        </MenuItem>
                                                    );
                                                })}
                                            </>
                                        )}

                                        {/* Vinculadas */}
                                        {fincasVinculadas.length > 0 && (
                                            <>
                                                {misFincas.length > 0 && <MenuDivider />}
                                                <Box px={3} py={1}>
                                                    <Text fontSize="10px" fontWeight="bold" color="blue.400" textTransform="uppercase">Ganaderías Compartidas</Text>
                                                </Box>
                                                {fincasVinculadas.map((g: any) => {
                                                    const isActive = ganaderia?.ganaderia_id === g.ganaderia_id;
                                                    return (
                                                        <MenuItem
                                                            key={g.ganaderia_id}
                                                            onClick={() => cambiarFinca(g.ganaderia_id)}
                                                            borderRadius="xl"
                                                            mx={1}
                                                            mb={1}
                                                            bg={isActive ? "blue.50" : "transparent"}
                                                            color={isActive ? "blue.600" : "gray.700"}
                                                            fontWeight={isActive ? "bold" : "medium"}
                                                            _hover={{ bg: isActive ? "blue.100" : "gray.50" }}
                                                        >
                                                            <VStack align="start" spacing={0}>
                                                                <Text fontSize="sm">{g.nombre}</Text>
                                                                <Text fontSize="9px" color={isActive ? "blue.400" : "blue.500"} fontWeight="bold">
                                                                    {g.rol_detalle ? `Rol: ${g.rol_detalle.nombre}` : `Acceso: ${g.permiso}`}
                                                                </Text>
                                                            </VStack>
                                                        </MenuItem>
                                                    );
                                                })}
                                            </>
                                        )}

                                        <MenuDivider />
                                        <MenuItem as={RouterLink} to="/perfil" icon={<FiPlus />} borderRadius="lg" mx={2}>
                                            Gestionar Ganaderías
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </HStack>
                        </Flex>
                    )}

                    {/* No Farm Warning Banner */}
                    {!loading && !ganaderia && (
                        <MotionBox
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            bg="orange.50"
                            border="1px solid"
                            borderColor="orange.200"
                            p={4}
                            borderRadius="xl"
                            mb={6}
                            display="flex"
                            alignItems="center"
                            gap={3}
                        >
                            <Icon as={FiAlertCircle} color="orange.500" boxSize={5} />
                            <Box flex="1">
                                <Text fontWeight="semibold" color="orange.800" fontSize="sm">
                                    No tienes una ganadería configurada.
                                </Text>
                                <Text fontSize="xs" color="orange.700">
                                    Ve a tu <Link as={RouterLink} to="/perfil" color="orange.900" fontWeight="bold" textDecoration="underline">perfil</Link> para configurarla y comenzar.
                                </Text>
                            </Box>
                        </MotionBox>
                    )}

                    <Outlet />
                </Container>
            </Box>

            {/* Mobile Bottom Navigation (Floating) */}
            {/* Mobile Bottom Navigation (Floating) */}
            <Box
                display={{ base: 'block', md: 'none' }}
                position="fixed"
                bottom={0}
                left={0}
                right={0}
                zIndex={100}
                bg="white"
                borderTop="1px solid"
                borderColor="gray.100"
                pb="safe-area-inset-bottom" // Support for modern mobile browsers
            >
                <Container maxW="full" p={0}>
                    <MotionBox
                        bg="white"
                        px={1}
                        py={1}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                    >
                        <Flex justify="space-evenly" align="center">
                            <BottomNavItem to="/" icon={FiHome} label="Inicio" />
                            <BottomNavItem to="/vacas" icon={FiDatabase} label="Vacas" />
                            <BottomNavItem to="/ordeno" icon={FiDroplet} label="Ordeños" />
                            <BottomNavItem to="/perfil" icon={FiUser} label="Perfil" />
                        </Flex>
                    </MotionBox>
                </Container>
            </Box>
        </Flex>
    );
};

const SidebarItem = ({ to, icon, label }: any) => {
    return (
        <RouterLink to={to} style={{ textDecoration: 'none' }}>
            {({ isActive }: { isActive: boolean }) => (
                <Flex
                    align="center"
                    p={3}
                    borderRadius="xl"
                    cursor="pointer"
                    bg={isActive ? 'brand.50' : 'transparent'}
                    color={isActive ? 'brand.600' : 'gray.500'}
                    _hover={{ bg: isActive ? 'brand.50' : 'gray.50', color: isActive ? 'brand.600' : 'gray.900' }}
                    transition="all 0.2s"
                >
                    <Icon as={icon} boxSize={5} mr={3} />
                    <Text fontWeight={isActive ? 'semibold' : 'medium'} fontSize="sm">
                        {label}
                    </Text>
                </Flex>
            )}
        </RouterLink>
    );
};

// ... BottomNavItem remains same ...
const BottomNavItem = ({ to, icon, label }: any) => {
    return (
        <RouterLink to={to} style={{ textDecoration: 'none', flex: 1 }}>
            {({ isActive }: { isActive: boolean }) => (
                <MotionBox
                    whileTap={{ scale: 0.9 }}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    py={3}
                    borderRadius="xl"
                    color={isActive ? 'brand.500' : 'gray.400'}
                    position="relative"
                >
                    <Icon as={icon} boxSize={6} mb={1} strokeWidth={isActive ? 2.5 : 2} />
                    <Text fontSize="10px" fontWeight={isActive ? 'bold' : 'medium'}>
                        {label}
                    </Text>
                    {isActive && (
                        <MotionBox
                            layoutId="nav-indicator"
                            position="absolute"
                            bottom="-6px"
                            width="4px"
                            height="4px"
                            borderRadius="full"
                            bg="brand.500"
                        />
                    )}
                </MotionBox>
            )}
        </RouterLink>
    );
};
