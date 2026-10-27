import Link from 'next/link'
import Newsletter from './Newsletter'

export function Header() {
  return (
    <header className="header">
      <div className="wrap">
        <div className="top">
          <Link href="/" className="logo" aria-label="Nery Journal — Grupo Nery, Construção">
            <span className="mark">nery journal</span>
            <span className="group">Grupo Nery · Construção</span>
          </Link>
          <div className="util">
            <a href="/noticias#busca">Pesquisar</a>
            <a href="/newsletter">Notificações</a>
            <a href="/sobre#contato">Fale conosco</a>
          </div>
        </div>
        <nav className="nav" aria-label="Principal">
          <ul>
            <li><Link href="/">Análises</Link></li>
            <li><Link href="/noticias">Notícias</Link></li>
            <li><Link href="/noticias#indicadores">Indicadores</Link></li>
            <li><Link href="/noticias#licitacoes">Licitações</Link></li>
            <li><Link href="/politica-editorial">Política editorial</Link></li>
            <li><Link href="/sobre">Sobre</Link></li>
          </ul>
          <Newsletter variant="button" />
        </nav>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="cols">
          <div><h4>Notícias</h4><ul><li><Link href="/">Análises</Link></li><li><Link href="/noticias">Últimas notícias</Link></li><li><Link href="/noticias#indicadores">Indicadores</Link></li><li><Link href="/noticias#licitacoes">Licitações de obras</Link></li></ul></div>
          <div><h4>Dados</h4><ul><li>Banco Central</li><li>IBGE e SINAPI</li><li>PNCP</li><li>Diário Oficial da União</li></ul></div>
          <div><h4>Sobre</h4><ul><li><Link href="/sobre">Quem somos</Link></li><li><Link href="/politica-editorial">Política editorial</Link></li><li><Link href="/privacidade">Privacidade</Link></li></ul></div>
          <div><h4>Setores</h4><ul><li>Construção</li><li style={{ color: '#999' }}>Regulação (em breve)</li></ul></div>
        </div>
        <p className="legal">© Grupo Nery. Conteúdo produzido com apoio de IA e revisado por editor. Fontes e licenças identificadas em cada matéria.</p>
      </div>
    </footer>
  )
}
