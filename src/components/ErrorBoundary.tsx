import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("[ErrorBoundary]", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: "40px", textAlign: "center", fontFamily: "sans-serif" }}>
                    <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
                        오류가 발생했습니다
                    </h1>
                    <p style={{ color: "#666", marginBottom: "16px" }}>
                        페이지를 불러오는 중 문제가 발생했습니다.
                    </p>
                    <pre style={{
                        background: "#f5f5f5",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "left",
                        overflow: "auto",
                        fontSize: "13px",
                        maxWidth: "600px",
                        margin: "0 auto 16px",
                    }}>
                        {this.state.error?.message}
                        {"\n"}
                        {this.state.error?.stack}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: "8px 24px",
                            background: "#000",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "14px",
                        }}
                    >
                        새로고침
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
