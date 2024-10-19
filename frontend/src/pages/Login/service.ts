import axios from "axios";
import { http } from "../../common/constant";
// users/sign-in
export const login = (email: string, password: string) => {
  return axios
    .post(`${http}/users/sign-in`, { email, password })
    .then((response) => response.data);
};
