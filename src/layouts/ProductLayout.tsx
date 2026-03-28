import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/navigation/Sidebar'
import { Topbar } from '../components/navigation/Topbar'
import { useAppStore } from '../store/appStore'
import type { ProductKey } from '../config/products'

interface ProductLayoutProps {
  product: ProductKey
}

export function ProductLayout({ product }: ProductLayoutProps) {
  const setActiveProduct = useAppStore((s) => s.setActiveProduct)

  useEffect(() => {
    setActiveProduct(product)
  }, [product, setActiveProduct])

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar product={product} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar product={product} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
