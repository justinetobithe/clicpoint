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


export default function AppointmentHistoryModal() {
    const { state, dispatch } = useContext(AppContext);

    const { data, loading } = useFetch({
        url: `/api/appointment/parent/${state.modal.data.parent_id}`,
    });

    useEffect(() => {
        dispatch({ type: 'TOGGLE_LOADING', payload: loading });
    }, [loading]);

    console.log(data)

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

    const getRemarksColor = (remarks) => {
        switch (remarks) {
            case 1:
                return 'red';
            case 2:
                return 'green';
            case 3:
                return 'yellow';
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
                                    <TableCell>Birthdate</TableCell>
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
                                        <TableCell style={{ width: 500 }}>{appointment.user.name}</TableCell>
                                        <TableCell style={{ width: 500 }}>{appointment.child.name}</TableCell>
                                        <TableCell style={{ width: 500 }}>{dateFormat(appointment.child.date_of_birth, "mmmm dd, yyyy")}</TableCell>
                                        <TableCell style={{ width: 500 }}>{dateFormat(appointment.schedule, "mmmm dd, yyyy")}</TableCell>
                                        <TableCell style={{ width: 500 }}>{appointment.time}</TableCell>
                                        <TableCell style={{ width: 500 }}>{appointment.appointment_type.name}</TableCell>
                                        <TableCell style={{ width: 500 }}>{appointment.reason}</TableCell>
                                        <TableCell style={{ width: 500 }}>
                                            <span style={{ color: getStatusColor(appointment.remarks) }}>
                                                {appointment.remarks === 1 ? 'Cancel' : appointment.remarks === 2 ? 'Catered' : appointment.remarks === 2 ? 'Not attended' : 'N/A'}
                                            </span>
                                        </TableCell>
                                        <TableCell style={{ width: 500 }}>
                                            <span style={{ color: getStatusColor(appointment.status) }}>
                                                {appointment.status === 1 ? 'Pending' : appointment.status === 2 ? 'Approved' : 'Cancelled'}
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
