export const LibroInformacionPrestamos = ({ libroId }: { libroId: number }) => {
  return (
    <>
      <div className="my-2 flex w-full flex-col space-y-4 px-0 text-left text-2xl md:px-6">Historial de Prestamos:</div>
      <div className="flex w-full flex-col space-y-4 px-12">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th>Prestamo #</th>
              <th>Prestado a</th>
              <th>Fecha del prestamo</th>
              <th>Fecha de finalización</th>
              <th>Prestó</th>
              <th>Renovado</th>
              <th>Recibió</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>UTN</td>
              <td>2023-01-01</td>
              <td>2023-01-01</td>
              <td>100</td>
              <td>100</td>
              <td>0</td>
            </tr>
            <tr>
              <td>2</td>
              <td>UTN</td>
              <td>2023-01-01</td>
              <td>2023-01-01</td>
              <td>100</td>
              <td>100</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
