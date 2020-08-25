export const redirect = (error) => {
  if (error.redirect) {
    window.location.reload();
  }
};

export const redirectRoot = () => {
  window.location.replace(window._env_.ROUTER_BASE_NAME);
};

export const refreshCurrentPage = () => {
  window.location.replace(window.location.href);
};

export const redirectRootInSeconds = (seconds) => {
  wait(seconds * 1000).then(() => {
    redirectRoot();
  });
};

export const refreshCurrentPageInSeconds = (seconds) => {
  wait(seconds * 1000).then(() => {
    refreshCurrentPage();
  });
};

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
