
import { useState } from 'react';
import {
    Heading, Button, VStack, Input, FormControl, Text,
    Link as ChakraLink, useToast, Alert, AlertIcon,
    Flex, Checkbox, Divider, HStack
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../../shared/supabase/supabaseClient';
import { MotionBox } from '../../../shared/ui/MotionBox';
import { FaGoogle } from 'react-icons/fa';

export const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const toast = useToast();

    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: import.meta.env.VITE_SITE_URL,
            },
        });

        if (error) {
            toast({
                title: 'Error con Google',
                description: error.message,
                status: 'error',
                duration: 1000,
                isClosable: true,
            });
            setIsGoogleLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            toast({
                title: 'Error al registrarse',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);
        } else {
            toast({
                title: 'Registro exitoso',
                description: 'Por favor verifica tu correo para confirmar.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            // Optionally navigate to login or show instruction
            navigate('/login');
        }
    };

    return (
        <Flex minH="100vh" w="100vw" align="center" justify="center" bg="gray.50" px={4}>
            <MotionBox
                w="full"
                maxW="md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                bg="white"
                borderRadius="3xl"
                boxShadow="xl"
                p={10}
                textAlign="center"
            >
                <VStack spacing={2} mb={8}>
                    <Heading size="lg" color="gray.800" fontWeight="bold">Crear Cuenta</Heading>
                    <Text color="gray.500" fontSize="sm">Ingresa tus datos para registrarte.</Text>
                </VStack>

                <Button
                    w="full"
                    variant="outline"
                    leftIcon={<FaGoogle />}
                    onClick={handleGoogleLogin}
                    isLoading={isGoogleLoading}
                    loadingText="Conectando..."
                    mb={6}
                    h={12}
                    borderRadius="xl"
                    borderColor="gray.200"
                    _hover={{ bg: 'gray.50' }}
                    color="gray.700"
                >
                    Registrarse con Google
                </Button>

                <HStack width="full" mb={6}>
                    <Divider borderColor="gray.200" />
                    <Text fontSize="xs" color="gray.400" whiteSpace="nowrap" textTransform="uppercase" fontWeight="bold">O</Text>
                    <Divider borderColor="gray.200" />
                </HStack>

                <form onSubmit={handleRegister} style={{ width: '100%' }}>
                    <VStack spacing={5}>
                        {error && (
                            <Alert status="error" borderRadius="xl" variant="subtle" fontSize="sm">
                                <AlertIcon />
                                {error}
                            </Alert>
                        )}

                        <FormControl isRequired>
                            <Input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Ingresa tu correo..."
                                _placeholder={{ color: 'gray.400' }}
                                bg="white"
                                borderColor="gray.200"
                                borderRadius="xl"
                                h={12}
                                _focus={{ borderColor: 'gray.800', boxShadow: 'none' }}
                                _hover={{ borderColor: 'gray.300' }}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <Input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Crea una contraseña..."
                                _placeholder={{ color: 'gray.400' }}
                                bg="white"
                                borderColor="gray.200"
                                borderRadius="xl"
                                h={12}
                                _focus={{ borderColor: 'gray.800', boxShadow: 'none' }}
                                _hover={{ borderColor: 'gray.300' }}
                            />
                        </FormControl>

                        <Flex w="full" justify="start">
                            <Checkbox colorScheme="gray" defaultChecked><Text fontSize="sm" color="gray.600">Acepto los Términos y Condiciones</Text></Checkbox>
                        </Flex>

                        <Button
                            type="submit"
                            w="full"
                            size="lg"
                            isLoading={loading}
                            bg="gray.900"
                            color="white"
                            _hover={{ bg: 'gray.800', transform: 'translateY(-1px)', shadow: 'md' }}
                            _active={{ bg: 'black' }}
                            borderRadius="xl"
                            h={12}
                            fontSize="md"
                        >
                            Registrarse
                        </Button>
                    </VStack>
                </form>

                <Text fontSize="sm" textAlign="center" color="gray.500" mt={8}>
                    ¿Ya tienes cuenta? <ChakraLink as={RouterLink} to="/login" color="gray.900" fontWeight="bold">Inicia Sesión</ChakraLink>
                </Text>
            </MotionBox>
        </Flex>
    );
};
