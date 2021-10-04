import { gql, useLazyQuery } from "@apollo/client";
import { LinearProgress } from "@material-ui/core";
import {
  Dialog,
  makeStyles,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React, { useState, useContext } from "react";
import { useHistory } from "react-router";
import { AuthContext } from "../context/auth";
import { GroupSelectorContext } from "../context/groupSelector";

import style from "./exploreResized.module.scss";

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    borderRadius: 0,
  },
}));

let searchTimer;
function ExploreResized() {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchedText, setSearchedText] = useState("");
  const groupSelContext = useContext(GroupSelectorContext);
  const history = useHistory();

  const [submitSearchedText, { data, loading }] = useLazyQuery(
    FETCH_SEARCH_RESULT,
    {
      variables: {
        searchedText,
        uid: user.id,
      },
    }
  );

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSearch = async (e) => {
    setSearchedText(e.target.value);
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      submitSearchedText();
    }, 2000);
  };
  let groupsMarkUp;
  if (!data) {
    groupsMarkUp = loading ? (
      <p>Loading groupsX</p>
    ) : (
      <p>Search for folders or articles</p>
    );
  } else if (data.searchGroups.length === 0) {
    groupsMarkUp = <p>No groups found</p>;
  } else {
    groupsMarkUp = data.searchGroups.map((x, index) => (
      <>
        <div
          className={style.home_gp}
          key={index}
          onClick={() => {
            groupSelContext.createGroupSelection(x.id, x.groupId);
            history.push(`/groups/${x.id}`, "exploreResized");
          }}
        >
          <span className={style.home_gp_name}>{x.groupName}</span>
          <br />
          <span className={style.home_gp_username}>@{x.groupUserName}</span>
        </div>
      </>
    ));
  }
  return (
    <div>
      <Tooltip title="Explore" placement="right">
        <button
          className={style.hm_create_btn}
          onClick={() => {
            handleClickOpen();
          }}
        >
          <i className="far fa-compass"></i>
        </button>
      </Tooltip>
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
      >
        <div className={style.explore_enclosure}>
          <div style={{ display: "flex" }}>
            <div style={{ flex: 0 }}>
              <i
                style={{
                  fontSize: 35,
                  marginTop: 3,
                  marginRight: 10,
                  cursor: "pointer",
                }}
                onClick={handleClose}
                className="fas fa-arrow-left"
              ></i>
            </div>
            <div style={{ flex: 10 }}>
              <div className={style.fake_searchbox}>
                <div className={style.fs}>
                  <div className={style.fs1}>
                    <i
                      style={
                        searchedText
                          ? {
                              color: "#FF4B33",
                              transition: "0.3s all",
                            }
                          : { transition: "0.3s all" }
                      }
                      className="fas fa-search fa-lg"
                    ></i>
                  </div>
                  <div className={style.fs2}>
                    <input
                      className={style.explore_input}
                      type="text"
                      placeholder="Type group username here"
                      value={searchedText}
                      onChange={(e) => handleSearch(e)}
                    />
                  </div>
                  {searchedText && (
                    <div className={style.fs3}>
                      <i
                        onClick={() => setSearchedText("")}
                        style={{ cursor: "pointer", color: "#FF4B33" }}
                        className="fas fa-times fa-lg"
                      ></i>
                    </div>
                  )}
                </div>
                <div
                  className={
                    searchedText ? style.search_visible : style.search_invisible
                  }
                >
                  {loading && (
                    <div style={{ position: "relative", top: "-10px" }}>
                      <LinearProgress className={classes.root} />
                    </div>
                  )}
                  {groupsMarkUp}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

const FETCH_SEARCH_RESULT = gql`
  query searchGroups($searchedText: String!, $uid: ID!) {
    searchGroups(searchedText: $searchedText, uid: $uid) {
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

export default ExploreResized;
