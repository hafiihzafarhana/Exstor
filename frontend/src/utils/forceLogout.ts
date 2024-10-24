export function forceLogout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("username");
  localStorage.removeItem("rootId");
  sessionStorage.removeItem("copyPath");
  window.location.href = "/login";
}
