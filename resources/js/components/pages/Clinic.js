import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../store';
import { useFetch } from '../../api';
import { Image } from 'react-bootstrap';

export default function Clinic() {
    const { state, dispatch } = useContext(AppContext);

    const { data, loading } = useFetch({
        url: "/api/clinic"
    });

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: loading });
    }, [loading]);

    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Clinic</h1>
            </div>

            <div className="row mt-5">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <form className="p-5" >
                                <div className="mb-3 row">
                                    <Image src="/img/logo.png" width={250} />
                                </div>
                                <div className="mb-3 row">
                                    <label className="col-sm-2 col-form-label">Clinic Name</label>
                                    <div className="col-sm-8">
                                        <input type="text" readOnly className="form-control" defaultValue={data.clinic_name} />
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label className="col-sm-2 col-form-label">Doctor Name</label>
                                    <div className="col-sm-8">
                                        <input type="text" readOnly className="form-control" defaultValue={data.doctor_name} />
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label className="col-sm-2 col-form-label">Specialization</label>
                                    <div className="col-sm-8">
                                        <input type="text" readOnly className="form-control" defaultValue={data.specialization} />
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label className="col-sm-2 col-form-label">Contact Number</label>
                                    <div className="col-sm-8">
                                        <input type="text" readOnly className="form-control" defaultValue={data.contact_number} />
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label className="col-sm-2 col-form-label">Address</label>
                                    <div className="col-sm-8">
                                        <input type="text" readOnly className="form-control" defaultValue={data.address} />
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label className="col-sm-2 col-form-label">Clinic Schedule</label>
                                    <div className="col-sm-8">
                                        <input type="text" readOnly className="form-control" defaultValue={data.clinic_schedule} />
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label className="col-sm-2 col-form-label">Clinic Time</label>
                                    <div className="col-sm-8">
                                        <input type="text" readOnly className="form-control" defaultValue={data.clinic_time} />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
