import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useFetch, useHttpRequest } from '../../api';
import { AppContext } from '../../store';
import { notify } from '../Elements';
import { Form, Button, Card } from 'react-bootstrap';
import dateFormat from 'dateformat';
import CloseIcon from '@mui/icons-material/Close';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

const statusOption = [
    { value: 2, label: "Approved" },
    { value: 3, label: "Rejected" }
]

export default function UpdateAppointmentStatusModal({ appointment }) {
    let history = useHistory();

    const { state, dispatch } = useContext(AppContext);

    const [selectedStatus, setSelectedStatus] = useState(
        isset(state.modal.data)
            ? statusOption.find(
                (item) => item.value == state.modal.data.status
            ) : ""
    ) 

    const disabledDate = (date) => {
        return date > new Date() || date.getDay() === 0;
    };

    const { data, loading } = useFetch({
        url: '/api/appointment-types'
    });

    const healthConditions = useFetch({
        url: '/api/health-conditions'
    });

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

    const [response, handleHttpRequest] = useHttpRequest((data, id) => ({
        url: `/api/appointment/${id}/status`,
        method: "POST",
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
                    type: "UPDATE_APPOINTMENT",
                    payload: response.data.payload
                })
            }
            closeModal();
        }
    }, [response])

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
        if (!selectedStatus) {
            showAlert("Please select a date.", "error", "#1982c4");
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
                    fd.append("status", selectedStatus.value);
                    fd.append("_method", "PUT");

                    if (selectedStatus.value === 3) {
                        fd.append("status_description", formData.status_description);
                    }

                    handleHttpRequest(fd, state.modal.data.id);
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
                <Form.Group className="mb-3" controlId="child">
                    <Form.Label>Child</Form.Label>
                    <Form.Control type="text" defaultValue={state.modal.data.child?.name} readOnly />
                </Form.Group>

                <Form.Group className="mb-3" controlId="birthdate">
                    <Form.Label>Birthdate</Form.Label>
                    <Form.Control type="text" defaultValue={dateFormat(state.modal.data.child?.date_of_birth, "mmmm dd, yyyy")} readOnly />
                </Form.Group>

                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="text" defaultValue={dateFormat(state.modal.data.date, "mmmm dd, yyyy")} readOnly />
                </Form.Group>

                <Form.Group className="mb-3" controlId="time">
                    <Form.Label>Time</Form.Label>
                    <Form.Control type="text" defaultValue={state.modal.data.time} readOnly />
                </Form.Group>
                <Form.Group className="mb-3" controlId="purpose">
                    <Form.Label>Purpose</Form.Label>
                    <Form.Control type="text" defaultValue={state.modal.data.appointment_type?.name} readOnly />
                </Form.Group>
                {state.modal.data.health_condition && state.modal.data.health_condition != null ? (
                    <Form.Group className="mb-3" controlId="healthConditions">
                        <Form.Label>Health Conditions</Form.Label>
                        <Form.Control type="text" defaultValue={state.modal.data.health_condition?.name} readOnly />
                    </Form.Group>
                ) : ""}

                <Form.Group className="mb-3" controlId="reason">
                    <Form.Label>Reason</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        defaultValue={state.modal.data.reason}
                        readOnly
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="status">
                    <Form.Label>Status</Form.Label>
                    <Select
                        isClearable
                        options={statusOption}
                        defaultValue={selectedStatus}
                        onChange={setSelectedStatus}
                    />
                </Form.Group>


                {selectedStatus && selectedStatus.value === 3 && (
                    <Form.Group className="mb-3" controlId="comments">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            {...register('status_description', { required: true })}
                        />
                    </Form.Group>
                )}

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

