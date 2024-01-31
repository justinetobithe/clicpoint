import React, { useContext, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useFetch } from '../../api'
import { AppContext } from '../../store'
import ViewScheduleModal from '../modal/ViewScheduleModal'

const localizer = momentLocalizer(moment)

export default function ViewSchedule() {

    const { state, dispatch } = useContext(AppContext)

    const { data, loading } = useFetch({
        url: "/api/projects"
    })

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: loading })
    }, [loading])

    useEffect(() => {
        dispatch({ type: "FETCH_PROJECT", payload: data })
    }, [data])

    const viewScheduleModal = (row) => {
        dispatch({
            type: "TOGGLE_MODAL",
            payload: {
                isShown: true,
                heading: "View Schedule",
                onHide: () => {
                    dispatch({
                        isShow: false,
                        heading: "",
                        onHide: () => { }
                    })
                },
                data: row,
                children: <ViewScheduleModal />
            }
        })
    }

    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">View Schedule</h1>
            </div>
            <div className="row mt-5">
                <div className="col-12">
                    <Calendar
                        localizer={localizer}
                        events={
                            state.projects.map(row => ({
                                id: row.id,
                                title: <a className="text-white" onClick={() => viewScheduleModal(row)}>{row.prog_title}</a>,
                                start: new Date(row.date_started),
                                end: new Date(row.date_ended),
                            }))
                        }
                        style={{ height: 800 }}
                        defaultDate={new Date()}
                    />
                </div>
            </div>
        </>
    )
}
