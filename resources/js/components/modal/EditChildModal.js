import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2';
import CloseIcon from '@mui/icons-material/Close';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Button from '@mui/material/Button';
import { notify } from '../Elements';
import { useHttpRequest } from '../../api';
import { AppContext } from '../../store';
import DatePicker from 'react-datepicker';
import dateFormat from "dateformat"
import Select from "react-select"
import 'react-datepicker/dist/react-datepicker.css';
import { getMonth, getYear } from 'date-fns';
import range from "lodash/range";

const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
]

export default function EditChildModal() {

    const { state, dispatch } = useContext(AppContext)

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

    const [selectedGender, setSelectedGender] = useState();

    useEffect(() => { 
        if (state.modal.data.date_of_birth !== null) {
            setSelectedDateOfBirth(new Date(state.modal.data.date_of_birth));
        }
    }, [state.modal.data]);

    useEffect(() => {
        if (state.modal.data.gender !== null && genderOptions.length) {
            setSelectedGender(
                genderOptions.find((option) => option.value === state.modal.data.gender)
            );
        }
    }, [state.modal.data, genderOptions]);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [response, handleHttpRequest] = useHttpRequest((data, id) => ({
        url: `/api/childrens/${id}`,
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
                    type: "UPDATE_CHILDREN",
                    payload: response.data.payload
                });
                closeModal();
            }
        }
    }, [response])

    const onSubmit = (formData) => {
        Swal.fire({
            title: "Are you sure you want to update this data?",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok",
        }).then((result) => {
            if (result.isConfirmed) {
                let fd = new FormData();
                fd.append("name", formData.name);
                fd.append("gender", selectedGender.value);
                fd.append("date_of_birth", selectedDateOfBirth != null ? dateFormat(selectedDateOfBirth, "yyyy-mm-dd HH:MM:ss") : "");
                fd.append("place_of_birth", formData.place_of_birth);
                fd.append("relationship", formData.relationship);
                fd.append("parent_id", state.user.id);
                fd.append("_method", "PUT");
                handleHttpRequest(fd, state.modal.data.id);

            }
        });
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
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label htmlFor="" className="col-form-label">
                        Name of Child
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        defaultValue={state.modal.data.name}
                        {...register("name", { required: true })}
                    />
                    {
                        errors.name && (<div className="form-text ps-error-message">This field is required *</div>)
                    }
                </div>
                <div className="mb-3">
                    <label htmlFor="" className="col-form-label">
                        Gender
                    </label>
                    <Select
                        options={genderOptions}
                        isClearable
                        placeholder="Gender"
                        value={selectedGender}
                        defaultValue={selectedGender}
                        onChange={setSelectedGender}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="" className="col-form-label">
                        Date of Birth
                    </label>
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
                <div className="mb-3">
                    <label htmlFor="" className="col-form-label">
                        Place of Birth
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        defaultValue={state.modal.data.place_of_birth}
                        {...register("place_of_birth", { required: true })}
                    />
                    {
                        errors.place_of_birth && (<div className="form-text ps-error-message">This field is required *</div>)
                    }
                </div>
                <div className="mb-3">
                    <label htmlFor="" className="col-form-label">
                        Relationship
                    </label>
                    <input
                        type="text"
                        className="form-control" d
                        defaultValue={state.modal.data.relationship}
                        {...register("relationship", { required: true })}
                    />
                    {
                        errors.relationship && (<div className="form-text ps-error-message">This field is required *</div>)
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
    )
}
