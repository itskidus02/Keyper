"use client";
import React from "react";
import { StickyScroll } from "../components/ui/sticky-scroll-reveal";
// import Image from "next/image";
import logo from "../../src/assets/images/h.png"
import one from "../../src/assets/images/1.png"
import two from "../../src/assets/images/2.png"
import three from "../../src/assets/images/3.png"
import four from "../../src/assets/images/4.png"
import five from "../../src/assets/images/5.png"
import six from "../../src/assets/images/6.png"
const content = [
  {
    title: "Sign in to keyper",
    description:
      "if you are new to our site join us by signing up.",
      content: (
        <div className="h-full w-full  flex items-center justify-center">
          <img
            src={five}
            width={300}
            height={300}
            className="h-full w-full object-cover"
            alt="linear board demo" />
        </div>
      ),
  },
  {
    title: "Navigate to Dashboard",
    description:
      "Create new Vaults by clicking the button. you can create as many vaults as you like.",
    content: (
      <div className="h-full w-full  flex items-center justify-center">
        <img
          src={six}
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo" />
      </div>
    ),
  },
  {
    title: "Create Passwords",
    description:
      "Other than creating passwords, you can create wallet seed phraases with standard word length. and copy them when they are needed.",
      content: (
        <div className="h-full w-full  flex items-center justify-center">
          <img
            src={four}
            width={300}
            height={300}
            className="h-full w-full object-cover"
            alt="linear board demo" />
        </div>
      ),
  },
  {
    title: "The Vault page",
    description:
      "Navigate through the passwords and seeds you created.",
      content: (
        <div className="h-full w-full  flex items-center justify-center">
          <img
            src={three}
            width={300}
            height={300}
            className="h-full w-full object-cover"
            alt="linear board demo" />
        </div>
      ),
  },
  {
    title: "Dashboard statistics",
    description:
      "Manage your statistics like total vaults and total passwords.",
      content: (
        <div className="h-full w-full  flex items-center justify-center">
          <img
            src={one}
            width={300}
            height={300}
            className="h-full w-full object-cover"
            alt="linear board demo" />
        </div>
      ),
  },
];
export default function HowItWorks() {
  return (
    <div id="how" className="mt-4">
        <h1 className="text-left mb-3">How it works</h1>
    <div className="p-10 ring-1 ring-[#e4e4e7] shadow-lg mb-[6rem] rounded-lg h-[40rem]">
      <StickyScroll content={content} />
    </div>
    </div>
  );
}
