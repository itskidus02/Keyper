import { useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { deleteVault, createVault } from '../redux/vault/vaultSlice';
import { Wrench, Settings2, Plus, Trash, ChevronDown, ChevronUp, Vault, LayoutDashboard, AlertCircle } from "lucide-react";
import logo from "../assets/images/logo.png";
import wlogo from "../assets/images/wlogo.png";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";

export function AppSidebar({ ...props }) {
  const { resolvedTheme } = useTheme();
  const currentLogo = resolvedTheme === "dark" ? wlogo : logo;
  const dispatch = useDispatch();
  const vaults = useSelector((state) => state.vault.vaults); 
  const [newVaultName, setNewVaultName] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isCreatingVault, setIsCreatingVault] = useState(false);
  const navigate = useNavigate();

  const [isVaultCollapsed, setIsVaultCollapsed] = useState(true);
  const [isToolsCollapsed, setIsToolsCollapsed] = useState(true);
  const [isSettingsCollapsed, setIsSettingsCollapsed] = useState(true);

  // State for deletion dialogs
  const [vaultToDelete, setVaultToDelete] = useState(null);
  const [showFirstConfirmation, setShowFirstConfirmation] = useState(false);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);

  const vaultRef = useRef(null);
  const toolsRef = useRef(null);
  const settingsRef = useRef(null);

  const getCollapseStyle = (isCollapsed, ref) => ({
    height: isCollapsed ? '0px' : `${ref.current?.scrollHeight}px`,
    opacity: isCollapsed ? 0 : 1,
    overflow: 'hidden',
    transition: 'height 0.3s ease, opacity 0.3s ease',
  });

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

  const initiateVaultDeletion = (vault) => {
    setVaultToDelete(vault);
    setShowFirstConfirmation(true);
  };

  const handleFirstConfirmation = () => {
    setShowFirstConfirmation(false);
    setShowFinalConfirmation(true);
  };

  const handleFinalConfirmation = () => {
    if (vaultToDelete) {
      dispatch(deleteVault(vaultToDelete._id));
      setShowFinalConfirmation(false);
      setVaultToDelete(null);
    }
  };

  const cancelDeletion = () => {
    setShowFirstConfirmation(false);
    setShowFinalConfirmation(false);
    setVaultToDelete(null);
  };

  const data = {
    user: { name: "shadcn", email: "m@example.com", avatar: "/avatars/shadcn.jpg" },
    teams: [{ name: "Keyper", logo: currentLogo, plan: "Enterprise", url: "/" }],
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

  return (
    <>
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
          {/* Dashboard Section */}
          <div className="flex items-center w-full">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-3 w-full p-2 rounded-md transition-colors group"
            >
              <LayoutDashboard className="h-6 w-6 -ml-3 flex-shrink-0" />
              <span className="font-semibold group-data-[collapsible=icon]:hidden">Dashboard</span>
            </button>
          </div>

          {/* Vaults Section */}
          <div>
            <div onClick={() => setIsVaultCollapsed(!isVaultCollapsed)} className="flex items-center justify-between w-full cursor-pointer">
              <div className="flex items-center gap-3 font-semibold">
                <Vault className="h-6 -ml-1 w-6" />
                <h4 className="group-data-[collapsible=icon]:hidden">Vaults</h4>
              </div>
              {isVaultCollapsed ? <ChevronDown className="h-4 w-4 group-data-[collapsible=icon]:hidden" /> : <ChevronUp className="h-4 w-4 group-data-[collapsible=icon]:hidden" />}
            </div>
            <div ref={vaultRef} style={getCollapseStyle(isVaultCollapsed, vaultRef)} className="mt-2 space-y-2 group-data-[collapsible=icon]:hidden">
              {vaults.map((vault) => (
                <div key={vault._id} className="flex ml-8 text-sm justify-between items-center">
                  <button className="transition-all w-full justify-start text-left mr-9 m-1 hover:text-gray-400" onClick={() => navigate(`/admin/vault/${vault._id}`)}>{vault.name.slice(0,13)}</button>
                  <button onClick={() => initiateVaultDeletion(vault)} className="text-red-500 hover:text-red-600">
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Main Navigation Sections */}
          {data.navMain.map((section, index) => (
            <div key={index}>
              <div
                onClick={() =>
                  section.title === "Tools"
                    ? setIsToolsCollapsed(!isToolsCollapsed)
                    : setIsSettingsCollapsed(!isSettingsCollapsed)
                }
                className="flex items-center justify-between w-full cursor-pointer"
              >
                <div className="flex items-center gap-3 font-semibold">
                  <section.icon className="h-6 -ml-1 w-6" />
                  <h4 className="group-data-[collapsible=icon]:hidden">{section.title}</h4>
                </div>
                {(section.title === "Tools" && isToolsCollapsed) || (section.title === "Settings" && isSettingsCollapsed) ? (
                  <ChevronDown className="h-4 w-4 group-data-[collapsible=icon]:hidden" />
                ) : (
                  <ChevronUp className="h-4 w-4 group-data-[collapsible=icon]:hidden" />
                )}
              </div>
              <div
                ref={section.title === "Tools" ? toolsRef : settingsRef}
                style={getCollapseStyle(
                  section.title === "Tools" ? isToolsCollapsed : isSettingsCollapsed,
                  section.title === "Tools" ? toolsRef : settingsRef
                )}
                className="mt-2 ml-8 space-y-2 group-data-[collapsible=icon]:hidden"
              >
                {section.items.map((item) => (
                  <button
                    key={item.url}
                    onClick={() => navigate(item.url)}
                    className="text-sm w-full text-left transition-all justify-start mr-9 m-1 hover:text-gray-400"
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      {/* First Confirmation Dialog */}
      <Dialog open={showFirstConfirmation} onOpenChange={() => setShowFirstConfirmation(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Delete Vault
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the vault "{vaultToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={cancelDeletion}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleFirstConfirmation}>
              Delete Vault
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Final Confirmation Dialog */}
      <Dialog open={showFinalConfirmation} onOpenChange={() => setShowFinalConfirmation(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Final Confirmation
            </DialogTitle>
            <DialogDescription>
              Are you absolutely sure you want to delete this vault? This action is permanent and cannot be reversed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={cancelDeletion}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleFinalConfirmation}>
              Yes, Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}