import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@app/components/ui/sidebar"
import { useNavigate } from "@tanstack/react-router"
import {
  FolderOpenIcon,
  Home,
  Inbox,
  PowerOffIcon,
  SettingsIcon,
  UniversityIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react"
import { Button } from "../ui/button"

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Intakes",
    url: "/app/intakes",
    icon: FolderOpenIcon,
  },
  {
    title: "Universities",
    url: "/app/universities",
    icon: UniversityIcon,
  },
  {
    title: "Clients",
    url: "/app/clients",
    icon: UsersIcon,
  },
]

export function AppSidebar() {
  const navigator = useNavigate()
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() =>
                      navigator({
                        to: item?.url,
                      })
                    }
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="ghost" className="justify-start">
          <SettingsIcon />
          <span>Settings</span>
        </Button>
        <div className="grid grid-cols-2 gap-3.5">
          <Button variant="secondary" className="justify-start">
            <UserIcon />
            <span>My Profile</span>
          </Button>
          <Button variant="destructive" className="justify-start">
            <PowerOffIcon />
            <span>Logout</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
