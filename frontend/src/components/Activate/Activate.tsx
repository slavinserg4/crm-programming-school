import { useAppDispatch } from "../../redux/hooks/useAppDispatch";
import "./Activate.css"
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/useAppSelector";
import { useState } from "react";
import { activateWithPassword, managerSliceActions } from "../../redux/slices/managerSlice";
const Activate = () => {
    const { activateToken } = useParams<{ activateToken: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error } = useAppSelector(state => state.managerPart);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleActivate = async () => {
        if (!activateToken) return;
        if (password !== confirmPassword) {
            alert("Паролі не співпадають");
            return;
        }

        const result = await dispatch(managerSliceActions.activateWithPassword({ token: activateToken, password, confirmPassword }));
        if (activateWithPassword.fulfilled.match(result)) {
            navigate("/");
        }
    };

    return (
        <div className="activate-page">
            <h2>Активація акаунта</h2>
            {error && <p className="error">{error}</p>}
            <input
                type="password"
                placeholder="Новий пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Підтвердження паролю"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button onClick={handleActivate} disabled={loading}>
                {loading ? "Активуємо..." : "Активувати"}
            </button>
        </div>
    );
};

export default Activate;