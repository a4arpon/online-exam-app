import { Link } from "@tanstack/react-router"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

const menuItems = [
  {
    text: "Home",
    href: "/",
  },
]

export function Navbar() {
  return (
    <header className="pt-3">
      <div className="flex items-center justify-between container mx-auto bg-card p-4 rounded-lg shadow-xs">
        {/* Left: Branding + Search */}
        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold tracking-tight">
            Unan English Club
          </span>
        </div>

        {/* Center: Empty */}
        <div className="hidden md:flex flex-1 justify-center"></div>

        {/* Right: Menu + Profile */}
        <div className="flex items-center gap-4">
          <nav className="hidden sm:flex items-center gap-4">
            {menuItems.map((item) => (
              <Link key={item?.text} to={item?.href} className="relative group">
                {item?.text}
                <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-10 w-10 cursor-pointer">
                <AvatarImage src="/placeholder.jpg" alt="@user" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link to="/auth">
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <DropdownMenuItem>My Certificates</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
