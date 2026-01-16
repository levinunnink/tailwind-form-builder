"use client";

import { useState, useEffect } from "react";
import { useFormStore } from "@/store/formStore";
import { THEME_STYLES, FIELD_SPACING_CONFIG } from "@/lib/constants";
import { Theme, FieldSpacing } from "@/lib/types";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";

interface FormSettingsProps {
  onClose: () => void;
}

export function FormSettings({ onClose }: FormSettingsProps) {
  const { config, updateConfig, reset } = useFormStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const themes = Object.entries(THEME_STYLES) as [Theme, typeof THEME_STYLES[Theme]][];
  const spacingOptions = Object.entries(FIELD_SPACING_CONFIG) as [FieldSpacing, typeof FIELD_SPACING_CONFIG[FieldSpacing]][];

  return (
    <div
      className={`
        fixed top-0 right-0 h-full w-96 bg-card border-l border-border shadow-xl z-50
        transform transition-transform duration-200 ease-out
        ${isVisible ? "translate-x-0" : "translate-x-full"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Form Settings</h2>
        <button
          onClick={handleClose}
          className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded"
        >
          <Icons.X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-57px)]">
        {/* Form Action */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Form Action URL</label>
          <input
            type="text"
            value={config.action}
            onChange={(e) => updateConfig({ action: e.target.value })}
            className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
            placeholder="/api/submit"
          />
          <a
            href="https://sheetmonkey.io"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Need somewhere to save your form data? Try <span className="underline">Sheet Monkey</span> to send submissions to Google Sheets.
          </a>
        </div>

        {/* Method */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Method</label>
          <select
            value={config.method}
            onChange={(e) => updateConfig({ method: e.target.value as "GET" | "POST" })}
            className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="POST">POST</option>
            <option value="GET">GET</option>
          </select>
        </div>

        {/* Submit Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Submission Type</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="submitType"
                value="standard"
                checked={config.submitType === "standard"}
                onChange={() => updateConfig({ submitType: "standard" })}
                className="text-foreground focus:ring-foreground"
              />
              <span className="text-sm text-foreground">Standard</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="submitType"
                value="ajax"
                checked={config.submitType === "ajax"}
                onChange={() => updateConfig({ submitType: "ajax" })}
                className="text-foreground focus:ring-foreground"
              />
              <span className="text-sm text-foreground">AJAX</span>
            </label>
          </div>
        </div>

        {/* Success Message (for AJAX) */}
        {config.submitType === "ajax" && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Success Message</label>
            <input
              type="text"
              value={config.successMessage}
              onChange={(e) => updateConfig({ successMessage: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Thank you for your submission!"
            />
          </div>
        )}

        {/* Submit Button Text */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Submit Button Text</label>
          <input
            type="text"
            value={config.submitButtonText}
            onChange={(e) => updateConfig({ submitButtonText: e.target.value })}
            className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Submit"
          />
        </div>

        {/* Field Spacing */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Field Spacing</label>
          <div className="flex gap-2">
            {spacingOptions.map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => updateConfig({ fieldSpacing: key })}
                className={`
                  flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${config.fieldSpacing === key
                    ? "bg-foreground text-background"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }
                `}
              >
                {value.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-foreground">Form Theme</label>
            <button
              type="button"
              onClick={() => updateConfig({ darkMode: !config.darkMode })}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${config.darkMode
                  ? "bg-foreground text-background"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }
              `}
              title={config.darkMode ? "Dark mode styles enabled" : "Dark mode styles disabled"}
            >
              <Icons.Moon className="w-4 h-4" />
              Dark Mode
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {config.darkMode
              ? "Exported code will include dark mode styles"
              : "Exported code will not include dark mode styles"
            }
          </p>
          <div className="grid gap-2">
            {themes.map(([key, value]) => (
              <label
                key={key}
                className={`
                  flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors
                  ${config.theme === key
                    ? "border-foreground bg-muted"
                    : "border-border hover:border-muted-foreground"
                  }
                `}
              >
                <input
                  type="radio"
                  name="theme"
                  value={key}
                  checked={config.theme === key}
                  onChange={() => updateConfig({ theme: key })}
                  className="mt-1 text-foreground focus:ring-foreground"
                />
                <div>
                  <span className="block font-medium text-foreground">{value.label}</span>
                  <span className="text-sm text-muted-foreground">{value.description}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Reset */}
        <div className="pt-4 border-t border-border">
          <Button variant="destructive" size="sm" onClick={reset}>
            <Icons.Trash2 className="w-4 h-4 mr-2" />
            Reset Form
          </Button>
        </div>
      </div>
    </div>
  );
}
