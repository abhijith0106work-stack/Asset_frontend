import React from 'react';
import { Route } from 'react-router-dom';
import ApprovalDashboard from './pages/Dashboard';
import MyFiles from './pages/MyFiles';
import PendingActions from './pages/PendingActions';
import FileDetail from './pages/FileDetail';
import SubmitFile from './pages/SubmitFile';
import Departments from './pages/admin/Departments';
import Workflows from './pages/admin/Workflows';
import Reports from './pages/admin/Reports';

const approvalRoutes = [
  <Route key="app-dash" path="/approval" element={<ApprovalDashboard />} />,
  <Route key="app-my" path="/approval/my-files" element={<MyFiles />} />,
  <Route key="app-pending" path="/approval/pending" element={<PendingActions />} />,
  <Route key="app-detail" path="/approval/files/:id" element={<FileDetail />} />,
  <Route key="app-submit" path="/approval/submit" element={<SubmitFile />} />,
  <Route key="app-depts" path="/approval/admin/departments" element={<Departments />} />,
  <Route key="app-flows" path="/approval/admin/workflows" element={<Workflows />} />,
  <Route key="app-reps" path="/approval/admin/reports" element={<Reports />} />,
];

export default approvalRoutes;
