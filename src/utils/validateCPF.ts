function calculateDigit(cpf: string[]) {
  const initialValue = 0;
  const indice = 11;
  const digitCalcSum = cpf.reduce((acc, curr, index) => (
    ((parseInt(curr, 10) * (cpf.length + 1 - index))) + acc
  ), initialValue);
  const resto = digitCalcSum % indice;
  if (resto < 2) return '0';
  return (indice - resto).toString()
}

export default function validate (rawCpf: string) {
  const cleanCpf = rawCpf.replace(/\D/g, "");
  if (isInvalidLength(cleanCpf)) return false;
  if (allDigitsTheSame(cleanCpf)) return false;
  const cpfArray = cleanCpf.substring(0, 9).split('');
  const firstDigit = calculateDigit(cpfArray);
  cpfArray.push(firstDigit)
  const secondDigit = calculateDigit(cpfArray);
  const calculatedDigit = `${firstDigit}${secondDigit}`;
  const receivedDigit = extractDigits(cleanCpf);
  return receivedDigit === calculatedDigit;
}


function isInvalidLength (cpf: string) {
	return cpf.length !== 11;
}

function allDigitsTheSame (cpf: string) {
	const [firstDigit] = cpf;
	return [...cpf].every(digit => digit === firstDigit);
}

function extractDigits (cpf: string) {
	return cpf.slice(9);
}