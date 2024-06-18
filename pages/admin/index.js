import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSecure from "@/component/secure/AdminSecure";
// import CircularProgress from "@mui/material/CircularProgress";
import { Formik, Form, Field, ErrorMessage } from "formik"; // Import Formik components
import * as Yup from "yup"; // Import Yup for validation schema

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Container,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  TableContainer,
  Paper,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Badge from '@mui/material/Badge';

import EnvironmentVariables from '@/component/env';
const SUPER_ADMIN_API_KEY = EnvironmentVariables.SUPER_ADMIN_API_KEY;
const MAIN_URL = EnvironmentVariables.MAIN_URL;

const validationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(1, "Name is too short")
    .max(20, "Name is too long"),
  phone: Yup.string()
    .required("Phone is required")
    .min(10, "Phone is too short")
    .max(10, "Phone is too long"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password is too short")
    .max(12, "Password is too long"),
});

// Define validation schema using Yup
const editUserValidationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(1, "Name is too short")
    .max(20, "Name is too long"),
  phone: Yup.string()
    .required("Phone is required")
    .min(10, "Phone is too short")
    .max(10, "Phone is too long"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const AdminDashboard = () => {
  const [userData, setUserData] = useState([]);
  const [adminData, setAdminData] = useState([]);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [editUser, setEditUser] = useState({
    _id: "",
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [showSignupForm, setShowSignupForm] = useState(false); // State to toggle signup form visibility

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const adminData = JSON.parse(localStorage.getItem("admin-data"));
      setAdminData(adminData);
      const response = await axios.get(MAIN_URL + "/user/all", {
        headers: {
          "auth-token": adminData.authToken,
          "Content-Type": "application/json",
        },
      });
      // console.log(response.data);
      setUserData(response.data.userdata);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setOpenEditPopup(true);
  };

  const handleCloseEditPopup = () => {
    setOpenEditPopup(false);
  };


  const handleEditSubmit = async (values, { setSubmitting }) => {
    try {
      // Update editUser state with the new values
      setEditUser(values);

      const adminData = JSON.parse(localStorage.getItem("admin-data"));

      await axios.put(
        MAIN_URL + `/user/update/${editUser._id}`, // Accessing ID from values
        values, // Use the updated form data (values)
        {
          headers: {
            "auth-token": adminData.authToken,
            "Content-Type": "application/json",
          },
        }
      );

      handleCloseEditPopup();
      fetchData(); // Assuming fetchData fetches the updated user data
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user profile. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };


  const handleDeleteConfirmation = (userId) => {
    setDeleteConfirmation(true);
    setUserIdToDelete(userId);
  };

  const handleCloseConfirmationDialog = () => {
    setDeleteConfirmation(false);
    setUserIdToDelete(null);
  };

  const handleDeleteUser = async () => {
    try {
      const adminData = JSON.parse(localStorage.getItem("admin-data"));

      await axios.delete(MAIN_URL + `/user/${userIdToDelete}`, {
        headers: {
          "auth-token": adminData.authToken,
          "Content-Type": "application/json",
        },
      });

      fetchData();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again later.");
    } finally {
      handleCloseConfirmationDialog();
    }
  };

  return (
    <AdminSecure>
      <Container maxWidth="md">
        <div style={{ textAlign: "center" }}>
          <Box mt={5} mb={3}>
            <h1>{adminData && adminData.name}s Admin Dashboard</h1>
          </Box>

          {/* Button to toggle signup form */}
          <Box mt={2} mb={2} width="60%" margin="auto">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowSignupForm(true)}
              fullWidth // This prop makes the button take the full width of its container
            >
              <PersonAddIcon />
              &nbsp; Add New User
            </Button>
          </Box>

          <Dialog
            open={showSignupForm}
            onClose={() => setShowSignupForm(false)}
          >
            <DialogTitle>
              <Box display="flex" alignItems="center">
                <PersonAddIcon />
                &nbsp; New User
              </Box>
            </DialogTitle>

            <DialogContent>
              <Formik
                initialValues={{
                  name: "",
                  phone: "",
                  email: "",
                  password: "",
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    const adminData = JSON.parse(
                      localStorage.getItem("admin-data")
                    );

                    await axios.post(
                      MAIN_URL + `/user/signup/`,
                      values,
                      {
                        headers: {
                          "auth-token": adminData.authToken,
                          "Content-Type": "application/json",
                        },
                      }
                    );

                    console.log("User signed up successfully!");

                    // Close the signup form
                    setShowSignupForm(false);

                    // Fetch updated user data
                    fetchData();
                  } catch (error) {
                    console.error("Error signing up:", error); // Log the error in the console
                    if (error.response && error.response.data) {
                      console.log("Error response data:", error.response.data);
                      // alert("Failed to sign up user. " + JSON.stringify(error.response.data));
                      alert(
                        "Failed to sign up user." + error.response.data.error
                      );
                    } else {
                      alert("An error occurred. Please try again later.");
                    }
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({
                  isSubmitting,
                  handleChange,
                  handleBlur,
                  values,
                  errors,
                  touched,
                }) => (
                  <Form>
                    <TextField
                      label="Name"
                      name="name"
                      fullWidth
                      margin="normal"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                    />
                    <TextField
                      label="Phone"
                      name="phone"
                      fullWidth
                      margin="normal"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phone}
                      error={touched.phone && Boolean(errors.phone)}
                      helperText={touched.phone && errors.phone}
                    />
                    <TextField
                      label="Email"
                      name="email"
                      fullWidth
                      margin="normal"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                    <TextField
                      label="Password"
                      name="password"
                      fullWidth
                      margin="normal"
                      type="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                    />
                    <DialogActions>
                      <Button onClick={() => setShowSignupForm(false)}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Signing Up..." : "Sign Up"}
                      </Button>
                    </DialogActions>
                  </Form>
                )}
              </Formik>
            </DialogContent>
          </Dialog>
          <Box mt={2} mb={5}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Badge badgeContent={userData.length} color={userData.length < 0 ? "error" : "primary"}>
                        <h2><strong style={{ color: "#1976d2" }}>Available User S  </strong></h2>
                      </Badge>


                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userData && userData.length > 0 ? (
                    userData.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <IconButton
                              aria-label="edit"
                              color="primary"
                              onClick={() => handleEditClick(user)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              color="error"
                              onClick={() => handleDeleteConfirmation(user._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <strong style={{ color: "red" }}>
                          User is not available.
                        </strong>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </div>
      </Container>
      {/* <Dialog open={openEditPopup} onClose={handleCloseEditPopup}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={editUser.name}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone"
            value={editUser.phone}
            onChange={(e) =>
              setEditUser({ ...editUser, phone: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={editUser.email}
            onChange={(e) =>
              setEditUser({ ...editUser, email: e.target.value })
            }
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditPopup}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* // Inside the component, in the Dialog component for editing user */}
      <Dialog open={openEditPopup} onClose={handleCloseEditPopup}>
        <Formik
          initialValues={{
            name: editUser.name,
            phone: editUser.phone,
            email: editUser.email,
          }}
          validationSchema={editUserValidationSchema}
          onSubmit={handleEditSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <Form>
              <DialogTitle>Edit User</DialogTitle>
              <DialogContent>
                <TextField
                  label="Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Phone"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.phone && Boolean(errors.phone)}
                  helperText={touched.phone && errors.phone}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  fullWidth
                  margin="normal"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseEditPopup}>Cancel</Button>
                <Button type="submit" color="primary" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
      <Dialog open={deleteConfirmation} onClose={handleCloseConfirmationDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this user?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationDialog}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </AdminSecure>
  );
};

export default AdminDashboard;
