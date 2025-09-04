export const ENDPOINTS = {
    AUTH:{
        STUDENT: {
            LOGIN: '/auth/student/login',
            REGISTER: '/auth/student/register',
            LOGOUT: '/auth/student/logout',
            PROFILE: '/auth/student/profile',
        },
        LECTURER: {
            LOGIN: '/auth/lecturer/login',
            REGISTER: '/auth/lecturer/register',
            LOGOUT: '/auth/lecturer/logout',
            PROFILE: '/auth/lecturer/profile',
        }
    },
    STUDENT:{
        ATT_HISTORIES:{
            GET: '/attendance/students/histories',
            GET_DETAIL: '/attendance/students/histories/:id',
        },
        LEAVE_HISTORIES:{
            GET: '/attendance/students/leaves',
            GET_DETAIL: '/attendance/students/leaves/:id',
        },
        SINGLE_LEAVE_REQ:{
            POST: '/attendance/students/leaves',
            GET_DETAIL: '/attendance/students/leaves/:id',
            CANCEL: '/attendance/students/leaves/:id',
        },
        EXTENDED_LEAVE_REQ:{
            POST: '/attendance/students/leaves',
            GET_DETAIL: '/attendance/students/leaves/:id',
            CANCEL: '/attendance/students/leaves/:id',
        },
        TODAY_CLASS:{
            GET: '/attendance/students/classes/today',
        },
        TODAY_ATT:{
            GET: '/attendance/students/classes/today',
        },
    },
    LECTURER:{
        ATT_HISTORIES:{
            GET: '/attendance/lecturers/histories',
            GET_DETAIL: '/attendance/lecturers/histories/:id',
        },
        LEAVE_HISTORIES:{
            GET: '/attendance/lecturers/leaves',
            GET_DETAIL: '/attendance/lecturers/leaves/:id',
        },
        SINGLE_LEAVE_REQ:{
            POST: '/attendance/lecturers/leaves',
            GET_DETAIL: '/attendance/lecturers/leaves/:id',
            CANCEL: '/attendance/lecturers/leaves/:id',
        },
        EXTENDED_LEAVE_REQ:{
            POST: '/attendance/lecturers/leaves',
            GET_DETAIL: '/attendance/lecturers/leaves/:id',
            CANCEL: '/attendance/lecturers/leaves/:id',
        },
        TODAY_CLASS:{
            GET: '/attendance/lecturers/classes/today',
        },
        TODAY_ATT:{
            GET: '/attendance/lecturers/classes/today',
        },
        REPORT:{
            GET: '/attendance/lecturers/report',
        },
        STU_TODAY_LEAVE:{
            GET: '/attendance/lecturers/students/leaves/today',
        },
        MARK_ATTENDANCE:{
            POST: '/attendance/lecturers/mark-attendance',
        },
    },
    LEAVE_TYPE:{
        GET: '/attendance/leave-types',
    }
};
