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
import EditChildModal from '../../modal/EditChildModal';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import DiagnosisModal from '../../modal/DiagnosisModal';
import PrescriptionModal from '../../modal/PrescriptionModal';
import MedicationIcon from '@mui/icons-material/Medication';

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default function ViewChildren() {

    const { state, dispatch } = useContext(AppContext)

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - state.childrens.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const { data, loading } = useFetch({
        url: `/api/childrens/${state.user.id}`
    })

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: loading })
    }, [loading])

    useEffect(() => {
        dispatch({ type: "FETCH_CHILDREN", payload: data })
    }, [data])



    const [deleteResponse, handleDeleteRequest] = useHttpRequest((data) => ({
        url: `/api/childrens/${data}`,
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
                    type: "DELETE_CHILDREN",
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

    const editChild = (data) => {
        dispatch({
            type: "TOGGLE_MODAL",
            payload: {
                isShown: true,
                heading: "Edit Child",
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
                children: <EditChildModal />
            }
        })
    }

    const openNewTab = (url) => {
        window.open(url, '_blank');
    }

    const openDiagnosis = (data, type) => {
        dispatch({
            type: "TOGGLE_MODAL",
            payload: {
                isShown: true,
                size: "lg",
                heading: "Diagnosis",
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
                children: <DiagnosisModal type={type} />
            }
        })
    }

    const openPrescription = (data, type) => {
        dispatch({
            type: "TOGGLE_MODAL",
            payload: {
                isShown: true,
                size: "lg",
                heading: "Prescription",
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
                children: <PrescriptionModal type={type} />
            }
        })
    }


    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">My Children</h1>
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
                                    My Children
                                </Typography>
                                <Table sx={{ minWidth: 500, borderTop: "1px solid rgba(224, 224, 224, 1)" }} aria-label="custom pagination table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No.</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Gender</TableCell>
                                            <TableCell>Date of Birth</TableCell>
                                            <TableCell>Birth place</TableCell>
                                            <TableCell>Relationship</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(rowsPerPage > 0
                                            ? state.childrens.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : state.childrens
                                        ).map((row, index) => (
                                            <TableRow key={row.id}>
                                                <TableCell component="th" scope="row">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    {row.name}
                                                </TableCell>
                                                <TableCell>
                                                    {row.gender}
                                                </TableCell>
                                                <TableCell>
                                                    {dateFormat(row.date_of_birth, "mmmm d, yyyy")}
                                                </TableCell>
                                                <TableCell>
                                                    {row.place_of_birth}
                                                </TableCell>
                                                <TableCell>
                                                    {row.relationship}
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title="Diagnosis">
                                                        {/* <IconButton onClick={() => openNewTab(`/print/diagnosis/online/${row.id}`)}> */}
                                                        <IconButton color="primary" onClick={() => openDiagnosis(row, "Online")}>
                                                            <NoteAltIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Prescription">
                                                        <IconButton color="success" onClick={() => openPrescription(row, "Online")}>
                                                            <MedicationIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Edit">
                                                        <IconButton aria-label="edit" color="secondary" onClick={() => editChild(row)}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {/* <Tooltip title="Delete">
                                                        <IconButton aria-label="delete" color="error" onClick={() => onDelete(row.id)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip> */}
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
                                                count={state.childrens.length}
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
