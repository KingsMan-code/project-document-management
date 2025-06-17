// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import clienteReducer from './clienteSlice';

export const store = configureStore({
  reducer: {
    cliente: clienteReducer,
  },
});

// Tipos para hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
