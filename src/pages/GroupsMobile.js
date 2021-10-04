/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from "react";
import gql from "graphql-tag";
import { AuthContext } from "../context/auth";
import { useLazyQuery } from "@apollo/client";
import CentralPollingUnit from "../components/CentralPollingUnit";
import { GroupSelectorContext } from "../context/groupSelector";
import { NotifierContext } from "../context/notifier";
import { GroupUpdaterContext } from "../context/groupsUpdater";
import style from "./groups.module.scss";
import { Tooltip } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import CreateGroup from "./CreateGroup";
import Skeleton from "@material-ui/lab/Skeleton";
import UserInfo from "../components/UserInfo";
import ExploreResized from "./ExploreResized";

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    borderRadius: 0,
  },
}));

function GroupsMobile(args = {}) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const history = useHistory();

  const { user } = useContext(AuthContext);
  const { createGroupSelection, groupData } = useContext(GroupSelectorContext);
  const { notifArray } = useContext(NotifierContext);
  const { noOfGroups } = useContext(GroupUpdaterContext);
  const groupId = groupData.groupId;
  const uid = user.id;

  useEffect(() => {}, [notifArray]);

  useEffect(() => {
    if (user.id) {
      fetchGroups();
      fetchUserFollowedGroups();
    }
  }, [noOfGroups]);

  const [fetchGroups, { data }] = useLazyQuery(FETCH_GROUPS_QUERY, {
    variables: {
      uid,
    },
    fetchPolicy: "network-only",
  });

  const [fetchUserFollowedGroups, userFollowedGroups] = useLazyQuery(
    FETCH_USERFOLLOWEDGROUPS_QUERY,
    {
      variables: {
        groupOwnerId: uid,
      },
      fetchPolicy: "network-only",
    }
  );

  // Your Groups******************************************************
  let yourGroupsMarkup;
  if (!data) {
    yourGroupsMarkup = (
      <>
        {[...Array(6)].map((x, index) => (
          <div className={style.home_gp} key={index}>
            <Skeleton variant="text" width={275} height={75}></Skeleton>
          </div>
        ))}
      </>
    );
  } else if (data.getGroups.length === 0) {
    // yourGroupsMarkup = <p>No groups yet</p>;
  } else {
    yourGroupsMarkup = data.getGroups.map((x, index) => (
      <div
        className={style.home_gp}
        style={
          groupId && groupId === x.id ? { backgroundColor: "#fcf3f3" } : null
        }
        key={index}
        onClick={() => {
          createGroupSelection(x.id, x.groupId);
          history.push(`/groups/${x.id}`, "groupsMobile");
        }}
      >
        <span className={style.home_gp_name}>{x.groupName}</span>
        <br />
        <span className={style.home_gp_username}>@{x.groupUserName}</span>
      </div>
    ));
  }
  // *****************************************************************

  // Groups you follow************************************************
  let followingGroupMarkUp;
  if (!userFollowedGroups.data) {
    followingGroupMarkUp = <p>Loading groups</p>;
  } else if (
    userFollowedGroups.data.getOwnerInfo.followingGroupsLists.length === 0
  ) {
    // followingGroupMarkUp = <p>No groups yet</p>;
  } else {
    followingGroupMarkUp =
      userFollowedGroups.data.getOwnerInfo.followingGroupsLists.map(
        (x, index) => (
          <div key={index}>
            <div
              className={style.home_gp}
              onClick={() => {
                createGroupSelection(x.id, x.groupId);
                history.push(`/groups/${x.id}`);
              }}
            >
              <span className={style.home_gp_name}>
                {x.groupName}
                {notifArray &&
                  !notifArray.includes(groupData?.groupId) &&
                  notifArray.includes(x.id) && (
                    <span style={{ color: "#FF4B33" }}>*</span>
                  )}
              </span>
              <br />
              <span className={style.home_gp_username}>@{x.groupUserName}</span>
            </div>
          </div>
        )
      );
  }
  // *****************************************************************
  return (
    <div style={{ height: "95vh" }}>
      <UserInfo />
      <div className={style.scrollbox} tabIndex="0">
        <div tabIndex="0" className={style.scrollbox_content}>
          {yourGroupsMarkup}
          {followingGroupMarkUp}
        </div>
      </div>

      <div className={style.hm_create_div}>
        <Tooltip title="Create new group" placement="right">
          <button
            className={style.hm_create_btn}
            onClick={() => {
              handleClickOpen();
            }}
          >
            +
          </button>
        </Tooltip>
        {fullScreen && <ExploreResized />}
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
          <CreateGroup handleClose={handleClose} fullScreen={fullScreen} />
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
      </div>

      <CentralPollingUnit />
    </div>
  );
}

const FETCH_GROUPS_QUERY = gql`
  query getGroups($uid: String!) {
    getGroups(uid: $uid) {
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
const FETCH_USERFOLLOWEDGROUPS_QUERY = gql`
  query getOwnerInfo($groupOwnerId: ID!) {
    getOwnerInfo(groupOwnerId: $groupOwnerId) {
      id
      followingGroupsLists {
        id
        groupId
        groupName
        groupUserName
      }
    }
  }
`;

export default GroupsMobile;
