import axios from "axios";
import { http } from "../../common/constant";
// users/sign-in
export const register = (data: {
  email: string;
  username: string;
  password: string;
  name: string;
}) => {
  return axios
    .post(`${http}/users/sign-up`, data)
    .then((response) => response.data);
};
