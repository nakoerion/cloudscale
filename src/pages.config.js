import ApplicationBuilder from './pages/ApplicationBuilder';
import CloudProviders from './pages/CloudProviders';
import Dashboard from './pages/Dashboard';
import DevOps from './pages/DevOps';
import Infrastructure from './pages/Infrastructure';
import Integrations from './pages/Integrations';
import Monitoring from './pages/Monitoring';
import ProjectDetails from './pages/ProjectDetails';
import SLAContracts from './pages/SLAContracts';
import VisualBuilder from './pages/VisualBuilder';
import WorkflowAutomation from './pages/WorkflowAutomation';
import RoleManagement from './pages/RoleManagement';
import Billing from './pages/Billing';
import __Layout from './Layout.jsx';


export const PAGES = {
    "ApplicationBuilder": ApplicationBuilder,
    "CloudProviders": CloudProviders,
    "Dashboard": Dashboard,
    "DevOps": DevOps,
    "Infrastructure": Infrastructure,
    "Integrations": Integrations,
    "Monitoring": Monitoring,
    "ProjectDetails": ProjectDetails,
    "SLAContracts": SLAContracts,
    "VisualBuilder": VisualBuilder,
    "WorkflowAutomation": WorkflowAutomation,
    "RoleManagement": RoleManagement,
    "Billing": Billing,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};