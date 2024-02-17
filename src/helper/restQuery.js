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
const getRoom = async (accessToken, friendId) => {
  const url = process.env.REACT_APP_REST_URL + "/room/oneone";

  const res = await fetch(url, {
    headers: {
      Authorization: accessToken,
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ friendId }),
  });
  if (res.ok) {
    let data = await res.json();
    return data.room;
  }
  return null;
};

const createGroup = async (accessToken, groupName) => {
  const url = process.env.REACT_APP_REST_URL + "/room/group/create";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: accessToken,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      groupName,
    }),
  });
  if (res.ok) {
    const data = await res.json();
    return data.room;
  }
  return null;
};
const joinGroup = async (accessToken, groupId) => {
  const url = process.env.REACT_APP_REST_URL + "/room/group/join";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: accessToken,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      groupId,
    }),
  });
  return res.ok;
};

const searchGroups = async (groupName) => {
  const url = process.env.REACT_APP_REST_URL + "/room/groups?s=" + groupName;
  const res = await fetch(url);
  if (res.ok) {
    const data = await res.json();
    return data.room;
  }
  return null;
};
const getMyGroups = async (accessToken) => {
  const url = process.env.REACT_APP_REST_URL + "/me/groups";
  const res = await fetch(url, { headers: { Authorization: accessToken } });
  if (res.ok) {
    const data = await res.json();
    return data.rooms;
  }
  return null;
};

const getMyEmojis = async (accessToken) => {
  const url = process.env.REACT_APP_REST_URL + "/me/emojis";
  const res = await fetch(url, {
    headers: {
      Authorization: accessToken,
    },
  });
  if (res.ok) {
    const data = await res.json();
    return data.emojis;
  }
  return null;
};
const deleteEmoji = async (accessToken, emojiId) => {
  const url = process.env.REACT_APP_REST_URL + "/emojis/" + emojiId;
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: accessToken,
    },
  });
  return res.ok;
};
const uploadEmoji = async (accessToken, formdata) => {
  const url = process.env.REACT_APP_REST_URL + "/emoji";
  const res = await fetch(url, {
    body: formdata,
    method: "POST",
    headers: {
      Authorization: accessToken,
    },
  });
  return res.ok;
};

const createTheme = async (accessToken, theme) => {
  const url = process.env.REACT_APP_REST_URL + "/theme";
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: accessToken, "Content-type": "application/json" },
    body: JSON.stringify({ theme }),
  });
  if (res.ok) {
    const data = await res.json();
    return data.theme;
  }
  return null;
};
export const RESTQuery = {
  getRoom,
  getUser,
  signIn,
  searchFriend,
  getFriendRequestsReceived,
  addFriend,
  sendFriendRequest,
  acceptFriendRequest,
  getFriends,
  createGroup,
  joinGroup,
  searchGroups,
  getMyGroups,
  uploadEmoji,
  getMyEmojis,
  deleteEmoji,

  createTheme,
};
