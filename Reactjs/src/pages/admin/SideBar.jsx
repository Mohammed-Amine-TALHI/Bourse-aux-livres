import React from "react";
import { Link } from "react-router-dom";
import { AiFillFund } from "react-icons/ai";
import { MdAddHome } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";
import { CiViewList } from "react-icons/ci";
import { GoChevronDown } from "react-icons/go";
import { FaBookMedical } from "react-icons/fa";
import { GiBookshelf } from "react-icons/gi";





const SideBar = () => {
    return (
            <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                    <div className="sb-sidenav-menu">
                        <div className="nav">
                            <div className="sb-sidenav-menu-heading">Core</div>
                            <Link className="nav-link" to="/admin/Dashboard">
                                <div className="sb-nav-link-icon"><i><AiFillFund/></i></div>
                                Dashboard
                            </Link>
                            <Link className="nav-link" to="/admin/Users">
                                <div className="sb-nav-link-icon"><i><FaUserCog /></i></div>
                                Users
                            </Link>
                            <Link className="nav-link" to="/admin/add-category">
                                <div className="sb-nav-link-icon"><i><MdAddHome/></i></div>
                                Add Category
                            </Link>
                            <Link className="nav-link" to="/admin/view-category">
                                <div className="sb-nav-link-icon"><i><CiViewList/></i></div>
                                View Category
                            </Link>
                            <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#collapseProduct" aria-expanded="false" aria-controls="collapseProduct">
                                <div className="sb-nav-link-icon"><i ><GiBookshelf /></i></div>
                                Books
                                <div className="sb-sidenav-collapse-arrow"><i><GoChevronDown /></i></div>
                            </Link>
                            <div className="collapse" id="collapseProduct" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                                <nav className="sb-sidenav-menu-nested nav">
                                    <Link className="nav-link" to="/admin/add-book">
                                    <div className="sb-nav-link-icon"><i ><FaBookMedical /></i></div>
                                    Add Book
                                    </Link>
                                    <Link className="nav-link" to="/admin/view-books">
                                    <div className="sb-nav-link-icon"><i ><CiViewList /></i></div>
                                        View Books
                                    </Link>
                                </nav>
                            </div>
                        </div>
                      </div>      
                    <div className="sb-sidenav-footer">
                        <div className="small">Logged in as:</div>
                        Admin
                    </div>
                </nav>

    );
}
export default SideBar;