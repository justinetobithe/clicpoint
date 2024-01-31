import React, { useContext, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import DatePicker from 'react-datepicker';
import CloseIcon from '@mui/icons-material/Close';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Button from '@mui/material/Button';
import { AppContext } from '../../store';
import { useFetch, useHttpRequest } from '../../api';
import { Col } from 'react-bootstrap';
import moment from 'moment';
import { notify } from '../Elements';




export default function PriorityQueueModal({ onClose }) {
    const { state, dispatch } = useContext(AppContext);
    const [selectedDate, setSelectedDate] = useState(null);

    const { data, loading } = useFetch({
        url: "/api/appointment/approved"
    });

    const [response, handleHttpRequest] = useHttpRequest(data => ({
        url: "/api/appointment/priority-queue",
        method: "PUT",
        data,
        header: { "Content-Type": "application/json" }
    }))

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: response.loading })
        if (response.error.length || response.data !== null) {
            notify(
                response.data.length ? response.error : response.data.message,
                response.data.status ? "success" : "error"
            )
            if (response.data.status) {
                dispatch({
                    type: "UPDATE_PATIENT",
                    payload: response.data.payload
                })
            }
            closeModal();
        }
    }, [response])

    const [selectedTimeSlots, setSelectedTimeslots] = useState(
        [
            { time: "9:00 AM - 9:30 AM", data: null },
            { time: "9:30 AM - 10:00 AM", data: null },
            { time: "10:00 AM - 10:30 AM", data: null },
            { time: "10:30 AM - 11:00 AM", data: null },
            { time: "11:00 AM - 11:30 AM", data: null },
            { time: "11:30 AM - 12:00 PM", data: null },
            { time: "2:00 PM - 2:30 PM", data: null },
            { time: "2:30 PM - 3:00 PM", data: null },
            { time: "3:00 PM - 3:30 PM", data: null },
            { time: "3:30 PM - 4:00 PM", data: null },
            { time: "4:00 PM - 4:30 PM", data: null },
            { time: "4:30 PM - 5:00 PM", data: null }
        ]
    );

    const allocateAppointmentsToTimeSlots = (appointments, selectedDate) => {
        setSelectedDate(selectedDate);
        let date = moment(selectedDate).format('YYYY-MM-DD');
        let selectedAppointments = appointments.filter(item => item.schedule == date);
        setSelectedTimeslots(state => state.map(item => {
            if (selectedAppointments.some(v => v.time == item.time)) {
                return {
                    ...item,
                    data: selectedAppointments.find(v => v.time == item.time)
                }
            }
            return {
                ...item,
                data: null
            };
        }))
    };

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: loading });
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
        });
    };


    const onShuffle = () => {
        let currState = [...selectedTimeSlots];
        let apptPriorities1 = currState.filter(item => item.data && item.data.appointment_type && item.data.appointment_type.name === 'Vaccination/Immunization');
        let apptPriorities2 = currState.filter(item => item.data && item.data.health_condition && item.data.health_condition.condition === 3);
        let apptPriorities3 = currState.filter(item => item.data && item.data.health_condition && item.data.health_condition.condition === 2);
        let apptPriorities4 = currState.filter(item => item.data && item.data.health_condition && item.data.health_condition.condition === 1);
        let apptPriorities = [
            ...apptPriorities1,
            ...apptPriorities2,
            ...apptPriorities3,
            ...apptPriorities4,
        ];

        let finalData = [];
        loop1: for (const curr of currState) {
            let currData = {
                ...curr
            }

            if (apptPriorities.some(v => v.data.time == currData.time)) {
                currData.data = null
            }

            if (!currData.data) {
                loop2: for (const appt of apptPriorities) {
                    if (finalData.some(v => v.data && v.data.id == appt.data.id)) continue loop2;
                    currData.data = appt.data
                    break loop2;
                }
            }

            finalData.push(currData);
        }
        setSelectedTimeslots(finalData);

        let data = {
            data: finalData
        };

        handleHttpRequest(data)
    }

    return (
        <div>
            <div className="row g-3 align-items-center mb-3">
                <Col xs="auto">
                    <label className="col-form-label">Date</label>
                </Col>
                <Col xs="auto">
                    <DatePicker
                        className=""
                        selected={selectedDate}
                        onChange={(date) => allocateAppointmentsToTimeSlots(data, date)}
                        dateFormat="MMMM d, yyyy"
                        minDate={new Date()}

                    />
                </Col>
            </div>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Time</TableCell>
                            <TableCell>Appointment Type</TableCell>
                            <TableCell>Health Condition</TableCell>
                            <TableCell>Schedule</TableCell>
                            <TableCell>Reason</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedTimeSlots.map((timeslot, index) => (
                            <TableRow key={index}>
                                <TableCell>{timeslot.time}</TableCell>
                                <TableCell>
                                    {timeslot.data && timeslot.data.appointment_type && timeslot.data.appointment_type.name}
                                </TableCell>
                                <TableCell>
                                    {timeslot.data && timeslot.data.health_condition && timeslot.data.health_condition.name}
                                </TableCell>
                                <TableCell>
                                    {timeslot.data && timeslot.data.schedule}
                                </TableCell>
                                <TableCell>
                                    {timeslot.data && timeslot.data.reason}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
            <div className="gap-3 mt-3 d-flex align-items-center justify-content-end">
                <Button variant="outlined" startIcon={<CloseIcon />} data-bs-dismiss="modal" onClick={() => closeModal()}>
                    Close
                </Button>
                <Button variant="contained" endIcon={<SaveAltIcon />} onClick={onShuffle}>
                    Prioritize Patients
                </Button>
            </div>
        </div>
    );
}
