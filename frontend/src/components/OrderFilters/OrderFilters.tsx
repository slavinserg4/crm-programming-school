import { FC } from "react";
import { IApplicationQuery } from "../../models/IApplicationsModel";
import { APPLICATION_STATUS } from "../../enums/ApplicationStatusEnum";
import { COURSE } from "../../enums/CourseEnum";
import { COURSE_FORMAT } from "../../enums/CourseFormatStatus";
import { COURSE_TYPE } from "../../enums/CourseTypeEnum";
import "./OrderFilters.css";

interface OrderFiltersProps {
    filters: IApplicationQuery;
    onFilterChange: (filters: Partial<IApplicationQuery>) => void;
    onReset: () => void;
    onExport: () => void;
    onlyMyOrders: boolean;
    setOnlyMyOrders: (value: boolean) => void;
}

const OrderFilters: FC<OrderFiltersProps> = ({
                                                 filters,
                                                 onFilterChange,
                                                 onReset,
                                                 onExport,
                                                 onlyMyOrders,
                                                 setOnlyMyOrders,
                                             }) => {
    const handleChange = (field: keyof IApplicationQuery, value: string) => {
        onFilterChange({ [field]: value });
    };

    return (
        <div className="filters-section">
            <div className="filter-group">
                <input
                    type="text"
                    className="filter-input"
                    placeholder="Name"
                    value={filters.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                />
                <input
                    type="text"
                    className="filter-input"
                    placeholder="Surname"
                    value={filters.surname || ""}
                    onChange={(e) => handleChange("surname", e.target.value)}
                />
                <input
                    type="text"
                    className="filter-input"
                    placeholder="Email"
                    value={filters.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                />
                <input
                    type="text"
                    className="filter-input"
                    placeholder="Phone"
                    value={filters.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                />
                <input
                    type="text"
                    className="filter-input"
                    placeholder="Age"
                    value={filters.age || ""}
                    onChange={(e) => handleChange("age", e.target.value)}
                />
                <input
                    type="text"
                    className="filter-input"
                    placeholder="Group"
                    value={filters.group || ""}
                    onChange={(e) => handleChange("group", e.target.value)}
                />
            </div>

            <div className="filter-group">
                <select
                    className="filter-input"
                    value={filters.course || ""}
                    onChange={(e) => handleChange("course", e.target.value)}
                >
                    <option value="">All courses</option>
                    {Object.values(COURSE).map((course) => (
                        <option key={course} value={course}>
                            {course}
                        </option>
                    ))}
                </select>

                <select
                    className="filter-input"
                    value={filters.status || ""}
                    onChange={(e) => handleChange("status", e.target.value)}
                >
                    <option value="">All statuses</option>
                    {Object.values(APPLICATION_STATUS).map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>

                <select
                    className="filter-input"
                    value={filters.course_format || ""}
                    onChange={(e) => handleChange("course_format", e.target.value)}
                >
                    <option value="">All formats</option>
                    {Object.values(COURSE_FORMAT).map((format) => (
                        <option key={format} value={format}>
                            {format}
                        </option>
                    ))}
                </select>

                <select
                    className="filter-input"
                    value={filters.course_type || ""}
                    onChange={(e) => handleChange("course_type", e.target.value)}
                >
                    <option value="">All types</option>
                    {Object.values(COURSE_TYPE).map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            <div className="filters-actions">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={onlyMyOrders}
                        onChange={(e) => setOnlyMyOrders(e.target.checked)}
                    />
                    My applications
                </label>

                <button onClick={onReset} className="reset-button">
                    Reset filters
                </button>

                <button onClick={onExport} className="export-button">
                    Export to Excel
                </button>
            </div>
        </div>
    );
};

export default OrderFilters;
