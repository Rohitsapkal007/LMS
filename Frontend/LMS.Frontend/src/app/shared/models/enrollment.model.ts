export interface Enrollment{
    courseId : number,
    title : string,
    totalEnrollment : number
}

export interface EnrolledStudent{
    enrollmentId : number,
    userName: string,
    email: string,
    purchaseDate : Date,
    title : string,
    progress : number,
    status : string
}