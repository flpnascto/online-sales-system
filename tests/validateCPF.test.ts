import validate from '../src/utils/validateCPF';

test('Verifica se um CPF no formato string é valido', () => {
  const validCPF = '111.444.777-35';
  expect(validate(validCPF)).toBe(true)
})

test('Verifica se um CPF no formato numérico é valido', () => {
  const validCPF: number = 11144477735;
  expect(validate(validCPF.toString())).toBe(true)
})

describe('Verifica se um CPF inválido retorna false', () => {
  test('CPF com menos de 11 caracteres', () => {
    const cpf = '111.444.777-3'
    expect(validate(cpf)).toBe(false)
  });
  test('CPF com mais de 14 caracteres', () => {
    const cpf = '111.444.777-351'
    expect(validate(cpf)).toBe(false)
  });
  test('CPF tem valor vazio', () => {
    const cpf = '';
    expect(validate(cpf)).toBe(false)
  });
  test('CPF com dígito verificador inválido', () => {
    const cpf = '111.444.777-34'
    expect(validate(cpf)).toBe(false)
  });
  
})