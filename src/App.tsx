import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "@/pages/Home";
import AdminLogin from "@/pages/admin/Login";
import AdminLayout from "@/pages/admin/Layout";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProjects from "@/pages/admin/Projects";
import AdminSkills from "@/pages/admin/Skills";
import AdminSocials from "@/pages/admin/Socials";
import AdminMessages from "@/pages/admin/Messages";
import AdminSettings from "@/pages/admin/Settings";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="socials" element={<AdminSocials />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
