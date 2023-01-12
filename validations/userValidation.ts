export const registerValidation: any = (username: string, email: string, password: string) => {
    const errors = [];

    if (!username)
        errors.push({ message: "Please enter a username" });
    if (!email)
        errors.push({ message: "Please enter a email" });
    if (!password)
        errors.push({ message: "Please enter a password" });
    if (password && password.length < 6)
        errors.push({ message: "Password minimum length must be 6" });

    return errors;
};

export const loginValidation: any = (email: string, password: string) => {
    const errors = [];

    if (!email)
        errors.push({ message: "Please enter a email" });
    if (!password)
        errors.push({ message: "Please enter a password" });
    if (password && password.length < 6)
        errors.push({ message: "Password minimum length must be 6" });

    return errors;
};