import { gql, useLazyQuery } from "@apollo/client";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth";
import { useInterval } from "../util/hooks";
import { NotifierContext } from "../context/notifier";

function CentralPollingUnit() {
  const { user } = useContext(AuthContext);
  const notifArray = useContext(NotifierContext);
  let uid = user.id;

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInterval(() => {
    fetchData();
  }, 1000 * 20);

  const sortData = async (arrayOfArray) => {
    let sortedArray = [];
    for (let i = 0; i < arrayOfArray.length; i++) {
      if (arrayOfArray[i].length > 0) {
        let key = arrayOfArray[i][0].postsId;
        let value = arrayOfArray[i];
        let obj = { key, value };
        sortedArray.push(obj);
      }
    }

    for (let i = 0; i < sortedArray.length; i++) {
      let localData = JSON.parse(localStorage.getItem(sortedArray[i].key));
      if (localData) {
        if (localData.length !== sortedArray[i].value.length) {
          notifArray.createNotification(sortedArray[i].key);
          localStorage.removeItem(sortedArray[i].key);
          localStorage.setItem(
            sortedArray[i].key,
            JSON.stringify(sortedArray[i].value)
          );
        } else {
          // console.log("NO NOTIFICATIONS GENERATED");
        }
      }
    }
  };

  const [fetchData, { data }] = useLazyQuery(GET_ALL_RELEVENT_DATA, {
    onCompleted() {
      sortData(data.getAllRelevantPosts);
    },
    variables: {
      uid,
    },
    fetchPolicy: "network-only",
  });
  return null;
}

export default CentralPollingUnit;

const GET_ALL_RELEVENT_DATA = gql`
  query getAllRelevantPosts($uid: ID!) {
    getAllRelevantPosts(uid: $uid) {
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
