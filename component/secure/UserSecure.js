import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
// import LinearProgress from '@mui/material/LinearProgress';
import LodderBar from '../Layout/LodderBar';//components
import NavbarUser from "../Layout/NavbarUser";

const UserSecure = (props) => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user-data"));
    if (!userData || !userData.authToken) {
      router.push("/user/login");
    } else {
      setToken(userData.authToken);
      setUserData(userData);
    }
  }, []);

  if (!token) {
    // return <LinearProgress variant="buffer" value={50} />;
    return <p>User Loader...</p>
    // return <LodderBar></LodderBar>
  }

  return (
    <> 
      <NavbarUser NavbarData={userData} />
      {props.children}
    </>
  );
};

export default UserSecure;
