"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FormField, Theme, FieldSpacing } from "@/lib/types";
import { FieldRenderer } from "@/components/FormFields";
import { useFormStore } from "@/store/formStore";
import { Icons } from "@/components/ui/Icons";

interface SortableFieldProps {
  field: FormField;
  theme: Theme;
  fieldSpacing: FieldSpacing;
  isSelected: boolean;
  onSelect: () => void;
}

export function SortableField({ field, theme, fieldSpacing, isSelected, onSelect }: SortableFieldProps) {
  const { removeField, duplicateField } = useFormStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition: isDragging ? undefined : transition,
    willChange: isDragging ? 'transform' : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative rounded-lg border-2 transition-colors
        ${isDragging ? "opacity-75 z-50 shadow-lg" : ""}
        ${isSelected
          ? "border-primary/50 ring-1 ring-primary/10"
          : "border-transparent hover:border-border"
        }
      `}
    >
      <div
        className="p-4 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <FieldRenderer field={field} theme={theme} fieldSpacing={fieldSpacing} />
      </div>

      {/* Field controls - visible on hover or when selected */}
      <div
        className={`
          absolute -top-3 right-2 flex items-center gap-1 bg-card border border-border rounded-md shadow-sm
          ${isSelected || isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
          transition-opacity
        `}
      >
        <button
          type="button"
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <Icons.GripVertical className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            duplicateField(field.id);
          }}
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded"
          title="Duplicate field"
        >
          <Icons.Copy className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            removeField(field.id);
          }}
          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
          title="Delete field"
        >
          <Icons.Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
