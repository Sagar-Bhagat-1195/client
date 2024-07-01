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

const MAIN_URL = EnvironmentVariables.MAIN_URL;

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const validationSchema = Yup.object({
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

  const headers = {};

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(
        `${MAIN_URL}/user/Login`,
        values,
        { headers }
      );
      const { data } = response;
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
        "client-data",
        JSON.stringify(userDataToStore)
      );
      router.push("/");
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
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          border: "2px solid #1976d2",
          borderRadius: "25px 0",
          padding: "10px",
          margin: "25px",
        }}
      >
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <CardMedia
                component="img"
                height="auto"
                image="/image/client/Client.png"
                alt="client Image"
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Formik
                  initialValues={{ email: "", password: "" }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, errors, touched }) => (
                    <Form>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
                        <Typography variant="h5" gutterBottom>
                          Client Login
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
      </Box>
    </Container>
  );
};

export default Login;
