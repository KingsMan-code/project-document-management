// store/clienteSlice.ts - SEM DOCUMENTOS
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ClienteState {
  nome: string;
  cpf: string;
}

const initialState: ClienteState = {
  nome: '',
  cpf: '',
};

export const clienteSlice = createSlice({
  name: 'cliente',
  initialState,
  reducers: {
    setDadosPF: (
      state,
      action: PayloadAction<{ nome: string; cpf: string; dataNascimento?: string }>
    ) => {
      state.nome = action.payload.nome;
      state.cpf = action.payload.cpf;
    },

    limparCliente: () => initialState,
  },
});

export const {
  setDadosPF,
  limparCliente,
} = clienteSlice.actions;

export default clienteSlice.reducer;
