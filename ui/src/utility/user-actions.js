export const isAdmin = () => {
    const roles = localStorage.getItem("roles");
    if (!roles) {
        return true;
    }
    return JSON.parse(roles).includes("admin");
};

export const setRoles = (roles) => {
    if(roles) {
        localStorage.setItem("roles", JSON.stringify(roles));
    }
};
