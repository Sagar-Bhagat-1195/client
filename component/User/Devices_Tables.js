import React from "react";
import {
  Box,
  Grid,
  Item,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Badge from "@mui/material/Badge";
// import MailIcon from '@mui/icons-material/Mail';
// import CommentIcon from "@mui/icons-material/Comment";
import Devices_Charts from "./Devices_Charts";


const Devices_Tables = ({ selectedDevice_Table }) => {
  return (
    <>
      <div>
        <h1>This is the devices Table's</h1>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box mt={2} mb={5}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <h2>
                          {selectedDevice_Table ? (
                            <strong style={{ color: "#1976d2" }}>
                              {selectedDevice_Table.name
                                .charAt(0)
                                .toUpperCase() +
                                selectedDevice_Table.name.slice(1)}
                              's{" "}
                              <Badge
                                badgeContent={
                                  selectedDevice_Table.stateLog.length
                                }
                                color="primary"
                              >
                                <strong style={{ color: "#000000" }}>
                                  Status Table
                                </strong>
                              </Badge>
                            </strong>
                          ) : (
                            <strong style={{ color: "#000000" }}>
                              Status Table
                            </strong>
                          )}
                          {/* <Badge badgeContent={5} color="primary">
                            <CommentIcon color="action" />
                          </Badge> */}
                        </h2>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedDevice_Table.stateLog &&
                    selectedDevice_Table.stateLog.length > 0 ? (
                      selectedDevice_Table.stateLog.map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            {new Date(entry.time).toLocaleString("en-US", {
                              timeZone: "Asia/Kolkata",
                              hour12: false,
                            })}
                          </TableCell>
                          <TableCell>{entry.state ? "On" : "Off"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <strong style={{ color: "red" }}>
                            Device data is not available.
                          </strong>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box mt={2} mb={5}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <h2>
                          {selectedDevice_Table ? (
                            <strong style={{ color: "#1976d2" }}>
                              {selectedDevice_Table.name
                                .charAt(0)
                                .toUpperCase() +
                                selectedDevice_Table.name.slice(1)}
                              's{" "}
                              <Badge
                                badgeContent={
                                  selectedDevice_Table.valueLog.length
                                }
                                color="primary"
                              >
                                <strong style={{ color: "#000000" }}>
                                  Value Table
                                </strong>
                              </Badge>
                            </strong>
                          ) : (
                            <strong style={{ color: "#000000" }}>
                              Value Table
                            </strong>
                          )}
                        </h2>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedDevice_Table.valueLog &&
                    selectedDevice_Table.valueLog.length > 0 ? (
                      selectedDevice_Table.valueLog.map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell>{index+1}</TableCell>
                          <TableCell>
                            {new Date(entry.time).toLocaleString("en-US", {
                              timeZone: "Asia/Kolkata",
                              hour12: false,
                            })}
                          </TableCell>
                          <TableCell>{entry.value}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <strong style={{ color: "red" }}>
                            Device data is not available.
                          </strong>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        </Grid>
      </div>
      <Devices_Charts  selectedDevice_Table={selectedDevice_Table}></Devices_Charts>
    </>
  );
};

export default Devices_Tables;



