import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { NotificationProvider } from "./context/NotificationContext";
import { Layout } from "./components/Layout";

// Page Components
import { LandingPage } from "./pages/LandingPage";
import { JobsPortal } from "./pages/JobsPortal";
import { GovSchemes } from "./pages/GovSchemes";
import { SkillDevelopment } from "./pages/SkillDevelopment";
import { LearningResources } from "./pages/LearningResources";
import { CareerRoadmaps } from "./pages/CareerRoadmaps";
import { ResumeBuilder } from "./pages/ResumeBuilder";
import { InterviewPrep } from "./pages/InterviewPrep";
import { DigitalLiteracy } from "./pages/DigitalLiteracy";
import { Dashboard } from "./pages/Dashboard";
import { AdminPanel } from "./pages/AdminPanel";
import { AIAssistant } from "./pages/AIAssistant";

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/jobs" element={<JobsPortal />} />
                  <Route path="/schemes" element={<GovSchemes />} />
                  <Route path="/skills" element={<SkillDevelopment />} />
                  <Route path="/resources" element={<LearningResources />} />
                  <Route path="/career" element={<CareerRoadmaps />} />
                  <Route path="/resume" element={<ResumeBuilder />} />
                  <Route path="/interview" element={<InterviewPrep />} />
                  <Route path="/literacy" element={<DigitalLiteracy />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/ai" element={<AIAssistant />} />
                </Routes>
              </Layout>
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
