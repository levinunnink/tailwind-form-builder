"use client";

import { useState } from "react";
import { useFormStore } from "@/store/formStore";
import { FormPreview } from "./FormPreview";
import { FieldPalette } from "./FieldPalette";
import { FieldEditor } from "./FieldEditor";
import { FormSettings } from "./FormSettings";
import { TemplateSelector } from "./TemplateSelector";
import { AboutModal } from "./AboutModal";
import { ExportModal } from "@/components/Export/ExportModal";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/ui/Icons";
import Image from "next/image";

export function FormBuilder() {
  const [showSettings, setShowSettings] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const { fields, selectedFieldId, config, selectField } = useFormStore();

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Left Panel - Form Preview */}
      <div
        className={`flex-1 h-screen overflow-y-auto border-r border-border graph-paper-subtle relative ${config.darkMode ? "" : "preview-light-mode"}`}
        onClick={() => selectField(null)}
      >
        <div className="max-w-2xl mx-auto">
          <FormPreview />
        </div>

        {/* Floating About Button - Bottom Left */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowAbout(true);
          }}
          className="fixed bottom-4 left-4 p-2 bg-card border border-border rounded-full shadow-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          title="About"
        >
          <Image src={"/info.png"} alt="info" width={60} height={60} />
        </button>
      </div>

      {/* Right Panel - Sidebar */}
      <div className="w-80 bg-card h-screen flex flex-col flex-shrink-0 shadow-[-4px_0_12px_rgba(0,0,0,0.08)]">
        {/* Top - Settings & Templates */}
        <div className="relative bg-card dark:bg-card border-b border-border">

          <div className="p-4 space-y-3">
          <h1 className="text-2xl text-foreground hidden">
            Tailwind Form Builder
          </h1>
          <p className="text-sm">Build your tailwind forms and export them for HTML, React, and Vue.</p>
          <div className="flex flex-row space-x-3 items-center">
            <a
              href="https://github.com/levinunnink/tailwind-form-builder"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icons.GitHub className="w-3.5 h-3.5" />
              Star on GitHub
            </a>
            <a
              href="https://github.com/levinunnink/tailwind-form-builder"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icons.Info className="w-3.5 h-3.5" />
              Learn more
            </a>
          </div>
          </div>
        </div>

        {/* Middle - Field Palette (scrollable) */}
        <div className="flex-1 p-4 overflow-y-auto">
          <FieldPalette />
        </div>

        {/* Bottom - Export Button (fixed) */}

         <div className="p-4 border-t border-border">
          <Button variant="outline" size="sm" className="w-full justify-center" onClick={() => setShowSettings(true)}>
            <Icons.Settings className="w-4 h-4 mr-2" />
            Form Settings
          </Button>
        </div>
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full !bg-foreground !text-background hover:!bg-foreground/80"
            onClick={() => setShowExport(true)}
            disabled={fields.length === 0}
          >
            <Icons.Code className="w-4 h-4 mr-2" />
            Export Code
          </Button>
        </div>
      </div>

      {/* Slide-out Field Editor */}
      {selectedFieldId && <FieldEditor />}

      {/* Settings Panel */}
      {showSettings && <FormSettings onClose={() => setShowSettings(false)} />}

      {/* Export Modal */}
      {showExport && <ExportModal onClose={() => setShowExport(false)} />}

      {/* Template Selector Modal */}
      {showTemplates && <TemplateSelector onClose={() => setShowTemplates(false)} />}

      {/* About Modal */}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
}
