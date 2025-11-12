import { FC, useState, useEffect } from 'react';
import { useAppDispatch } from "../../redux/hooks/useAppDispatch";
import { useAppSelector } from "../../redux/hooks/useAppSelector";
import { createManager } from "../../redux/slices/managerSlice";
import './CreateManager.css';

interface CreateManagerProps {
    onClose: () => void;
}

interface FormErrors {
    email?: string;
    firstName?: string;
    lastName?: string;
}

const CreateManager: FC<CreateManagerProps> = ({ onClose }) => {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector(state => state.managerPart);

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [errors, setErrors] = useState<FormErrors>({});
    const [created, setCreated] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const result = await dispatch(
            createManager({ email, firstName, lastName })
        );

        if (createManager.fulfilled.match(result)) {
            setCreated(true);
        }

        if (createManager.rejected.match(result)) {

            if (typeof result.payload === 'object' && result.payload !== null) {
                setErrors(result.payload as FormErrors);
            } else {
                // якщо просто рядок
                setErrors({ email: result.payload as string });
            }
        }
    };

    useEffect(() => {
        if (created) {
            onClose();
        }
    }, [created, onClose]);

    return (
        <div className="create-manager-modal">
            <div className="create-manager-content">
                <h2>Create New Manager</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => {
                                setEmail(e.target.value);
                                setErrors(prev => ({ ...prev, email: undefined }));
                            }}
                        />
                        {errors.email && <p className="error-message">{errors.email}</p>}
                    </div>

                    <div className="form-group">
                        <label>First Name:</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={e => {
                                setFirstName(e.target.value);
                                setErrors(prev => ({ ...prev, firstName: undefined }));
                            }}
                        />
                        {errors.firstName && <p className="error-message">{errors.firstName}</p>}
                    </div>

                    <div className="form-group">
                        <label>Last Name:</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={e => {
                                setLastName(e.target.value);
                                setErrors(prev => ({ ...prev, lastName: undefined }));
                            }}
                        />
                        {errors.lastName && <p className="error-message">{errors.lastName}</p>}
                    </div>

                    <div className="button-group">
                        <button type="submit" className="create-button" disabled={loading}>
                            {loading ? "Creating..." : "Create"}
                        </button>
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateManager;
