import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
    VStack, Flex, Text, Button, Box, Input
} from '@chakra-ui/react';
import { type Ordeno } from '../models';
import { type Vaca } from '../../vaca/models';

interface EditOrdenoModalProps {
    isOpen: boolean;
    onClose: () => void;
    ordenoToEdit: Ordeno | null;
    setOrdenoToEdit: (ordeno: Ordeno | null) => void;
    vacas: Vaca[];
    onSave: () => Promise<void>;
    submitting: boolean;
    hasChanges: boolean;
    validateLitros: (value: string) => boolean;
}

export const EditOrdenoModal = ({
    isOpen,
    onClose,
    ordenoToEdit,
    setOrdenoToEdit,
    vacas,
    onSave,
    submitting,
    hasChanges,
    validateLitros
}: EditOrdenoModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
            <ModalOverlay backdropFilter="blur(5px)" bg="blackAlpha.300" />
            <ModalContent borderRadius="2xl" boxShadow="2xl">
                <ModalHeader pt={6} px={6}>
                    <Flex justify="space-between" align="center">
                        <Text fontSize="lg" fontWeight="bold">Editar Registro</Text>
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
                                        setOrdenoToEdit(ordenoToEdit ? { ...ordenoToEdit, litros: val as any } : null);
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
                        onClick={onSave}
                        isLoading={submitting}
                        isDisabled={!ordenoToEdit || !hasChanges}
                    >
                        Guardar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
