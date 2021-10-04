/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import GroupInfo from "../components/GroupInfo";
import CentralPollingUnit from "../components/CentralPollingUnit";
import { NotifierContext } from "../context/notifier";
import { GroupSelectorContext } from "../context/groupSelector";
import style from "./group.module.scss";
import GreetingScreem from "../components/GreetingScreem";
import Posts from "../components/Posts";
import { useWindowSize } from "../util/hooks";
import isUrl from "validator/lib/isURL";

function Group(props, args = {}) {
  let windowWidth = useWindowSize().width;
  const { user } = useContext(AuthContext);
  const { notifArray, removeNotification } = useContext(NotifierContext);
  const { groupData } = useContext(GroupSelectorContext);
  const groupId = groupData.groupId;
  const groupOwnerId = groupData.groupOwnerId;
  const [isLinkValid, setIsLinkValid] = useState(true);

  useEffect(() => {
    if (window.location.pathname !== "/" && windowWidth > 600) {
      props.history.push("/");
    }
  }, [windowWidth]);

  const uid = user.id;
  const [postedLinks, setPostedLinks] = useState("");
  const [displayPosts, setDisplayPosts] = useState("");

  useEffect(() => {
    if (groupId) {
      if (!JSON.parse(localStorage.getItem(groupId))) {
        fetchPosts();
      }
      setDisplayPosts(JSON.parse(localStorage.getItem(groupId)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (notifArray.includes(groupId)) {
      removeNotification(groupId);
    }
  }, [groupId]);

  useEffect(() => {
    setDisplayPosts(JSON.parse(localStorage.getItem(groupId)));
    if (notifArray.includes(groupId)) {
      removeNotification(groupId);
    }
  }, [notifArray]);

  const saveGroupMessagesToLocal = (data, groupId) => {
    let groupMessages = data;
    localStorage.setItem(groupId, JSON.stringify(groupMessages));
    setDisplayPosts(groupMessages);
  };

  const addMessageToLocal = (message, groupId) => {
    let groupIdX = message.postsId;

    let groupMessages = JSON.parse(localStorage.getItem(groupIdX));
    groupMessages = groupMessages.filter((item) => !item.isTemp);
    if (!groupMessages.find((item) => item.id === message.id)) {
      groupMessages.push(message);
      localStorage.setItem(groupIdX, JSON.stringify(groupMessages));
      if (groupId === message.postsId) {
        setDisplayPosts(groupMessages);
      }
    }
  };

  const isElementVisible = (el) => {
    let rect = el.getBoundingClientRect(),
      vWidth = window.innerWidth || document.documentElement.clientWidth,
      vHeight = window.innerHeight || document.documentElement.clientHeight,
      efp = function (x, y) {
        return document.elementFromPoint(x, y);
      };

    // Return false if it's not in the viewport
    if (
      rect.right < 0 ||
      rect.bottom < 0 ||
      rect.left > vWidth ||
      rect.top > vHeight
    )
      return false;

    // Return true if any of its four corners are visible
    return (
      el.contains(efp(rect.left, rect.top)) ||
      el.contains(efp(rect.right, rect.top)) ||
      el.contains(efp(rect.right, rect.bottom)) ||
      el.contains(efp(rect.left, rect.bottom))
    );
  };

  const handleAfterPostTasks = (postedContent) => {
    let tempDataObj = {
      id: "refrenceBlock1",
      postBody: postedContent,
      postImage: "",
      postDescription: postedContent,
      domain: "xyz.com",
      postsId: groupId,
      isTemp: true,
    };
    //check if localStorage is has the group id
    if (JSON.parse(localStorage.getItem(groupId))) {
      let groupMessages = JSON.parse(localStorage.getItem(groupId));
      groupMessages.push(tempDataObj);
      localStorage.setItem(groupId, JSON.stringify(groupMessages));
      setDisplayPosts(groupMessages);
    } else {
      let groupMessages = [tempDataObj];
      localStorage.setItem(groupId, JSON.stringify(groupMessages));
      setDisplayPosts(groupMessages);
    }

    //SCROLLL TO BOTTOM
    setTimeout(() => {
      let element = document.getElementById("refrenceBlock1");
      element &&
        !isElementVisible(element) &&
        element.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
    }, 200);
  };

  const [fetchPosts, { data, loading }] = useLazyQuery(FETCH_LINKS_QUERY, {
    onCompleted() {
      saveGroupMessagesToLocal(data.getGroupPosts, groupId);
    },
    variables: {
      groupId,
    },
    fetchPolicy: "network-only",
  });

  const [submitPost, isPreviewLoading = loading] = useMutation(
    SUBMIT_LINKS_MUTATION,
    {
      update(data) {
        // setPostedLinks("");
      },
      onCompleted(data) {
        addMessageToLocal(data.createGroupPost, groupId);
        //find in local storage by group id and delete the object with isTemp = true
        data.createGroupPost.postsId === groupId &&
          setTimeout(() => {
            let element = document.getElementById("refrenceBlock2");
            element &&
              element.scrollIntoView({
                behavior: "smooth",
                block: "end",
              });
          }, 200);
      },
      variables: {
        uid,
        groupId,
        body: postedLinks,
      },
    }
  );

  return (
    <>
      {!groupId && !groupOwnerId ? (
        <GreetingScreem />
      ) : (
        <>
          <div style={{ height: "90vh" }}>
            {groupId && groupOwnerId && (
              <GroupInfo groupId={groupId} groupOwnerId={groupOwnerId} />
            )}
            <div className={style.home_posts}>
              <div>
                <Posts
                  loading={loading}
                  displayPosts={displayPosts}
                  groupId={groupId}
                  setDisplayPosts={setDisplayPosts}
                  isOwner={groupOwnerId === user.id}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "white",
              position: "sticky",
              bottom: 0,
              // padding: "15px 0px",
              // paddingBottom: "15px",
            }}
          >
            {groupOwnerId === user.id && (
              <>
                <div className={style.home_send_parent}>
                  <form
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      backgroundColor: "white",
                    }}
                  >
                    <div style={{ flex: 12 }}>
                      <input
                        className={style.home_send}
                        type="text"
                        placeholder="Post links here"
                        value={postedLinks}
                        onChange={(event) => setPostedLinks(event.target.value)}
                      />
                    </div>
                    {postedLinks && (
                      <div style={{ flex: 1 }}>
                        <button
                          type="submit"
                          className={style.home_send_btn}
                          disabled={postedLinks.trim() === ""}
                          onClick={(e) => {
                            e.preventDefault();
                            if (isUrl(postedLinks)) {
                              postedLinks.trim() !== "" &&
                                !isPreviewLoading?.loading &&
                                submitPost();
                              handleAfterPostTasks(postedLinks);
                              setPostedLinks("");
                              setIsLinkValid(true);
                            } else {
                              setIsLinkValid(false);
                              //make it true after 2 sec
                              setTimeout(() => {
                                setIsLinkValid(true);
                              }, 1000);
                            }
                          }}
                        >
                          send
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </>
            )}
            {!isLinkValid && postedLinks.trim() !== "" && (
              <p style={{ color: "red", fontSize: 12 }}>
                oops, only links allowed
              </p>
            )}
            <CentralPollingUnit />
          </div>
        </>
      )}
    </>
  );
}
const SUBMIT_LINKS_MUTATION = gql`
  mutation createGroupPost($uid: String!, $groupId: String!, $body: String!) {
    createGroupPost(uid: $uid, groupId: $groupId, body: $body) {
      createdAt
      id
      likeCount
      postBody

      postTitle
      postDescription
      postDomain
      postImage

      postLikes {
        username
      }
      postViews {
        username
      }
      postsId
      username
      userusername
      viewCount
    }
  }
`;

const FETCH_LINKS_QUERY = gql`
  query getGroupPosts($groupId: String!) {
    getGroupPosts(groupId: $groupId) {
      id
      postsId
      username
      userusername
      postBody
      createdAt

      postTitle
      postDescription
      postDomain
      postImage

      postLikes {
        username
      }
      postViews {
        username
      }
      likeCount
      viewCount
    }
  }
`;

export default Group;
