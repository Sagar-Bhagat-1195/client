import React, { useState, useEffect } from "react";
import axios from "axios";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

import CustomSnackbar from "./CustomSnackbar";

import AddDeviceForm from "./AddDeviceForm";

import EnvironmentVariables from '@/component/env';

// const SUPER_ADMIN_API_KEY = EnvironmentVariables.SUPER_ADMIN_API_KEY;
const MAIN_URL = EnvironmentVariables.MAIN_URL;



const Devices = ({ room, socket }) => {
  const [devices, setDevices] = useState([]);
  // const [selectedDevice_Table, setSelectedDevice_Table] = useState("");

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState({
    deviceId: "",
    roomId: "",
  });

  const [SnackbarMessage, setSnackbarMessage] = useState("");

  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updatedDeviceInfo, setUpdatedDeviceInfo] = useState({
    name: "",
    type: "",
    state: false,
    value: 0,
    min_value: 0,
    max_value: 0,
  });
  

  useEffect(() => {
    if (room && room.devices) {
      setDevices(room.devices);
    }
  }, [room]);

  const handleSelectDeviceCardClick = (deviceId, roomId) => {
    // Your logic for handling the card click
    console.log("Device Card Clicked:");
    setSelectedDeviceId({ deviceId, roomId });
    // console.log("deviceId :", selectedDeviceId.deviceId);
    // console.log("roomId :", selectedDeviceId.roomId);
    // console.log(selectedDeviceId.deviceId);
    // You can perform additional actions here
    // setSelectedDevice_Table(deviceId);
  };

  const handleSwitchToggle = async (deviceId, roomId, newState) => {
    try {
      console.log("handleSwitchToggle", { state: newState });
      // Emit the "handleSocketAddNewRoom" event with room details
      socket.emit("handle_SwitchToggle", {
        state: newState,
        deviceId: deviceId,
        roomId: roomId,
      });
    } catch (error) {
      console.error("Error occurred while handling switch toggle:", error);
      // Handle the error as needed, such as displaying an error message to the user
    }
  };

  const handleDeleteDevice = async () => {
    try {
      console.log("handleDeleteDevice :");
      console.log("deviceId :", selectedDeviceId.deviceId);
      console.log("roomId :", selectedDeviceId.roomId);
      // Emit the "handleSocketAddNewRoom" event with room details
      socket.emit("handle_DeleteDevice", {
        deviceId: selectedDeviceId.deviceId,
        roomId: selectedDeviceId.roomId,
      });
    } catch (error) {
      console.error("Error deleting device:", error);
    }
  };

  const handleOpenDeleteConfirmation = (deviceId, roomId) => {
    setSnackbarMessage("handleOpenDeleteConfirmation");
    console.log("deviceId :", deviceId);
    console.log("roomId :", roomId);
    setSelectedDeviceId({ deviceId, roomId });
    setDeleteConfirmationOpen(true);
  };

  const handleCloseDeleteConfirmation = () => {
    // setSelectedDeviceId(null);
    setDeleteConfirmationOpen(false);
  };

  //------------------------------------------------------------------------------------------
  const handleUpdateDevice = async (deviceId, roomId) => {
    console.log("handleUpdateDevice :");
    console.log("deviceId :", deviceId);
    console.log("roomId :", roomId);
    try {
      setSelectedDeviceId({ deviceId, roomId });
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
    console.log(updatedDeviceInfo);
  }, [updatedDeviceInfo]);

  const handleUpdateDialogClose = () => {
    setUpdateDialogOpen(false);
    // setDevices(devices);
  };

  const handleUpdateDialogConfirm = async () => {
    console.log("handleUpdateDialogConfirm : ");
    console.log("deviceId :", selectedDeviceId.deviceId);
    console.log("roomId :", selectedDeviceId.roomId);
    try {
      const user_data = JSON.parse(localStorage.getItem("user-data"));
      const response = await axios.put(
        MAIN_URL+`/device/${selectedDeviceId.roomId}/${selectedDeviceId.deviceId}`,
        updatedDeviceInfo,
        {
          headers: {
            "auth-token": user_data.authToken,
            "Content-Type": "application/json",
          },
        }
      );
      //

      // Log the response
      console.log("Update Device Response:", response.data.devices);
      // setDevices(response.data.devices);

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
                ...(device._id === selectedDeviceId.deviceId
                  ? { bgcolor: "#64b5f6" } //Select
                  : { bgcolor: "#bbdefb" }),
              }}
              onClick={() => {
                console.log("Card Click");
                handleSelectDeviceCardClick(device._id, device.room_owner);
              }}
            >
              <CardContent>
                <EditNoteIcon
                  onClick={() => {
                    handleUpdateDevice(device._id, device.room_owner);
                    // handleSwitchReadMoreClick(device._id);
                  }}
                  style={{
                    color: "#1565c0",
                    cursor: "pointer",
                    transition: "color 0.3s ease",
                  }}
                />
                <DeleteSweepIcon
                  onClick={() => {
                    handleOpenDeleteConfirmation(device._id, device.room_owner);
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
                        handleSwitchToggle(
                          device._id,
                          device.room_owner,
                          !device.state
                        );
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
                    handleSwitchReadMoreClick(device._id); // Assuming roomId is the correct property name
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
                <AddDeviceForm room={room} socket={socket} />
              </Typography>
            </CardContent>
          </Card>
        </Box>

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
                handleDeleteDevice();
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

        {/* <Snackbar
        open={!!SnackbarMessage}
        autoHideDuration={6000}
        type="success"
        onClose={handleCloseSnackbar}
        message={SnackbarMessage}
      /> */}

        <CustomSnackbar
          SnackbarMessage={SnackbarMessage}
          setSnackbarMessage={setSnackbarMessage}
        ></CustomSnackbar>
      </Container>
    </>
  );
};

export default Devices;
