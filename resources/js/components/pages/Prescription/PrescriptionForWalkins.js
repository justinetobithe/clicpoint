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
import AddWalkinsPrescriptionModal from '../../modal/AddWalkinsPrescriptionModal';
import { Link, useLocation } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default function PrescriptionForWalkins() {

    const { state, dispatch } = useContext(AppContext)
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortOrder, setSortOrder] = useState('asc');

    const location = useLocation();
    const walkins_id = new URLSearchParams(location.search).get('walkins_id');
    const parent = new URLSearchParams(location.search).get('parent');
    const child = new URLSearchParams(location.search).get('child');

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredPrescriptions.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const { data, loading } = useFetch({
        url: `/api/prescription/walkins`
    })

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: loading })
    }, [loading])

    useEffect(() => {
        dispatch({ type: "FETCH_PRESCRIPTION", payload: data })
    }, [data])

    const [deleteResponse, handleDeleteRequest] = useHttpRequest((data) => ({
        url: `/api/prescriptions/${data}`,
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
                    type: "DELETE_PRESCRIPTION",
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

    const addPrescriptUser = (data) => {
        dispatch({
            type: "TOGGLE_MODAL",
            payload: {
                isShown: true,
                size: "md",
                heading: "New Prescription",
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
                children: <AddWalkinsPrescriptionModal
                    walkins_id={walkins_id}
                    parent={parent}
                    child={child}
                />
            }
        })
    }

    const openPrescriptionInNewTab = (prescriptionId) => {
        const url = `/print/prescription/${prescriptionId}`;
        const win = window.open(url, '_blank');
        win.focus();
    };

    const filteredPrescriptions = state.prescriptions
        .filter((prescription) => prescription.parent_id === null && prescription.child_id === null)
        .filter((prescription) => {
            const parentName = (prescription.parent || '').toLowerCase();
            const childName = (prescription.child?.name || '').toLowerCase();
            const doctorName = (prescription.doctor?.user?.name || '').toLowerCase();
            const weight = (prescription.weight || '').toString().toLowerCase();
            const date = (prescription.created_at ? dateFormat(prescription.created_at, "mmmm d, yyyy") : '').toLowerCase();

            return (
                parentName.includes(searchTerm.toLowerCase()) ||
                childName.includes(searchTerm.toLowerCase()) ||
                doctorName.includes(searchTerm.toLowerCase()) ||
                weight.includes(searchTerm.toLowerCase()) ||
                date.includes(searchTerm.toLowerCase())
            );
        });

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = () => {
        const sortedPrescriptions = [...filteredPrescriptions].sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        dispatch({ type: "FETCH_PRESCRIPTION", payload: sortedPrescriptions });
    };


    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Prescriptions (Walk-ins)</h1>
                <Paper
                    component="form"
                    className="d-block shadow-sm"
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search prescript"
                        inputProps={{ 'aria-label': 'search prescript' }}
                        onChange={handleSearch}
                    />
                    <IconButton type="button" aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>
                {
                    state.user.role === 3 && (
                        <button onClick={() => addPrescriptUser()} className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
                            <AddIcon /> Add Prescription
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
                                            List of Prescription (Walk-ins)
                                        </Typography>
                                    </div>
                                    <div className="col-md-4 d-flex align-items-center justify-content-end">
                                        <Tooltip title="Sort by date">
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
                                            <TableCell>Patient / Child</TableCell>
                                            <TableCell>Doctor</TableCell>
                                            <TableCell>Weight</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(rowsPerPage > 0
                                            ? filteredPrescriptions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : filteredPrescriptions
                                        ).map((row, index) => (
                                            <TableRow key={row.id}>
                                                <TableCell component="th" scope="row">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>{row.parent}</TableCell>
                                                <TableCell>{row.child}</TableCell>
                                                <TableCell>{row.doctor?.user?.name}</TableCell>
                                                <TableCell>
                                                    {row.weight}
                                                </TableCell>
                                                <TableCell>
                                                    {dateFormat(row.created_at, "mmmm  d, yyyy")}
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title="Edit">
                                                        <IconButton
                                                            component={Link}
                                                            to={`/prescript/edit/${row.id}`}
                                                            aria-label="edit"
                                                            color="secondary"
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="View">
                                                        <IconButton
                                                            aria-label="view"
                                                            color="primary"
                                                            onClick={() => openPrescriptionInNewTab(row.id)}
                                                        >
                                                            <VisibilityIcon />
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
                                                count={filteredPrescriptions.length}
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
