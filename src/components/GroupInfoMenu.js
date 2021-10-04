import { gql, useMutation } from "@apollo/client";
import { Box, Divider, FormControlLabel, Switch } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth";
import { GroupSelectorContext } from "../context/groupSelector";
import { GroupUpdaterContext } from "../context/groupsUpdater";
import style from "./groupInfoMenu.module.scss";

function GroupInfoMenu({ fullScreen, handleClose, groupData }) {
  const { id, groupName, groupUserName, isPrivate, groupFollowers } = groupData;
  const { user } = useContext(AuthContext);
  const [gpName, setGpName] = useState("");
  const [gpUsername, setGpUsername] = useState("");
  const [gpPrivacy, setGpPrivacy] = useState(null);
  const [errors, setErrors] = useState({});
  const { createGroupSelection } = useContext(GroupSelectorContext);
  const { updateNumberOfGroups } = useContext(GroupUpdaterContext);

  useEffect(() => {
    setGpName(groupName);
    setGpUsername(groupUserName);
    setGpPrivacy(isPrivate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [onSubmit, { loading }] = useMutation(CHANGE_GP_INFO, {
    onCompleted() {
      handleClose();
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: {
      groupId: id,
      groupName: gpName,
      groupUserName: gpUsername,
      isPrivate: gpPrivacy,
    },
  });
  const [deleteGp, loading2 = { loading }] = useMutation(DELETE_GP, {
    onCompleted({ deleteGroup }) {
      if (deleteGroup) {
        //find the group in local storage by key = groupId and delete it
        localStorage.removeItem(id);
        createGroupSelection(null, null);
        updateNumberOfGroups("REMOVE");
        handleClose();
      }
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: {
      groupId: id,
      userId: user.id,
    },
  });

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight={fullScreen && "95vh"}
    >
      <div className={style.cg}>
        <form noValidate>
          <span className={style.cg_label}>change group name</span>
          <br />
          <input
            className={style.cg_input}
            placeholder="Username"
            name="username"
            type="username"
            value={gpName}
            onChange={(e) => setGpName(e.target.value)}
          />
          <br />
          <span className={style.cg_label}>Change group username</span>
          <br />
          <input
            className={style.cg_input}
            placeholder="Userusername"
            name="userusername"
            type="userusername"
            value={gpUsername}
            onChange={(e) => setGpUsername(e.target.value)}
          />
          <br />
          <FormControlLabel
            control={
              <Switch
                checked={gpPrivacy ? true : false}
                onChange={() => setGpPrivacy(!gpPrivacy)}
                name="checkedA"
              />
            }
            label={
              <span className={style.cg_label}>
                {gpPrivacy ? "Private" : "Public"}
              </span>
            }
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
        <span className={style.cg_label}>
          {groupFollowers.length} followers
        </span>
        <Divider />
        <br />
        <button
          onClick={(e) => {
            e.preventDefault();
            deleteGp();
          }}
          className={style.delete_button}
          type="submit"
        >
          {loading2 ? (
            "Delete folder"
          ) : (
            <span>
              deleting <i className="fas fa-circle-notch"></i>
            </span>
          )}
        </button>
        {fullScreen && (
          <div style={{ textAlign: "right" }}>
            <button
              className={style.close_button}
              onClick={() => {
                handleClose();
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
  );
}

const CHANGE_GP_INFO = gql`
  mutation changeGroupInfo(
    $groupId: String!
    $groupName: String
    $groupUserName: String
    $isPrivate: Boolean
  ) {
    changeGroupInfo(
      groupId: $groupId
      groupName: $groupName
      groupUserName: $groupUserName
      isPrivate: $isPrivate
    ) {
      id
      groupId
      groupName
      groupUserName
      isPrivate
    }
  }
`;
const DELETE_GP = gql`
  mutation deleteGroup($groupId: String!, $userId: String!) {
    deleteGroup(groupId: $groupId, userId: $userId)
  }
`;

export default GroupInfoMenu;
