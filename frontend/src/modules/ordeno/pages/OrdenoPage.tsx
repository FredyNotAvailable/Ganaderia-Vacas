import { useState, useRef, useMemo } from 'react';
import { Spinner, Flex, useDisclosure, useToast } from '@chakra-ui/react';
import { ordenoService } from '../services/ordeno.service';
import { type CreateOrdenoDTO, type Ordeno } from '../models';
import { useGanaderia } from '../../../shared/context/GanaderiaContext';
import { MotionBox } from '../../../shared/ui/MotionBox';
import { usePermisosFinca } from '../../../shared/hooks/usePermisosFinca';

// New Components
import { OrdenoHeader } from '../components/OrdenoHeader';
import { OrdenoFilters } from '../components/OrdenoFilters';
import { OrdenoList } from '../components/OrdenoList';
import { RegistroMasivoModal } from '../components/RegistroMasivoModal';
import { EditOrdenoModal } from '../components/EditOrdenoModal';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';
import { CloseConfirmDialog } from '../components/CloseConfirmDialog';

export const OrdenoPage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const { isOpen: isConfirmCloseOpen, onOpen: onConfirmCloseOpen, onClose: onConfirmCloseClose } = useDisclosure();

    const cancelRef = useRef<HTMLButtonElement>(null);
    const {
        ganaderia,
        loading: loadingGanaderia,
        ordenos,
        ordenosLoading,
        vacas,
        addOrdeno,
        updateOrdeno,
        removeOrdeno
    } = useGanaderia();

    const { can } = usePermisosFinca();

    // State for CRUD
    const [ordenoToEdit, setOrdenoToEdit] = useState<Ordeno | null>(null);
    const [ordenoToDelete, setOrdenoToDelete] = useState<Ordeno | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const toast = useToast();

    // Helpers
    const getLocalDatetime = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        return new Date(now.getTime() - offset).toISOString().slice(0, 16);
    };

    const getTurnoFromTime = (dateTimeStr: string): 'MANANA' | 'TARDE' => {
        if (!dateTimeStr) return 'MANANA';
        const date = new Date(dateTimeStr);
        if (isNaN(date.getTime())) return 'MANANA';
        const hour = date.getHours();
        return hour < 12 ? 'MANANA' : 'TARDE';
    };

    // --- LÓGICA DE FILTRADO Y REGISTRO ---
    const [filtroJornada, setFiltroJornada] = useState<'TODOS' | 'MANANA' | 'TARDE'>('TODOS');

    const groupedOrdenos = useMemo(() => {
        const filteredByJornada = ordenos.filter(o => filtroJornada === 'TODOS' || o.turno === filtroJornada);

        const grouped = filteredByJornada.reduce((acc, ordeno) => {
            const d = new Date(ordeno.fecha_ordeno);
            const isoDate = new Intl.DateTimeFormat('fr-CA', { timeZone: 'America/Guayaquil' }).format(d);
            if (!acc[isoDate]) acc[isoDate] = [];
            acc[isoDate].push(ordeno);
            return acc;
        }, {} as Record<string, Ordeno[]>);

        const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

        return { grouped, dates, isEmpty: filteredByJornada.length === 0 };
    }, [ordenos, filtroJornada]);

    const [turnoActivoModal, setTurnoActivoModal] = useState<'MANANA' | 'TARDE'>('MANANA');
    const [fechaMasiva, setFechaMasiva] = useState<string>('');

    const [registroMasivoBuffer, setRegistroMasivoBuffer] = useState<Record<string, Record<string, string>>>({});

    const validateLitros = (value: string) => {
        if (value === "") return true;
        const regex = /^\d{0,2}(\.\d{0,2})?$/;
        return regex.test(value);
    };

    const getLitrosValue = (vacaId: string, fecha: string, turno: string) => {
        const key = `${fecha}_${turno}`;
        if (registroMasivoBuffer[key] && registroMasivoBuffer[key][vacaId] !== undefined) {
            return registroMasivoBuffer[key][vacaId];
        }
        const existing = ordenos.find(o => {
            const d = new Date(o.fecha_ordeno);
            const iso = new Intl.DateTimeFormat('fr-CA', { timeZone: 'America/Guayaquil' }).format(d);
            return o.vaca_id === vacaId && iso === fecha && o.turno === turno;
        });

        return existing ? existing.litros.toString() : "";
    };

    const handleOpenRegistroMasivo = () => {
        if (!ganaderia) {
            toast({ title: 'Configura tu ganadería primero', status: 'warning' });
            return;
        }
        const todayIso = new Intl.DateTimeFormat('fr-CA', { timeZone: 'America/Guayaquil' }).format(new Date());
        setFechaMasiva(todayIso);
        setRegistroMasivoBuffer({});
        const currentTurno = getTurnoFromTime(getLocalDatetime());
        setTurnoActivoModal(currentTurno);
        onOpen();
    };

    const handleInputChange = (vacaId: string, value: string) => {
        let cleanValue = value;
        if (cleanValue === "") {
        } else if (cleanValue.length > 1 && cleanValue.startsWith('0') && cleanValue[1] !== '.') {
            cleanValue = cleanValue.substring(1);
        }

        if (validateLitros(cleanValue)) {
            const key = `${fechaMasiva}_${turnoActivoModal}`;
            setRegistroMasivoBuffer(prev => ({
                ...prev,
                [key]: {
                    ...(prev[key] || {}),
                    [vacaId]: cleanValue
                }
            }));
        }
    };

    const handleGuardarMasivo = async () => {
        setSubmitting(true);
        try {
            // Buscamos todas las jornadas que tengan cambios en el buffer
            const keysToProcess = Object.keys(registroMasivoBuffer);

            if (keysToProcess.length === 0) {
                toast({ title: 'No hay cambios para guardar', status: 'info' });
                setSubmitting(false);
                return;
            }

            const allPromises: Promise<any>[] = [];

            for (const key of keysToProcess) {
                const [fecha, turno] = key.split('_');
                const changes = registroMasivoBuffer[key];

                const promises = Object.entries(changes).map(async ([vacaId, litrosStr]) => {
                    const fechaOrdeno = new Date(`${fecha}T12:00:00`).toISOString();
                    const litrosNum = Number(litrosStr) || 0;

                    const existing = ordenos.find(o => {
                        const d = new Date(o.fecha_ordeno);
                        const iso = new Intl.DateTimeFormat('fr-CA', { timeZone: 'America/Guayaquil' }).format(d);
                        return o.vaca_id === vacaId && iso === fecha && o.turno === turno as any;
                    });

                    const dto: CreateOrdenoDTO = {
                        vaca_id: vacaId,
                        ganaderia_id: ganaderia!.ganaderia_id,
                        fecha_ordeno: fechaOrdeno,
                        turno: turno as 'MANANA' | 'TARDE',
                        litros: litrosNum
                    };

                    if (existing) {
                        if (existing.litros !== litrosNum) {
                            const updated = await ordenoService.updateOrdeno(existing.ordeno_id, dto);
                            updateOrdeno(updated);
                        }
                    } else if (litrosNum > 0) {
                        const created = await ordenoService.createOrdeno(dto);
                        addOrdeno(created);
                    }
                });

                allPromises.push(...promises);
            }

            await Promise.all(allPromises);

            setRegistroMasivoBuffer({});

            toast({ title: 'Todos los registros guardados con éxito', status: 'success' });
            onClose();
        } catch (error: any) {
            toast({ title: 'Error al guardar', description: error.message, status: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleOpenEdit = (ordeno: Ordeno) => {
        setOrdenoToEdit(ordeno);
        onEditOpen();
    };

    const handleOpenDelete = (ordeno: Ordeno) => {
        setOrdenoToDelete(ordeno);
        onDeleteOpen();
    };

    const confirmDelete = async () => {
        if (!ordenoToDelete) return;
        setDeleting(true);
        try {
            await ordenoService.deleteOrdeno(ordenoToDelete.ordeno_id);
            toast({ title: 'Registro eliminado', status: 'success' });
            removeOrdeno(ordenoToDelete.ordeno_id);
            onDeleteClose();
        } catch (error: any) {
            toast({ title: 'Error al eliminar', description: error.message, status: 'error' });
        } finally {
            setDeleting(false);
        }
    };

    const handleCerrarModal = () => {
        if (Object.keys(registroMasivoBuffer).length > 0) {
            onConfirmCloseOpen();
        } else {
            onClose();
        }
    };

    const handleConfirmClose = () => {
        onConfirmCloseClose();
        onClose();
        onEditClose();
    };

    const handleSaveEdit = async () => {
        if (!ordenoToEdit) return;
        setSubmitting(true);
        try {
            const updated = await ordenoService.updateOrdeno(ordenoToEdit.ordeno_id, {
                litros: Number(ordenoToEdit.litros)
            });
            updateOrdeno(updated);
            toast({ title: 'Actualizado', status: 'success' });
            onEditClose();
        } catch (err: any) {
            toast({ title: 'Error', description: err.message, status: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const isLoading = loadingGanaderia || ordenosLoading;
    const hasChangesMasivo = Object.keys(registroMasivoBuffer).length > 0;

    const hasChangesEdit = ordenoToEdit && ordenos.find(o => o.ordeno_id === ordenoToEdit.ordeno_id)?.litros !== Number(ordenoToEdit.litros);

    return (
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} w="full">
            <OrdenoHeader
                ganaderia={ganaderia}
                canCreate={can('crear')}
                onOpenRegistroMasivo={handleOpenRegistroMasivo}
            />

            <OrdenoFilters
                filtroJornada={filtroJornada}
                setFiltroJornada={setFiltroJornada}
            />

            {isLoading ? (
                <Flex justify="center" py={10}><Spinner size="xl" color="brand.500" thickness="3px" /></Flex>
            ) : (
                <OrdenoList
                    groupedOrdenos={groupedOrdenos}
                    vacas={vacas}
                    canEdit={can('editar')}
                    canDelete={can('eliminar')}
                    onEdit={handleOpenEdit}
                    onDelete={handleOpenDelete}
                />
            )}

            <RegistroMasivoModal
                isOpen={isOpen}
                onClose={handleCerrarModal}
                fechaMasiva={fechaMasiva}
                setFechaMasiva={setFechaMasiva}
                turnoActivoModal={turnoActivoModal}
                setTurnoActivoModal={setTurnoActivoModal}
                vacas={vacas}
                getLitrosValue={getLitrosValue}
                handleInputChange={handleInputChange}
                handleGuardarMasivo={handleGuardarMasivo}
                submitting={submitting}
                hasChangesInView={hasChangesMasivo}
            />

            <EditOrdenoModal
                isOpen={isEditOpen}
                onClose={() => {
                    if (hasChangesEdit) onConfirmCloseOpen();
                    else onEditClose();
                }}
                ordenoToEdit={ordenoToEdit}
                setOrdenoToEdit={setOrdenoToEdit}
                vacas={vacas}
                onSave={handleSaveEdit}
                submitting={submitting}
                hasChanges={!!hasChangesEdit}
                validateLitros={validateLitros}
            />

            <DeleteConfirmDialog
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                cancelRef={cancelRef}
                onConfirm={confirmDelete}
                isLoading={deleting}
            />

            <CloseConfirmDialog
                isOpen={isConfirmCloseOpen}
                cancelRef={cancelRef}
                onClose={onConfirmCloseClose}
                onConfirm={handleConfirmClose}
            />
        </MotionBox>
    );
};
