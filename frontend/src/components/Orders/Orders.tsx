import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FC, useState, useRef, Fragment, useEffect } from "react";
import "./Orders.css";
import { useAppDispatch } from "../../redux/hooks/useAppDispatch";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/useAppSelector";
import { IApplication, IApplicationQuery } from "../../models/IApplicationsModel";
import { applicationSliceActions } from "../../redux/slices/applicationSlice";
import Pagination from "../Pagination/Pagination";
import OrderFilters from "../OrderFilters/OrderFilters";
import EditOrderModal from "../EditOrderModal/EditOrderModal";
import { loginSliceActions } from "../../redux/slices/loginSlice";
import {Course} from "../../enums/CourseEnum";
import {CourseFormat} from "../../enums/CourseFormatStatus";
import {CourseType} from "../../enums/CourseTypeEnum";
import {ApplicationStatus} from "../../enums/ApplicationStatusEnum";

const Orders: FC = () => {
    const dispatch = useAppDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { applications, loading, pagination, allApplications } = useAppSelector((state) => state.applicationPart);
    const { user } = useAppSelector((state) => state.loginPart);

    const [onlyMyOrders, setOnlyMyOrders] = useState(false);
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [comment, setComment] = useState("");
    const [editingOrder, setEditingOrder] = useState<IApplication | null>(null);

    const [filters, setFilters] = useState<IApplicationQuery>({
        page: Number(searchParams.get("page")) || 1,
        pageSize: Number(searchParams.get("pageSize")) || 25,

        sort: (searchParams.get("sort") as keyof IApplication) || null,
        order: (searchParams.get("order") as "asc" | "desc") || "asc",

        name: searchParams.get("name") || null,
        surname: searchParams.get("surname") || null,
        email: searchParams.get("email") || null,
        phone: searchParams.get("phone") || null,

        age: searchParams.get("age") ? Number(searchParams.get("age")) : null,

        course: (searchParams.get("course") as Course | null) || null,
        course_format: (searchParams.get("course_format") as CourseFormat | null) || null,
        course_type: (searchParams.get("course_type") as CourseType | null) || null,
        status: (searchParams.get("status") as ApplicationStatus | null) || null,

        group: searchParams.get("group") || null,
        manager: searchParams.get("manager") || null
    });

    const fetchTimeout = useRef<NodeJS.Timeout | null>(null);

    const triggerFetch = (newFilters: IApplicationQuery, onlyMy?: boolean) => {
        const myFlag = onlyMy ?? onlyMyOrders;

        if (fetchTimeout.current) clearTimeout(fetchTimeout.current);

        fetchTimeout.current = setTimeout(() => {
            if (myFlag) {
                dispatch(applicationSliceActions.fetchMyApplications(newFilters));
            } else {
                dispatch(applicationSliceActions.fetchApplications(newFilters));
            }

            const params = new URLSearchParams();
            Object.entries(newFilters).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    params.set(key, value.toString());
                }
            });

            setSearchParams(params);
        }, 500);
    };

    useEffect(() => {
        triggerFetch(filters);
        dispatch(loginSliceActions.me());
        dispatch(applicationSliceActions.fetchApplicationsWithoutPagination())
    }, []);

    const handleFilterChange = (newFilters: Partial<IApplicationQuery>) => {
        setFilters((prev) => {
            const updated = { ...prev, ...newFilters, page: 1 };
            triggerFetch(updated);
            return updated;
        });
    };

    const handleSort = (field: keyof IApplication) => {
        setFilters((prev) => {
            const updated = {
                ...prev,
                page: 1,
                sort: field,
                order: (prev.sort === field && prev.order === "asc" ? "desc" : "asc") as "asc" | "desc"
            };
            triggerFetch(updated);
            return updated;
        });
    };

    const handleExpandOrder = (orderId: string) => {
        setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
    };

    const handleAddComment = async (orderId: string) => {
        if (!comment.trim()) return;

        try {
            await dispatch(applicationSliceActions.addComment({ id: orderId, comment: comment.trim() }));
            setComment("");
            triggerFetch(filters);
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleReset = () => {
        const resetFilters = { page: 1, pageSize: 25, sort: null, order: null };
        setFilters(resetFilters as any);
        setOnlyMyOrders(false);
        triggerFetch(resetFilters as any);
    };

    const canManageOrder = (order: IApplication) =>
        !order.manager || order.manager._id === user?._id;

    const handleSaveOrder = async (data: Partial<IApplication>) => {
        if (!editingOrder) return;

        try {
            await dispatch(applicationSliceActions.updateApplication({ id: editingOrder._id, data }));
            triggerFetch(filters);
            setEditingOrder(null);
        } catch (error) {
            console.error("Error updating order:", error);
        }
    };
    const handleExport = () => {
        const exportData = allApplications.map((order) => ({
            ID: order._id,
            Name: order.name,
            Surname: order.surname,
            Email: order.email,
            Phone: order.phone,
            Age: order.age,
            Course: order.course,
            Format: order.course_format,
            Type: order.course_type,
            Status: order.status,
            Total: order.sum,
            Paid: order.already_paid,
            CreatedAt: new Date(order.created_at).toLocaleDateString(),
            Manager: order.manager?.firstName,
            Group: order.group,
            UTM: order.utm,
            Message: order.msg
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "orders.xlsx");
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="loadSvg">
                    <svg viewBox="0 0 240 240">
                        <circle className="pl1123__ring pl1123__ring--a" cx="120" cy="120" r="105" fill="none" stroke="#000" strokeWidth="20" strokeDasharray="0 660" strokeDashoffset="-330" strokeLinecap="round" />
                        <circle className="pl1123__ring pl1123__ring--b" cx="120" cy="120" r="35" fill="none" stroke="#000" strokeWidth="20" strokeDasharray="0 220" strokeDashoffset="-110" strokeLinecap="round" />
                        <circle className="pl1123__ring pl1123__ring--c" cx="85" cy="120" r="70" fill="none" stroke="#000" strokeWidth="20" strokeDasharray="0 440" strokeLinecap="round" />
                        <circle className="pl1123__ring pl1123__ring--d" cx="155" cy="120" r="70" fill="none" stroke="#000" strokeWidth="20" strokeDasharray="0 440" strokeLinecap="round" />
                    </svg>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-container">
            <OrderFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleReset}
                onExport={handleExport}
                onlyMyOrders={onlyMyOrders}
                setOnlyMyOrders={(val) => {
                    setOnlyMyOrders(val);
                    triggerFetch(filters, val);
                }}
            />

            <div className="orders-table">
                <table>
                    <thead>
                    <tr>
                        {[
                            "_id", "name", "surname", "email",
                            "phone", "age", "course", "course_format",
                            "course_type", "status", "sum", "already_paid",
                            "created_at", "manager", "group"
                        ].map((field) => (
                            <th key={field} onClick={() => handleSort(field as keyof IApplication)}>
                                {field} {filters.sort === field && (filters.order === "asc" ? "↑" : "↓")}
                            </th>
                        ))}
                    </tr>
                    </thead>

                    <tbody>
                    {applications.map((order) => (
                        <Fragment key={order._id}>
                            <tr onClick={() => handleExpandOrder(order._id)}>
                                <td>{order._id}</td>
                                <td>{order.name || "null"}</td>
                                <td>{order.surname || "null"}</td>
                                <td>{order.email || "null"}</td>
                                <td>{order.phone || "null"}</td>
                                <td>{order.age || "null"}</td>
                                <td>{order.course || "null"}</td>
                                <td>{order.course_format || "null"}</td>
                                <td>{order.course_type || "null"}</td>
                                <td>{order.status || "null"}</td>
                                <td>{order.sum || "null"}</td>
                                <td>{order.already_paid || "null"}</td>
                                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                <td>{order.manager?.firstName || "null"}</td>
                                <td>{order.group || "null"}</td>
                            </tr>

                            {expandedOrderId === order._id && (
                                <tr>
                                    <td colSpan={16}>
                                        <div className="order-details">
                                            <div className="order-info">
                                                <h4>Additional Information</h4>
                                                <p>UTM: {order.utm || "-"}</p>
                                                <p>Message: {order.msg || "-"}</p>
                                            </div>

                                            <div className="comments-section">
                                                <h4>Comments</h4>

                                                {order.comments?.map((c, idx) => {
                                                    if (typeof c === "string") return null;

                                                    return (
                                                        <div key={idx} className="comment">
                                                            <p className="comment-author">{c.author.firstName}</p>
                                                            <p className="comment-text">{c.text}</p>
                                                            <p className="comment-date">{new Date(c.createdAt).toLocaleString()}</p>
                                                        </div>
                                                    );
                                                })}

                                                {canManageOrder(order) && (
                                                    <div className="comment-form">
                                                            <textarea
                                                                value={comment}
                                                                onChange={(e) => setComment(e.target.value)}
                                                                placeholder="Add a comment..."
                                                            />

                                                        <div className="comment-buttons">
                                                            <button
                                                                onClick={() => handleAddComment(order._id)}
                                                                disabled={!comment.trim()}
                                                                className="add-comment-btn"
                                                            >
                                                                Add Comment
                                                            </button>

                                                            <button
                                                                onClick={() => setEditingOrder(order)}
                                                                className="edit-comment-btn"
                                                            >
                                                                Edit
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </Fragment>
                    ))}
                    </tbody>
                </table>
            </div>

            {pagination.totalPages > 1 && (
                <Pagination
                    currentPage={filters.page}
                    totalPages={pagination.totalPages}
                    onPageChange={(page) => {
                        const updated = { ...filters, page };
                        setFilters(updated);
                        triggerFetch(updated);
                    }}
                />
            )}

            {editingOrder && (
                <EditOrderModal
                    order={editingOrder}
                    onClose={() => setEditingOrder(null)}
                    onSave={handleSaveOrder}
                />
            )}
        </div>
    );
};

export default Orders;
