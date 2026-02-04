import { useState } from "react";
import { BrainIcon } from "../components/icons/BrainIcon";
import { Button } from "../components/ui/Buttons";
import { CustomAlert } from "../components/ui/CustomAlert";
import { useAlert } from "../hooks/useAlert";
import axios from "axios";
import { BackendURL } from "../config/config";
import { useNavigate } from "react-router-dom";

export function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();
  const navigate = useNavigate();

  async function handleSignUp() {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BackendURL}/signup`, {
        username,
        password,
      });
      console.log(response.data);
      showAlert(response.data.messsage || "Account created successfully!", 'success');
      
      // Navigate after a short delay to show the success message
      setTimeout(() => {
        navigate("/signin");
      }, 1500);
    } catch (error: any) {
      console.log(error);
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data || 
        error.message || 
        "Sign up failed. Please try again.";
      showAlert(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-3xl p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <BrainIcon className="w-16 h-16 text-secondary" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-800 text-center mb-2">
            Join the Brain Revolution
          </h1>
          <p className="text-slate-600 text-center">
            Create your digital mind and unlock infinite knowledge
          </p>
          <div className="w-16 h-1 bg-secondary mx-auto rounded-full mt-4"></div>
        </div>

        {/* Input Fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-serif text-slate-700 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-2 border-slate-300 rounded-2xl px-5 py-3 text-lg focus:ring-1 focus:ring-blue-200 focus:border-blue-300 outline-none transition-all duration-200 hover:border-slate-400"
              placeholder="Choose your username"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-lg font-serif text-slate-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-slate-300 rounded-2xl px-5 py-3 text-lg focus:ring-1 focus:ring-blue-200 focus:border-blue-300 outline-none transition-all duration-200 hover:border-slate-400"
              placeholder="Create a secure password"
              disabled={isLoading}
            />
          </div>

          <Button
            variant="secondary"
            text={isLoading ? "Creating Account..." : "Create Account"}
            size="lg"
            className={`w-full !rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
            onClick={handleSignUp}
          />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-600">
            Already have an account?{" "}
            <a
              href="/signin"
              className="text-secondary hover:text-secondary-hover font-medium"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
      <CustomAlert
        message={alert.message}
        type={alert.type}
        isVisible={alert.isVisible}
        onClose={hideAlert}
      />
    </div>
  );
}
