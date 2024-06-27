// import io from "socket.io-client";
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; // Import Yup for validation

const Add_New_Room = ({ socket }) => {
  const [addingNewRoom, setAddingNewRoom] = useState(false);

  // Validation schema for the form fields
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Room Name is required"),
    type: Yup.string().required("Room Type is required"),
  });

  // Function to handle adding new room
  const handleAddNewRoom = async (values, { setSubmitting }) => {
    console.log({
      name: values.name,
      type: values.type,
    });

    // Emit the "handleSocketAddNewRoom" event with room details
    socket.emit("AddNewRoom_Socket", {
      name: values.name,
      type: values.type,
    });
    // Close the dialog after adding the new room
    setAddingNewRoom(false);
  };

  // Function to handle canceling adding new room
  const handleCancelAddRoom = () => {
    setAddingNewRoom(false);
  };

  return (
    <>
    

        <Button variant="contained" onClick={() => setAddingNewRoom(true)}
          sx={{
            whiteSpace: "nowrap", 
            width: "100%",
            height:"100%",
          }}>
          Add New Room
        </Button>
        {/* 
          <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  sx={{
                    marginLeft: "auto", // Push the button to the right
                  }}
                >
                  Send
                </Button> */}


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
                    }}
                  />
                  <DialogActions>
                    <Button type="submit" variant="contained">
                      Add New Room
                    </Button>
                    <Button variant="contained" onClick={handleCancelAddRoom}>
                      Cancel
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
    </>
  );
};

export default Add_New_Room;
