import { Flex, Box, Heading, Text, Button } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { type Ganaderia } from '../../ganaderia/models';

interface OrdenoHeaderProps {
    ganaderia: Ganaderia | null;
    canCreate: boolean;
    onOpenRegistroMasivo: () => void;
}

export const OrdenoHeader = ({ ganaderia, canCreate, onOpenRegistroMasivo }: OrdenoHeaderProps) => {
    return (
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
                onClick={onOpenRegistroMasivo}
                isDisabled={!ganaderia || !canCreate}
                display={canCreate ? 'flex' : 'none'}
            >
                Registrar
            </Button>
        </Flex>
    );
};
