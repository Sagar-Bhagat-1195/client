import React, { useState, useEffect, Suspense } from 'react';
import {
    Container,
    Typography,
    Grid,
    Paper,
    styled,
    TextField
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

// Lazy load LineChart component
const LineChart = React.lazy(() => import('@mui/x-charts/LineChart').then(module => ({ default: module.LineChart })));

// Styled Paper component
const Item = styled(Paper)({
    padding: '10px',
    textAlign: 'center',
    color: '#1976d2',
});

const Graph_Device = ({ room, selectedDeviceId }) => {
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // Fetch the selected device based on the selectedDeviceId
    useEffect(() => {
        if (room?.devices && selectedDeviceId?.deviceId) {
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

    // Log filtered logs to the console
    console.log("Filtered State Logs:", filteredStateLogs);
    console.log("Filtered Value Logs:", filteredValueLogs);

    // Prepare data for LineCharts with x-axis from 1 to 100 for testing
    const xAxisData = Array.from({ length: 56 }, (_, i) => i + 1);

    // Prepare data for LineCharts
    const valueChartData = {
        // xAxis: [{ data: filteredValueLogs.map(log => new Date(log.time).toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour12: false })) }],
        // xAxis: [{ data: xAxisData }],
        xAxis: [{ 
            data: filteredValueLogs.map(log => 
              new Date(log.time).toLocaleString("en-US", { 
                timeZone: "Asia/Kolkata", 
                hour12: false, 
                month: '2-digit', 
                day: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit' 
              })
            ) 
          }],
          
        series: [{ data: filteredValueLogs.map(log => log.value) }],
    };
    console.log("------------------------------------");
    console.log(valueChartData.xAxis);

    // const valueChartData = {
    //     xAxis: {
    //         type: 'category',
    //         data: filteredValueLogs.map(log => 
    //             new Date(log.time).toLocaleString("en-US", { 
    //                 timeZone: "Asia/Kolkata", 
    //                 hour12: false, 
    //                 month: '2-digit', 
    //                 day: '2-digit', 
    //                 hour: '2-digit', 
    //                 minute: '2-digit' 
    //             })
    //         )
    //     },
    //     series: [{ data: filteredValueLogs.map(log => log.value) }],
    // };
    // console.log("------------------------------------");
    // // console.log(valueChartData.xAxis);
    // console.log(valueChartData.xAxis.data); // Should log the array of formatted dates




    // const statusChartData = {
    //     xAxis: [{ data: filteredStateLogs.map(log => new Date(log.time).toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour12: false })) }],
    //     series: [{ data: filteredStateLogs.map(log => log.status) }],
    // };


    const statusChartData = {
        // xAxis: [{ data: filteredStateLogs.map(log => dayjs(log.time).format('YYYY-MM-DD HH:mm:ss')) }],
        // series: [{ data: filteredStateLogs.map(log => log.status ? 1 : 0) }], // Convert true/false to 1/0 for chart

        xAxis: [{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] }],
        series: [{ data: [1, 0, 0, 1, 0, 3, 6, 8, 9, 10, 6, 3, 1] }], // Convert true/false to 1/0 for chart

    };

    // Log chart data to the console
    console.log("Value Chart Data:", valueChartData);
    console.log("Status Chart Data:", statusChartData);

    return (
        <div>
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
                                        <Suspense fallback={<div>Loading Chart...</div>}>
                                            <LineChart
                                                xAxis={statusChartData.xAxis}
                                                series={statusChartData.series}
                                                width={500}
                                                height={300}
                                            />
                                        </Suspense>
                                    </Item>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Item variant="outlined" sx={{ borderColor: "#1976d2", maxHeight: '400px', overflowY: 'auto' }}>
                                        <Suspense fallback={<div>Loading Chart...</div>}>
                                            <LineChart
                                                xAxis={valueChartData.xAxis.data}
                                                series={valueChartData.series}
                                                width={500}
                                                height={300}
                                            />
                                        </Suspense>
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
        </div>
    );
}

export default Graph_Device;
