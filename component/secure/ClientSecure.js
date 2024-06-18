import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import NavbarClient from "../Layout/NavbarClient";

const UserSecure = (props) => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [clientData, setclientData] = useState({});

  useEffect(() => {
    // const clientData = JSON.parse(localStorage.getItem("client-data") || "{}");
    const clientData = JSON.parse(localStorage.getItem("client-data"));
    console.log(clientData);
    if (!clientData || !clientData.authToken) {
      router.push("/login");
    } else {
      setToken(clientData.authToken);
      setclientData(clientData);
    }
  }, []);

  if (!token) {
    return <p>Client Loader...</p>;
  }

  return (
    <>
      <NavbarClient NavbarData={clientData} />
      {props.children}
    </>
  );
};

export default UserSecure;
