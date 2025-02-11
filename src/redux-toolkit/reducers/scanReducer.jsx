// redux_toolkit/reducers/LoginReducer.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { scanCodeURL } from "../../Networks/EndPoints";
import axiosInstance from "../../Networks/AxiosInstance";

export const scanCode = createAsyncThunk(
  "scan/scanCode",
  async (payload,{ rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(scanCodeURL(),payload);
      return response.data;
    } catch (error) {
         return rejectWithValue(
        error.response && error.response.data
          ? error.response.data
          : "Please try again."
      );
    }
  }
);

const scanSlice = createSlice({
  name: "scan",
  initialState: {
    success: null,
    loader: false,
    errorMsg: null,
  },
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(scanCode.pending, (state) => {
        state.loader = true;
        state.errorMsg = null;
      })
      .addCase(scanCode.fulfilled, (state, action) => {
        state.success = action?.payload?.result
        state.loader = false;
      })
      .addCase(scanCode.rejected, (state, action) => {
        state.loader = false;
        state.errorMsg = action.payload;
      });
  },
});



export default scanSlice.reducer;
