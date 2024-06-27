import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Snackbar,
  SnackbarContent,
  IconButton,
} from "@mui/material";
import { FileCopyOutlined as FileCopyOutlinedIcon } from "@mui/icons-material";
import EnvironmentVariables from "@/component/env";

const Arduino_Api = ({ room, selectedDeviceId }) => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [arduinoCode, setArduinoCode] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (room && room.devices && selectedDeviceId) {
      const device = room.devices.find(
        (device) => device._id === selectedDeviceId.deviceId
      );
      setSelectedDevice(device);

      const clientData = JSON.parse(localStorage.getItem("client-data"));
      const token = clientData ? clientData.authToken : "";
      const MAIN_URL = EnvironmentVariables.MAIN_URL;

      const generatedArduinoCode = `
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ArduinoJson.h>

ESP8266WiFiMulti WiFiMulti;

void setup() {
  Serial.begin(115200);
  Serial.println();
  Serial.println("WEL COME To DEV SKY");
  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP("Dev Sky", "192837465");

  while (WiFiMulti.run() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }

  Serial.println("Connected to WiFi");
  delay(1000);
  MakeDeviceAPIRequestInArduino();
}

void loop() {
  // You can add your main code here if needed
}

void MakeDeviceAPIRequestInArduino() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    WiFiClient client; // Create a WiFiClient instance

    Serial.print("[HTTP] begin...\\n");

    if (http.begin(client, "${MAIN_URL}/device/${selectedDeviceId.roomId}")) {
      http.addHeader("Content-Type", "application/json");
      http.addHeader("auth-token", "${token}");

      Serial.print("[HTTP] GET...\\n");
      int httpCode = http.GET();

      if (httpCode > 0) {
        Serial.printf("[HTTP] GET... code: %d\\n", httpCode);

        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          String payload = http.getString();
          Serial.println("Response:");
          Serial.println(payload);
        }
      } else {
        Serial.printf("[HTTP] GET... failed, error: %s\\n", http.errorToString(httpCode).c_str());
      }

      http.end();
    } else {
      Serial.println("[HTTP] Unable to connect");
    }
  }
}

            `;

      setArduinoCode(generatedArduinoCode);
    } else {
      setSelectedDevice(null);
      setArduinoCode("");
    }
  }, [room, selectedDeviceId]);

  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(arduinoCode)
      .then(() => {
        setSnackbarMessage("Code copied successfully!");
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

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
              marginBottom: "25px",
              position: "relative",
            }}
          >
            <Typography variant="h6" style={{ marginBottom: "10px" }}>
              Arduino Code:
            </Typography>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                background: "#f5f5f5",
                padding: "10px",
                borderRadius: "5px",
                overflow: "auto",
                maxHeight: "400px",
                textAlign: "left",
              }}
            >
              <code style={{ textAlign: "left" }}>{arduinoCode}</code>
            </pre>
            <IconButton
              aria-label="Copy"
              onClick={handleCopyCode}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                color: "#1976d2",
              }}
            >
              <FileCopyOutlinedIcon />
            </IconButton>
          </Container>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <SnackbarContent message={snackbarMessage} />
          </Snackbar>
        </>
      ) : (
        <Typography variant="body1" style={{ color: "#dc3545" }}>
          No device selected or device not found...
        </Typography>
      )}
    </Container>
  );
};

export default Arduino_Api;
