import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Devices from "./Devices";
import {
  Box,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { blue } from '@mui/material/colors';

import Add_New_Room from "@/component/Client/Add_New_Room";

const Room_TabPanel = ({ value, rooms, socket }) => {
  const [room, setRoom] = useState(null);

  useEffect(() => {
    // if (rooms && rooms.length > 0 && value >= 0 && value < rooms.length) {
      setRoom(rooms[value]);
    // } else {
    //   setRoom(null); // Handle the case where rooms or value might not be valid
    // }
  }, [value, rooms]);

  return (
    <>
      {room && (
        <div>
          <Container
            fixed
            sx={{
              border: "2px solid #1976d2",
              borderRadius: "25px 0",
              height: "auto",
              mt: 3,
              alignItems: "center",
              padding: "10px",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={10}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ fontSize: '3rem', color: blue[900] }} />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h2 style={{ color: "#0d47a1" }}>
                      <strong>{room.name}</strong>
                      <span style={{ color: "#1976d2" }}> Select Room's</span>
                    </h2>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          disabled
                          id="outlined-required"
                          label="Name"
                          defaultValue={room.name}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          disabled
                          id="outlined-required"
                          label="Type"
                          defaultValue={room.type}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          disabled
                          id="outlined-required"
                          label="Devices"
                          defaultValue={
                            room.devices && room.devices.length > 0
                              ? room.devices.length
                              : "No devices available"
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          disabled
                          id="outlined-required"
                          label="ID"
                          defaultValue={room._id}
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
              <Grid item xs={12} md={2} sx={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>

                <Add_New_Room socket={socket} />

              </Grid>
            </Grid>
          </Container>
        </div>
      )}
      <Devices value={value} room={room} socket={socket} />
    </>
  );
};

Room_TabPanel.propTypes = {
  value: PropTypes.number.isRequired,
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      _id: PropTypes.string.isRequired,
      devices: PropTypes.array.isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  socket: PropTypes.object.isRequired,
};

export default Room_TabPanel;
