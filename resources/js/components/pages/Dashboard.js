import React, { useContext, useEffect, useState } from 'react';
import { FaRegCalendarCheck, FaCalendarPlus } from 'react-icons/fa6';
import { IoCalendarOutline } from 'react-icons/io5';
import { ImUsers } from 'react-icons/im';
import { Typography, List, ListItem, ListItemIcon, ListItemText, ListItemAvatar, } from '@mui/material';
import { AppContext } from '../../store';
import { Container, Row, Col, Card, Table, Image } from 'react-bootstrap';
import { useFetch } from '../../api';
import dateFormat from "dateformat";
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend);

export default function Dashboard() {
    const { state, dispatch } = useContext(AppContext);

    const { data, loading } = useFetch({
        url: "/api/appointments"
    })

    const clinic = useFetch({
        url: "/api/clinic"
    })

    const getTodaysAppointmentCount = useFetch({
        url: "/api/appointment/today"
    })

    const getAppointmentRequestsCount = useFetch({
        url: "/api/appointment/requests"
    })

    const getTotalAppointmentsCount = useFetch({
        url: "/api/appointment/total"
    })

    const getTotalChildrensCount = useFetch({
        url: "/api/children/total"
    })


    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: loading })
    }, [loading])


    const [currentDateTime, setCurrentDateTime] = useState('');

    useEffect(() => {
        function updateDateTime() {
            const options = {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            };

            const now = new Date();
            const formattedDateTime = now.toLocaleString('en-US', options);

            setCurrentDateTime(formattedDateTime);
        }

        const intervalId = setInterval(updateDateTime, 1000);

        updateDateTime();

        return () => {
            clearInterval(intervalId);
        };
    }, []);



    const today = new Date();
    const todayDate = today.toISOString().split('T')[0];

    const appointmentsForToday = data
        .filter((appointment) => {
            const appointmentDate = new Date(appointment.schedule);

            return (
                appointmentDate.getFullYear() === today.getFullYear() &&
                appointmentDate.getMonth() === today.getMonth() &&
                appointmentDate.getDate() === today.getDate() &&
                appointment.status === 2
            );
        })
        .sort((a, b) => {
            const timeA = a.time.split(' - ')[0];
            const timeB = b.time.split(' - ')[0];

            return timeA.localeCompare(timeB);
        });

    const appointmentRequests = data.filter(appointment => appointment.status === 1);

    const patientAppointmentsToday = useFetch({
        url: `/api/appointment/user-appointments/${state.user.id}/today`
    })

    const getHealthConditionsAndImmunizations = useFetch({
        url: "/api/appointment/count-health-conditions-and-immunizations"
    })

    const getAppointmentsCountByMonth = useFetch({
        url: "/api/appointment/count-by-month"
    })


    //getHealthConditionsAndImmunizations.data
    const getRandomColor = () => `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`;

    const pieData = {
        labels: getHealthConditionsAndImmunizations.data.map(entry => entry.name),
        datasets: [
            {
                label: 'Health Conditions and Immunizations',
                data: getHealthConditionsAndImmunizations.data.map(entry => entry.count),
                backgroundColor: getHealthConditionsAndImmunizations.data.map(() => getRandomColor()),
                borderColor: getHealthConditionsAndImmunizations.data.map(() => getRandomColor().replace("0.2", "1")),
                borderWidth: 1,
            },
        ],
    };

    //getAppointmentsCountByMonth.data
    const barData = {
        labels: getAppointmentsCountByMonth.data.map(entry => entry.month),
        datasets: [
            {
                label: 'Appointments by Month',
                data: getAppointmentsCountByMonth.data.map(entry => entry.count),
                backgroundColor: getAppointmentsCountByMonth.data.map(() => getRandomColor().replace("0.2", "0.5")),
            },
        ],
    };


    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    return (
        <>
            <Row className="mb-4">
                <Col>
                    <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
                </Col>
            </Row>

            {
                state.user.role == 1 ? (
                    <>
                        <Row className="mt-5">
                            <Col sm={12} xl={12} md={12} lg={12}>
                                <Card className="shadow h-100 py-2">
                                    <Card.Body>
                                        <Card.Title>Clinic Information</Card.Title>
                                        <Row>
                                            <Col sm={4}>
                                                <ListItemAvatar>
                                                    <Image src="/img/logo.png" alt="Clinic Logo" width={250} />
                                                </ListItemAvatar>
                                            </Col>
                                            <Col sm={4}>
                                                <List>
                                                    <ListItem alignItems="flex-start">

                                                        <ListItemText>
                                                            <Typography variant="h6">
                                                                {clinic.data?.clinic_name}
                                                            </Typography>
                                                            <Typography>
                                                                <strong>Contact Number:</strong> {clinic.data?.contact_number}
                                                            </Typography>
                                                            <Typography>
                                                                <strong>Address:</strong> {clinic.data?.address}
                                                            </Typography>
                                                            <Typography>
                                                                <strong>Clinic Schedule:</strong> {clinic.data?.clinic_schedule}
                                                            </Typography>
                                                            <Typography>
                                                                <strong>Clinic Time:</strong> {clinic.data?.clinic_time}
                                                            </Typography>
                                                        </ListItemText>
                                                    </ListItem>
                                                </List>
                                            </Col>
                                            <Col sm={4}>
                                                <List>
                                                    <ListItem alignItems="flex-start">
                                                        <ListItemText>
                                                            <Typography>
                                                                <strong>Doctor Name:</strong> {clinic.data?.doctor_name}
                                                            </Typography>
                                                            <Typography>
                                                                <strong>Specialization:</strong> {clinic.data?.specialization}
                                                            </Typography>
                                                            <Typography className="mt-5">
                                                                If you want to use this system on your mobile device, you can download the mobile app by clicking
                                                                <a href="#">here</a>.
                                                            </Typography>
                                                        </ListItemText>
                                                    </ListItem>
                                                </List>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <Row className="mt-5">
                            <Col xl={7} md={7} lg={7}>
                                <Card className="shadow h-100 py-2">
                                    <Card.Body>
                                        <Card.Title>Appointments for today</Card.Title>
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Date</th>
                                                    <th>Time</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {patientAppointmentsToday.data.map(appointment => (
                                                    <tr key={appointment.id}>
                                                        <td>{appointment.user.name}</td>
                                                        <td>{dateFormat(appointment.schedule, "dddd, mmmm d")}</td>
                                                        <td>{appointment.time}</td>
                                                        <td>{appointment.status == 1 ? "Pending" : appointment.status == 2 ? "Approved" : appointment.status == 3 ? "Rejected" : ""}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </>
                ) :
                    (state.user.role == 2 || state.user.role == 3) ? (
                        <>
                            <Row className="mb-5">
                                <Col xl={4} md={4} mb={4}>
                                    <Card border="0" className="bg-transparent h-100 py-2">
                                        <Card.Body className="border-0 bg-transparent">
                                            <h1 className="text-black">Welcome,</h1>
                                            {
                                                state.user.role == 2 ? (
                                                    <h4 className="text-black">{state.user.name}</h4>
                                                ) : state.user.role == 3 ? (
                                                    <h4 className="text-black">Dr. {state.user.name}</h4>
                                                ) : ""
                                            }
                                            <p className="text-black">{currentDateTime}</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xl={4} md={4} mb={4}>
                                    {
                                        state.user.role == 2 ? (
                                            <img src="/img/secretary.png" className="img-fluid" alt="Secretary" width={350} />
                                        ) : state.user.role == 3 ? (
                                            <img src="/img/dashboard-doctors.webp" className="img-fluid" alt="Dashboard Doctors" width={150} />
                                        )
                                            : ""
                                    }


                                </Col>
                                <Col xl={4} md={4} mb={4}></Col>
                            </Row>
                            <Row>
                                <Col xl={3} md={3} mb={4}>
                                    <Card className="border-left-first shadow h-100 py-2 bg-baby-blue">
                                        <Card.Body>
                                            <div className="row no-gutters align-items-center">
                                                <Col mr={2}>
                                                    <div className="text-xs font-weight-bold text-uppercase mb-1 text-lg text-black">Today's Appointments</div>
                                                    <div className="h5 mb-0 font-weight-bold text-md text-black">{getTodaysAppointmentCount?.data}</div>
                                                </Col>
                                                <Col className="col-auto">
                                                    <FaRegCalendarCheck size={50} color="#000" />
                                                </Col>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xl={3} md={3} mb={4}>
                                    <Card className="border-left-second shadow h-100 py-2 bg-pale-yellow">
                                        <Card.Body>
                                            <div className="row no-gutters align-items-center">
                                                <Col mr={2}>
                                                    <div className="text-xs font-weight-bold text-uppercase mb-1 text-lg text-black">Appointment Requests</div>
                                                    <div className="h5 mb-0 font-weight-bold text-md text-black">{getAppointmentRequestsCount?.data}</div>
                                                </Col>
                                                <Col className="col-auto">
                                                    <FaCalendarPlus size={50} color="#000" />
                                                </Col>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xl={3} md={3} mb={4}>
                                    <Card className="border-left-third shadow h-100 py-2 bg-light-coral">
                                        <Card.Body>
                                            <div className="row no-gutters align-items-center">
                                                <Col mr={2}>
                                                    <div className="text-xs font-weight-bold text-uppercase mb-1 text-lg text-black">Total Appointments</div>
                                                    <div className="h5 mb-0 font-weight-bold text-md text-black">{getTotalAppointmentsCount?.data}</div>
                                                </Col>
                                                <Col className="col-auto">
                                                    <IoCalendarOutline size={50} color="#000" />
                                                </Col>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xl={3} md={3} mb={4}>
                                    <Card className="border-left-third shadow h-100 py-2 bg-pale-green">
                                        <Card.Body>
                                            <div className="row no-gutters align-items-center">
                                                <Col mr={2}>
                                                    <div className="text-xs font-weight-bold text-uppercase mb-1 text-lg text-black">Total Patients</div>
                                                    <div className="h5 mb-0 font-weight-bold text-md text-black">{getTotalChildrensCount?.data}</div>
                                                </Col>
                                                <Col className="col-auto">
                                                    <ImUsers size={50} color="#000" />
                                                </Col>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            <Row className="mt-5">
                                <Col xl={7} md={7} lg={7}>
                                    <Card className="shadow h-100 py-2">
                                        <Card.Body>
                                            <Card.Title>Appointments for today</Card.Title>
                                            <Table striped bordered hover>
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Date</th>
                                                        <th>Time</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {appointmentsForToday && appointmentsForToday?.map(appointment => (
                                                        <tr key={appointment.id}>
                                                            <td>{appointment.child.name}</td>
                                                            <td>{dateFormat(appointment.schedule, "dddd, mmmm d")}</td>
                                                            <td>{appointment.time}</td>
                                                            <td>{appointment.status === 2 ? "Approved" : ""}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>

                                            </Table>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xl={5} md={5} lg={5}>
                                    <Card className="shadow h-100 py-2">
                                        <Card.Body>
                                            <Card.Title>Appointment Requests</Card.Title>
                                            <Table striped bordered hover>
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Date</th>
                                                        <th>Time</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {appointmentRequests.map(request => (
                                                        <tr key={request.id}>
                                                            <td>{request.user.name}</td>
                                                            <td>{request.schedule}</td>
                                                            <td>{request.time}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </>
                    ) : ""
            }

            {
                state.user.role != 1 && (
                    <Row className="mt-5">
                        <Col xs={12} md={6} lg={6} xl={6}>
                            <Pie data={pieData} />
                        </Col>
                        <Col xs={12} md={6} lg={6} xl={6}>
                            <Bar data={barData} options={options} />
                        </Col>
                    </Row>
                )
            }
        </>
    )
}
