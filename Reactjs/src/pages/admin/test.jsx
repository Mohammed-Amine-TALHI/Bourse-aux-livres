import React, { useEffect } from 'react';
import AuthUser from '../../pages/forms/AuthUser';
import "./forms.css"
import { useState } from 'react';
import NotFound from '../../pages/404/NotFound';
export default function PersonalProfile() {
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
                {token ?  (
<div className="profile-container">
      <div className="profile-header">
        <img
          className="profile-image"
          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
          alt="Profile"
        />
        <div className="profile-info">
          <h1 className="profile-name">{userdetail.name}</h1>
          <p className="profile-email">{userdetail.email}</p>

        </div>
      </div>

      <div className="profile-stats">
        <div className="stat">
          <p className="stat-label">Articles</p>
          <p className="stat-value">41</p>
        </div>
        <div className="stat">
          <p className="stat-label">Rating</p>
          <p className="stat-value">8.5</p>
        </div>
      </div>

      <div className="profile-actions">
        <button className="action-btn">Chat</button>
        <button className="action-btn edit-btn">Edit info</button> {/* New Edit Button */}
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