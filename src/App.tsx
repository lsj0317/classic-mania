import Layout from "./components/Layout";
import Home from "./pages/Home";
import Board from "./pages/Board";
import Login from "./pages/Login"; // 추가
import SignUp from "./pages/SignUp"; // 추가

import { HashRouter as Router, Routes, Route } from "react-router-dom"; // HashRouter로 변경

function App() {
    return (
        <Router> {/* HashRouter 적용 */}
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="board" element={<Board />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<SignUp />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;