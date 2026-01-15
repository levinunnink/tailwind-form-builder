"use client";

import { useFormStore } from "@/store/formStore";
import { FieldRenderer } from "@/components/FormFields";
import { BUTTON_STYLES, FIELD_SPACING_CONFIG } from "@/lib/constants";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableField } from "./SortableField";

export function FormPreview() {
  const { fields, config, selectedFieldId, selectField, reorderFields } = useFormStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderFields(active.id as string, over.id as string);
    }
  };

  if (fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
        <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
          <svg
            className="w-8 h-8 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No fields yet</h3>
        <p className="text-muted-foreground max-w-sm">
          Click on a field type from the right panel to add it to your form, or choose a
          template to get started.
        </p>
      </div>
    );
  }

  const outerSpacing = FIELD_SPACING_CONFIG[config.fieldSpacing].outer;

  return (
    <div className="p-6">
      <form
        action={config.action}
        method={config.method}
        className={outerSpacing}
        onSubmit={(e) => e.preventDefault()}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            {fields.map((field) => (
              <SortableField
                key={field.id}
                field={field}
                theme={config.theme}
                fieldSpacing={config.fieldSpacing}
                isSelected={selectedFieldId === field.id}
                onSelect={() => selectField(field.id)}
              />
            ))}
          </SortableContext>
        </DndContext>

        <div className="px-4">
          <button type="submit" className={BUTTON_STYLES}>
            {config.submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}
