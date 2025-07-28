// store/clienteSlice.ts - SEM DOCUMENTOS
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ClienteState {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
}

const initialState: ClienteState = {
  nome: '',
  cpf: '',
  telefone: '',
  email: '',
};

export const clienteSlice = createSlice({
  name: 'cliente',
  initialState,
  reducers: {
    setDadosPF: (
      state,
      action: PayloadAction<{
        nome: string;
        cpf: string;
        telefone: string;
        email: string;
        dataNascimento?: string;
      }>
    ) => {
      state.nome = action.payload.nome;
      state.cpf = action.payload.cpf;
      state.telefone = action.payload.telefone;
      state.email = action.payload.email;
    },

    limparCliente: () => initialState,
  },
});

export const {
  setDadosPF,
  limparCliente,
} = clienteSlice.actions;

export default clienteSlice.reducer;
