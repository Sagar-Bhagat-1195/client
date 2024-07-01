import React, { useState, useEffect, Suspense } from 'react';
import {
    Container,
    Typography,
    Grid,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    styled,
    Badge,
    TextField
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// Lazy load PieChart component
const PieChart = React.lazy(() => import('@mui/x-charts/PieChart').then(module => ({ default: module.PieChart })));

// Custom styled table cell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#64b5f6",
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

// Custom styled table row
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: "#bbdefb",
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    borderRadius: "10px",
    marginTop: "5px",
    marginBottom: "5px",
}));

// Styled Paper component
const Item = styled(Paper)({
    padding: '10px',
    textAlign: 'center',
    color: '#1976d2',
});

const Table_Device = ({ room, selectedDeviceId }) => {
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // Fetch the selected device based on the selectedDeviceId
    useEffect(() => {
        if (room && room.devices && selectedDeviceId) {
            const device = room.devices.find(
                (device) => device._id === selectedDeviceId.deviceId
            );
            setSelectedDevice(device);
        }
    }, [room, selectedDeviceId]);

    // Filter logs by selected date range
    const filterLogsByDate = (logs, start, end) => {
        return logs.filter((log) => {
            const logDate = new Date(log.time);
            if (start && logDate < new Date(start)) return false;
            if (end && logDate > new Date(end)) return false;
            return true;
        });
    };

    const filteredStateLogs = selectedDevice ? filterLogsByDate(selectedDevice.stateLog, startDate, endDate) : [];
    const filteredValueLogs = selectedDevice ? filterLogsByDate(selectedDevice.valueLog, startDate, endDate) : [];

    return (
        <Container
            fixed
            style={{
                border: "2px solid #1976d2",
                borderRadius: "25px 0",
                marginTop: "25px",
                padding: "10px",
                marginBottom: "25px",
            }}
        >
            {selectedDevice ? (
                <>
                    <Typography variant="h5" style={{ color: "#0d47a1" }}>
                        <strong>{selectedDevice.name}</strong>
                        <span style={{ color: "#1976d2" }}> Selected Device's</span>
                    </Typography>
                    <Typography variant="body1">
                        Device ID: {selectedDevice._id}
                    </Typography>
                    <Typography variant="body1">
                        Room ID: {selectedDeviceId.roomId}
                    </Typography>
                    <Container
                        fixed
                        style={{
                            border: "2px solid #1976d2",
                            borderRadius: "25px 0",
                            marginTop: "25px",
                            padding: "10px",
                        }}
                    >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Grid container spacing={2} justifyContent="center">
                                <Grid item xs={6}>
                                    <DatePicker
                                        label="Start Date"
                                        value={startDate}
                                        onChange={(newValue) => setStartDate(newValue)}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <DatePicker
                                        label="End Date"
                                        value={endDate}
                                        onChange={(newValue) => setEndDate(newValue)}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </Grid>
                            </Grid>
                        </LocalizationProvider>
                    </Container>
                    <Container
                        fixed
                        style={{
                            border: "2px solid #1976d2",
                            borderRadius: "0 25px",
                            padding: "10px",
                            marginBottom: "25px",
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Item variant="outlined" sx={{ borderColor: "#1976d2", maxHeight: '400px', overflowY: 'auto' }}>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell colSpan={3} align="center">
                                                        <h2>
                                                            <strong style={{ color: "#1976d2" }}>
                                                                {selectedDevice.name.charAt(0).toUpperCase() + selectedDevice.name.slice(1)}{" "}
                                                                <Badge
                                                                    badgeContent={filteredStateLogs.length}
                                                                    color="primary"
                                                                >
                                                                    <strong style={{ color: "#000000" }}>
                                                                        Status Table
                                                                    </strong>
                                                                </Badge>
                                                            </strong>
                                                        </h2>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <StyledTableCell>ID</StyledTableCell>
                                                    <StyledTableCell>Time</StyledTableCell>
                                                    <StyledTableCell>Status</StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {filteredStateLogs.length > 0 ? (
                                                    filteredStateLogs.map((entry, index) => (
                                                        <StyledTableRow key={index}>
                                                            <StyledTableCell>{index + 1}</StyledTableCell>
                                                            <StyledTableCell>
                                                                {new Date(entry.time).toLocaleString("en-US", {
                                                                    timeZone: "Asia/Kolkata",
                                                                    hour12: false,
                                                                })}
                                                            </StyledTableCell>
                                                            <StyledTableCell>{entry.state ? "On" : "Off"}</StyledTableCell>
                                                        </StyledTableRow>
                                                    ))
                                                ) : (
                                                    <StyledTableRow>
                                                        <StyledTableCell colSpan={3} align="center">
                                                            <strong style={{ color: "red" }}>
                                                                No data available for the selected date range.
                                                            </strong>
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Item>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Item variant="outlined" sx={{ borderColor: "#1976d2", maxHeight: '400px', overflowY: 'auto' }}>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell colSpan={3} align="center">
                                                        <h2>
                                                            <strong style={{ color: "#1976d2" }}>
                                                                {selectedDevice.name.charAt(0).toUpperCase() + selectedDevice.name.slice(1)}{" "}
                                                                <Badge
                                                                    badgeContent={filteredValueLogs.length}
                                                                    color="primary"
                                                                >
                                                                    <strong style={{ color: "#000000" }}>
                                                                        Status Value
                                                                    </strong>
                                                                </Badge>
                                                            </strong>
                                                        </h2>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <StyledTableCell>ID</StyledTableCell>
                                                    <StyledTableCell>Time</StyledTableCell>
                                                    <StyledTableCell>Value</StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {filteredValueLogs.length > 0 ? (
                                                    filteredValueLogs.map((entry, index) => (
                                                        <StyledTableRow key={index}>
                                                            <StyledTableCell>{index + 1}</StyledTableCell>
                                                            <StyledTableCell>
                                                                {new Date(entry.time).toLocaleString("en-US", {
                                                                    timeZone: "Asia/Kolkata",
                                                                    hour12: false,
                                                                })}
                                                            </StyledTableCell>
                                                            <StyledTableCell>{entry.value}</StyledTableCell>
                                                        </StyledTableRow>
                                                    ))
                                                ) : (
                                                    <StyledTableRow>
                                                        <StyledTableCell colSpan={3} align="center">
                                                            <strong style={{ color: "red" }}>
                                                                No data available for the selected date range.
                                                            </strong>
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Item>
                            </Grid>
                        </Grid>
                    </Container>
                </>
            ) : (
                <Typography variant="body1" style={{ color: "#dc3545" }}>
                    No device selected or device not found...
                </Typography>
            )}
        </Container>
    );
};

export default Table_Device;
