"use client";

import { useEffect, useState, useRef } from "react";
import { useFormStore } from "@/store/formStore";
import { Icons } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { FormField, SelectOption, ValidationRule } from "@/lib/types";

export function FieldEditor() {
  const { fields, selectedFieldId, selectField, updateField } = useFormStore();
  const field = fields.find((f) => f.id === selectedFieldId);
  const [isVisible, setIsVisible] = useState(false);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (field) {
      // Only animate if panel wasn't already open
      if (!wasOpenRef.current) {
        requestAnimationFrame(() => setIsVisible(true));
      }
      wasOpenRef.current = true;
    } else {
      wasOpenRef.current = false;
    }
  }, [field]);

  const handleClose = () => {
    setIsVisible(false);
    wasOpenRef.current = false;
    setTimeout(() => selectField(null), 300);
  };

  if (!field) {
    return null;
  }

  const handleChange = (updates: Partial<FormField>) => {
    updateField(field.id, updates);
  };

  const handleValidationChange = (type: ValidationRule["type"], enabled: boolean) => {
    const newValidation = enabled
      ? [...field.validation, { type }]
      : field.validation.filter((v) => v.type !== type);
    handleChange({ validation: newValidation });
  };

  const isRequired = field.validation.some((v) => v.type === "required");

  const handleOptionChange = (index: number, key: keyof SelectOption, value: string) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = { ...newOptions[index], [key]: value };
    handleChange({ options: newOptions });
  };

  const handleAddOption = () => {
    const newOptions = [
      ...(field.options || []),
      { label: `Option ${(field.options?.length || 0) + 1}`, value: `option${(field.options?.length || 0) + 1}` },
    ];
    handleChange({ options: newOptions });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = field.options?.filter((_, i) => i !== index);
    handleChange({ options: newOptions });
  };

  return (
    <div
        className={`fixed inset-y-0 right-0 w-96 bg-card border-l border-border shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="font-semibold text-foreground">Edit Field</h2>
          <button
            onClick={handleClose}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Basic Settings */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Basic Settings
            </h3>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Label</label>
              <input
                type="text"
                value={field.label}
                onChange={(e) => handleChange({ label: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Name Attribute</label>
              <input
                type="text"
                value={field.name}
                onChange={(e) => handleChange({ name: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Used for form submission. No spaces allowed.
              </p>
            </div>

            {field.type !== "checkbox" && field.type !== "radio" && field.type !== "hidden" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Placeholder</label>
                <input
                  type="text"
                  value={field.placeholder || ""}
                  onChange={(e) => handleChange({ placeholder: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Instructions</label>
              <textarea
                value={field.instructions || ""}
                onChange={(e) => handleChange({ instructions: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Help text displayed below the field"
              />
            </div>

            {field.type === "hidden" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Default Value</label>
                <input
                  type="text"
                  value={field.defaultValue || ""}
                  onChange={(e) => handleChange({ defaultValue: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            )}
          </section>

          {/* Options for select/radio */}
          {(field.type === "select" || field.type === "radio") && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Options
              </h3>

              <div className="space-y-2">
                {field.options?.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option.label}
                      onChange={(e) => handleOptionChange(index, "label", e.target.value)}
                      placeholder="Label"
                      className="flex-1 px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                    />
                    <input
                      type="text"
                      value={option.value}
                      onChange={(e) => handleOptionChange(index, "value", e.target.value)}
                      placeholder="Value"
                      className="w-24 px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
                    >
                      <Icons.Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <Button variant="outline" size="sm" onClick={handleAddOption}>
                <Icons.Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            </section>
          )}

          {/* File upload settings */}
          {field.type === "file" && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                File Settings
              </h3>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Accepted File Types</label>
                <input
                  type="text"
                  value={field.accept || ""}
                  onChange={(e) => handleChange({ accept: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
                  placeholder="image/*,.pdf,.doc"
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated list of file types (e.g., image/*, .pdf, .doc)
                </p>
              </div>
            </section>
          )}

          {/* Address settings */}
          {field.type === "address" && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Address Options
              </h3>

              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={field.includeAddress2}
                    onChange={(e) => handleChange({ includeAddress2: e.target.checked })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">Include Address Line 2</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={field.includeCountry}
                    onChange={(e) => handleChange({ includeCountry: e.target.checked })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">Include Country</span>
                </label>
              </div>
            </section>
          )}

          {/* Validation */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Validation
            </h3>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isRequired}
                onChange={(e) => handleValidationChange("required", e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground">Required field</span>
            </label>

            {/* Advanced validation for specific field types */}
            {(field.type === "text" || field.type === "textarea") && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Min Length</label>
                  <input
                    type="number"
                    min="0"
                    value={field.validation.find((v) => v.type === "minLength")?.value as number || ""}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : undefined;
                      const filtered = field.validation.filter((v) => v.type !== "minLength");
                      handleChange({
                        validation: value ? [...filtered, { type: "minLength", value }] : filtered,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Max Length</label>
                  <input
                    type="number"
                    min="0"
                    value={field.validation.find((v) => v.type === "maxLength")?.value as number || ""}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : undefined;
                      const filtered = field.validation.filter((v) => v.type !== "maxLength");
                      handleChange({
                        validation: value ? [...filtered, { type: "maxLength", value }] : filtered,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </>
            )}

            {field.type === "email" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Corporate Domain</label>
                <input
                  type="text"
                  value={field.validation.find((v) => v.type === "corporateDomain")?.value as string || ""}
                  onChange={(e) => {
                    const value = e.target.value || undefined;
                    const filtered = field.validation.filter((v) => v.type !== "corporateDomain");
                    handleChange({
                      validation: value ? [...filtered, { type: "corporateDomain", value }] : filtered,
                    });
                  }}
                  className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
                  placeholder="@company.com"
                />
                <p className="text-xs text-muted-foreground">
                  Require emails from this domain (e.g., @company.com)
                </p>
              </div>
            )}

            {field.type === "number" && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Minimum Value</label>
                  <input
                    type="number"
                    value={field.validation.find((v) => v.type === "min")?.value as number || ""}
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : undefined;
                      const filtered = field.validation.filter((v) => v.type !== "min");
                      handleChange({
                        validation: value !== undefined ? [...filtered, { type: "min", value }] : filtered,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">Maximum Value</label>
                  <input
                    type="number"
                    value={field.validation.find((v) => v.type === "max")?.value as number || ""}
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : undefined;
                      const filtered = field.validation.filter((v) => v.type !== "max");
                      handleChange({
                        validation: value !== undefined ? [...filtered, { type: "max", value }] : filtered,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </>
            )}

            {(field.type === "text" || field.type === "email") && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Blocklist (comma-separated)</label>
                <input
                  type="text"
                  value={(field.validation.find((v) => v.type === "blocklist")?.value as string[])?.join(", ") || ""}
                  onChange={(e) => {
                    const values = e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s);
                    const filtered = field.validation.filter((v) => v.type !== "blocklist");
                    handleChange({
                      validation: values.length ? [...filtered, { type: "blocklist", value: values }] : filtered,
                    });
                  }}
                  className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="spam, test, example"
                />
                <p className="text-xs text-muted-foreground">
                  Reject submissions containing these words
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
  );
}
