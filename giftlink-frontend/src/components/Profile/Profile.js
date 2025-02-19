import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Profile.css'
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';

const Profile = () => {
  const [userDetails, setUserDetails] = useState({}); // details,有name和email属性
  const [updatedDetails, setUpdatedDetails] = useState({}); // 用户修改后的details,有name和email属性
  const { setUserName } = useAppContext();
  const [changed, setChanged] = useState("");

  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  // check login status, if logged in, direct to mainpage
  useEffect(() => {
    const authtoken = sessionStorage.getItem("auth-token");
    if (!authtoken) {
      navigate("/app/login");
    } else {
      fetchUserProfile();
    }
  }, [navigate]);

  // initialise user details
  const fetchUserProfile = async () => {
    try {
      const authtoken = sessionStorage.getItem("auth-token");
      const email = sessionStorage.getItem("email");
      const name = sessionStorage.getItem('name');
      if (name || authtoken) {
        const storedUserDetails = {
          name: name,
          email: email
        };

        setUserDetails(storedUserDetails);
        setUpdatedDetails(storedUserDetails);
      }
    } catch (error) {
      console.error(error);
      // Handle error case
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    setUpdatedDetails({
      ...updatedDetails,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      // to ensure the user has logged in
      const authtoken = sessionStorage.getItem("auth-token");
      const email = sessionStorage.getItem("email");
      if (!authtoken || !email) {
        navigate("/app/login");
        return;
      }

      // send the update request. Update the user item in Database
      const payload = { ...updatedDetails };  // 数据体
      const response = await fetch(`${urlConfig.backendUrl}/api/auth/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authtoken}`,
          'Content-Type': 'application/json',
          'Email': email,
        },
        body: JSON.stringify(payload),  // 将payload转换为json字符串
      });

      // database update successfully, modify local variable
      if (response.ok) {
        // Update the user details in session storage
        setUserName(updatedDetails.name); // update local username
        sessionStorage.setItem('name', updatedDetails.name); // update session
        setUserDetails(updatedDetails); // 修改完成，更新userDetails
        setEditMode(false);
        // Display success message to the user, it will be displayed at the bottom
        setChanged("Name Changed Successfully!");
        setTimeout(() => {
          setChanged("");
          navigate("/");
        }, 1000);

      } else {
        // Handle error case
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      // Handle error case
    }
  };

return (
    <div className="profile-container">
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={userDetails.email}
              disabled // Disable the email field
            />
          </label>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={updatedDetails.name}
              onChange={handleInputChange}
            />
          </label>

          <button type="submit">Save</button>
        </form>
      ) : (
        <div className="profile-details">
          <h1>Hi, {userDetails.name}</h1>
          <p> <b>Email:</b> {userDetails.email}</p>
          <button onClick={handleEdit}>Edit</button>
          <span style={{ color: 'green', height: '.5cm', display: 'block', fontStyle: 'italic', fontSize: '12px' }}>{changed}</span>
        </div>
      )}
    </div>
  );
};

export default Profile;
