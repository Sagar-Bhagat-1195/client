import React, { useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";

import EnvironmentVariables from '@/component/env';

// const SUPER_ADMIN_API_KEY = EnvironmentVariables.SUPER_ADMIN_API_KEY;
const MAIN_URL = EnvironmentVariables.MAIN_URL;


const AddDeviceForm = ({ room, socket }) => {
  console.log(room);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    state: true,
    value: 0,
    min_value: 0,
    max_value: 0,
  });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(1, "Name must be at least 1 characters")
      .max(20, "Name must not exceed 20 characters"),
    type: Yup.string()
      .required("Type is required")
      .min(1, "Type  must be at least 1 characters")
      .max(20, "Type  must not exceed 20 characters"),
    value: Yup.number(),
    min_value: Yup.number().required("Min value is required"),
    max_value: Yup.number().required("Max value is required"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      const clientData = JSON.parse(localStorage.getItem("client-data"));
      console.log(clientData);
      const authToken = clientData.authToken;
      const headers = {
        "auth-token": authToken,
        "Content-Type": "application/json",
      };
      const response = await axios.post(
        MAIN_URL + `/device/${room._id}`,
        formData,
        {
          headers,
        }
      );
      // console.log(response.data.rooms);
      // Assuming response.data.rooms is an array of objects
      const updatedRoom = response.data.rooms.find(
        (room) => room._id === room._id
      );

      console.log("Updated Room:", updatedRoom);
      room = updatedRoom;
      console.log("Device added successfully");
      // await fetchDevices();
      handleClose();
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else {
        console.error("Error adding device:", error);
      }
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    console.log(open);
    setFormData({
      name: "",
      type: "",
      state: true,
      value: 0,
      min_value: 0,
      max_value: 0,
    });
    setErrors({});
  };

  return (
    <>
      <div
        sx={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          width: "25%", // Adjust the width here
          margin: "0 auto", // Center the form horizontally
          textAlign: "center",
          height: "100%",
          alignItems: "center",
        }}
      >
        <Button variant="contained" onClick={handleOpen}>
          Add Device
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Device</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: 2,
                }}
              >
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={Boolean(errors.name)}
                  helperText={
                    errors.name ? (
                      <span style={{ color: "red" }}>{errors.name}</span>
                    ) : (
                      ""
                    )
                  }
                  fullWidth
                />
              </Box>
              <Box mb={2}>
                <TextField
                  label="Type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  error={Boolean(errors.type)}
                  helperText={
                    errors.type ? (
                      <span style={{ color: "red" }}>{errors.type}</span>
                    ) : (
                      ""
                    )
                  }
                  fullWidth
                />
              </Box>
              <Box mb={2}>
                <TextField
                  type="number"
                  label="Value"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  error={Boolean(errors.value)}
                  helperText={
                    errors.value ? (
                      <span style={{ color: "red" }}>{errors.value}</span>
                    ) : (
                      ""
                    )
                  }
                  fullWidth
                />
              </Box>
              <Box mb={2}>
                <TextField
                  type="number"
                  label="Min Value"
                  name="min_value"
                  value={formData.min_value}
                  onChange={handleChange}
                  error={Boolean(errors.min_value)}
                  helperText={
                    errors.min_value ? (
                      <span style={{ color: "red" }}>{errors.min_value}</span>
                    ) : (
                      ""
                    )
                  }
                  fullWidth
                />
              </Box>
              <Box mb={2}>
                <TextField
                  type="number"
                  label="Max Value"
                  name="max_value"
                  value={formData.max_value}
                  onChange={handleChange}
                  error={Boolean(errors.max_value)}
                  helperText={
                    errors.max_value ? (
                      <span style={{ color: "red" }}>{errors.max_value}</span>
                    ) : (
                      ""
                    )
                  }
                  fullWidth
                />
              </Box>
              <Box mb={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.state}
                      onChange={handleToggle}
                      name="state"
                    />
                  }
                  label="State"
                />
              </Box>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" variant="contained">
                  Add
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AddDeviceForm;
