import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import Select from "react-select"
import Swal from 'sweetalert2'
import { useHttpRequest } from '../../api'
import { AppContext } from '../../store'
import { notify } from '../Elements'
import DatePicker from 'react-datepicker';
import dateFormat from "dateformat"
import 'react-datepicker/dist/react-datepicker.css';
import { getMonth, getYear } from 'date-fns';
import range from "lodash/range";

const roles = [
    { value: 1, label: "User" },
    { value: 2, label: "Secretary" },
    { value: 3, label: "Doctor" },
    { value: 4, label: "Admin" },
]

const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
]

export default function AddUser() {

    let history = useHistory();

    const { state, dispatch } = useContext(AppContext)
    const [selectedRole, setSelectedRole] = useState();
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

    const [response, httpRequest] = useHttpRequest((data) => ({
        url: "/api/users",
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
                history.push("/user/view");
            }
        }

    }, [response])

    const onSubmit = (formData) => {
        if (!selectedRole) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Role is required!'
            });
        } else if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Password not match!'
            });
        } else if (!selectedGender) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Gender is required!'
            });
        } else if (!selectedDateOfBirth) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Birthdate is required!'
            });
        } else if (selectedRole.value === '3' && (!formData.specialization || !formData.license_number)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Doctor details are incomplete!'
            });
        } else {
            Swal.fire({
                title: 'Are you sure you want to save this data?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#118ab2',
                cancelButtonColor: '#ef476f',
                confirmButtonText: 'Ok'
            }).then((result) => {
                if (result.isConfirmed) {
                    let fd = new FormData();
                    fd.append("name", formData.name);
                    fd.append("email", formData.email);
                    fd.append("password", formData.password);
                    fd.append("role", selectedRole.value);
                    fd.append("gender", selectedGender.value);
                    fd.append("birthdate", dateFormat(selectedDateOfBirth, "yyyy-mm-dd"));
                    fd.append("address", formData.address);
                    fd.append("phone_number", formData.phone_number);

                    if (selectedRole.value === 3) {
                        fd.append("specialization", formData.specialization || "");
                        fd.append("license_number", formData.license_number || "");
                        fd.append("ptr_number", formData.ptr_number || "");
                        fd.append("clinic_address", formData.clinic_address || "");
                        fd.append("bio", formData.bio || "");
                        fd.append("consultation_fee", formData.consultation_fee || "");
                        fd.append("availability", formData.availability || "");
                    }

                    httpRequest(fd);
                }
            });
        }
    }

    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Add User</h1>
            </div>
            <div className="row mt-5">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <form className="pl-5 pr-5" onSubmit={handleSubmit(onSubmit)}>
                                <h4 className="card-title mb-3">User details</h4>
                                <div className="mb-3 row">
                                    <label className="col-sm-3 col-form-label">Role</label>
                                    <div className="col-sm-6">
                                        <Select
                                            options={roles}
                                            isClearable
                                            placeholder="Enter Role"
                                            defaultValue={selectedRole}
                                            onChange={setSelectedRole}
                                        />
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label className="col-sm-3 col-form-label">Name</label>
                                    <div className="col-sm-6">
                                        <input type="text"
                                            className="form-control"
                                            placeholder="Enter Name"
                                            {...register("name", { required: true })}
                                        />
                                        {
                                            errors.name && (
                                                <div className="form-text ps-error-message">This field is required *</div>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label className="col-sm-3 col-form-label">Email</label>
                                    <div className="col-sm-6">
                                        <input type="email"
                                            className="form-control"
                                            placeholder="Enter Email"
                                            {...register("email", { required: true })}
                                        />
                                        {
                                            errors.email && (
                                                <div className="form-text ps-error-message">This field is required *</div>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label className="col-sm-3 col-form-label">Birthdate</label>
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
                                    <label className="col-sm-3 col-form-label">Gender</label>
                                    <div className="col-sm-6">
                                        <Select
                                            options={genderOptions}
                                            placeholder="Gender"
                                            defaultValue={selectedGender}
                                            onChange={setSelectedGender}
                                            isClearable
                                        />
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label className="col-sm-3 col-form-label">Address</label>
                                    <div className="col-sm-6">
                                        <input type="text"
                                            className="form-control"
                                            placeholder="Enter Address"
                                            {...register("address")}
                                        />
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label className="col-sm-3 col-form-label">Phone Number</label>
                                    <div className="col-sm-6">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Phone Number"
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
                                <div className="mb-3 row">
                                    <label className="col-sm-3 col-form-label">Password</label>
                                    <div className="col-sm-6">
                                        <input type="password"
                                            className="form-control"
                                            placeholder="Enter Password"
                                            {...register("password", { required: true })}
                                        />
                                        {
                                            errors.password && (
                                                <div className="form-text ps-error-message">This field is required *</div>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label className="col-sm-3 col-form-label">Confirm Password</label>
                                    <div className="col-sm-6">
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Enter Confirm Password"
                                            {...register("confirmPassword", { required: true })}
                                        />
                                        {
                                            errors.confirmPassword && (
                                                <div className="form-text ps-error-message">This field is required *</div>
                                            )
                                        }
                                    </div>
                                </div>

                                {selectedRole?.value === 3 && (
                                    <>
                                        <h4 className="card-title mt-5 mb-3">Doctor details</h4>

                                        <div className="mb-3 row">
                                            <label className="col-sm-3 col-form-label">Specialization</label>
                                            <div className="col-sm-6">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter Specialization"
                                                    {...register("specialization")}
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label className="col-sm-3 col-form-label">License Number</label>
                                            <div className="col-sm-6">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter License Number"
                                                    {...register("license_number", { required: true })}
                                                />
                                                {
                                                    errors.confirmPassword && (
                                                        <div className="form-text ps-error-message">This field is required *</div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label className="col-sm-3 col-form-label">PTR Number</label>
                                            <div className="col-sm-6">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter PTR Number"
                                                    {...register("ptr_number", { required: true })}
                                                />
                                                {
                                                    errors.confirmPassword && (
                                                        <div className="form-text ps-error-message">This field is required *</div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label className="col-sm-3 col-form-label">Clinic Address</label>
                                            <div className="col-sm-6">
                                                <textarea
                                                    className="form-control"
                                                    placeholder="Enter Clinic Address"
                                                    {...register("clinic_address")}
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label className="col-sm-3 col-form-label">Bio</label>
                                            <div className="col-sm-6">
                                                <textarea
                                                    className="form-control"
                                                    placeholder="Enter Bio"
                                                    {...register("bio")}
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label className="col-sm-3 col-form-label">Consultation Fee</label>
                                            <div className="col-sm-6">
                                                <textarea
                                                    className="form-control"
                                                    placeholder="Enter Consultation Fee"
                                                    {...register("consultation_fee")}
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label className="col-sm-3 col-form-label">Availability</label>
                                            <div className="col-sm-6">
                                                <textarea
                                                    className="form-control"
                                                    placeholder="Enter Availability"
                                                    {...register("availability")}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </>
                                )}

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
