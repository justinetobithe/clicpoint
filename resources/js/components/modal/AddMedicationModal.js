import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import CloseIcon from '@mui/icons-material/Close';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Button from '@mui/material/Button';
import { notify } from '../Elements';
import { useHttpRequest } from '../../api';
import { AppContext } from '../../store';

export default function AddMedicationModal({ id }) {
    const { state, dispatch } = useContext(AppContext);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [response, httpRequest] = useHttpRequest(data => ({
        url: `/api/prescriptions-medications`,
        method: 'POST',
        data,
        header: { 'Content-Type': 'application/json' },
    }));

    useEffect(() => {
        dispatch({ type: 'TOGGLE_LOADING', payload: response.loading });
        if (response.error.length || response.data !== null) {
            notify(
                response.data.length ? response.error : response.data.message,
                response.data.status ? 'success' : 'error'
            );
            if (response.data.status) {
                dispatch({
                    type: 'INSERT_PRESCRIPTION_MEDICATION',
                    payload: response.data.payload,
                });
                closeModal();
            }
        }
    }, [response]);

    const onSubmit = (formData) => {
        Swal.fire({
            title: 'Are you sure you want to update this data?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok',
        }).then((result) => {
            if (result.isConfirmed) {
                const data = {
                    prescription_id: id,
                    details: formData.details,
                    taken: formData.taken,
                    remarks: formData.remarks,
                };
                httpRequest(data);
            }
        });
    };

    const closeModal = () => {
        dispatch({
            type: 'TOGGLE_MODAL',
            payload: {
                isShown: false,
                heading: '',
                footer: '',
                onHide: () => { },
            },
        });
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
                <Form.Label>
                    Details
                </Form.Label>
                <Form.Control
                    type="text"
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
    );
}
