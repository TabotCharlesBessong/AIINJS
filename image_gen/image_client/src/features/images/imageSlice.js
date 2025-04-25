import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Async thunks
export const generateImage = createAsyncThunk(
  'images/generateImage',
  async (prompt, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().auth;
      const response = await axios.post(
        `${API_URL}/api/images/generate`,
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.error || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchUserImages = createAsyncThunk(
  'images/fetchUserImages',
  async (_, thunkAPI) => {
    try {
      const { token } = thunkAPI.getState().auth;
      const response = await axios.get(`${API_URL}/api/images/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.error || error.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  images: [],
  generatedImage: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearGeneratedImage: (state) => {
      state.generatedImage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate Image
      .addCase(generateImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(generateImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.generatedImage = action.payload;
      })
      .addCase(generateImage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Fetch User Images
      .addCase(fetchUserImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.images = action.payload;
      })
      .addCase(fetchUserImages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearGeneratedImage } = imageSlice.actions;
export default imageSlice.reducer; 