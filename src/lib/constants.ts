import { FieldDefinition, Theme, FormConfig, FieldSpacing } from './types';

export const FIELD_DEFINITIONS: FieldDefinition[] = [
  // Basic fields
  {
    type: 'text',
    label: 'Text',
    icon: 'Type',
    category: 'basic',
    defaultLabel: 'Text Field',
    defaultPlaceholder: 'Enter text...',
  },
  {
    type: 'textarea',
    label: 'Paragraph',
    icon: 'AlignLeft',
    category: 'basic',
    defaultLabel: 'Message',
    defaultPlaceholder: 'Enter your message...',
  },
  {
    type: 'number',
    label: 'Number',
    icon: 'Hash',
    category: 'basic',
    defaultLabel: 'Number',
    defaultPlaceholder: '0',
  },
  {
    type: 'select',
    label: 'Dropdown',
    icon: 'ChevronDown',
    category: 'basic',
    defaultLabel: 'Select Option',
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: 'CheckSquare',
    category: 'basic',
    defaultLabel: 'I agree to the terms',
  },
  {
    type: 'radio',
    label: 'Multi Choice',
    icon: 'Circle',
    category: 'basic',
    defaultLabel: 'Choose an option',
  },
  {
    type: 'hidden',
    label: 'Hidden',
    icon: 'EyeOff',
    category: 'basic',
    defaultLabel: 'Hidden Field',
  },
  // Advanced fields
  {
    type: 'email',
    label: 'Email',
    icon: 'Mail',
    category: 'advanced',
    defaultLabel: 'Email Address',
    defaultPlaceholder: 'you@example.com',
  },
  {
    type: 'phone',
    label: 'Phone',
    icon: 'Phone',
    category: 'advanced',
    defaultLabel: 'Phone Number',
    defaultPlaceholder: '(555) 123-4567',
  },
  {
    type: 'date',
    label: 'Date',
    icon: 'Calendar',
    category: 'advanced',
    defaultLabel: 'Date',
  },
  {
    type: 'url',
    label: 'URL',
    icon: 'Link',
    category: 'advanced',
    defaultLabel: 'Website',
    defaultPlaceholder: 'https://example.com',
  },
  {
    type: 'file',
    label: 'File Upload',
    icon: 'Upload',
    category: 'advanced',
    defaultLabel: 'Upload File',
  },
  {
    type: 'name',
    label: 'Name',
    icon: 'User',
    category: 'advanced',
    defaultLabel: 'Full Name',
    defaultPlaceholder: 'John Doe',
  },
  {
    type: 'address',
    label: 'Address',
    icon: 'MapPin',
    category: 'advanced',
    defaultLabel: 'Address',
  },
  {
    type: 'utm',
    label: 'UTM Params',
    icon: 'Link',
    category: 'advanced',
    defaultLabel: 'UTM Parameters',
  },
];

export const THEME_STYLES: Record<Theme, { input: string; label: string; description: string }> = {
  default: {
    input: 'bg-input text-foreground border-border',
    label: 'Default',
    description: 'Unstyled - uses browser defaults with @tailwindcss/forms reset',
  },
  simple: {
    input: 'block w-full rounded-md border-border bg-input text-foreground shadow-sm focus:border-primary focus:ring focus:ring-primary/30',
    label: 'Simple',
    description: 'Clean rounded inputs with subtle shadow and focus ring',
  },
  underline: {
    input: 'block w-full border-0 border-b-2 border-border focus:ring-0 focus:border-primary bg-transparent text-foreground',
    label: 'Underline',
    description: 'Minimal underline-only style',
  },
  solid: {
    input: 'block w-full rounded-md bg-secondary text-foreground border-transparent focus:border-muted-foreground focus:bg-input focus:ring-0',
    label: 'Solid',
    description: 'Solid background with focus state change',
  },
};

export const DEFAULT_FORM_CONFIG: FormConfig = {
  action: '/submit',
  method: 'POST',
  submitType: 'standard',
  successMessage: 'Thank you! Your submission has been received.',
  theme: 'simple',
  submitButtonText: 'Submit',
  darkMode: true,
  fieldSpacing: 'default',
};

export const FIELD_SPACING_CONFIG: Record<FieldSpacing, { inner: string; outer: string; gap: string; mt: string; label: string }> = {
  tight: { inner: 'space-y-1', outer: 'space-y-4', gap: 'gap-2', mt: 'mt-1', label: 'Tight' },
  default: { inner: 'space-y-2', outer: 'space-y-6', gap: 'gap-4', mt: 'mt-2', label: 'Default' },
  wide: { inner: 'space-y-3', outer: 'space-y-8', gap: 'gap-6', mt: 'mt-3', label: 'Wide' },
};

export const LABEL_STYLES = 'block text-sm font-medium text-foreground';
export const INSTRUCTIONS_STYLES = 'mt-1 text-sm text-muted-foreground';
export const FIELD_WRAPPER_STYLES = 'space-y-1';
export const BUTTON_STYLES = 'inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background';
