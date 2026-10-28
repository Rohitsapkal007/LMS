import { Injectable } from "@angular/core";
import { Register } from "../auth/register/register";
import { RegisterPayload } from "../models/registerPayload.model";
import { Course } from "../shared/models/course.model";

@Injectable({ providedIn: 'root' })

export class CustomMapperService {
    toRegisterPayload(formValue: any): RegisterPayload {
        return {
            Username: formValue.userName,
            Email: formValue.email,
            Password: formValue.password,
            Role: formValue.role,
            CreatedAt: new Date().toISOString(),
            IsActive: true
        };
    }

    toCoursePayload(formValue: any): Course {
        return {
            courseId : formValue.courseId??0,
            title : formValue.title,
            description : formValue.description,
            syllabus : formValue.syllabus,
            instructorId : formValue.instructorId??0,
            status : formValue.status??'',
            credits : formValue.credits??0,
            enrollmentLimit : formValue.enrollmentLimit,
            visibility : formValue.visibility,
            category : formValue.category,
            level : formValue.level,
            duration : formValue.duration,
            language : formValue.language,
            thumbnailUrl : "",
            prerequisites : formValue.prerequisites,
            learningObjectives : formValue.learningObjectives,
            targetAudience : formValue.targetAudience,
            createdAt : new Date(),
            UpdatedAt : new Date()
        };
    }
}