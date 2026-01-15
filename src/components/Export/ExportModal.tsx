"use client";

import { useState, useEffect } from "react";
import { useFormStore } from "@/store/formStore";
import { ExportFormat } from "@/lib/types";
import { generateHtml } from "./exportHtml";
import { generateReact } from "./exportReact";
import { generateVue } from "./exportVue";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { Highlight, themes } from "prism-react-renderer";

interface ExportModalProps {
  onClose: () => void;
}

const FORMATS: { id: ExportFormat; label: string; extension: string; language: string; icon: keyof typeof Icons }[] = [
  { id: "html", label: "HTML", extension: "html", language: "html", icon: "Html" },
  { id: "react", label: "React", extension: "jsx", language: "jsx", icon: "React" },
  { id: "vue", label: "Vue", extension: "vue", language: "html", icon: "Vue" },
];

export function ExportModal({ onClose }: ExportModalProps) {
  const [activeFormat, setActiveFormat] = useState<ExportFormat>("html");
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { fields, config } = useFormStore();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const getCode = (format: ExportFormat): string => {
    switch (format) {
      case "html":
        return generateHtml(fields, config);
      case "react":
        return generateReact(fields, config);
      case "vue":
        return generateVue(fields, config);
      default:
        return "";
    }
  };

  const code = getCode(activeFormat);
  const currentFormat = FORMATS.find((f) => f.id === activeFormat);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const format = FORMATS.find((f) => f.id === activeFormat);
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `form.${format?.extension || "txt"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Choose theme based on system preference
  const prismTheme = isDark ? themes.nightOwl : themes.github;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-lg shadow-xl border border-border flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Export Form</h2>
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Tabs */}
        <div className="flex gap-1 px-6 py-3 border-b border-border bg-muted/30">
          {FORMATS.map((format) => {
            const Icon = Icons[format.icon];
            return (
              <button
                key={format.id}
                onClick={() => setActiveFormat(format.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors
                  ${activeFormat === format.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {format.label}
              </button>
            );
          })}
        </div>

        {/* Code Preview */}
        <div className="flex-1 overflow-auto p-6">
          <div className="relative rounded-lg overflow-hidden border border-border">
            <Highlight
              theme={prismTheme}
              code={code}
              language={currentFormat?.language || "html"}
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  className={`${className} p-4 overflow-x-auto text-sm`}
                  style={{ ...style, margin: 0 }}
                >
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                      <span className="inline-block w-8 text-right mr-4 text-gray-400 select-none text-xs">
                        {i + 1}
                      </span>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {fields.length} field{fields.length !== 1 ? "s" : ""} •{" "}
            {activeFormat.toUpperCase()} format
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Icons.Upload className="w-4 h-4 mr-2 rotate-180" />
              Download
            </Button>
            <Button onClick={handleCopy}>
              {copied ? (
                <>
                  <Icons.Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Icons.Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
