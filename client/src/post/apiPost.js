import axios from "axios";

export const create = async (userId, token, post) => {
  return await axios
    .post(`/api/post/new/${userId}`, post, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data)
    .catch((err) => err);
};

export const list = async () => {
  return await axios
    .get(`/api/post`)
    .then((res) => {
      console.log(res);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};
export const pageList = async (page) => {
  return await axios
    .get(`/api/post/?page=${page}`)
    .then((res) => {
      console.log(res);
      return res.data;
    })
    .catch((err) => {
      console.log(err.response);
      return err.response;
    });
};

export const like = (userId, token, postId) => {
  return fetch(`/api/post/like`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, postId }),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const unlike = (userId, token, postId) => {
  return fetch(`/api/post/unlike`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, postId }),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
export const singlePost = async (id) => {
  return await axios
    .get(`/api/post/${id}`)
    .then((res) => res.data)
    .catch((err) => err);
};
export const listByUser = async (userId, token) => {
  return await axios
    .get(`/api/post/by/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data.result)
    .catch((err) => console.error(err));
};
export const remove = async (postId, token) => {
  try {
    const response = await fetch(`/api/post/${postId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } catch (err) {
    return console.log(err);
  }
};
export const update = async (postId, token, post) => {
  //console.log(postId, token, post);
  try {
    const response = await axios(`/api/post/${postId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: post,
    });
    if (response) {
      return response;
    }
  } catch (err) {
    console.error(err);
    if (err.response.data) {
      return err.response.data;
    }
  }
};

export const comment = (userId, token, postId, comment) => {
  return fetch(`/api/post/comment`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, postId, comment }),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const uncomment = (userId, token, postId, comment) => {
  return fetch(`/api/post/uncomment`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, postId, comment }),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
