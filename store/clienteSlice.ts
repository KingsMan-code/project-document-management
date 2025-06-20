// store/clienteSlice.ts - VERSÃO CORRIGIDA
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Documento {
  nome: string;
  arquivos: File[];
}

interface Socio {
  nome: string;
  cpf: string;
  dataNascimento: string;
}

interface ClienteState {
  // Tipo de cliente
  tipoCliente: 'pf' | 'pj' | null;
  
  // Campos para Pessoa Física
  nomePF: string;
  cpfPF: string;
  dataNascimentoPF: string;

  // Campos para Pessoa Jurídica
  nomeEmpresa: string;
  cnpj: string;
  dataCriacaoEmpresa: string;
  socios: Socio[];

  // Campos comuns
  documentos: Documento[];
  problema: string;

  // CAMPOS DE COMPATIBILIDADE (para não quebrar código existente)
  nome: string;
  cpf: string;
  dataNascimento: string;
}

const initialState: ClienteState = {
  tipoCliente: null,
  nomePF: '',
  cpfPF: '',
  dataNascimentoPF: '',
  nomeEmpresa: '',
  cnpj: '',
  dataCriacaoEmpresa: '',
  socios: [],
  documentos: [],
  problema: '',
  // Campos de compatibilidade
  nome: '',
  cpf: '',
  dataNascimento: '',
};

export const clienteSlice = createSlice({
  name: 'cliente',
  initialState,
  reducers: {
    setTipoCliente: (state, action: PayloadAction<'pf' | 'pj'>) => {
      state.tipoCliente = action.payload;
      // Limpa os campos do outro tipo ao mudar
      if (action.payload === 'pf') {
        state.nomeEmpresa = '';
        state.cnpj = '';
        state.dataCriacaoEmpresa = '';
        state.socios = [];
      } else { // 'pj'
        state.nomePF = '';
        state.cpfPF = '';
        state.dataNascimentoPF = '';
      }
    },
    
    // Ações para Pessoa Física
    setDadosPF: (state, action: PayloadAction<{ nome: string; cpf: string; dataNascimento: string }>) => {
      state.nomePF = action.payload.nome;
      state.cpfPF = action.payload.cpf;
      state.dataNascimentoPF = action.payload.dataNascimento;
      
      // ATUALIZA CAMPOS DE COMPATIBILIDADE
      state.nome = action.payload.nome;
      state.cpf = action.payload.cpf;
      state.dataNascimento = action.payload.dataNascimento;
    },
    
    // Ações para Pessoa Jurídica
    setDadosPJ: (state, action: PayloadAction<{ nomeEmpresa: string; cnpj: string; dataCriacaoEmpresa: string }>) => {
      state.nomeEmpresa = action.payload.nomeEmpresa;
      state.cnpj = action.payload.cnpj;
      state.dataCriacaoEmpresa = action.payload.dataCriacaoEmpresa;
      
      // ATUALIZA CAMPOS DE COMPATIBILIDADE
      state.nome = action.payload.nomeEmpresa;
      state.cpf = action.payload.cnpj;
      state.dataNascimento = action.payload.dataCriacaoEmpresa;
    },
    
    setSocios: (state, action: PayloadAction<Socio[]>) => {
      state.socios = action.payload;
    },
    
    adicionarSocio: (state, action: PayloadAction<Socio>) => {
      state.socios.push(action.payload);
    },
    
    removerSocio: (state, action: PayloadAction<number>) => {
      state.socios.splice(action.payload, 1);
    },
    
    atualizarSocio: (state, action: PayloadAction<{ index: number; socio: Socio }>) => {
      state.socios[action.payload.index] = action.payload.socio;
    },

    // Ações comuns (mantidas para compatibilidade TOTAL)
    setCliente: (state, action: PayloadAction<{ nome: string; cpf: string }>) => {
      // Atualiza tanto os campos novos quanto os de compatibilidade
      state.nomePF = action.payload.nome;
      state.cpfPF = action.payload.cpf;
      state.tipoCliente = 'pf';
      
      // Campos de compatibilidade
      state.nome = action.payload.nome;
      state.cpf = action.payload.cpf;
    },
    
    setDataNascimento: (state, action: PayloadAction<string>) => {
      // Atualiza tanto o campo novo quanto o de compatibilidade
      state.dataNascimentoPF = action.payload;
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

export const {
  setTipoCliente,
  setDadosPF,
  setDadosPJ,
  setSocios,
  adicionarSocio,
  removerSocio,
  atualizarSocio,
  setCliente,
  setDataNascimento,
  adicionarDocumento,
  setProblema,
  limparCliente,
} = clienteSlice.actions;

export default clienteSlice.reducer;

