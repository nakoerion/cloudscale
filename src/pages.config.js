import Dashboard from './pages/Dashboard';
import CloudProviders from './pages/CloudProviders';
import DevOps from './pages/DevOps';
import Integrations from './pages/Integrations';
import SLAContracts from './pages/SLAContracts';
import ProjectDetails from './pages/ProjectDetails';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "CloudProviders": CloudProviders,
    "DevOps": DevOps,
    "Integrations": Integrations,
    "SLAContracts": SLAContracts,
    "ProjectDetails": ProjectDetails,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};