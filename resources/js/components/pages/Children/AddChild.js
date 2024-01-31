import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useHttpRequest } from '../../../api'
import { AppContext } from '../../../store'
import { notify } from '../../Elements'
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


export default function AddChild() {

    let history = useHistory();

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
        url: "/api/childrens",
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
                history.push("/children/view")
            }
        }
    }, [response])

    const onSubmit = (formData) => {
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
                    fd.append("name", formData.name);
                    fd.append("gender", selectedGender.value);
                    fd.append("date_of_birth", selectedDateOfBirth != null ? dateFormat(selectedDateOfBirth, "yyyy-mm-dd HH:MM:ss") : "");
                    fd.append("place_of_birth", formData.place_of_birth);
                    fd.append("relationship", formData.relationship);
                    fd.append("parent_id", state.user.id);
                    httpRequest(fd);

                }
            });
        }
    }


    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Add Child</h1>
            </div>
            <div className="row mt-5">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <form className="p-5" onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-3 row">
                                    <label className="col-sm-3 col-form-label">Name of Child</label>
                                    <div className="col-sm-6">
                                        <input type="text"
                                            className="form-control"
                                            placeholder="Enter Name"
                                            {...register("name", { required: true })}
                                        />
                                        {
                                            errors.name && (<div className="form-text ps-error-message">This field is required *</div>)
                                        }
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label className="col-sm-3 col-form-label">
                                        Gender
                                    </label>
                                    <div className="col-sm-6">
                                        <Select
                                            options={genderOptions}
                                            isClearable
                                            placeholder="Gender"
                                            defaultValue={selectedGender}
                                            onChange={setSelectedGender}
                                        />
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label className="col-sm-3 col-form-label">
                                        Date of Birth
                                    </label>
                                    <div className="col-sm-6">
                                        <DatePicker
                                            placeholderText="Date of Birth"
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
                                </div>
                                <div className="mb-3 row">
                                    <label className="col-sm-3 col-form-label">
                                        Place of Birth
                                    </label>
                                    <div className="col-sm-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Place of Birth"
                                            {...register("place_of_birth", { required: true })}
                                        />
                                        {
                                            errors.place_of_birth && (<div className="form-text ps-error-message">This field is required *</div>)
                                        }
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label className="col-sm-3 col-form-label">
                                        Relationship
                                    </label>
                                    <div className="col-sm-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Relationship"
                                            {...register("relationship", { required: true })}
                                        />
                                        {
                                            errors.relationship && (<div className="form-text ps-error-message">This field is required *</div>)
                                        }
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label className="col-sm-3 col-form-label"></label>
                                    <div className="col-sm-6">
                                        <button className="btn btn-primary btn-user btn-block">
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
