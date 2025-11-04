import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div>
            menu
            <hr/>
            <Outlet/>
        </div>
    );
};

export default MainLayout;