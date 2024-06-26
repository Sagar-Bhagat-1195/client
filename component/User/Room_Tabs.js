import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { IconButton } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Badge from '@mui/material/Badge';

import Room_TabPanel from "./Room_TabPanel"; // Import the TabPanel component

const Room_Tabs = (props) => {
  const { rooms } = props;
  const [value, setValue] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleScrollLeft = () => {
    setScrollPosition(Math.max(0, scrollPosition - 1));
  };

  const handleScrollRight = () => {
    setScrollPosition(Math.min(rooms.length - 1, scrollPosition + 1));
  };

  return (
    <div>
      {/* <h1>Lab Tabs</h1> */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Badge badgeContent={rooms.length } color={rooms.length < 0 ? "error" : "primary"}>
          <h2><strong style={{ color: "#1976d2" }}>All Room'S</strong></h2>
        </Badge>
      </div>


      <div style={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={handleScrollLeft} disabled={scrollPosition === 0}>
          <ArrowLeftIcon />
        </IconButton>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable" // Set variant to "scrollable"
          scrollButtons="auto"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable auto tabs example"
          sx={{ minWidth: "80px", margin: "0 auto" }} // Center the tabs
        >
          {rooms.map((room, index) => (
            <Tab key={index} label={room.name} value={index} />
          ))}
        </Tabs>
        <IconButton
          onClick={handleScrollRight}
          disabled={scrollPosition === rooms.length - 1}
        >
          <ArrowRightIcon />
        </IconButton>
      </div>
      <Room_TabPanel value={value} rooms={rooms} />
    </div>
  );
};

export default Room_Tabs;
