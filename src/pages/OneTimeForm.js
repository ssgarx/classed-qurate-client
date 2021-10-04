import { gql, useMutation } from "@apollo/client";
import { Box } from "@material-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "../util/hooks";
import Union from "../../src/assets/Union.png";
import style from "./oneTimeForm.module.scss";

function OneTimeForm(props) {
  let history = useHistory();
  const [errors, setErrors] = useState({});
  const { onChange, onSubmit, values } = useForm(completeOtf, {
    username: "",
    userusername: "",
  });

  const [submitOtf] = useMutation(SUBMIT_OTF, {
    update(_, { data: { oneTimeForm: userData } }) {
      history.push("/");
      if (userData) {
        //FIND A BETTER WAY TO DO THIS
        window.location.reload();
      }
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function completeOtf() {
    submitOtf();
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="97vh"
    >
      <div className={style.otf}>
        <div style={{ display: "flex", padding: "7px 7px 7px 0" }}>
          <div>
            <img className={style.icon} src={Union} alt="" />
          </div>
          <div style={{ marginTop: 3, fontWeight: "500" }}>
            sET UP YOUR PROFILE,
            <br />
            tHIS IS A ONE TIME PROCESS.
          </div>
        </div>
        <form onSubmit={onSubmit} noValidate>
          <span className={style.otf_label}>Your name</span>
          <br />
          <input
            className={style.email_input}
            placeholder="Username"
            name="username"
            type="username"
            value={values.username}
            onChange={onChange}
          />
          <br />
          <br />
          <span className={style.otf_label}>choose a username</span>
          <br />
          <input
            className={style.email_input}
            placeholder="Userusername"
            name="userusername"
            type="userusername"
            value={values.userusername}
            onChange={onChange}
          />
          <br />
          <br />
          <button className={style.reg_button} type="submit">
            Done
          </button>
        </form>
        <br />
        {Object.keys(errors).length > 0 && (
          <div className={style.error_msgs}>
            {Object.values(errors).map((value) => (
              <div key={value}>{value}</div>
            ))}
          </div>
        )}
      </div>
    </Box>
  );
}

const SUBMIT_OTF = gql`
  mutation oneTimeForm($username: String!, $userusername: String!) {
    oneTimeForm(username: $username, userusername: $userusername) {
      id
      email
      username
      userusername
    }
  }
`;

export default OneTimeForm;
