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

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - In production, this would come from your backend
const MOCK_USERS: Record<string, { password: string; user: User }> = {
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
            student_code: "SR2244466d",
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
        },
    },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
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
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
