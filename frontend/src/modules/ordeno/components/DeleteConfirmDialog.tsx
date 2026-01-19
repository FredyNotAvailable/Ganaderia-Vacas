import {
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
    Button, Text
} from '@chakra-ui/react';
import React from 'react';

interface DeleteConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    cancelRef: React.RefObject<any>;
    onConfirm: () => Promise<void>;
    isLoading: boolean;
}

export const DeleteConfirmDialog = ({
    isOpen,
    onClose,
    cancelRef,
    onConfirm,
    isLoading
}: DeleteConfirmDialogProps) => {
    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isCentered
        >
            <AlertDialogOverlay>
                <AlertDialogContent borderRadius="2xl" mx={4}>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Eliminar Registro
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        <Text color="gray.600">
                            ¿Estás seguro de que deseas eliminar este registro de producción?
                        </Text>
                        <Text mt={2} color="red.500" fontWeight="semibold" fontSize="sm">
                            Esta acción es permanente y no se puede deshacer.
                        </Text>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose} variant="ghost" borderRadius="xl">
                            Cancelar
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={onConfirm}
                            ml={3}
                            borderRadius="xl"
                            isLoading={isLoading}
                        >
                            Eliminar
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};
