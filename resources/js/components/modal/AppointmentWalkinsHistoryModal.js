import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../store';
import { useFetch } from '../../api';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    List,
    Typography,
    IconButton,
    Tooltip,
    Collapse,
} from '@mui/material';
import dateFormat from 'dateformat';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import CloseIcon from '@mui/icons-material/Close';

export default function AppointmentWalkinsHistoryModal() {
    const { state, dispatch } = useContext(AppContext);
    const [isCollapsed, setIsCollapsed] = useState([]);

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

    const handleCollapseToggle = (index) => {
        const updatedCollapseState = [...isCollapsed];
        updatedCollapseState[index] = !updatedCollapseState[index];
        setIsCollapsed(updatedCollapseState);
    };

    return (
        <>
            <Box p={2}>
                {data.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
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
                                    <React.Fragment key={appointment.id}>
                                        <TableRow>
                                            <TableCell className="p-0 m-0 align-items-center">
                                                <Tooltip title={isCollapsed[index] ? 'Expand' : 'Collapse'}>
                                                    <IconButton onClick={() => handleCollapseToggle(index)}>
                                                        {isCollapsed[index] ? <AiOutlineMinus size="24" color="#000" /> : <AiOutlinePlus size="24" color="#000" />}
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
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
                                        </TableRow> {
                                            isCollapsed[index] && (
                                                <TableRow>
                                                    <TableCell colSpan={11} className="p-0">
                                                        <List className="" style={{ background: '#fff' }}>
                                                            <Collapse in={isCollapsed[index]} timeout="auto" unmountOnExit>
                                                                <Typography variant="h6" className="m-3">
                                                                    Diagnosis
                                                                </Typography>
                                                                {appointment.diagnosis ? (
                                                                    <Table>
                                                                        <TableHead>
                                                                            <TableRow>
                                                                                <TableCell>Schedule</TableCell>
                                                                                <TableCell>Age</TableCell>
                                                                                <TableCell>Weight</TableCell>
                                                                                <TableCell>Height</TableCell>
                                                                                <TableCell>Notes</TableCell>
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            <TableRow>
                                                                                <TableCell>{appointment.diagnosis.schedule}</TableCell>
                                                                                <TableCell>{appointment.diagnosis.age}</TableCell>
                                                                                <TableCell>{appointment.diagnosis.weight}</TableCell>
                                                                                <TableCell>{appointment.diagnosis.height}</TableCell>
                                                                                <TableCell>{appointment.diagnosis.notes}</TableCell>
                                                                            </TableRow>
                                                                        </TableBody>
                                                                    </Table>
                                                                ) : (
                                                                    <Typography variant="body1 m-3">No diagnosis available</Typography>
                                                                )}
                                                                <Typography variant="h6" className="m-3">
                                                                    {appointment.prescription ? (
                                                                        `Prescription (weight ${appointment.prescription.weight})`
                                                                    ) : (
                                                                        'Prescription'
                                                                    )}
                                                                </Typography>
                                                                {appointment.prescription ? (
                                                                    <Table>
                                                                        <TableHead>
                                                                            <TableRow>
                                                                                <TableCell>Details</TableCell>
                                                                                <TableCell>Taken</TableCell>
                                                                                <TableCell>Remarks</TableCell>
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            {appointment.prescription.prescription_medications.map((prescriptionMedications, index) => (
                                                                                <TableRow key={index + 1}>
                                                                                    <TableCell>{prescriptionMedications.details}</TableCell>
                                                                                    <TableCell>{prescriptionMedications.taken}</TableCell>
                                                                                    <TableCell>{prescriptionMedications.remarks}</TableCell>
                                                                                </TableRow>
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                ) : (
                                                                    <Typography variant="body1 m-3">No prescription available</Typography>
                                                                )}
                                                            </Collapse>
                                                        </List>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography variant="body1">
                        No appointments found for this user.
                    </Typography>
                )}
            </Box >

            <div className="gap-3 mt-3 d-flex align-items-center justify-content-end">
                <Button className="d-flex align-items-center justfiy-content-center" variant="danger" data-bs-dismiss="modal" onClick={() => closeModal()}>
                    <CloseIcon /> Close
                </Button>
            </div>
        </>
    );
}
