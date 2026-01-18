import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Flex, Spinner } from '@chakra-ui/react';

export const PublicRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Flex h="100vh" align="center" justify="center" bg="gray.50">
                <Spinner size="xl" color="brand.500" thickness="4px" />
            </Flex>
        );
    }

    if (user) {
        // Redirect to dashboard if already authenticated
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};
