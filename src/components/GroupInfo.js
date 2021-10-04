import { gql, useLazyQuery, useMutation } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth";
import followbkm from "../assets/followbkm.png";
import unfollowbkm from "../assets/unfollowbkm.png";
import style from "./groupInfo.module.scss";
import Skeleton from "@material-ui/lab/Skeleton";
import { GroupUpdaterContext } from "../context/groupsUpdater";
import {
  Dialog,
  DialogActions,
  makeStyles,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import GroupInfoMenu from "./GroupInfoMenu";
import { useWindowSize } from "../util/hooks";

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    borderRadius: 0,
  },
}));

function GroupInfo({ groupId, groupOwnerId }) {
  const { user } = useContext(AuthContext);
  const { updateNumberOfGroups } = useContext(GroupUpdaterContext);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [showBackBtn, setShowBackBtn] = useState(false);
  let windowWidth = useWindowSize().width;

  useEffect(() => {
    if (window.location.href.includes("groups") && windowWidth < 600) {
      setShowBackBtn(true);
    } else {
      setShowBackBtn(false);
    }
  }, [windowWidth]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //SHOW GROUP NAME /GET GROUP INFO
  useEffect(() => {
    fetchGroupOwnerInfo();
    fetchGroupInfo();
    fetchUserAdditionalInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [fetchGroupInfo, groupInfo] = useLazyQuery(FETCH_GROUPINFO_QUERY, {
    variables: {
      groupId,
    },
    fetchPolicy: "network-only",
  });

  const [groupConnection] = useMutation(GROUP_ACTION_MUTATION, {
    update() {
      updateNumberOfGroups("ADD");
      fetchGroupInfo();
      fetchGroupOwnerInfo();
    },
    variables: {
      groupId,
      uid: user.id,
    },
  });

  //SHOW GROUP USER NAME /GET GROUP OWNER INFO
  const [fetchGroupOwnerInfo, groupOwnerInfo] = useLazyQuery(
    FETCH_GROUPOWNERINFO_QUERY,
    {
      variables: {
        groupOwnerId,
      },
      fetchPolicy: "network-only",
    }
  );
  const [fetchUserAdditionalInfo, userAdditionalInfo] = useLazyQuery(
    FETCH_GROUPOWNERINFO_QUERY,
    {
      variables: {
        groupOwnerId: user.id,
      },
      fetchPolicy: "network-only",
    }
  );

  let groupOwnerData;
  if (!groupOwnerInfo.data || !userAdditionalInfo.data || !groupInfo.data) {
    groupOwnerData = (
      <div>
        <p className={style.home_username}>
          <Skeleton width={20} height={20}></Skeleton>
        </p>
      </div>
    );
  } else {
    groupOwnerData = (
      <div>
        {groupOwnerInfo.data.getOwnerInfo.email !== user.email ? (
          !userAdditionalInfo.data.getOwnerInfo.followingGroupsLists.some(
            (group) => group.id === groupInfo.data.getGroupInfo.id
          ) ? (
            <span onClick={() => groupConnection()}>
              <Tooltip title="follow" arrow>
                <img
                  className={style.followBtn}
                  src={followbkm}
                  alt="follow_btn"
                />
              </Tooltip>
            </span>
          ) : groupOwnerInfo.data.getOwnerInfo.email === user.email ? null : (
            <span onClick={() => groupConnection()}>
              <Tooltip title="Unfollow" arrow>
                <img
                  className={style.followBtn}
                  src={unfollowbkm}
                  alt="unfollow_btn"
                />
              </Tooltip>
            </span>
          )
        ) : (
          <span>
            <Tooltip title="Can't unfollow your own group" arrow>
              <img
                className={style.followBtn}
                src={unfollowbkm}
                alt="unfollow_btn"
              />
            </Tooltip>
          </span>
        )}
      </div>
    );
  }

  let groupData;
  if (!groupInfo.data) {
    groupData = (
      <div
        style={{ display: "flex", maxHeight: "55px", padding: "7px 7px 7px 0" }}
      >
        <div style={{ marginTop: 3, fontWeight: "500" }}>
          <p className={style.home_name}></p>
          <p className={style.home_username}>
            <Skeleton width={150} height={20}></Skeleton>
          </p>
        </div>
      </div>
    );
  } else {
    groupData = (
      <>
        <div style={{ display: "flex", padding: "7px 7px 7px 0" }}>
          {showBackBtn && (
            <div className={style.back_button}>
              <i
                className="fas fa-arrow-left fa-2x"
                onClick={() => {
                  //go back page
                  window.history.back();
                }}
              ></i>
            </div>
          )}
          <div style={{ top: "12px", position: "relative" }}>
            {groupOwnerData}
          </div>
          <div style={{ marginTop: 3, marginLeft: 10, fontWeight: "500" }}>
            <span className={style.home_name}>
              {groupInfo.data.getGroupInfo.groupName}
            </span>
            <span>
              <button
                onClick={() => {
                  groupOwnerInfo.data.getOwnerInfo.email === user.email &&
                    handleClickOpen();
                }}
                className={style.menu_icon}
              >
                {" "}
                <i
                  style={{ padding: 3 }}
                  className="fas fa-ellipsis-v fa-sm "
                ></i>
              </button>
              <Dialog
                classes={{ paper: classes.dialogPaper }}
                fullScreen={fullScreen}
                open={open}
                // onClose={handleClose}
                onClose={(event, reason) => {
                  if (reason !== "backdropClick") {
                    handleClose();
                  }
                }}
                aria-labelledby="responsive-dialog-title"
                disableEscapeKeyDown={true}
                // onBackdropClick="false"
              >
                <GroupInfoMenu
                  handleClose={handleClose}
                  fullScreen={fullScreen}
                  groupData={groupInfo?.data?.getGroupInfo}
                />
                {!fullScreen && (
                  <DialogActions>
                    <button
                      className={style.close_button}
                      onClick={handleClose}
                      color="primary"
                    >
                      close
                    </button>
                  </DialogActions>
                )}
              </Dialog>
            </span>
            <br />
            <span className={style.home_username}>
              @{groupInfo.data.getGroupInfo.groupUserName}
            </span>
          </div>
        </div>
      </>
    );
  }

  //SHOW OWNER NAME
  return (
    <>
      <div>{groupData}</div>
      {/* <div>{groupOwnerData}</div> */}
    </>
  );
}

const FETCH_GROUPINFO_QUERY = gql`
  query getGroupInfo($groupId: String!) {
    getGroupInfo(groupId: $groupId) {
      id
      groupId
      groupName
      groupUserName
      isPrivate
      createdAt
      groupFollowers {
        followersId
        createdAt
      }
    }
  }
`;
const FETCH_GROUPOWNERINFO_QUERY = gql`
  query getOwnerInfo($groupOwnerId: ID!) {
    getOwnerInfo(groupOwnerId: $groupOwnerId) {
      id
      # createdAt
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

const GROUP_ACTION_MUTATION = gql`
  mutation followGroup($uid: String!, $groupId: String!) {
    followGroup(uid: $uid, groupId: $groupId) {
      id
      username
      followingGroupsLists {
        id
        createdAt
      }
    }
  }
`;

export default GroupInfo;
