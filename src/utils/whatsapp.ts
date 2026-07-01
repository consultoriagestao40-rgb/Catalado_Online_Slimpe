/**
 * Utilitários para comunicação, compartilhamento e clipboard.
 */

// Telefone padrão da Slimpe (pode ser configurado via variável de ambiente no futuro)
export const SLIMPE_WHATSAPP_NUMBER = "5541988558959";

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
 * Tenta compartilhar o produto usando a Web Share API, incluindo o arquivo de imagem se possível.
 */
export async function shareLink(title: string, text: string, url: string, imageUrl?: string): Promise<boolean> {
  if (navigator.share) {
    try {
      const shareData: ShareData = {
        title,
        text: `${text} ${url}`,
      };

      // Tenta anexar o arquivo de imagem se fornecido e se o navegador suportar
      if (imageUrl) {
        try {
          // Utiliza o proxy local de imagens para evitar problemas de CORS
          const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
          const response = await fetch(proxyUrl);
          
          if (response.ok) {
            const blob = await response.blob();
            const mimeType = blob.type || 'image/jpeg';
            const extension = mimeType.split('/')[1] || 'jpg';
            const filename = `produto.${extension}`;
            
            const file = new File([blob], filename, { type: mimeType });

            // Verifica se o navegador aceita compartilhar o arquivo
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              shareData.files = [file];
              // Ajusta o texto de compartilhamento com a imagem anexada
              shareData.text = `${title}\n${text}\n${url}`;
              // Alguns aplicativos no celular requerem apenas texto e arquivos, ocultando o link separado
              delete shareData.url;
            }
          }
        } catch (fileErr) {
          console.warn("Falha ao preparar arquivo de imagem para Web Share:", fileErr);
        }
      }

      // Garante a presença da URL caso arquivos não sejam enviados
      if (!shareData.files && !shareData.url) {
        shareData.url = url;
      }

      await navigator.share(shareData);
      return true;
    } catch (error) {
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
