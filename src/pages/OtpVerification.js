import { gql, useMutation } from "@apollo/client";
import { Box } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/auth";
import { useForm } from "../util/hooks";
import Union from "../../src/assets/Union.png";
import style from "./otpVerification.module.scss";
function OtpVerification(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(verifyotp, {
    code: "",
  });

  const [addUser] = useMutation(VERIFY_OTP, {
    update(_, { data: { verifyOtp: userData } }) {
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function verifyotp() {
    addUser();
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="90vh"
    >
      <div>
        <img className={style.icon} src={Union} alt="" />
        <form noValidate onSubmit={onSubmit}>
          <div className={style.ip_plus_error}>
            <input
              className={style.otp_input}
              placeholder="enter 6 digit otp"
              name="code"
              value={values.code}
              onChange={onChange}
            />
            {Object.keys(errors).length > 0 ? (
              <div className={style.error_msgs}>
                {Object.values(errors).map((value) => (
                  <div key={value}>{value}</div>
                ))}
              </div>
            ) : (
              <div
                style={{ color: "#949494", fontSize: 13 }}
                className={style.error_msgs}
              >
                Check your email for otp
              </div>
            )}
          </div>
          <button className={style.reg_button} type="submit">
            verify otp
          </button>
        </form>
      </div>
    </Box>
  );
}

export default OtpVerification;

const VERIFY_OTP = gql`
  mutation verifyOtp($code: String!) {
    verifyOtp(code: $code) {
      code
      token
      email
      createdAt
    }
  }
`;
