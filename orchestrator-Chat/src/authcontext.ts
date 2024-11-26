import { type User } from "firebase/auth";

/**
 * Este type declara qué acciones hace el reducer. Dependiendo de la acción, se toma un input.
 */
export type AuthAction =
  | { type: "SET_USER"; payload: User }
  | { type: "CLEAR_USER" }
  | { type: "SET_LOADING"; payload: User };


  /**
   * Este type declara el estado de la autenticación. Puede o no haber un usuario.
   */
export type AuthState = {
  user: User | null;
  isAuthReady: boolean;
};
