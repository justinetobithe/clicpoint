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
import { notify, TablePaginationActions } from "../Elements"
import { AppContext } from '../../store';
import { useFetch, useHttpRequest } from '../../api';
import Swal from 'sweetalert2';
import AddVaccineModal from '../modal/AddVaccineModal';
import EditVaccineModal from '../modal/EditVaccineModal';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default function ListOfVaccines() {

    const { state, dispatch } = useContext(AppContext)

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filterName, setFilterName] = useState("")

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - state.vaccines.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const { data, loading } = useFetch({
        url: `/api/get-vaccines?filterName=${filterName}`
    })

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: loading })
    }, [loading])

    useEffect(() => {
        dispatch({ type: "FETCH_VACCINE", payload: data })
    }, [data])

    const handleVaccine = (e) => {
        setTimeout(() => {
            setFilterName(e.target.value)
        }, 1000)
    }

    const addVaccineModal = () => {
        dispatch({
            type: "TOGGLE_MODAL",
            payload: {
                isShown: true,
                heading: "Add Vaccine",
                onHide: () => {
                    dispatch({
                        isShown: false,
                        heading: "",
                        footer: "",
                        onHide: () => { }
                    })
                },
                children: <AddVaccineModal />
            }
        })
    }

    const [deleteResponse, handleDeleteRequest] = useHttpRequest((data) => ({
        url: `/api/vaccines/${data}`,
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
                    type: "DELETE_VACCINE",
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

    const editVaccineModal = (data) => {
        dispatch({
            type: "TOGGLE_MODAL",
            payload: {
                isShown: true,
                heading: "Edit Vaccine",
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
                children: <EditVaccineModal />
            }
        })
    }

    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">List of Vaccines</h1>
                <Paper
                    component="form"
                    className="d-block shadow-sm"
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search Vaccines"
                        inputProps={{ 'aria-label': 'search vaccines' }}
                        onChange={handleVaccine}
                    />
                    <IconButton type="button" aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>
                <button onClick={() => addVaccineModal()} className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                    <AddIcon /> Add Vaccine
                </button>
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
                                    List of Vaccines
                                </Typography>
                                <Table sx={{ minWidth: 500, borderTop: "1px solid rgba(224, 224, 224, 1)" }} aria-label="custom pagination table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No.</TableCell>
                                            <TableCell>Vaccine</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Remarks</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(rowsPerPage > 0
                                            ? state.vaccines.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : state.vaccines
                                        ).map((row, index) => (
                                            <TableRow key={index + 1}>
                                                <TableCell component="th" scope="row">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>{row.vaccine}</TableCell>
                                                <TableCell>{row.description}</TableCell>
                                                <TableCell>
                                                    {
                                                        !row.remarks ? null : JSON.parse(row.remarks).join(", ")
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title="Edit">
                                                        <IconButton aria-label="edit" color="secondary" onClick={() => editVaccineModal(row)}>
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
                                                count={state.vaccines.length}
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
