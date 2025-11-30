import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  GitCompare, 
  Settings,
  LogOut,
  UserSearch,
  CreditCard
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import logo from "@/assets/logo.png";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/candidates", icon: Users, label: "Candidates" },
  { to: "/candidate-evaluation", icon: UserSearch, label: "Candidate Evaluation" },
  { to: "/jobs", icon: Briefcase, label: "Jobs" },
  { to: "/compare", icon: GitCompare, label: "Compare" },
  { to: "/pricing", icon: CreditCard, label: "Pricing" },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      navigate("/");
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 gradient-primary border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
          <img src={logo} alt="TalentFitPro Logo" className="h-10 w-10 rounded-lg" />
          <span className="text-lg font-bold text-sidebar-foreground">TalentFitPro</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4 space-y-1">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )
            }
          >
            <Settings className="h-5 w-5" />
            Settings
          </NavLink>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
