import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconHome, IconNewSection } from "@tabler/icons-react";
import Image from "../assets/images/logo.png";
import { useSelector } from "react-redux";

export function FloatingDockDemo() {
  const { currentUser } = useSelector((state) => state.user);

  // Define the links array with conditionally rendered user profile or "Sign In" link
  const links = [
    {
      title: "Aceternity UI",
      icon: <img src={Image} width={20} height={20} alt="Aceternity Logo" />,
      href: "/",
    },
    {
      title: "Products",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/products",
    },
    {
      title: "Components",
      icon: (
        <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/components",
    },
    currentUser
      ? {
          title: "Profile",
          icon: (
            <img
              src={currentUser.profilePicture}
              alt="profile"
              className="h-7 w-7 rounded-full object-cover"
            />
          ),
          href: "/admin/profile",
        }
      : {
          title: "Sign In",
          icon: (
            <span className="text-neutral-500 dark:text-neutral-300">
              Sign In
            </span>
          ),
          href: "/sign-in",
        },
  ];

  return (
    <div className="flex items-center justify-center h-[19rem] w-full">
      <FloatingDock mobileClassName="translate-y-10" items={links} />
    </div>
  );
}
