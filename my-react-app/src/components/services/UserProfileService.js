import axios from 'axios';
import { toast } from "react-toastify";
import UserProfileDto from '../../models/UserProfileDto';

export const GetUserProfileService = async (data) => {
  return await axios.get(`${process.env.REACT_APP_API_URL}/api/userprofile/getprofile/${data}`, {
    headers: {
    }
  }).then(function (response) {
    const userProfile = new UserProfileDto((response.data).id, (response.data).username, (response.data).password, (response.data).email, (response.data).name, (response.data).surname, (response.data).dateOfBirth, (response.data).address, (response.data).picture, (response.data).verify)
    return userProfile;
  })
    .catch(function (error) {
      return error;
    });
}

export const UpdateUserProfileService = async (data) => {
  return await axios.put(`${process.env.REACT_APP_API_URL}/api/userprofile/updateprofile`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(function (response) {
    toast.success("Profile sucessfully updated!")
    const updatedProfile = new UserProfileDto((response.data).id, (response.data).username, (response.data).password, (response.data).email, (response.data).name, (response.data).surname, (response.data).dateOfBirth, (response.data).address, (response.data).picture, (response.data).verify)
    return updatedProfile;
  })
    .catch(function (error) {
      toast.error(error.response.data)
      return error;
    });
}