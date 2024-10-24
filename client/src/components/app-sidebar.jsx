import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Vault,
  Wrench,
  Plus,
} from "lucide-react"
import logo from "../assets/images/logo.png"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// This is sample data.
const initialData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "LockBox",
      logo: logo,
      plan: "Enterprise",
      url: '/',
    },
  ],
  navMain: [
    {
      title: "Vaults",
      url: "#",
      icon: Vault,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Tools",
      url: "#",
      icon: Wrench,
      items: [
        {
          title: "Password Generator",
          url: "/admin/passgen",
        },
        {
          title: "Password health",
          url: "/admin/passhealth",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "profile",
          url: "/admin/profile",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }) {
  const [data, setData] = React.useState(initialData)
  const [newVaultName, setNewVaultName] = React.useState("")
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

  const handleNewVault = (e) => {
    e.preventDefault()
    if (newVaultName.trim()) {
      const updatedNavMain = [...data.navMain]
      const vaultsIndex = updatedNavMain.findIndex(item => item.title === "Vaults")
      
      if (vaultsIndex !== -1) {
        updatedNavMain[vaultsIndex].items.push({
          title: newVaultName,
          url: `#${newVaultName.toLowerCase().replace(/\s+/g, '-')}`,
        })
      } else {
        updatedNavMain.unshift({
          title: "Vaults",
          url: "#",
          icon: Vault,
          isActive: true,
          items: [{
            title: newVaultName,
            url: `#${newVaultName.toLowerCase().replace(/\s+/g, '-')}`,
          }],
        })
      }

      setData({ ...data, navMain: updatedNavMain })
      setNewVaultName("")
      setIsPopoverOpen(false)
    }
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="w-full ml- mt-2">
              <Plus className="h-4 w-4" />
              <span className="ml- group-data-[collapsible=icon]:hidden">New Vault</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 ml-[5rem]">
            <form onSubmit={handleNewVault}>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Create New Vault</h4>
                
                </div>
                <div className="grid gap-2">
                  <Input
                    id="name"
                    placeholder="Enter vault name"
                    value={newVaultName}
                    onChange={(e) => setNewVaultName(e.target.value)}
                  />
                </div>
                <Button type="submit">Create Vault</Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      </SidebarHeader>
      <SidebarContent className="-ml-1">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
