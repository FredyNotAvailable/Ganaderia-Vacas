import { Box, Flex, Icon, Text, Container, VStack, Link, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Button } from '@chakra-ui/react';
import { NavLink as RouterLink, Outlet } from 'react-router-dom';
import { FiHome, FiDatabase, FiDroplet, FiUser, FiAlertCircle, FiChevronDown, FiCheck, FiPlus } from 'react-icons/fi';
import { MotionBox } from '../ui/MotionBox';
import { useGanaderia } from '../context/GanaderiaContext';

export const MainLayout = () => {
    const { ganaderia, loading, ganaderias, selectGanaderia } = useGanaderia();

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
                pt={{ base: '4', md: '8' }}
            >
                <Container maxW={{ base: '100%', md: 'container.xl' }} px={{ base: 2, md: 6 }}>
                    {/* Global Farm Selector Header */}
                    <Flex
                        justify="space-between"
                        align="center"
                        mb={6}
                        mt={{ base: 2, md: 0 }}
                        bg={{ base: 'white', md: 'transparent' }}
                        p={{ base: 3, md: 0 }}
                        borderRadius={{ base: 'xl', md: 'none' }}
                        boxShadow={{ base: 'sm', md: 'none' }}
                    >
                        <Text
                            display={{ base: 'block', md: 'none' }}
                            fontWeight="bold"
                            color="brand.500"
                            fontSize="lg"
                            noOfLines={1}
                            flex="1"
                            mr={2}
                        >
                            {ganaderia?.nombre || 'Ganadería'}
                        </Text>
                        <Box display={{ base: 'none', md: 'block' }} /> {/* Spacer */}

                        <Menu>
                            <MenuButton
                                as={Button}
                                variant="outline"
                                size="sm"
                                borderRadius="lg"
                                bg="white"
                                _hover={{ bg: 'gray.50' }}
                                px={{ base: 2, md: 4 }}
                            >
                                <Flex align="center">
                                    <Text display={{ base: 'none', md: 'block' }} mr={2}>
                                        {ganaderia ? ganaderia.nombre : 'Seleccionar'}
                                    </Text>
                                    <Icon as={FiChevronDown} />
                                </Flex>
                            </MenuButton>
                            <MenuList zIndex={20} borderRadius="xl" shadow="xl">
                                {ganaderias.map(g => (
                                    <MenuItem
                                        key={g.ganaderia_id}
                                        onClick={() => selectGanaderia(g.ganaderia_id)}
                                        borderRadius="lg"
                                        mx={2}
                                        mb={1}
                                    >
                                        <Flex justify="space-between" align="center" w="full">
                                            <Text fontSize="sm">{g.nombre}</Text>
                                            {ganaderia?.ganaderia_id === g.ganaderia_id && <Icon as={FiCheck} color="brand.500" />}
                                        </Flex>
                                    </MenuItem>
                                ))}
                                <MenuDivider />
                                <MenuItem as={RouterLink} to="/perfil" icon={<FiPlus />} borderRadius="lg" mx={2}>
                                    Gestionar Ganaderías
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>

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
