import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { deleteVault, createVault } from '../redux/vault/vaultSlice';
import { Wrench, Settings2, Plus, Trash, ChevronDown, Vault } from "lucide-react";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
              <span className="ml-2 group-data-[collapsible=icon]:hidden">New Vault</span>
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
      <SidebarContent className="p-4 space-y-1">
        {/* vaults */}
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 font-semibold">
              <Vault className="h-6 -ml-1 w-6" />
              <h4>Vaults</h4>
            </div>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2  space-y-2">
            {vaults.map((vault) => (
              <div key={vault._id} className="flex ml-8 text-sm justify-between items-center">
                <button onClick={() => navigate(`/admin/vault/${vault._id}`)}>{vault.name.slice(0,13)}</button>
                <button onClick={() => handleDeleteVault(vault._id)} className="text-red-500">
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
        {data.navMain.map((section, index) => (
          <Collapsible key={index}>
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3 font-semibold">
                <section.icon className="h-6 -ml-1 w-6" />
                <h4>{section.title}</h4>
              </div>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 ml-8 space-y-2">
              {section.items.map((item) => (
                <button
                  key={item.url}
                  onClick={() => navigate(item.url)}
                  className="text-sm w-full text-left hover:text-blue-500"
                >
                  {item.title}
                </button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}