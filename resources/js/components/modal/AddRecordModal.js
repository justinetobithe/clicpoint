import React, { useState, useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useFetch, useHttpRequest } from '../../api'
import { AppContext } from '../../store'
import { notify } from '../Elements'
import DatePicker from 'react-datepicker';
import dateFormat from "dateformat"
import Select from "react-select"
import 'react-datepicker/dist/react-datepicker.css';
import { getMonth, getYear } from 'date-fns';
import range from "lodash/range";
import CloseIcon from '@mui/icons-material/Close';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Button from '@mui/material/Button';

const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
]


export default function AddRecordModal() {

    const { state, dispatch } = useContext(AppContext)
    const [selectedGender, setSelectedGender] = useState();
    const [selectedDateOfBirth, setSelectedDateOfBirth] = useState();
    const years = range(1990, getYear(new Date()) + 1, 1);
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [response, httpRequest] = useHttpRequest(data => ({
        url: "/api/outpatients",
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
                    type: "INSERT_OUTPATIENT",
                    payload: response.data.payload
                })
            }
            closeModal();
        }
    }, [response])

    const onSubmit = (data) => {
        if (selectedGender == null) {
            Swal.fire({
                title: "Gender cannot be black!",
                icon: "error",
                confirmButtonColor: "#3085d6"
            })
        } else if (selectedDateOfBirth == null) {
            Swal.fire({
                title: "Date of Birth cannot be black!",
                icon: "error",
                confirmButtonColor: "#3085d6"
            })
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
                    let fd = new FormData();
                    fd.append("parent", data.parent);
                    fd.append("child", data.child);
                    fd.append("address", data.address);
                    fd.append("date_of_birth", selectedDateOfBirth != null ? dateFormat(selectedDateOfBirth, "yyyy-mm-dd HH:MM:ss") : "");
                    fd.append("gender", selectedGender.value);
                    fd.append("relationship", data.relationship);
                    fd.append("phone_number", data.phone_number);
                    httpRequest(fd);

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
        })
    }

    return (
        <>
            <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Parent</label>
                    <input type="text" className="form-control"
                        {...register("parent", { required: true })}
                    />
                    {
                        errors.parent && (<div className="form-text ps-error-message">This field is required *</div>)
                    }
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Child</label>
                    <input type="text" className="form-control"
                        {...register("child", { required: true })}
                    />
                    {
                        errors.child && (<div className="form-text ps-error-message">This field is required *</div>)
                    }
                </div>
                <div className="col-md-8 mb-3">
                    <label className="form-label">Address</label>
                    <input type="text" className="form-control"
                        {...register("address", { required: true })}
                    />
                    {
                        errors.address && (<div className="form-text ps-error-message">This field is required *</div>)
                    }
                </div>
                <div className="col-md-4 mb-3">
                    <label className="form-label">Phone number</label>
                    <input type="number" className="form-control"
                        {...register("phone_number", { required: true })}
                    />
                    {
                        errors.phone_number && (<div className="form-text ps-error-message">This field is required *</div>)
                    }
                </div>
                <div className="col-md-4 mb-3">
                    <label className="form-label">Gender</label>
                    <Select
                        options={genderOptions}
                        defaultValue={selectedGender}
                        onChange={setSelectedGender}
                        isClearable
                    />
                </div>
                <div className="col-md-4 mb-3">
                    <label className="form-label">Date of Birth</label>
                    <DatePicker
                        renderCustomHeader={({
                            date,
                            changeYear,
                            changeMonth,
                            decreaseMonth,
                            increaseMonth,
                            prevMonthButtonDisabled,
                            nextMonthButtonDisabled,
                        }) => (
                            <div
                                style={{
                                    margin: 10,
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                                    {"<"}
                                </button>
                                <select
                                    value={getYear(date)}
                                    onChange={({ target: { value } }) => changeYear(value)}
                                >
                                    {years.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={months[getMonth(date)]}
                                    onChange={({ target: { value } }) =>
                                        changeMonth(months.indexOf(value))
                                    }
                                >
                                    {months.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>

                                <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                                    {">"}
                                </button>
                            </div>
                        )}
                        className="form-control"
                        dateFormat="MMMM d, yyyy"
                        selected={selectedDateOfBirth}
                        onChange={(date) => setSelectedDateOfBirth(date)}
                    />
                </div>
                <div className="col-md-4 mb-3">
                    <label className="form-label">Relationship</label>
                    <input type="text" className="form-control"
                        {...register("relationship", { required: true })}
                    />
                    {
                        errors.relationship && (<div className="form-text ps-error-message">This field is required *</div>)
                    }
                </div>

            </form>
            <div className="gap-3 mt-3 d-flex align-items-center justify-content-end">
                <Button variant="outlined" startIcon={<CloseIcon />} data-bs-dismiss="modal" onClick={() => closeModal()}>
                    Close
                </Button>
                <Button variant="contained" onClick={handleSubmit(onSubmit)} endIcon={<SaveAltIcon />}>
                    Save Changes
                </Button>
            </div>
        </>
    )
}
