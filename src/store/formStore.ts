import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { FormField, FormConfig, FieldType, FormState } from '@/lib/types';
import { DEFAULT_FORM_CONFIG, FIELD_DEFINITIONS } from '@/lib/constants';
import { FORM_TEMPLATES } from '@/lib/templates';

interface FormStore extends FormState {
  addField: (type: FieldType, index?: number) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  removeField: (id: string) => void;
  duplicateField: (id: string) => void;
  reorderFields: (activeId: string, overId: string) => void;
  selectField: (id: string | null) => void;
  updateConfig: (updates: Partial<FormConfig>) => void;
  loadTemplate: (templateId: string) => void;
  reset: () => void;
}

const createDefaultField = (type: FieldType): FormField => {
  const definition = FIELD_DEFINITIONS.find((d) => d.type === type);
  const baseName = definition?.defaultLabel.toLowerCase().replace(/\s+/g, '_') || type;

  const field: FormField = {
    id: uuidv4(),
    type,
    label: definition?.defaultLabel || type,
    name: baseName,
    placeholder: definition?.defaultPlaceholder,
    validation: [],
  };

  // Add default options for select/radio fields
  if (type === 'select' || type === 'radio') {
    field.options = [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ];
  }

  // Add default accept for file fields
  if (type === 'file') {
    field.accept = '*/*';
  }

  // Address field defaults
  if (type === 'address') {
    field.includeAddress2 = true;
    field.includeCountry = true;
  }

  return field;
};

export const useFormStore = create<FormStore>((set, get) => ({
  fields: [],
  config: DEFAULT_FORM_CONFIG,
  selectedFieldId: null,

  addField: (type: FieldType, index?: number) => {
    const newField = createDefaultField(type);
    set((state) => {
      const fields = [...state.fields];
      if (index !== undefined && index >= 0 && index <= fields.length) {
        fields.splice(index, 0, newField);
      } else {
        fields.push(newField);
      }
      return { fields, selectedFieldId: newField.id };
    });
  },

  updateField: (id: string, updates: Partial<FormField>) => {
    set((state) => ({
      fields: state.fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      ),
    }));
  },

  removeField: (id: string) => {
    set((state) => ({
      fields: state.fields.filter((field) => field.id !== id),
      selectedFieldId: state.selectedFieldId === id ? null : state.selectedFieldId,
    }));
  },

  duplicateField: (id: string) => {
    const { fields } = get();
    const fieldIndex = fields.findIndex((f) => f.id === id);
    if (fieldIndex === -1) return;

    const originalField = fields[fieldIndex];
    const duplicatedField: FormField = {
      ...originalField,
      id: uuidv4(),
      name: `${originalField.name}_copy`,
      label: `${originalField.label} (Copy)`,
    };

    set((state) => {
      const newFields = [...state.fields];
      newFields.splice(fieldIndex + 1, 0, duplicatedField);
      return { fields: newFields, selectedFieldId: duplicatedField.id };
    });
  },

  reorderFields: (activeId: string, overId: string) => {
    set((state) => {
      const oldIndex = state.fields.findIndex((f) => f.id === activeId);
      const newIndex = state.fields.findIndex((f) => f.id === overId);

      if (oldIndex === -1 || newIndex === -1) return state;

      const newFields = [...state.fields];
      const [removed] = newFields.splice(oldIndex, 1);
      newFields.splice(newIndex, 0, removed);

      return { fields: newFields };
    });
  },

  selectField: (id: string | null) => {
    set({ selectedFieldId: id });
  },

  updateConfig: (updates: Partial<FormConfig>) => {
    set((state) => ({
      config: { ...state.config, ...updates },
    }));
  },

  loadTemplate: (templateId: string) => {
    const template = FORM_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    const fields = template.fields.map((fieldData) => ({
      ...fieldData,
      id: uuidv4(),
    }));

    set({
      fields,
      selectedFieldId: null,
    });
  },

  reset: () => {
    set({
      fields: [],
      config: DEFAULT_FORM_CONFIG,
      selectedFieldId: null,
    });
  },
}));
