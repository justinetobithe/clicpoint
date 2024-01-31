import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../store';
import { useFetch } from '../../api';
import {
    Box,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
} from '@mui/material';
import dateFormat from 'dateformat';
import { Button } from 'react-bootstrap';
import CloseIcon from '@mui/icons-material/Close';


export default function AppointmentWalkinsHistoryModal() {
    const { state, dispatch } = useContext(AppContext);

    const { data, loading } = useFetch({
        url: `/api/walk-in-appointment/history/${state.modal.data.parent}/${state.modal.data.child}`,
    });

    useEffect(() => {
        dispatch({ type: 'TOGGLE_LOADING', payload: loading });
    }, [loading]);

    const closeModal = () => {
        dispatch({
            type: "TOGGLE_MODAL",
            payload: {
                isShown: false,
                heading: "",
                footer: "",
                onHide: () => { }
            }
        })
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 1:
                return 'blue';
            case 2:
                return 'green';
            case 3:
                return 'red';
            default:
                return 'black';
        }
    };


    return (
        <>
            <Box p={2}>
                {data.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>No.</TableCell>
                                    <TableCell>Parent</TableCell>
                                    <TableCell>Child</TableCell>
                                    <TableCell>Schedule</TableCell>
                                    <TableCell style={{ width: 500 }}>Time</TableCell>
                                    <TableCell>Purpose</TableCell>
                                    <TableCell>Reason</TableCell>
                                    <TableCell>Remarks</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((appointment, index) => (
                                    <TableRow key={appointment.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{appointment.parent}</TableCell>
                                        <TableCell>{appointment.child}</TableCell>
                                        <TableCell>{dateFormat(appointment.schedule, "mmmm dd, yyyy")}</TableCell>
                                        <TableCell style={{ width: 500 }}>{appointment.time}</TableCell>
                                        <TableCell>{appointment.appointment_type.name}</TableCell>
                                        <TableCell>{appointment.reason}</TableCell>
                                        <TableCell>{appointment.remarks || 'N/A'}</TableCell>
                                        <TableCell>
                                            <span style={{ color: getStatusColor(appointment.status) }}>
                                                {appointment.status === 1 ? 'Cancelled' : appointment.status === 2 ? 'Done' : ''}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography variant="body1">
                        No appointments found for this user.
                    </Typography>
                )}
            </Box>

            <div className="gap-3 mt-3 d-flex align-items-center justify-content-end">
                <Button className="d-flex align-items-center justfiy-content-center" variant="danger" data-bs-dismiss="modal" onClick={() => closeModal()}>
                    <CloseIcon /> Close
                </Button>
            </div>
        </>
    );
}
