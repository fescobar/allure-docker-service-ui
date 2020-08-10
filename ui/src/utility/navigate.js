export const redirect = (error) => {
  if (error.redirect) {
    window.location.reload();
  }
};

export const redirectRoot = () => {
  window.location.replace(window._env_.ROUTER_BASE_NAME);
};
