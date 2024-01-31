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
import NoteAltIcon from '@mui/icons-material/NoteAlt';

export default function DiagnosisModal({ type }) {
    const { state, dispatch } = useContext(AppContext);
  
    const { data, loading } = useFetch({
        url: type === "Online"
            ? `/api/diagnoses/parent/${state.modal.data.parent_id}/child/${state.modal.data.id}/type/${type}`
            : type === "Walkins"
                ? `/api/diagnoses/parent/${state.modal.data.parent}/child/${state.modal.data.child}/type/${type}`
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

    const handlePrintDiagnosis = () => {
        if (type === "Walkins") {
            openNewTab(`/print/diagnosis/walkins/${state.modal.data.child}`)
        } else if (type === "Online") {
            openNewTab(`/print/diagnosis/online/${state.modal.data.id}`)
        }
    };


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
                                    <TableCell>Schedule</TableCell>
                                    <TableCell>Age</TableCell>
                                    <TableCell>Weight</TableCell>
                                    <TableCell>Health</TableCell>
                                    <TableCell>Notes</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((diagnosis, index) => (
                                    <TableRow key={diagnosis.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            {
                                                type === "Online"
                                                    ? diagnosis.user?.name
                                                    : type === "Walkins"
                                                        ? diagnosis.parent
                                                        : ""
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {
                                                type === "Online"
                                                    ? diagnosis.children?.name
                                                    : type === "Walkins"
                                                        ? diagnosis.child
                                                        : ""
                                            }
                                        </TableCell>
                                        <TableCell>{dateFormat(diagnosis.schedule_at, "mmmm dd, yyyy")}</TableCell>
                                        <TableCell>{diagnosis.age}</TableCell>
                                        <TableCell>{diagnosis.weight}</TableCell>
                                        <TableCell>{diagnosis.height}</TableCell>
                                        <TableCell>{diagnosis.notes}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography variant="body1">
                        No diagnosis found for this child.
                    </Typography>
                )}
            </Box>

            <div className="mt-3 d-flex align-items-center justify-content-between">
                {
                    data.length > 0 && (
                        <Button
                            className="d-flex align-items-center justify-content-center"
                            variant="primary"
                            onClick={handlePrintDiagnosis}
                        >
                            <NoteAltIcon /> Print
                        </Button>
                    )
                } 
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
