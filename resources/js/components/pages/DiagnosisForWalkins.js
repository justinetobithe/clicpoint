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
import AddWalkinsDiagnosisModal from '../modal/AddWalkinsDiagnosisModal';
import dateFormat from 'dateformat';
import { useLocation } from 'react-router-dom';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default function DiagnosisForWalkins() {

    const { state, dispatch } = useContext(AppContext)

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortedDiagnosis, setSortedDiagnosis] = useState([]);

    const location = useLocation();
    const walkins_id = new URLSearchParams(location.search).get('walkins_id');
    const parent = new URLSearchParams(location.search).get('parent');
    const child = new URLSearchParams(location.search).get('child');

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - sortedDiagnosis.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const { data, loading } = useFetch({
        url: "/api/diagnoses/walkins"
    })

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: loading })
    }, [loading])

    useEffect(() => {
        dispatch({ type: "FETCH_DIAGNOSIS", payload: data })
    }, [data])

    const handleSort = () => {
        const sortedDiagnosisData = [...state.diagnosis];

        sortedDiagnosisData.sort((a, b) => {
            const dateA = new Date(a.schedule).getTime();
            const dateB = new Date(b.schedule).getTime();

            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;

        });

        setSortedDiagnosis(sortedDiagnosisData);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    useEffect(() => {
        const sortedDiagnosisData = [...state.diagnosis];

        sortedDiagnosisData.sort((a, b) => {
            if (a.parent_id === null && a.child_id === null) {
                const dateA = new Date(a.schedule).getTime();
                const dateB = new Date(b.schedule).getTime();

                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            }

        });

        setSortedDiagnosis(sortedDiagnosisData);
    }, [state.diagnosis, sortOrder]);

    const addDiagnosis = () => {
        dispatch({
            type: "TOGGLE_MODAL",
            payload: {
                isShown: true,
                heading: "Add Diagnosis",
                onHide: () => {
                    dispatch({
                        isShown: false,
                        heading: "",
                        footer: "",
                        onHide: () => { }
                    })
                },
                children: <AddWalkinsDiagnosisModal
                    walkins_id={walkins_id}
                    parent={parent}
                    child={child}
                />
            }
        })
    }

    const [deleteResponse, handleDeleteRequest] = useHttpRequest((data) => ({
        url: `/api/diagnosis/${data}`,
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
                    type: "DELETE_DIAGNOSIS",
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

    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Diagnosis and Physician's Notes (For Walk-ins)</h1>
                {
                    (state.user.role === 3 || state.user.role === 4) && (
                        <button onClick={() => addDiagnosis()} className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                            <AddIcon /> Add Diagnosis
                        </button>
                    )
                }
            </div>
            <div className="row mt-5">
                <div className="col-12">
                    <Box sx={{ width: '100%' }}>
                        <Paper sx={{ width: '100%', mb: 2 }}>
                            <TableContainer component={Paper}>
                                <div className="row">
                                    <div className="col-md-8 d-flex align-items-center">
                                        <Typography
                                            style={{ padding: "15px" }}
                                            variant="h6"
                                            id="tableTitle"
                                            component="div"
                                        >
                                            List of Diagnosis
                                        </Typography>
                                    </div>
                                    <div className="col-md-4 d-flex align-items-center justify-content-end">
                                        <Tooltip title="Sort">
                                            <IconButton onClick={handleSort}>
                                                <SortByAlphaIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>
                                <Table sx={{ minWidth: 500, borderTop: "1px solid rgba(224, 224, 224, 1)" }} aria-label="custom pagination table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No.</TableCell>
                                            <TableCell>Parent</TableCell>
                                            <TableCell>Child</TableCell>
                                            <TableCell>Schedule</TableCell>
                                            <TableCell>Age</TableCell>
                                            <TableCell>Weight</TableCell>
                                            <TableCell>Height</TableCell>
                                            <TableCell>Notes</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(rowsPerPage > 0
                                            ? sortedDiagnosis.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : sortedDiagnosis
                                        ).map((row, index) => (
                                            <TableRow key={index + 1}>
                                                <TableCell component="th" scope="row">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>{row.parent}</TableCell>
                                                <TableCell>{row.child}</TableCell>
                                                <TableCell>{dateFormat(row.schedule, "mmmm d, yyyy")}</TableCell>
                                                <TableCell>{row.age}</TableCell>
                                                <TableCell>{row.weight}</TableCell>
                                                <TableCell>{row.height}</TableCell>
                                                <TableCell>{row.notes}</TableCell>
                                                <TableCell>
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
                                                count={sortedDiagnosis.length}
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
