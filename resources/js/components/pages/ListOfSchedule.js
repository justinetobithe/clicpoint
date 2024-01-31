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
import Paper from '@mui/material/Paper';
import { notify, TablePaginationActions } from "../Elements"
import { AppContext } from '../../store';
import { useFetch, useHttpRequest } from '../../api';
import AddScheduleModal from '../modal/AddScheduleModal';
import Swal from 'sweetalert2';
import dateFormat from "dateformat";
import EditScheduleModal from '../modal/EditScheduleModal';
import { FormControl, FormLabel, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Select from 'react-select';


TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default function ListOfSchedule() {

    const { state, dispatch } = useContext(AppContext)

    const [selectedProgram, setSelectedProgram] = useState()

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterName, setFilterName] = useState("")

    const handleSearch = (e) => {
        setTimeout(() => {
            setFilterName(e.target.value)
        }, 1000)
    }

    const program = useFetch({
        url: "/api/programs"
    })

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - state.programs.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const { data, loading } = useFetch({
        url: `/api/get-projects?filterName=${filterName}&filterProgram=${selectedProgram != null ? selectedProgram.value : ""}`
    })

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: loading })
    }, [loading])

    useEffect(() => {
        dispatch({ type: "FETCH_PROGRAM", payload: data })
    }, [data])

    const addScheduleModal = () => {
        dispatch({
            type: "TOGGLE_MODAL",
            payload: {
                isShown: true,
                heading: "Add Schedule",
                onHide: () => {
                    dispatch({
                        isShown: false,
                        heading: "",
                        footer: "",
                        onHide: () => { }
                    })
                },
                children: <AddScheduleModal />
            }
        })
    }

    const [deleteResponse, handleDeleteRequest] = useHttpRequest((data) => ({
        url: `/api/programs/${data}`,
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
                    type: "DELETE_PROGRAM",
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

    const editScheduleModal = (data) => {
        dispatch({
            type: "TOGGLE_MODAL",
            payload: {
                isShown: true,
                heading: "Edit Schedule",
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
                children: <EditScheduleModal />
            }
        })
    }

    return (
        <>
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">List of Schedules</h1>
                <Paper
                    component="form"
                    className="d-block shadow-sm"
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search Project"
                        inputProps={{ 'aria-label': 'search project' }}
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
                            <FormControl sx={{ m: 2 }} className="w-25">
                                <FormLabel component="legend">Program</FormLabel>
                                <Select
                                    options={program.data.map(program => ({
                                        value: program.id,
                                        label: program.prog_title
                                    }))}
                                    width={"auto"}
                                    defaultValue={selectedProgram}
                                    onChange={setSelectedProgram}
                                    isClearable
                                />
                            </FormControl>
                            <TableContainer component={Paper}>
                                <Typography
                                    style={{ padding: "15px" }}
                                    variant="h6"
                                    id="tableTitle"
                                    component="div"
                                >
                                    List of Schedules
                                </Typography>
                                <Table sx={{ minWidth: 500, borderTop: "1px solid rgba(224, 224, 224, 1)" }} aria-label="custom pagination table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No.</TableCell>
                                            <TableCell>Program</TableCell>
                                            <TableCell>Project</TableCell>
                                            <TableCell>Schedule</TableCell>
                                            <TableCell>Address/Location</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(rowsPerPage > 0
                                            ? state.programs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : state.programs
                                        ).map((row, index) => (
                                            <TableRow key={row.id}>
                                                <TableCell component="th" scope="row">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>{row.prog_title}</TableCell>
                                                <TableCell>{row.proj_title}</TableCell>
                                                <TableCell>
                                                    {
                                                        dateFormat(row.date_started, "dddd, mmmm d") == dateFormat(row.date_ended, "dddd, mmmm d") ? dateFormat(row.date_started, "dddd, mmmm d, yyyy h:MMTT") + " to " + dateFormat(row.date_ended, "h:MMTT") :
                                                            dateFormat(row.date_started, "dddd, mmmm d, yyyy h:MMTT") + " to " + dateFormat(row.date_ended, "dddd, mmmm d, yyyy h:MMTT")
                                                    }
                                                </TableCell>
                                                <TableCell>{row.address}</TableCell>
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
                                                count={state.programs.length}
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
