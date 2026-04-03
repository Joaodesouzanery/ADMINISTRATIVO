import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProductLayout } from './layouts/ProductLayout'
import { Home } from './pages/Home'

import { ProjectsTasksPage as CDProjects } from './pages/construdata/ProjectsTasksPage'
import { DocumentsPage as CDDocuments } from './pages/construdata/DocumentsPage'
import { CRMPage as CDCRM } from './pages/construdata/CRMPage'
import { FinancialPage as CDFinancial } from './pages/construdata/FinancialPage'
import { AnalyticsPage as CDAnalytics } from './pages/construdata/AnalyticsPage'

import { ProjectsTasksPage as IRProjects } from './pages/iris/ProjectsTasksPage'
import { DocumentsPage as IRDocuments } from './pages/iris/DocumentsPage'
import { CRMPage as IRCRM } from './pages/iris/CRMPage'
import { FinancialPage as IRFinancial } from './pages/iris/FinancialPage'
import { AnalyticsPage as IRAnalytics } from './pages/iris/AnalyticsPage'
import { OrgChartPage as CDOrgChart } from './pages/construdata/OrgChartPage'
import { OrgChartPage as IROrgChart } from './pages/iris/OrgChartPage'

import { AgendaDinamicaPage as PDAgenda } from './pages/padrao/AgendaDinamicaPage'
import { RegrasAlertasPage as PDRegras } from './pages/padrao/RegrasAlertasPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/construdata" element={<ProductLayout product="construdata" />}>
          <Route index element={<Navigate to="projetos" replace />} />
          <Route path="projetos"   element={<CDProjects />} />
          <Route path="documentos" element={<CDDocuments />} />
          <Route path="crm"        element={<CDCRM />} />
          <Route path="financeiro" element={<CDFinancial />} />
          <Route path="relatorios" element={<CDAnalytics />} />
          <Route path="organograma" element={<CDOrgChart />} />
        </Route>

        <Route path="/iris" element={<ProductLayout product="iris" />}>
          <Route index element={<Navigate to="projetos" replace />} />
          <Route path="projetos"   element={<IRProjects />} />
          <Route path="documentos" element={<IRDocuments />} />
          <Route path="crm"        element={<IRCRM />} />
          <Route path="financeiro" element={<IRFinancial />} />
          <Route path="relatorios" element={<IRAnalytics />} />
          <Route path="organograma" element={<IROrgChart />} />
        </Route>

        <Route path="/padrao" element={<ProductLayout product="padrao" />}>
          <Route index element={<Navigate to="agenda" replace />} />
          <Route path="agenda" element={<PDAgenda />} />
          <Route path="regras" element={<PDRegras />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
