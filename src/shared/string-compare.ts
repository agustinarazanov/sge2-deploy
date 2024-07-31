/**
 * Esta función ignora las acentuaciones, mayúsculas y compara dos strings y devuelve verdadero si la primera string está dentro de la segunda string
 * @param str1 string a buscar dentro de str2
 * @param str2 string posiblemente conteniendo el string a buscar
 * @returns true si la primera string está dentro de la segunda string
 *
 * @example
 * estaDentroDe("hola", "hola"); // true
 * esatDentroDe("matematica", "Matemática"); // true
 */
export const estaDentroDe = (str1: string, str2: string) => {
  return str2
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .includes(
      str1
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""),
    );
};
