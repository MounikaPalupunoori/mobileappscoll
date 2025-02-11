export const LoginURL = () => {
  return `users/login`;
};

export const getStudentsListURL =()=>{
  return `users/getParentStudents`
}

export const getStaffURL = ()=>{
  return `users/getProfile`
}

export const scanCodeURL = ()=>{
  return `users/addExit`
}

export const resetPasswordURL = ()=>{
  return `users/forgotPassword`
}

export const changePasswordURL = ()=>{
  return `users/changePassword`
}

export const parentProfileURL = ()=>{
  return `users/getProfile`
}

export const parentImageURL = ()=>{
  return `users/updateProfile`
}

export const staffLogsURL = ()=>{
  return `users/getexits`
}
export const guestDataURL = ()=>{
  return `users/addGuest`
}

export const pendingLogsURL = ()=>{
  return `users/getExits?approvalStatus=Released`
}

export const updateLogsURL = ()=>{
  return `users/updateLog`
}
// users/getStudents?page=${page}&limit=10&pickupType=Walk-Up
export const getStudentsURL = (payload,page,type)=>{
  let url = `users/getStudents?page=${payload.page}&limit=10`;
  if (payload.type && payload.type !== 'All') {
    url += `&pickupType=${payload.type}`;
  }
  return url;
}

export const recentGuestsURL = ()=>{
  return `users/recentGuests`
}
export const updatePickUpTypeURL = ()=>{
  return `users/updateUserProfile/`
}