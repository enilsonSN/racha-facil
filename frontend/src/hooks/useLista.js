import { useCallback, useEffect, useState } from 'react';

// Carrega uma lista da API e expõe estado de carregamento, erro e uma função para recarregar.
export default function useLista(buscar, deps = []) {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const recarregar = useCallback(async () => {
    setCarregando(true);
    try {
      setItens(await buscar());
      setErro('');
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  return { itens, carregando, erro, setErro, recarregar };
}
