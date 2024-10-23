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

export const openFolder = (
  id: string,
  sortBy: string,
  sortDirection: string
) => {
  const token = localStorage.getItem("accessToken");
  return axios
    .get(
      `${http}/items/${id}?sortBy=${sortBy}&sortDirection=${sortDirection}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Mengirimkan token dalam header
        },
      }
    )
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

export const fileUploader = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("parent_id", id);
  const token = localStorage.getItem("accessToken");
  try {
    // Mengirim permintaan POST ke server
    const response = await axios.post(`${http}/items/upload/multer`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Mengembalikan data respons dari server
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error; // Melempar error jika ada kesalahan
  }
};

export const copyItem = async (id: string) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.post(
      `${http}/items/copy-here`,
      { id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const copyPasteItem = async (item_id: string, parent_id: string) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.post(
      `${http}/items/copy-paste`,
      { item_id, parent_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const bulkDelete = async (ids: Set<string>) => {
  const token = localStorage.getItem("accessToken");
  try {
    await axios.post(
      `${http}/items/bulk/delete`,
      { id: Array.from(ids) },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
