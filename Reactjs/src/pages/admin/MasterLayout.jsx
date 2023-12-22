import React from "react";
import { Route, Navigate, Routes,Switch,Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import Footer_A from "./Footer_A";
import routes from "../../routes/routes";
import "./scripts.js";
import "./styles.css";
import AuthUser from '../../pages/forms/AuthUser';
import { useState,useEffect } from 'react';
import NotFound from '../../pages/404/NotFound';


export const MasterLayout = () => {
  const {http,token} = AuthUser();
  const [userdetail,setUserdetail] = useState();

  useEffect(()=>{
    fetchUserDetail();
},[]);

const fetchUserDetail = () =>{
    http.post('/me').then((res)=>{
        setUserdetail(res.data);
    })
}


function renderElement(){
    if(userdetail){
        return <div >
            {userdetail.role === 'admin' ?  (
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
</div>) : (<div><NotFound/></div>)}
            </div>
      
    }else{
        return <div className="loading-container">
        <div className="spinner">
        </div>
      </div>
    }
}
return (
<div>
    {renderElement()}
</div>
);
}

export default MasterLayout;