import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2';
import CloseIcon from '@mui/icons-material/Close';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Button from '@mui/material/Button';
import { notify } from '../Elements';
import { useHttpRequest } from '../../api';
import { AppContext } from '../../store';
import CreatableSelect from 'react-select/creatable';


const remarksOptions = [
    { value: "at birth", label: "at birth" },
    { value: "3 weeks", label: "3 weeks" },
    { value: "6 weeks", label: "6 weeks" },
    { value: "10 weeks", label: "10 weeks" },
    { value: "12 weeks", label: "12 weeks" },
    { value: "1 year old", label: "1 year old" },
    { value: "2 years old", label: "2 years old" },
]

export default function EditVaccineModal() {

    const { state, dispatch } = useContext(AppContext)

    const [selectedRemarks, setSelectedRemarks] = useState()

    useEffect(() => {
        if (state.modal.data.remarks != null) {
            setSelectedRemarks(
                !state.modal.data.remarks ? null : JSON.parse(state.modal.data.remarks).map(item => ({
                    value: item,
                    label: item
                }))
            )
        }
    }, [state.modal.data])

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [response, handleHttpRequest] = useHttpRequest((data, id) => ({
        url: `/api/vaccines/${id}`,
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
                    type: "UPDATE_VACCINE",
                    payload: response.data.payload
                })
            }
            closeModal();
        }
    }, [response])

    const onSubmit = (formData) => {
        if (selectedRemarks == null || selectedRemarks == []) {
            Swal.fire({
                title: "Remarks cannot be black!",
                icon: "error",
                confirmButtonColor: "#3085d6"
            })
        } else {
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
                    fd.append("vaccine", formData.vaccine);
                    fd.append("description", formData.description);
                    fd.append("remarks", selectedRemarks != null ? JSON.stringify(selectedRemarks.map(item => item.value)) : "");
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
                        Vaccine/Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        defaultValue={state.modal.data.vaccine}
                        {...register("vaccine", { required: true })}
                    />
                    {
                        errors.vaccine && (<div className="form-text ps-error-message">This field is required *</div>)
                    }
                </div>
                <div className="mb-3">
                    <label htmlFor="" className="col-form-label">
                        Description
                    </label>
                    <textarea
                        type="text"
                        className="form-control"
                        defaultValue={state.modal.data.description}
                        {...register("description")}
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="" className="col-form-label">
                        Remarks
                    </label>
                    <CreatableSelect
                        isClearable
                        isMulti
                        options={remarksOptions}
                        value={selectedRemarks}
                        defaultValue={selectedRemarks}
                        onChange={setSelectedRemarks}
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
