import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL } from '../config';
import { auth } from '../firebase';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const syncUserWithBackend = async (firebaseUser, name = '') => {
        try {
            const res = await fetch(`${API_URL}/users/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name || firebaseUser.displayName || 'User',
                    email: firebaseUser.email,
                    firebaseUid: firebaseUser.uid
                }),
            });

            if (!res.ok) {
                if (res.status === 403) {
                    await logout();
                    throw new Error('Your account has been blocked.');
                }
                const err = await res.json();
                console.error('Sync failed:', err);
            }
        } catch (error) {
            console.error('User sync error:', error);
            throw error;
        }
    };

    const signup = async (email, password, name) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await syncUserWithBackend(result.user, name);
        return result;
    };

    const login = async (email, password) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        await syncUserWithBackend(result.user);
        return result;
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        await syncUserWithBackend(result.user);
        return result;
    };

    const logout = () => signOut(auth);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Optionally verify sync on every load/refresh to catch blocks
                // syncUserWithBackend(currentUser).catch(() => setUser(null));
            }
            setUser(currentUser);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        user,
        signup,
        login,
        loginWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
