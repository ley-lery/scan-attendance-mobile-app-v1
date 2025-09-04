import axios from 'axios';

// ============= Enhanced Error Types =============
export interface ApiError {
    type: 'network' | 'server' | 'validation' | 'not_found' | 'already_scanned' | 'location' | 'unknown';
    message: string;
    details?: any;
}

// ============= API Configuration =============
export const API_CONFIG = {
    BASE_URL: 'http://192.168.0.16:7700/v1/api',
    ENDPOINTS: {
        CREATE_ATTENDANCE: '/attendance/create',
    },
    TIMEOUT: 10000,
};

// ============= Enhanced API Service =============
export class AttendanceApiService {
    private static instance: AttendanceApiService;
    private axiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: API_CONFIG.BASE_URL,
            timeout: API_CONFIG.TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
    }

    static getInstance(): AttendanceApiService {
        if (!AttendanceApiService.instance) {
            AttendanceApiService.instance = new AttendanceApiService();
        }
        return AttendanceApiService.instance;
    }

    // Fetch student list from QR data
    async fetchStudentList(qrData: string): Promise<{ success: boolean; data?: any[]; error?: ApiError }> {
        try {
            console.log('Fetching student list with QR data:', qrData);
            
            const response = await this.axiosInstance.get(qrData);
            
            // Check if response is valid
            if (!response.data || !response.data.data || !response.data.data.rows) {
                return {
                    success: false,
                    error: {
                        type: 'server',
                        message: 'Invalid response format from server',
                        details: response.data
                    }
                };
            }

            const students = response.data.data.rows;
            console.log('Students fetched:', students.length);
            
            return {
                success: true,
                data: students
            };

        } catch (error: any) {
            console.error('API Error:', error);
            
            // Enhanced error handling
            if (error.code === 'ECONNABORTED') {
                return {
                    success: false,
                    error: {
                        type: 'network',
                        message: 'Request timeout - please check your connection',
                        details: error
                    }
                };
            } else if (error.response) {
                // Server responded with error status
                const status = error.response.status;
                const statusText = error.response.statusText;
                
                if (status === 404) {
                    return {
                        success: false,
                        error: {
                            type: 'not_found',
                            message: 'QR code not found or invalid session',
                            details: error.response.data
                        }
                    };
                } else if (status >= 500) {
                    return {
                        success: false,
                        error: {
                            type: 'server',
                            message: 'Server error - please try again later',
                            details: { status, statusText }
                        }
                    };
                } else {
                    return {
                        success: false,
                        error: {
                            type: 'validation',
                            message: error.response.data?.message || 'Invalid request',
                            details: error.response.data
                        }
                    };
                }
            } else if (error.request) {
                // Network error
                return {
                    success: false,
                    error: {
                        type: 'network',
                        message: 'Network error - please check your internet connection',
                        details: error
                    }
                };
            } else {
                return {
                    success: false,
                    error: {
                        type: 'unknown',
                        message: 'An unexpected error occurred',
                        details: error
                    }
                };
            }
        }
    }

    // Create attendance record
    // async createAttendance(attendanceData: any): Promise<{ success: boolean; data?: any; error?: ApiError }> {
    //     try {
    //         console.log('Creating attendance:', attendanceData);
            
    //         // You can modify this endpoint based on your actual API
    //         const response = await this.axiosInstance.post(API_CONFIG.ENDPOINTS.CREATE_ATTENDANCE, attendanceData);
            
    //         if (response.data && response.data.success) {
    //             return {
    //                 success: true,
    //                 data: response.data.data
    //             };
    //         } else {
    //             return {
    //                 success: false,
    //                 error: {
    //                     type: 'server',
    //                     message: response.data?.message || 'Failed to create attendance',
    //                     details: response.data
    //                 }
    //             };
    //         }

    //     } catch (error: any) {
    //         console.error('Create Attendance Error:', error);
            
    //         if (error.response?.status === 409) {
    //             return {
    //                 success: false,
    //                 error: {
    //                     type: 'already_scanned',
    //                     message: 'Attendance already recorded for this session',
    //                     details: error.response.data
    //                 }
    //             };
    //         }
            
    //         return {
    //             success: false,
    //             error: {
    //                 type: 'unknown',
    //                 message: 'Failed to record attendance',
    //                 details: error
    //             }
    //         };
    //     }
    // }
}

// Default export for the service instance
export default AttendanceApiService.getInstance();