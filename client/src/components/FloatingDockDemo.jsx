import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
//   IconBrandGithub,
//   IconBrandX,
//   IconExchange,
  IconHome,
//   IconAbout,
  IconNewSection,
//   IconTerminal2,
} from "@tabler/icons-react";
import Image from "../assets/images/logo.png";

export function FloatingDockDemo() {
  // const { currentUser } = useSelector((state) => state.user);

  const links = [
    {
      title: "Aceternity UI",
      icon: <img src={Image} width={20} height={20} alt="Aceternity Logo" />,
      href: "#",
    },

    {
      title: "Products",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Components",
      icon: (
        <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
  ];
  return (
    <div className="flex items-center justify-center h-[6rem] w-full">
      <FloatingDock
        // only for demo, remove for production
        mobileClassName="translate-y-10"
        items={links}
      />
    </div>
  );
}
