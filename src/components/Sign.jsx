import { useNavigate } from "react-router-dom";
import {  Form, Input, Button } from "antd";
import {  useEffect, useState } from "react";
import { useDispatch, } from "react-redux";
import { login } from "../features/auth/authSlice";
import "../assets/css/sign.css";
import Cookies from "js-cookie";
import { loginEmail,loginGoogle,signupEmail } from "../apis/Auth/APIAuth";
import { Alert } from 'antd';
import { GoogleLogin  } from "@react-oauth/google";
import bgImage from "../assets/image/gundam_bg.jpg";

export default function Sign() {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState(1); 
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMess, setAlertMess] = useState('');
  const [alertType, setAlertType] = useState("error");
  // const loginGooglebtn = useGoogleOAuth({
  //   onSuccess: TokenResponse => console.log(TokenResponse),
  //   flow: 'implicit',
    
  // });
  async function handleCredentialResponse(response) {
    // console.log(response);
    loginGoogle(response.credential).then(response => {
      // console.log(response.data);
      dispatch(login(response.data));
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false); 
        console.log("Login thành công");
        navigate("/");
    }, 1500);
    }).catch(error => {
      console.error(error);
  });
  }
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  useEffect(() => {
    // /* global google */
    // google.accounts.id.initialize({
    //   client_id: import.meta.env.VITE_CLIENT_ID_SECRET, 
    //   callback: handleCredentialResponse
    // });
    // google.accounts.id.renderButton(
    //   document.getElementById("buttonDiv"),
    //   { theme: "outline", size: "large" }  
    // );
    // google.accounts.id.prompt(); 
  },[]);

  // const onFinishSignUp = async (values) => {
  //   console.log("Success: ", values);
  //   try {
  //     signupEmail(values.email, values.password).then(response => {
  //       console.log(response.data);
  //     }).catch(error => {
  //       console.error('Lỗi API: ',error);
  //     });
  //   } catch (error) {
  //     console.error("Lỗi đăng kí tài khoản:", error);
  //   }
  // };
  const onFinishSignUp = async (values) => {
    const { email, password, confirmPassword } = values;

    if (!validateEmail(email)) {
      setAlertMess("Email không hợp lệ! Vui lòng nhập lại.");
      setAlertType("error");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false); 
      }, 1800);
      return;
    }
    if (password !== confirmPassword) {
      setAlertMess("Mật khẩu không khớp! Vui lòng kiểm tra lại.");
      setAlertType("error");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false); 
      }, 1800);
      return;
    }
    setLoading(true); 
    try {
      const response = await signupEmail(email, password);

      if (response.status === 201) {
        setAlertMess('Đăng ký tài khoản thành công!');
        setAlertType("success");
        setShowAlert(true);
        setTimeout(() => {
          setActiveTab(1);
          setShowAlert(false); 
      }, 1800);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setAlertMess("Email đã được đăng ký! Vui lòng chọn email khác.");
        setAlertType('error');
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false); 
      }, 800);
      } else {
        setAlertMess("Đăng ký thất bại! Vui lòng thử lại.");
        setAlertType('error');
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false); 
      }, 800);
      }
    } finally {
      setLoading(false); // Tắt loading sau khi gọi API
    }
  };
  const onFinish = async (values) => {
    console.log("Success:", values);
    try {
      loginEmail(values.email, values.password).then(response => {
        console.log(response.data);
        // const expiryDate = new Date();
        // expiryDate.setDate(expiryDate.getDate() + 1); 
        // Cookie setup
        Cookies.set('user', JSON.stringify(response.data.user), {
          expires: new Date(response.data.access_token_expires_at), 
          path: "/",
        });
        dispatch(login(response.data));
        setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false); 
        navigate("/");
    }, 1500);
    })
    .catch(error => {
        console.error(error);
    });
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
    }
};
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onFinishSignUpFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <div
        className="auth-container flex items-center justify-start h-screen bg-cover bg-center "
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="relative py-3 sm:max-w-xl ml-40 mt-4">
          <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10 ">
            
            {activeTab === 1 && (
              <div className="max-w-md section">
                <h2 className="flex items-center space-x-5 justify-center font-bold">
                  Đăng Nhập
                </h2>

                <Form
                  form={form}
                  name="signin"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  className="sign-in-htm"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 25 }}
                >
                  <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                      { required: true, message: "Vui lòng nhập username!" },
                    ]}
                    className="group"
                  >
                    <Input className="input w-full" id="user" />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      { required: true, message: "Vui lòng nhập password!" },
                    ]}
                    className="group"
                  >
                    {/* <label
                  htmlFor="password"
                  className="font-semibold text-sm text-gray-600 block"
                >
                  Password
                </label> */}
                    <Input className="input w-full" id="pass" type="password"/>
                  </Form.Item>
                  <Form.Item className="group">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="py-2 mt-5 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-52 mx-24 transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                    >
                      Sign In
                    </Button>
                  </Form.Item>
                </Form>
                <div className="text-right mb-4 mt-2">
                  <a
                    className="text-xs font-display font-semibold text-gray-500 hover:text-gray-600 cursor-pointer "
                    href="#"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="justify-center items-center mx-20">
                  <GoogleLogin
                    theme="filled_blue"
                    size="large"
                    shape="pill"
                    text="continue_with"
                    width="250"
                   
                    onSuccess={(credentialResponse) => {
                      handleCredentialResponse(credentialResponse);
                    }}
                    onError={() => {
                      console.log("Login Failed");
                    }}
                  />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
                  <button
                    className="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline"
                    onClick={() => setActiveTab(2)}
                  >
                    or sign up
                  </button>
                  <span className="w-1/5 border-b dark:border-gray-400 md:w-1/4"></span>
                </div>
              </div>
            )}
          {activeTab === 2 && (
              <div className="w-96 ">
                <h2 className="flex items-center space-x-5 justify-center font-bold">
                  Đăng kí
                </h2>
                <Form
                  form={form}
                  name="signup"
                  onFinish={onFinishSignUp}
                  onFinishFailed={onFinishSignUpFailed}
                  autoComplete="off"
                  className="sign-in-htm"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 25 }}
                >
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        message: "Vui lòng nhập email!",
                        required: true,
                      },
                    ]}
                    label="Email"
                    className=""
                  >
                    <Input type="email" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      { message: "Vui lòng nhập mật khẩu!", required: true },
                    ]}
                    label="Password"
                  >
                    <Input type="password" className="" />
                  </Form.Item>
                  <Form.Item
                    name="confirm-password"
                    rules={[
                      {
                        message: "Vui lòng nhập lại mật khẩu!",
                        required: true,
                      },
                    ]}
                    label="Confirm Password"
                  >
                    <Input type="password" />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      className="py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                    >
                      {loading ? "Đang xử lý..." : "Đăng Ký"}
                    </Button>
                  </Form.Item>
                </Form>
                <div className="flex items-center justify-between mt-4">
                  <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
                  <button
                    className="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline"
                    onClick={() => setActiveTab(1)}
                  >
                    Đã có tài khoản? Đăng nhập
                  </button>
                  <span className="w-1/5 border-b dark:border-gray-400 md:w-1/4"></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showAlert && ( 
            <Alert
                className="fixed bottom-4 right-4 z-50 px-4 py-3 rounded"
                message={alertMess}
                type={alertType}
                // type="error"
                showIcon
                closable 
                afterClose={() => setShowAlert(false)}
            />
        )}
    </>
  );
}
