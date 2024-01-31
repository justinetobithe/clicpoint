import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { NavLink } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useFetch, useHttpRequest } from '../../api';
import { notify } from '../Elements';
import { useForm } from 'react-hook-form';
import { AppContext } from '../../store';
import dateFormat from 'dateformat';


export default function UserProfile() {
    const { state, dispatch } = useContext(AppContext);
    const [togglePassword, setTogglePassword] = useState(true);
    const [toggleConfirmPassword, setToggleConfirmPassword] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();

    const doctors = state.user.role === 3 ? useFetch({ url: `/api/doctors/${state.user.id}` }) : null;
  
    const [response, handleHttpRequest] = useHttpRequest((data, id) => ({
        url: `/api/users/${id}`,
        method: "POST",
        data,
        header: { "Content-Type": "application/json" },
    }));

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: response.loading });
        if (response.error.length || response.data !== null) {
            notify(
                response.error.length ? response.error : response.data.message,
                response.data.status ? "success" : "error"
            );
            if (
                isset(response.data.password_changed) &&
                response.data.password_changed
            ) {
                axios.get("/sanctum/csrf-cookie").then(() => {
                    axios.post("/logout").then(() => {
                        dispatch({
                            type: "AUTHENTICATION",
                            payload: {}
                        });
                    });
                });
            }
        }
    }, [response]);

    const watchNewPassword = watch("newPassword");

    const onSubmit = (formData) => {

        Swal.fire({
            title: 'Are you sure you want to change your password? You will be logout if you click OK.',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#118ab2',
            cancelButtonColor: '#ef476f',
            confirmButtonText: 'Ok'
        }).then((result) => {
            if (result.isConfirmed) {
                let fd = new FormData();
                fd.append("address", formData.address);
                fd.append("phone_number", formData.phone_number);
                fd.append('currentPassword', formData.currentPassword);
                fd.append('newPassword', formData.newPassword);
                fd.append('confirmPassword', formData.confirmPassword);

                if (state.user.role === 3 && doctors.data) { 
                    fd.append("specialization", formData.specialization || doctors.data.specialization);
                    fd.append("license_number", formData.license_number || doctors.data.license_number);
                    fd.append("ptr_number", formData.ptr_number || doctors.data.ptr_number);
                    fd.append("clinic_address", formData.clinic_address || doctors.data.clinic_address);
                    fd.append("bio", formData.bio || doctors.data.bio);
                    fd.append("consultation_fee", formData.consultation_fee || doctors.data.consultation_fee);
                    fd.append("availability", formData.availability || doctors.data.availability);
                }

                fd.append("_method", "PUT");
                handleHttpRequest(fd, state.user.id);
            }
        })
    };

    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">User Profile</h1>
            </div>
            <div className="row mt-5">
                <div className="col-12">
                    <div className="card">
                        <div className="card mb-4">
                            <div className="card-body">
                                <form onSubmit={handleSubmit(onSubmit)} className="ps-profile-form">
                                    <div className="mb-4 row">
                                        <label className="col-sm-2 col-form-label text-left text-md-end">Name :</label>
                                        <div className="col-sm-5">
                                            <input
                                                type="text"
                                                className="form-control"
                                                defaultValue={state.user.name}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4 row">
                                        <label className="col-sm-2 col-form-label text-left text-md-end">Email :</label>
                                        <div className="col-sm-5">
                                            <input
                                                type="email"
                                                className="form-control"
                                                defaultValue={state.user.email}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4 row">
                                        <label className="col-sm-2 col-form-label text-left text-md-end">Birthdate :</label>
                                        <div className="col-sm-5">
                                            <input
                                                type="text"
                                                className="form-control"
                                                defaultValue={dateFormat(state.user.birthdate, "mmmm dd, yyyy")}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4 row">
                                        <label className="col-sm-2 col-form-label text-left text-md-end">Gender :</label>
                                        <div className="col-sm-5">
                                            <input
                                                type="text"
                                                className="form-control"
                                                defaultValue={state.user.gender}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4 row">
                                        <label className="col-sm-2 col-form-label text-left text-md-end">Address :</label>
                                        <div className="col-sm-5">
                                            <input
                                                type="text"
                                                className="form-control"
                                                defaultValue={state.user.address}
                                                {...register("address")}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4 row">
                                        <label className="col-sm-2 col-form-label text-left text-md-end">Phone Number :</label>
                                        <div className="col-sm-5">
                                            <input
                                                type="text"
                                                className="form-control"
                                                defaultValue={state.user.phone_number}
                                                {...register("phone_number")}
                                            />
                                        </div>
                                    </div>

                                    {state.user.role === 3 && doctors.data && (
                                        <>
                                            <h4 className="card-title mt-5 mb-3">Doctor details</h4>

                                            <div className="mb-4 row">
                                                <label className="col-sm-2 col-form-label text-left text-md-end">Specialization</label>
                                                <div className="col-sm-5">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter Specialization"
                                                        defaultValue={doctors.data.specialization}
                                                        {...register("specialization")}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-4 row">
                                                <label className="col-sm-2 col-form-label text-left text-md-end">License Number</label>
                                                <div className="col-sm-5">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter License Number"
                                                        defaultValue={doctors.data.license_number}
                                                        {...register("license_number")}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-4 row">
                                                <label className="col-sm-2 col-form-label text-left text-md-end">PTR Number</label>
                                                <div className="col-sm-5">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter PTR Number"
                                                        defaultValue={doctors.data.ptr_number}
                                                        {...register("ptr_number")}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-4 row">
                                                <label className="col-sm-2 col-form-label text-left text-md-end">Clinic Address</label>
                                                <div className="col-sm-5">
                                                    <textarea
                                                        className="form-control"
                                                        placeholder="Enter Clinic Address"
                                                        defaultValue={doctors.data.clinic_address}
                                                        {...register("clinic_address")}
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className="mb-4 row">
                                                <label className="col-sm-2 col-form-label text-left text-md-end">Bio</label>
                                                <div className="col-sm-5">
                                                    <textarea
                                                        className="form-control"
                                                        placeholder="Enter Bio"
                                                        defaultValue={doctors.data.bio}
                                                        {...register("bio")}
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className="mb-4 row">
                                                <label className="col-sm-2 col-form-label text-left text-md-end">Consultation Fee</label>
                                                <div className="col-sm-5">
                                                    <textarea
                                                        className="form-control"
                                                        placeholder="Enter Consultation Fee"
                                                        defaultValue={doctors.data.consultation_fee}
                                                        {...register("consultation_fee")}
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className="mb-4 row">
                                                <label className="col-sm-2 col-form-label text-left text-md-end">Availability</label>
                                                <div className="col-sm-5">
                                                    <textarea
                                                        className="form-control"
                                                        placeholder="Enter Availability"
                                                        defaultValue={doctors.data.availability}
                                                        {...register("availability")}
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </>
                                    )}


                                    <h4 className="my-4">Change Password</h4>

                                    <div className="mb-4 row">
                                        <label htmlFor="inputCurrentPassword" className="col-sm-2 col-form-label text-left text-md-end">Current Password :</label>
                                        <div className="col-sm-5">
                                            <input
                                                type="password"
                                                id="inputCurrentPassword"
                                                className="form-control"
                                                {...register("currentPassword")}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4 row">
                                        <label htmlFor="inputNewPassword" className="col-sm-2 col-form-label text-left text-md-end">New Password :</label>
                                        <div className="col-sm-5">
                                            <input
                                                type={
                                                    togglePassword
                                                        ? "password"
                                                        : "text"
                                                }
                                                id="inputNewPassword"
                                                className="form-control"
                                                {...register("newPassword")}
                                            />
                                            <span className="ps-password-toggle"
                                                onClick={() =>
                                                    setTogglePassword(
                                                        (state) => !state
                                                    )}
                                            >
                                                {
                                                    togglePassword ? (
                                                        <VisibilityIcon />
                                                    ) : (
                                                        <VisibilityOffIcon />
                                                    )
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mb-4 row">
                                        <label htmlFor="inputConfirmPassword" className="col-sm-2 col-form-label text-left text-md-end">Confirm Password :</label>
                                        <div className="col-sm-5">
                                            <input
                                                type={
                                                    toggleConfirmPassword
                                                        ? "password"
                                                        : "text"
                                                }
                                                id="inputConfirmPassword"
                                                className="form-control"
                                                {
                                                ...register("confirmPassword")}
                                            />
                                            <span className="ps-password-toggle"
                                                onClick={() =>
                                                    setToggleConfirmPassword(
                                                        (state) => !state
                                                    )}
                                            >
                                                {
                                                    toggleConfirmPassword ? (
                                                        <VisibilityIcon />
                                                    ) : (
                                                        <VisibilityOffIcon />
                                                    )
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mb-4 row">
                                        <label className="col-sm-2 col-form-label text-left text-md-end"></label>
                                        <div className="col-sm-5">
                                            <ul>
                                                <li>Please do note that this action can't be undone.</li>
                                                <li>Your email address will be used to login your account</li>
                                            </ul>
                                            <div className="mb-3 gap-2 d-flex justify-content-center">
                                                <button className="btn btn-info w-50 text-white">Save</button>
                                                <NavLink className="btn btn-danger w-50" to="/">Cancel</NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
