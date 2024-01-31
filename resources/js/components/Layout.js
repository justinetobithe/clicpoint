import React, { useContext, useEffect, useState } from 'react'
import { NavLink, Redirect, useHistory } from 'react-router-dom'
import { useHttpRequest } from '../api'
import { AppContext } from '../store'
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import { FaCalendarDays, FaFilePrescription } from "react-icons/fa6";
import { MdOutlineBabyChangingStation } from "react-icons/md";
import { Image } from 'react-bootstrap';

export default function Layout({ children }) {

    let history = useHistory();

    const { state, dispatch } = useContext(AppContext)
    const [showLogoIcon, setShowLogoIcon] = useState(false);

    const toggleLogoIcon = () => {
        setShowLogoIcon(!showLogoIcon);
    };

    const [logoutResponse, handleLogoutResponse] = useHttpRequest((data) => ({
        url: "/logout",
        method: "POST",
        data,
        header: { "Content-Type": "appcliation/json" }
    }))

    useEffect(() => {
        dispatch({ type: "TOGGLE_LOADING", payload: logoutResponse.loading })

        if (logoutResponse.data !== null) {
            dispatch({ type: "AUTHENTICATION", payload: {} })

            history.push("/")
        }

        <Redirect to="/" />
    }, [logoutResponse])

    const handleLogout = (e) => {
        e.preventDefault();
        let data = new FormData();
        data.append("id", state.user.id)
        handleLogoutResponse(data);
        // 
    }

    const isNavLinkActive = (path) => {
        return location.pathname === path;
    };

    const preventCollapseToggle = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
                <NavLink className="sidebar-brand d-flex align-items-center justify-content-center" to="/">
                    <Image
                        src={showLogoIcon ? "/img/logo-icon-white.png" : "/img/logo-white.png"}
                        className="img-fluid"
                        width={showLogoIcon ? "100" : ""}
                    />
                </NavLink>
                <hr className="sidebar-divider my-0" />


                <li className="nav-item">
                    <NavLink
                        className={`nav-link ${isNavLinkActive('/') ? 'active' : ''}`}
                        to="/"
                    >
                        <DashboardIcon />
                        <span>Dashboard</span>
                    </NavLink>
                </li>

                {
                    state.user.role != 1 && (
                        <li className="nav-item">
                            <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseRecord"
                                aria-expanded="true" aria-controls="collapseRecord">
                                <ReceiptLongIcon />
                                <span>Record</span>
                            </a>
                            <div id="collapseRecord" className="collapse" data-parent="#accordionSidebar">
                                <div className="bg-primary py-2 collapse-inner rounded">
                                    <NavLink className="collapse-item" to="/record/list-of-records">List of Record</NavLink>
                                    <NavLink className="collapse-item" to="/record/outpatients">Outpatient</NavLink>
                                    {
                                        state.user.role != 4 && (
                                            <>
                                                <NavLink className="collapse-item" to="/record/diagnosis/walk-ins">Diagnosis for Walkins</NavLink>
                                                <NavLink className="collapse-item" to="/record/diagnosis/online">Diagnosis for Online</NavLink>
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        </li>
                    )}


                <li className="nav-item">
                    <a
                        className={`nav-link collapsed ${isNavLinkActive('/appointment') ? 'active' : ''}`}
                        href="#"
                        data-toggle="collapse"
                        data-target="#collapseAppointment"
                        aria-expanded="true"
                        aria-controls="collapseAppointment"
                        onClick={preventCollapseToggle}
                    >
                        <FaCalendarDays className="mr-2" />
                        <span>Appointment</span>
                    </a>
                    <div id="collapseAppointment" className="collapse" data-parent="#accordionSidebar">
                        <div className="bg-primary py-2 collapse-inner rounded">
                            {
                                state.user.role == 1 && (
                                    <NavLink className="collapse-item" to="/appointment/view">My Bookings</NavLink>
                                )
                            }
                            {
                                state.user.role != 1 && (
                                    <>
                                        <NavLink className="collapse-item" to="/appointment/calendar">Calendar</NavLink>
                                        <NavLink className="collapse-item" to="/appointment/schedule">Schedule</NavLink>
                                    </>
                                )
                            }
                            {
                                state.user.role != 1 && (
                                    <NavLink className="collapse-item" to="/appointment/walk-in">Walk-ins</NavLink>
                                )
                            }
                        </div>

                    </div>
                </li>

                {(state.user.role === 3 || state.user.role === 4) && (
                    <>
                        <li className="nav-item">
                            <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseImmunization"
                                aria-expanded="true" aria-controls="collapseImmunization">
                                <VaccinesIcon />
                                <span>Immunization</span>
                            </a>
                            <div id="collapseImmunization" className="collapse" data-parent="#accordionSidebar">
                                <div className="bg-primary py-2 collapse-inner rounded">
                                    <NavLink className="collapse-item" to="/vaccine/list-of-vaccines">List of Vaccines</NavLink>
                                    <NavLink className="collapse-item" to="/vaccine/immunization/walk-ins">Immunization for Walkins</NavLink>
                                    <NavLink className="collapse-item" to="/vaccine/immunization/online">Immunization for Online</NavLink>
                                    {/* <NavLink className="collapse-item" to="/immunization/view-data">View Data</NavLink> */}
                                    <NavLink className="collapse-item" to="/immunization/track/view">Track Data</NavLink>
                                </div>
                            </div>
                        </li>
                    </>
                )}
                {/* <li className="nav-item">
                    <NavLink className="nav-link collapsed" to="#" data-toggle="collapse" data-target="#collapseSchedule"
                        aria-expanded="true" aria-controls="collapseSchedule">
                        <CalendarMonthIcon />
                        <span>Schedule & Report</span>
                    </NavLink>
                    <div id="collapseSchedule" className="collapse" data-parent="#accordionSidebar">
                        <div className="bg-primary py-2 collapse-inner rounded">
                            {
                                state.user.role != 1 ?
                                    <>
                                        <NavLink className="collapse-item" to="/program/view">Program</NavLink>
                                        <NavLink className="collapse-item" to="/project/view">Project</NavLink> 
                                        <NavLink className="collapse-item" to="/report">Report</NavLink>
                                    </> : ""
                            }

                            {
                                state.user.role == 1 ?
                                    <NavLink className="collapse-item" to="/schedule/view">View Schedule</NavLink> : ""
                            }

                        </div>
                    </div>
                </li> */}

                <hr className="sidebar-divider" />
                <li className="nav-item">
                    <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseChildren"
                        aria-expanded="true" aria-controls="collapseChildren">
                        <MdOutlineBabyChangingStation className="mr-2" />
                        <span>Children</span>
                    </a>
                    <div id="collapseChildren" className="collapse" data-parent="#accordionSidebar">
                        <div className="bg-primary py-2 collapse-inner rounded">
                            {state.user.role === 1 && (
                                <NavLink className="collapse-item" to="/children/view">View Children</NavLink>
                            )}
                            {(state.user.role === 2 || state.user.role === 3 || state.user.role === 4) && (
                                <NavLink className="collapse-item" to="/children/list">List of Children</NavLink>
                            )}
                            {state.user.role === 1 && (
                                <NavLink className="collapse-item" to="/children/add">Add Child</NavLink>
                            )}
                        </div>
                    </div>
                </li>

                {/* <li className="nav-item">
                    <NavLink className="nav-link" to="/">
                        <FaUserDoctor className="mr-2" />
                        <span>Doctor</span>
                    </NavLink>
                </li> */}

                {
                    state.user.role === 3 && (
                        <li className="nav-item">
                            <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePrescription"
                                aria-expanded="true" aria-controls="collapsePrescription">
                                <FaFilePrescription className="mr-2" />
                                <span>Prescription</span>
                            </a>
                            <div id="collapsePrescription" className="collapse" data-parent="#accordionSidebar">
                                <div className="bg-primary py-2 collapse-inner rounded">
                                    {state.user.role === 3 && (
                                        <>
                                            <NavLink className="collapse-item" to="/prescription/walk-ins">Prescription for Walkins</NavLink>
                                            <NavLink className="collapse-item" to="/prescription/online">Prescription for Online</NavLink>
                                        </>
                                    )}
                                    {state.user.role === 1 && (
                                        <NavLink className="collapse-item" to="/prescript/user">My Prescript</NavLink>
                                    )}
                                </div>
                            </div>
                        </li>
                    )
                }


                <li className="nav-item">
                    <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseUser"
                        aria-expanded="true" aria-controls="collapseUser">
                        <PeopleIcon />
                        <span>User</span>
                    </a>
                    <div id="collapseUser" className="collapse" data-parent="#accordionSidebar">
                        <div className="bg-primary py-2 collapse-inner rounded">
                            {(state.user.role === 3 || state.user.role === 4) && (
                                <>
                                    <NavLink className="collapse-item" to="/user/view">View User</NavLink>
                                    {/* <NavLink className="collapse-item" to="/user/add">Add User</NavLink> */}
                                    <NavLink className="collapse-item" to="/clinic">Clinic</NavLink>
                                </>
                            )}
                            <NavLink className="collapse-item" to="/user/profile">Profile</NavLink>
                        </div>
                    </div>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#" data-toggle="modal" data-target="#logoutModal">
                        <LogoutIcon />
                        <span>Logout</span></a>
                </li>
            </ul >
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                        <button
                            id="sidebarToggleTop"
                            className="btn btn-link rounded-circle mr-3 d-flex align-items-center justify-content-center"
                            onClick={toggleLogoIcon}
                        >
                            <MenuIcon />
                        </button>
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item dropdown no-arrow">
                                <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span className="mr-2 d-none d-lg-inline text-gray-600 small">{state.user.name}</span>
                                    <img className="img-profile rounded-circle" src="/img/undraw_profile.svg" />
                                </a>
                                <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                    aria-labelledby="userDropdown">
                                    <NavLink className="dropdown-item" to="/user/profile">
                                        <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                        Profile
                                    </NavLink>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                                        <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                        Logout
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </nav>
                    <div className="container-fluid">
                        {children}
                    </div>
                </div>
                <footer className="sticky-footer bg-white">
                    <div className="container my-auto">
                        <div className="copyright text-center my-auto">
                            <span>Copyright &copy; ClicPoint 2023</span>
                        </div>
                    </div>
                </footer>
            </div>

            <a className="scroll-to-top rounded" href="#page-top">
                <i className="fas fa-angle-up"></i>
            </a>

            <div className="modal fade" id="logoutModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                            <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                            <button className="btn btn-primary" data-dismiss="modal" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
