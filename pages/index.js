import io from "socket.io-client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ClientSecure from "@/component/secure/ClientSecure";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Room_Tabs from "../component/Client/Room_Tabs"; // Import the LabTabs component
import Button from "@mui/material/Button";
// import Add_New_Room from "@/component/Client/Add_New_Room";
import EnvironmentVariables from '@/component/env';


const MAIN_URL = EnvironmentVariables.MAIN_URL;


let socket;
export default function Home() {
  const [clientData, setUserData] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Fetch devices on component mount
    // fetchDevices();
    const client_Data = JSON.parse(localStorage.getItem("client-data"));
    setUserData(client_Data);
    const token = client_Data ? client_Data.authToken : ""; // Add null check
    console.log(token);

    socket = io(MAIN_URL, {
      transports: ["websocket"],
      query: {
        Authorization: token,
      },
    });

    socket.on("rooms", ({ rooms }) => {
      console.log("Received rooms details:", rooms);
      setRooms(rooms);
    });

    // socket.on("errorMessage", (data) => {
    //   console.log("errorMessage", data);
    // });

    // socket.on("verifyError", (data) => {
    //   console.log("verifyError", data);
    // });

    return () => {
      // Cleanup the socket connection on component unmount
      socket.disconnect();
    };
  }, []);

  // useEffect(() => {
  //   // fetchRooms();
  // }, []);

  return (
    <ClientSecure>
      <Container maxWidth="ls">
        <div style={{ textAlign: "center" }}>
          <Box mt={5} mb={3}>
            <h1>
              {clientData ? (
                <strong style={{ color: "#1976d2" }}>
                  {clientData.name.charAt(0).toUpperCase() +
                    clientData.name.slice(1)}
                  {"'S "}
                  <strong style={{ color: "#000000" }}> Client Dashboard</strong>
                </strong>
              ) : (
                <strong style={{ color: "#000000" }}>Client Dashboard</strong>
              )}
            </h1>
          </Box>
          {/* Render your other components here, such as Tabs, Dialogs, etc. */}
          {/* <Add_New_Room socket={socket} /> */}
          <Room_Tabs rooms={rooms} socket={socket} />
        </div>
      </Container>
    </ClientSecure>
  );
}
