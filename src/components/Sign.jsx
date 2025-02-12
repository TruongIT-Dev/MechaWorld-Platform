import { useNavigate } from "react-router-dom";
import { Checkbox, Form, Input, Button } from "antd";
import {  useEffect, useState } from "react";
import { useDispatch, } from "react-redux";
import { login } from "../features/auth/authSlice";
import "../assets/css/sign.css";
import { useCookies } from "react-cookie";
import { loginEmail,loginGoogle } from "../apis/Auth/APIAuth";
import { Alert } from 'antd';

export default function Sign() {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie] = useCookies(['cookie-name']);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState(1); 
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(false);

  // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  async function handleCredentialResponse(response) {
    // console.log(response.credential);
    console.log(response);
    loginGoogle(response.credential).then(response => {
      console.log(response.data);
      dispatch(login(response.data));
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false); 
        navigate("/");
    }, 3000);
    }).catch(error => {
      console.error(error);
  });
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
  //     const response = await api.post(`/auth/google-login`, {
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
  //     navigate("/");
  
  //   } catch (error) {
  //     console.error("Lỗi trong quá trình đăng nhập:", error);

  //   }
  // };

  const onFinish = async (values) => {
    console.log("Success:", values);
    try {
      loginEmail(values.email, values.password).then(response => {
        console.log(response.data);
        // const expiryDate = new Date();
        // expiryDate.setDate(expiryDate.getDate() + 1); 
        // Cookie setup
        setCookie('user',response.data.user,{ expires: response.data.access_token_expires_at});
        dispatch(login(response.data));
        setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false); 
        navigate("/");
    }, 3000);
    })
    .catch(error => {
        console.error(error);
    });
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
    }
};
  // const handleError = (error) => {
  //   console.error("Lỗi đăng nhập Google:", error);
  // };
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
                name="email"
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
        {showAlert && ( 
            <Alert
                className="fixed bottom-4 right-4 z-50 bg-green-100 border-green-400 text-green-700 px-4 py-3 rounded"
                message="Đăng nhập thành công!"
                type="success"
                closable 
                afterClose={() => setShowAlert(false)}
            />
        )}
      </div>
    </>
  );
}
