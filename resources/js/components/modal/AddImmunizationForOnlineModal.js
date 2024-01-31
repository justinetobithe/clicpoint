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
import Select from "react-select"
import { getMonth, getYear } from 'date-fns';
import range from "lodash/range";
import dateFormat from 'dateformat';

const doseOptions = [
    { value: "1st Dose", label: "1st Dose" },
    { value: "2nd Dose", label: "2nd Dose" },
    { value: "3rd Dose", label: "3rd Dose" },
    { value: "4th Dose", label: "4th Dose" },
]

export default function AddImmunizationForOnlineModal() {

    const { state, dispatch } = useContext(AppContext)

    const [selectedDose, setSelectedDose] = useState();
    const [selectedChildren, setSelectedChildren] = useState();
    const [selectedVaccine, setSelectedVaccine] = useState();
    const [selectedParent, setSelectedParent] = useState(null);
    const [selectedChild, setSelectedChild] = useState(null);

    const { data, loading } = useFetch({
        url: "/api/users"
    })

    const childrens = useFetch({
        url: selectedParent != null ? `/api/childrens/${selectedParent.value}` : ""
    })

    const [dateVaccinated, setDateVaccinated] = useState(new Date());
    const years = range(1990, getYear(new Date()) + 1, 1);
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const vaccines = useFetch({
        url: "/api/vaccines"
    })

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", paylaod: loading })
    }, [loading])

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [response, httpRequest] = useHttpRequest(data => ({
        url: "/api/immunizations",
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
            if (response.data.status == true) {
                dispatch({
                    type: "INSERT_IMMUNIZATION",
                    payload: response.data.payload
                })
                closeModal();
            }
        }
    }, [response])

    const onSubmit = (data) => {
        if (selectedParent == null) {
            Swal.fire({
                title: "Please select a parent/patient",
                icon: "error",
                confirmButtonColor: "#3085d6"
            });
            return;
        } else if (selectedChild == null) {
            Swal.fire({
                title: "Please select a child",
                icon: "error",
                confirmButtonColor: "#3085d6"
            });
            return;
        } else if (selectedVaccine == null) {
            Swal.fire({
                title: "Vaccine cannot be blank!",
                icon: "error",
                confirmButtonColor: "#3085d6"
            })
        } else if (selectedDose == null) {
            Swal.fire({
                title: "Remarks cannot be blank!",
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
                    fd.append("parent_id", selectedParent.value);
                    fd.append("child_id", selectedChild.value);
                    fd.append("vaccine_id", selectedVaccine.value);
                    fd.append("remarks", selectedDose.value);
                    fd.append("date_vaccinated", dateFormat(dateVaccinated, "yyyy-mm-dd"));
                    fd.append("type", "Online");
                    httpRequest(fd);

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
            <form className="row g-3">
                <div className="col-md-6 mb-3">
                    <label className="col-form-label">
                        Parent
                    </label>
                    <Select
                        options={data
                            .filter(user => user.role === 1)
                            .map(user => ({
                                value: user.id,
                                label: user.name,
                            }))
                        }
                        defaultValue={selectedParent}
                        onChange={setSelectedParent}
                        isClearable
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="col-form-label">
                        Child
                    </label>
                    <Select
                        options={childrens.data.map(child => ({
                            value: child.id,
                            label: child.name,
                        }))}
                        defaultValue={selectedChild}
                        onChange={(selectedChild) => {
                            setSelectedChild(selectedChild);
                        }}
                        isClearable
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Date Vaccinated</label>
                    <DatePicker
                        renderCustomHeader={({
                            date,
                            changeYear,
                            changeMonth,
                            decreaseMonth,
                            increaseMonth,
                            prevMonthButtonDisabled,
                            nextMonthButtonDisabled,
                        }) => (
                            <div
                                style={{
                                    margin: 10,
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                                    {"<"}
                                </button>
                                <select
                                    value={getYear(date)}
                                    onChange={({ target: { value } }) => changeYear(value)}
                                >
                                    {years.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={months[getMonth(date)]}
                                    onChange={({ target: { value } }) =>
                                        changeMonth(months.indexOf(value))
                                    }
                                >
                                    {months.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>

                                <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                                    {">"}
                                </button>
                            </div>
                        )}
                        className="form-control"
                        dateFormat="MMMM d, yyyy"
                        selected={dateVaccinated}
                        onChange={(date) => setDateVaccinated(date)}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Vaccine</label>
                    <Select
                        options={
                            vaccines.data.map(vaccines => ({
                                value: vaccines.id,
                                label: vaccines.vaccine
                            }))
                        }
                        defaultValue={selectedVaccine}
                        onChange={setSelectedVaccine}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Remarks</label>
                    <Select
                        options={doseOptions}
                        defaultValue={selectedDose}
                        onChange={setSelectedDose}
                    />
                </div>
                <div className="col-12 gap-3 mt-3 d-flex align-items-center justify-content-end">
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
