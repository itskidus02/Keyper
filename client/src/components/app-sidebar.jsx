import React, { useState, useEffect } from "react";
import axios from "axios";
import { AudioWaveform, Wrench, Settings2, Vault, Plus, Trash } from "lucide-react";
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
import { useNavigate } from "react-router-dom";

export function AppSidebar({ ...props }) {
  const [data, setData] = useState({
    user: { name: "shadcn", email: "m@example.com", avatar: "/avatars/shadcn.jpg" },
    teams: [{ name: "LockBox", logo: logo, plan: "Enterprise", url: "/" }],
    navMain: [
      {
        title: "Tools",
        url: "#",
        icon: Wrench,
        items: [
          { title: "Password Generator", url: "/admin/passgen" },
          { title: "Password health", url: "/admin/passhealth" },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [{ title: "Profile", url: "/admin/profile" }],
      },
    ],
  });

  const [newVaultName, setNewVaultName] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isCreatingVault, setIsCreatingVault] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVaults = async () => {
      try {
        const response = await axios.get("/api/vaults/get", {
          withCredentials: true,
        });
        const vaults = response.data.map((vault) => ({
          id: vault._id,
          title: vault.name,
          url: `/admin/vault/${vault._id}`,
        }));
        const updatedNavMain = [
          { title: "Vaults", url: "#", icon: Vault, isActive: true, items: vaults },
          ...data.navMain,
        ];
        setData((prevState) => ({ ...prevState, navMain: updatedNavMain }));
      } catch (error) {
        console.error("Error fetching vaults:", error);
      }
    };
    fetchVaults();
  }, []);

  const handleDeleteVault = async (vaultId) => {
    try {
      await axios.delete(`/api/vaults/delete/${vaultId}`, { withCredentials: true });
      const updatedNavMain = [...data.navMain];
      const vaultsIndex = updatedNavMain.findIndex((item) => item.title === "Vaults");
      if (vaultsIndex !== -1) {
        updatedNavMain[vaultsIndex].items = updatedNavMain[vaultsIndex].items.filter(
          (vault) => vault.id !== vaultId
        );
      }
      setData({ ...data, navMain: updatedNavMain });
    } catch (error) {
      console.error("Error deleting vault:", error);
    }
  };

  const handleNewVault = async (e) => {
    e.preventDefault();
    if (newVaultName.trim()) {
      setIsCreatingVault(true);
      try {
        const response = await axios.post(
          "/api/vaults/create",
          { name: newVaultName },
          { withCredentials: true }
        );

        const updatedNavMain = [...data.navMain];
        const vaultsIndex = updatedNavMain.findIndex((item) => item.title === "Vaults");
        if (vaultsIndex !== -1) {
          updatedNavMain[vaultsIndex].items.push({
            id: response.data._id,
            title: newVaultName,
            url: `/admin/vault/${response.data._id}`,
          });
        }
        setData({ ...data, navMain: updatedNavMain });
        setNewVaultName("");
        setIsPopoverOpen(false);
      } catch (error) {
        console.error("Error creating new vault:", error);
      } finally {
        setIsCreatingVault(false);
      }
    }
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="w-full mt-2">
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
                <Button type="submit" disabled={isCreatingVault}>
                  {isCreatingVault ? "Creating..." : "Create Vault"}
                </Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      </SidebarHeader>
      <SidebarContent className="-ml-1">
        <NavMain
          items={data.navMain.map((section) => {
            if (section.title === "Vaults") {
              return {
                ...section,
                items: section.items.map((vault) => ({
                  ...vault,
                  title: (
                    <div className="flex gap-[7rem] justify-between items-center">
                      <button onClick={() => navigate(`/admin/vault/${vault.id}`)}>
                        {vault.title}
                      </button>
                      <button onClick={() => handleDeleteVault(vault.id)} className="text-red-500">
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  ),
                })),
              };
            }
            return section;
          })}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
