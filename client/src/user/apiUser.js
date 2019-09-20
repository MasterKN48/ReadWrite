import axios from "axios";

export const read= async (userId,token)=>{
    return await axios.get(`/api/user/${userId}`,{ headers: {"Authorization" : `Bearer ${token}`} })
    .then(res=> res)
}
export const remove= async (userId,token)=>{
    return await axios.delete(`/api/user/${userId}`,{ headers: {"Authorization" : `Bearer ${token}`}})
    .then(res=> res)
    .catch(err => err)
}

export const update=async (id,token,user)=>{ 
    //console.log("USER DATA UPDATE: ", user);
    return await fetch(`/api/user/${id}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: user
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
}
export const list= async ()=>{
    return await axios.get(`/api/users`)
    .then(res=> res.data.users)
    .catch(err => err);
}
export const updateUser = (user, next) => {
    if (typeof window !== "undefined") {
        if (localStorage.getItem("jwt")) {
            let auth = JSON.parse(localStorage.getItem("jwt"));
            auth.user = user;
            localStorage.setItem("jwt", JSON.stringify(auth));
            next();
        }
    }
};

export const follow= async (userId,token,followId)=>{
    return axios.put(`/api/user/follow`,{userId,followId},{ headers: {"Authorization" : `Bearer ${token}`}})
    .then(res => { return res.data})
    .catch(err => console.log(err));
}
export const unfollow = async (userId, token, unfollowId) => {
    return await fetch(`/api/user/unfollow`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, unfollowId })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const findpeople=async (id,token)=>{
    return await axios.get(`/api/user/findpeople/${id}`,{ headers: {"Authorization" : `Bearer ${token}`}})
    .then(res => res.data)
    .catch(err => console.log(err))
}