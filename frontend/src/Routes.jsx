import React from "react";
import { Routes as RouterRoutes, Route, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";

// Page imports
import LoginRegister from "./pages/login-register";
import DashboardOverview from "./pages/dashboard-overview";
import KanbanBoard from "./pages/kanban-board";
import SprintPlanning from "./pages/sprint-planning";
import TaskDetail from "./pages/task-detail";
import AnalyticsDashboard from "./pages/analytics-dashboard";
import TeamManagement from "./pages/team-management";
import ProjectManagement from "./pages/project-management";
import SprintManagement from "./pages/sprint-management";

const Routes = () => {
  return (
    <>
      <ScrollToTop />
      <RouterRoutes>
          <Route path="/login-register" element={<LoginRegister />} />
          <Route path="/" element={<LoginRegister />} />
          <Route element={<Layout />}>
            <Route path="/dashboard-overview" element={<DashboardOverview />} />
            <Route path="/kanban-board" element={<KanbanBoard />} />
            <Route path="/sprint-planning" element={<SprintPlanning />} />
            <Route path="/task-detail" element={<TaskDetail />} />
            <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
            <Route path="/team-management" element={<TeamManagement />} />
            <Route path="/project-management" element={<ProjectManagement />} />
            <Route path="/sprint-management" element={<SprintManagement />} />
          </Route>
        </RouterRoutes>
    </>
  );
};

export default Routes;
