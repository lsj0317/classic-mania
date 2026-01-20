// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react"; // 반드시 추가

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider> {/* 이 부분이 App을 감싸야 Navbar가 작동합니다 */}
            <App />
        </ThemeProvider>
    </React.StrictMode>
);