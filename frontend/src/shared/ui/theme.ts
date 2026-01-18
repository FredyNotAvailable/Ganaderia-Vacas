import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    colors: {
        brand: {
            50: '#EBF5F2',
            100: '#DDEFE9',
            200: '#BFE0D9',
            300: '#9FD1C9',
            400: '#64B3A3',
            500: '#357A62', // Primary Brand Color
            600: '#2A614E',
            700: '#1F493B',
            800: '#143027',
            900: '#0A1814',
        },
        gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
        },
    },
    fonts: {
        heading: `'Inter', sans-serif`,
        body: `'Inter', sans-serif`,
    },
    styles: {
        global: {
            body: {
                bg: 'gray.50',
                color: 'gray.800',
            },
        },
    },
    components: {
        Button: {
            baseStyle: {
                borderRadius: 'xl',
                fontWeight: 'semibold',
            },
            variants: {
                solid: {
                    bg: 'brand.500',
                    color: 'white',
                    _hover: {
                        bg: 'brand.600',
                        _disabled: {
                            bg: 'brand.500',
                        }
                    },
                },
                ghost: {
                    color: 'gray.600',
                    _hover: {
                        bg: 'gray.100',
                        color: 'gray.900',
                    },
                },
                outline: {
                    borderColor: 'gray.200',
                    color: 'gray.600',
                    _hover: {
                        bg: 'gray.50',
                    },
                },
            },
        },
        Card: {
            baseStyle: {
                container: {
                    borderRadius: '2xl',
                    boxShadow: 'sm',
                    bg: 'white',
                },
            },
        },
        Input: {
            variants: {
                filled: {
                    field: {
                        bg: 'gray.50',
                        borderRadius: 'xl',
                        _hover: {
                            bg: 'gray.100',
                        },
                        _focus: {
                            bg: 'white',
                            borderColor: 'brand.500',
                        },
                    },
                },
            },
            defaultProps: {
                variant: 'filled',
            },
        },
        Select: {
            variants: {
                filled: {
                    field: {
                        bg: 'gray.50',
                        borderRadius: 'xl',
                        _hover: {
                            bg: 'gray.100',
                        },
                        _focus: {
                            bg: 'white',
                            borderColor: 'brand.500',
                        },
                    },
                },
            },
            defaultProps: {
                variant: 'filled',
            },
        },
    },
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
    },
});

export default theme;
