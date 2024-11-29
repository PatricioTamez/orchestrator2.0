import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
} from "firebase/auth";
import { auth } from "@/firebase/firebaseconfig";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Zod schema for form validation
const UsuarioSignUp = z.object({
  Fname: z.string().nonempty({ message: "First name is required" }),
  Lname: z.string().nonempty({ message: "Last name is required" }),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const SignUp = () => {
  const navigate = useNavigate();

  // Initialize form with Zod schema validation
  const form = useForm<z.infer<typeof UsuarioSignUp>>({
    resolver: zodResolver(UsuarioSignUp),
    defaultValues: {
      Fname: "",
      Lname: "",
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof UsuarioSignUp>) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      navigate("/home");
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  // Handle Google sign-up
  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (err) {
      console.error("Error signing in with Google:", err);
    }
  };

  // Handle Microsoft sign-up
  const handleMicrosoftSignUp = async () => {
    const provider = new OAuthProvider("microsoft.com");
    try {
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (err) {
      console.error("Error signing in with Microsoft:", err);
    }
  };

  // Function to navigate to Login page
  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('src/assets/sottekback.jpg')` }}
    >
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-4 space-y-4 bg-opacity-90 backdrop-blur-sm">
        <div className="text-center">
          <img
            src="src/assets/softtek2.png"
            alt="Logo"
            className="mx-auto h-14 w-auto"
          />
          <h2 className="mt-1 text-sm font-semibold text-gray-900">
            Welcome to Orchestrator
          </h2>
          <p className="mt-1 text-xs text-gray-600">
            Crea tu cuenta para empezar a chatear
          </p>
        </div>

        {/* Buttons in two columns */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="flex items-center justify-center text-xs"
            onClick={handleGoogleSignUp}
          >
            <img
              src="src/assets/google.jpg"
              alt="Google"
              className="w-4 h-4 mr-2"
            />
            Sign up with Google
          </Button>

          <Button
            variant="outline"
            className="flex items-center justify-center text-xs"
            onClick={handleMicrosoftSignUp}
          >
            <img
              src="src/assets/microsoft.png"
              alt="Microsoft"
              className="w-4 h-4 mr-2"
            />
            Sign up with Microsoft
          </Button>
        </div>

        {/* Separator */}
        <div className="flex items-center justify-center space-x-2">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="text-gray-500 text-xs uppercase">Or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-sm">Sign Up</CardTitle>
                <CardDescription className="text-xs">
                  Fill in your details to create an account.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-2">
                {/* First Name and Last Name in two columns */}
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="Fname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="Lname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email Input */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Input */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter className="flex flex-col space-y-1">
                <Button type="submit" className="w-full text-xs">
                  Sign Up
                </Button>
                <Button
                  variant="link"
                  className="w-full text-center text-xs text-blue-500"
                  onClick={handleLoginRedirect}
                >
                  Already have an account? Sign In
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;
