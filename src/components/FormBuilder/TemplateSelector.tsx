"use client";

import { useFormStore } from "@/store/formStore";
import { FORM_TEMPLATES } from "@/lib/templates";
import { Icons } from "@/components/ui/Icons";

interface TemplateSelectorProps {
  onClose: () => void;
}

export function TemplateSelector({ onClose }: TemplateSelectorProps) {
  const { loadTemplate, fields } = useFormStore();

  const handleSelectTemplate = (templateId: string) => {
    if (fields.length > 0) {
      const confirmed = window.confirm(
        "This will replace your current form. Are you sure?"
      );
      if (!confirmed) return;
    }
    loadTemplate(templateId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-card rounded-lg shadow-xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Choose a Template</h2>
            <p className="text-sm text-muted-foreground">
              Start with a pre-built form or begin from scratch
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {FORM_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template.id)}
                className="p-4 text-left rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <h3 className="font-medium text-foreground mb-1">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                <div className="text-xs text-muted-foreground">
                  {template.fields.length === 0 ? (
                    <span>Empty form</span>
                  ) : (
                    <span>{template.fields.length} field{template.fields.length !== 1 ? "s" : ""}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
