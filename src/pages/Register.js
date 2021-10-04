import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "../util/hooks";
import Grid from "@material-ui/core/Grid";
import { Container } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Union from "../../src/assets/Union.png";
import style from "./register.module.scss";

function Register(props) {
  const [errors, setErrors] = useState({});
  let history = useHistory();
  const { onChange, onSubmit, values } = useForm(registerUser, {
    email: "",
  });

  const [addUser, { loading }] = useMutation(REGISTER2_USER, {
    onCompleted() {
      history.push("/otpverification");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function registerUser() {
    !loading && addUser();
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="97vh"
    >
      <Container maxWidth="xl">
        <Grid container>
          <Grid item={true} md={6} xs={12}>
            <div className={style.leftSide}>
              <p>all</p>
              <p>your</p>
              <p>bookmarks</p>
              <p>in one place</p>
            </div>
          </Grid>
          <Grid item={true} md={6} xs={12}>
            <div className={style.rightSide}>
              <img className={style.icon} src={Union} alt="" />
              <form noValidate onSubmit={onSubmit}>
                <div className={style.ip_plus_error}>
                  <input
                    className={style.email_input}
                    placeholder="enter your email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={onChange}
                  />
                  <br />
                  {Object.keys(errors).length > 0 && (
                    <div className={style.error_msgs}>
                      {Object.values(errors).map((value) => (
                        <div key={value}>{value}</div>
                      ))}
                    </div>
                  )}
                </div>
                <button className={style.reg_button} type="submit">
                  {!loading ? (
                    "send otp"
                  ) : (
                    <span>
                      sending <i className="fas fa-circle-notch"></i>
                    </span>
                  )}
                </button>
              </form>
            </div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Register;

const REGISTER2_USER = gql`
  mutation register($email: String!) {
    register(email: $email) {
      id
      email
    }
  }
`;
