import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout/MainLayout";
import LoginPage from "../pages/LoginPage/LoginPage";
import ActivatePage from "../pages/ActivatePage/ActivatePage";
import RecoveryPage from "../pages/RecoveryPage/RecoveryPage";
import OrdersPage from "../pages/OrdersPage/OrdersPage";
import AdminPanelPage from "../pages/AdminPanelPage/AdminPanelPage";

export const router = createBrowserRouter([
    {
        path: "/",element:<MainLayout/>, children:[
            {
                index:true, element:<LoginPage/>
            },
            {
                path:"orders", element:<OrdersPage/>
            },
            {
                path:"activate/:activateToken", element:<ActivatePage/>
            },
            {
                path:"recovery/:recoveryToken", element:<RecoveryPage/>
            },
            {
                path:"adminPanel", element:<AdminPanelPage/>
            }
        ]
    }
]);