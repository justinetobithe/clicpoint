import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import CloseIcon from '@mui/icons-material/Close';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Button from '@mui/material/Button';
import { notify } from '../Elements';
import { useFetch, useHttpRequest } from '../../api';
import { AppContext } from '../../store';
import dateFormat from 'dateformat';
import DatePicker from 'react-datepicker';
import Select from 'react-select';

export default function AddOnlineDiagnosisModal({ appointment_id, parent_id, child_id }) {

    const { state, dispatch } = useContext(AppContext);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedParent, setSelectedParent] = useState(null);
    const [selectedChild, setSelectedChild] = useState(null);

    const { data, loading } = useFetch({
        url: parent_id ? `/api/users/${parent_id}` : "/api/users"
    })

    const childrens = useFetch({
        url: parent_id ? `/api/children/${child_id}/details` : selectedParent != null ? `/api/childrens/${selectedParent.value}` : ""
    })

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: loading })
    }, [loading])

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [response, httpRequest] = useHttpRequest(data => ({
        url: "/api/diagnosis",
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
                    type: "INSERT_DIAGNOSIS",
                    payload: response.data.payload
                });
            }
            closeModal();
        }
    }, [response]);

    const onSubmit = (data) => {
        if (!parent_id && selectedParent == null) {
            Swal.fire({
                title: "Please select a parent/patient",
                icon: "error",
                confirmButtonColor: "#3085d6"
            });
            return;
        } else if (!child_id && selectedChild == null) {
            Swal.fire({
                title: "Please select a child",
                icon: "error",
                confirmButtonColor: "#3085d6"
            });
            return;
        } else if (!selectedDate) {
            Swal.fire({
                title: "Please select a valid date for the Schedule field.",
                icon: "error",
                confirmButtonColor: "#3085d6"
            });
            return;
        } else {
            Swal.fire({
                title: "Are you sure you want to insert this data?",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ok",
            }).then((result) => {
                if (result.isConfirmed) {
                    const formData = {
                        appointment_id: appointment_id ? appointment_id : '',
                        parent_id: parent_id ? parent_id : selectedParent.value,
                        child_id: child_id ? child_id : selectedChild.value,
                        schedule: dateFormat(selectedDate, "yyyy-mm-dd"),
                        age: calculateAge(),
                        weight: data.weight + "kgs",
                        height: data.height + "cm",
                        notes: data.notes,
                        type: "Online"
                    };
                    httpRequest(formData);
                }
            });
        }
    }

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
    }

    const calculateAge = () => {
        if (selectedChild && childrens.data) {
            const selectedChildData = childrens.data.find(child => child.id === selectedChild.value);
            if (selectedChildData && selectedChildData.date_of_birth) {
                const dob = new Date(selectedChildData.date_of_birth);
                const today = new Date();
                const ageInMonths = Math.floor((today - dob) / (1000 * 60 * 60 * 24 * 30.44));
                if (ageInMonths < 12) {
                    return `${ageInMonths} months old`;
                } else {
                    const ageInYears = Math.floor(ageInMonths / 12);
                    return `${ageInYears} years old`;
                }
            }
        } else {
            const dob = new Date(childrens.data?.date_of_birth);
            const today = new Date();
            const ageInMonths = Math.floor((today - dob) / (1000 * 60 * 60 * 24 * 30.44));
            if (ageInMonths < 12) {
                return `${ageInMonths} months old`;
            } else {
                const ageInYears = Math.floor(ageInMonths / 12);
                return `${ageInYears} years old`;
            }
        }
        return '';
    };


    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label className="col-form-label">
                        Parent
                    </label>
                    {
                        parent_id ? (
                            <input
                                type="text"
                                className="form-control"
                                defaultValue={data.name}
                                readOnly
                            />
                        ) : (
                            <Select
                                options={data
                                    .filter(user => user.role === 1)
                                    .map(user => ({
                                        value: user.id,
                                        label: user.name,
                                    }))
                                }
                                defaultValue={selectedParent}
                                onChange={setSelectedParent}
                                isClearable
                            />
                        )
                    }

                </div>
                <div className="mb-3">
                    <label className="col-form-label">
                        Child
                    </label>
                    {
                        child_id ? (
                            <input
                                type="text"
                                className="form-control"
                                defaultValue={childrens.data?.name}
                                readOnly
                            />
                        ) : (
                            <Select
                                options={childrens.data.map(child => ({
                                    value: child.id,
                                    label: child.name,
                                }))}
                                defaultValue={selectedChild}
                                onChange={(selectedChild) => {
                                    setSelectedChild(selectedChild);
                                }}
                                isClearable
                            />
                        )
                    }

                </div>
                <div className="mb-3">
                    <label className="col-form-label">
                        Schedule
                    </label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={setSelectedDate}
                        className="form-control"
                        dateFormat="MMMM d, yyyy"
                    />
                </div>
                <div className="mb-3">
                    <label className="col-form-label">
                        Age
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={calculateAge()}
                        readOnly
                        {...register("age")}
                    />
                </div>
                <div className="mb-3">
                    <label className="col-form-label">
                        Weight
                    </label>
                    <div className="input-group">
                        <input
                            type="number"
                            className="form-control"
                            {...register("weight")}
                        />
                        <div className="input-group-append">
                            <span className="input-group-text">kgs</span>
                        </div>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="col-form-label">
                        Height
                    </label>
                    <div className="input-group">
                        <input
                            type="number"
                            className="form-control"
                            {...register("height")}
                        />
                        <div className="input-group-append">
                            <span className="input-group-text">cm</span>
                        </div>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="col-form-label">
                        Notes
                    </label>
                    <textarea
                        type="text"
                        className="form-control"
                        {...register("notes")}
                    ></textarea>
                    {
                        errors.notes && (<div className="form-text ps-error-message">This field is required *</div>)
                    }
                </div>
                <div className="gap-3 mt-3 d-flex align-items-center justify-content-end">
                    <Button variant="outlined" startIcon={<CloseIcon />} data-bs-dismiss="modal" onClick={() => closeModal()}>
                        Close
                    </Button>
                    <Button variant="contained" onClick={handleSubmit(onSubmit)} endIcon={<SaveAltIcon />}>
                        Save Changes
                    </Button>
                </div>
            </form>
        </>
    );
}
