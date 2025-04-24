"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Typography, Alert, Row, Col, Space } from "antd";
import { LoginOutlined, IdcardOutlined, KeyOutlined } from "@ant-design/icons";
import Image from "next/image";
import plusden from "@/app/assets/plusden.png";
import { useUser } from "@/app/components/UserContext";

const { Title, Text } = Typography;

const LoginPage = () => {
  const [error, setError] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const { setUsername } = useUser();
  const router = useRouter();

  const handleLogin = async (values: {
    username: string;
    password: string;
  }) => {
    setIsDisabled(true);
    setError("");

    const { username, password } = values;

    try {
      const validUsers = [
        "RA",
        "AR",
        "SA",
        "AS",
        "ON",
        "UD",
        "NW",
        "CW",
        "R2",
        "LB",
        "BK",
        "SQ",
        "BN",
        "PK",
        "RS",
        "FS",
        "T3",
        "BP",
        "NT",
        "PP",
        "Messenger",
        "Adminlab1",
        "Adminlab2",
        "Adminlab3",
        "Chanatip",
        "Lab",
        "Lab2",
      ];

      if (validUsers.includes(username) && username === password) {
        localStorage.setItem("username", username);
        setUsername(username);

        if (username === "Lab" || username === "Lab2") {
          await router.push("/components/Lab");
        } else {
          await router.push("/components");
        }
      } else {
        setError("Username หรือ Password ไม่ถูกต้อง");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f4f4",
        padding: "1rem",
        height: "calc(100% - 60px)",
      }}
    >
      <Row
        justify="center"
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "white",
          padding: "2rem",
          borderRadius: "20px",
          boxShadow: "8px 8px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Col span={24} style={{ textAlign: "center", marginBottom: "1rem" }}>
          <Image src={plusden} alt="Logo" width={300} height={150} />
        </Col>
        <Col span={24}>
          <Title
            level={3}
            style={{
              textAlign: "center",
              marginBottom: "1rem",
              fontSize: "28px",
            }}
          >
            Log in
          </Title>
          {error && (
            <Alert
              message={<Text style={{ fontSize: "16px" }}>{error}</Text>}
              type="error"
              showIcon
              style={{ marginBottom: "1rem" }}
            />
          )}
          <Form
            onFinish={handleLogin}
            style={{ width: "100%" }}
            layout="vertical"
            disabled={isDisabled}
          >
            <Form.Item
              name="username"
              label={
                <Space>
                  <IdcardOutlined />
                  <Text style={{ fontSize: "16px" }}>Username</Text>
                </Space>
              }
              rules={[
                { required: true, message: "กรุณากรอก Username !" },
              ]}
            >
              <Input
                placeholder="Enter your username"
                style={{ fontSize: "14px", padding: "10px" }}
                disabled={isDisabled}
              />
            </Form.Item>
            <Form.Item
              name="password"
              label={
                <Space>
                  <KeyOutlined />
                  <Text style={{ fontSize: "16px" }}>Password</Text>
                </Space>
              }
              rules={[
                { required: true, message: "กรุณากรอก Password !" },
              ]}
            >
              <Input.Password
                placeholder="Enter your password"
                style={{ fontSize: "14px", padding: "10px" }}
                disabled={isDisabled}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: "100%",
                  fontSize: "16px",
                  padding: "12px",
                  height: "auto",
                }}
                disabled={isDisabled}
              >
                Log in <LoginOutlined />
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
