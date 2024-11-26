import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebase/firebaseconfig";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthContext } from "@/hooks/AuthContext";

// Zod schema for validation
const UsuarioLog = z.object({
  email: z.string().email("Invalid email format."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

const Login = () => {
  const navigate = useNavigate();
  const { authState, dispatch } = useAuthContext();
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof UsuarioLog>>({
    resolver: zodResolver(UsuarioLog),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (authState.user) {
      navigate("/home");
    }
  }, [authState.user, navigate]);

  const onSubmit = async (values: z.infer<typeof UsuarioLog>) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      dispatch({ type: "SET_USER", payload: userCredential.user });
      navigate("/home");
    } catch (err) {
      setAuthError("Invalid email or password.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      dispatch({ type: "SET_USER", payload: result.user });
      navigate("/home");
    } catch (err) {
      setAuthError("Google sign-in failed.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-4 space-y-4">
        <div className="text-center">
          <img src="/assets/softtek.png" alt="Logo" className="mx-auto h-14 w-auto" />
          <h2 className="mt-1 text-lg font-bold">Welcome to Frida Codemod</h2>
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
          <span>Sign in with Google</span>
        </Button>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your email and password below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Input {...form.register("email")} placeholder="Email" />
              <Input {...form.register("password")} type="password" placeholder="Password" />
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              {authError && <p className="text-red-500">{authError}</p>}
              <Button type="submit" className="w-full">Login</Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default Login;
