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
import UpdateAppointmentStatusModal from '../../modal/UpdateAppointmentStatusModal';
import dateFormat from 'dateformat';

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default function Schedule() {

    const { state, dispatch } = useContext(AppContext)

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - state.appointments.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const { data, loading } = useFetch({
        url: `/api/appointments`
    })

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: loading })
    }, [loading])

    useEffect(() => {
        dispatch({ type: "FETCH_APPOINTMENT", payload: data })
    }, [data])



    const editAppointmentStatus = (data) => {
        dispatch({
            type: "TOGGLE_MODAL",
            payload: {
                isShown: true,
                heading: "Appointment Approval",
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
                children: <UpdateAppointmentStatusModal />
            }
        })
    }

    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">List of Appoinment</h1>
            </div>
            <div className="row mt-5">
                <div className="col-12">
                    <Box sx={{ width: '100%' }}>
                        <Paper sx={{ width: '100%', mb: 2 }}>
                            <TableContainer component={Paper}>
                                <Typography
                                    style={{ padding: "15px" }}
                                    variant="h6"
                                    id="tableTitle"
                                    component="div"
                                >
                                    List of Appoinment
                                </Typography>
                                <Table sx={{ minWidth: 500, borderTop: "1px solid rgba(224, 224, 224, 1)" }} aria-label="custom pagination table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No.</TableCell>
                                            <TableCell>Patient / Child</TableCell>
                                            <TableCell>Parent</TableCell>
                                            <TableCell>Schedule</TableCell>
                                            <TableCell>Time</TableCell>
                                            <TableCell>Purpose</TableCell>
                                            <TableCell>Reason</TableCell>
                                            <TableCell>Remarks</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(rowsPerPage > 0
                                            ? state.appointments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : state.appointments
                                        ).map((row, index) => (
                                            <TableRow key={row.id}>
                                                <TableCell component="th" scope="row">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    {row.child?.name}
                                                </TableCell>
                                                <TableCell>
                                                    {row.user.name}
                                                </TableCell>
                                                <TableCell>
                                                    {dateFormat(row.schedule, "mmmm dd, yyyy")}
                                                </TableCell>
                                                <TableCell>
                                                    {row.time}
                                                </TableCell>
                                                <TableCell>
                                                    {row.appointment_type?.name}
                                                </TableCell>
                                                <TableCell>
                                                    {row.reason}
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        row.remarks == 0 ? "" :
                                                            row.remarks == 1 ? (
                                                                <p className='mb-0 text-red'>Cancelled</p>
                                                            ) : row.remarks == 2 ? (
                                                                <p className='mb-0 text-primary'>Catered</p>
                                                            ) : row.remarks == 3 ? (
                                                                <p className='mb-0 text-success'>Attended</p>
                                                            ) : ""
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        row.status == 1 ? (
                                                            <p className='mb-0 text-primary'>Pending</p>
                                                        ) : row.status == 2 ? (
                                                            <p className='mb-0 text-success'>Approved</p>
                                                        ) : row.status == 3 ? (
                                                            <p className='mb-0 text-danger'>Rejected</p>
                                                        ) : ""
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        row.status == 1 && (
                                                            <>
                                                                <Tooltip title="Edit">
                                                                    <IconButton aria-label="edit" color="secondary" onClick={() => editAppointmentStatus(row)}>
                                                                        <EditIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </>
                                                        )
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        {emptyRows > 0 && (
                                            <TableRow style={{ height: 53 * emptyRows }}>
                                                <TableCell colSpan={6} />
                                            </TableRow>
                                        )}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                                colSpan={3}
                                                count={state.appointments.length}
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
