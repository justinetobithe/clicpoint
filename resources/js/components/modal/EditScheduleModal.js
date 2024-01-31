import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2';
import CloseIcon from '@mui/icons-material/Close';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Button from '@mui/material/Button';
import { notify } from '../Elements';
import { useHttpRequest, useFetch } from '../../api';
import { AppContext } from '../../store';
import DatePicker from 'react-datepicker';
import dateFormat from "dateformat"
import 'react-datepicker/dist/react-datepicker.css';


export default function EditScheduleModal() {

    const { state, dispatch } = useContext(AppContext)

    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    useEffect(() => {
        if (state.modal.data.date_started != null) {
            setStartDate(new Date(state.modal.data.date_started))
        }
        if (state.modal.data.date_ended != null) {
            setEndDate(new Date(state.modal.data.date_ended))
        }
    }, [state.modal.data])

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [response, handleHttpRequest] = useHttpRequest((data, id) => ({
        url: `/api/programs/${id}`,
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
                    type: "UPDATE_PROGRAM",
                    payload: response.data.payload
                })
            }
            closeModal();
        }
    }, [response])

    const onSubmit = (formData) => {
        if (startDate == null) {
            Swal.fire({
                title: "Date started cannot be black!",
                icon: "error",
                confirmButtonColor: "#3085d6"
            })
        } else if (endDate == null) {
            Swal.fire({
                title: "Date ended cannot be black!",
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
                    fd.append("program_title", formData.program_title);
                    fd.append("address", formData.address);
                    fd.append("start_date", startDate != null ? dateFormat(startDate, "yyyy-mm-dd HH:MM:ss") : "");
                    fd.append("end_date", endDate != null ? dateFormat(endDate, "yyyy-mm-dd HH:MM:ss") : "");
                    fd.append("city", formData.city);
                    fd.append("_method", "PUT");
                    handleHttpRequest(fd, state.modal.data.id);

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
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label htmlFor="" className="col-form-label">
                        Program
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        defaultValue={state.modal.data.program_title}
                        {...register("program_title", { required: true })}
                    />
                    {
                        errors.program_title && (<div className="form-text ps-error-message">This field is required *</div>)
                    }
                </div>
                <div className="mb-3">
                    <label htmlFor="" className="col-form-label">
                        Address
                    </label>
                    <textarea
                        type="text"
                        className="form-control"
                        defaultValue={state.modal.data.address}
                        {...register("address", { required: true })}
                    />
                    {
                        errors.address && (<div className="form-text ps-error-message">This field is required *</div>)
                    }
                </div>
                <div className="mb-3">
                    <label htmlFor="" className="col-form-label">
                        Date Started
                    </label>
                    <DatePicker
                        className="form-control"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        showTimeSelect
                        dateFormat="MMMM d, yyyy h:mm aa"
                        placeholderText="Start Date"
                        startDate={startDate}
                        endDate={endDate}
                        minDate={new Date()}
                        isClearable
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="" className="col-form-label">
                        Date Ended
                    </label>
                    <DatePicker
                        className="form-control"
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        showTimeSelect
                        dateFormat="MMMM d, yyyy h:mm aa"
                        placeholderText="End Date"
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        isClearable
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="" className="col-form-label">
                        City
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        defaultValue={state.modal.data.city}
                        {...register("city", { required: true })}
                    />
                    {
                        errors.city && (<div className="form-text ps-error-message">This field is required *</div>)
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
