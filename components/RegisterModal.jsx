import { useNavigate } from "react-router-dom";

export default function RegisterModal() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <button
      onClick={handleRegister}
      className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-90 rounded-xl shadow-lg shadow-brand-blue/15 transition-all duration-300 hover:-translate-y-0.5"
    >
      Register Now
    </button>
  );
}
