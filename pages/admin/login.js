import React, { useState ,useEffect} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Container,
  Snackbar,
  Card,
  CardContent,
  CardMedia,
  Grid,
} from "@mui/material";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/router";

// Importing dotenv to load the environment variables
import dotenv from "dotenv";
dotenv.config();

import EnvironmentVariables from '@/component/env';

// npm install dotenv
// # or
// yarn add dotenv

// Accessing the environment variables

// const Super_Admin_API_KEY = process.env.NEXT_PUBLIC_SUPER_ADMIN_API_KEY;
// const Main_Url=process.env.NEXT_PUBLIC_MAIN_URL;

const SUPER_ADMIN_API_KEY = EnvironmentVariables.SUPER_ADMIN_API_KEY;
const MAIN_URL=EnvironmentVariables.MAIN_URL;


const Login = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  // const [superAdminApiKey, setSuperAdminApiKey] = useState("");

  // useEffect(() => {
  //   setSuperAdminApiKey(Super_Admin_API_KEY);
  //   console.log(superAdminApiKey);
  // }, []);

  // Now you can use these variables in your application logic
  console.log(SUPER_ADMIN_API_KEY);
  console.log(MAIN_URL);
  // console.log(nodeEnv);

  const validationSchema = Yup.object({
    // email:Yup.string().email().matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    //   .email('Invalid email address')
    //   .required('Email is required'),
    email: Yup.string()
      .email("Invalid email address")
      .matches(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Invalid email address"
      )
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password is too short")
      .max(12, "Password is too long"),
  });

  const handleCloseSnackbar = () => {
    setError("");
  };

  // const superAdminAuthToken =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2M2NhYmVhZTQxMzQzYTA4ZjdkZDY2NSIsImlhdCI6MTcxNTI1MjIwMn0.2ASoDe_ZQD1E0qFw_VUtUVSQxq_MgVoXVgJ8nltairg"; // Replace this with your actual token

  var headers = {
    "auth-token": SUPER_ADMIN_API_KEY,
    "Content-Type": "application/json",
  };

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={4} mb={4}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardMedia
                  component="img"
                  height="auto"
                  image="/image/admin/draw2.webp"
                  alt="Login Image"
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting, setStatus }) => {
                      try {
                        console.log(headers["auth-token"]); // Accessing using square bracket notation
                        const response = await axios.post(
                          MAIN_URL+"/admin/Login",
                          values,
                          { headers }
                        );
                        const { data } = response;

                        console.log(data);
                        // console.log(data.data);
                        const { _id, name, phone, email } = data.data;
                        const authToken = data.authToken;
                        const adminDataToStore = {
                          _id,
                          name,
                          phone,
                          email,
                          authToken,
                        };
                        localStorage.setItem(
                          "admin-data",
                          JSON.stringify(adminDataToStore)
                        );
                        // localStorage.setItem("auth-token", data.authToken );
                        router.push("/admin");
                      } catch (error) {
                        if (error.response && error.response.data) {
                          setError(error.response.data.message);
                        } else {
                          setError("An error occurred. Please try again.");
                          console.error("An error occurred:", error);
                        }
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                  >
                    {({ isSubmitting, errors, touched }) => (
                      <Form>
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                        >
                          <Typography variant="h5" gutterBottom>
                            Admin Login
                          </Typography>
                          <Field
                            as={TextField}
                            name="email"
                            type="email"
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            autoFocus
                            error={errors.email && touched.email}
                            helperText={<ErrorMessage name="email" />}
                          />
                          <Field
                            as={TextField}
                            name="password"
                            type="password"
                            label="Password"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            error={errors.password && touched.password}
                            helperText={<ErrorMessage name="password" />}
                          />
                          {error && (
                            <Typography
                              color="error"
                              style={{ marginTop: "0.5rem" }}
                            >
                              {error}
                            </Typography>
                          )}
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                            fullWidth
                            style={{ marginTop: "1rem" }}
                          >
                            {isSubmitting ? (
                              <CircularProgress size={24} />
                            ) : (
                              "Login"
                            )}
                          </Button>
                        </Box>
                      </Form>
                    )}
                  </Formik>
                  <Snackbar
                    open={!!error}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    message={error}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Container>
  );
};

export default Login;
