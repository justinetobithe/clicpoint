import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Typography from '@mui/material/Typography';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { notify, TablePaginationActions } from "../../Elements"
import { AppContext } from '../../../store';
import { useFetch, useHttpRequest } from '../../../api';
import dateFormat from 'dateformat';
import { NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import UpdateStatusWalkInsAppointmentModal from '../../modal/UpdateStatusWalkInsAppointmentModal';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import PriorityQueueModal from '../../modal/PriorityQueueModal';

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default function WalkinsAppointment() {

    const { state, dispatch } = useContext(AppContext)
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredWalkIns.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const { data, loading } = useFetch({
        url: `/api/walk-ins-appointment/date?filterDate=${dateFormat(selectedDate, "yyyy-mm-dd")}`
    })

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: loading })
    }, [loading])

    useEffect(() => {
        dispatch({ type: "FETCH_WALK_IN_APPOINTMENT", payload: data })
    }, [data])



    const editWalkInAppointmentStatus = (data) => {
        dispatch({
            type: "TOGGLE_MODAL",
            payload: {
                isShown: true,
                heading: "Edit Walk-in Data",
                onHide: () => {
                    dispatch({
                        type: "TOGGLE_MODAL",
                        payload: {
                            isShown: false,
                            heading: "",
                            footer: "",
                            onHide: () => { }
                        }
                    })
                },
                data,
                children: <UpdateStatusWalkInsAppointmentModal />
            }
        })
    }

    const [deleteResponse, handleDeleteRequest] = useHttpRequest((data) => ({
        url: `/api/walk-ins-appointments/${data}`,
        method: "DELETE",
        data,
        header: { "Content-Type": "application/json" }
    }))

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: deleteResponse.loading })
        if (deleteResponse.error.length || deleteResponse.data !== null) {
            notify(
                deleteResponse.error.length ? deleteResponse.error : deleteResponse.data.message,
                deleteResponse.data.status ? "success" : "error"
            )
            if (deleteResponse.data.status) {
                dispatch({
                    type: "DELETE_WALK_IN_APPOINTMENT",
                    payload: deleteResponse.data.payload
                })
            }
        }
    }, [deleteResponse])

    const onDelete = (id) => {
        Swal.fire({
            title: 'Are you sure you want to delete this data?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#118ab2',
            cancelButtonColor: '#ef476f',
            confirmButtonText: 'Ok'
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteRequest(id)
            }
        })
    }

    const formatTime = (time) => {
        const timeParts = time.split(":");
        const hours = parseInt(timeParts[0], 10);
        const minutes = timeParts[1];
        const period = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

        return `${formattedHours}:${minutes} ${period}`;
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const [filteredWalkIns, setFilteredWalkIns] = useState([]);

    useEffect(() => {
        if (state.walkInsAppointments) {
            setFilteredWalkIns(state.walkInsAppointments.filter((walkIn) => {
                const { parent, child, reason } = walkIn;
                const searchValue = searchQuery.toLowerCase();

                return (
                    parent.toLowerCase().includes(searchValue) ||
                    child.toLowerCase().includes(searchValue) ||
                    reason.toLowerCase().includes(searchValue)
                );
            }))
        }
    }, [state])

    const handleDateChange = (date) => {
        setSelectedDate(date);

    };
   
    const priorityQueue = () => {
        let currState = [...filteredWalkIns];
        let arr1 = currState.filter(item => item.status == 2);
        let apptPriorities1 = currState.filter(item => !item.health_condition && !item.status); // Vaccination/Immunation
        let apptPriorities2 = currState.filter(item => item.health_condition && item.health_condition.condition === 3 && !item.status); // Severe
        let apptPriorities3 = currState.filter(item => item.health_condition && item.health_condition.condition === 2 && !item.status); // Moderate
        let apptPriorities4 = currState.filter(item => item.health_condition && item.health_condition.condition === 1 && !item.status); // Mild
        let arr = [
            ...arr1,
            ...apptPriorities1,
            ...apptPriorities2,
            ...apptPriorities3,
            ...apptPriorities4,
        ];
        setFilteredWalkIns(arr);
    }

    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">List of Walk-in</h1>
                <Paper
                    component="form"
                    className="d-block shadow-sm"
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search Patients"
                        inputProps={{ 'aria-label': 'search patients' }}
                        onChange={handleSearchChange}
                    />
                    <IconButton type="button" aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>
                <button className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" onClick={priorityQueue}>
                    <PriorityHighIcon /> Priority Queue
                </button>
                <NavLink to="/appointment/walk-ins/add" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                    <AddIcon /> Add
                </NavLink>
            </div>
            <div className="row mt-5">
                <div className="col-12">
                    <Box sx={{ width: '100%' }}>
                        <Paper sx={{ width: '100%', mb: 2 }}>
                            <TableContainer component={Paper}>
                                <Row className="align-items-center">
                                    <Col sm="12" md="6" lg="6">
                                        <Typography
                                            style={{ padding: "15px" }}
                                            variant="h6"
                                            id="tableTitle"
                                            component="div"
                                        >
                                            List of Walk-in
                                        </Typography>
                                    </Col>
                                    <Col sm="12" md="6" lg="6" className="d-flex justify-content-end align-items-center">
                                        <p className="mb-0">
                                            Date / Schedule
                                        </p>
                                        <DatePicker
                                            className="form-control w-50"
                                            style={{ padding: "15px", zIndex: 9999 }}
                                            selected={selectedDate}
                                            onChange={handleDateChange}
                                            maxDate={new Date()}
                                            placeholderText="Select a date"
                                            dateFormat="MMMM d, yyyy"
                                            todayButton="Today"
                                            popperPlacement="bottom"
                                            portalId="datepicker-portal"
                                        />
                                    </Col>
                                </Row>
                                <Table sx={{ minWidth: 500, borderTop: "1px solid rgba(224, 224, 224, 1)" }} aria-label="custom pagination table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No.</TableCell>
                                            <TableCell>Patient/Child</TableCell>
                                            <TableCell>Parent</TableCell>
                                            <TableCell>Schedule</TableCell>
                                            <TableCell>Time</TableCell>
                                            <TableCell>Purpose</TableCell>
                                            <TableCell>Reason</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredWalkIns.length > 0 ? (
                                            (rowsPerPage > 0
                                                ? filteredWalkIns.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                : filteredWalkIns
                                            ).map((row, index) => (
                                                <TableRow key={row.id}>
                                                    <TableCell component="th" scope="row">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.parent}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.child}
                                                    </TableCell>
                                                    <TableCell>
                                                        {dateFormat(row.schedule, "mmmm dd, yyyy")}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.start_time && row.end_time ? (
                                                            `${formatTime(row.start_time)} - ${formatTime(row.end_time)}`
                                                        ) : ''}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.appointment_type?.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.reason}
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            row.status == 1 ? (
                                                                <p className='mb-0 text-danger'>Cancel</p>
                                                            ) : row.status == 2 ? (
                                                                <p className='mb-0 text-success'>Done</p>
                                                            ) : ""
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            row.status == null && (
                                                                <>
                                                                    <Tooltip title="Edit">
                                                                        <IconButton aria-label="edit" color="secondary" onClick={() => editWalkInAppointmentStatus(row)}>
                                                                            <EditIcon />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    {
                                                                        state.user.role == 4 && (
                                                                            <Tooltip title="Delete">
                                                                                <IconButton aria-label="delete" color="error" onClick={() => onDelete(row.id)}>
                                                                                    <DeleteIcon />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        )
                                                                    }
                                                                </>
                                                            )
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={9} align="center">
                                                    <Typography variant="subtitle1">
                                                        No data found for the specified date.
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {emptyRows > 0 && (
                                            <TableRow style={{ height: 53 * emptyRows }}>
                                                <TableCell colSpan={9} />
                                            </TableRow>
                                        )}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                                colSpan={3}
                                                count={filteredWalkIns.length}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                SelectProps={{
                                                    inputProps: {
                                                        'aria-label': 'rows per page',
                                                    },
                                                    native: true,
                                                }}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                                ActionsComponent={TablePaginationActions}
                                            />
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Box>
                </div>
            </div>

        </>
    );
}
