export default function (state, { type, payload }) {
    switch (type) {
        case "TOGGLE_LOADING":
            return {
                ...state,
                loading: payload
            }

        case "TOGGLE_MODAL":
            return {
                ...state,
                modal: payload
            }
        case "AUTHENTICATION":
            return {
                ...state,
                user: payload
            }

        case "FETCH_USER":
            return {
                ...state,
                users: payload
            }

        case "DELETE_USER":
            return {
                ...state,
                users: state.users.filter(item => item.id != payload.id)
            }

        case "FETCH_DOCTOR":
            return {
                ...state,
                doctors: payload
            }

        case "DELETE_DOCTOR":
            return {
                ...state,
                doctors: state.doctors.filter(item => item.id != payload.id)
            }

        // Appoitnment
        case "FETCH_APPOINTMENT":
            return {
                ...state,
                appointments: payload
            }
        case "INSERT_APPOINTMENT":
            return {
                ...state,
                appointments: [payload, ...state.appointments]
            }

        case "UPDATE_APPOINTMENT":
            let appointments = state.appointments;
            let appointmentIndex = appointments.findIndex(
                (appointment) => appointment.id == payload.id
            )
            appointments[appointmentIndex] = payload;
            return {
                ...state,
                appointments: appointments
            }
        case "DELETE_APPOINTMENT":
            return {
                ...state,
                appointments: state.appointments.filter(item => item.id != payload.id)
            }

        case "FETCH_WALK_IN_APPOINTMENT":
            return {
                ...state,
                walkInsAppointments: payload
            }
        case "INSERT_WALK_IN_APPOINTMENT":
            return {
                ...state,
                walkInsAppointments: [payload, ...state.walkInsAppointments]
            }

        case "UPDATE_WALK_IN_APPOINTMENT":
            let walkInsAppointments = state.walkInsAppointments;
            let walkInsAppointmentIndex = walkInsAppointments.findIndex(
                (walkInsAppointment) => walkInsAppointment.id == payload.id
            )
            walkInsAppointments[walkInsAppointmentIndex] = payload;
            return {
                ...state,
                walkInsAppointments: walkInsAppointments
            }
        case "DELETE_WALK_IN_APPOINTMENT":
            return {
                ...state,
                walkInsAppointments: state.walkInsAppointments.filter(item => item.id != payload.id)
            }

        // Appoitnment Types
        case "FETCH_APPOINTMENT_TYPE":
            return {
                ...state,
                appointmentTypes: payload
            }
        case "INSERT_APPOINTMENT_TYPE":
            return {
                ...state,
                appointmentTypes: [payload, ...state.appointmentTypes]
            }

        case "UPDATE_APPOINTMENT_TYPE":
            let appointmentTypes = state.appointmentTypes;
            let appointmentTypeIndex = appointmentTypes.findIndex(
                (appointmentType) => appointmentType.id == payload.id
            )
            appointmentTypes[appointmentTypeIndex] = payload;
            return {
                ...state,
                appointmentTypes: appointmentTypes
            }
        case "DELETE_APPOINTMENT_TYPE":
            return {
                ...state,
                appointmentTypes: state.appointmentTypes.filter(item => item.id != payload.id)
            }

        // Project
        case "FETCH_PROJECT":
            return {
                ...state,
                projects: payload
            }
        case "INSERT_PROJECT":
            return {
                ...state,
                projects: [payload, ...state.projects]
            }
        case "UPDATE_PROJECT":
            let projects = state.projects;
            let projectIndex = projects.findIndex(
                (project) => project.id == payload.id
            )
            projects[projectIndex] = payload;
            return {
                ...state,
                projects: projects
            }
        case "DELETE_PROJECT":
            return {
                ...state,
                projects: state.projects.filter(item => item.id != payload.id)
            }

        // Outpatient
        case "FETCH_OUTPATIENT":
            return {
                ...state,
                outpatients: payload
            }
        case "INSERT_OUTPATIENT":
            return {
                ...state,
                outpatients: [payload, ...state.outpatients]
            }
        case "UPDATE_OUTPATIENT":
            let outpatients = state.outpatients;
            let outpatientIndex = outpatients.findIndex(
                (outpatient) => outpatient.id == payload.id
            )
            outpatients[outpatientIndex] = payload;
            return {
                ...state,
                outpatients: outpatients
            }
        case "DELETE_OUTPATIENT":
            return {
                ...state,
                outpatients: state.outpatients.filter(item => item.id != payload.id)
            }

        // Patient
        case "FETCH_PATIENT":
            return {
                ...state,
                patients: payload
            }
        case "INSERT_PATIENT":
            return {
                ...state,
                patients: [payload, ...state.patients]
            }
        case "UPDATE_PATIENT":
            let patients = state.patients;
            let patientIndex = patients.findIndex(
                (patient) => patient.id == payload.id
            )
            patients[patientIndex] = payload;
            return {
                ...state,
                patients: patients
            }
        case "DELETE_PATIENT":
            return {
                ...state,
                patients: state.patients.filter(item => item.id != payload.id)
            }

        case "FETCH_IMMUNIZATION":
            return {
                ...state,
                immunizations: payload
            }
        case "INSERT_IMMUNIZATION":
            return {
                ...state,
                immunizations: [payload, ...state.immunizations]
            }
        case "UPDATE_IMMUNIZATION":
            let immunizations = state.immunizations;
            let immunizationIndex = immunizations.findIndex(
                (immunization) => immunization.id == payload.id
            )
            immunizations[immunizationIndex] = payload;
            return {
                ...state,
                immunizations: immunizations
            }
        case "DELETE_IMMUNIZATION":
            return {
                ...state,
                immunizations: state.immunizations.filter(item => item.id != payload.id)
            }

        case "FETCH_VACCINE":
            return {
                ...state,
                vaccines: payload
            }
        case "INSERT_VACCINE":
            return {
                ...state,
                vaccines: [...state.vaccines, payload]
            }
        case "UPDATE_VACCINE":
            let vaccines = state.vaccines;
            let vaccineIndex = vaccines.findIndex(
                (vaccine) => vaccine.id == payload.id
            )
            vaccines[vaccineIndex] = payload;
            return {
                ...state,
                vaccines: vaccines
            }
        case "DELETE_VACCINE":
            return {
                ...state,
                vaccines: state.vaccines.filter(item => item.id != payload.id)
            }

        case "FETCH_HEALTH_CONDITION":
            return {
                ...state,
                healthConditions: payload
            }
        case "INSERT_HEALTH_CONDITION":
            return {
                ...state,
                healthConditions: [...state.healthConditions, payload]
            }
        case "UPDATE_HEALTH_CONDITION":
            let healthConditions = state.healthConditions;
            let healthConditionIndex = healthConditions.findIndex(
                (healthCondition) => healthCondition.id == payload.id
            )
            healthConditions[healthConditionIndex] = payload;
            return {
                ...state,
                healthConditions: healthConditions
            }
        case "DELETE_HEALTH_CONDITION":
            return {
                ...state,
                healthConditions: state.healthConditions.filter(item => item.id != payload.id)
            }

        case "FETCH_PRESCRIPTION":
            return {
                ...state,
                prescriptions: payload
            }

        case "FETCH_CHILD_PRESCRIPTION":
            return {
                ...state,
                prescriptions: payload
            }

        case "INSERT_PRESCRIPTION":
            return {
                ...state,
                prescriptions: [...state.prescriptions, payload]
            }
        case "UPDATE_PRESCRIPTION":
            let prescriptions = state.prescriptions;
            let prescriptionIndex = prescriptions.findIndex(
                (prescription) => prescription.id == payload.id
            )
            prescriptions[prescriptionIndex] = payload;
            return {
                ...state,
                prescriptions: prescriptions
            }

        case "DELETE_PRESCRIPTION":
            return {
                ...state,
                prescriptions: state.prescriptions.filter(item => item.id != payload.id)
            }

        // Prescriptions Medications

        case "FETCH_PRESCRIPTION_MEDICATION":
            return {
                ...state,
                prescriptionMedications: payload
            }

        case "INSERT_PRESCRIPTION_MEDICATION":
            return {
                ...state,
                prescriptionMedications: [...state.prescriptionMedications, payload]
            }

        case "UPDATE_PRESCRIPTION_MEDICATION":
            let prescriptionMedications = state.prescriptionMedications;
            let prescriptionMedicationsIndex = prescriptionMedications.findIndex(
                (prescriptionMedication) => prescriptionMedication.id == payload.id
            )
            prescriptionMedications[prescriptionMedicationsIndex] = payload;
            return {
                ...state,
                prescriptionMedications: prescriptionMedications
            }

        case "DELETE_PRESCRIPTION_MEDICATION":
            return {
                ...state,
                prescriptionMedications: state.prescriptionMedications.filter(item => item.id != payload.id)
            }


        case "FETCH_CHILDREN":
            return {
                ...state,
                childrens: payload
            }
        case "INSERT_CHILDREN":
            return {
                ...state,
                childrens: [...state.childrens, payload]
            }
        case "UPDATE_CHILDREN":
            let childrens = state.childrens;
            let childrenIndex = childrens.findIndex(
                (children) => children.id == payload.id
            )
            childrens[childrenIndex] = payload;
            return {
                ...state,
                childrens: childrens
            }
        case "DELETE_CHILDREN":
            return {
                ...state,
                childrens: state.childrens.filter(item => item.id != payload.id)
            }


        case "FETCH_DIAGNOSIS":
            return {
                ...state,
                diagnosis: payload
            }
        case "INSERT_DIAGNOSIS":
            return {
                ...state,
                diagnosis: [...state.diagnosis, payload]
            }
        case "UPDATE_DIAGNOSIS":
            let diagnosis = state.diagnosis;
            let diagnosisIndex = diagnosis.findIndex(
                (diagnose) => diagnose.id == payload.id
            )
            diagnosis[diagnosisIndex] = payload;
            return {
                ...state,
                diagnosis: diagnosis
            }
        case "DELETE_DIAGNOSIS":
            return {
                ...state,
                diagnosis: state.diagnosis.filter(item => item.id != payload.id)
            }
    }
}