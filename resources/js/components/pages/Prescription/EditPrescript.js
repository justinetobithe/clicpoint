import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form'
import { useHistory, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useFetch, useHttpRequest } from '../../../api'
import { AppContext } from '../../../store'
import { TablePaginationActions, notify } from '../../Elements'
import Select from "react-select"
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Typography from '@mui/material/Typography';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Paper from '@mui/material/Paper';
import AddMedicationModal from '../../modal/AddMedicationModal';
import EditMedicationModal from '../../modal/EditMedicationModal';

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default function EditPrescript() {

    let { id } = useParams();

    let history = useHistory();

    const { state, dispatch } = useContext(AppContext)

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(100);

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - state.prescriptionMedications.length) : 0;

    const { data, loading } = useFetch({
        url: `/api/prescriptions-medications/${id}`
    })

    // const prescriptionMedications = useFetch({
    //     url: `/api/prescriptions-medications/${data.id}`
    // })

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: loading })
    }, [loading])

    useEffect(() => {
        dispatch({ type: "FETCH_PRESCRIPTION_MEDICATION", payload: data })
    }, [data])
 
    const [deleteResponse, handleDeleteRequest] = useHttpRequest((id) => ({
        url: `/api/prescription-medications/${id}`,
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
                    type: "DELETE_PRESCRIPTION_MEDICATION",
                    payload: deleteResponse.data.payload
                })
            }
        }
    }, [deleteResponse])

    const handleDeleteMedication = (id) => {
        Swal.fire({
            title: 'Are you sure you want to delete this medication?',
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


    const addMedication = () => {
        dispatch({
            type: "TOGGLE_MODAL",
            payload: {
                isShown: true,
                size: "md",
                heading: "Add medication",
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
                children: <AddMedicationModal id={id} />
            }
        })
    };

    const editMedication = (data) => {
        dispatch({
            type: "TOGGLE_MODAL",
            payload: {
                isShown: true,
                size: "md",
                heading: "Add medication",
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
                children: <EditMedicationModal id={id} />
            }
        })
    };

    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Add Prescription Medication</h1>
                <button className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" onClick={addMedication}>
                    <AddIcon /> Add medication
                </button>
            </div>
            <div className="mt-5">
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
                                        Mecications
                                    </Typography>
                                    <Table sx={{ minWidth: 500, borderTop: "1px solid rgba(224, 224, 224, 1)" }} aria-label="custom pagination table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Details</TableCell>
                                                <TableCell>Taken</TableCell>
                                                <TableCell>Remarks</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {(rowsPerPage > 0
                                                ? state.prescriptionMedications.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                : state.prescriptionMedications
                                            ).map((row, index) => (
                                                <TableRow key={index + 1}>
                                                    <TableCell component="th" scope="row">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell>{row.details}</TableCell>
                                                    <TableCell>{row.taken}</TableCell>
                                                    <TableCell>{row.remarks}</TableCell>
                                                    <TableCell>
                                                        <Tooltip title="Edit">
                                                            <IconButton aria-label="edit" color="secondary" onClick={() => editMedication(row)}>
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete">
                                                            <IconButton aria-label="delete" color="error" onClick={() => handleDeleteMedication(row.id)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {emptyRows > 0 && (
                                                <TableRow style={{ height: 53 * emptyRows }}>
                                                    <TableCell colSpan={7} />
                                                </TableRow>
                                            )}
                                        </TableBody>


                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Box>
                    </div>
                </div>
            </div>
        </>
    )
}
