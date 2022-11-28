import validate from '../src/utils/validateCPF';

const validCpfs = [
	"987.654.321-00",
	"714.602.380-01",
	"313.030.210-72",
	"144.796.170-60"
];

test.each(validCpfs)('Verifica se o CPF %s no formato string é valido', () => {
  const validCPF = '111.444.777-35';
  expect(validate(validCPF)).toBe(true);
})

test('Verifica se um CPF no formato numérico é valido', () => {
  const validCPF: number = 11144477735;
  expect(validate(validCPF.toString())).toBe(true);
})

const invalidCpfs = [
	"111.111.111-11",
	"222.222.222-22",
	"333.333.333-33",
	"444.444.444-44",
	"555.555.555-55",
	"666.666.666-66",
	"777.777.777-77",
	"888.888.888-88",
	"999.999.999-99",
	"987.654.321-01",
	"714.602.380-10",
	"313.030.210-70",
	"144.796.170-10"
];

describe('Verifica se retorna false quando', () => {
  test('o CPF tem menos de 11 caracteres', () => {
    const cpf = '111.444.777-3';
    expect(validate(cpf)).toBeFalsy();
  });
  test('o CPF tem mais de 14 caracteres', () => {
    const cpf = '111.444.777-351';
    expect(validate(cpf)).toBeFalsy();
  });
  test('o CPF tem valor vazio', () => {
    const cpf = '';
    expect(validate(cpf)).toBeFalsy();
  });
  test.each(invalidCpfs)('o CPF é inválido: %s', () => {
    const cpf = '111.444.777-34';
    expect(validate(cpf)).toBe(false)
  });
})