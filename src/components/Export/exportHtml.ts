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

export function generateHtml(fields: FormField[], config: FormConfig): string {
  const inputStyles = stripDarkClasses(EXPORT_THEME_STYLES[config.theme], config.darkMode);
  const EXPORT_LABEL_STYLES = config.darkMode ? EXPORT_LABEL_STYLES_DARK : EXPORT_LABEL_STYLES_LIGHT;
  const EXPORT_INSTRUCTIONS_STYLES = config.darkMode ? EXPORT_INSTRUCTIONS_STYLES_DARK : EXPORT_INSTRUCTIONS_STYLES_LIGHT;
  const EXPORT_BUTTON_STYLES = config.darkMode ? EXPORT_BUTTON_STYLES_DARK : EXPORT_BUTTON_STYLES_LIGHT;

  const renderField = (field: FormField): string => {
    const isRequired = field.validation.some((v) => v.type === "required");
    const requiredAttr = isRequired ? " required" : "";
    const requiredStar = isRequired ? '<span class="text-red-500 ml-1">*</span>' : "";

    const labelHtml = `<label for="${field.name}" class="${EXPORT_LABEL_STYLES}">${field.label}${requiredStar}</label>`;
    const instructionsHtml = field.instructions
      ? `\n      <p class="${EXPORT_INSTRUCTIONS_STYLES}">${field.instructions}</p>`
      : "";

    // Get validation attributes
    const getValidationAttrs = (): string => {
      let attrs = "";
      const minLength = field.validation.find((v) => v.type === "minLength");
      const maxLength = field.validation.find((v) => v.type === "maxLength");
      const min = field.validation.find((v) => v.type === "min");
      const max = field.validation.find((v) => v.type === "max");
      const pattern = field.validation.find((v) => v.type === "pattern");
      const corporateDomain = field.validation.find((v) => v.type === "corporateDomain");

      if (minLength) attrs += ` minlength="${minLength.value}"`;
      if (maxLength) attrs += ` maxlength="${maxLength.value}"`;
      if (min) attrs += ` min="${min.value}"`;
      if (max) attrs += ` max="${max.value}"`;
      if (pattern) attrs += ` pattern="${pattern.value}"`;
      if (corporateDomain) attrs += ` pattern=".*${corporateDomain.value}$"`;

      return attrs;
    };

    switch (field.type) {
      case "text":
      case "email":
      case "url":
        return `
    <div class="space-y-1">
      ${labelHtml}
      <input type="${field.type}" id="${field.name}" name="${field.name}" placeholder="${field.placeholder || ""}" class="${inputStyles}"${requiredAttr}${getValidationAttrs()} />${instructionsHtml}
    </div>`;

      case "phone":
        return `
    <div class="space-y-1">
      ${labelHtml}
      <input type="tel" id="${field.name}" name="${field.name}" placeholder="${field.placeholder || ""}" class="${inputStyles}"${requiredAttr}${getValidationAttrs()} />${instructionsHtml}
    </div>`;

      case "number":
        return `
    <div class="space-y-1">
      ${labelHtml}
      <input type="number" id="${field.name}" name="${field.name}" placeholder="${field.placeholder || ""}" class="${inputStyles}"${requiredAttr}${getValidationAttrs()} />${instructionsHtml}
    </div>`;

      case "textarea":
        return `
    <div class="space-y-1">
      ${labelHtml}
      <textarea id="${field.name}" name="${field.name}" placeholder="${field.placeholder || ""}" rows="4" class="${inputStyles}"${requiredAttr}${getValidationAttrs()}></textarea>${instructionsHtml}
    </div>`;

      case "select":
        const options = field.options
          ?.map((opt) => `        <option value="${opt.value}">${opt.label}</option>`)
          .join("\n");
        return `
    <div class="space-y-1">
      ${labelHtml}
      <select id="${field.name}" name="${field.name}" class="${inputStyles}"${requiredAttr}>
        <option value="">Select an option...</option>
${options}
      </select>${instructionsHtml}
    </div>`;

      case "checkbox":
        return `
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <input type="checkbox" id="${field.name}" name="${field.name}" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"${requiredAttr} />
        <label for="${field.name}" class="text-sm text-gray-700">${field.label}${requiredStar}</label>
      </div>${instructionsHtml}
    </div>`;

      case "radio":
        const radioOptions = field.options
          ?.map(
            (opt) => `      <div class="flex items-center gap-2">
        <input type="radio" id="${field.name}-${opt.value}" name="${field.name}" value="${opt.value}" class="border-gray-300 text-indigo-600 focus:ring-indigo-500"${requiredAttr} />
        <label for="${field.name}-${opt.value}" class="text-sm text-gray-700">${opt.label}</label>
      </div>`
          )
          .join("\n");
        return `
    <fieldset class="space-y-2">
      <legend class="${EXPORT_LABEL_STYLES}">${field.label}${requiredStar}</legend>
${radioOptions}${instructionsHtml}
    </fieldset>`;

      case "hidden":
        return `
    <input type="hidden" name="${field.name}" value="${field.defaultValue || ""}" />`;

      case "date":
        return `
    <div class="space-y-1">
      ${labelHtml}
      <input type="date" id="${field.name}" name="${field.name}" class="${inputStyles}"${requiredAttr} />${instructionsHtml}
    </div>`;

      case "file":
        return `
    <div class="space-y-1">
      ${labelHtml}
      <input type="file" id="${field.name}" name="${field.name}" accept="${field.accept || "*/*"}" class="${inputStyles} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"${requiredAttr} />${instructionsHtml}
    </div>`;

      case "name":
        return `
    <div class="space-y-1">
      ${labelHtml}
      <div class="grid grid-cols-2 gap-4">
        <input type="text" id="${field.name}-first" name="${field.name}_first" placeholder="First name" class="${inputStyles}"${requiredAttr} />
        <input type="text" id="${field.name}-last" name="${field.name}_last" placeholder="Last name" class="${inputStyles}"${requiredAttr} />
      </div>${instructionsHtml}
    </div>`;

      case "address":
        let addressHtml = `
    <div class="space-y-3">
      ${labelHtml}
      <input type="text" id="${field.name}-street" name="${field.name}_street" placeholder="Street address" class="${inputStyles}"${requiredAttr} />`;

        if (field.includeAddress2) {
          addressHtml += `
      <input type="text" id="${field.name}-street2" name="${field.name}_street2" placeholder="Apartment, suite, etc. (optional)" class="${inputStyles}" />`;
        }

        addressHtml += `
      <div class="grid grid-cols-6 gap-4">
        <input type="text" id="${field.name}-city" name="${field.name}_city" placeholder="City" class="${inputStyles} col-span-2"${requiredAttr} />
        <input type="text" id="${field.name}-state" name="${field.name}_state" placeholder="State" class="${inputStyles} col-span-2"${requiredAttr} />
        <input type="text" id="${field.name}-zip" name="${field.name}_zip" placeholder="ZIP" class="${inputStyles} col-span-2"${requiredAttr} />
      </div>`;

        if (field.includeCountry) {
          addressHtml += `
      <input type="text" id="${field.name}-country" name="${field.name}_country" placeholder="Country" class="${inputStyles}"${requiredAttr} />`;
        }

        addressHtml += instructionsHtml + `
    </div>`;
        return addressHtml;

      case "utm":
        return `
    <!-- UTM Parameters (auto-populated from URL) -->
    <input type="hidden" name="utm_source" id="utm_source" />
    <input type="hidden" name="utm_medium" id="utm_medium" />
    <input type="hidden" name="utm_campaign" id="utm_campaign" />
    <input type="hidden" name="utm_term" id="utm_term" />
    <input type="hidden" name="utm_content" id="utm_content" />`;

      default:
        return "";
    }
  };

  const fieldsHtml = fields.map(renderField).join("\n");
  const hasUtmFields = fields.some((f) => f.type === "utm");

  const utmScript = hasUtmFields ? `
  <script>
    // Populate UTM parameters from URL
    (function() {
      const params = new URLSearchParams(window.location.search);
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function(param) {
        const input = document.getElementById(param);
        if (input && params.get(param)) {
          input.value = params.get(param);
        }
      });
    })();
  </script>` : "";

  if (config.submitType === "ajax") {
    return `<form id="contact-form" class="space-y-6">
${fieldsHtml}

    <div>
      <button type="submit" class="${EXPORT_BUTTON_STYLES}">${config.submitButtonText}</button>
    </div>
  </form>

  <div id="success-message" class="hidden p-4 bg-green-100 text-green-800 rounded-md">
    ${config.successMessage}
  </div>

  <script>
    document.getElementById('contact-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);

      try {
        const response = await fetch('${config.action}', {
          method: '${config.method}',
          body: formData
        });

        if (response.ok) {
          form.style.display = 'none';
          document.getElementById('success-message').classList.remove('hidden');
        } else {
          alert('Something went wrong. Please try again.');
        }
      } catch (error) {
        alert('Something went wrong. Please try again.');
      }
    });
  </script>${utmScript}`;
  }

  return `<form action="${config.action}" method="${config.method}" class="space-y-6">
${fieldsHtml}

    <div>
      <button type="submit" class="${EXPORT_BUTTON_STYLES}">${config.submitButtonText}</button>
    </div>
  </form>${utmScript}`;
}
