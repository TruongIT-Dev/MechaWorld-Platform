import axios from '../../utils/axios-custome';

export const loginGoogle = (credential) => {
  return axios.post('/auth/google-login', {
    id_token: credential
  }, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
}
export const loginEmail = (email, password) => {
  return axios.post('/auth/login', {
    email: email,
    password: password
  }, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
}

// Gửi OTP đến email để Đăng ký
export const sendOTPEmail = (email) => {
  return axios.post('/otp/email/generate', {
    email: email,
  }, {
    headers: {
      "Content-Type": "application/json",
    },
  })
}

// Xác thực email bằng OTP đã gửi
export const verifyEmail = (email, otp) => {
  return axios.post('/otp/email/verify', {
    email: email,
    otp_code: otp,
  },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}


export const signupEmail = (email, fullname, password) => {
  return axios.post('/users', {
    email: email,
    full_name: fullname,
    password: password
  },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
export const checkEmail = (email) => {
  return axios.post(`/check-email?email`, {
    email: email
  },{
    headers: {
      "Content-Type": "application/json",
    },
  });
};


export const verifyToken = (access_token) => {
  return axios.post('tokens/verify', {
    access_token: access_token
  })
}