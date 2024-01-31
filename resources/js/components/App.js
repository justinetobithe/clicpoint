import React, { useEffect, useReducer } from 'react'
import { BrowserRouter as Router, Switch, useHistory, Route } from 'react-router-dom'
import reducer from '../reducer';
import { AppContext, initialState } from '../store';
import AuthRoute from './AuthRoute';
import { LoadingOverlay, Modal } from './Elements';
import GuestRoute from './GuestRoute';
import AddUser from './pages/AddUser';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import ViewSchedule from './pages/ViewSchedule';
import ViewRecord from './pages/ViewRecord';
import ViewUser from './pages/ViewUser';
import Register from './pages/Register';
import ListofRecord from './pages/ListOfRecord';
import ViewImmunizationData from './pages/ViewImmunizationData';
import UserTrackData from './pages/UserTrackData';
import AdminTrackData from './pages/AdminTrackData';
import ListOfVaccines from './pages/ListOfVaccines';
import AddAppointmentWalkIns from './pages/Appointment/AddAppointmentWalkIns';
import Schedule from './pages/Appointment/Schedule';
import ViewAppointment from './pages/Appointment/ViewAppointment';
import ViewPatient from './pages/Patient/ViewPatient';
import AddPatient from './pages/Patient/AddPatient';
import ViewPrescript from './pages/Prescription/ViewPrescript';
import EditPrescript from './pages/Prescription/EditPrescript';
import AddChild from './pages/Children/AddChild';
import ListChildren from './pages/Children/ListChildren';
import ViewChildren from './pages/Children/ViewChildren';
import UserPrescipt from './pages/Prescription/UserPrescipt';
import Calendar from './pages/Appointment/Calendar';
import Clinic from './pages/Clinic';
import WalkinsAppointment from './pages/Appointment/WalkinsAppointment';
import Outpatient from './pages/Outpatient';
import DiagnosisForWalkins from './pages/DiagnosisForWalkins';
import DiagnosisForOnline from './pages/DiagnosisForOnline';
import Error404 from './pages/Error404';
import ImmunizationForWalkins from './pages/Immunization/ImmunizationForWalkins';
import ImmunizationForOnline from './pages/Immunization/ImmunizationForOnline';
import PrescriptionForWalkins from './pages/Prescription/PrescriptionForWalkins';
import PrescriptionForOnline from './pages/Prescription/PrescriptionForOnline';
import ForgotPassword from './pages/ForgotPassword';
import SetPassword from './pages/SetPassword';
import PrivacyPolicy from './pages/PrivacyPolicy';

export default function App() {
    let history = useHistory();
    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        if (isset(AUTH_USER.id)) {
            dispatch({
                type: "AUTHENTICATION",
                payload: AUTH_USER
            })
        }
    }, [])



    return (
        <AppContext.Provider value={{ state, dispatch }}>
            <LoadingOverlay loading={state.loading} />
            <Router history={history}
            // basename={
            //     !process.env.NODE_ENV || process.env.NODE === "development"
            //         ? null
            //         : "/clicpoint"
            // }
            >
                <Switch>
                    {
                        isset(state.user.id) ? (
                            <>
                                <AuthRoute exact path="/" component={Dashboard} />

                                <AuthRoute path="/appointment/walk-ins/add" component={AddAppointmentWalkIns} />
                                <AuthRoute path="/appointment/view" component={ViewAppointment} />

                                <AuthRoute path="/patient/user" component={ViewPatient} />


                                <AuthRoute path="/patient/view" component={ViewPatient} />

                                <AuthRoute path="/appointment/schedule" component={Schedule} />
                                <AuthRoute path="/appointment/calendar" component={Calendar} />
                                <AuthRoute path="/appointment/walk-in" component={WalkinsAppointment} />

                                <AuthRoute path="/clinic" component={Clinic} />
                                <AuthRoute path="/patient/add" component={AddPatient} />

                                <AuthRoute path="/children/add" component={AddChild} />
                                <AuthRoute path="/children/view" component={ViewChildren} />
                                <AuthRoute path="/children/list" component={ListChildren} />

                                <AuthRoute path="/user/view" component={ViewUser} />
                                <AuthRoute path="/user/add" component={AddUser} />
                                <AuthRoute path="/user/profile" component={UserProfile} />
                                <AuthRoute path="/schedule/view" component={ViewSchedule} />
                                <AuthRoute path="/record/view" component={ViewRecord} />
                                <AuthRoute path="/record/list-of-records" component={ListofRecord} />
                                <AuthRoute path="/record/outpatients" component={Outpatient} />
                                <AuthRoute path="/record/diagnosis/walk-ins" component={DiagnosisForWalkins} />
                                <AuthRoute path="/record/diagnosis/online" component={DiagnosisForOnline} />

                                <AuthRoute path="/prescription/walk-ins" component={PrescriptionForWalkins} />
                                <AuthRoute path="/prescription/online" component={PrescriptionForOnline} />

                                <AuthRoute path="/vaccine/immunization/walk-ins" component={ImmunizationForWalkins} />
                                <AuthRoute path="/vaccine/immunization/online" component={ImmunizationForOnline} />

                                <AuthRoute path="/immunization/view-data" component={ViewImmunizationData} />
                                <AuthRoute path="/record/track/view/:id" component={UserTrackData} />
                                <AuthRoute path="/immunization/track/view" component={AdminTrackData} />
                                <AuthRoute path="/vaccine/list-of-vaccines" component={ListOfVaccines} />
                                <AuthRoute path="/prescript/view" component={ViewPrescript} />
                                <AuthRoute path="/prescript/edit/:id" component={EditPrescript} />

                            </>
                        ) : (
                            <GuestRoute exact path="/" component={Login} />

                        )
                    }

                    <Route path="/register" component={Register} />
                    <Route path="/forgot-password" component={ForgotPassword} />
                    <Route path="/set-password/:token" component={SetPassword} />
                    <Route path="/privacy-policy" component={PrivacyPolicy} />

                </Switch>
            </Router>
            <Modal {...state.modal} />
        </AppContext.Provider >
    )
}
