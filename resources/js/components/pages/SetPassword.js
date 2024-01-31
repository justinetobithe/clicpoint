import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { NavLink, useParams, Redirect, useHistory } from 'react-router-dom'
import { useFetch, useHttpRequest } from '../../api'
import { AppContext } from '../../store'
import { notify } from '../Elements'
import Swal from 'sweetalert2'

export default function SetPassword() {

    const { token } = useParams();
    let history = useHistory()

    const { state, dispatch } = useContext(AppContext)

    document.body.style.background = "#71797E";

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const { data, loading } = useFetch({
        url: `/api/validate-token/${token}`
    })

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: loading })
    }, [loading])


    const [response, httpRequest] = useHttpRequest((data) => ({
        url: "/api/set-password",
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

    const onSubmit = (formData) => {
        if (formData.newPassword !== formData.confirmPassword) {
            Swal.fire({
                title: "Passwords does not match",
                icon: "error",
                confirmButtonColor: "#3085d6",
            });
        } else {
            Swal.fire({
                title: "Are you sure you want to update this password?",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ok",
            }).then((result) => {
                if (result.isConfirmed) {
                    let fd = new FormData();
                    fd.append("newPassword", formData.newPassword);
                    fd.append("token", token);
                    httpRequest(fd);
                }
            });
        }
    };


    return (
        <>
            <div className="container login">
                <div className="row justify-content-center">
                    <div className="col-xl-10 col-lg-12 col-md-9">
                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-0">
                                <div className="row">
                                    <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center">
                                        <img className="img-fluid" src="/img/doctors.png" alt="Doctors" />
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="p-5">
                                            <div className="text-center">
                                                <img src="/img/logo.png" className="img-fluid mb-3" alt="image" width="300" />
                                            </div>
                                            <form className="user" onSubmit={handleSubmit(onSubmit)}>
                                                <div className="form-group">
                                                    <input type="password"
                                                        className="form-control"
                                                        placeholder="New Password"
                                                        {...register("newPassword", { required: true })}
                                                    />
                                                    {
                                                        errors.newPassword && (
                                                            <div className="form-text ps-error-message">
                                                                {errors.newPassword.message || "This field is required *"}
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                <div className="form-group">
                                                    <input type="password"
                                                        className="form-control"
                                                        placeholder="Confirm Password"
                                                        {...register("confirmPassword", { required: true })}
                                                    />
                                                    {
                                                        errors.confirmPassword && (
                                                            <div className="form-text ps-error-message">
                                                                {errors.confirmPassword.message || "This field is required *"}
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                <button className="btn btn-primary btn-block" type="submit">
                                                    Save Changes
                                                </button>
                                            </form>
                                            <hr />
                                            <div className="text-center">
                                                <NavLink className="small" to="/register">Create an Account!</NavLink>
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
                </div>
            </div>
        </>
    )
}
