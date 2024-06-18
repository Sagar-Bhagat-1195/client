import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Devices from "./Devices";

// Use TabPanel component as needed

const Room_TabPanel = ({ value, rooms ,socket }) => {
  const room = rooms[value]; // Get the room corresponding to the selected value
  // console.log("TabPanel");
  console.log(room);
  // console.log(value);
  // console.log(rooms.length - 1);

  // Conditional logging of room devices

  return (
    <>
      <h1>TabPanel</h1>

      {room && (
        <div>
          <h2>{room.name}</h2>
          <p>Type: {room.type}</p>
          <p>ID: {room._id}</p>
          <p>Devices: {room.devices.join(", ")}</p>
          <p>Created At: {new Date(room.createdAt).toLocaleString()}</p>
          <p>Updated At: {new Date(room.updatedAt).toLocaleString()}</p>
        </div>
      )}
      <Container fixed style={{ border: "2px solid #1976d2" }}>
        {/* <Box sx={{ bgcolor: "", height: "100vh" }} />     */}
        <Box sx={{ bgcolor: "", height: "auto" }}>
          {/* <Devices value={value} rooms={rooms}></Devices> */}
          <Devices value={value} room={room} socket={socket} ></Devices>
        </Box>
      </Container>
    </>
  );
};

Room_TabPanel.propTypes = {
  value: PropTypes.number.isRequired, // Checks if value is a number
  rooms: PropTypes.arrayOf(
    // Checks if rooms is an array
    PropTypes.shape({
      // Checks each element of rooms to have the following shape
      name: PropTypes.string.isRequired, // Checks if name is a required string
      type: PropTypes.string.isRequired, // Checks if type is a required string
      _id: PropTypes.string.isRequired, // Checks if _id is a required string
      devices: PropTypes.array.isRequired, // Checks if devices is a required array
      createdAt: PropTypes.string.isRequired, // Checks if createdAt is a required string
      updatedAt: PropTypes.string.isRequired, // Checks if updatedAt is a required string
    })
  ).isRequired, // Makes sure rooms array is required
};

export default Room_TabPanel;
