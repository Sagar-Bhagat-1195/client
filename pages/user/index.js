import React, { useState, useEffect } from "react";
import axios from "axios";
import UserSecure from "@/component/secure/UserSecure";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

import Room_Tabs from "@/component/User/Room_Tabs"; // Import the LabTabs component

import EnvironmentVariables from '@/component/env';

// const SUPER_ADMIN_API_KEY = EnvironmentVariables.SUPER_ADMIN_API_KEY;
const MAIN_URL = EnvironmentVariables.MAIN_URL;


const UserDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [userData, setUserData] = useState(null);
  const [newRoomData, setNewRoomData] = useState({
    name: "",
    type: "",
  });
  const [addingNewRoom, setAddingNewRoom] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(1, "Room name must be at least 1 characters")
      .max(20, "Room name must not exceed 20 characters")
      .required("Room name is required"),
    type: Yup.string()
      .min(1, "Room type must be at least 1 characters")
      .max(20, "Room type must not exceed 20 characters")
      .required("Room type is required"),
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  // Function to fetch room names from API
  const fetchRooms = async () => {
    try {
      // Assuming you have stored the auth token in localStorage
      const user_data = JSON.parse(localStorage.getItem("user-data"));
      setUserData(user_data);
      const response = await axios.get(MAIN_URL + "/room/all", {
        headers: {
          "auth-token": user_data.authToken,
          "Content-Type": "application/json",
        },
      });
      // Set the rooms data
      setRooms(response.data.rooms);
      // console.log(response.data.rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleNewRoomChange = (event) => {
    console.log(event.target.value); // Log the updated newRoomData object
    setNewRoomData({
      ...newRoomData,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddNewRoom = async () => {
    try {
      // Assuming you have stored the auth token in localStorage
      const user_data = JSON.parse(localStorage.getItem("user-data"));
      // console.log(user_data.authToken);
      // console.log(newRoomData);
      const response = await axios.post(
        MAIN_URL + "/room/addroom",
        newRoomData,
        {
          headers: {
            "auth-token": user_data.authToken,
            "Content-Type": "application/json",
          },
        }
      );
      // Update rooms data with the newly added room
      // setRooms([...rooms, response.data.room]);
      // Reset new room data and close the form
      setNewRoomData({
        name: "",
        type: "",
      });
      setAddingNewRoom(false);
      fetchRooms();
    } catch (error) {
      console.error("Error adding new room:", error);
    }
  };

  const handleCancelAddRoom = () => {
    // Reset new room data and close the form
    setNewRoomData({
      name: "",
      type: "",
    });
    setAddingNewRoom(false);
  };

  return (
    <UserSecure>
      <Container maxWidth="ls">
        <div style={{ textAlign: "center" }}>
          <Box mt={5} mb={3}>
            <h1>
              {userData ? (
                <strong style={{ color: "#1976d2" }}>
                  {userData.name.charAt(0).toUpperCase() +
                    userData.name.slice(1)}
                 {"'S "}
                  <strong style={{ color: "#000000" }}>&apos;S User Dashboard</strong>
                </strong>
              ) : (
                <strong style={{ color: "#000000" }}>User Dashboard</strong>
              )}
            </h1>
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}
          >
            <Button variant="contained" onClick={() => setAddingNewRoom(true)}>
              Add New Room
            </Button>
            <Dialog open={addingNewRoom} onClose={handleCancelAddRoom}>
              <DialogTitle>Add New Room</DialogTitle>
              <DialogContent>
                <Formik
                  initialValues={{
                    name: "",
                    type: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleAddNewRoom}
                >
                  {({ errors, touched, handleChange }) => (
                    <Form>
                      <Field
                        name="name"
                        as={TextField}
                        label="Room Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={touched.name && errors.name}
                        helperText={<ErrorMessage name="name" />}
                        onChange={(e) => {
                          handleChange(e); // Call Formik's handleChange
                          handleNewRoomChange(e); // Call your custom function
                        }}
                      />
                      <Field
                        name="type"
                        as={TextField}
                        label="Room Type"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={touched.type && errors.type}
                        helperText={<ErrorMessage name="type" />}
                        onChange={(e) => {
                          handleChange(e); // Call Formik's handleChange
                          handleNewRoomChange(e); // Call your custom function
                        }}
                      />
                      <DialogActions>
                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={<AddIcon />}
                        >
                          Add New Room
                        </Button>
                        <Button
                          variant="contained"
                          onClick={handleCancelAddRoom}
                          startIcon={<CancelIcon />}
                        >
                          Cancel
                        </Button>
                      </DialogActions>
                    </Form>
                  )}
                </Formik>
              </DialogContent>
            </Dialog>
          </Box>

          {/* {rooms.map((room, index) => {
            // console.log(room.name); // Print room name to console
            return (
              <Tab
                key={index}
                label={room.name}
                value={(index + 1).toString()}
              />
            );
          })} */}

          <Room_Tabs rooms={rooms} />
        </div>
      </Container>
    </UserSecure>
  );
};

export default UserDashboard;
