import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useFetch, useHttpRequest } from '../../../api';
import { AppContext } from '../../../store';
import { notify } from '../../Elements';
import { Form, Button, Card } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import dateFormat from 'dateformat';


export default function AddAppointmentWalkIns() {
    let history = useHistory();

    const { state, dispatch } = useContext(AppContext);
    const [selectedPurpose, setSelectedPurpose] = useState(null);
    const [selectedHealthConditon, setSelectedHealthConditon] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedParent, setSelectedParent] = useState(null);
    const [selectedChild, setSelectedChild] = useState(null);


    const { data, loading } = useFetch({
        url: "/api/appointment-types"
    });

    const healthConditions = useFetch({
        url: "/api/health-conditions"
    });

    const outPatientParent = useFetch({
        url: "/api/outpatient/distinct-parents"
    });

    const outPatientChildren = useFetch({
        url: selectedParent != null ? `/api/outpatient/children-by-parent/${selectedParent.value}` : ""
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
        url: '/api/walk-ins-appointments',
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

            if (response.data.status) {
                history.push("/appointment/walk-in");
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
        if (selectedParent == null) {
            showAlert("Please select a parent.", "error", "#1982c4");
            return;
        } else if (selectedChild == null) {
            showAlert("Please select a child.", "error", "#1982c4");
            return;
        } else if (selectedPurpose == null) {
            showAlert("Please select a purpose.", "error", "#1982c4");
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
                    fd.append('parent', selectedParent.value);
                    fd.append('child', selectedChild.value);
                    fd.append('appointment_type_id', selectedPurpose.value);
                    fd.append('health_condition_id', selectedHealthConditon != null ? selectedHealthConditon.value : "");
                    fd.append('reason', formData.reason);
                    httpRequest(fd);
                }
            });
        }
    };

    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Appointment for walk-ins</h1>
            </div>
            <div className="row mt-5">
                <div className="col-12">
                    <Card>
                        <Card.Body>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Form.Group className="mb-3 row" controlId="parent">
                                    <Form.Label className="col-sm-3 col-form-label">Parent</Form.Label>
                                    <div className="col-sm-6">
                                        <Select
                                            options={outPatientParent.data.map(parent => ({
                                                value: parent.parent,
                                                label: parent.parent,
                                            }))}
                                            defaultValue={selectedParent}
                                            onChange={setSelectedParent}
                                            isClearable
                                        />
                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-3 row" controlId="child">
                                    <Form.Label className="col-sm-3 col-form-label">Child</Form.Label>
                                    <div className="col-sm-6">
                                        <Select
                                            options={outPatientChildren.data.map(child => ({
                                                value: child.child,
                                                label: child.child,
                                            }))}
                                            defaultValue={selectedChild}
                                            onChange={(selectedChild) => {
                                                setSelectedChild(selectedChild);
                                            }}
                                            isClearable
                                        />
                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-3 row" controlId="purpose">
                                    <Form.Label className="col-sm-3 col-form-label">Purpose</Form.Label>
                                    <div className="col-sm-6">
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
                                    </div>
                                </Form.Group>
                                {selectedPurpose && (selectedPurpose.value === 1 || selectedPurpose.value === 2) && (
                                    <Form.Group className="mb-3 row" controlId="healthConditions">
                                        <Form.Label className="col-sm-3 col-form-label">Health Conditions</Form.Label>
                                        <div className="col-sm-6">
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
                                        </div>
                                    </Form.Group>
                                )}
                                <Form.Group className="mb-3 row" controlId="name">
                                    <Form.Label className="col-sm-3 col-form-label">Reason</Form.Label>
                                    <div className="col-sm-6">
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Reason"
                                            {...register('reason', { required: true })}
                                        />
                                        {errors.reason && (
                                            <div className="form-text ps-error-message">This field is required *</div>
                                        )}
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-3 row">
                                    <Form.Label className="col-sm-3 col-form-label"></Form.Label>
                                    <div className="col-sm-6">
                                        <Button
                                            className="btn-primary btn-user btn-block"
                                            type="submit"
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </Form.Group>

                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </>
    );
}

