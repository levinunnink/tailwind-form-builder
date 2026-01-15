"use client";

import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";

interface AboutModalProps {
  onClose: () => void;
}

export function AboutModal({ onClose }: AboutModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-card rounded-lg shadow-xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">About Tailwind Form Builder</h2>
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <p className="text-foreground">
              Tailwind Form Builder is a free, open-source tool that helps developers quickly create
              beautiful, accessible forms with Tailwind CSS. No login required, no data stored — just
              build your form and export the code.
            </p>

            <p className="text-muted-foreground">
              We built this because creating forms from scratch is tedious. Whether you need a simple
              contact form or a complex multi-field survey, you shouldn't have to write the same
              boilerplate over and over. Drag, drop, configure, export — and get back to building
              what matters.
            </p>
          </div>

          {/* Sponsors */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Sponsored by</h3>
            <div className="space-y-4">
              <a
                href="https://sheetmonkey.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary hover:bg-accent/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icons.FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Sheet Monkey</h4>
                  <p className="text-sm text-muted-foreground">
                    Turn Google Sheets into a powerful backend for your forms. No server required —
                    just paste your form action URL and start collecting submissions.
                  </p>
                </div>
              </a>

              <a
                href="https://smmall.site"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary hover:bg-accent/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icons.Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Smmall</h4>
                  <p className="text-sm text-muted-foreground">
                    Build beautiful, fast websites without the complexity. A simple website builder
                    for developers who want to ship quickly.
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-border">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
