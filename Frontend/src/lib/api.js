import { axiosinstance } from "./axios.js";

export const getauthuser = async () => {
    try {
        const response = await axiosinstance.get("/user/me")
        return response.data;
    } catch (error) {
        console.log("Error Message",error.message)
        return null
    }

}

export const completeonboarding = async (userdata) => {
    console.log(userdata)
    const response = await axiosinstance.post('/user/onboarding', userdata)
    return response.data;
}

export const logout = async () => {
    const response = await axiosinstance.post('/user/logout')
    return response.data;
}

export async function getUserFriends() {
  const response = await axiosinstance.get("/user/friends");
  return response.data;
}

export async function getRecommendedUsers() {
  const response = await axiosinstance.get("/user");
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosinstance.get("/user/outgoing-friend-request");
  return response.data;
}

export async function sendFriendRequest(userId) {
  const response = await axiosinstance.post(`/user/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosinstance.get("/user/friend-request");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosinstance.put(`/user/friend-request/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosinstance.get("/chat/token");
  return response.data;
}