import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useFetch, useHttpRequest } from '../../api';
import { AppContext } from '../../store';
import { notify } from '../Elements';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import dateFormat from 'dateformat';
import CloseIcon from '@mui/icons-material/Close';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimeRangePicker from 'react-time-range';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import { FaFilePrescription } from "react-icons/fa6";
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/system';

const statusOption = [
    { value: 1, label: "Cancel" },
    { value: 2, label: "Done" }
];

const StyledTooltip = styled(Tooltip)({
    fontSize: 14,
});

export default function UpdateStatusWalkInsAppointmentModal({ appointment }) {
    let history = useHistory();

    const { state, dispatch } = useContext(AppContext);

    const [selectedStatus, setSelectedStatus] = useState();

    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

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
        url: `/api/walk-ins-appointments/${id}`,
        method: "POST",
        data,
        header: { "Content-Type": "application/json" }
    }));

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: response.loading });
        if (response.error.length || response.data !== null) {
            notify(
                response.data.length ? response.error : response.data.message,
                response.data.status ? "success" : "error"
            );
            if (response.data.status) {
                dispatch({
                    type: "UPDATE_WALK_IN_APPOINTMENT",
                    payload: response.data.payload
                });
            }
            closeModal();
        }
    }, [response]);

    const showAlert = (title, icon, confirmButtonColor) => {
        Swal.fire({
            title: title,
            icon: icon,
            confirmButtonColor: confirmButtonColor,
            customClass: {
                container: 'swal-container',
            }
        });
    };

    const onSubmit = (formData) => {
        if (!selectedStatus) {
            showAlert("Please select a status.", "error", "#1982c4");
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
                    fd.append("start_time", startTime);
                    fd.append("end_time", endTime);
                    fd.append("_method", "PUT");
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
        });
    };

    const handleDiagnosisClick = () => {
        const url = `/record/diagnosis/walk-ins?walkins_id=${state.modal.data.id}&parent=${state.modal.data.parent}&child=${state.modal.data.child}`;
        window.open(url, '_blank');
    };

    const handlePrescriptionClick = () => {
        const url = `/prescription/walk-ins?walkins_id=${state.modal.data.id}&parent=${state.modal.data.parent}&child=${state.modal.data.child}`;
        window.open(url, '_blank');
    };

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3" controlId="date">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                        type="email"
                        defaultValue={dateFormat(state.modal.data.date, "mmmm dd, yyyy")}
                        readOnly
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="purpose">
                    <Form.Label>Purpose</Form.Label>
                    <Form.Control
                        type="email"
                        defaultValue={state.modal.data.appointment_type?.name}
                        readOnly
                    />
                </Form.Group>
                {state.modal.data.health_condition && state.modal.data.health_condition != null ? (
                    <Form.Group className="mb-3" controlId="healthConditions">
                        <Form.Label>Purpose</Form.Label>
                        <Form.Control
                            type="email"
                            defaultValue={state.modal.data.health_condition?.name}
                            readOnly
                        />
                    </Form.Group>
                ) : ""}
                <Form.Group className="mb-3" controlId="name">
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
                {selectedStatus && selectedStatus.value === 2 ? (
                    <Form.Group className="mb-3" controlId="timeRange">
                        <Form.Label>Time Range</Form.Label>
                        <Row>
                            <Col xs={6} md={6} lg={6} xl={6}>
                                <div>
                                    <Form.Label className="mr-3">Start Time: </Form.Label>
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        min="09:00"
                                        max="17:00"
                                        disabled={!selectedStatus || selectedStatus.value !== 2}
                                    />
                                </div>
                            </Col>
                            <Col xs={6} md={6} lg={6} xl={6}>
                                <div>
                                    <Form.Label className="mr-3">End Time: </Form.Label>
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        min="09:00"
                                        max="17:00"
                                        disabled={!selectedStatus || selectedStatus.value !== 2}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Form.Group>
                ) : null}
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
                    <Button
                        className="d-flex align-items-center justfiy-content-center"
                        variant="danger"
                        data-bs-dismiss="modal"
                        onClick={() => closeModal()}
                    >
                        <CloseIcon /> Close
                    </Button>
                    <Button
                        className="d-flex align-items-center justfiy-content-center"
                        variant="primary"
                        onClick={handleSubmit(onSubmit)}
                    >
                        Save Changes <SaveAltIcon />
                    </Button>
                </div>
            </Form>
        </>
    );
}
