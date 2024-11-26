import { createContext, ReactNode, useEffect, useReducer } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { AuthState, AuthAction } from "@/authcontext";
import { auth } from "@/firebase/firebaseconfig";

/**
 * IMPORTANTE: ES DE SUMA IMPORTANCIA TENER TODO CON TYPE SAFETY.
 * Está prohibido en este archivo tener un ! en cualquier type.
 *
 * Si se necesita agregar algo al auth context. Hay que modificar la estrucutra del
 * AuthAction type, AuthState, initialState, y si es una operación particular dentro del reducer,
 * poner su condición dentro del componente <AuthContext.Provider />
 * 
 * Para utilizar este contexto en algun componente utilizar este formato:
 * 
    const { authState: { user } } = useContext(AuthContext)
 */

const initialState: AuthState = {
  user: null,
  isAuthReady: false,

};

// Aquí se controla qué función ejecutar dependiendo de la auth action que se haya elegido.
// IMPORTANTE: el return statement afecta al AuthState. Por eso se utiliza el spread operator (...)
const authReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "CLEAR_USER":
      return { ...state, user: null };
    case "SET_LOADING":
      return { ...state, isAuthReady: true, user: action.payload };
    default:
      return state;
  }
};

// Aquí se crea el contexto de autenticación.
const AuthContext = createContext<{
  authState: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}>({
  authState: initialState,
  dispatch: () => {},
});

/**
 * Aquí dependiendo del Auth state se modifica el auth context.
 * Se puede tomar este componente para realizar cualquier proceso que se deba de hacer una vez
 * el usuario hace logout, login, etc. También se puede configurar un remote config y hacer el fetch desde aquí.
 * @returns este es el componente de React que da vida al contexto.
 */
const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      dispatch({ type: "SET_LOADING", payload: user! });
    });

    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ authState, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
