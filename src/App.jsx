import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell.jsx';
import { AppStateProvider } from './context/AppState.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import PipelinePage from './pages/PipelinePage.jsx';

export default function App() {
  return (
    <AppStateProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:conversationId" element={<ChatPage />} />
          <Route path="/pipelines/retail-sales-enrichment" element={<PipelinePage />} />
          <Route path="/pipelines" element={<Navigate to="/pipelines/retail-sales-enrichment" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </AppStateProvider>
  );
}
