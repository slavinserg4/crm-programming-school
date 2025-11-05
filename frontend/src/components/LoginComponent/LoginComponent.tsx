import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/useAppSelector";
import { useAppDispatch } from "../../redux/hooks/useAppDispatch";
import { loginSliceActions } from "../../redux/slices/loginSlice";
import "./LoginComponent.css";

const LoginComponent = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { login, error } = useAppSelector((state) => state.loginPart);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await dispatch(loginSliceActions.userLogin({ email, password }));
    };

    useEffect(() => {
        if (login) {
            navigate("/orders");
        }
        return () => {
            dispatch(loginSliceActions.clearError());
        };
    }, [login, navigate]);

    return (
        <div className="login-page">
            <div className="login-card">
                <h2 className="login-title">Welcome back 👋</h2>
                <p className="login-subtitle">Please sign in to continue</p>

                <form onSubmit={handleLogin} className="login-form">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                        <div className="login-error">{error}</div>
                    )}

                    <button type="submit" className="login-btn">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginComponent;
