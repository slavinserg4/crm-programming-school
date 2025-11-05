import { useState, useEffect } from 'react';
import { useAppDispatch } from "../../redux/hooks/useAppDispatch";
import { useAppSelector } from "../../redux/hooks/useAppSelector";

import Manager from "../Manager/Manager";
import Pagination from "../Pagination/Pagination";
import CreateManager from "../CreateManager/CreateManager";
import './AdminPanel.css';
import { applicationSliceActions } from "../../redux/slices/applicationSlice";
import { managerSliceActions } from "../../redux/slices/managerSlice";

const AdminPanel = () => {
    const dispatch = useAppDispatch();
    const application = useAppSelector((state) => state.applicationPart);
    const { managers, pagination } = useAppSelector((state) => state.managerPart);
    const [currentPage, setCurrentPage] = useState(1);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        dispatch(applicationSliceActions.fetchStatistics());
        dispatch(managerSliceActions.fetchManagers({page: currentPage, pageSize: 10}));
    }, [dispatch, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="admin-container">
            <div className="statistics-section">
                <div className="statistics-section">
                    <h2>Applications Statistics</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>New</h3>
                            <span>{application.statistics?.new || 0}</span>
                        </div>
                        <div className="stat-card">
                            <h3>In Progress</h3>
                            <span>{application.statistics?.inWork || 0}</span>
                        </div>
                        <div className="stat-card">
                            <h3>Approved</h3>
                            <span>{application.statistics?.agree || 0}</span>
                        </div>
                        <div className="stat-card">
                            <h3>Duplicates</h3>
                            <span>{application.statistics?.dubbing || 0}</span>
                        </div>
                        <div className="stat-card">
                            <h3>Rejected</h3>
                            <span>{application.statistics?.disagree || 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="managers-section">
                <div className="managers-header">
                    <h2>Managers ({managers.length})</h2>
                    <button
                        className="create-manager-button"
                        onClick={() => setShowCreateModal(true)}
                    >
                        Create Manager
                    </button>
                </div>
                <div className="managers-grid">
                    {managers.map((manager) => (
                        <Manager key={manager._id} manager={manager}/>
                    ))}
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {showCreateModal && (
                <CreateManager onClose={() => setShowCreateModal(false)} />
            )}
        </div>
    );
};

export default AdminPanel;

