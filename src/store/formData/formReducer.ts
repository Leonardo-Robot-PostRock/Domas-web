import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface FormData {
  formData: Object;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: FormData = {
  formData: {},
  isLoading: false,
  error: null,
  successMessage: null,
};

export const teamsSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<Object>) => {
      state.formData = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccessMessage: (state, action: PayloadAction<string | null>) => {
      state.successMessage = action.payload;
    },
    resetForm: (state) => {
      state.formData = {};
      state.isLoading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFormData, setLoading, setError, setSuccessMessage, resetForm } = teamsSlice.actions;

export default teamsSlice.reducer;
