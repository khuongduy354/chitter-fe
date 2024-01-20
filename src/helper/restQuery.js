const getUser = async () => {
  const res = await fetch(process.env.REACT_APP_REST_URL + "/me/");
  if (res.ok) {
    return await res.json();
  }
  return null;
};
const searchFriend = async (email) => {
  const res = await fetch(
    process.env.REACT_APP_REST_URL + "/user" + "?s=" + email
  );
  if (res.ok) {
    const data = await res.json();
    return data.user;
  }
  return null;
};

const signIn = async (accessToken) => {
  const url = process.env.REACT_APP_REST_URL + "/signin";
  let res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
  });
  if (res.ok) {
    res = await res.json();
    return res.user;
  }
  return null;
};
const addFriend = async (friendId) => {
  const url = process.env.REACT_APP_REST_URL + "/me/friend/add";

  let res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ friendId }),
  });
  return res.ok ? true : false;
};
const sendFriendRequest = async (friendId, accessToken) => {
  const url = process.env.REACT_APP_REST_URL + "/me/friend/request";
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      friendId,
    }),
    headers: {
      Authorization: accessToken,
      "Content-Type": "application/json",
    },
  });
  return res.ok ? true : false;
};
const getFriendRequestsReceived = async (accessToken) => {
  const url = process.env.REACT_APP_REST_URL + "/me/friend/requests/received";
  const res = await fetch(url, { headers: { Authorization: accessToken } });
  if (res.ok) {
    const data = await res.json();
    return data.friendRequests;
  }
  return null;
};

const acceptFriendRequest = async (accessToken, freq) => {
  const url = process.env.REACT_APP_REST_URL + "/me/friend/add";
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      friendId: freq.from,
    }),
    headers: {
      Authorization: accessToken,
      "Content-Type": "application/json",
    },
  });
  return res.ok ? true : false;
};
const getFriends = async (accessToken) => {
  const url = process.env.REACT_APP_REST_URL + "/me/friends";
  const res = await fetch(url, { headers: { Authorization: accessToken } });
  if (res.ok) {
    const data = await res.json();
    return data.friends;
  }
  return null;
};
export const RESTQuery = {
  getUser,
  signIn,
  searchFriend,
  getFriendRequestsReceived,
  addFriend,
  sendFriendRequest,
  acceptFriendRequest,
  getFriends,
};
