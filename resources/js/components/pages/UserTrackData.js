import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useFetch } from '../../api';
import { AppContext } from '../../store';
import dateFormat from 'dateformat';
import Form from 'react-bootstrap/Form';

export default function UserTrackData() {


    const { state, dispatch } = useContext(AppContext)

    let { id } = useParams();
  
    const { data, loading } = useFetch({
        url: "/api/patient/" + id
    })

    const immunizationData = useFetch({
        url: "/api/immunizations/" + data.id
    })

    const vaccines = useFetch({
        url: "/api/vaccines"
    })

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: loading })
    }, [loading])


    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Patient Record</h1>
            </div>
            <div className="row mt-5">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title font-weight-bold">{data.name + " (Child)"}</h5>
                            <form>
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Gender</label>
                                    <div className="col-sm-4">
                                        <input type="text" readOnly className="form-control-plaintext" defaultValue={data.gender} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Date of Birth</label>
                                    <div className="col-sm-4">
                                        <input type="text" readOnly className="form-control-plaintext" defaultValue={dateFormat(data.date_of_birth, "mmmm dd, yyyy")} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Place of Birth</label>
                                    <div className="col-sm-4">
                                        <input type="text" readOnly className="form-control-plaintext" defaultValue={data.place_of_birth} />
                                    </div>
                                </div>
                            </form>
                            <div className="col-12 p-0 mt-5">
                                <h5>Vaccinations</h5>
                                <form className="mt-3">
                                    {
                                        vaccines.data.map(vaccines => (
                                            <div className="form-check mb-3 p-0" key={vaccines.id}>
                                                <Form.Check
                                                    id={vaccines.id}
                                                    label={vaccines.vaccine}
                                                    checked={immunizationData.data.find(item => item.vaccine == vaccines.vaccine)}
                                                    disabled
                                                />
                                            </div>
                                        ))
                                    }

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
