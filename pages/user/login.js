import React, { useState } from "react";
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
import EnvironmentVariables from '@/component/env';

// const SUPER_ADMIN_API_KEY = EnvironmentVariables.SUPER_ADMIN_API_KEY;
const MAIN_URL = EnvironmentVariables.MAIN_URL;


const Login = () => {
  const router = useRouter();
  const [error, setError] = useState("");

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

  // const userAuthToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjU3N2M5MjhmOGJmMTdkMTU1YTA2YyIsImlhdCI6MTcxMDYwNTc1NH0.6zZzWGS3rc2-pH5zG0vlgZ2QEZhAYUoipPJjY2kyZtI"; // Replace this with your actual token

  const headers = {
    // "auth-token": userAuthToken,
    // "Content-Type": "application/json",
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
                  image="/image/user/User_loing.png"
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
                        const response = await axios.post(
                          MAIN_URL + "/user/Login",
                          values,
                          { headers }
                        );
                        const { data } = response;

                        console.log(data);
                        // console.log(data.data);
                        const { _id, name, phone, email, admin_owner, createdAt, updatedAt } = data.data;
                        const authToken = data.authToken;
                        const userDataToStore = {
                          _id,
                          name,
                          phone,
                          email,
                          authToken,
                          admin_owner,
                          createdAt,
                          updatedAt,
                        };
                        localStorage.setItem(
                          "user-data",
                          JSON.stringify(userDataToStore)
                        );
                        // localStorage.setItem("auth-token", data.authToken);
                        router.push("/user");
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
                            User Login
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
