import { useContext } from 'react';
import { AuthContext, AuthContextState } from '../context/AuthContext';

/**
 * Custom hook to consume the AuthContext safely.
 * 
 * @throws {Error} If used outside of an AuthProvider tree.
 * @returns {AuthContextState} The current authentication state and actions.
 */
export const useAuth = (): AuthContextState => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
      'Make sure your component is wrapped inside <MountedAuthProvider>.'
    );
  }

  return context;
};