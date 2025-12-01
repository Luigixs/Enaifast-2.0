import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import StudentLayout from "@/components/layouts/StudentLayout";
import AdminLayout from "@/components/layouts/AdminLayout";
import Auth from "@/pages/Auth";
import StudentDashboard from "@/pages/student/Dashboard";
import StudentCourses from "@/pages/student/Courses";
import StudentCourseDetail from "@/pages/student/CourseDetail";
import StudentLessonViewer from "@/pages/student/LessonViewer";
import StudentCommunity from "@/pages/student/Community";
import StudentAnalytics from "@/pages/student/Analytics";
import StudentRanking from "@/pages/student/Ranking";
import StudentLive from "@/pages/student/Live";
import AdminSchool from "@/pages/admin/School";
import AdminCourses from "@/pages/admin/Courses";
import AdminCourseDetail from "@/pages/admin/CourseDetail";
import AdminUsers from "@/pages/admin/Users";
import AdminUserManagement from "@/pages/admin/UserManagement";
import AdminSales from "@/pages/admin/Sales";
import AdminPlans from "@/pages/admin/Plans";
import AdminQuestions from "@/pages/admin/Questions";
import AdminNotifications from "@/pages/admin/Notifications";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="ead-platform-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Auth Route */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Redirect root to auth */}
              <Route path="/" element={<Navigate to="/auth" replace />} />
              
              {/* Student Routes (role: user) */}
              <Route
                path="/student"
                element={
                  <ProtectedRoute requiredRole="user">
                    <StudentLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<StudentDashboard />} />
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="courses" element={<StudentCourses />} />
                <Route path="courses/:courseId" element={<StudentCourseDetail />} />
                <Route path="lesson/:lessonId" element={<StudentLessonViewer />} />
                <Route path="community" element={<StudentCommunity />} />
                <Route path="analytics" element={<StudentAnalytics />} />
                <Route path="ranking" element={<StudentRanking />} />
                <Route path="live" element={<StudentLive />} />
              </Route>
              
              {/* Admin Routes (role: admin) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/school" replace />} />
                <Route path="school" element={<AdminSchool />} />
                <Route path="school/notifications" element={<AdminNotifications />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="courses/:id" element={<AdminCourseDetail />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="user-management" element={<AdminUserManagement />} />
                <Route path="sales" element={<AdminSales />} />
                <Route path="plans" element={<AdminPlans />} />
                <Route path="questions" element={<AdminQuestions />} />
              </Route>
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
