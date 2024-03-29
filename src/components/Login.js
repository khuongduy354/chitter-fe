import { createClient } from "@supabase/supabase-js";
import { useContext, useEffect, useState } from "react";
import { RESTQuery } from "../helper/restQuery";
import { Button, Flex } from "antd";
import { AppContext } from "../App";

export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export function Login() {
  const { user, setUser } = useContext(AppContext);
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
          _user.accessToken = access_token;
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
    <Flex gap="middle" justify="center" align="center">
      <Button onClick={(e) => signInGG()}>Sign In</Button>
    </Flex>
  );
}
