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
import Image from "next/image";

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
        <Image src="/hero-empty.png" alt="No fields" width={300} height={100} />
        <h3 className="text-lg font-medium text-foreground mb-2 mt-4">Ready to start?</h3>
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
