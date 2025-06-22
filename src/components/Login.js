import { createClient } from "@supabase/supabase-js";
import { useContext, useEffect, useState } from "react";
import { RESTQuery } from "../helper/restQuery";
import { Button, Flex, Input, Form, message } from "antd";
import { AppContext } from "../contexts/AppContext";

export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export function Login() {
  const { setUser, setPanelMode } = useContext(AppContext);
  const [isRegister, setIsRegister] = useState(false);
  const [form] = Form.useForm();

  const handleAuth = async (values) => {
    try {
      const { email, password } = values;
      let authResponse;

      if (isRegister) {
        authResponse = await supabase.auth.signUp({
          email,
          password,
        });
        if (authResponse.error) throw authResponse.error;
        message.success(
          "Registration successful! Please check your email for verification."
        );
      } else {
        authResponse = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authResponse.error) throw authResponse.error;
        console.log("Login supabase success");

        // Get the access token
        const access_token = authResponse.data.session.access_token;

        // Send token to backend and get user data
        const _user = await RESTQuery.signIn(access_token);
        if (_user) {
          _user.accessToken = access_token;
          setUser(_user);
          setPanelMode("chat"); // Set panel mode to chat to show main screen
          message.success("Login successful!");
        } else {
          setUser(null);
          message.error("Login failed");
        }
      }
    } catch (error) {
      message.error(error.message);
    }
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
          setPanelMode("chat"); // Also set panel mode when auto-logging in
        } else {
          setUser(null);
          message.error("Login failed");
        }
      } else {
        setUser(null);
      }
    }
    getUserData();
  }, [setUser, setPanelMode]);

  return (
    <Flex
      vertical
      gap="middle"
      justify="center"
      align="center"
      style={{ padding: "2rem" }}
    >
      <Form
        form={form}
        name="auth"
        onFinish={handleAuth}
        layout="vertical"
        style={{ width: "100%", maxWidth: "300px" }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            // { min: 6, message: "Password must be at least 6 characters!" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            {isRegister ? "Register" : "Sign In"}
          </Button>
        </Form.Item>
      </Form>

      <Button type="link" onClick={() => setIsRegister(!isRegister)}>
        {isRegister
          ? "Already have an account? Sign in"
          : "Don't have an account? Register"}
      </Button>
    </Flex>
  );
}
