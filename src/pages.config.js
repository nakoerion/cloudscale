import Dashboard from './pages/Dashboard';
import CloudProviders from './pages/CloudProviders';
import DevOps from './pages/DevOps';
import Integrations from './pages/Integrations';
import SLAContracts from './pages/SLAContracts';


export const PAGES = {
    "Dashboard": Dashboard,
    "CloudProviders": CloudProviders,
    "DevOps": DevOps,
    "Integrations": Integrations,
    "SLAContracts": SLAContracts,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
};