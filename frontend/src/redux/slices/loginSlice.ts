import { IUser } from "../../models/IUser";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ILogin } from "../../models/IAuthModel";
import apiService from "../../services/api.services";
import { ITokenPair } from "../../models/ITokenPair";

type LoginSliceType = {
    user: IUser | null,
    tokens: ITokenPair | null,
    login: boolean,
    error: string | null
}

const loginInitState: LoginSliceType = {
    error: null,
    user: null,
    tokens: null,
    login: false,
}

export const userLogin = createAsyncThunk(
    'loginSlice/userLogin',
    async ({email, password}: ILogin, thunkAPI) => {
        try {
            return  await apiService.auth.signIn({email, password});
        } catch (e: any) {
            if (e.response?.status === 401) {
                return thunkAPI.rejectWithValue("Invalid email or password");
            }
            return thunkAPI.rejectWithValue(e.response?.data?.message || "Login failed. Error");
        }
    }
);
export const me = createAsyncThunk(
    'loginSlice/me',
    async (_, thunkAPI) => {
        try {
            return await apiService.auth.me();
        } catch (e: any) {
            if (e.response?.status === 401) {
                return thunkAPI.rejectWithValue("Login again please");
            }
            return thunkAPI.rejectWithValue(e.response?.data?.message || "Login failed. Error");
        }
    }
);

export const loginSlice = createSlice({
    name: 'loginSlice',
    initialState: loginInitState,
    reducers: {
        setLoginToFalse: (state) => {
            state.login = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: builder =>
        builder
            .addCase(userLogin.fulfilled, (state, action) => {
                state.user = action.payload;
                state.login = true;
                state.error = null;
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.error = action.payload as string;
                state.login = false;
            })
            .addCase(me.fulfilled, (state, action) => {
                state.user = action.payload;
                state.login = true;
                state.error = null;
            })
            .addCase(me.rejected, (state, action) => {
                state.error = action.payload as string;
                state.login = false;
            })

});

export const loginSliceActions = {...loginSlice.actions, userLogin, me}