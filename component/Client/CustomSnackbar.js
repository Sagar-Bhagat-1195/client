import React from "react";
import { Snackbar } from "@mui/material";

const CustomSnackbar = ({SnackbarMessage,setSnackbarMessage}) => {
  const handleCloseSnackbar = () => {
    setSnackbarMessage("");
  };

  return (
    <>
      <div>
        <Snackbar
          open={!!SnackbarMessage}
          autoHideDuration={6000}
          type="success"
          onClose={handleCloseSnackbar}
          message={SnackbarMessage}
        />
      </div>
    </>
  );
};

export default CustomSnackbar;
