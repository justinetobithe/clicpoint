import { createContext } from "react";

export const AppContext = createContext();

export const initialState = {
    loading: false,
    modal: {
        isShown: false,
        heading: "",
        onHide: () => { },
        data: {}
    },
    user: {},
    users: [],
    appointments: [],
    walkInsAppointments: [],
    appointmentTypes: [],
    programs: [],
    projects: [],
    patients: [],
    immunizations: [],
    vaccines: [],
    healthConditions: [],
    prescriptions: [],
    prescriptionMedications: [],
    childrens: [],
    doctors: [],
    diagnosis: [],
    outpatients: [],
};