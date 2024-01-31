import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { NavLink } from 'react-router-dom'
import { useHttpRequest } from '../../api'
import { AppContext } from '../../store'
import { notify } from '../Elements'

export default function ForgotPassword() {

    const { state, dispatch } = useContext(AppContext)

    document.body.style.background = "#71797E";

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [response, handleHttpRequest] = useHttpRequest((data) => ({
        url: "/api/forgot-password",
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
        }
    }, [response])

    const onSubmit = (formData) => {
        let data = new FormData();
        for (let key in formData) {
            data.append(key, formData[key]);
        }

        handleHttpRequest(data);
    }

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
                                                {/* <h1 className="h4 text-gray-900 mb-4">ClicPoint</h1> */}
                                                <img src="/img/logo.png" className="img-fluid mb-3" alt="image" width="300" />
                                            </div>
                                            <form className="user" onSubmit={handleSubmit(onSubmit)}>
                                                <div className="form-group">
                                                    <input type="email"
                                                        className="form-control"
                                                        placeholder="name@example.com"
                                                        {...register("email", { required: true })}
                                                    />
                                                    {
                                                        errors.email && (
                                                            <div className="form-text ps-error-message">
                                                                This field is required *
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                <button className="btn btn-primary btn-block">
                                                    Reset Password
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
