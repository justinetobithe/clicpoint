import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../store';
import { useFetch } from '../../api';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
} from '@mui/material';
import { Button } from 'react-bootstrap';
import CloseIcon from '@mui/icons-material/Close';
import dateFormat from 'dateformat';
import PrintIcon from '@mui/icons-material/Print';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

export default function PrescriptionModal({ type }) {
    const { state, dispatch } = useContext(AppContext);
 

    const { data, loading } = useFetch({
        url: type === "Online"
            ? `/api/prescription/parent/${state.modal.data.parent_id}/child/${state.modal.data.id}/type/${type}`
            : type === "Walkins"
                ? `/api/prescription/parent/${state.modal.data.parent}/child/${state.modal.data.child}/type/${type}`
                : "",
    });

    useEffect(() => {
        dispatch({ type: 'TOGGLE_LOADING', payload: loading });
    }, [loading]);

    const closeModal = () => {
        dispatch({
            type: "TOGGLE_MODAL",
            payload: {
                isShown: false,
                heading: "",
                footer: "",
                onHide: () => { }
            }
        })
    }

    const openNewTab = (url) => {
        window.open(url, '_blank');
    }

    return (
        <>
            <Box p={2}>
                {data.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>No.</TableCell>
                                    <TableCell>Parent</TableCell>
                                    <TableCell>Child</TableCell>
                                    <TableCell>Doctor</TableCell>
                                    <TableCell>Weight</TableCell>
                                    <TableCell>Date created</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((row, index) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            {
                                                type === "Online"
                                                    ? row.user?.name
                                                    : type === "Walkins"
                                                        ? row.parent
                                                        : ""
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {
                                                type === "Online"
                                                    ? row.children?.name
                                                    : type === "Walkins"
                                                        ? row.child
                                                        : ""
                                            }
                                        </TableCell>
                                        <TableCell>{row.doctor?.user?.name}</TableCell>
                                        <TableCell>{row.weight}</TableCell>
                                        <TableCell>{dateFormat(row.schedule_at, "mmmm dd, yyyy")}</TableCell>
                                        <TableCell>
                                            <Tooltip title="Print">
                                                <IconButton aria-label="print" color="primary" onClick={() => openNewTab(`/print/prescription/${row.id}`)}>
                                                    <PrintIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography variant="body1">
                        No prescriptions found for this child.
                    </Typography>
                )}
            </Box>

            <div className="mt-3 d-flex align-items-center justify-content-end">
                <Button
                    className="d-flex align-items-center justify-content-center"
                    variant="danger"
                    data-bs-dismiss="modal"
                    onClick={() => closeModal()}
                >
                    <CloseIcon /> Close
                </Button>
            </div>

        </>
    );
}
