import { FC, useState } from 'react';
import { useAppDispatch } from '../../redux/hooks/useAppDispatch';
import { managerSliceActions } from '../../redux/slices/managerSlice';
import './CreateManager.css';

interface CreateManagerProps {
    onClose: () => void;
}

const CreateManager: FC<CreateManagerProps> = ({ onClose }) => {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await dispatch(managerSliceActions.createManager(formData));
        onClose();
    };

    return (
        <div className="create-manager-modal">
            <div className="create-manager-content">
                <h2>Create New Manager</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>First Name:</label>
                        <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name:</label>
                        <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="button-group">
                        <button type="submit" className="create-button">Create</button>
                        <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateManager;