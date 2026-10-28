import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./auth/login/login').then(m => m.Login) },
    { path: 'register', loadComponent: () => import('./auth/register/register').then(m => m.Register) },
    { path: 'courses', loadComponent: () => import('./features/public/courses/courses').then(m => m.Courses) },
    //Student
    { path: 'assignments', loadComponent: () => import('./features/student/assignments/assignments').then(m => m.Assignments), canActivate: [AuthGuard] },
    { path: 'progress', loadComponent: () => import('./features/student/progress/progress').then(m => m.Progress), canActivate: [AuthGuard] },
    { path: 'quizzes', loadComponent: () => import('./features/student/quizzes/quizzes').then(m => m.Quizzes), canActivate: [AuthGuard] },
    { path: 'student-courses', loadComponent: () => import('./features/student/student-courses/student-courses').then(m => m.StudentCourses), canActivate: [AuthGuard] },
    //Instructor
    { path: 'enrollments', loadComponent: () => import('./features/instructor/enrollments/enrollments').then(m => m.Enrollments), canActivate: [AuthGuard] },
    { path: 'enrollments/enrolled-student/:courseId', loadComponent: () => import('./features/instructor/enrollments/enrolled-students/enrolled-students').then(m => m.EnrolledStudents), canActivate: [AuthGuard] },
    {
        path: 'instructor-courses', loadComponent: () => import('./features/instructor/instructor-courses/instructor-courses').then(m => m.InstructorCourses), canActivate: [AuthGuard],
        children: [
            { path: 'drafts', loadComponent: () => import('./features/instructor/instructor-courses/drafts/drafts').then(m => m.Drafts) },
            { path: 'pending', loadComponent: () => import('./features/instructor/instructor-courses/pending/pending').then(m => m.Pending) },
            { path: 'approved', loadComponent: () => import('./features/instructor/instructor-courses/approved/approved').then(m => m.Approved) },
            { path: 'rejected', loadComponent: () => import('./features/instructor/instructor-courses/rejected/rejected').then(m => m.Rejected) },
            { path: 'deactive', loadComponent: () => import('./features/instructor/instructor-courses/deactive/deactive').then(m => m.Deactive) },
            { path: '', redirectTo: 'drafts', pathMatch: 'full' }
        ]
    },
    { path: 'instructor-courses/manage-content/:courseId', loadComponent: () => import('./features/instructor/instructor-courses/manage-content/manage-content').then(m => m.ManageContent), canActivate: [AuthGuard] },
    { path: 'instructor-courses/add-course', loadComponent: () => import('./features/instructor/instructor-courses/add-course/add-course').then(m => m.AddCourse), canActivate: [AuthGuard] },
    { path: 'instructor-courses/edit-course/:id', loadComponent: () => import('./features/instructor/instructor-courses/edit-course/edit-course').then(m => m.EditCourse), canActivate: [AuthGuard] },
    { path: 'reports', loadComponent: () => import('./features/instructor/reports/reports').then(m => m.Reports), canActivate: [AuthGuard] },
    //Admin
    { path: 'course-approval', loadComponent: () => import('./features/admin/course-approval/course-approval').then(m => m.CourseApproval), canActivate: [AuthGuard] },
    { path: 'setting', loadComponent: () => import('./features/admin/settings/settings').then(m => m.Settings), canActivate: [AuthGuard] },
    { path: 'system-reports', loadComponent: () => import('./features/admin/system-reports/system-reports').then(m => m.SystemReports), canActivate: [AuthGuard] },
    { path: 'users', loadComponent: () => import('./features/admin/users/users').then(m => m.Users), canActivate: [AuthGuard] },

    { path: "**", redirectTo: 'login' }
];
