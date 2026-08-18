// Labels de exibição pros enums de projeto — extraído pra não divergir entre
// revisao-step, pagamentos, briefing e admin (já aconteceu duplicação 3x
// quando plataformaEnum ganhou Tray/Bagy/Outra).
export const labelPlataforma = {
  shopify: "Shopify",
  nuvemshop: "Nuvemshop",
  tray: "Tray",
  bagy: "Bagy",
  outra: "Outra",
} as const;

export const labelTema = { spark: "Spark", quant: "Quant" } as const;

export const labelMercado = { brasil: "Brasil", global: "Global", latam: "Latam" } as const;
