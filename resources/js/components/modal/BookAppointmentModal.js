import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useFetch, useHttpRequest } from './../../api';
import { AppContext } from './../../store';
import { notify } from '../Elements';
import { Form, Button, Card } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import dateFormat from 'dateformat';
import CloseIcon from '@mui/icons-material/Close';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

const timeOptions = [
    { value: "9:00 AM - 9:30 AM", label: "9:00 AM - 9:30 AM" },
    { value: "9:30 AM - 10:00 AM", label: "9:30 AM - 10:00 AM" },
    { value: "10:00 AM - 10:30 AM", label: "10:00 AM - 10:30 AM" },
    { value: "10:30 AM - 11:00 AM", label: "10:30 AM - 11:00 AM" },
    { value: "11:00 AM - 11:30 AM", label: "11:00 AM - 11:30 AM" },
    { value: "11:30 AM - 12:00 PM", label: "11:30 AM - 12:00 PM" },
    { value: "2:00 PM - 2:30 PM", label: "2:00 PM - 2:30 PM" },
    { value: "2:30 PM - 3:00 PM", label: "2:30 PM - 3:00 PM" },
    { value: "3:00 PM - 3:30 PM", label: "3:00 PM - 3:30 PM" },
    { value: "3:30 PM - 4:00 PM", label: "3:30 PM - 4:00 PM" },
    { value: "4:00 PM - 4:30 PM", label: "4:00 PM - 4:30 PM" },
    { value: "4:30 PM - 5:00 PM", label: "4:30 PM - 5:00 PM" },
];

export default function BookAppointmentModal() {
    const { state, dispatch } = useContext(AppContext);
    const [selectedPurpose, setSelectedPurpose] = useState(null);
    const [selectedHealthConditon, setSelectedHealthConditon] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedChild, setSelectedChild] = useState(null);

    const calculateAvailableTimeSlots = () => {
        if (selectedDate) {
            const currentDate = new Date();
            const selectedDateTime = new Date(selectedDate);

            const isTomorrow = selectedDateTime.getDate() === currentDate.getDate() + 1;

            if (isTomorrow) {
                return timeOptions.filter((timeOption) => {
                    const [startTime] = timeOption.value.split(' - ');
                    const [hour, minute] = startTime.split(':');
                    const timeSlotTime = new Date(
                        selectedDateTime.getFullYear(),
                        selectedDateTime.getMonth(),
                        selectedDateTime.getDate(),
                        parseInt(hour),
                        parseInt(minute)
                    );
                    return timeSlotTime >= currentDate && timeSlotTime <= currentDate.setDate(currentDate.getDate() + 2);
                });
            } else {
                return timeOptions;
            }
        }
        return null;
    };

    const updatedTimeOptions = calculateAvailableTimeSlots();

    useEffect(() => {
        setSelectedTime(null);
    }, [selectedDate]);


    const { data, loading } = useFetch({
        url: '/api/appointment-types'
    });

    const healthConditions = useFetch({
        url: '/api/health-conditions'
    });

    const childrens = useFetch({
        url: `/api/childrens/${state.user.id}`
    })

    useEffect(() => {
        dispatch({ type: 'TOGGLE_LOADING', payload: loading });
    }, [loading]);

    useEffect(() => {
        dispatch({ type: 'FETCH_APPOINTMENT_TYPE', payload: data });
    }, [data]);

    useEffect(() => {
        dispatch({ type: 'FETCH_HEALTH_CONDITION', payload: healthConditions.data });
    }, [healthConditions.data]);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [response, httpRequest] = useHttpRequest((data) => ({
        url: '/api/appointments',
        method: 'POST',
        data,
        header: { 'Content-Type': 'application/json' }
    }));

    useEffect(() => {
        dispatch({ type: 'TOGGLE_LOADING', payload: response.loading });
        if (response.error.length || response.data !== null) {
            notify(
                response.error.length ? response.error : response.data.message,
                response.data.status ? 'success' : 'error'
            );

            if (response.data.status == true) {
                dispatch({
                    type: "INSERT_APPOINTMENT",
                    payload: response.data.payload
                })
                closeModal();
            }
        }
    }, [response]);

    const showAlert = (title, icon, confirmButtonColor) => {
        Swal.fire({
            title: title,
            icon: icon,
            confirmButtonColor: confirmButtonColor,
            customClass: {
                container: 'swal-container',
            },

        });
    };

    const onSubmit = (formData) => {
        if (selectedChild == null) {
            showAlert("Please select a child.", "error", "#1982c4");
            return;
        } else if (!selectedDate) {
            showAlert("Please select a date.", "error", "#1982c4");
            return;
        } else if (selectedTime == null) {
            showAlert("Please select a time", "error", "#1982c4");
            return;
        } else if (selectedPurpose == null) {
            showAlert("Please select a purpose.", "error", "#1982c4");
            return;
        } else if (
            (selectedPurpose.value === 1 || selectedPurpose.value === 2) &&
            selectedHealthConditon == null
        ) {
            showAlert("Please select health conditions.", "error", "#1982c4");
            return;
        } else {
            Swal.fire({
                title: 'Are you sure you want to save this data?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#1982c4',
                cancelButtonColor: '#FF6347',
                confirmButtonText: 'Ok'
            }).then((result) => {
                if (result.isConfirmed) {
                    let fd = new FormData();
                    fd.append("user_id", state.user.id)
                    fd.append("child_id", selectedChild.value)
                    fd.append('schedule', dateFormat(selectedDate, 'yyyy-mm-dd'));
                    fd.append('time', selectedTime.value);
                    fd.append('appointment_type_id', selectedPurpose.value);
                    fd.append('health_condition_id', selectedHealthConditon != null ? selectedHealthConditon.value : "");
                    fd.append('reason', formData.reason);
                    fd.append('status', 1);
                    fd.append('is_walk_in', 0);
                    httpRequest(fd);
                }
            });
        }
    };

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

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                    <Form.Label>Child</Form.Label>
                    <Select
                        options={childrens.data.map(children => ({
                            value: children.id,
                            label: children.name,
                        }))}
                        defaultValue={selectedChild}
                        onChange={setSelectedChild}
                        isClearable
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <DatePicker
                        className="form-control"
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        minDate={new Date()}
                        dateFormat="MMMM d, yyyy"
                        placeholderText="Select Date"
                        filterDate={(date) => {
                            const currentDate = new Date();
                            const nextDate = new Date(currentDate);
                            nextDate.setDate(currentDate.getDate() + 1); 
                            return date >= nextDate && date.getDay() !== 0;
                        }}
                    />

                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Time</Form.Label>
                    <Select
                        options={updatedTimeOptions || []}
                        placeholder="Select Time"
                        value={selectedTime}
                        onChange={setSelectedTime}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Purpose</Form.Label>
                    <Select
                        isClearable
                        options={state.appointmentTypes.map((appointmentType) => ({
                            value: appointmentType.id,
                            label: appointmentType.name
                        }))}
                        value={selectedPurpose}
                        onChange={setSelectedPurpose}
                        placeholder="Purpose"
                    />
                </Form.Group>
                {selectedPurpose && (selectedPurpose.value === 1 || selectedPurpose.value === 2) && (
                    <Form.Group className="mb-3" controlId="healthConditions">
                        <Form.Label>Health Conditions</Form.Label>
                        <Select
                            isClearable
                            options={state.healthConditions.map((condition) => ({
                                value: condition.id,
                                label: condition.name
                            }))}
                            defaultValue={selectedHealthConditon}
                            onChange={setSelectedHealthConditon}
                            placeholder="Select Health Conditions"
                        />
                    </Form.Group>
                )}

                <Form.Group className="mb-3">
                    <Form.Label>Reason</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Reason"
                        {...register('reason', { required: true })}
                    />
                    {errors.reason && (
                        <div className="form-text ps-error-message">This field is required *</div>
                    )}
                </Form.Group>
                <div className="gap-3 mt-3 d-flex align-items-center justify-content-end">
                    <Button className="d-flex align-items-center justfiy-content-center" variant="danger" data-bs-dismiss="modal" onClick={() => closeModal()}>
                        <CloseIcon /> Close
                    </Button>
                    <Button className="d-flex align-items-center justfiy-content-center" variant="primary" onClick={handleSubmit(onSubmit)}>
                        Save Changes <SaveAltIcon />
                    </Button>
                </div>
            </Form >
        </>
    );
}

