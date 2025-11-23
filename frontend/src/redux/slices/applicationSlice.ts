import { IApplication, IApplicationQuery } from "../../models/IApplicationsModel";
import { IStatsOfStatus } from "../../models/IManagerStats";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiService from "../../services/api.services";
import { IPaginatedResponse } from "../../models/IPaginatedResponse";

interface ApplicationState {
    applications: IApplication[];
    currentApplication: IApplication | null;
    statistics: IStatsOfStatus | null;
    loading: boolean;
    error: string | null;
    pagination: {
        totalItems: number;
        totalPages: number;
        prevPage: boolean;
        nextPage: boolean;
    };
    allApplications: IApplication[];
}

const initialState: ApplicationState = {
    applications: [],
    currentApplication: null,
    statistics: null,
    loading: false,
    error: null,
    pagination: {
        totalItems: 0,
        totalPages: 0,
        prevPage: false,
        nextPage: false,
    },
    allApplications:[]
};

export const fetchMyApplications = createAsyncThunk(
    'applications/fetchMyApplications',
    async (params:IApplicationQuery, { rejectWithValue }) => {
        try {
            return await apiService.applications.getMyApplications(params);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Помилка завантаження заявок");
        }
    }
);


export const fetchApplications = createAsyncThunk(
    'applications/fetchAll',
    async (params: IApplicationQuery, { rejectWithValue }) => {
        try {
            return await apiService.applications.getAll(params);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Помилка завантаження заявок");
        }
    }
);
export const fetchApplicationsWithoutPagination = createAsyncThunk(
    'applications/fetchAllWithoutPagination',
    async (_, { rejectWithValue }) => {
        try {
            return await apiService.applications.getAllWithoutPagination();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Помилка завантаження заявок");
        }
    }
);

export const fetchApplicationById = createAsyncThunk(
    'applications/fetchOne',
    async (id: string, { rejectWithValue }) => {
        try {
            return await apiService.applications.getById(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Помилка завантаження заявки");
        }
    }
);

export const updateApplication = createAsyncThunk(
    'applications/update',
    async ({ id, data }: { id: string; data: Partial<IApplication> }, { rejectWithValue }) => {
        try {
            return await apiService.applications.update(id, data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Помилка оновлення заявки");
        }
    }
);

export const addComment = createAsyncThunk(
    'applications/addComment',
    async ({ id, comment }: { id: string; comment: string }, { rejectWithValue }) => {
        try {
            return await apiService.applications.addComment(id, comment);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Помилка додавання коментаря");
        }
    }
);

export const fetchStatistics = createAsyncThunk(
    'applications/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            return await apiService.applications.getStats();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Помилка завантаження статистики");
        }
    }
);

export const applicationSlice = createSlice({
    name: 'applications',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentApplication: (state) => {
            state.currentApplication = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyApplications.fulfilled, (state, action: PayloadAction<IPaginatedResponse<IApplication>>) => {
                state.loading = false;
                state.applications = action.payload.data;
                state.pagination = {
                    totalItems: action.payload.totalItems,
                    totalPages: action.payload.totalPages,
                    prevPage: action.payload.prevPage,
                    nextPage: action.payload.nextPage,
                };
            })
            .addCase(fetchMyApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchApplicationsWithoutPagination.fulfilled, (state, action: PayloadAction<IApplication[]>) => {
                state.loading = false;
                state.allApplications = action.payload;
            })
            .addCase(fetchApplicationsWithoutPagination.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApplications.fulfilled, (state, action: PayloadAction<IPaginatedResponse<IApplication>>) => {
                state.loading = false;
                state.applications = action.payload.data;
                state.pagination = {
                    totalItems: action.payload.totalItems,
                    totalPages: action.payload.totalPages,
                    prevPage: action.payload.prevPage,
                    nextPage: action.payload.nextPage,
                };
            })
            .addCase(fetchApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchApplicationById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchApplicationById.fulfilled, (state, action: PayloadAction<IApplication>) => {
                state.loading = false;
                state.currentApplication = action.payload;
            })
            .addCase(fetchApplicationById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateApplication.fulfilled, (state, action: PayloadAction<IApplication>) => {
                state.loading = false;
                state.currentApplication = action.payload;
                state.applications = state.applications.map(app =>
                    app._id === action.payload._id ? action.payload : app
                );
            })
            .addCase(updateApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addComment.fulfilled, (state, action: PayloadAction<IApplication>) => {
                state.loading = false;
                state.currentApplication = action.payload;
                state.applications = state.applications.map(app =>
                    app._id === action.payload._id ? action.payload : app
                );
            })
            .addCase(addComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchStatistics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStatistics.fulfilled, (state, action: PayloadAction<IStatsOfStatus>) => {
                state.loading = false;
                state.statistics = action.payload;
            })
            .addCase(fetchStatistics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const applicationSliceActions = {...applicationSlice, fetchMyApplications, fetchApplications, fetchApplicationById, updateApplication, addComment, fetchStatistics, fetchApplicationsWithoutPagination};