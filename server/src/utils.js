import User from './models/user.model.js'

export async function validateSignup(email, password, cnfPassword) {
    try {
        if (!email || !password || !cnfPassword) {
            return "Please fill all the fields.";
        }

        const validEmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/g;

        if (validEmailRegex.test(email) === false) {
            return "Please enter a valid email address.";
        }

        if (password.length < 8) {
            return "Password must be at least 8 characters long.";
        }

        if (password !== cnfPassword) {
            return "Password do not match.";
        }

        const userExists = await User.exists({ email });

        if (userExists) {
            return "User with this email already exists.";
        }

        return "";
    } catch (error) {
        console.log(error);
        return "Something went wrong, please try again!";
    }
}

export function validateLogin(email, password) {

    if (!email || !password) {
        return "Please fill all the fields.";
    }

    const validEmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/g;

    if (validEmailRegex.test(email) === false) {
        return "Please enter a valid email address.";
    }

    return "";
}