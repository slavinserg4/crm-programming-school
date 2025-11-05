import { IUser } from "../../models/IUser";
import { FC } from "react";
import { useAppDispatch } from "../../redux/hooks/useAppDispatch";
import { managerSliceActions } from "../../redux/slices/managerSlice";
import './Manager.css';

interface ManagerProps {
    manager: IUser;
}

const Manager: FC<ManagerProps> = ({ manager }) => {
    const dispatch = useAppDispatch();

    const handleActivate = () => {
        dispatch(managerSliceActions.activateManager(manager._id));
    };

    const handleBanUnban = () => {
        if (manager.isBanned) {
            dispatch(managerSliceActions.unbanManager(manager._id));
            dispatch(managerSliceActions.fetchManagers({page:1, pageSize:2}));

        } else {
            dispatch(managerSliceActions.banManager(manager._id));
            dispatch(managerSliceActions.fetchManagers({page:1, pageSize:2}));

        }
    };

    return (
        <div className="manager-card">
            <div className="manager-header">
                <h3>{manager.firstName} {manager.lastName}</h3>
                <div className="status-indicators">
                    {manager.isActive && <span className="status-active">Active</span>}
                    {manager.isBanned && <span className="status-banned">Banned</span>}
                </div>
            </div>
            <div className="manager-info">
                <p><strong>Email:</strong> {manager.email}</p>
            </div>
            <div className="manager-actions">
                {!manager.isActive && (
                    <button
                        className="action-button activate"
                        onClick={handleActivate}
                    >
                        Activate
                    </button>
                )}
                <button
                    className={`action-button ${manager.isBanned ? 'unban' : 'ban'}`}
                    onClick={handleBanUnban}
                >
                    {manager.isBanned ? 'Unban' : 'Ban'}
                </button>
            </div>
        </div>
    );
};

export default Manager;