/* eslint-disable react-hooks/exhaustive-deps */
import { gql, useLazyQuery } from "@apollo/client";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth";

function Staging() {
  const { user } = useContext(AuthContext);
  let email = user.email;
  //make a check if user by user.email exists.
  //if user exists then show its data at home page.
  //if no data exists then show one time screen

  useEffect(() => {
    checkIfNewUser();
  }, []);

  const [checkIfNewUser] = useLazyQuery(CHECK_FOR_NEWUSER, {
    onCompleted: (data) => {
      if (data.checkIfNewUser) {
        //NEW USER DETECTED
      } else {
        //OLD USER DETECTED
      }
    },
    variables: {
      email,
    },
    fetchPolicy: "network-only",
  });

  return <div>Staging screen</div>;
}

const CHECK_FOR_NEWUSER = gql`
  query checkIfNewUser($email: String!) {
    checkIfNewUser(email: $email)
  }
`;

export default Staging;
