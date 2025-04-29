import React, { useState, useEffect } from "react";
import Login from "./Login";
import SignUp from "./SignUp";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.height = "100vh";
    document.body.style.background = "linear-gradient(to bottom right, #e0f7fa, #b2ebf2)";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";

    return () => {
      document.body.style.background = "";
    };
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.page}>
        {/* Left Section */}
        <div style={styles.leftSection}>
          <div style={styles.logoTitle}>
            <img src="/logo/logo.png" alt="Logo" style={styles.logo} />
            <h1 style={styles.nexTicketTitle}>NexTicket</h1>
          </div>
          <h2 style={styles.welcomeTitle}>Welcome Back!</h2>
        </div>

        {/* Right Section */}
        <div style={styles.rightSection}>
          {!isLogin ? (
            <>
              <h2 style={styles.createAccountTitle}>Create Account</h2>
              <SignUp switchToLogin={() => setIsLogin(true)} />
            </>
          ) : (
            <>
              <h2 style={styles.createAccountTitle}>Login</h2>
              <Login switchToSignUp={() => setIsLogin(false)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    alignItems: "center",
    justifyContent: "center",
  },
  page: {
    display: "flex",
    height: "80vh",
    width: "75vw", 
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 0 20px rgba(0,0,0,0.1)",
  },
  leftSection: {
    flex: "1",
    backgroundColor: "#0097a7",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "30px",
    justifyContent: "center",
  },
  logoTitle: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  logo: {
    width: "200px",  
    height: "200px",
    objectFit: "contain",
    marginRight: "10px",
  },
  nexTicketTitle: {
    fontSize: "60px",
    fontWeight: "bold",
    margin: "0",
  },
  welcomeTitle: {
    fontSize: "40px", 
    fontWeight: "bold",
    marginTop: "30px",
    textAlign: "center",
  },
  rightSection: {
    flex: "1",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 20px",
    justifyContent: "center",
  },
  createAccountTitle: {
    fontSize: "28px",
    color: "#333333",
    marginBottom: "20px",
    fontWeight: "bold",
  },
};
