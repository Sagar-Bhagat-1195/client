import React, { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
// import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FormControlLabel from "@mui/material/FormControlLabel";
import axios from "axios";
import AddDeviceForm from "./AddDeviceForm";
import Switch from "@mui/material/Switch";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Devices_Tables from "./Devices_Tables";

import EnvironmentVariables from '@/component/env';

// const SUPER_ADMIN_API_KEY = EnvironmentVariables.SUPER_ADMIN_API_KEY;
const MAIN_URL = EnvironmentVariables.MAIN_URL;


const Devices = ({ value, room }) => {
  const [devices, setDevices] = useState([]);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updatedDeviceInfo, setUpdatedDeviceInfo] = useState({
    name: "",
    type: "",
    state: false,
    value: 0,
    min_value: 0,
    max_value: 0,
  });
  const [selectedDevice_Table, setSelectedDevice_Table] = useState("");

  useEffect(() => {
    fetchDevices();
  }, [room]);

  const fetchDevices = async () => {
    if (room && room._id) {
      try {
        const user_data = JSON.parse(localStorage.getItem("user-data"));
        const response = await axios.get(
          MAIN_URL+`/device/${room._id}`,
          {
            headers: {
              "auth-token": user_data.authToken,
              "Content-Type": "application/json",
            },
          }
        );
        setDevices(response.data.devices);
      } catch (error) {
        console.error("Error fetching device data:", error);
      }
    }
  };

  const handleSwitchToggle = async (deviceId, newState) => {
    console.log("handleSwitchToggle", { state: newState });
    try {
      const user_data = JSON.parse(localStorage.getItem("user-data"));
      console.log(MAIN_URL+`/device/${room._id}/${deviceId}`);
      const response = await axios.put(
        MAIN_URL+`/device/${room._id}/${deviceId}`,
        { state: newState },
        {
          headers: {
            "auth-token": user_data.authToken,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log(response); // Check the structure of the response object
      // console.log("Update Device Response:", response.data);
      setDevices(response.data.devices);

      const selectedDevice = response.data.devices.find(
        (device) => device._id === selectedDevice_Table._id
      );
      if (selectedDevice) {
        // Found the selected device
        console.log("Found selectedDevice_Table:", selectedDevice);
        // fetchDevices();
        setSelectedDevice_Table(selectedDevice);
      } else {
        // Did not find the selected device
        console.log("selectedDevice_Table not found in findRoom.devices.");
      }
    } catch (error) {
      console.error("Error toggling device state:", error);
    }
  };

  const handleOpenDeleteConfirmation = (deviceId) => {
    setSelectedDeviceId(deviceId);
    setDeleteConfirmationOpen(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
  };

  const handleDeleteDevice = async (deviceId) => {
    try {
      const user_data = JSON.parse(localStorage.getItem("user-data"));
      const response = await axios.delete(
        MAIN_URL+`/device/${room._id}/${deviceId}`,
        {
          headers: {
            "auth-token": user_data.authToken,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the state to remove the deleted device
      setDevices((prevDevices) =>
        prevDevices.filter((device) => device._id !== deviceId)
      );

      // Update the state to reflect any changes made to the deleted device
      const deletedDevice = response.data.deletedDevice;
      if (deletedDevice) {
        setDevices((prevDevices) =>
          prevDevices.map((device) =>
            device._id === deletedDevice._id ? deletedDevice : device
          )
        );
      }
    } catch (error) {
      console.error("Error deleting device:", error);
    }
  };

  useEffect(() => {
    console.log(devices);
    // Check if selectedDevice_Table is not null or undefined
    if (selectedDevice_Table && selectedDevice_Table._id) {
        const selectedDevice = devices.find(
            (device) => device._id === selectedDevice_Table._id
        );
        console.log("................................................");
        console.log(selectedDevice);
        if (selectedDevice) {
            // Found the selected device
            console.log("Found selectedDevice_Table:", selectedDevice._id);
            // Call handleSwitchReadMoreClick with the selected device's _id
            handleSwitchReadMoreClick(selectedDevice._id);
        } else {
            // Did not find the selected device
            setSelectedDevice_Table("");
            console.log("selectedDevice_Table not found in findRoom.devices.");
        }
    }
}, [devices]);

  //------------------------------------------------------------------------------------------
  const handleUpdateDevice = async (deviceId) => {
    console.log("handleUpdateDevice :");
    try {
      setSelectedDeviceId(deviceId);
      // Fetch the current device information and populate the form
      const { name, type, state, value, min_value, max_value } = [
        ...devices,
      ].find((device) => device._id === deviceId);

      setUpdatedDeviceInfo({ name, type, state, value, min_value, max_value });
      // console.log(updatedDeviceInfo);
      setUpdateDialogOpen(true);
    } catch (error) {
      console.error("Error updating device:", error);
    }
  };

  useEffect(() => {
    // console.log(updatedDeviceInfo);
  }, [updatedDeviceInfo]);

  const handleUpdateDialogClose = () => {
    setUpdateDialogOpen(false);
    setDevices(devices);
  };

  const handleUpdateDialogConfirm = async () => {
    try {
      const user_data = JSON.parse(localStorage.getItem("user-data"));
      const response = await axios.put(
        MAIN_URL+`/device/${room._id}/${selectedDeviceId}`,
        updatedDeviceInfo,
        {
          headers: {
            "auth-token": user_data.authToken,
            "Content-Type": "application/json",
          },
        }
      );

      // Log the response
      console.log("Update Device Response:", response.data.devices);
      setDevices(response.data.devices);

      //------------------------------------------------------------------
      // Fetch the current device information and populate the form
      // const { name, type, state, value, min_value, max_value } = [
      //   ...devices,
      // ].find((device) => device._id === selectedDevice_Table._id);

      // setSelectedDevice_Table({ name, type, state, value, min_value, max_value });
      //----------------------------------------------------------------------------------
      // Assuming findRoom.devices is an array of objects

      setUpdateDialogOpen(false);
    } catch (error) {
      console.error("Error updating device:", error);
    }
  };

  const handleSwitchReadMoreClick = async (deviceId) => {
    try {
      // Assuming response.data.devices is an array of objects
      const selectedDevice = devices.find((device) => device._id === deviceId);
      if (selectedDevice) {
        // Found the selected device
        console.log("Found selectedDevice_Table:", selectedDevice);
        // Fetch devices again if needed
        // fetchDevices();
        setSelectedDevice_Table(selectedDevice);
      } else {
        // Did not find the selected device
        console.log("selectedDevice_Table not found in findRoom.devices.");
      }
    } catch (error) {
      console.error("Error updating device:", error);
    }
  };

  useEffect(() => {
    // console.log(selectedDevice_Table);
  }, [selectedDevice_Table]);

  return (
    <>
      <CssBaseline />
      <Container fixed style={{ padding: "20px" }}>
        <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2}>
          {devices.map((device, index) => (
            <Card
              key={index}
              variant="outlined"
              sx={{
                borderColor: "#1976d2",
                ...(device._id === selectedDevice_Table._id
                  ? { bgcolor: "#64b5f6" } //Select
                  : { bgcolor: "#bbdefb" }),
              }}
            >
              <CardContent>
                <EditNoteIcon
                  onClick={() => {
                    handleUpdateDevice(device._id);
                    handleSwitchReadMoreClick(device._id);
                  }}
                  style={{
                    color: "#1565c0",
                    cursor: "pointer",
                    transition: "color 0.3s ease",
                  }}
                />
                <DeleteSweepIcon
                  onClick={() => {
                    handleOpenDeleteConfirmation(device._id);
                  }}
                  style={{
                    color: "#dc3545",
                    cursor: "pointer",
                    transition: "color 0.3s ease",
                  }}
                />
                <Typography variant="h6" component="h2">
                  {device.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Type: {device.type}
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={device.state}
                      onChange={() => {
                        console.log("Switch toggled for device:", device);
                        // handleSwitchReadMoreClick(device);
                        handleSwitchToggle(device._id, !device.state);
                      }}
                    />
                  }
                  label={`State: ${device.state ? "On" : "Off"}`}
                />
                <Typography color="textSecondary" gutterBottom>
                  Value: {device.value}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Min Value: {device.min_value}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Max Value: {device.max_value}
                </Typography>
                <Button
                  variant="contained"
                  style={{ marginTop: "10px" }}
                  onClick={() => {
                    console.log("Read More Click:", device, "\n INDEX:", index);
                    handleSwitchReadMoreClick(device._id);
                  }}
                >
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
          <Card variant="outlined" sx={{ borderColor: "#1976d2" }}>
            <CardContent
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                component="h2"
                style={{
                  color: "blue",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <AddDeviceForm room={room} fetchDevices={fetchDevices} />
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Dialog for deleting device */}
      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleCloseDeleteConfirmation}
      >
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this device?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmation} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDeleteDevice(selectedDeviceId);
              handleCloseDeleteConfirmation();
            }}
            color="primary"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for updating device */}
      <Dialog open={updateDialogOpen} onClose={handleUpdateDialogClose}>
        <DialogContent>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <TextField
              label="Name"
              value={updatedDeviceInfo.name}
              onChange={(e) =>
                setUpdatedDeviceInfo({
                  ...updatedDeviceInfo,
                  name: e.target.value,
                })
              }
            />

            <TextField
              label="Type"
              value={updatedDeviceInfo.type}
              onChange={(e) =>
                setUpdatedDeviceInfo({
                  ...updatedDeviceInfo,
                  type: e.target.value,
                })
              }
            />

            {/* <TextField
              label="State"
              value={updatedDeviceInfo.state}
              onChange={(e) =>
                setUpdatedDeviceInfo({
                  ...updatedDeviceInfo,
                  state: e.target.value,
                })
              }
            /> */}

            <FormControlLabel
              control={
                <Switch
                  checked={updatedDeviceInfo.state}
                  onChange={(e) =>
                    setUpdatedDeviceInfo({
                      ...updatedDeviceInfo,
                      state: e.target.checked,
                    })
                  }
                />
              }
              label="State"
            />

            <TextField
              label="Value"
              value={updatedDeviceInfo.value}
              onChange={(e) =>
                setUpdatedDeviceInfo({
                  ...updatedDeviceInfo,
                  value: e.target.value,
                })
              }
            />

            <TextField
              label="Min Value"
              value={updatedDeviceInfo.min_value}
              onChange={(e) =>
                setUpdatedDeviceInfo({
                  ...updatedDeviceInfo,
                  min_value: e.target.value,
                })
              }
            />

            <TextField
              label="Max Value"
              value={updatedDeviceInfo.max_value}
              onChange={(e) =>
                setUpdatedDeviceInfo({
                  ...updatedDeviceInfo,
                  max_value: e.target.value,
                })
              }
            />
          </div>

          {/* Add more fields for other device properties */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateDialogConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Devices_Tables
        selectedDevice_Table={selectedDevice_Table}
      ></Devices_Tables>
    </>
  );
};

export default Devices;
