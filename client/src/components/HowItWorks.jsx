"use client";
import React from "react";
import { StickyScroll } from "../components/ui/sticky-scroll-reveal";
// import Image from "next/image";
import logo from "../../src/assets/images/h.png"
const content = [
  {
    title: "Collaborative Editing",
    description:
      "Work together in real time with your team, clients, and stakeholders. Collaborate on documents, share ideas, and make decisions quickly. With our platform, you can streamline your workflow and increase productivity.",
      content: (
        <div className="h-full w-full  flex items-center justify-center">
          <img
            src={logo}
            width={300}
            height={300}
            className="h-full w-full object-cover"
            alt="linear board demo" />
        </div>
      ),
  },
  {
    title: "Real time changes",
    description:
      "See changes as they happen. With our platform, you can track every modification in real time. No more confusion about the latest version of your project. Say goodbye to the chaos of version control and embrace the simplicity of real-time updates.",
    content: (
      <div className="h-full w-full  flex items-center justify-center">
        <img
          src={logo}
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo" />
      </div>
    ),
  },
  {
    title: "Version control",
    description:
      "Experience real-time updates and never stress about version control again. Our platform ensures that you're always working on the most recent version of your project, eliminating the need for constant manual updates. Stay in the loop, keep your team aligned, and maintain the flow of your work without any interruptions.",
      content: (
        <div className="h-full w-full  flex items-center justify-center">
          <img
            src={logo}
            width={300}
            height={300}
            className="h-full w-full object-cover"
            alt="linear board demo" />
        </div>
      ),
  },
  {
    title: "Running out of content",
    description:
      "Experience real-time updates and never stress about version control again. Our platform ensures that you're always working on the most recent version of your project, eliminating the need for constant manual updates. Stay in the loop, keep your team aligned, and maintain the flow of your work without any interruptions.",
      content: (
        <div className="h-full w-full  flex items-center justify-center">
          <img
            src={logo}
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