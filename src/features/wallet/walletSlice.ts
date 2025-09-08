import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface WalletState {
  address: string | null;
}

const initialState: WalletState = {
  address: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setAddress(state, action: PayloadAction<string>) {
      state.address = action.payload;
    },
    clearAddress(state) {
      state.address = null;
    },
  },
});

export const { setAddress, clearAddress } = walletSlice.actions;
export default walletSlice.reducer;
