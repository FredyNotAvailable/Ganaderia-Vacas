import {
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
    Button
} from '@chakra-ui/react';
import React from 'react';

interface CloseConfirmDialogProps {
    isOpen: boolean;
    cancelRef: React.RefObject<any>;
    onClose: () => void;
    onConfirm: () => void;
}

export const CloseConfirmDialog = ({
    isOpen,
    cancelRef,
    onClose,
    onConfirm
}: CloseConfirmDialogProps) => {
    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isCentered
        >
            <AlertDialogOverlay>
                <AlertDialogContent borderRadius="2xl" mx={4}>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">Cambios sin guardar</AlertDialogHeader>
                    <AlertDialogBody>
                        Se perderán los cambios realizados. ¿Deseas continuar?
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose} variant="ghost" borderRadius="xl">
                            No, seguir editando
                        </Button>
                        <Button colorScheme="red" onClick={onConfirm} ml={3} borderRadius="xl">
                            Sí, cerrar
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};
