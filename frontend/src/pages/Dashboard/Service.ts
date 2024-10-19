import axios from "axios";
import { http } from "../../common/constant";

export const getAllRoot = (id: string) => {
  const endPoint =
    id === null || id === undefined ? "items/root" : `items/${id}`;
  const token = localStorage.getItem("accessToken");
  return axios
    .get(`${http}/${endPoint}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Mengirimkan token dalam header
      },
    })
    .then((response) => response.data);
};

export const openFile = (id: string) => {
  const token = localStorage.getItem("accessToken");
  return axios
    .get(`${http}/items/open/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Mengirimkan token dalam header
      },
    })
    .then((response) => response.data);
};

export const openFolder = (id: string) => {
  const token = localStorage.getItem("accessToken");
  return axios
    .get(`${http}/items/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Mengirimkan token dalam header
      },
    })
    .then((response) => response.data);
};

export const create = (newItem: { name: string; type: string }, id: string) => {
  const endpoint =
    newItem.type === "folder" ? "/items/create-folder" : "/items/create-file";
  const token = localStorage.getItem("accessToken");

  return axios
    .post(
      `${http}${endpoint}`,
      {
        // Sertakan endpoint tanpa 'items/'
        name: newItem.name, // Mengirimkan itemName sebagai body
        parent_id: id, // Sertakan parent_id jika diperlukan
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Mengirimkan token dalam header
        },
      }
    )
    .then((response) => response.data);
};

export const onDelete = (id: string) => {
  const token = localStorage.getItem("accessToken");

  return axios
    .delete(`${http}/items/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Mengirimkan token dalam header
      },
    })
    .then((response) => response.data);
};

export const onUpdate = (id: string, name: string) => {
  const token = localStorage.getItem("accessToken");
  return axios
    .put(
      `${`${http}/items/update-name`}`,
      {
        new_name: name,
        id, // Sertakan parent_id jika diperlukan
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Mengirimkan token dalam header
        },
      }
    )
    .then((response) => response.data);
};
