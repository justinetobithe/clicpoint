import React, { useContext, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import DatePicker from 'react-datepicker';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { AppContext } from '../../store';
import { useFetch } from '../../api';
import { Col } from 'react-bootstrap';
import moment from 'moment';




export default function TodayScheduleModal({ onClose }) {
    const { state, dispatch } = useContext(AppContext);
    const [selectedDate, setSelectedDate] = useState(null);

    const { data, loading } = useFetch({
        url: "/api/appointment/approved"
    });


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
                            <TableCell>Patient</TableCell>
                            <TableCell>Appointment Type</TableCell>
                            <TableCell>Health Condition</TableCell>
                            <TableCell>Schedule</TableCell>
                            <TableCell>Reason</TableCell>
                            <TableCell>Remarks</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedTimeSlots.map((timeslot, index) => (
                            <TableRow key={index}>
                                <TableCell>{timeslot.time}</TableCell>
                                <TableCell>{timeslot.data && timeslot.data.user ? timeslot.data.user.name : ""}</TableCell>
                                <TableCell>{timeslot.data && timeslot.data.appointment_type ? timeslot.data.appointment_type.name : ""}</TableCell>
                                <TableCell>{timeslot.data && timeslot.data.health_condition ? timeslot.data.health_condition.name : ""}</TableCell>
                                <TableCell>{timeslot.data ? timeslot.data.schedule : ""}</TableCell>
                                <TableCell>{timeslot.data ? timeslot.data.reason : ""}</TableCell>
                                <TableCell>
                                    {timeslot.data ? (
                                        timeslot.data.remarks === 1 ? "Cancelled" :
                                            timeslot.data.remarks === 2 ? "Catered" :
                                                timeslot.data.remarks === 3 ? "Not Attended" :
                                                    ""
                                    ) : ""}
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
            </div>
        </div>
    );
}
