import axios from "axios";
export const authenticate=(data,next)=>{
    if(typeof window !== "undefined"){
        //console.log(data)
        localStorage.setItem('jwt',JSON.stringify(data));
        next();
    }
}
export const logout = async next => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("jwt");
        next();
        try {
            await axios
              .get("/api/signout")
              .then(res => console.log('signout success'))
              .catch(err => console.error(err));
        }
        catch (err) {
            return console.log(err);
        }
    }
};
export const forgotPassword = email => {
    console.log("email: ", email);
    return fetch('/api/forgot-password/', {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    })
        .then(response => {
           // console.log("forgot password response: ", response);
            return response.json();
        })
        .catch(err => console.log(err));
};

export const resetPassword = resetInfo => {
    return fetch('/api/reset-password/', {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(resetInfo)
    })
        .then(response => {
            //console.log("forgot password response: ", response);
            return response.json();
        })
        .catch(err => console.log(err));
};

export const isAuthenticated = () => {
    if (typeof window == "undefined") {
        return false;
    }
    if (localStorage.getItem("jwt")) {
        return JSON.parse(localStorage.getItem("jwt"));
    }
    return false;

};
export const socialLogin = async user => {
    try {
        const response = await fetch(`/api/social-login`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            // credentials: "include", // works only in the same origin
            body: JSON.stringify(user)
        });
        console.log("signin response: ", response);
        return response.json();
    }
    catch (err) {
        return console.log(err);
    }
};
