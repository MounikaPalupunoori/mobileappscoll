// redux_toolkit/reducers/LoginReducer.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { resetPasswordURL,changePasswordURL } from "../../Networks/EndPoints";
import axiosInstance from "../../Networks/AxiosInstance";

export const resetPassword = createAsyncThunk(
  "password/resetPassword",
  async (payload,{ rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(resetPasswordURL(),payload);
      return response.data;
    } catch (error) {
         return rejectWithValue(
        error.response && error.response.data
          ? error.response.data
          : "Login failed. Please try again."
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "password/changePassword",
  async (payload,{ rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(changePasswordURL(),payload);
      return response.data;
    } catch (error) {
         return rejectWithValue(
        error.response && error.response.data
          ? error.response.data
          : "Login failed. Please try again."
      );
    }
  }
);

const passwordSlice = createSlice({
  name: "password",
  initialState: {
    success: null,
    loader: false,
    errorMsg: null,
  },
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loader = true;
        state.errorMsg = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.success = action?.payload?.result
        state.loader = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loader = false;
        state.errorMsg = action.payload;
      })
      .addCase(changePassword.pending, (state) => {
        state.loader = true;
        state.errorMsg = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.success = action?.payload?.result
        state.loader = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loader = false;
        state.errorMsg = action.payload;
      });
  },
});



export default passwordSlice.reducer;
