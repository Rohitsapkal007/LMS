
export interface Course {
    courseId: number;
    title: string;
    description: string;
    syllabus: string;
    instructorId: number;
    status: string;
    
    credits?: number;
    enrollmentLimit?: number;
    visibility: 'Public' | 'Private' | 'Restricted';

    category?: string;
    level?: 'Beginner' | 'Intermediate' | 'Advanced';
    duration?: number;
    language?: string;

    thumbnailUrl?: string;
    prerequisites?:string;
    learningObjectives?: string;
    targetAudience?: string;

    createdAt: Date;
    UpdatedAt?: Date;
}