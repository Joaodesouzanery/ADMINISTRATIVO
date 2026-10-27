import Newsletter from '@/components/Newsletter'

export const metadata = { title: 'Newsletter' }

export default function NewsletterPage() {
  return (
    <div className="article">
      <h1>Newsletter</h1>
      <p className="lede">Notícias, indicadores e licitações de obras no seu e-mail.</p>
      <Newsletter variant="box" />
    </div>
  )
}
