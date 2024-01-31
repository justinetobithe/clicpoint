import React, { useState, useContext, useEffect } from 'react'
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { useFetch } from '../../../api'
import { AppContext } from '../../../store'
import dateFormat from 'dateformat'
import UpdateAppointmentStatusModal from '../../modal/UpdateAppointmentStatusModal'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import UpdateAppointmentRemarksModal from '../../modal/UpdateAppointmentRemarksModal'
import PriorityQueueModal from '../../modal/PriorityQueueModal'
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import TodayScheduleModal from '../../modal/TodayScheduleModal'

const localizer = momentLocalizer(moment)

export default function Calendar() {

    const { state, dispatch } = useContext(AppContext)
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showLegendModal, setShowLegendModal] = useState(true);


    const { data, loading } = useFetch({
        url: "/api/appointments"
    })

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: loading })
    }, [loading])

    useEffect(() => {
        dispatch({ type: "FETCH_APPOINTMENT", payload: data })
    }, [data])

    const filteredAppointments = state.appointments.filter((row) => row.status === 2);

    const events = filteredAppointments.map((row) => {
        const [startTime, endTime] = row.time.split(' - ');
        const startDateTime = moment(`${dateFormat(row.schedule, 'yyyy-mm-dd')} ${startTime}`, 'YYYY-MM-DD hh:mm A').toDate();
        const endDateTime = moment(`${dateFormat(row.schedule, 'yyyy-mm-dd')} ${endTime}`, 'YYYY-MM-DD hh:mm A').toDate();
        let title = `${row.child?.name} ${row.time} `;
        let remarksText = '';

        if (row.remarks === 1) {
            title = `${title} (Cancelled)`;
            remarksText = 'Cancelled';
        } else if (row.remarks === 2) {
            title = `${title} (Catered)`;
            remarksText = 'Catered';
        } else if (row.remarks === 3) {
            title = `${title} (Not attended)`;
            remarksText = 'Not attended';
        }

        const remarksColor = getEventColor(row.remarks);

        if (row.status === 1 || row.status === 2) {
            return {
                id: row.id,
                title,
                start: startDateTime,
                end: endDateTime,
                status: row.status,
                eventBackgroundColor: remarksColor,
                tooltip: remarksText,
            };
        }

        return null;
    }).filter(event => event !== null);


    function getEventColor(remarks) {
        switch (remarks) {
            case 1:
                return '#D32934';
            case 2:
                return '#2A8B2B';
            case 3:
                return '#FFC008';
            default:
                return '#3174ad';
        }
    }


    const messages = {
        agenda: 'List'
    };

    const handleEventClicked = (event) => {
        const selectedAppointment = state.appointments.find((appointment) => appointment.id === event.id);
        dispatch({
            type: 'TOGGLE_MODAL',
            payload: {
                isShown: true,
                heading: 'Appointment Details',
                size: 'md',
                onHide: () => {
                    setSelectedAppointment(null);
                    dispatch({
                        isShown: false,
                        heading: '',
                        footer: '',
                        onHide: () => { },
                    });
                },
                children: <UpdateAppointmentRemarksModal appointment={selectedAppointment} />,
            },
        });
    };

    // const priorityQueue = () => {
    //     dispatch({
    //         type: "TOGGLE_MODAL",
    //         payload: {
    //             isShown: true,
    //             size: "lg",
    //             heading: "Priority Queue",
    //             onHide: () => {
    //                 dispatch({
    //                     isShown: false,
    //                     heading: "",
    //                     footer: "",
    //                     onHide: () => { }
    //                 })
    //             },
    //             children: <PriorityQueueModal />
    //         }
    //     })
    // }

    const showTodaySchedules = () => {
        dispatch({
            type: "TOGGLE_MODAL",
            payload: {
                isShown: true,
                size: "lg",
                heading: "Today Schedule",
                onHide: () => {
                    dispatch({
                        isShown: false,
                        heading: "",
                        footer: "",
                        onHide: () => { }
                    })
                },
                children: <TodayScheduleModal />
            }
        })
    };

    const showLegend = () => {
        setShowLegendModal(true);
    };

    const hideLegend = () => {
        setShowLegendModal(false);
    };

    const legendModal = (
        <Modal
            open={showLegendModal}
            onClose={hideLegend}
            aria-labelledby="legend-modal-title"
            aria-describedby="legend-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" id="legend-modal-title" component="h2">
                    Remarks Legend
                </Typography>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <FiberManualRecordIcon style={{ color: '#D32934' }} />
                        </ListItemIcon>
                        <ListItemText primary="Cancelled" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <FiberManualRecordIcon style={{ color: '#2A8B2B' }} />
                        </ListItemIcon>
                        <ListItemText primary="Catered" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <FiberManualRecordIcon style={{ color: '#FFC008' }} />
                        </ListItemIcon>
                        <ListItemText primary="Not attended" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <FiberManualRecordIcon style={{ color: '#3174ad' }} />
                        </ListItemIcon>
                        <ListItemText primary="Default" />
                    </ListItem>
                </List>
            </Box>
        </Modal>
    );


    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Calendar</h1>
                <button className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" onClick={showTodaySchedules}>
                    Show Today's Schedules
                </button>
                {/* <button className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" onClick={priorityQueue}>
                    <PriorityHighIcon /> Priority Queue
                </button> */}

            </div>
            <div className="row mt-3">
                <div className="col-12">
                    <BigCalendar
                        localizer={localizer}
                        events={events}
                        messages={messages}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 700 }}
                        onSelectEvent={handleEventClicked}
                        eventPropGetter={(event, start, end, isSelected) => ({
                            style: {
                                backgroundColor: event.eventBackgroundColor,
                            },
                        })}
                    />
                </div>
            </div>
            {legendModal}
        </>
    )
}
