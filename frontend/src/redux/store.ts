import { configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "./slices/loginSlice";
import { applicationSlice } from "./slices/applicationSlice";
import { managerSlice } from "./slices/managerSlice";

export const store = configureStore({
    reducer: {
        loginPart:loginSlice.reducer,
        applicationPart: applicationSlice.reducer,
        managerPart: managerSlice.reducer
    }
});