// src/utils/validation.ts

export function formatCpfCnpj(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length <= 11) {
    // CPF
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2")
      .slice(0, 14);
  } else {
    // CNPJ
    return digits
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18);
  }
}

export function isValidCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cleanCpf = cpf.replace(/\D/g, '');

  // Verifica se o CPF tem 11 dígitos
  if (cleanCpf.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cleanCpf)) {
    return false;
  }

  let sum = 0;
  let remainder;

  // Validação do primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;

  if ((remainder === 10) || (remainder === 11)) {
    remainder = 0;
  }
  if (remainder !== parseInt(cleanCpf.substring(9, 10))) {
    return false;
  }

  sum = 0;
  // Validação do segundo dígito verificador
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;

  if ((remainder === 10) || (remainder === 11)) {
    remainder = 0;
  }
  if (remainder !== parseInt(cleanCpf.substring(10, 11))) {
    return false;
  }

  return true;
}
