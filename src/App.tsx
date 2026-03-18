import { Routes, Route } from "react-router-dom"
import { Layout } from "@/components/shared/Layout";
import { SyllabusContent } from "@/pages/SyllabusContent";
import { Login } from "@/auth/Login.tsx";
import { CoursePage } from "@/pages/CoursePage";
import { PrivacyPolicy } from "@/pages/PrivacyPolicy.tsx";
import { TermsOfService } from "@/pages/TermsOfService.tsx";
import { CareerContent } from "./pages/CareerContent";
import { CareerPage } from "./pages/CareerPage";
import { RankingPage } from "./pages/RankingPage";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout><SyllabusContent /></Layout>} />
            <Route path="/cursos/:code" element={<Layout><CoursePage /></Layout>} />
            <Route path="/carreras" element={<Layout><CareerContent /></Layout>} />
            <Route path="/carreras/:code" element={<Layout><CareerPage /></Layout>} />
            <Route path="/ranking" element={<Layout><RankingPage /></Layout>} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
        </Routes>
    )
}

export default App