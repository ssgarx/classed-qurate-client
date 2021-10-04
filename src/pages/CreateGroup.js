import { gql, useMutation } from "@apollo/client";
import { Box, FormControlLabel, Switch } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/auth";
import { GroupSelectorContext } from "../context/groupSelector";
import { GroupUpdaterContext } from "../context/groupsUpdater";
import style from "./createGroup.module.scss";
function CreateGroup(props) {
  const { user } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [groupName, setGroupName] = useState("");
  const [groupUserName, setGroupUserName] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const uid = user.id;
  const { updateNumberOfGroups } = useContext(GroupUpdaterContext);
  const { createGroupSelection } = useContext(GroupSelectorContext);

  const [onSubmit, { loading }] = useMutation(CREATE_GROUP, {
    onCompleted: ({ createGroup }) => {
      createGroupSelection(createGroup.id, createGroup.groupId);
    },
    update() {
      updateNumberOfGroups("ADD");
      props.handleClose();
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: {
      groupName,
      groupUserName,
      isPrivate,
      uid,
    },
  });

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight={props.fullScreen && "95vh"}
    >
      <div className={style.cg}>
        <form noValidate>
          <span className={style.cg_label}>group name</span>
          <br />
          <input
            className={style.cg_input}
            placeholder="Groupname.."
            name="groupname"
            type="text"
            value={groupName}
            error={errors.groupname ? true : false}
            onChange={(event) => setGroupName(event.target.value)}
          />
          <br />
          <span className={style.cg_label}>your group name</span>
          <br />
          <input
            className={style.cg_input}
            placeholder="Groupusername.."
            name="groupusername"
            type="groupusername"
            value={groupUserName}
            error={errors.groupusername ? true : false}
            onChange={(event) => setGroupUserName(event.target.value)}
          />
          <br />
          <span className={style.cg_label}>Group Privacy </span>
          <br />
          <FormControlLabel
            control={
              <Switch
                checked={isPrivate ? true : false}
                onChange={() => setIsPrivate(!isPrivate)}
                name="checkedA"
              />
            }
            label={
              <span className={style.cg_label}>
                {isPrivate ? "Private" : "Public"}
              </span>
            }
          />
          <br />
          <button
            onClick={(e) => {
              e.preventDefault();
              // onSubmit={onSubmit}
              !loading && onSubmit();
            }}
            className={style.cg_button}
            type="submit"
          >
            {!loading ? (
              "Create group"
            ) : (
              <span>
                creating <i className="fas fa-circle-notch"></i>
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
        {props.fullScreen && (
          <div style={{ textAlign: "right" }}>
            <button
              className={style.close_button}
              onClick={props.handleClose}
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

const CREATE_GROUP = gql`
  mutation createGroup(
    $groupName: String!
    $groupUserName: String!
    $isPrivate: Boolean!
    $uid: String!
  ) {
    createGroup(
      groupName: $groupName
      groupUserName: $groupUserName
      isPrivate: $isPrivate
      uid: $uid
    ) {
      id
      groupId
      groupName
      groupUserName
      isPrivate
      createdAt
    }
  }
`;

export default CreateGroup;
