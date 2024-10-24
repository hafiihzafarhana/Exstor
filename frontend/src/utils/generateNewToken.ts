export const generateNewToken = (token: string) => {
  const oldToken = localStorage.getItem("accessToken");
  if (token !== oldToken) {
    localStorage.setItem("accessToken", token);
  }
};
