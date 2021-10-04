import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { Box, Dialog, Divider } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth";
import style from "./userInfo.module.scss";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import DialogActions from "@material-ui/core/DialogActions";
import Union from "../assets/Union.png";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    borderRadius: 0,
  },
}));

function UserInfo(props) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { logout } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [userName, setUserName] = useState("");
  const [userUserName, setUserUserName] = useState("");

  const [ownerData, setOwnerData] = useState(null);

  useEffect(() => {
    fetchUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [fetchUserInfo] = useLazyQuery(FETCH_USER_INFO_QUERY, {
    onCompleted: (data) => {
      //if data is present set loading to false
      data?.getOwnerInfo && setOwnerData(data.getOwnerInfo);
      setUserName(data?.getOwnerInfo?.username);
      setUserUserName(data?.getOwnerInfo?.userusername);
    },
    variables: {
      groupOwnerId: user.id,
    },
    fetchPolicy: "network-only",
  });
  const [onSubmit, { loading }] = useMutation(CHANGE_USER_INFO, {
    onCompleted: (data) => {
      if (data.changeUserInfo) {
        setOwnerData(data.changeUserInfo);
        setOpen(false);
        setErrors({});
      }
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: {
      email: user.email,
      username: userName,
      userusername: userUserName,
    },
  });

  let ownerDataMarkup;
  if (!ownerData) {
    ownerDataMarkup = (
      <div>
        <p className={style.home_name}>
          <Skeleton width={175} height={50}></Skeleton>
        </p>
      </div>
    );
  } else {
    ownerDataMarkup = (
      <div style={{ marginTop: 3, fontWeight: "500" }}>
        <span className={style.home_name}>{ownerData.username}</span>
        <span>
          <button
            onClick={() => {
              setOpen(true);
            }}
            className={style.menu_icon}
          >
            {" "}
            <i style={{ padding: 3 }} className="fas fa-ellipsis-v fa-sm "></i>
          </button>
          <Dialog
            classes={{ paper: classes.dialogPaper }}
            fullScreen={fullScreen}
            open={open}
            // onClose={handleClose}
            onClose={(event, reason) => {
              if (reason !== "backdropClick") {
                setOpen(false);
              }
            }}
            aria-labelledby="responsive-dialog-title"
            disableEscapeKeyDown={true}
            // onBackdropClick="false"
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight={fullScreen && "95vh"}
            >
              <div className={style.cg}>
                <form noValidate>
                  <span className={style.cg_label}>change name</span>
                  <br />
                  <input
                    className={style.cg_input}
                    placeholder="Username"
                    name="username"
                    type="username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <br />
                  <span className={style.cg_label}>Change username</span>
                  <br />
                  <input
                    className={style.cg_input}
                    placeholder="Userusername"
                    name="userusername"
                    type="userusername"
                    value={userUserName}
                    onChange={(e) => setUserUserName(e.target.value)}
                  />
                  <br />
                  <br />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      !loading && onSubmit();
                    }}
                    className={style.cg_button}
                    type="submit"
                  >
                    {!loading ? (
                      "Done!"
                    ) : (
                      <span>
                        changing <i className="fas fa-circle-notch"></i>
                      </span>
                    )}
                  </button>
                </form>
                <div style={{ marginTop: 7 }}>
                  {Object.keys(errors).length > 0 && (
                    <div className={style.error_msgs}>
                      {Object.values(errors).map((value) => (
                        <div key={value}>{value}</div>
                      ))}
                    </div>
                  )}
                </div>
                <br />
                <Divider />
                <br />
                <button
                  className={style.cg_button}
                  onClick={() => {
                    logout();
                  }}
                >
                  Logout
                </button>
                {fullScreen && (
                  <div style={{ textAlign: "right" }}>
                    <button
                      className={style.close_button}
                      onClick={() => {
                        setOpen(false);
                        setErrors({});
                      }}
                      color="primary"
                    >
                      close
                    </button>
                  </div>
                )}
              </div>
            </Box>
            {!fullScreen && (
              <DialogActions>
                <button
                  className={style.close_button}
                  onClick={() => {
                    setOpen(false);
                    setErrors({});
                  }}
                  color="primary"
                >
                  close
                </button>
              </DialogActions>
            )}
          </Dialog>
        </span>
        <br />
        <span className={style.home_username}>@{ownerData.userusername}</span>
      </div>
    );
  }

  return (
    <>
      <div
        style={{ display: "flex", maxHeight: "55px", padding: "7px 7px 7px 0" }}
      >
        <div>
          <img className={style.icon_home} src={Union} alt="" />
        </div>
        {ownerDataMarkup}
      </div>
    </>
  );
}

const FETCH_USER_INFO_QUERY = gql`
  query getOwnerInfo($groupOwnerId: ID!) {
    getOwnerInfo(groupOwnerId: $groupOwnerId) {
      id
      username
      userusername
      email
      followingGroupsLists {
        id
        groupId
        groupName
      }
    }
  }
`;
const CHANGE_USER_INFO = gql`
  mutation changeUserInfo(
    $email: String!
    $username: String
    $userusername: String
  ) {
    changeUserInfo(
      email: $email
      username: $username
      userusername: $userusername
    ) {
      id
      username
      userusername
      email
      followingGroupsLists {
        id
        groupId
        groupName
      }
    }
  }
`;

export default UserInfo;
