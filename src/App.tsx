import Layout from "./components/Layout";
import Home from "./pages/Home";
import Board from "./pages/board/Board.tsx";
import Login from "./pages/user/Login.tsx";
import SignUp from "./pages/user/SignUp.tsx";
import PostDetail from "./pages/board/PostDetail.tsx";
import PostWrite from "./pages/board/PostWrite.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PostEdit from "./pages/board/PostEdit.tsx";
import MyPage from "./pages/user/MyPage";
import PolicyDetail from "./pages/policy/Terms.tsx";
import PerformanceMain from "./pages/performance/PerformanceMain.tsx";
import PerformanceMap from "./pages/performance/PerformanceMap.tsx";
import TicketListPage from "./pages/ticket/TicketListPage.tsx";
import TicketDetailPage from "./pages/ticket/TicketDetailPage.tsx";
import PerformanceDetail from "./pages/performance/PerformanceDetail.tsx";
import NewsPage from "./pages/news/NewsPage.tsx";
import NewsDetail from "./pages/news/NewsDetail.tsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="board" element={<Board />} />
                    <Route path="board/write" element={<PostWrite />} />
                    <Route path="board/edit/:id" element={<PostEdit />} />
                    <Route path="board/:id" element={<PostDetail />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<SignUp />} />
                    <Route path="mypage" element={<MyPage />} />
                    <Route path="terms" element={<PolicyDetail title="이용약관" />} />
                    <Route path="privacy" element={<PolicyDetail title="개인정보처리방침" />} />
                    <Route path="performance" element={<PerformanceMain />} />
                    <Route path="performance/:id" element={<PerformanceDetail />} />
                    <Route path="performance/map" element={<PerformanceMap />} />
                    <Route path="ticket-info" element={<TicketListPage />} />
                    <Route path="ticket-info/:id" element={<TicketDetailPage />} />
                    <Route path="news" element={<NewsPage />} />
                    <Route path="news/detail" element={<NewsDetail />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
