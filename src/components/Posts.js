import React, { useState } from "react";
import style from "./posts.module.scss";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import { gql, useMutation } from "@apollo/client";

const useStyles = makeStyles({
  menu: {
    "& .MuiPopover-paper": {
      boxShadow:
        "rgb(148 148 148 / 0%) 0px 0px 15px, rgb(230 230 230 / 15%) 0px 0px 3px 1px",
    },
  },
});

function Posts({ loading, displayPosts, groupId, setDisplayPosts, isOwner }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  // const [deletePostId, setDeletePostId] = useState(null);

  const [selectedData, setSelectedData] = useState({
    deletePostId: null,
    postLink: null,
  });

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [deletePost] = useMutation(DELETE_POST, {
    onCompleted: (data) => {
      let posts = JSON.parse(localStorage.getItem(groupId));
      posts = posts.filter((post) => post.id !== selectedData.deletePostId);
      setDisplayPosts(posts);
      localStorage.setItem(groupId, JSON.stringify(posts));
      //set deletePostId in setSelectedData to null
      setSelectedData({
        ...selectedData,
        deletePostId: null,
      });
      // setDeletePostId(null);
    },
    onError(err) {
      alert("Failed to delete, refresh and try again.");
    },
  });

  let postsMarkUp;
  if (loading) {
    postsMarkUp = <p>Loading</p>;
  } else if (!displayPosts) {
    postsMarkUp = <p>No posts yet</p>;
  } else {
    postsMarkUp = (
      <div className={style.posts_box}>
        {displayPosts.map(
          (x, index) =>
            x.postsId === groupId && (
              <div
                style={x?.isTemp ? { opacity: 0.5 } : { opacity: 1 }}
                key={index}
                className={style.fence}
              >
                <a href={x.postBody} target="_blank" rel="noopener noreferrer">
                  {x.postImage && (
                    <div className={style.image}>
                      <img src={x.postImage} alt="link_img" />
                    </div>
                  )}
                  <div className={style.desc}>
                    {x.postDescription ?? x.postBody}
                  </div>
                  <span>
                    <span className={style.domain}>{x.postDomain ?? ""}</span>
                    <div className={style.postMenuSpan}>
                      <button
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={(e) => {
                          //prevent anchor tag from opening
                          e.preventDefault();
                          e.stopPropagation();
                          handleClick(e);
                          // setDeletePostId(x.id);

                          setSelectedData({
                            deletePostId: x.id,
                            postLink: x.postBody,
                          });
                        }}
                        className={style.menu_icon}
                      >
                        {" "}
                        <i
                          style={{ padding: 3 }}
                          className="fas fa-ellipsis-v fa-sm "
                        ></i>
                      </button>
                      <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        getContentAnchorEl={null}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        className={classes.menu}
                      >
                        {isOwner && (
                          <MenuItem
                            onClick={() => {
                              deletePost({
                                variables: {
                                  id: selectedData.deletePostId,
                                },
                              });
                              handleClose();
                            }}
                          >
                            <i
                              class="far fa-trash-alt"
                              style={{ marginRight: "8px", color: "red" }}
                            ></i>{" "}
                            Delete
                          </MenuItem>
                        )}
                        <MenuItem
                          onClick={() => {
                            //when clicked copy selectedData.postLink to clipboard
                            navigator.clipboard.writeText(
                              selectedData.postLink
                            );
                            handleClose();
                          }}
                        >
                          <i
                            className="far fa-copy"
                            style={{ marginRight: "8px" }}
                          ></i>{" "}
                          Copy
                        </MenuItem>
                      </Menu>
                    </div>
                  </span>
                </a>
              </div>
            )
        )}
        <div id="refrenceBlock2"></div>
      </div>
    );
  }
  return <div>{postsMarkUp}</div>;
}
const DELETE_POST = gql`
  mutation deletePost($id: String!) {
    deletePost(id: $id)
  }
`;
export default Posts;
