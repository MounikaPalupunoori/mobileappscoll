// redux_toolkit/reducers/LoginReducer.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getStudentsListURL,parentProfileURL ,parentImageURL,guestDataURL,recentGuestsURL, updatePickUpTypeURL} from "../../Networks/EndPoints";
import axiosInstance from "../../Networks/AxiosInstance";

export const getStudents = createAsyncThunk(
  "parent/getStudents",
  async (payload,{ rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(getStudentsListURL());
      return response.data;
    } catch (error) {
      console.log(error)
         return rejectWithValue(
        error.response && error.response.data
          ? error.response.data
          : "Login failed. Please try again."
      );
    }
  }
);

export const parentInfo = createAsyncThunk(
  "parent/parentInfo",
  async (payload,{ rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(parentProfileURL());
      return response.data;
    } catch (error) {
      console.log(error)
         return rejectWithValue(
        error.response && error.response.data
          ? error.response.data
          : "Please try again."
      );
    }
  }
);
export const parentImage = createAsyncThunk(
  "parent/parentImage",
  async (payload,{ rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(parentImageURL(),payload,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }
      });
      response.data.type = payload.parentType
      return response.data;
    } catch (error) {
      console.log(error)
         return rejectWithValue(
        error.response && error.response.data
          ? error.response.data
          : "Please try again."
      );
    }
  }
);
export const guestData = createAsyncThunk(
  "parent/guestData",
  async (payload,{ rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(guestDataURL(),payload,{
      });
      return response.data;
    } catch (error) {
      console.log(error)
         return rejectWithValue(
        error.response && error.response.data
          ? error.response.data
          : "Please try again."
      );
    }
  }
);

export const getRecentGuests = createAsyncThunk(
  "parent/getRecentGuests",
  async (payload,{ rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(recentGuestsURL(),payload,{
      });
      return response.data;
    } catch (error) {
      console.log(error)
         return rejectWithValue(
        error.response && error.response.data
          ? error.response.data
          : "Please try again."
      );
    }
  }
);
export const updatePick = createAsyncThunk(
  "parent/updatePick",
  async (payload,{ rejectWithValue ,dispatch}) => {
    try {
      const { id, data } = payload;
      const response = await axiosInstance.put(`${updatePickUpTypeURL()}${id}`,data,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      dispatch(getStudents())
      return response.data;
    } catch (error) {
      console.log(error)
         return rejectWithValue(
        error.response && error.response.data
          ? error.response.data
          : "Please try again."
      );
    }
  }
);

const parentSlice = createSlice({
  name: "parent",
  initialState: {
    studentsList: null,
    parentImage:null,
    userInfo :null,
    guestData:null,
    loader: false,
    recents:null,
    imageLoader:false,
    errorMsg: null,
    type:null
  },
  reducers: {
    clearParentData : ( state,action ) => {
      state.studentsList = action.payload;
  },
  clearImageData :(state,action)=>{
    state.parentImage = action.payload;
  }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStudents.pending, (state) => {
        state.loader = true;
        state.errorMsg = null;
      })
      .addCase(getStudents.fulfilled, (state, action) => {
        if(action?.payload?.result){
          state.studentsList = action?.payload?.result
        }
        state.loader = false;
      })
      .addCase(getStudents.rejected, (state, action) => {
        state.loader = false;
        state.errorMsg = action.payload;
      })
      .addCase(parentInfo.pending, (state) => {
        state.loader = true;
        state.errorMsg = null;
      })
      .addCase(parentInfo.fulfilled, (state, action) => {
        if(action?.payload?.result){
          state.userInfo = action?.payload?.result
        }
        state.loader = false;
      })
      .addCase(parentInfo.rejected, (state, action) => {
        state.loader = false;
        state.errorMsg = action.payload;
      })
      .addCase(updatePick.pending, (state) => {
        state.loader = true;
        state.errorMsg = null;
      })
      .addCase(updatePick.fulfilled, (state, action) => {
        if(action?.payload?.result){
          state.type = action?.payload?.result
        }
        state.loader = false;
      })
      .addCase(updatePick.rejected, (state, action) => {
        state.loader = false;
        state.errorMsg = action.payload;
      })
      .addCase(parentImage.pending, (state) => {
        state.imageLoader = true;
        state.errorMsg = null;
      })
      .addCase(parentImage.fulfilled, (state, action) => {
        if(action?.payload?.result){
          state.parentImage = action?.payload
        }
        state.imageLoader = false;
      })
      .addCase(parentImage.rejected, (state, action) => {
        state.imageLoader = false;
        state.errorMsg = action.payload;
      })
      .addCase(guestData.pending, (state) => {
        state.imageLoader = true;
        state.errorMsg = null;
      })
      .addCase(guestData.fulfilled, (state, action) => {
        if(action?.payload?.result){
          state.guestData = action?.payload?.result
        }
        state.imageLoader = false;
      })
      .addCase(guestData.rejected, (state, action) => {
        state.imageLoader = false;
        state.errorMsg = action.payload;
      }) .addCase(getRecentGuests.pending, (state) => {
        state.imageLoader = true;
        state.errorMsg = null;
      })
      .addCase(getRecentGuests.fulfilled, (state, action) => {
        if(action?.payload?.result){
          state.recents = action?.payload?.result
        }
        state.imageLoader = false;
      })
      .addCase(getRecentGuests.rejected, (state, action) => {
        state.imageLoader = false;
        state.errorMsg = action.payload;
      });
  },
});

export const { clearParentData, clearImageData} = parentSlice.actions;

export default parentSlice.reducer;
