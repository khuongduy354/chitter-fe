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
    },
    body: JSON.stringify({ accessToken }),
  });
  if (res.ok) {
    res = await res.json();
    return res.user;
  }
  return null;
};

export const RESTQuery = { getUser, signIn, searchFriend };
