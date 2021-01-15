export const isAdmin = () => {
    const roles = localStorage.getItem("roles");
    if (!roles) {
        return true;
    }

    try {
        return JSON.parse(roles).includes("admin");
    } catch (ex) {
        return false;
    }
};

export const setRoles = (roles) => {
    if (roles) {
        localStorage.setItem("roles", JSON.stringify(roles));
    }
};

export const setViewerRole = () => {
    localStorage.setItem("roles", JSON.stringify(['viewer']));
};
