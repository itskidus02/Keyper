import React, { useState, useEffect } from "react"; // Make sure to import useState and useEffect
import axios from "axios";
import {
  AudioWaveform,
  Wrench,
  Settings2,
  Vault,
  Plus,
  Trash,
} from "lucide-react";
import logo from "../assets/images/logo.png";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// This is sample data.
export function AppSidebar({ ...props }) {
  const [data, setData] = useState({
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
        url: "/",
      },
    ],
    navMain: [
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
            title: "Profile",
            url: "/admin/profile",
          },
        ],
      },
    ],
  });
  
  const [newVaultName, setNewVaultName] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Fetch vaults on component mount
  useEffect(() => {
    const fetchVaults = async () => {
      try {
        const response = await axios.get("/api/vaults/get", {
          withCredentials: true, // Ensure cookies are sent with request
        });
        const vaults = response.data.map((vault) => ({
          id: vault._id, // Assuming vault has an _id field in the backend
          title: vault.name,
          url: `#${vault.name.toLowerCase().replace(/\s+/g, "-")}`,
        }));
        const updatedNavMain = [
          {
            title: "Vaults",
            url: "#",
            icon: Vault,
            isActive: true,
            items: vaults,
          },
          ...data.navMain,
        ];
        setData((prevState) => ({ ...prevState, navMain: updatedNavMain }));
      } catch (error) {
        console.error("Error fetching vaults:", error);
      }
    };

    fetchVaults();
  }, []);

  // Handle deletion of a vault
  const handleDeleteVault = async (vaultId) => {
    try {
      // Send a delete request to the server
      await axios.delete(`/api/vaults/delete/${vaultId}`, {
        withCredentials: true,
      });

      // Remove the vault from the UI after deletion
      const updatedNavMain = [...data.navMain];
      const vaultsIndex = updatedNavMain.findIndex(item => item.title === "Vaults");
      if (vaultsIndex !== -1) {
        updatedNavMain[vaultsIndex].items = updatedNavMain[vaultsIndex].items.filter(vault => vault.id !== vaultId);
      }
      setData({ ...data, navMain: updatedNavMain });
    } catch (error) {
      console.error("Error deleting vault:", error);
    }
  };

  const handleNewVault = async (e) => {
    e.preventDefault();
    if (newVaultName.trim()) {
      try {
        // Create the vault in the backend
        const response = await axios.post("/api/vaults/create", { name: newVaultName }, {
          withCredentials: true,
        });

        // Update the sidebar UI
        const updatedNavMain = [...data.navMain];
        const vaultsIndex = updatedNavMain.findIndex(item => item.title === "Vaults");
        if (vaultsIndex !== -1) {
          updatedNavMain[vaultsIndex].items.push({
            id: response.data._id, // Assuming response has _id of new vault
            title: newVaultName,
            url: `#${newVaultName.toLowerCase().replace(/\s+/g, '-')}`,
          });
        }
        setData({ ...data, navMain: updatedNavMain });
        setNewVaultName("");
        setIsPopoverOpen(false);
      } catch (error) {
        console.error("Error creating new vault:", error);
      }
    }
  };

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
        <NavMain items={data.navMain.map(section => {
          if (section.title === "Vaults") {
            return {
              ...section,
              items: section.items.map(vault => ({
                ...vault,
                title: (
                  <div className="flex gap-[7rem] justify-between items-center">
                    <span>{vault.title}</span>
                    <button onClick={() => handleDeleteVault(vault.id)} className="text-red-500">
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                )
              }))
            };
          }
          return section;
        })} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
