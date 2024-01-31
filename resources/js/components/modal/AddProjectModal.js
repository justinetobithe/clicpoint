import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2';
import CloseIcon from '@mui/icons-material/Close';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Button from '@mui/material/Button';
import { notify } from '../Elements';
import { useFetch, useHttpRequest } from '../../api';
import { AppContext } from '../../store';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import dateFormat from 'dateformat';

export default function AddProjectModal() {

    const { state, dispatch } = useContext(AppContext)

    const [selectedProgram, setSelectedProgram] = useState()
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    const program = useFetch({
        url: "/api/programs"
    })

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [response, httpRequest] = useHttpRequest(data => ({
        url: "/api/projects",
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
                    type: "INSERT_PROJECT",
                    payload: response.data.payload
                })
            }
            closeModal();
        }
    }, [response])

    const onSubmit = (data) => {
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
                fd.append("program_id", selectedProgram.value);
                fd.append("proj_title", data.proj_title);
                fd.append("address", data.address);
                fd.append("date_started", startDate != null ? dateFormat(startDate, "yyyy-mm-dd HH:MM:ss") : "");
                fd.append("date_ended", endDate != null ? dateFormat(endDate, "yyyy-mm-dd HH:MM:ss") : "");
                fd.append("status", 2);
                httpRequest(fd);

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
                        Program
                    </label>
                    <Select
                        options={program.data.map(program => ({
                            value: program.id,
                            label: program.prog_title
                        }))}
                        isClearable
                        defaultValue={selectedProgram}
                        onChange={setSelectedProgram}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="" className="col-form-label">
                        Project Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        {...register("proj_title", { required: true })}
                    />
                    {
                        errors.proj_title && (<div className="form-text ps-error-message">This field is required *</div>)
                    }
                </div>
                <div className="mb-3">
                    <label htmlFor="" className="col-form-label">
                        Address
                    </label>
                    <textarea
                        type="text"
                        className="form-control"
                        {...register("address", { required: true })}
                    ></textarea>
                    {
                        errors.address && (<div className="form-text ps-error-message">This field is required *</div>)
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
                        minDate={new Date()}
                        startDate={startDate}
                        endDate={endDate}
                        showTimeSelect
                        dateFormat="MMMM d, yyyy h:mm aa"
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
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        showTimeSelect
                        dateFormat="MMMM d, yyyy h:mm aa"
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
