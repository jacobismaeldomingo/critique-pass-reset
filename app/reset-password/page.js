"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getAuth, confirmPasswordReset } from "firebase/auth";
import { FaCheckCircle, FaRegEye, FaRegEyeSlash } from "react-icons/fa"; // Importing icons

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");
  const [oobCode, setOobCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  useEffect(() => {
    const code = searchParams.get("oobCode");
    if (code) {
      setOobCode(code);
    } else {
      setMessage("Invalid or expired password reset link.");
    }
  }, [searchParams]);

  const handleResetPassword = async () => {
    setPasswordError("");
    setMessage("");

    if (!oobCode) {
      setMessage("Invalid or expired password reset link.");
      return;
    }

    const auth = getAuth();
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setMessage("Password reset successful! You can now log in.");
    } catch (error) {
      setMessage("Failed to reset password. Please try again.");
    }
  };

  const validatePassword = (password) => {
    const lengthValid = password.length >= 8;
    const lowercaseValid = /[a-z]/.test(password);
    const uppercaseValid = /[A-Z]/.test(password);
    const numberValid = /\d/.test(password);
    const specialCharValid = /[@$!%*?&]/.test(password);

    setPasswordValidation({
      length: lengthValid,
      lowercase: lowercaseValid,
      uppercase: uppercaseValid,
      number: numberValid,
      specialChar: specialCharValid,
    });

    return (
      lengthValid &&
      lowercaseValid &&
      uppercaseValid &&
      numberValid &&
      specialCharValid
    );
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "white",
        color: "black",
        flexDirection: "column",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontWeight: "bold", fontSize: 24 }}>Reset Password</h1>
      {message && (
        <p
          style={{
            color: message.includes("successful") ? "green" : "red",
            marginTop: 15,
            marginBottom: 20,
          }}
        >
          {message}
        </p>
      )}
      <div style={{ position: "relative", width: "100%", maxWidth: "400px" }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter new password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e.target.value);
          }}
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <div
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            top: "40%",
            right: "10px",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
        >
          {showPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
        </div>
      </div>
      {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}

      {/* Password validation icons and messages */}
      {password && (
        <div
          style={{
            marginTop: "20px",
            textAlign: "left",
            maxWidth: "400px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaCheckCircle
              color={passwordValidation.length ? "green" : "red"}
            />
            <span
              style={{
                color: passwordValidation.length ? "green" : "red",
                marginLeft: "10px",
              }}
            >
              At least 8 characters
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaCheckCircle
              color={passwordValidation.lowercase ? "green" : "red"}
            />
            <span
              style={{
                color: passwordValidation.lowercase ? "green" : "red",
                marginLeft: "10px",
              }}
            >
              At least one lowercase letter
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaCheckCircle
              color={passwordValidation.uppercase ? "green" : "red"}
            />
            <span
              style={{
                color: passwordValidation.uppercase ? "green" : "red",
                marginLeft: "10px",
              }}
            >
              At least one uppercase letter
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaCheckCircle
              color={passwordValidation.number ? "green" : "red"}
            />
            <span
              style={{
                color: passwordValidation.number ? "green" : "red",
                marginLeft: "10px",
              }}
            >
              At least one number
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaCheckCircle
              color={passwordValidation.specialChar ? "green" : "red"}
            />
            <span
              style={{
                color: passwordValidation.specialChar ? "green" : "red",
                marginLeft: "10px",
              }}
            >
              At least one special character (@, $, !, %, *, ?, &)
            </span>
          </div>
        </div>
      )}

      <button
        onClick={handleResetPassword}
        style={{
          padding: "10px 20px",
          background: "#7850bf",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "15px",
          marginTop: "20px",
        }}
      >
        Reset Password
      </button>
    </div>
  );
}
