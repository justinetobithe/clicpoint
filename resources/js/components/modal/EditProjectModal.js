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
import Select from 'react-select';

const statusOption = [
    { value: 1, label: "Unactive" },
    { value: 2, label: "Active" }
]

export default function EditProjectModal() {

    const { state, dispatch } = useContext(AppContext)

    const [selectedProgram, setSelectedProgram] = useState()
    const [selectedStatus, setSelectedStatus] = useState(
        isset(state.modal.data)
            ? statusOption.find(
                (item) => item.value == state.modal.data.status
            ) : ""
    )

    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    const program = useFetch({
        url: "/api/programs"
    })

    useEffect(() => {
        if (state.modal.data.date_started != null) {
            setStartDate(new Date(state.modal.data.date_started))
        }
        if (state.modal.data.date_ended != null) {
            setEndDate(new Date(state.modal.data.date_ended))
        }

    }, [state.modal.data])

    useEffect(() => {
        if (state.modal.data.program_id != null && program.data.length) {
            setSelectedProgram({
                value: program.data.find(item => item.id == state.modal.data.program_id).id,
                label: program.data.find(item => item.id == state.modal.data.program_id).prog_title
            }) 
        } 
    }, [state.modal.data, program.data])

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [response, handleHttpRequest] = useHttpRequest((data, id) => ({
        url: `/api/projects/${id}`,
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
                    type: "UPDATE_PROJECT",
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
                    fd.append("proj_title", formData.proj_title);
                    fd.append("date_started", startDate != null ? dateFormat(startDate, "yyyy-mm-dd HH:MM:ss") : "");
                    fd.append("date_ended", endDate != null ? dateFormat(endDate, "yyyy-mm-dd HH:MM:ss") : "");
                    fd.append("address", formData.address);
                    fd.append("status", selectedStatus.value);
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
                {/* <div className="mb-3">
                    <label htmlFor="" className="col-form-label">
                        Program
                    </label>
                    <Select
                        options={program.data.map(program => ({
                            value: program.id,
                            label: program.prog_title
                        }))}
                        isClearable
                        value={selectedProgram}
                        defaultValue={selectedProgram}
                        onChange={setSelectedProgram}
                    />
                </div> */}
                <div className="mb-3">
                    <label htmlFor="" className="col-form-label">
                        Project
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        defaultValue={state.modal.data.proj_title}
                        {...register("proj_title", { required: true })}
                    />
                    {
                        errors.proj_title && (<div className="form-text ps-error-message">This field is required *</div>)
                    }
                </div>
                <div className="mb-3">
                    <label htmlFor="" className="col-form-label">
                        Date Start
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
                        Date End
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
                        Address
                    </label>
                    <input
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
                        Status
                    </label>
                    <Select
                        // className="form-control"
                        isClearable
                        options={statusOption}
                        defaultValue={selectedStatus}
                        onChange={setSelectedStatus}
                    />
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
