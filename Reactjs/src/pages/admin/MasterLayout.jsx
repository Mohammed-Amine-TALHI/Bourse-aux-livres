import React from "react";
import { Route, Navigate, Routes,Switch,Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import Footer_A from "./Footer_A";
import routes from "../../routes/routes";
import "./scripts.js";
import "./styles.css";

export const MasterLayout = () => {
    return (
        <div className="sb-nav-fixed">
            <NavBar />
            <div id="layoutSidenav">
                <div id="layoutSidenav_nav">
                    <SideBar />
                </div>

                <div id="layoutSidenav_content">
                    <main>
                    <Routes>
            {routes.filter(route => route.component)
              .map(({ path, component: Component }, idx) => (
                <Route
                  key={idx}
                  path={path}
                  element={<Component />}
                />
              ))}
            <Route
              path="/"
              element={<Navigate to="/admin/dashboard"/>}
            />
          </Routes>
                    </main>
                    <Footer_A />
                </div>

            </div>

        </div>
    );
};
export default MasterLayout;