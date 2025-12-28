import Analytics from './pages/Analytics';
import ApplicationBuilder from './pages/ApplicationBuilder';
import Billing from './pages/Billing';
import CloudProviders from './pages/CloudProviders';
import Dashboard from './pages/Dashboard';
import DevOps from './pages/DevOps';
import Infrastructure from './pages/Infrastructure';
import Integrations from './pages/Integrations';
import Monitoring from './pages/Monitoring';
import ProjectDetails from './pages/ProjectDetails';
import RoleManagement from './pages/RoleManagement';
import SLAContracts from './pages/SLAContracts';
import VisualBuilder from './pages/VisualBuilder';
import WorkflowAutomation from './pages/WorkflowAutomation';
import Support from './pages/Support';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Analytics": Analytics,
    "ApplicationBuilder": ApplicationBuilder,
    "Billing": Billing,
    "CloudProviders": CloudProviders,
    "Dashboard": Dashboard,
    "DevOps": DevOps,
    "Infrastructure": Infrastructure,
    "Integrations": Integrations,
    "Monitoring": Monitoring,
    "ProjectDetails": ProjectDetails,
    "RoleManagement": RoleManagement,
    "SLAContracts": SLAContracts,
    "VisualBuilder": VisualBuilder,
    "WorkflowAutomation": WorkflowAutomation,
    "Support": Support,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};