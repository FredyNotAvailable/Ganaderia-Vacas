import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    VStack, Flex, Text, Button, Box, HStack, Input
} from '@chakra-ui/react';
import { type Vaca } from '../../vaca/models';

interface RegistroMasivoModalProps {
    isOpen: boolean;
    onClose: () => void;
    fechaMasiva: string;
    setFechaMasiva: (fecha: string) => void;
    turnoActivoModal: 'MANANA' | 'TARDE';
    setTurnoActivoModal: (turno: 'MANANA' | 'TARDE') => void;
    vacas: Vaca[];
    getLitrosValue: (vacaId: string, fecha: string, turno: string) => string;
    handleInputChange: (vacaId: string, value: string) => void;
    handleGuardarMasivo: () => void;
    submitting: boolean;
    hasChangesInView: boolean;
}

export const RegistroMasivoModal = ({
    isOpen,
    onClose,
    fechaMasiva,
    setFechaMasiva,
    turnoActivoModal,
    setTurnoActivoModal,
    vacas,
    getLitrosValue,
    handleInputChange,
    handleGuardarMasivo,
    submitting,
    hasChangesInView
}: RegistroMasivoModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
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
                                onClick={onClose}
                                fontWeight="bold"
                            >
                                Cerrar
                            </Button>
                        </Flex>

                        <VStack spacing={3} align="stretch" bg="gray.50" p={2} borderRadius="xl">
                            <HStack>
                                <Box flex="1">
                                    <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={1} ml={1}>FECHA</Text>
                                    <Input
                                        type="date"
                                        value={fechaMasiva}
                                        onChange={(e) => setFechaMasiva(e.target.value)}
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
                                            onClick={() => setTurnoActivoModal('MANANA')}
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
                                            onClick={() => setTurnoActivoModal('TARDE')}
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
                                {vacas.filter(v => v.estado === 'ACTIVA' && v.tipo === 'VACA').map((vaca, index) => (
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
    );
};
