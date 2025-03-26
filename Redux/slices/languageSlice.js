import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  language: 'hi', // Default language
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    toggleLanguage: (state) => {
      state.language = state.language === 'en' ? 'hi' : 'en'; // Toggle between English and French
    },
    setLanguage: (state, action) => {
      state.language = action.payload; // Set specific language
    },
  },
});

export const { toggleLanguage, setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
