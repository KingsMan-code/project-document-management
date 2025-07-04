// store/clienteSlice.ts - SEM DOCUMENTOS
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ClienteState {
  // Apenas campos para Pessoa Física
  nomePF: string;
  cpfPF: string;
  dataNascimentoPF: string;

  // Campos comuns
  problema: string;

  // CAMPOS DE COMPATIBILIDADE (para não quebrar código existente)
  nome: string;
  cpf: string;
  dataNascimento: string;
}

const initialState: ClienteState = {
  nomePF: '',
  cpfPF: '',
  dataNascimentoPF: '',
  problema: '',
  nome: '',
  cpf: '',
  dataNascimento: '',
};

export const clienteSlice = createSlice({
  name: 'cliente',
  initialState,
  reducers: {
    // Ações para Pessoa Física
    setDadosPF: (
      state,
      action: PayloadAction<{ nome: string; cpf: string; dataNascimento?: string }>
    ) => {
      state.nomePF = action.payload.nome;
      state.cpfPF = action.payload.cpf;
      state.dataNascimentoPF = action.payload.dataNascimento ?? "";

      // ATUALIZA CAMPOS DE COMPATIBILIDADE
      state.nome = action.payload.nome;
      state.cpf = action.payload.cpf;
      state.dataNascimento = action.payload.dataNascimento ?? "";
    },

    // Ações comuns
    setCliente: (state, action: PayloadAction<{ nome: string; cpf: string }>) => {
      state.nomePF = action.payload.nome;
      state.cpfPF = action.payload.cpf;
      state.nome = action.payload.nome;
      state.cpf = action.payload.cpf;
    },

    setDataNascimento: (state, action: PayloadAction<string>) => {
      state.dataNascimentoPF = action.payload;
      state.dataNascimento = action.payload;
    },

    setProblema: (state, action: PayloadAction<string>) => {
      state.problema = action.payload;
    },

    limparCliente: () => initialState,
  },
});

export const {
  setDadosPF,
  setCliente,
  setDataNascimento,
  setProblema,
  limparCliente,
} = clienteSlice.actions;

export default clienteSlice.reducer;
