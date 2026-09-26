import { Navigate, Route, Routes } from "react-router-dom";
import { KioskFlow } from "./kiosk/KioskFlow";
import { AdminLayout } from "./admin/AdminLayout";
import { DashboardPage } from "./admin/DashboardPage";
import { CustomersPage } from "./admin/CustomersPage";
import { CustomerProfilePage } from "./admin/CustomerProfilePage";
import { ConsultationsPage } from "./admin/ConsultationsPage";
import { ConsultationDetailPage } from "./admin/ConsultationDetailPage";
import { ServicesPage } from "./admin/ServicesPage";
import { StylesPage } from "./admin/StylesPage";
import { StaffPage } from "./admin/StaffPage";
import { SettingsPage } from "./admin/SettingsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/kiosk" replace />} />
      <Route path="/kiosk" element={<KioskFlow />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="customers/:customerId" element={<CustomerProfilePage />} />
        <Route path="consultations" element={<ConsultationsPage />} />
        <Route path="consultations/:consultationId" element={<ConsultationDetailPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="styles" element={<StylesPage />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/kiosk" replace />} />
    </Routes>
  );
}

export default App;
