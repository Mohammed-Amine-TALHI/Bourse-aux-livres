import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthUser from '../../pages/forms/AuthUser';
import swal from "sweetalert";

function EditUserRole() {
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newUserRole, setNewUserRole] = useState('');
  const [userlist, setUserlist] = useState([]);

  const { http } = AuthUser();

  useEffect(() => {
    http.get(`/users`)
      .then(res => {
        if (res.data.status === 200) {
          setUserlist(res.data.user);
        }
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        // Handle the error, e.g., show an alert
        swal("Error", "Failed to fetch users", "error");
      });
  }, []);

  const handleUserChange = (e) => {
    setSelectedUserId(e.target.value);
  };

  const handleRoleChange = (e) => {
    setNewUserRole(e.target.value);
  };

  const updateUserRole = () => {
    // Add your logic to update the user role on the server
    // Modify the following code based on your API endpoint and structure
    http.put(`/users/${selectedUserId}/update-role`, { role: newUserRole })
      .then(response => {
        // Handle the success, e.g., show a success alert
        swal("Success", "User role updated successfully", "success");
        // Refresh the user list
        navigate('/admin/users');
        http.get(`/users`)
          .then(response => setUserlist(response.data))
          .catch(error => {
            console.error('Error fetching users:', error);
            // Handle the error, e.g., show an alert
            swal("Error", "Failed to fetch users", "error");
          });
      })
      .catch(error => {
        console.error('Error updating user role:', error);
        // Handle the error, e.g., show an alert
        swal("Error", "Failed to update user role", "error");
      });
  };

  return (
    <div className="container-fluid px-4">
      <div className="card mt-4">
        <div className="card-header">
          <h4>
            Edit User Role
            <Link to="/admin/users" className="btn btn-primary btn-sm float-end">
              Back
            </Link>
          </h4>
        </div>
        <div className="card-body">
          <div className="form-group mb-3">
            <label>Select User:</label>
            <select value={selectedUserId} onChange={handleUserChange} className="form-control">
              <option value="">Select</option>
              {
                userlist.map((item) => (
                  <option value={item.id} key={item.id}>{item.name}</option>
                ))
              }
            </select>
          </div>
          <div className="form-group mb-3">
            <label>New Role:</label>
            <select value={newUserRole} onChange={handleRoleChange} className="form-control">
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={updateUserRole}>
            Update Role
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditUserRole;
