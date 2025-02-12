import axios from '../../utils/axios-custome';

export const loginGoogle = (credential) => {
    return axios.post('/auth/google-login', {
        id_token: credential
    },{
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
