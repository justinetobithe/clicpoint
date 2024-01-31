import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useFetch, useHttpRequest } from './../../api';
import { AppContext } from './../../store';
import { notify } from '../Elements';
import { Form, Button, Card } from 'react-bootstrap';
import dateFormat from 'dateformat';
import CloseIcon from '@mui/icons-material/Close';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import { FaFilePrescription } from "react-icons/fa6";
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/system';

const remarksOptions = [
    { value: 1, label: "Cancel" },
    { value: 2, label: "Catered" },
    { value: 3, label: "Not Attended" }
]

const StyledTooltip = styled(Tooltip)({
    fontSize: 14,
});

export default function UpdateAppointmentRemarksModal({ appointment }) {
    let history = useHistory();

    const { state, dispatch } = useContext(AppContext);

    const [selectedRemarks, setSelectedRemarks] = useState(
        isset(state.modal.data)
            ? remarksOptions.find(
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
        url: `/api/appointment/${id}/remarks`,
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
        if (!selectedRemarks) {
            showAlert("Please select a remark.", "error", "#1982c4");
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
                    fd.append("remarks", selectedRemarks.value);
                    fd.append("diagnosis", formData.diagnosis);
                    fd.append("_method", "PUT");

                    if (selectedRemarks.value === 1 || selectedRemarks.value === 3) {
                        fd.append("remarks_description", formData.remarks_description);
                    }

                    handleHttpRequest(fd, appointment.id);
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

    const handleDiagnosisClick = () => {
        const appointmentId = appointment.id;
        const parentId = appointment.user_id;
        const childId = appointment.child_id;
        const url = `/record/diagnosis/online?appointment_id=${appointmentId}&parent_id=${parentId}&child_id=${childId}`;
        window.open(url, '_blank');
    };

    const handlePrescriptionClick = () => {
        const appointmentId = appointment.id;
        const parentId = appointment.user_id;
        const childId = appointment.child_id;
        const url = `/prescription/online?appointment_id=${appointmentId}&parent_id=${parentId}&child_id=${childId}`;
        window.open(url, '_blank');
    };

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Child</Form.Label>
                    <Form.Control type="text" defaultValue={appointment.child?.name} readOnly />
                </Form.Group>

                <Form.Group className="mb-3" controlId="time">
                    <Form.Label>Birthdate</Form.Label>
                    <Form.Control type="text" defaultValue={dateFormat(appointment.child?.date_of_birth, "mmmm dd, yyyy")} readOnly />
                </Form.Group>

                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="text" defaultValue={dateFormat(appointment.schedule, "mmmm dd, yyyy")} readOnly />
                </Form.Group>

                <Form.Group className="mb-3" controlId="time">
                    <Form.Label>Time</Form.Label>
                    <Form.Control type="text" defaultValue={appointment.time} readOnly />
                </Form.Group>
                <Form.Group className="mb-3" controlId="purpose">
                    <Form.Label>Purpose</Form.Label>
                    <Form.Control type="text" defaultValue={appointment.appointment_type?.name} readOnly />
                </Form.Group>

                {appointment.health_condition && appointment.health_condition != null ? (
                    <Form.Group className="mb-3" controlId="healthConditions">
                        <Form.Label>Health Conditions</Form.Label>
                        <Form.Control type="text" defaultValue={appointment.health_condition?.name} readOnly />
                    </Form.Group>
                ) : ""}

                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Reason</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        defaultValue={appointment.reason}
                        readOnly
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Remarks</Form.Label>
                    {
                        appointment.remarks == null ? (
                            <Select
                                isClearable
                                options={remarksOptions}
                                defaultValue={selectedRemarks}
                                onChange={setSelectedRemarks}
                            />
                        ) : (
                            <Form.Control type="text" defaultValue={
                                appointment.remarks == 1 ? "Cancel" :
                                    appointment.remarks == 2 ? "Catered" :
                                        appointment.remarks == 3 ? "Not Attended" :
                                            ""
                            } readOnly />
                        )
                    }
                </Form.Group>
                {
                    appointment.remarks === null ? (
                        selectedRemarks && (selectedRemarks.value === 1 || selectedRemarks.value === 3) && (
                            <Form.Group className="mb-3" controlId="comments">
                                <Form.Label>Comment</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    {...register('remarks_description', { required: true })}
                                />
                            </Form.Group>
                        )
                    ) : (
                        (appointment.remarks === 1 || appointment.remarks === 3) && (
                            <Form.Group className="mb-3" controlId="comments">
                                <Form.Label>Comment</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    defaultValue={appointment.remarks_description}
                                    readOnly
                                />
                            </Form.Group>
                        )
                    )
                }


                <div className="gap-3 mt-3 d-flex align-items-center justify-content-end">
                    <StyledTooltip title="Diagnosis" placement="bottom">
                        <Button className="d-flex align-items-center justfiy-content-center" variant="primary" onClick={handleDiagnosisClick}>
                            <MedicalInformationIcon />
                        </Button>
                    </StyledTooltip>

                    <StyledTooltip title="Prescription" placement="bottom">
                        <Button className="d-flex align-items-center justfiy-content-center" variant="secondary" onClick={handlePrescriptionClick}>
                            <FaFilePrescription size={25} />
                        </Button>
                    </StyledTooltip>

                    <Button className="d-flex align-items-center justfiy-content-center" variant="danger" data-bs-dismiss="modal" onClick={() => closeModal()}>
                        <CloseIcon /> Close
                    </Button>
                    {
                        appointment.remarks == null && (
                            <Button className="d-flex align-items-center justfiy-content-center" onClick={handleSubmit(onSubmit)}>
                                Save Changes <SaveAltIcon />
                            </Button>
                        )
                    }
                </div>
            </Form >
        </>
    );
}

