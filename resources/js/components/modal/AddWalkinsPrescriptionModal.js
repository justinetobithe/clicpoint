import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, Redirect } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useFetch, useHttpRequest } from '../../api';
import { AppContext } from '../../store';
import { notify } from '../Elements';
import { Form, Button, InputGroup } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import dateFormat from 'dateformat';
import CloseIcon from '@mui/icons-material/Close';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

export default function AddWalkinsPrescriptionModal({ walkins_id, parent, child }) {
    let history = useHistory();
    const { state, dispatch } = useContext(AppContext);
    const [selectedParent, setSelectedParent] = useState(null);
    const [selectedChild, setSelectedChild] = useState(null);

    const { data, loading } = useFetch({
        url: parent ? `/api/outpatient/parent/${parent}` : "/api/outpatient/distinct-parents"
    })

    const childrens = useFetch({
        url: child ? `/api/outpatient/parent/${parent}/child/${child}` : selectedParent != null ? `/api/outpatient/children-by-parent/${selectedParent.value}` : ""
    })

    const doctors = state.user.role === 3 ? useFetch({ url: `/api/doctors/${state.user.id}` }) : null;

    useEffect(() => {
        dispatch({ type: 'TOGGLE_LOADING', payload: loading });
    }, [loading]);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [response, httpRequest] = useHttpRequest((data) => ({
        url: '/api/prescriptions',
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
                    type: "INSERT_PRESCRIPTION",
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
        if (!parent && selectedParent == null) {
            Swal.fire({
                title: "Please select a parent/parent",
                icon: "error",
                confirmButtonColor: "#3085d6"
            });
            return;
        } else if (!child && selectedChild == null) {
            Swal.fire({
                title: "Please select a child",
                icon: "error",
                confirmButtonColor: "#3085d6"
            });
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
                    fd.append("walkins_appointment_id", walkins_id ?? "")
                    fd.append('parent', parent ? parent : selectedParent.value);
                    fd.append('child', child ? child : selectedChild.value);
                    fd.append("doctor_id", doctors.data?.id)
                    fd.append('weight', formData.weight + "kgs");
                    fd.append('type', "Walk-ins");
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
                    <Form.Label>Parent</Form.Label>
                    {
                        parent ? (
                            <input
                                type="text"
                                className="form-control"
                                value={data.parent}
                                readOnly
                            />
                        ) : (
                            <Select
                                options={data.map(parent => ({
                                    value: parent.parent,
                                    label: parent.parent,
                                }))}
                                defaultValue={selectedParent}
                                onChange={setSelectedParent}
                                isClearable
                            />
                        )
                    }
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Child</Form.Label>
                    {
                        child ? (
                            <input
                                type="text"
                                className="form-control"
                                value={childrens.data?.child}
                                readOnly
                            />
                        ) : (
                            <Select
                                options={childrens.data.map(child => ({
                                    value: child.child,
                                    label: child.child,
                                }))}
                                defaultValue={selectedChild}
                                onChange={(selectedChild) => {
                                    setSelectedChild(selectedChild);
                                }}
                                isClearable
                            />
                        )
                    }
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Weight</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type="number"
                            {...register("weight")}
                        />
                        <InputGroup.Text>kgs</InputGroup.Text>
                    </InputGroup>
                    {errors.weight && (
                        <Form.Text className="ps-error-message">This field is required *</Form.Text>
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

