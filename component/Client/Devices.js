import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    CssBaseline,
    Box,
    Container,
    Card,
    CardContent,
    Typography,
    FormControlLabel,
    Switch,
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Grid,
} from "@mui/material";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CustomSnackbar from "./CustomSnackbar";
import AddDeviceForm from "./AddDeviceForm";
import EnvironmentVariables from '@/component/env';
import Arduino_Api from "./Arduino_Api";
import Table_Device from "./Table_Device";
import Graph_Device from "./Graph_Device";



/*

use main Dark Color :#0d47a1 || 900  ||  Dark Color || Font Dark Color
use main Midd Color :#1976d2 || 700  || Boder Color || Font Light Color
use main lite Color :#64b5f6 || 300  || select color 
use main lite Color :#bbdefb || 100  || Bg Color

 "#64b5f6" : "#bbdefb",
*/


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
        console.log("Device Card Clicked:");
        setSelectedDeviceId({ deviceId, roomId });
    };

    const handleSwitchToggle = async (deviceId, roomId, newState) => {
        try {
            console.log("handleSwitchToggle", { state: newState });
            socket.emit("handle_SwitchToggle", {
                state: newState,
                deviceId: deviceId,
                roomId: roomId,
            });
        } catch (error) {
            console.error("Error occurred while handling switch toggle:", error);
        }
    };

    const handleDeleteDevice = async () => {
        try {
            console.log("handleDeleteDevice :");
            console.log("deviceId :", selectedDeviceId.deviceId);
            console.log("roomId :", selectedDeviceId.roomId);
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
        setDeleteConfirmationOpen(false);
    };

    const handleUpdateDevice = async (deviceId, roomId) => {
        console.log("handleUpdateDevice :");
        console.log("deviceId :", deviceId);
        console.log("roomId :", roomId);
        try {
            setSelectedDeviceId({ deviceId, roomId });
            const { name, type, state, value, min_value, max_value } = devices.find(
                (device) => device._id === deviceId
            );

            setUpdatedDeviceInfo({ name, type, state, value, min_value, max_value });
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
    };

    const handleUpdateDialogConfirm = async () => {
        console.log("handleUpdateDialogConfirm : ");
        console.log("deviceId :", selectedDeviceId.deviceId);
        console.log("roomId :", selectedDeviceId.roomId);
        try {
            const user_data = JSON.parse(localStorage.getItem("user-data"));
            const response = await axios.put(
                `${MAIN_URL}/device/${selectedDeviceId.roomId}/${selectedDeviceId.deviceId}`,
                updatedDeviceInfo,
                {
                    headers: {
                        "auth-token": user_data.authToken,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Update Device Response:", response.data.devices);
            setUpdateDialogOpen(false);
        } catch (error) {
            console.error("Error updating device:", error);
        }
    };

    return (
        <>
            <Container style={{ border: "2px solid #1976d2", padding: "10px", borderRadius: "0 25px", marginTop: "25px" }}>
                <Grid container spacing={2}>
                    {devices.map((device, index) => (
                        <Grid item xs={12} sm={6} md={3} lg={2} key={index}>
                            <Card
                                variant="outlined"
                                sx={{
                                    borderColor: "#1976d2",
                                    bgcolor: device._id === selectedDeviceId.deviceId ? "#64b5f6" : "#bbdefb",
                                    boxShadow: "0 0 5px 5px #1976d230 "
                                }}
                                onClick={() => handleSelectDeviceCardClick(device._id, device.room_owner)}
                            >
                                <CardContent>
                                    <EditNoteIcon
                                        onClick={() => handleUpdateDevice(device._id, device.room_owner)}
                                        style={{ color: "#1565c0", cursor: "pointer", transition: "color 0.3s ease" }}
                                    />
                                    <DeleteSweepIcon
                                        onClick={() => handleOpenDeleteConfirmation(device._id, device.room_owner)}
                                        style={{ color: "#dc3545", cursor: "pointer", transition: "color 0.3s ease" }}
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
                                                onChange={() => handleSwitchToggle(device._id, device.room_owner, !device.state)}
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
                                        onClick={() => handleSwitchReadMoreClick(device._id)}
                                    >
                                        Read More
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <Card variant="outlined" sx={{ borderColor: "#1976d2" }}>
                            <CardContent
                                style={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}
                            >
                                <Typography variant="h6" component="h2" style={{ color: "blue" }}>
                                    <AddDeviceForm room={room} socket={socket} />
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Dialog open={deleteConfirmationOpen} onClose={handleCloseDeleteConfirmation}>
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

                <Dialog open={updateDialogOpen} onClose={handleUpdateDialogClose}>
                    <DialogContent>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <TextField
                                label="Name"
                                value={updatedDeviceInfo.name}
                                onChange={(e) => setUpdatedDeviceInfo({ ...updatedDeviceInfo, name: e.target.value })}
                            />

                            <TextField
                                label="Type"
                                value={updatedDeviceInfo.type}
                                onChange={(e) => setUpdatedDeviceInfo({ ...updatedDeviceInfo, type: e.target.value })}
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={updatedDeviceInfo.state}
                                        onChange={(e) => setUpdatedDeviceInfo({ ...updatedDeviceInfo, state: e.target.checked })}
                                    />
                                }
                                label="State"
                            />

                            <TextField
                                label="Value"
                                value={updatedDeviceInfo.value}
                                onChange={(e) => setUpdatedDeviceInfo({ ...updatedDeviceInfo, value: e.target.value })}
                            />

                            <TextField
                                label="Min Value"
                                value={updatedDeviceInfo.min_value}
                                onChange={(e) => setUpdatedDeviceInfo({ ...updatedDeviceInfo, min_value: e.target.value })}
                            />

                            <TextField
                                label="Max Value"
                                value={updatedDeviceInfo.max_value}
                                onChange={(e) => setUpdatedDeviceInfo({ ...updatedDeviceInfo, max_value: e.target.value })}
                            />
                        </div>
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

                <CustomSnackbar
                    SnackbarMessage={SnackbarMessage}
                    setSnackbarMessage={setSnackbarMessage}
                ></CustomSnackbar>

            </Container>

            <Table_Device selectedDeviceId={selectedDeviceId} room={room}></Table_Device>
            <Graph_Device selectedDeviceId={selectedDeviceId} room={room}></Graph_Device>
            {/* <Arduino_Api selectedDeviceId={selectedDeviceId} room={room} ></Arduino_Api> */}

        </>
    );
};

export default Devices;
