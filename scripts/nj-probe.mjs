// Testa os coletores do Nery Journal contra as APIs reais. Rode de uma máquina com acesso à internet:
//   npm run nj:probe            (todos)
//   npm run nj:probe -- pncp    (um só)
// Não grava nada no banco: só imprime status, quantidade de itens e exemplos.
import { COLLECTORS } from '../api/_nj/sources.ts'

const only = process.argv[2]
const ids = Object.keys(COLLECTORS).filter((id) => !only || id === only)
let failed = 0

for (const id of ids) {
  const t0 = Date.now()
  const r = await COLLECTORS[id]()
  const ms = Date.now() - t0
  console.log(`\n[${r.ok ? 'OK ' : 'ERRO'}] ${id}  ${r.items.length} itens  ${ms} ms`)
  if (r.error) { console.log('  erro:', r.error); failed++ }
  for (const it of r.items.slice(0, 3)) console.log('  -', it.title, '\n    ', it.url ?? '(sem link)')
}

console.log(failed ? `\n${failed} coletor(es) com erro: ajuste URLs/códigos em api/_nj/sources.ts` : '\nTodos responderam.')
process.exit(failed ? 1 : 0)
