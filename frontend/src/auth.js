export function isAuthenticated() {
  return Boolean(localStorage.getItem("bookcross_access"));
}
