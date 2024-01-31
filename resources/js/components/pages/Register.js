import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { NavLink, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useHttpRequest } from '../../api';
import { AppContext } from '../../store';
import { notify } from '../Elements';
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


export default function Register() {
    document.body.style.background = "#71797E";

    const { state, dispatch } = useContext(AppContext)
    const [selectedGender, setSelectedGender] = useState();
    const [selectedDateOfBirth, setSelectedDateOfBirth] = useState(new Date("1980-01-01"));

    const years = range(1980, getYear(new Date()) + 1, 1).reverse();

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

    let history = useHistory();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [response, httpRequest] = useHttpRequest((data) => ({
        url: "/register",
        method: "POST",
        data,
        header: { "Content-Type": "application/json" }
    }))

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: response.loading })

        if (response.error.length || response.data !== null) {
            notify(
                response.error.length ? response.error : response.data.message,
                response.data.status ? "success" : "error"
            )

            if (response.data.status) {
                history.push("/")
            }
        }
    }, [response])

    const onSubmit = (data) => {
        const currentDate = new Date();
        const userBirthdate = new Date(selectedDateOfBirth);
        const age = currentDate.getFullYear() - userBirthdate.getFullYear();

        if (age < 18) {
            Swal.fire({
                icon: "error",
                confirmButtonColor: "#3085d6",
                title: 'You must be at least 18 years old to register!',
            });
        } else if (data.password !== data.confirmPassword) {
            Swal.fire({
                icon: "error",
                confirmButtonColor: "#3085d6",
                title: 'Password does not match!',
            });
        } else if (!selectedGender) {
            Swal.fire({
                icon: "error",
                confirmButtonColor: "#3085d6",
                title: 'Please select a gender!',
            });
        } else if (!selectedDateOfBirth) {
            Swal.fire({
                icon: "error",
                confirmButtonColor: "#3085d6",
                title: 'Please select a birthdate!',
            });
        } else {
            Swal.fire({
                title: "Are you sure you want to register?",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ok",
            }).then((result) => {
                if (result.isConfirmed) {
                    let fd = new FormData();
                    fd.append("name", data.name);
                    fd.append("email", data.email);
                    fd.append("password", data.password);
                    fd.append("role", 1);
                    fd.append("gender", selectedGender.value);
                    fd.append("birthdate", dateFormat(selectedDateOfBirth, "yyyy-mm-dd"));
                    fd.append("address", data.address);
                    fd.append("phone_number", data.phone_number);
                    httpRequest(fd);
                }
            });
        }
    }

    return (
        <>
            <div className="container register">
                <div className="row justify-content-center">
                    <div className="col-xl-10 col-lg-12 col-md-9">
                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-0">
                                <div className="row">
                                    <div className="col-lg-6 d-none d-lg-block align-items-center justify-content-center">
                                        <div className="m-5">
                                            <div className="text-start mt-4">
                                                <h1>Welcome!</h1>
                                                <p className="text-gray-500">Register your child for pediatric care.</p>
                                            </div>
                                        </div>
                                        <img className="img-fluid" src="/img/doctors.png" alt="Doctors" />
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="p-5">
                                            <div className="text-center">
                                                <h2 className="h4 text-gray-900 mb-4">Create your account</h2>
                                            </div>
                                            <form className="user" onSubmit={handleSubmit(onSubmit)}>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Name"
                                                        {...register("name", { required: true })}
                                                    />
                                                    {
                                                        errors.name && (
                                                            <div className="form-text ps-error-message">This field is required *</div>
                                                        )
                                                    }

                                                </div>
                                                <div className="form-group">
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        placeholder="Email Address"
                                                        {...register("email", { required: true })}
                                                    />
                                                    {
                                                        errors.email && (
                                                            <div className="form-text ps-error-message">This field is required *</div>
                                                        )
                                                    }
                                                </div>
                                                <div className="form-group">
                                                    <DatePicker
                                                        placeholderText="Date of Birth"
                                                        renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
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
                                                                    value={String(getYear(date)) || ""}
                                                                    onChange={({ target: { value } }) => changeYear(value)}
                                                                >
                                                                    <option value="" disabled hidden>
                                                                        Year
                                                                    </option>
                                                                    {years.map((option) => (
                                                                        <option key={option} value={String(option)}>
                                                                            {option}
                                                                        </option>
                                                                    ))}
                                                                </select>

                                                                <select
                                                                    value={months[getMonth(date)] || ""}
                                                                    onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
                                                                >
                                                                    <option value="" disabled hidden>
                                                                        Month
                                                                    </option>
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
                                                        showYearDropdown
                                                        yearDropdownItemNumber={years.length}
                                                        monthDropdown
                                                        dayDropdown
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <textarea
                                                        className="form-control"
                                                        placeholder="Address"
                                                        {...register("address", { required: true })}
                                                    />
                                                    {
                                                        errors.address && (
                                                            <div className="form-text ps-error-message">This field is required *</div>
                                                        )
                                                    }
                                                </div>

                                                <div className="form-group row">
                                                    <div className="col-sm-6 mb-3 mb-sm-0">
                                                        <Select
                                                            options={genderOptions}
                                                            placeholder="Gender"
                                                            defaultValue={selectedGender}
                                                            onChange={setSelectedGender}
                                                            isClearable
                                                        />
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Phone No."
                                                            {...register("phone_number", {
                                                                required: true,
                                                                pattern: /^0[0-9]{0,10}$/,
                                                                maxLength: 11,
                                                                validate: (value) => {
                                                                    const numericValue = value.replace(/[^0-9]/g, '');
                                                                    return numericValue.startsWith('0') && numericValue.length <= 11;
                                                                },
                                                            })}
                                                            inputMode="numeric"
                                                            onInput={(e) => {
                                                                e.preventDefault();
                                                                const value = e.target.value;
                                                                const newValue = value.replace(/[^0-9]/g, '');

                                                                if (!newValue.startsWith('0')) {
                                                                    e.target.value = '0';
                                                                } else {
                                                                    e.target.value = newValue.slice(0, 11);
                                                                }
                                                            }}
                                                        />
                                                        {errors.phone_number && (
                                                            <div className="form-text ps-error-message">This field is required and must start with 0 and be 11 digits long *</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <div className="col-sm-6 mb-3 mb-sm-0">
                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            id="exampleInputPassword"
                                                            placeholder="Password"
                                                            {...register("password", { required: true })}
                                                        />
                                                        {
                                                            errors.password && (
                                                                <div className="form-text ps-error-message">This field is required *</div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            placeholder="Confirm Password"
                                                            {...register("confirmPassword", { required: true })}
                                                        />
                                                        {
                                                            errors.confirmPassword && (
                                                                <div className="form-text ps-error-message">This field is required *</div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                <div className="text-center mt-3 mb-3">
                                                    Read our <NavLink className="small" to="/privacy-policy">Privacy Policy</NavLink>
                                                </div>
                                                <button className="btn btn-primary btn-block">
                                                    Register
                                                </button>
                                                <hr />
                                            </form>
                                            <div className="text-center">
                                                <NavLink className="small" to="/forgot-password">Forgot Password?</NavLink>
                                            </div>
                                            <div className="text-center">
                                                <NavLink className="small" to="/">Already have an account? Login!</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </>
    )
}
