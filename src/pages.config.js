import Dashboard from './pages/Dashboard';
import CloudProviders from './pages/CloudProviders';
import DevOps from './pages/DevOps';
import Integrations from './pages/Integrations';
import SLAContracts from './pages/SLAContracts';
import ProjectDetails from './pages/ProjectDetails';
import ApplicationBuilder from './pages/ApplicationBuilder';
import VisualBuilder from './pages/VisualBuilder';
import WorkflowAutomation from './pages/WorkflowAutomation';
import Infrastructure from './pages/Infrastructure';
import Monitoring from './pages/Monitoring';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "CloudProviders": CloudProviders,
    "DevOps": DevOps,
    "Integrations": Integrations,
    "SLAContracts": SLAContracts,
    "ProjectDetails": ProjectDetails,
    "ApplicationBuilder": ApplicationBuilder,
    "VisualBuilder": VisualBuilder,
    "WorkflowAutomation": WorkflowAutomation,
    "Infrastructure": Infrastructure,
    "Monitoring": Monitoring,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};