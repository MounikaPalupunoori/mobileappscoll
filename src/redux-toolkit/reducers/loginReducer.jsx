// redux_toolkit/reducers/LoginReducer.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LoginURL } from "../../Networks/EndPoints";
import axiosInstance from "../../Networks/AxiosInstance";

export const emailLogin = createAsyncThunk(
  "login/emailLogin",
  async (credentials, { rejectWithValue }) => {
    const data = {
      email: credentials.username,
      password: credentials.password,
    };
    try {
      const response = await axiosInstance.post(LoginURL(), data);
      return response.data;
    } catch (error) {
      if(error?.response?.data?.error){
        alert(error?.response?.data?.error)
      }else{
        alert("Login Failed")
      }
      console.log(error?.response?.data?.error,"error")
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState: {
    user: null,
    loader: false,
    errorMsg: null,
  },
  reducers: {
    // You can add non-async reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(emailLogin.pending, (state) => {
        state.loader = true;
        state.errorMsg = null;
      })
      .addCase(emailLogin.fulfilled, (state, action) => {
        state.loader = false;
        state.user = action.payload;
      })
      .addCase(emailLogin.rejected, (state, action) => {
        state.loader = false;
        state.errorMsg = action.payload;
      });
  },
});

export default loginSlice.reducer;
