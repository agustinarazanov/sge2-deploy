type OrderByObject = {
  [key: string]: string | OrderByObject;
};

/**
 * Recibe un string de orden por columna y devuelve un objeto de OrderBy que puede ser usado en el query de prisma
 * @param orderBy Un string de orden por columna, separado por "_"
 * @param orderDirection "asc" o "desc"
 * @returns Un objeto de OrderBy que puede ser usado en el query de prisma
 *
 * @example
 * // Recibe el string "autor_nombre" y devuelve el objeto { autor: { nombre: "asc" } }
 * const orderBy = construirOrderByDinamico("autor_nombre", "asc");
 *
 * @example
 * // Recibe el string "autorNombre" y devuelve el objeto { autorNombre: "desc" }
 * const orderBy = construirOrderByDinamico("autor_nombre", "desc");
 */
export const construirOrderByDinamico = (orderBy: string, orderDirection: string): OrderByObject => {
  const keys = orderBy.split("_");

  const buildNestedObject = (keys: string[], orderDirection: string): OrderByObject => {
    if (keys.length === 1) {
      return { [String(keys[0])]: orderDirection };
    }

    const [firstKey, ...restKeys] = keys;
    return { [String(firstKey)]: buildNestedObject(restKeys, orderDirection) };
  };

  return buildNestedObject(keys, orderDirection);
};
