import React, { useEffect, useState, useContext } from 'react'
import Select from 'react-select';
import { useFetch } from '../../api'
import { AppContext } from '../../store'
import dateFormat from 'dateformat';
import Swal from 'sweetalert2';

const optionTypes = [
    { value: 1, label: "Online" },
    { value: 2, label: "Walk-ins" }
];

export default function AdminTrackData() {

    const { state, dispatch } = useContext(AppContext)

    const [selectedChild, setSelectedChild] = useState();
    const [selectedType, setSelectedType] = useState();

    const { data, loading } = useFetch({
        url: selectedType != null ? selectedType.value === 1 ? "/api/childrens" : selectedType.value === 2 ? "/api/all-childrens" : "" : ""
    })

    const immunizationData = useFetch({
        url: selectedChild != null && selectedType != null ? selectedType.value === 1 ?
            `/api/immunizations/${selectedChild.value}` :
            `/api/immunization/child/${selectedChild.value}` : ""
    });

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: loading })
    }, [loading])

    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Track Patient Record</h1>
            </div>
            <div className="row mt-5">
                <div className="col-12 p-0">
                    <form>
                        <div className="mb-3 col-md-4">
                            <label className="form-label">Type</label>
                            <Select
                                options={optionTypes}
                                isClearable
                                placeholder="Select Type"
                                defaultValue={selectedType}
                                onChange={setSelectedType}
                            />
                        </div>
                        <div className="mb-3 col-md-4">
                            <label className="form-label">Child's Name</label>
                            <Select
                                options={
                                    data.map(child => ({
                                        value: selectedType != null ? selectedType.value === 1 ? child.id : selectedType.value === 2 ? child.child : "" : "",
                                        label: selectedType != null ? selectedType.value === 1 ? child.name : selectedType.value === 2 ? child.child : "" : ""
                                    }))
                                }
                                isClearable
                                defaultValue={selectedChild}
                                onChange={setSelectedChild}
                            />
                        </div>
                    </form>
                    {
                        selectedChild != null ?
                            immunizationData.data.length === undefined || immunizationData.data.length == 0 ?
                                (
                                    <div className="card mt-5">
                                        <div className="card-header">
                                            <h5 className="card-title mb-0">Message</h5>
                                        </div>
                                        <div className="card-body">
                                            <p className="card-text">Patient data is not found</p>
                                        </div>
                                    </div>

                                )
                                : (
                                    <div className="card mt-5">
                                        <div className="card-header">
                                            <h5 className="mb-0">Vaccinations</h5>
                                        </div>
                                        <div className="card-body">
                                            {
                                                immunizationData.data.map((immunization, index) => ((
                                                    <ul className="list-group list-group-flush p-0 mb-3" key={index + 1}>
                                                        <h5 className="card-title font-weight-bold">Vaccine: {immunization.vaccine?.vaccine}</h5>
                                                        <li className="list-group-item p-0 border-0 mb-2">Remarks: {immunization.remarks}</li>
                                                        <li className="list-group-item p-0 border-0 mb-2">Date Vaccinated: {dateFormat(immunization.date_vaccinated, "mmmm dd, yyyy")}</li>
                                                    </ul>
                                                )))
                                            }
                                        </div>
                                    </div>
                                )
                            : ""
                    }
                </div>
            </div>
        </>
    )
}
