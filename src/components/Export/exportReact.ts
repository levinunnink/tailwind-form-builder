import { FormField, FormConfig, Theme } from "@/lib/types";

// Helper to strip dark: classes when dark mode is disabled
const stripDarkClasses = (classes: string, darkMode: boolean): string => {
  if (darkMode) return classes;
  return classes.split(' ').filter(c => !c.startsWith('dark:')).join(' ');
};

// Export-specific styles (standard Tailwind classes for user's projects)
const EXPORT_THEME_STYLES: Record<Theme, string> = {
  default: '',
  simple: 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white',
  underline: 'mt-1 block w-full border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-indigo-500 bg-transparent dark:border-gray-600 dark:focus:border-indigo-400 dark:text-white',
  solid: 'mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 dark:bg-gray-800 dark:focus:bg-gray-700 dark:focus:border-gray-400 dark:text-white',
};

const EXPORT_LABEL_STYLES_DARK = 'block text-sm font-medium text-gray-700 dark:text-gray-200';
const EXPORT_LABEL_STYLES_LIGHT = 'block text-sm font-medium text-gray-700';
const EXPORT_INSTRUCTIONS_STYLES_DARK = 'mt-1 text-sm text-gray-500 dark:text-gray-400';
const EXPORT_INSTRUCTIONS_STYLES_LIGHT = 'mt-1 text-sm text-gray-500';
const EXPORT_BUTTON_STYLES_DARK = 'inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900';
const EXPORT_BUTTON_STYLES_LIGHT = 'inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2';

export function generateReact(fields: FormField[], config: FormConfig): string {
  const inputStyles = stripDarkClasses(EXPORT_THEME_STYLES[config.theme], config.darkMode);
  const EXPORT_LABEL_STYLES = config.darkMode ? EXPORT_LABEL_STYLES_DARK : EXPORT_LABEL_STYLES_LIGHT;
  const EXPORT_INSTRUCTIONS_STYLES = config.darkMode ? EXPORT_INSTRUCTIONS_STYLES_DARK : EXPORT_INSTRUCTIONS_STYLES_LIGHT;
  const EXPORT_BUTTON_STYLES = config.darkMode ? EXPORT_BUTTON_STYLES_DARK : EXPORT_BUTTON_STYLES_LIGHT;

  // Generate form data state initialization
  const formDataInit: Record<string, string> = {};
  const hasUtmFields = fields.some((f) => f.type === "utm");

  fields.forEach((field) => {
    if (field.type === "name") {
      formDataInit[`${field.name}_first`] = "";
      formDataInit[`${field.name}_last`] = "";
    } else if (field.type === "address") {
      formDataInit[`${field.name}_street`] = "";
      if (field.includeAddress2) formDataInit[`${field.name}_street2`] = "";
      formDataInit[`${field.name}_city`] = "";
      formDataInit[`${field.name}_state`] = "";
      formDataInit[`${field.name}_zip`] = "";
      if (field.includeCountry) formDataInit[`${field.name}_country`] = "";
    } else if (field.type === "utm") {
      formDataInit["utm_source"] = "";
      formDataInit["utm_medium"] = "";
      formDataInit["utm_campaign"] = "";
      formDataInit["utm_term"] = "";
      formDataInit["utm_content"] = "";
    } else if (field.type !== "file") {
      formDataInit[field.name] = field.defaultValue || "";
    }
  });

  const renderField = (field: FormField): string => {
    const isRequired = field.validation.some((v) => v.type === "required");
    const requiredAttr = isRequired ? "\n            required" : "";
    const requiredStar = isRequired ? '{" "}<span className="text-red-500">*</span>' : "";

    const getValidationAttrs = (): string => {
      let attrs = "";
      const minLength = field.validation.find((v) => v.type === "minLength");
      const maxLength = field.validation.find((v) => v.type === "maxLength");
      const min = field.validation.find((v) => v.type === "min");
      const max = field.validation.find((v) => v.type === "max");
      const corporateDomain = field.validation.find((v) => v.type === "corporateDomain");

      if (minLength) attrs += `\n            minLength={${minLength.value}}`;
      if (maxLength) attrs += `\n            maxLength={${maxLength.value}}`;
      if (min) attrs += `\n            min={${min.value}}`;
      if (max) attrs += `\n            max={${max.value}}`;
      if (corporateDomain) attrs += `\n            pattern=".*${corporateDomain.value}$"`;

      return attrs;
    };

    const handleChange = `onChange={(e) => setFormData({ ...formData, ${field.name}: e.target.value })}`;

    switch (field.type) {
      case "text":
      case "email":
      case "url":
        return `        <div className="space-y-1">
          <label htmlFor="${field.name}" className="${EXPORT_LABEL_STYLES}">
            ${field.label}${requiredStar}
          </label>
          <input
            type="${field.type}"
            id="${field.name}"
            name="${field.name}"
            placeholder="${field.placeholder || ""}"
            className="${inputStyles}"
            value={formData.${field.name}}
            ${handleChange}${requiredAttr}${getValidationAttrs()}
          />
          ${field.instructions ? `<p className="${EXPORT_INSTRUCTIONS_STYLES}">${field.instructions}</p>` : ""}
        </div>`;

      case "phone":
        return `        <div className="space-y-1">
          <label htmlFor="${field.name}" className="${EXPORT_LABEL_STYLES}">
            ${field.label}${requiredStar}
          </label>
          <input
            type="tel"
            id="${field.name}"
            name="${field.name}"
            placeholder="${field.placeholder || ""}"
            className="${inputStyles}"
            value={formData.${field.name}}
            ${handleChange}${requiredAttr}${getValidationAttrs()}
          />
          ${field.instructions ? `<p className="${EXPORT_INSTRUCTIONS_STYLES}">${field.instructions}</p>` : ""}
        </div>`;

      case "number":
        return `        <div className="space-y-1">
          <label htmlFor="${field.name}" className="${EXPORT_LABEL_STYLES}">
            ${field.label}${requiredStar}
          </label>
          <input
            type="number"
            id="${field.name}"
            name="${field.name}"
            placeholder="${field.placeholder || ""}"
            className="${inputStyles}"
            value={formData.${field.name}}
            ${handleChange}${requiredAttr}${getValidationAttrs()}
          />
          ${field.instructions ? `<p className="${EXPORT_INSTRUCTIONS_STYLES}">${field.instructions}</p>` : ""}
        </div>`;

      case "textarea":
        return `        <div className="space-y-1">
          <label htmlFor="${field.name}" className="${EXPORT_LABEL_STYLES}">
            ${field.label}${requiredStar}
          </label>
          <textarea
            id="${field.name}"
            name="${field.name}"
            placeholder="${field.placeholder || ""}"
            rows={4}
            className="${inputStyles}"
            value={formData.${field.name}}
            ${handleChange}${requiredAttr}${getValidationAttrs()}
          />
          ${field.instructions ? `<p className="${EXPORT_INSTRUCTIONS_STYLES}">${field.instructions}</p>` : ""}
        </div>`;

      case "select":
        const options = field.options
          ?.map((opt) => `            <option value="${opt.value}">${opt.label}</option>`)
          .join("\n");
        return `        <div className="space-y-1">
          <label htmlFor="${field.name}" className="${EXPORT_LABEL_STYLES}">
            ${field.label}${requiredStar}
          </label>
          <select
            id="${field.name}"
            name="${field.name}"
            className="${inputStyles}"
            value={formData.${field.name}}
            ${handleChange}${requiredAttr}
          >
            <option value="">Select an option...</option>
${options}
          </select>
          ${field.instructions ? `<p className="${EXPORT_INSTRUCTIONS_STYLES}">${field.instructions}</p>` : ""}
        </div>`;

      case "checkbox":
        return `        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="${field.name}"
              name="${field.name}"
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              checked={formData.${field.name}}
              onChange={(e) => setFormData({ ...formData, ${field.name}: e.target.checked })}${requiredAttr}
            />
            <label htmlFor="${field.name}" className="text-sm text-gray-700">
              ${field.label}${requiredStar}
            </label>
          </div>
          ${field.instructions ? `<p className="${EXPORT_INSTRUCTIONS_STYLES}">${field.instructions}</p>` : ""}
        </div>`;

      case "radio":
        const radioOptions = field.options
          ?.map(
            (opt) => `            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="${field.name}-${opt.value}"
                name="${field.name}"
                value="${opt.value}"
                className="border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={formData.${field.name} === "${opt.value}"}
                ${handleChange}${requiredAttr}
              />
              <label htmlFor="${field.name}-${opt.value}" className="text-sm text-gray-700">${opt.label}</label>
            </div>`
          )
          .join("\n");
        return `        <fieldset className="space-y-2">
          <legend className="${EXPORT_LABEL_STYLES}">
            ${field.label}${requiredStar}
          </legend>
${radioOptions}
          ${field.instructions ? `<p className="${EXPORT_INSTRUCTIONS_STYLES}">${field.instructions}</p>` : ""}
        </fieldset>`;

      case "hidden":
        return `        <input type="hidden" name="${field.name}" value="${field.defaultValue || ""}" />`;

      case "date":
        return `        <div className="space-y-1">
          <label htmlFor="${field.name}" className="${EXPORT_LABEL_STYLES}">
            ${field.label}${requiredStar}
          </label>
          <input
            type="date"
            id="${field.name}"
            name="${field.name}"
            className="${inputStyles}"
            value={formData.${field.name}}
            ${handleChange}${requiredAttr}
          />
          ${field.instructions ? `<p className="${EXPORT_INSTRUCTIONS_STYLES}">${field.instructions}</p>` : ""}
        </div>`;

      case "file":
        return `        <div className="space-y-1">
          <label htmlFor="${field.name}" className="${EXPORT_LABEL_STYLES}">
            ${field.label}${requiredStar}
          </label>
          <input
            type="file"
            id="${field.name}"
            name="${field.name}"
            accept="${field.accept || "*/*"}"
            className="${inputStyles} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            onChange={(e) => setFormData({ ...formData, ${field.name}: e.target.files?.[0] })}${requiredAttr}
          />
          ${field.instructions ? `<p className="${EXPORT_INSTRUCTIONS_STYLES}">${field.instructions}</p>` : ""}
        </div>`;

      case "name":
        return `        <div className="space-y-1">
          <label className="${EXPORT_LABEL_STYLES}">
            ${field.label}${requiredStar}
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              id="${field.name}-first"
              name="${field.name}_first"
              placeholder="First name"
              className="${inputStyles}"
              value={formData.${field.name}_first}
              onChange={(e) => setFormData({ ...formData, ${field.name}_first: e.target.value })}${requiredAttr}
            />
            <input
              type="text"
              id="${field.name}-last"
              name="${field.name}_last"
              placeholder="Last name"
              className="${inputStyles}"
              value={formData.${field.name}_last}
              onChange={(e) => setFormData({ ...formData, ${field.name}_last: e.target.value })}${requiredAttr}
            />
          </div>
          ${field.instructions ? `<p className="${EXPORT_INSTRUCTIONS_STYLES}">${field.instructions}</p>` : ""}
        </div>`;

      case "address":
        let addressJsx = `        <div className="space-y-3">
          <label className="${EXPORT_LABEL_STYLES}">
            ${field.label}${requiredStar}
          </label>
          <input
            type="text"
            id="${field.name}-street"
            name="${field.name}_street"
            placeholder="Street address"
            className="${inputStyles}"
            value={formData.${field.name}_street}
            onChange={(e) => setFormData({ ...formData, ${field.name}_street: e.target.value })}${requiredAttr}
          />`;

        if (field.includeAddress2) {
          addressJsx += `
          <input
            type="text"
            id="${field.name}-street2"
            name="${field.name}_street2"
            placeholder="Apartment, suite, etc. (optional)"
            className="${inputStyles}"
            value={formData.${field.name}_street2}
            onChange={(e) => setFormData({ ...formData, ${field.name}_street2: e.target.value })}
          />`;
        }

        addressJsx += `
          <div className="grid grid-cols-6 gap-4">
            <input
              type="text"
              id="${field.name}-city"
              name="${field.name}_city"
              placeholder="City"
              className="${inputStyles} col-span-2"
              value={formData.${field.name}_city}
              onChange={(e) => setFormData({ ...formData, ${field.name}_city: e.target.value })}${requiredAttr}
            />
            <input
              type="text"
              id="${field.name}-state"
              name="${field.name}_state"
              placeholder="State"
              className="${inputStyles} col-span-2"
              value={formData.${field.name}_state}
              onChange={(e) => setFormData({ ...formData, ${field.name}_state: e.target.value })}${requiredAttr}
            />
            <input
              type="text"
              id="${field.name}-zip"
              name="${field.name}_zip"
              placeholder="ZIP"
              className="${inputStyles} col-span-2"
              value={formData.${field.name}_zip}
              onChange={(e) => setFormData({ ...formData, ${field.name}_zip: e.target.value })}${requiredAttr}
            />
          </div>`;

        if (field.includeCountry) {
          addressJsx += `
          <input
            type="text"
            id="${field.name}-country"
            name="${field.name}_country"
            placeholder="Country"
            className="${inputStyles}"
            value={formData.${field.name}_country}
            onChange={(e) => setFormData({ ...formData, ${field.name}_country: e.target.value })}${requiredAttr}
          />`;
        }

        addressJsx += `
          ${field.instructions ? `<p className="${EXPORT_INSTRUCTIONS_STYLES}">${field.instructions}</p>` : ""}
        </div>`;
        return addressJsx;

      case "utm":
        return `        {/* UTM Parameters (auto-populated from URL) */}
        <input type="hidden" name="utm_source" value={formData.utm_source} />
        <input type="hidden" name="utm_medium" value={formData.utm_medium} />
        <input type="hidden" name="utm_campaign" value={formData.utm_campaign} />
        <input type="hidden" name="utm_term" value={formData.utm_term} />
        <input type="hidden" name="utm_content" value={formData.utm_content} />`;

      default:
        return "";
    }
  };

  const fieldsJsx = fields.map(renderField).join("\n\n");
  const formDataInitString = JSON.stringify(formDataInit, null, 2).replace(/"([^"]+)":/g, "$1:");

  const utmUseEffect = hasUtmFields ? `
  // Populate UTM parameters from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    const utmValues = {};
    utmParams.forEach(param => {
      const value = params.get(param);
      if (value) utmValues[param] = value;
    });
    if (Object.keys(utmValues).length > 0) {
      setFormData(prev => ({ ...prev, ...utmValues }));
    }
  }, []);
` : "";

  const reactImports = hasUtmFields ? "import { useState, useEffect } from 'react';" : "import { useState } from 'react';";

  if (config.submitType === "ajax") {
    return `${reactImports}

export default function ContactForm() {
  const [formData, setFormData] = useState(${formDataInitString});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
${utmUseEffect}

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('${config.action}', {
        method: '${config.method}',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-4 bg-green-100 text-green-800 rounded-md">
        ${config.successMessage}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
${fieldsJsx}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="${EXPORT_BUTTON_STYLES} disabled:opacity-50"
          >
            {isLoading ? 'Submitting...' : '${config.submitButtonText}'}
          </button>
        </div>
    </form>
  );
}`;
  }

  return `${reactImports}

export default function ContactForm() {
  const [formData, setFormData] = useState(${formDataInitString});
${utmUseEffect}
  return (
    <form action="${config.action}" method="${config.method}" className="space-y-6">
${fieldsJsx}

        <div>
          <button type="submit" className="${EXPORT_BUTTON_STYLES}">
            ${config.submitButtonText}
          </button>
        </div>
    </form>
  );
}`;
}
