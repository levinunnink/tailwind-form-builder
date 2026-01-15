"use client";

import { FormField, Theme, FieldSpacing } from "@/lib/types";
import { THEME_STYLES, LABEL_STYLES, INSTRUCTIONS_STYLES, FIELD_SPACING_CONFIG } from "@/lib/constants";

interface FieldRendererProps {
  field: FormField;
  theme: Theme;
  fieldSpacing?: FieldSpacing;
}

export function FieldRenderer({ field, theme, fieldSpacing = "default" }: FieldRendererProps) {
  const inputStyles = THEME_STYLES[theme].input;
  const isRequired = field.validation.some((v) => v.type === "required");
  const innerSpacing = FIELD_SPACING_CONFIG[fieldSpacing].inner;
  const gapSpacing = FIELD_SPACING_CONFIG[fieldSpacing].gap;
  const mtSpacing = FIELD_SPACING_CONFIG[fieldSpacing].mt;

  const labelContent = (
    <label htmlFor={field.id} className={LABEL_STYLES}>
      {field.label}
      {isRequired && <span className="text-destructive ml-1">*</span>}
    </label>
  );

  const instructions = field.instructions && (
    <p className={INSTRUCTIONS_STYLES}>{field.instructions}</p>
  );

  switch (field.type) {
    case "text":
    case "email":
    case "phone":
    case "url":
      return (
        <div className={innerSpacing}>
          {labelContent}
          <input
            type={field.type === "phone" ? "tel" : field.type}
            id={field.id}
            name={field.name}
            placeholder={field.placeholder}
            defaultValue={field.defaultValue}
            required={isRequired}
            className={inputStyles}
          />
          {instructions}
        </div>
      );

    case "number":
      return (
        <div className={innerSpacing}>
          {labelContent}
          <input
            type="number"
            id={field.id}
            name={field.name}
            placeholder={field.placeholder}
            defaultValue={field.defaultValue}
            required={isRequired}
            className={inputStyles}
          />
          {instructions}
        </div>
      );

    case "textarea":
      return (
        <div className={innerSpacing}>
          {labelContent}
          <textarea
            id={field.id}
            name={field.name}
            placeholder={field.placeholder}
            defaultValue={field.defaultValue}
            required={isRequired}
            rows={4}
            className={inputStyles}
          />
          {instructions}
        </div>
      );

    case "select":
      return (
        <div className={innerSpacing}>
          {labelContent}
          <select
            id={field.id}
            name={field.name}
            required={isRequired}
            defaultValue={field.defaultValue}
            className={inputStyles}
          >
            <option value="">Select an option...</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {instructions}
        </div>
      );

    case "checkbox":
      return (
        <div className={innerSpacing}>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={field.id}
              name={field.name}
              required={isRequired}
              className="rounded border-border bg-input text-primary focus:ring-primary"
            />
            <label htmlFor={field.id} className="text-sm text-foreground">
              {field.label}
              {isRequired && <span className="text-destructive ml-1">*</span>}
            </label>
          </div>
          {instructions}
        </div>
      );

    case "radio":
      return (
        <fieldset className={innerSpacing}>
          <legend className={LABEL_STYLES}>
            {field.label}
            {isRequired && <span className="text-destructive ml-1">*</span>}
          </legend>
          <div className={innerSpacing}>
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  id={`${field.id}-${option.value}`}
                  name={field.name}
                  value={option.value}
                  required={isRequired}
                  className="border-border bg-input text-primary focus:ring-primary"
                />
                <label
                  htmlFor={`${field.id}-${option.value}`}
                  className="text-sm text-foreground"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
          {instructions}
        </fieldset>
      );

    case "hidden":
      return (
        <div className="p-3 bg-muted/50 border border-dashed border-border rounded-md">
          <p className="text-sm text-muted-foreground">
            Hidden field: <code className="bg-muted px-1 rounded">{field.name}</code>
            {field.defaultValue && (
              <span>
                {" "}
                = <code className="bg-muted px-1 rounded">{field.defaultValue}</code>
              </span>
            )}
          </p>
        </div>
      );

    case "date":
      return (
        <div className={innerSpacing}>
          {labelContent}
          <input
            type="date"
            id={field.id}
            name={field.name}
            required={isRequired}
            defaultValue={field.defaultValue}
            className={inputStyles}
          />
          {instructions}
        </div>
      );

    case "file":
      return (
        <div className={innerSpacing}>
          {labelContent}
          <input
            type="file"
            id={field.id}
            name={field.name}
            required={isRequired}
            accept={field.accept}
            className={`${inputStyles} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90`}
          />
          {instructions}
        </div>
      );

    case "name":
      return (
        <div className={innerSpacing}>
          {labelContent}
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${gapSpacing}`}>
            <input
              type="text"
              id={`${field.id}-first`}
              name={`${field.name}_first`}
              placeholder="First name"
              required={isRequired}
              className={inputStyles}
            />
            <input
              type="text"
              id={`${field.id}-last`}
              name={`${field.name}_last`}
              placeholder="Last name"
              required={isRequired}
              className={inputStyles}
            />
          </div>
          {instructions}
        </div>
      );

    case "address":
      return (
        <div className={innerSpacing}>
          {labelContent}
          <div>
            <input
              type="text"
              id={`${field.id}-street`}
              name={`${field.name}_street`}
              placeholder="Street address"
              required={isRequired}
              className={inputStyles}
            />
            {field.includeAddress2 && (
              <input
                type="text"
                id={`${field.id}-street2`}
                name={`${field.name}_street2`}
                placeholder="Apartment, suite, etc. (optional)"
                className={`${inputStyles} ${mtSpacing}`}
              />
            )}
            <div className={`grid grid-cols-1 sm:grid-cols-3 ${gapSpacing} ${mtSpacing}`}>
              <input
                type="text"
                id={`${field.id}-city`}
                name={`${field.name}_city`}
                placeholder="City"
                required={isRequired}
                className={inputStyles}
              />
              <input
                type="text"
                id={`${field.id}-state`}
                name={`${field.name}_state`}
                placeholder="State"
                required={isRequired}
                className={inputStyles}
              />
              <input
                type="text"
                id={`${field.id}-zip`}
                name={`${field.name}_zip`}
                placeholder="ZIP"
                required={isRequired}
                className={inputStyles}
              />
            </div>
            {field.includeCountry && (
              <input
                type="text"
                id={`${field.id}-country`}
                name={`${field.name}_country`}
                placeholder="Country"
                required={isRequired}
                className={`${inputStyles} ${mtSpacing}`}
              />
            )}
          </div>
          {instructions}
        </div>
      );

    default:
      return null;
  }
}
