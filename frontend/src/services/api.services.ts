import axios from "axios";
import { ILogin } from "../models/IAuthModel";
import { IUser } from "../models/IUser";
import { ITokenPair } from "../models/ITokenPair";
import { IApplication, IApplicationQuery } from "../models/IApplicationsModel";
import { retriveLocalStorage } from "./helper";
import { IPaginatedResponse } from "../models/IPaginatedResponse";
import { IStatsOfStatus } from "../models/IManagerStats";
import { IManagerQuery } from "../models/IManagerModel";


const axiosInstance = axios.create({
    baseURL: "/api",
    headers: {'Content-Type': 'application/json'}
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url === '/auth/sign-in') {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    originalRequest.headers.Authorization = 'Bearer ' + retriveLocalStorage<ITokenPair>('tokens').accessToken;
                    return axiosInstance(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await apiService.auth.refresh();
                const newToken = retriveLocalStorage<ITokenPair>('tokens').accessToken;
                processQueue(null, newToken);
                originalRequest.headers.Authorization = 'Bearer ' + newToken;
                return axiosInstance(originalRequest);
            } catch (e) {
                processQueue(e, null);
                localStorage.removeItem('user');
                localStorage.removeItem('tokens');
                window.location.href = '/login';
                return Promise.reject(e);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);
axiosInstance.interceptors.request.use((request)=>{
    if(request.method?.toUpperCase() == "GET"){
        request.headers.Authorization = 'Bearer ' + retriveLocalStorage<ITokenPair>('tokens').accessToken;
    }
    return request;
})


export const apiService = {
    auth: {
        async signIn(data: ILogin): Promise<IUser> {
            const res = await axiosInstance.post<{user:IUser, tokens:ITokenPair}>("/auth/sign-in", data);
            localStorage.setItem('tokens', JSON.stringify(res.data.tokens));
            return res.data.user;
        },

        async refresh(): Promise<ITokenPair> {
            const refreshToken = retriveLocalStorage<ITokenPair>('tokens').accessToken;
            const res = await axiosInstance.post<ITokenPair>("/auth/refresh", { refreshToken });
            localStorage.setItem('tokens', JSON.stringify(res.data));
            return res.data;
        },

        async me(): Promise<IUser> {
            const res = await axiosInstance.get<IUser>("/auth/me");
            return res.data;
        },
    },

    applications: {
        async getAll(params?: IApplicationQuery): Promise<IPaginatedResponse<IApplication>> {
            const res = await axiosInstance.get<IPaginatedResponse<IApplication>>("/applications", { params });
            return res.data;
        },

        async getById(id: string): Promise<IApplication> {
            const res = await axiosInstance.get<IApplication>(`/applications/${id}`);
            return res.data;
        },

        async update(id: string, data: Partial<IApplication>): Promise<IApplication> {
            const token = retriveLocalStorage<ITokenPair>('tokens').accessToken;
            const res = await axiosInstance.patch<IApplication>(`/applications/update/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },

        async addComment(id: string, comment: string): Promise<IApplication> {
            const token = retriveLocalStorage<ITokenPair>('tokens').accessToken;
            const res = await axiosInstance.patch<IApplication>(`/applications/addcomm/${id}`, { text: comment },{
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },

        async getStats(): Promise<IStatsOfStatus> {
            const res = await axiosInstance.get<IStatsOfStatus>("/applications/stats");
            return res.data;
        },
        async getMyApplications(params?:IApplicationQuery): Promise<IPaginatedResponse<IApplication>> {
            const token = retriveLocalStorage<ITokenPair>('tokens').accessToken;
            const res = await axiosInstance.get<IPaginatedResponse<IApplication>>("/applications/my-applications", {
                params,
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }

    },


    managers: {
        async getAdmins(data:IManagerQuery): Promise<IPaginatedResponse<IUser>> {
            const res = await axiosInstance.get<IPaginatedResponse<IUser>>(`/manager/admins?pageSize=${data.pageSize}&page=${data.page}`);
            return res.data;
        },

        async createManager(data: {
            email: string;
            firstName: string;
            lastName: string;
        }): Promise<IUser> {
            const token = retriveLocalStorage<ITokenPair>('tokens').accessToken;
            const res = await axiosInstance.post<IUser>("/manager/create", data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },

        async activateRequest(id: string): Promise<{ message: string; url: string }> {
            const token = retriveLocalStorage<ITokenPair>('tokens').accessToken;
            const res = await axiosInstance.post(`/manager/activate-request/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },

        async ban(id: string) {
            const token = retriveLocalStorage<ITokenPair>('tokens').accessToken;
            const res = await axiosInstance.patch(`/manager/ban/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },

        async unban(id: string) {
            const token = retriveLocalStorage<ITokenPair>('tokens').accessToken;
            const res = await axiosInstance.patch(`/manager/unban/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },

        async passwordRecoveryRequest(id: string): Promise<{ message: string; url: string }> {
            const token = retriveLocalStorage<ITokenPair>('tokens').accessToken;
            const res = await axiosInstance.post(`/manager/recovery-request/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },

        async recovery(token: string, passwords: { firstPassword: string; secondPassword: string }) {
            const accessToken = retriveLocalStorage<ITokenPair>('tokens').accessToken;
            const res = await axiosInstance.post(`/manager/recovery/${token}`, passwords, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return res.data;
        },

        async activate(token: string, passwords: { firstPassword: string; secondPassword: string }) {
            const accessToken = retriveLocalStorage<ITokenPair>('tokens').accessToken;
            const res = await axiosInstance.patch(`/manager/activate/${token}`, passwords, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return res.data;
        },
    }
};

export default apiService;
