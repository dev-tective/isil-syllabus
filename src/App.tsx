import { Routes, Route } from "react-router-dom"
import { Layout } from "./components/Layout.tsx";
import { SyllabusContent } from "./courses/SyllabusContent.tsx";
import { Login } from "./auth/Login.tsx";
import { CoursePage } from "./courses/CoursePage.tsx";
import { PrivacyPolicy } from "./auth/PrivacyPolicy.tsx";
import { TermsOfService } from "./auth/TermsOfService.tsx";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout><SyllabusContent /></Layout>} />
            <Route path="/course/:code" element={<Layout><CoursePage /></Layout>} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
        </Routes>
    )
}

export default App