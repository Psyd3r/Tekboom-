
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { BannerManager } from "@/components/Marketing/BannerManager";
import { LogoManager } from "@/components/Marketing/LogoManager";
import { ImageIcon, Store } from "lucide-react";

const Marketing = () => {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Marketing</h1>
      </div>

      <Tabs defaultValue="banners" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="banners" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span>Banners</span>
          </TabsTrigger>
          <TabsTrigger value="logo" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span>Logo</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="banners">
          <BannerManager />
        </TabsContent>
        
        <TabsContent value="logo">
          <LogoManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketing;
