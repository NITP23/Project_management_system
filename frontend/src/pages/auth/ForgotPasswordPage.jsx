import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle, KeyRound, Loader, Mail } from "lucide-react";
import { forgotPassword } from "../../store/slices/authSlice.js";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  // FIX: destructure auth state properly from Redux state
  const { isRequestingForToken } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // FIX: validate trimmed email to avoid whitespace-only values
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setError("Email is invalid");
      return;
    }

    setError("");

    try {
      await dispatch(forgotPassword(trimmedEmail)).unwrap();
      setIsSubmitted(true);
    } catch (err) {
      setError(err || "Failed to send reset link. Please try again later");
    }
  };

  // FIX: render the success state from component state, not from inside the submit handler
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-3">Check Your Email</h2>
          <p className="text-gray-600 mb-6">
            If an account with that email exists, we've sent a password reset link.
            Please check your inbox and spam folder.
          </p>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3 mb-6">
            <Mail className="text-blue-500 mt-1" size={20} />
            <p className="text-sm text-gray-700 text-left">
              The reset link is valid for <span className="font-semibold">15 minutes</span>.
              For security reasons, it can only be used once.
            </p>
          </div>

          <button
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200 mb-4"
            onClick={() => setIsSubmitted(false)}
          >
            Resend Email
          </button>

          <Link
            to="/login"
            className="text-blue-600 font-medium hover:text-blue-800 hover:underline"
          >
            ← Back to Login
          </Link>

          <div className="mt-8 border-t pt-4">
            <p className="text-xs text-gray-500">
              Didn't request a password reset? You can safely ignore this email. Your account remains secure.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-500">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Forgot Password</h1>
          <p className="text-slate-600 mt-2">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  // FIX: clear the error message when the user updates the email input
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                className={`input ${error ? "input-error" : ""}`}
                placeholder="Enter your email"
                disabled={isRequestingForToken}
              />
            </div>

            <button
              type="submit"
              className="w-full btn btn-primary disabled:opacity-50 cursor-not-allowed"
              disabled={isRequestingForToken}
            >
              {isRequestingForToken ? (
                <div className="flex items-center justify-center">
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" /> Sending...
                </div>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
