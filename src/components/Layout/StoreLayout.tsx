
import { useState } from "react";
import { StoreHeader } from "./StoreHeader";
import { StoreFooter } from "./StoreFooter";
import { cn } from "@/lib/utils";

interface StoreLayoutProps {
  children: React.ReactNode;
}

export const StoreLayout = ({ children }: StoreLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F9FF]">
      <StoreHeader />
      <main className="flex-1">
        <div className="container mx-auto py-6 px-4 animate-fade-in">
          {children}
        </div>
      </main>
      <StoreFooter />
    </div>
  );
};
