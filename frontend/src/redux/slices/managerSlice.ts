import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../models/IUser";
import { IPaginatedResponse } from "../../models/IPaginatedResponse";
import { IManagerQuery } from "../../models/IManagerModel";
import apiService from "../../services/api.services";

interface ManagerState {
    managers: IUser[];
    loading: boolean;
    error: string | null;
    pagination: {
        totalItems: number;
        totalPages: number;
        prevPage: boolean;
        nextPage: boolean;
    };
}

const initialState: ManagerState = {
    managers: [],
    loading: false,
    error: null,
    pagination: {
        totalItems: 0,
        totalPages: 0,
        prevPage: false,
        nextPage: false,
    },
};

export const fetchManagers = createAsyncThunk(
    'managers/fetchAll',
    async (params: IManagerQuery, { rejectWithValue }) => {
        try {
            return await apiService.managers.getAdmins(params);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Помилка завантаження менеджерів");
        }
    }
);

export const createManager = createAsyncThunk(
    'managers/create',
    async (data: { email: string; firstName: string; lastName: string }, { rejectWithValue }) => {
        try {
            return await apiService.managers.createManager(data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Помилка створення менеджера");
        }
    }
);

export const activateManager = createAsyncThunk(
    'managers/activate',
    async (id: string, { rejectWithValue }) => {
        try {
            return await apiService.managers.activateRequest(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Помилка активації менеджера");
        }
    }
);

export const banManager = createAsyncThunk(
    'managers/ban',
    async (id: string, { rejectWithValue }) => {
        try {
            return await apiService.managers.ban(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Помилка блокування менеджера");
        }
    }
);

export const unbanManager = createAsyncThunk(
    'managers/unban',
    async (id: string, { rejectWithValue }) => {
        try {
            return await apiService.managers.unban(id);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Помилка розблокування менеджера");
        }
    }
);

export const managerSlice = createSlice({
    name: 'managers',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchManagers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchManagers.fulfilled, (state, action: PayloadAction<IPaginatedResponse<IUser>>) => {
                state.loading = false;
                state.managers = action.payload.data;
                state.pagination = {
                    totalItems: action.payload.totalItems,
                    totalPages: action.payload.totalPages,
                    prevPage: action.payload.prevPage,
                    nextPage: action.payload.nextPage,
                };
            })
            .addCase(fetchManagers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(createManager.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createManager.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.loading = false;
                state.managers = [...state.managers, action.payload];
            })
            .addCase(createManager.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(banManager.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(banManager.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.loading = false;
                state.managers = state.managers.map(manager =>
                    manager._id === action.payload._id ? action.payload : manager
                );
            })
            .addCase(banManager.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(unbanManager.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(unbanManager.fulfilled, (state, action: PayloadAction<IUser>) => {
                state.loading = false;
                state.managers = state.managers.map(manager =>
                    manager._id === action.payload._id ? action.payload : manager
                );
            })
            .addCase(unbanManager.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const managerSliceActions = {...managerSlice, fetchManagers, createManager, activateManager, banManager, unbanManager};