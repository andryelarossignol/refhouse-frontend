/**
 * Garante que um arquivo CSV esteja em UTF-8 antes de enviá-lo à API.
 * Detecta arquivos em Latin-1 / Windows-1252 (padrão do Excel no Windows)
 * e os converte para UTF-8, evitando caracteres bizarros como 'CearÃ¡'.
 */
export async function garantirUtf8(file: File): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const bytes = new Uint8Array(e.target?.result as ArrayBuffer)

      // Tenta decodificar como UTF-8 estrito
      const decoderUtf8 = new TextDecoder('utf-8', { fatal: true })
      try {
        decoderUtf8.decode(bytes)
        resolve(file) // Arquivo já é UTF-8 válido — envia sem alteração
      } catch {
        // Falhou: provavelmente Latin-1 / Windows-1252 (Excel padrão Windows)
        const texto = new TextDecoder('iso-8859-1').decode(bytes)
        const utf8Bytes = new TextEncoder().encode(texto)
        resolve(new File([utf8Bytes], file.name, { type: 'text/csv;charset=utf-8' }))
      }
    }
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Cria um Blob CSV com BOM UTF-8 (0xEF 0xBB 0xBF) para que o Excel
 * abra o arquivo com acentuação correta sem precisar de importação manual.
 */
export function adicionarBomUtf8(blob: Blob): Blob {
  const bom = new Uint8Array([0xef, 0xbb, 0xbf])
  return new Blob([bom, blob], { type: 'text/csv;charset=utf-8;' })
}
