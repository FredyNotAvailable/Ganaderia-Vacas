import { HStack, Button } from '@chakra-ui/react';

interface OrdenoFiltersProps {
    filtroJornada: 'TODOS' | 'MANANA' | 'TARDE';
    setFiltroJornada: (filtro: 'TODOS' | 'MANANA' | 'TARDE') => void;
}

export const OrdenoFilters = ({ filtroJornada, setFiltroJornada }: OrdenoFiltersProps) => {
    return (
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
    );
};
