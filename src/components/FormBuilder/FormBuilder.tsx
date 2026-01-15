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
          <Icons.Info className="w-5 h-5" />
        </button>
      </div>

      {/* Right Panel - Sidebar */}
      <div className="w-80 bg-card h-screen flex flex-col flex-shrink-0 shadow-[-4px_0_12px_rgba(0,0,0,0.08)]">
        {/* Top - Settings & Templates */}
        <div className="p-4 border-b border-border space-y-3">
          <h1 className="text-lg font-semibold text-foreground">
            Tailwind Form Builder
          </h1>
          <p className="text-sm">Build your tailwind forms and export them for HTML, React, and Vue.</p>
          <a
            href="https://github.com/levinunnink/tailwind-form-builder"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icons.GitHub className="w-3.5 h-3.5" />
            Star on GitHub
          </a>
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
            variant="primary"
            className="w-full"
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
