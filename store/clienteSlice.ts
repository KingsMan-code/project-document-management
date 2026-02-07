// store/clienteSlice.ts - SEM DOCUMENTOS
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ClienteState {
  nome: string;
}

const initialState: ClienteState = {
  nome: '',
};
export const clienteSlice = createSlice({
  name: 'cliente',
  initialState,
  reducers: {
    setDadosPF: (
      state,
      action: PayloadAction<{
        nome: string;
        dataNascimento?: string;
      }>
    ) => {
      state.nome = action.payload.nome;
    },


    limparCliente: () => initialState,
  },
});

export const {
  setDadosPF,
  limparCliente,
} = clienteSlice.actions;

export default clienteSlice.reducer;
