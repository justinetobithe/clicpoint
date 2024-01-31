import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import CloseIcon from '@mui/icons-material/Close';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Button from '@mui/material/Button';
import { notify } from '../Elements';
import { useHttpRequest } from '../../api';
import { AppContext } from '../../store';

export default function EditMedicationModal({ id }) {

    const { state, dispatch } = useContext(AppContext)
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [response, handleHttpRequest] = useHttpRequest((data, id) => ({
        url: `/api/prescriptions-medications/${id}`,
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
                    type: "UPDATE_PRESCRIPTION_MEDICATION",
                    payload: response.data.payload
                });
                closeModal();
            }
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
                fd.append("prescription_id", id);
                fd.append("details", formData.details);
                fd.append("taken", formData.taken);
                fd.append("remarks", formData.remarks);
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
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                    <Form.Label>
                        Details
                    </Form.Label>
                    <Form.Control
                        type="text"
                        defaultValue={state.modal.data.details}
                        {...register('details', { required: true })}
                    />
                    {errors.details && (
                        <Form.Text className="text-danger">
                            This field is required *
                        </Form.Text>
                    )}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>
                        Taken
                    </Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        defaultValue={state.modal.data.taken}
                        {...register('taken')}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>
                        Remarks
                    </Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        defaultValue={state.modal.data.remarks}
                        {...register('remarks')}
                    />
                </Form.Group>
                <div className="gap-3 mt-3 d-flex align-items-center justify-content-end">
                    <Button variant="outlined" startIcon={<CloseIcon />} data-bs-dismiss="modal" onClick={() => closeModal()}>
                        Close
                    </Button>
                    <Button variant="contained" onClick={handleSubmit(onSubmit)} endIcon={<SaveAltIcon />}>
                        Save Changes
                    </Button>
                </div>
            </Form>
        </>
    )
}
