import React, { createContext, useContext, useEffect, useState } from "react";

export type UserRole = "student" | "lecturer";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    studentId?: string;
    department?: string;
    is_scanned?: number;
    student_code?: string;
    avatar?: string;
}

export interface Lecturer extends User {
    user_code?: string;
    years_experience?: number;
    total_students?: number;
    total_courses?: number;
}

interface AuthContextType {
    user: User | Lecturer | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - In production, this would come from your backend
const MOCK_USERS: Record<string, { password: string; user: User | Lecturer }> = {
    "student@university.edu": {
        password: "123",
        user: {
            id: "1",
            avatar: "https://i.pravatar.cc/400?img=58",
            name: "John Doe",
            email: "student@university.edu",
            role: "student",
            department: "Computer Science",
            is_scanned: 0,
            student_code: "SR2244466",
        },
    },
    "lecturer@university.edu": {
        password: "123",
        user: {
            id: "2",
            avatar: "https://i.pravatar.cc/400?img=58",
            name: "Dr. Jane Smith",
            email: "lecturer@university.edu",
            role: "lecturer",
            department: "Computer Science",
            user_code: "LE2244466",
            years_experience: 5,
            total_students: 100,
            total_courses: 10,
        },
    },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | Lecturer | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuthState = async () => {
            try {
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to check auth state:", error);
                setIsLoading(false);
            }
        };

        checkAuthState();
    }, []);
    const register = async (name: string, email: string, password: string) => {
        try {
            setIsLoading(true);

            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const existingUser = MOCK_USERS[email.toLowerCase()];

            if (existingUser) {
                return { success: false, error: "Email already exists" };
            }

            const newUser: User | Lecturer = {
                id: (Object.keys(MOCK_USERS).length + 1).toString(),
                avatar: "https://i.pravatar.cc/400?img=58",
                name: name,
                email: email,
                role: "student",
                department: "Computer Science",
            };

            MOCK_USERS[email.toLowerCase()] = {
                password: password,
                user: newUser,
            };

            setUser(newUser);
            return { success: true, user: newUser };
        } catch (error) {
            console.error("Registration error:", error);
            return { success: false, error: "Registration failed. Please try again." };
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);

            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const mockUser = MOCK_USERS[email.toLowerCase()];

            if (!mockUser || mockUser.password !== password) {
                return { success: false, error: "Invalid email or password" };
            }

            setUser(mockUser.user);
            return { success: true, user: mockUser.user };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, error: "Login failed. Please try again." };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
