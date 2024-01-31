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
import Paper from '@mui/material/Paper';
import { TablePaginationActions } from "../Elements"
import { AppContext } from '../../store';
import { useFetch } from '../../api';
import dateFormat from "dateformat";
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import { IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import AppointmentHistoryModal from '../modal/AppointmentHistoryModal';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import AddRecordModal from '../modal/AddRecordModal';
import AppointmentWalkinsHistoryModal from '../modal/AppointmentWalkinsHistoryModal';
import DiagnosisModal from '../modal/DiagnosisModal';
import PrescriptionModal from '../modal/PrescriptionModal';
import MedicationIcon from '@mui/icons-material/Medication';

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default function Outpatient() {

    const { state, dispatch } = useContext(AppContext)
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredOutpatients.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const { data, loading } = useFetch({
        url: `/api/outpatients`
    })

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: loading })
    }, [loading])

    useEffect(() => {
        dispatch({ type: "FETCH_OUTPATIENT", payload: data })
    }, [data])

    const openNewTab = (url) => {
        window.open(url, '_blank');
    }

    const appointmentHistory = (data) => {
        dispatch({
            type: "TOGGLE_MODAL",
            payload: {
                isShown: true,
                size: "lg",
                heading: "History",
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
                children: <AppointmentWalkinsHistoryModal />
            }
        })
    }

    const filteredOutpatients = state.outpatients.filter((child) =>
        child.child.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.parent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dateFormat(child.date_of_birth, "mmmm dd, yyyy").toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.gender.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const addRecord = () => {
        dispatch({
            type: "TOGGLE_MODAL",
            payload: {
                isShown: true,
                size: "lg",
                heading: "Add Record",
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
                children: <AddRecordModal />
            }
        })
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
                <h1 className="h3 mb-0 text-gray-800">Outpatient</h1>
                <Paper
                    component="form"
                    className="d-block shadow-sm"
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search record"
                        inputProps={{ 'aria-label': 'search record' }}
                        onChange={handleSearch}
                    />
                    <IconButton type="button" aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>
                <button className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" onClick={addRecord}>
                    <AddIcon /> Add Record
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
                                    Outpatient
                                </Typography>
                                <Table sx={{ minWidth: 500, borderTop: "1px solid rgba(224, 224, 224, 1)" }} aria-label="custom pagination table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No.</TableCell>
                                            <TableCell>Name of Child</TableCell>
                                            <TableCell>Parent Name</TableCell>
                                            <TableCell>Date of Birth</TableCell>
                                            <TableCell>Gender</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(rowsPerPage > 0
                                            ? filteredOutpatients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : filteredOutpatients
                                        ).map((row, index) => (
                                            <TableRow key={row.id}>
                                                <TableCell component="th" scope="row">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>{row.child}</TableCell>
                                                <TableCell>{row.parent}</TableCell>
                                                <TableCell>
                                                    {dateFormat(row.date_of_birth, "mmmm dd, yyyy")}
                                                </TableCell>
                                                <TableCell>{row.gender}</TableCell>
                                                <TableCell>
                                                    <Tooltip title="Diagnosis">
                                                        {/* <IconButton onClick={() => openNewTab(`/print/diagnosis/walkins/${row.child}`)}> */}
                                                        <IconButton color="primary" onClick={() => openDiagnosis(row, "Walkins")}>
                                                            <NoteAltIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Prescription">
                                                        <IconButton color="secondary" onClick={() => openPrescription(row, "Walkins")}>
                                                            <MedicationIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="History">
                                                        <IconButton color="success" onClick={() => appointmentHistory(row)} >
                                                            <HistoryIcon />
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
                                                count={filteredOutpatients.length}
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
