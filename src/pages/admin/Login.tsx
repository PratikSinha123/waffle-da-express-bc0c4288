import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";

const Login: React.FC = () => {
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/admin";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      toast({ title: "Welcome back, Admin!" });
      navigate(from, { replace: true });
    } else {
      toast({ title: "Wrong password", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="waffle-card max-w-sm w-full p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold italic font-serif mb-2">Waffle Da</h1>
          <p className="text-muted-foreground">Admin Control Panel</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              autoFocus
            />
          </div>
          <button type="submit" className="w-full py-3 rounded-xl waffle-gradient text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            <LogIn className="w-4 h-4 inline mr-2" /> Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
