// Função utilitária para exportar um array de objetos para CSV
// e disparar o download no navegador. Pensada para Excel em pt-BR
// (separador ";" e BOM UTF-8 para acentuação correta).

type Coluna<T> = {
  /** Nome do campo em T (ignorado se `formatar` for passado) */
  chave?: keyof T;
  /** Cabeçalho da coluna no CSV */
  titulo: string;
  /** Função opcional para valores calculados/formatados (status, datas, moeda etc) */
  formatar?: (item: T) => string;
};

function escaparCampoCSV(valor: unknown): string {
  if (valor === null || valor === undefined) return "";
  const texto = String(valor);
  if (/[";\n]/.test(texto)) {
    return `"${texto.replace(/"/g, '""')}"`;
  }
  return texto;
}

function gerarCSV<T>(dados: T[], colunas: Coluna<T>[]): string {
  const cabecalho = colunas.map((col) => escaparCampoCSV(col.titulo)).join(";");

  const linhas = dados.map((item) =>
    colunas
      .map((col) =>
        escaparCampoCSV(
          col.formatar ? col.formatar(item) : item[col.chave as keyof T],
        ),
      )
      .join(";"),
  );

  return [cabecalho, ...linhas].join("\r\n");
}

export function exportarCSV<T>(
  dados: T[],
  colunas: Coluna<T>[],
  nomeArquivo = "dados.csv",
): void {
  if (!dados || dados.length === 0) {
    alert("Não há dados para exportar.");
    return;
  }

  const csvString = gerarCSV(dados, colunas);

  // BOM (\uFEFF) garante que o Excel reconheça UTF-8 e acentos apareçam corretos
  const blob = new Blob(["\uFEFF" + csvString], {
    type: "text/csv;charset=utf-8;",
  });

  const file = new File([blob], nomeArquivo, { type: "text/csv" });

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
    navigator.share({
      files: [file],
      title: "Exportar Dados",
    }).catch((err) => {
      console.log("Erro no compartilhamento ou cancelado:", err);
    });
    return;
  }

  // Fallback para navegadores Desktop ou quando a Share API não estiver disponível
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", nomeArquivo);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
