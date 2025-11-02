import React, { useState } from "react";

function Register({ setShowRegister }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) throw new Error("Registration failed");

      alert("Registration successful! You can now log in.");
      setShowRegister(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
        )}

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <button
            type="button"
            className="text-green-600 hover:underline"
            onClick={() => setShowRegister(false)}
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
