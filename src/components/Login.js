import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { RESTQuery } from "../helper/restQuery";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export function Login({ user, setUser }) {
  const signOutGG = async () => {
    let { data, error } = await supabase.auth.signOut();
    if (!error) setUser(null);
  };
  const signInGG = async () => {
    let { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  };

  useEffect(() => {
    async function getUserData() {
      let supaUser = (await supabase.auth.getUser()).data.user;

      if (supaUser) {
        const access_token = (await supabase.auth.getSession()).data.session
          .access_token;
        const _user = await RESTQuery.signIn(access_token);
        if (_user) {
          setUser(_user);
        } else {
          setUser(null);
          alert("Login failed");
        }
      } else {
        setUser(null);
      }
    }
    getUserData();
  }, []);
  return (
    <div>
      <button onClick={(e) => signInGG()}>Sign In</button>;
      <button onClick={(e) => signOutGG()}>Sign Out</button>;
      {user && <h1>{user.email}</h1>}
    </div>
  );
}
