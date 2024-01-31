import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2';
import CloseIcon from '@mui/icons-material/Close';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Button from '@mui/material/Button';
import { notify } from '../Elements';
import { useHttpRequest } from '../../api';
import { AppContext } from '../../store';
import Select from 'react-select';


const statusOption = [
    { value: 1, label: "Unactive" },
    { value: 2, label: "Active" }
]

export default function EditProgramModal() {

    const { state, dispatch } = useContext(AppContext)

    const [selectedStatus, setSelectedStatus] = useState(
        isset(state.modal.data)
            ? statusOption.find(
                (item) => item.value == state.modal.data.status
            ) : ""
    )

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
                fd.append("prog_title", formData.prog_title);
                fd.append("prog_desc", formData.prog_desc);
                fd.append("status", selectedStatus.value);
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
                        Program Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        defaultValue={state.modal.data.prog_title}
                        {...register("prog_title", { required: true })}
                    />
                    {
                        errors.prog_title && (<div className="form-text ps-error-message">This field is required *</div>)
                    }
                </div>
                <div className="mb-3">
                    <label htmlFor="" className="col-form-label">
                        Program Description
                    </label>
                    <textarea
                        type="text"
                        className="form-control"
                        defaultValue={state.modal.data.prog_desc}
                        {...register("prog_desc")}
                    ></textarea>
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
