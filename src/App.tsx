import { Routes, Route } from "react-router-dom"
import { Layout } from "./components/Layout.tsx";
import { SyllabusContent } from "./courses/SyllabusContent.tsx";
import { Login } from "./auth/Login.tsx";
import { CoursePage } from "./courses/CoursePage.tsx";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout><SyllabusContent /></Layout>} />
            <Route path="/course/:code" element={<Layout><CoursePage /></Layout>} />
        </Routes>
    )
}

export default App