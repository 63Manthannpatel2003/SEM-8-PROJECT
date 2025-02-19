import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Clock,
  BarChart 
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const routes = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    roles: ["admin", "project_manager", "developer"],
  },
  {
    title: "Projects",
    href: "/projects",
    icon: ClipboardList,
    roles: ["admin", "project_manager"],
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: Clock,
    roles: ["admin", "project_manager", "developer"],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart,
    roles: ["admin", "project_manager"],
  },
];

export function MainNav() {
  const [location] = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  const filteredRoutes = routes.filter((route) => 
    route.roles.includes(user.role)
  );

  return (
    <nav className="flex items-center space-x-4">
      {filteredRoutes.map((route) => {
        const Icon = route.icon;
        return (
          <Link key={route.href} href={route.href}>
            <Button
              variant={location === route.href ? "secondary" : "ghost"}
              className={cn(
                "gap-2",
                location === route.href && "bg-secondary"
              )}
            >
              <Icon className="h-4 w-4" />
              {route.title}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
