import React, { useContext, useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import { AppContext } from '../../store';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


export default function ViewScheduleModal() {

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
            <form>
                <div className="mb-3">
                    <label htmlFor="" className="col-form-label">
                        Program
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        defaultValue={state.modal.data.prog_title}
                        disabled
                    />

                </div>
                <div className="mb-3">
                    <label htmlFor="" className="col-form-label">
                        Project
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        defaultValue={state.modal.data.proj_title}
                        disabled
                    />

                </div>
                <div className="mb-3">
                    <label htmlFor="" className="col-form-label">
                        Address
                    </label>
                    <textarea
                        type="text"
                        className="form-control"
                        defaultValue={state.modal.data.address}
                        disabled
                    />
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
                        disabled
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
                        disabled
                    />
                </div>
                <div className="gap-3 mt-3 d-flex align-items-center justify-content-end">
                    <Button variant="outlined" startIcon={<CloseIcon />} data-bs-dismiss="modal" onClick={() => closeModal()}>
                        Close
                    </Button>
                </div>
            </form>
        </>
    )
}
