import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser } from '../types';
import { getUsers, adminLogin } from '../services/api';

interface AuthContextType {
    user: AdminUser | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// SuperAdmin hardcodeado - SOLO PARA EL DUEÑO
const SUPER_ADMIN: AdminUser = {
    id: 'superadmin-1',
    name: 'Super Administrador',
    username: 'Orlando12',
    password: 'Pomelo_12@',
    role: 'superadmin'
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Lista de usuarios (incluyendo el superadmin)
    const [allUsers, setAllUsers] = useState<AdminUser[]>([SUPER_ADMIN]);

    // Cargar usuarios del backend al iniciar
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const backendUsers = await getUsers();
                console.log('🔍 DEBUG - Usuarios recibidos del backend:', backendUsers);
                
                // Combinar superadmin con usuarios del backend
                setAllUsers([SUPER_ADMIN, ...backendUsers]);
                console.log('✅ Usuarios cargados del backend:', backendUsers.length);
                console.log('📋 Todos los usuarios disponibles:', [SUPER_ADMIN, ...backendUsers]);
            } catch (error) {
                console.error('Error loading users from backend:', error);
                // Si falla, usar solo el superadmin
            }
        };
        
        loadUsers();
    }, []);

    // Verificar si hay sesión guardada al cargar
    useEffect(() => {
        const savedUser = localStorage.getItem('admin_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Error parsing saved user:', error);
                localStorage.removeItem('admin_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        
        try {
            console.log('🔐 Intentando login para:', username);
            
            // Intentar login con el backend primero (incluye superadmin si está en BD)
            // Esto asegura que siempre se obtenga un token JWT
            try {
                const loginResult = await adminLogin(username, password);
                console.log('✅ Login exitoso con backend:', loginResult);
                
                // loginResult tiene estructura { user, access_token }
                const userData = loginResult.user || loginResult;
                setUser(userData);
                localStorage.setItem('admin_user', JSON.stringify(userData));
                // El token ya se guarda en adminLogin
                setIsLoading(false);
                return true;
            } catch (backendError) {
                // Si falla el backend, intentar con superadmin hardcodeado como fallback
                // PERO esto no generará token, así que solo funcionará si el backend está caído
                if (username.toLowerCase() === SUPER_ADMIN.username.toLowerCase() && password === SUPER_ADMIN.password) {
                    console.warn('⚠️ Usando superadmin hardcodeado (sin token JWT). El backend debe estar caído.');
                    const userData = { ...SUPER_ADMIN };
                    delete userData.password; // No guardar la contraseña
                    
                    console.log('✅ Login exitoso con superadmin (fallback)');
                    setUser(userData);
                    localStorage.setItem('admin_user', JSON.stringify(userData));
                    setIsLoading(false);
                    return true;
                }
                
                console.log('❌ Error en login del backend:', backendError);
                console.log('❌ Credenciales incorrectas para:', username);
                setIsLoading(false);
                return false;
            }
        } catch (error) {
            console.error('Login error:', error);
            setIsLoading(false);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_token');
    };

    const value: AuthContextType = {
        user,
        login,
        logout,
        isLoading,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
