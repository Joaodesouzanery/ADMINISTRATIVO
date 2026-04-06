import { ComercialModule } from '../comercial/ComercialModule'

export function ComercialPage() {
  return (
    <ComercialModule
      product="padrao"
      combinedProducts={['construdata', 'iris', 'padrao']}
      subtitle="Visão combinada — contatos de ConstruData, IRIS e Padrão em um único pipeline. Novos contatos criados aqui ficam sob Padrão."
    />
  )
}
