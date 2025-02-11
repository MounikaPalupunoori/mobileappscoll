// redux_toolkit/reducers/LoginReducer.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getStaffURL ,staffLogsURL,pendingLogsURL,updateLogsURL,getStudentsURL} from "../../Networks/EndPoints";
import axiosInstance from "../../Networks/AxiosInstance";

export const getStaff = createAsyncThunk(
  "staff/getStaff",
  async (payload,{ rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(getStaffURL());
      return response.data;
    } catch (error) {
      console.log(error)
         return rejectWithValue(
        error.response && error.response.data
          ? error.response.data
          : "Something went wrong. Please try again."
      );
    }
  }
);
export const getLogs = createAsyncThunk(
  "staff/getLogs",
  async (payload,{ rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(staffLogsURL());
      return response.data;
    } catch (error) {
      console.log(error)
         return rejectWithValue(
        error.response && error.response.data
          ? error.response.data
          : "Something went wrong. Please try again."
      );
    }
  }
);

export const getPendingLogs = createAsyncThunk(
  "staff/getPendingLogs",
  async (payload,{ rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(pendingLogsURL());
      return response.data;
    } catch (error) {
      console.log(error)
         return rejectWithValue(
        error.response && error.response.data
          ? error.response.data
          : "Something went wrong. Please try again.."
      );
    }
  }
);

export const updateLog = createAsyncThunk(
  "staff/updateLog",
  async (payload,{ rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(updateLogsURL(),payload);
      return response.data;
    } catch (error) {
      console.log(error)
         return rejectWithValue(
        error.response && error.response.data
          ? error.response.data
          : "Something went wrong. Please try again."
      );
    }
  }
);

export const getAllStudents = createAsyncThunk(
  "staff/getAllStudents",
  async (payload,{ rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(getStudentsURL(payload));
      return response.data;
    } catch (error) {
      console.log(error)
         return rejectWithValue(
        error.response && error.response.data
          ? error.response.data
          : "Something went wrong. Please try again."
      );
    }
  }
);



const staffSlice = createSlice({
  name: "staff",
  initialState: {
    staffDetails: null,
    loader: false,
    errorMsg: null,
    logs:null,
    pendingLogs:null,
    updatedLog:null,
    allStudents:[],
    hasLoadmoreData: true,
  },
  reducers: {
    clearStaffData : ( state,action ) => {
      state.staffDetails = action.payload;
      state.allStudents = action.payload
  }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStaff.pending, (state) => {
        state.loader = true;
        state.errorMsg = null;
      })
      .addCase(getStaff.fulfilled, (state, action) => {
        state.staffDetails = action?.payload?.result
        state.loader = false;
      })
      .addCase(getStaff.rejected, (state, action) => {
        state.loader = false;
        state.errorMsg = action.payload;
      })
      .addCase(getLogs.pending, (state) => {
        state.loader = true;
        state.errorMsg = null;
      })
      .addCase(getLogs.fulfilled, (state, action) => {
        state.logs = action?.payload?.result
        state.loader = false;
      })
      .addCase(getLogs.rejected, (state, action) => {
        state.loader = false;
        state.errorMsg = action.payload;
      })
      .addCase(getPendingLogs.pending, (state) => {
        state.loader = true;
        state.errorMsg = null;
      })
      .addCase(getPendingLogs.fulfilled, (state, action) => {
        state.pendingLogs = action?.payload?.result
        state.loader = false;
      })
      .addCase(getPendingLogs.rejected, (state, action) => {
        state.loader = false;
        state.errorMsg = action.payload;
      })
      .addCase(updateLog.pending, (state) => {
        state.loader = true;
        state.errorMsg = null;
      })
      .addCase(updateLog.fulfilled, (state, action) => {
        state.updatedLog = action?.payload?.result
        state.loader = false;
      })
      .addCase(updateLog.rejected, (state, action) => {
        state.loader = false;
        state.errorMsg = action.payload;
      })
      .addCase(getAllStudents.pending, (state) => {
        state.loader = true;
        state.errorMsg = null;
      })
      .addCase(getAllStudents.fulfilled, (state, action) => {
        const newData = action?.payload?.result;
        if (newData.length === 0) {
            state.hasLoadmoreData = false;
        } else {
            const uniqueData = newData.filter(
                (item) => !state.allStudents.find((existingItem) => existingItem.studentId === item.studentId)
            );
            state.allStudents = [...state.allStudents, ...uniqueData];
            state.hasLoadmoreData = true;
        }
        state.loader = false;
      })
      .addCase(getAllStudents.rejected, (state, action) => {
        state.loader = false;
        state.errorMsg = action.payload;
      })
      ;
  },
});


export const { clearStaffData} = staffSlice.actions;

export default staffSlice.reducer;
