"use client";

import { useState, useEffect } from "react";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

interface AboutModalProps {
  onClose: () => void;
}

export function AboutModal({ onClose }: AboutModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${isVisible ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className={`
        relative w-full max-w-lg bg-[#CDE8FF] rounded-lg shadow-xl overflow-hidden
        transform transition-all duration-200 ease-out 
        ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-lg font-semibold text-black">About Tailwind Form Builder</h2>
          <button
            onClick={handleClose}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>
        {/* Content */}
        <div className="p-6 space-y-6 ">
          <div className="space-y-4 text-black">
            <p>
              Tailwind Form Builder is a free, open-source tool that helps developers quickly create
              beautiful, accessible forms with Tailwind CSS.
            </p>
            <p>
              This project is sponsored by and created by {" "}
              <a href="https://sheetmonkey.io" className="medium underline">
                Sheet Monkey
              </a>. Sheet Monkey connects forms on any platform to Google Sheets.
              If you&apos;re building forms for Tailwind we bet you&apos;ll love Sheet Monkey.
            </p>
            <a href="https://sheetmonkey.io">
              <img 
                src="https://sheetmonkey.io/logo@2x.png" 
                width={140} height={26}
                alt="Sheet Monkey: Submit your forms to google sheets"
              />
            </a>
          </div>

        </div>
        <Image src="/about-hero.png" width={700} height={300} alt="Hero" />
      </div>
    </div>
  );
}
