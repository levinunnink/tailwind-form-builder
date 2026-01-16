export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'hidden'
  | 'email'
  | 'phone'
  | 'date'
  | 'url'
  | 'file'
  | 'name'
  | 'address'
  | 'utm';

export type Theme = 'default' | 'simple' | 'underline' | 'solid';

export type FieldSpacing = 'tight' | 'default' | 'wide';

export type ValidationRuleType =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'min'
  | 'max'
  | 'pattern'
  | 'blocklist'
  | 'corporateDomain'
  | 'accept';

export interface ValidationRule {
  type: ValidationRuleType;
  value?: string | number | string[];
  message?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  placeholder?: string;
  instructions?: string;
  defaultValue?: string;
  validation: ValidationRule[];
  options?: SelectOption[];
  accept?: string;
  // Address-specific options
  includeAddress2?: boolean;
  includeCountry?: boolean;
}

export interface FormConfig {
  action: string;
  method: 'GET' | 'POST';
  submitType: 'standard' | 'ajax';
  successMessage: string;
  theme: Theme;
  submitButtonText: string;
  darkMode: boolean;
  fieldSpacing: FieldSpacing;
}

export interface FormState {
  fields: FormField[];
  config: FormConfig;
  selectedFieldId: string | null;
}

export type ExportFormat = 'html' | 'react' | 'vue';

export interface FieldDefinition {
  type: FieldType;
  label: string;
  icon: string;
  category: 'basic' | 'advanced';
  defaultLabel: string;
  defaultPlaceholder?: string;
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  fields: Omit<FormField, 'id'>[];
}
