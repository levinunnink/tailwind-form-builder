"use client";

import { FIELD_DEFINITIONS } from "@/lib/constants";
import { useFormStore } from "@/store/formStore";
import { Icons, IconName } from "@/components/ui/Icons";
import { FieldType } from "@/lib/types";

export function FieldPalette() {
  const addField = useFormStore((state) => state.addField);

  const basicFields = FIELD_DEFINITIONS.filter((f) => f.category === "basic");
  const advancedFields = FIELD_DEFINITIONS.filter((f) => f.category === "advanced");

  const handleAddField = (type: FieldType) => {
    addField(type);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
          Basic Fields
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {basicFields.map((field) => {
            const Icon = Icons[field.icon as IconName];
            return (
              <button
                key={field.type}
                onClick={() => handleAddField(field.type)}
                className="group flex items-center gap-2 px-3 py-2 text-left bg-card hover:bg-accent border border-border rounded-lg transition-colors duration-150"
              >
                <span className="flex size-5 items-center justify-center rounded border border-black/5 bg-primary/15 text-primary drop-shadow-sm transition-transform group-hover:scale-110">
                  {Icon && <Icon className="w-3 h-3" />}
                </span>
                <span className="text-sm font-medium leading-none">{field.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
          Advanced Fields
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {advancedFields.map((field) => {
            const Icon = Icons[field.icon as IconName];
            return (
              <button
                key={field.type}
                onClick={() => handleAddField(field.type)}
                className="group flex items-center gap-2 px-3 py-2 text-left bg-card hover:bg-accent border border-border rounded-lg transition-colors duration-150"
              >
                <span className="flex size-5 items-center justify-center rounded border border-black/5 bg-primary/15 text-primary drop-shadow-sm transition-transform group-hover:scale-110">
                  {Icon && <Icon className="w-3 h-3" />}
                </span>
                <span className="text-sm font-medium leading-none">{field.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
