import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAuth, confirmPasswordReset } from "firebase/auth";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");
  const [oobCode, setOobCode] = useState("");

  useEffect(() => {
    // Get the Firebase reset code from the URL
    const code = searchParams.get("oobCode");
    if (code) {
      setOobCode(code);
    } else {
      setMessage("Invalid or expired password reset link.");
    }
  }, [searchParams]);

  // Password validation function (same as your sign-up rules)
  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
    };
  };

  const handleResetPassword = async () => {
    setPasswordError("");
    setMessage("");

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    const criteria = validatePassword(password);
    if (Object.values(criteria).includes(false)) {
      setPasswordError("Password does not meet security criteria.");
      return;
    }

    if (!oobCode) {
      setMessage("Invalid or expired password reset link.");
      return;
    }

    const auth = getAuth();
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setMessage("Password reset successful! You can now log in.");
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("Failed to reset password. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
      <h2>Reset Password</h2>
      {message && (
        <p style={{ color: message.includes("successful") ? "green" : "red" }}>
          {message}
        </p>
      )}
      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />
      {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
      <button
        onClick={handleResetPassword}
        style={{
          padding: "10px 20px",
          background: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Reset Password
      </button>
    </div>
  );
};

export default ResetPassword;
