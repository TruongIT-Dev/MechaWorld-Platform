import { useNavigate } from "react-router-dom";
import { Checkbox, Form, Input, Button } from "antd";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import {  useEffect, useState } from "react";
import { useDispatch, } from "react-redux";
import { login } from "../features/auth/authSlice";
import "../assets/css/sign.css";
// import axios from "axios";
import axios from '../axios'
import { useCookies } from "react-cookie";
export default function Sign() {
  const [cookies, setCookie] = useCookies(['cookie-name']);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState(1); 
  const dispatch = useDispatch();
  // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const auth_api = `http://localhost:8080/v1/`;
  const api = axios.create({
    baseUR: auth_api,
    headers: {
      'Content-Type': 'application/json',
    }
  })
  async function handleCredentialResponse(response) {
    // console.log("Encoded JWT ID token: " + response.credential);
    // const responseData = await api.post(`${auth_api}`+`auth-login`, {
    //   id_token: response.credential
    // }, {
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // }).then(response => {
    //   console.log(response);
    // }).catch(error => {
    //   console.error(error);
    // });
    axios({
      method: 'post',
      url: `${auth_api}`+`auth-login`,
      data: {
        id_token: response.credential
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log(response);
      navigate("/");
    })

  }
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_CLIENT_ID_SECRET, 
      callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" }  
    );
    google.accounts.id.prompt(); 
  },[]);
  // const handleSuccess = async (credentialResponse) => {
  //   try {
  //     const response = await api.post(`${auth_api}`+`auth-login`, {
  //       id_token: credentialResponse.credential
  //     }, {
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     }).then(response => {
  //       console.log(response);
  //     }).catch(error => {
  //       console.error(error);
  //     });

  //     console.log("Credential Response:", credentialResponse);
  //     const credentialResponseDecoded = jwtDecode(credentialResponse.credential);
  //     console.log("Credential Response đã giải mã:", credentialResponseDecoded);
  //     dispatch(login(credentialResponseDecoded));
  
  //     navigate("/");
  
  //   } catch (error) {
  //     console.error("Lỗi trong quá trình đăng nhập:", error);

  //   }
  // };

  // const onFinish = async (values) => {
  //   console.log("Success:", values);
  //   try {
  //     const response = await api.post(`${auth_api}`+`login`, {
  //       email: values.username,
  //       password: values.password
  //     }).then(response => {
  //       console.log(response);
  //       dispatch(login(response));
  //     }).catch(error => {
  //       console.error(error);
  //     });
  //   } catch (error) {
  //     console.error("Lỗi trong quá trình đăng nhập:", error);
  //   }
  // };
  const onFinish = async (values) => {
    console.log("Success:", values);
    try {
        const response = await fetch(`${auth_api}`+`auth/login`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email: values.username,
                password: values.password
            })
        });

        if (!response.ok) { 
            const errorData = await response.json(); 
            throw new Error(`${response.status} ${response.statusText}: ${errorData?.message || 'Lỗi đăng nhập'}`);
        }
        const data = await response.json(); 
        console.log(data);
        // Cookie setup
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 1);
        setCookie('user',data,{ expires: expiryDate})
        dispatch(login(data)); 
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
    }
};
  const handleError = (error) => {
    console.error("Lỗi đăng nhập Google:", error);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <div className="login-container">
        <div className="login-form-wrapper">
          <div className="radio-wrapper-19 w-full">
            <div className="radio-inputs-19">
              <label htmlFor="example-19-1">
                <input
                  id="example-19-1"
                  type="radio"
                  name="radio-examples"
                  checked={activeTab === 1}
                  onChange={() => setActiveTab(1)}
                  defaultChecked
                />
                <span className="name">Sign In</span>
              </label>
              <label htmlFor="example-19-2">
                <input
                  id="example-19-2"
                  type="radio"
                  name="radio-examples"
                  checked={activeTab === 2}
                  onChange={() => setActiveTab(2)}
                />
                <span className="name">Sign Up</span>
              </label>
            </div>
          </div>
        </div>
        <div className="login-form">
          {activeTab === 1 && (
            <Form
              form={form}
              name="signin"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              className="sign-in-htm"
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Vui lòng nhập username!" }]}
                className="group"
              >
                <Input className="input" id="user" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập password!" }]}
                className="group"
              >
                <Input.Password className="input" id="pass" />
              </Form.Item>

              <Form.Item
                name="remember"
                valuePropName="checked"
                className="group"
              >
                <Checkbox className="check" id="check">
                  Keep me Signed in
                </Checkbox>
              </Form.Item>

              <Form.Item className="group">
                <Button type="primary" htmlType="submit" className="button">
                  Sign In
                </Button>
              </Form.Item>
              <br />
              {/* <div>
                <label> Đăng nhập bằng: </label>
                <GoogleLogin
                  type="icon"
                  theme="filled_blue"
                  shape="square"
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              </div> */}
              <div id="buttonDiv"></div>

              <div className="hr"></div>
              {/* <div className="foot-lnk mt-2">
                <Link to="/forgot">Forgot Password?</Link>
              </div> */}
              {/* đang cố fix */}
            </Form>
          )}
          {activeTab === 2 && (
            <Form
              form={form}
              name="signup"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              className="sign-up-htm"
            >
              <Form.Item className="group">
                <label htmlFor="user" className="label">
                  Username
                </label>
                <Input id="user" type="text" className="input" />
              </Form.Item>
              <Form.Item className="group">
                <label htmlFor="pass" className="label">
                  Password
                </label>
                <Input
                  id="pass"
                  type="password"
                  className="input"
                  data-type="password"
                />
              </Form.Item>
              <Form.Item className="group">
                <label htmlFor="pass" className="label">
                  Repeat Password
                </label>
                <Input
                  id="pass"
                  type="password"
                  className="input"
                  data-type="password"
                />
              </Form.Item>
              <Form.Item className="group">
                <label htmlFor="pass" className="label">
                  Email Address
                </label>
                <Input id="pass" type="text" className="input" />
              </Form.Item>
              <Form.Item className="group">
                <Button type="submit" className="button" value="Sign Up">
                  {" "}
                  Sign Up
                </Button>
              </Form.Item>
              <div className="hr"></div>
              {/* <div className="foot-lnk">
                <label htmlFor="tab-1">Already Member?</label>
                <button 
                  type="button" className="btn btn-link" onClick={() => setActiveTab(1)}
                > Back to Sign In
                </button>
              </div> */}
              {/* đang cố fix */}
            </Form>
          )}
        </div>
      </div>
    </>
  );
}
