// store/clienteSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Documento {
  nome: string;
  arquivos: File[];
}

interface ClienteState {
  nome: string;
  cpf: string;
  dataNascimento: string;
  documentos: Documento[];
  problema: string;
}

const initialState: ClienteState = {
  nome: '',
  cpf: '',
  dataNascimento: '',
  documentos: [],
  problema: '',
};

export const clienteSlice = createSlice({
  name: 'cliente',
  initialState,
  reducers: {
    setCliente: (state, action: PayloadAction<{ nome: string; cpf: string }>) => {
      state.nome = action.payload.nome;
      state.cpf = action.payload.cpf;
    },
    setDataNascimento: (state, action: PayloadAction<string>) => {
      state.dataNascimento = action.payload;
    },
    adicionarDocumento: (state, action: PayloadAction<Documento>) => {
      state.documentos.push(action.payload);
    },
    setProblema: (state, action: PayloadAction<string>) => {
      state.problema = action.payload;
    },
    limparCliente: () => initialState,
  },
});

export const { setCliente, setDataNascimento, adicionarDocumento, setProblema, limparCliente } = clienteSlice.actions;
export default clienteSlice.reducer;
