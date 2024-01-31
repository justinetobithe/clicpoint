import React, { useEffect, useState, useContext } from 'react'
import Select from 'react-select';
import { useFetch } from '../../api'
import { AppContext } from '../../store'
import Accordion from 'react-bootstrap/Accordion';


// import 'bootstrap/dist/css/bootstrap.min.css';

export default function Report() {

    const { state, dispatch } = useContext(AppContext)

    const [selectedProgram, setSelectedProgram] = useState();

    const { data, loading } = useFetch({
        url: "/api/get-program-and-project"
    })


    // const projects = useFetch({
    //     url: `/api/projects/`
    // })


    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: loading })
    }, [loading])



    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Report</h1>
            </div>
            <div className="row mt-5">
                <div className="col-12">

                    <Accordion defaultActiveKey="0">
                        {
                            data.length ? (
                                data.map((program, index) => (
                                    <>
                                        <Accordion.Item id={program.id} onChange={selectedProgram} eventKey={index + 1} key={index + 1}>
                                            <Accordion.Header key={index + 1}>{program.prog_title + " (" + program.immunization_count + ")"}</Accordion.Header>
                                            <Accordion.Body>
                                                <ul className="list-group border-0 p-0">
                                                    {
                                                        program.projects.map((projects, index) => (
                                                            <li className="list-group-item border-0 p-0 mb-2" key={index + 1}>{"- " + projects.proj_title + " (" + projects.immunization.length + ")"}</li>
                                                        ))
                                                    }
                                                </ul>
                                            </Accordion.Body>

                                        </Accordion.Item>
                                    </>
                                ))
                            ) : "No data found."
                        }


                        {/* <Accordion.Item eventKey="1">
                            <Accordion.Header>Accordion Item #2</Accordion.Header>
                            <Accordion.Body>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                aliquip ex ea commodo consequat. Duis aute irure dolor in
                                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                culpa qui officia deserunt mollit anim id est laborum.
                            </Accordion.Body>
                        </Accordion.Item> */}
                    </Accordion>


                    {/* <form>
                        <div className="mb-3 col-md-4">
                            <label className="form-label">Search Address</label>
                            <Select
                                options={
                                    data.map(programs => ({
                                        value: programs.id,
                                        label: programs.address,
                                    }))
                                }
                                isClearable
                                placeholder="Select Program"
                                defaultValue={selectedProgram}
                                onChange={setSelectedProgram}
                            />
                        </div>
                    </form> */}
                    {/* <div className="card mt-5">
                        <div className="card-header">
                            Program
                        </div>
                        <div className="card-body">
                            <ul className="list-group">
                                {
                                    programData.data.map((program, index) => (
                                        <li className="list-group-item d-flex justify-content-between align-items-center border-0 p-0" key={index + 1}>
                                            {program.address + ", " + program.city}
                                            <span className="badge badge-primary badge-pill">{program.count}</span>
                                        </li>
                                    ))
                                }

                            </ul>
                        </div>
                        <div className="card-footer">
                            <li className="list-group-item d-flex justify-content-between align-items-center border-0 p-0">
                                Total
                                <span className="badge badge-primary badge-pill"></span>
                            </li>
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    )
}
