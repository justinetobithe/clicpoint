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
import Swal from 'sweetalert2';
import dateFormat from "dateformat";
import BookAppointmentModal from '../../modal/BookAppointmentModal';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default function ViewPatient() {

    const { state, dispatch } = useContext(AppContext)
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredPatients.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const { data, loading } = useFetch({
        url: `/api/patients`
    })

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: loading })
    }, [loading])

    useEffect(() => {
        dispatch({ type: "FETCH_PATIENT", payload: data })
    }, [data])



    const [deleteResponse, handleDeleteRequest] = useHttpRequest((data) => ({
        url: `/api/users/${data}`,
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
                    type: "DELETE_IMMUNIZATION",
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

    const filteredPatients = state.patients.filter((patient) => {
        const name = patient.name ? patient.name.toLowerCase() : '';
        const email = patient.email ? patient.email.toLowerCase() : '';
        const gender = patient.gender ? patient.gender.toLowerCase() : '';
        const address = patient.address ? patient.address.toLowerCase() : '';
        const phoneNumber = patient.phone_number ? patient.phone_number.toLowerCase() : '';
        const medicalHistory = patient.medical_history ? patient.medical_history.toLowerCase() : '';

        return (
            name.includes(searchTerm.toLowerCase()) ||
            email.includes(searchTerm.toLowerCase()) ||
            gender.includes(searchTerm.toLowerCase()) ||
            address.includes(searchTerm.toLowerCase()) ||
            phoneNumber.includes(searchTerm.toLowerCase()) ||
            medicalHistory.includes(searchTerm.toLowerCase())
        );
    });


    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };


    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">List of Patients</h1>
                <Paper
                    component="form"
                    className="d-block shadow-sm"
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search patient"
                        inputProps={{ 'aria-label': 'search patient' }}
                        onChange={handleSearch}
                    />
                    <IconButton type="button" aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>
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
                                    List of Patients
                                </Typography>
                                <Table sx={{ minWidth: 500, borderTop: "1px solid rgba(224, 224, 224, 1)" }} aria-label="custom pagination table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No.</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Gender</TableCell>
                                            <TableCell>Address</TableCell>
                                            <TableCell>Phone No.</TableCell>
                                            <TableCell>Medical History</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(rowsPerPage > 0
                                            ? filteredPatients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : filteredPatients
                                        ).map((row, index) => (
                                            <TableRow key={row.id}>
                                                <TableCell component="th" scope="row">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    {row.name}
                                                </TableCell>
                                                <TableCell>
                                                    {row.email}
                                                </TableCell>
                                                <TableCell>
                                                    {row.gender}
                                                </TableCell>
                                                <TableCell>
                                                    {row.address}
                                                </TableCell>
                                                <TableCell>
                                                    {row.phone_number}
                                                </TableCell>
                                                <TableCell>
                                                    {row.medical_history}
                                                </TableCell>
                                                <TableCell>
                                                    {/* <Tooltip title="Edit">
                                                        <IconButton aria-label="edit" color="secondary" onClick={() => editPatientModal(row)}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip> */}
                                                    <Tooltip title="Delete">
                                                        <IconButton aria-label="delete" color="error" onClick={() => onDelete(row.id)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
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
                                                count={filteredPatients.length}
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
