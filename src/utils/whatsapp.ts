/**
 * Utilitários para comunicação, compartilhamento e clipboard.
 */

// Telefone padrão da Slimpe (pode ser configurado via variável de ambiente no futuro)
export const SLIMPE_WHATSAPP_NUMBER = "5511999999999";

/**
 * Cria o link direto para o WhatsApp com mensagem pré-definida sobre o produto.
 */
export function getWhatsAppLink(productName: string, productPrice?: number): string {
  const priceText = productPrice 
    ? ` no valor de R$ ${productPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    : " (Sob Consulta)";
    
  const message = `Olá, tenho interesse no produto *${productName}*${priceText}. Poderia me ajudar?`;
  return `https://wa.me/${SLIMPE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Tenta compartilhar o produto usando a Web Share API.
 * Caso não esteja disponível, copia o link para a área de transferência.
 * @returns Promessa com booleano indicando se foi copiado (caso não use Web Share)
 */
export async function shareLink(title: string, text: string, url: string): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url
      });
      return true;
    } catch (error) {
      // Se o usuário cancelar o compartilhamento ou der erro, falha silenciosamente
      if ((error as Error).name !== 'AbortError') {
        console.error("Erro ao usar Web Share API:", error);
      }
    }
  }

  // Fallback: copiar para o clipboard
  return copyTextToClipboard(url);
}

/**
 * Copia um texto para o clipboard de forma resiliente.
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("Falha ao usar navigator.clipboard:", err);
    }
  }

  // Fallback antigo para navegadores incompatíveis
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Evita scroll da tela ao adicionar elemento temporário
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("Falha no fallback de cópia:", err);
    return false;
  }
}
