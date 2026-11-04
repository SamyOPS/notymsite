/** SIREN de La Poste : ses SIRET suivent une règle spécifique (somme des chiffres multiple de 5). */
const LA_POSTE_SIREN = "356000000";

/** Retire espaces et points : « 980 484 190 00023 » → « 98048419000023 ». */
export function normalizeSiret(value: string): string {
  return value.replace(/[\s.]/g, "");
}

function luhn(digits: string): boolean {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

/** SIRET valide : 14 chiffres et clé de Luhn (exception La Poste). */
export function isValidSiret(value: string): boolean {
  const siret = normalizeSiret(value);
  if (!/^\d{14}$/.test(siret)) return false;
  if (siret.startsWith(LA_POSTE_SIREN)) {
    const sum = [...siret].reduce((total, digit) => total + Number(digit), 0);
    return sum % 5 === 0;
  }
  return luhn(siret);
}
