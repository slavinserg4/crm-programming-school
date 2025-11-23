import { useAppSelector } from "../../redux/hooks/useAppSelector";
import { useAppDispatch } from "../../redux/hooks/useAppDispatch";
import { Link, useNavigate } from "react-router-dom";
import { loginSliceActions } from "../../redux/slices/loginSlice";
import "./Menu.css";
import {useEffect} from "react";

const Menu = () => {
    const { user } = useAppSelector((state) => state.loginPart);
    useEffect(() => {
         dispatch(loginSliceActions.me())
    }, []);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleExit = () => {
        localStorage.clear();
        dispatch(loginSliceActions.setLoginToFalse());
        navigate('/');
    }

    return (
        <nav className="menu">
            <div className="menu-brand">
                <h2><Link to={"/orders"}>Programming School</Link></h2>
            </div>
            <div className="menu-user">
                {user && (
                    <>
                        <h2 className="user-name">{user.firstName}</h2>
                        {user.role === "admin" && (
                            <button className="menu-button admin-button" onClick={() => navigate("/adminPanel")}>
                                Admin Panel
                            </button>
                        )}
                        <button className="menu-button exit-button" onClick={handleExit}>
                            Exit
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Menu;