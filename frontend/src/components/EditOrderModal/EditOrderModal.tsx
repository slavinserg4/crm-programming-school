import { FC, useState } from "react";
import { IApplication } from "../../models/IApplicationsModel";
import { COURSE, Course } from "../../enums/CourseEnum";
import { COURSE_FORMAT, CourseFormat } from "../../enums/CourseFormatStatus";
import { COURSE_TYPE, CourseType } from "../../enums/CourseTypeEnum";
import { APPLICATION_STATUS, ApplicationStatus } from "../../enums/ApplicationStatusEnum";
import { applicationUpdateSchema } from "../../validators/EditOrderValidator";
import "./EditOrderModal.css";

interface EditOrderModalProps {
    order: IApplication;
    onClose: () => void;
    onSave: (data: Partial<IApplication>) => void;
}

const EditOrderModal: FC<EditOrderModalProps> = ({ order, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: order.name,
        surname: order.surname,
        email: order.email,
        phone: order.phone,
        age: order.age,
        course: order.course,
        course_type: order.course_type,
        course_format: order.course_format,
        status: order.status,
        group: order.group || "",
        already_paid: order.already_paid || 0,
        sum: order.sum || 0,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: keyof typeof formData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const { error } = applicationUpdateSchema.validate(formData, { abortEarly: false });

        if (error) {
            const fieldErrors: Record<string, string> = {};
            error.details.forEach((detail) => {
                const field = detail.path[0] as string;
                fieldErrors[field] = detail.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        onSave(formData);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Application</h2>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label>First Name:</label>
                        <input
                            autoFocus
                            className={errors.name ? "error-input" : ""}
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                        />
                        {errors.name && <p className="error">{errors.name}</p>}
                    </div>

                    <div className="form-group">
                        <label>Last Name:</label>
                        <input
                            className={errors.surname ? "error-input" : ""}
                            type="text"
                            value={formData.surname}
                            onChange={(e) => handleChange("surname", e.target.value)}
                        />
                        {errors.surname && <p className="error">{errors.surname}</p>}
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            className={errors.email ? "error-input" : ""}
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                        />
                        {errors.email && <p className="error">{errors.email}</p>}
                    </div>

                    <div className="form-group">
                        <label>Phone:</label>
                        <input
                            className={errors.phone ? "error-input" : ""}
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                        />
                        {errors.phone && <p className="error">{errors.phone}</p>}
                    </div>

                    <div className="form-group">
                        <label>Age:</label>
                        <input
                            className={errors.age ? "error-input" : ""}
                            type="number"
                            min={1}
                            value={formData.age}
                            onChange={(e) => handleChange("age", e.target.value ? Number(e.target.value) : "")}
                        />
                        {errors.age && <p className="error">{errors.age}</p>}
                    </div>

                    <div className="form-group">
                        <label>Course:</label>
                        <select
                            value={formData.course}
                            onChange={(e) => handleChange("course", e.target.value as Course)}
                            className={errors.course ? "error-input" : ""}
                        >
                            <option value="">Select a course</option>
                            {Object.values(COURSE).map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        {errors.course && <p className="error">{errors.course}</p>}
                    </div>

                    <div className="form-group">
                        <label>Course Type:</label>
                        <select
                            value={formData.course_type}
                            onChange={(e) => handleChange("course_type", e.target.value as CourseType)}
                            className={errors.course_type ? "error-input" : ""}
                        >
                            <option value="">Select course type</option>
                            {Object.values(COURSE_TYPE).map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        {errors.course_type && <p className="error">{errors.course_type}</p>}
                    </div>

                    <div className="form-group">
                        <label>Format:</label>
                        <select
                            value={formData.course_format}
                            onChange={(e) => handleChange("course_format", e.target.value as CourseFormat)}
                            className={errors.course_format ? "error-input" : ""}
                        >
                            <option value="">Select format</option>
                            {Object.values(COURSE_FORMAT).map((f) => (
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </select>
                        {errors.course_format && <p className="error">{errors.course_format}</p>}
                    </div>

                    <div className="form-group">
                        <label>Status:</label>
                        <select
                            value={formData.status}
                            onChange={(e) => handleChange("status", e.target.value as ApplicationStatus)}
                            className={errors.status ? "error-input" : ""}
                        >
                            <option value="">Select status</option>
                            {Object.values(APPLICATION_STATUS).map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                        {errors.status && <p className="error">{errors.status}</p>}
                    </div>

                    <div className="form-group">
                        <label>Group:</label>
                        <input
                            type="text"
                            value={formData.group}
                            onChange={(e) => handleChange("group", e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Already Paid:</label>
                        <input
                            className={errors.already_paid ? "error-input" : ""}
                            type="number"
                            min={0}
                            value={formData.already_paid}
                            onChange={(e) =>
                                handleChange("already_paid", e.target.value ? Number(e.target.value) : 0)
                            }
                        />
                        {errors.already_paid && <p className="error">{errors.already_paid}</p>}
                    </div>

                    <div className="form-group">
                        <label>Total Price:</label>
                        <input
                            className={errors.sum ? "error-input" : ""}
                            type="number"
                            min={0}
                            value={formData.sum}
                            onChange={(e) => handleChange("sum", e.target.value ? Number(e.target.value) : 0)}
                        />
                        {errors.sum && <p className="error">{errors.sum}</p>}
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="btn-save">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditOrderModal;
