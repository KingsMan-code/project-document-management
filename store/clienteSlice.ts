// store/clienteSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Documento {
  nome: string;
  arquivos: File[];
}

interface ClienteState {
  nome: string;
  cpf: string;
  documentos: Documento[];
}

const initialState: ClienteState = {
  nome: '',
  cpf: '',
  documentos: [],
};

export const clienteSlice = createSlice({
  name: 'cliente',
  initialState,
  reducers: {
    setCliente: (state, action: PayloadAction<{ nome: string; cpf: string }>) => {
      state.nome = action.payload.nome;
      state.cpf = action.payload.cpf;
    },
    adicionarDocumento: (state, action: PayloadAction<Documento>) => {
      state.documentos.push(action.payload);
    },
    limparCliente: () => initialState,
  },
});

export const { setCliente, adicionarDocumento, limparCliente } = clienteSlice.actions;
export default clienteSlice.reducer;
