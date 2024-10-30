import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { deleteVault, createVault } from '../redux/vault/vaultSlice';
import { Wrench, Settings2, Plus, Trash } from "lucide-react";
import logo from "../assets/images/logo.png";
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
import { useNavigate } from "react-router-dom";

export function AppSidebar({ ...props }) {
  const dispatch = useDispatch();
  const vaults = useSelector((state) => state.vault.vaults); 
  const [newVaultName, setNewVaultName] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isCreatingVault, setIsCreatingVault] = useState(false);
  const navigate = useNavigate();

  const data = {
    user: { name: "shadcn", email: "m@example.com", avatar: "/avatars/shadcn.jpg" },
    teams: [{ name: "LockBox", logo: logo, plan: "Enterprise", url: "/" }],
    navMain: [
      {
        title: "Tools",
        icon: Wrench,
        items: [
          { title: "Password Generator", url: "/admin/passgen" },
          { title: "Password Health", url: "/admin/passhealth" },
        ],
      },
      {
        title: "Settings",
        icon: Settings2,
        items: [{ title: "Profile", url: "/admin/profile" }],
      },
    ],
  };

  const handleNewVault = async (e) => {
    e.preventDefault();
    if (newVaultName.trim()) {
      setIsCreatingVault(true);
      dispatch(createVault(newVaultName));
      setNewVaultName('');
      setIsPopoverOpen(false);
      setIsCreatingVault(false);
    }
  };

  const handleDeleteVault = (vaultId) => {
    dispatch(deleteVault(vaultId));
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
      <SidebarContent className="-ml-1 space-y-4">
        {data.navMain.map((section, index) => (
          <div key={index}>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <section.icon className="h-4 w-4" />
              {section.title}
            </h4>
            <div className="ml-4 space-y-2">
              {section.items.map((item) => (
                <button
                  key={item.url}
                  onClick={() => navigate(item.url)}
                  className="text-sm text-left hover:text-blue-500"
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h4 className="font-semibold mb-2">Vaults</h4>
          {vaults.map((vault) => (
            <div key={vault._id} className="flex justify-between items-center mb-2">
              <button onClick={() => navigate(`/admin/vault/${vault._id}`)}>{vault.name}</button>
              <button onClick={() => handleDeleteVault(vault._id)} className="text-red-500">
                <Trash className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
