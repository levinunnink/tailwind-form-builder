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

export function generateVue(fields: FormField[], config: FormConfig): string {
  const inputStyles = stripDarkClasses(EXPORT_THEME_STYLES[config.theme], config.darkMode);
  const EXPORT_LABEL_STYLES = config.darkMode ? EXPORT_LABEL_STYLES_DARK : EXPORT_LABEL_STYLES_LIGHT;
  const EXPORT_INSTRUCTIONS_STYLES = config.darkMode ? EXPORT_INSTRUCTIONS_STYLES_DARK : EXPORT_INSTRUCTIONS_STYLES_LIGHT;
  const EXPORT_BUTTON_STYLES = config.darkMode ? EXPORT_BUTTON_STYLES_DARK : EXPORT_BUTTON_STYLES_LIGHT;

  // Check if UTM fields are present
  const hasUtmFields = fields.some((f) => f.type === "utm");

  // Generate form data refs
  const formDataRefs: string[] = [];
  fields.forEach((field) => {
    if (field.type === "name") {
      formDataRefs.push(`const ${field.name}_first = ref('')`);
      formDataRefs.push(`const ${field.name}_last = ref('')`);
    } else if (field.type === "address") {
      formDataRefs.push(`const ${field.name}_street = ref('')`);
      if (field.includeAddress2) formDataRefs.push(`const ${field.name}_street2 = ref('')`);
      formDataRefs.push(`const ${field.name}_city = ref('')`);
      formDataRefs.push(`const ${field.name}_state = ref('')`);
      formDataRefs.push(`const ${field.name}_zip = ref('')`);
      if (field.includeCountry) formDataRefs.push(`const ${field.name}_country = ref('')`);
    } else if (field.type === "utm") {
      formDataRefs.push(`const utm_source = ref('')`);
      formDataRefs.push(`const utm_medium = ref('')`);
      formDataRefs.push(`const utm_campaign = ref('')`);
      formDataRefs.push(`const utm_term = ref('')`);
      formDataRefs.push(`const utm_content = ref('')`);
    } else if (field.type !== "file") {
      formDataRefs.push(`const ${field.name} = ref('${field.defaultValue || ""}')`);
    }
  });

  // Generate onMounted hook for UTM params
  const utmOnMounted = hasUtmFields ? `
onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
  utmParams.forEach(param => {
    const value = params.get(param)
    if (value) {
      switch(param) {
        case 'utm_source': utm_source.value = value; break
        case 'utm_medium': utm_medium.value = value; break
        case 'utm_campaign': utm_campaign.value = value; break
        case 'utm_term': utm_term.value = value; break
        case 'utm_content': utm_content.value = value; break
      }
    }
  })
})
` : "";

  const renderField = (field: FormField): string => {
    const isRequired = field.validation.some((v) => v.type === "required");
    const requiredAttr = isRequired ? "\n        required" : "";
    const requiredStar = isRequired ? '<span class="text-red-500 ml-1">*</span>' : "";

    const getValidationAttrs = (): string => {
      let attrs = "";
      const minLength = field.validation.find((v) => v.type === "minLength");
      const maxLength = field.validation.find((v) => v.type === "maxLength");
      const min = field.validation.find((v) => v.type === "min");
      const max = field.validation.find((v) => v.type === "max");
      const corporateDomain = field.validation.find((v) => v.type === "corporateDomain");

      if (minLength) attrs += `\n        minlength="${minLength.value}"`;
      if (maxLength) attrs += `\n        maxlength="${maxLength.value}"`;
      if (min) attrs += `\n        min="${min.value}"`;
      if (max) attrs += `\n        max="${max.value}"`;
      if (corporateDomain) attrs += `\n        pattern=".*${corporateDomain.value}$"`;

      return attrs;
    };

    switch (field.type) {
      case "text":
      case "email":
      case "url":
        return `      <div class="space-y-1">
        <label for="${field.name}" class="${EXPORT_LABEL_STYLES}">${field.label}${requiredStar}</label>
        <input
          type="${field.type}"
          id="${field.name}"
          name="${field.name}"
          placeholder="${field.placeholder || ""}"
          class="${inputStyles}"
          v-model="${field.name}"${requiredAttr}${getValidationAttrs()}
        />
        ${field.instructions ? `<p class="${EXPORT_INSTRUCTIONS_STYLES}">${field.instructions}</p>` : ""}
      </div>`;

      case "phone":
        return `      <div class="space-y-1">
        <label for="${field.name}" class="${EXPORT_LABEL_STYLES}">${field.label}${requiredStar}</label>
        <input
          type="tel"
          id="${field.name}"
          name="${field.name}"
          placeholder="${field.placeholder || ""}"
          class="${inputStyles}"
          v-model="${field.name}"${requiredAttr}${getValidationAttrs()}
        />
        ${field.instructions ? `<p class="${EXPORT_INSTRUCTIONS_STYLES}">${field.instructions}</p>` : ""}
      </div>`;

      case "number":
        return `      <div class="space-y-1">
        <label for="${field.name}" class="${EXPORT_LABEL_STYLES}">${field.label}${requiredStar}</label>
        <input
          type="number"
          id="${field.name}"
          name="${field.name}"
          placeholder="${field.placeholder || ""}"
          class="${inputStyles}"
          v-model="${field.name}"${requiredAttr}${getValidationAttrs()}
        />
        ${field.instructions ? `<p class="${EXPORT_INSTRUCTIONS_STYLES}">${field.instructions}</p>` : ""}
      </div>`;

      case "textarea":
        return `      <div class="space-y-1">
        <label for="${field.name}" class="${EXPORT_LABEL_STYLES}">${field.label}${requiredStar}</label>
        <textarea
          id="${field.name}"
          name="${field.name}"
          placeholder="${field.placeholder || ""}"
          rows="4"
          class="${inputStyles}"
          v-model="${field.name}"${requiredAttr}${getValidationAttrs()}
        ></textarea>
        ${field.instructions ? `<p class="${EXPORT_INSTRUCTIONS_STYLES}">${field.instructions}</p>` : ""}
      </div>`;

      case "select":
        const options = field.options
          ?.map((opt) => `          <option value="${opt.value}">${opt.label}</option>`)
          .join("\n");
        return `      <div class="space-y-1">
        <label for="${field.name}" class="${EXPORT_LABEL_STYLES}">${field.label}${requiredStar}</label>
        <select
          id="${field.name}"
          name="${field.name}"
          class="${inputStyles}"
          v-model="${field.name}"${requiredAttr}
        >
          <option value="">Select an option...</option>
${options}
        </select>
        ${field.instructions ? `<p class="${EXPORT_INSTRUCTIONS_STYLES}">${field.instructions}</p>` : ""}
      </div>`;

      case "checkbox":
        return `      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            id="${field.name}"
            name="${field.name}"
            class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            v-model="${field.name}"${requiredAttr}
          />
          <label for="${field.name}" class="text-sm text-gray-700">${field.label}${requiredStar}</label>
        </div>
        ${field.instructions ? `<p class="${EXPORT_INSTRUCTIONS_STYLES}">${field.instructions}</p>` : ""}
      </div>`;

      case "radio":
        const radioOptions = field.options
          ?.map(
            (opt) => `        <div class="flex items-center gap-2">
          <input
            type="radio"
            id="${field.name}-${opt.value}"
            name="${field.name}"
            value="${opt.value}"
            class="border-gray-300 text-indigo-600 focus:ring-indigo-500"
            v-model="${field.name}"${requiredAttr}
          />
          <label for="${field.name}-${opt.value}" class="text-sm text-gray-700">${opt.label}</label>
        </div>`
          )
          .join("\n");
        return `      <fieldset class="space-y-2">
        <legend class="${EXPORT_LABEL_STYLES}">${field.label}${requiredStar}</legend>
${radioOptions}
        ${field.instructions ? `<p class="${EXPORT_INSTRUCTIONS_STYLES}">${field.instructions}</p>` : ""}
      </fieldset>`;

      case "hidden":
        return `      <input type="hidden" name="${field.name}" :value="${field.name}" />`;

      case "date":
        return `      <div class="space-y-1">
        <label for="${field.name}" class="${EXPORT_LABEL_STYLES}">${field.label}${requiredStar}</label>
        <input
          type="date"
          id="${field.name}"
          name="${field.name}"
          class="${inputStyles}"
          v-model="${field.name}"${requiredAttr}
        />
        ${field.instructions ? `<p class="${EXPORT_INSTRUCTIONS_STYLES}">${field.instructions}</p>` : ""}
      </div>`;

      case "file":
        return `      <div class="space-y-1">
        <label for="${field.name}" class="${EXPORT_LABEL_STYLES}">${field.label}${requiredStar}</label>
        <input
          type="file"
          id="${field.name}"
          name="${field.name}"
          accept="${field.accept || "*/*"}"
          class="${inputStyles} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
          @change="(e) => ${field.name} = e.target.files?.[0]"${requiredAttr}
        />
        ${field.instructions ? `<p class="${EXPORT_INSTRUCTIONS_STYLES}">${field.instructions}</p>` : ""}
      </div>`;

      case "name":
        return `      <div class="space-y-1">
        <label class="${EXPORT_LABEL_STYLES}">${field.label}${requiredStar}</label>
        <div class="grid grid-cols-2 gap-4">
          <input
            type="text"
            id="${field.name}-first"
            name="${field.name}_first"
            placeholder="First name"
            class="${inputStyles}"
            v-model="${field.name}_first"${requiredAttr}
          />
          <input
            type="text"
            id="${field.name}-last"
            name="${field.name}_last"
            placeholder="Last name"
            class="${inputStyles}"
            v-model="${field.name}_last"${requiredAttr}
          />
        </div>
        ${field.instructions ? `<p class="${EXPORT_INSTRUCTIONS_STYLES}">${field.instructions}</p>` : ""}
      </div>`;

      case "address":
        let addressTemplate = `      <div class="space-y-3">
        <label class="${EXPORT_LABEL_STYLES}">${field.label}${requiredStar}</label>
        <input
          type="text"
          id="${field.name}-street"
          name="${field.name}_street"
          placeholder="Street address"
          class="${inputStyles}"
          v-model="${field.name}_street"${requiredAttr}
        />`;

        if (field.includeAddress2) {
          addressTemplate += `
        <input
          type="text"
          id="${field.name}-street2"
          name="${field.name}_street2"
          placeholder="Apartment, suite, etc. (optional)"
          class="${inputStyles}"
          v-model="${field.name}_street2"
        />`;
        }

        addressTemplate += `
        <div class="grid grid-cols-6 gap-4">
          <input
            type="text"
            id="${field.name}-city"
            name="${field.name}_city"
            placeholder="City"
            class="${inputStyles} col-span-2"
            v-model="${field.name}_city"${requiredAttr}
          />
          <input
            type="text"
            id="${field.name}-state"
            name="${field.name}_state"
            placeholder="State"
            class="${inputStyles} col-span-2"
            v-model="${field.name}_state"${requiredAttr}
          />
          <input
            type="text"
            id="${field.name}-zip"
            name="${field.name}_zip"
            placeholder="ZIP"
            class="${inputStyles} col-span-2"
            v-model="${field.name}_zip"${requiredAttr}
          />
        </div>`;

        if (field.includeCountry) {
          addressTemplate += `
        <input
          type="text"
          id="${field.name}-country"
          name="${field.name}_country"
          placeholder="Country"
          class="${inputStyles}"
          v-model="${field.name}_country"${requiredAttr}
        />`;
        }

        addressTemplate += `
        ${field.instructions ? `<p class="${EXPORT_INSTRUCTIONS_STYLES}">${field.instructions}</p>` : ""}
      </div>`;
        return addressTemplate;

      case "utm":
        return `      <!-- UTM Parameters (auto-populated from URL) -->
      <input type="hidden" name="utm_source" :value="utm_source" />
      <input type="hidden" name="utm_medium" :value="utm_medium" />
      <input type="hidden" name="utm_campaign" :value="utm_campaign" />
      <input type="hidden" name="utm_term" :value="utm_term" />
      <input type="hidden" name="utm_content" :value="utm_content" />`;

      default:
        return "";
    }
  };

  const fieldsTemplate = fields.map(renderField).join("\n\n");

  if (config.submitType === "ajax") {
    return `<script setup>
import { ref${hasUtmFields ? ", onMounted" : ""} } from 'vue'

${formDataRefs.join("\n")}
const isSubmitted = ref(false)
const isLoading = ref(false)
${utmOnMounted}

const handleSubmit = async () => {
  isLoading.value = true

  try {
    const formData = {
      ${fields
        .filter((f) => f.type !== "file" && f.type !== "utm")
        .map((f) => {
          if (f.type === "name") {
            return `${f.name}_first: ${f.name}_first.value,\n      ${f.name}_last: ${f.name}_last.value`;
          } else if (f.type === "address") {
            let props = [`${f.name}_street: ${f.name}_street.value`];
            if (f.includeAddress2) props.push(`${f.name}_street2: ${f.name}_street2.value`);
            props.push(`${f.name}_city: ${f.name}_city.value`);
            props.push(`${f.name}_state: ${f.name}_state.value`);
            props.push(`${f.name}_zip: ${f.name}_zip.value`);
            if (f.includeCountry) props.push(`${f.name}_country: ${f.name}_country.value`);
            return props.join(",\n      ");
          }
          return `${f.name}: ${f.name}.value`;
        })
        .join(",\n      ")}${hasUtmFields ? `,
      utm_source: utm_source.value,
      utm_medium: utm_medium.value,
      utm_campaign: utm_campaign.value,
      utm_term: utm_term.value,
      utm_content: utm_content.value` : ""}
    }

    const response = await fetch('${config.action}', {
      method: '${config.method}',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      isSubmitted.value = true
    } else {
      alert('Something went wrong. Please try again.')
    }
  } catch (error) {
    alert('Something went wrong. Please try again.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div v-if="isSubmitted" class="p-4 bg-green-100 text-green-800 rounded-md">
    ${config.successMessage}
  </div>

  <form v-else @submit.prevent="handleSubmit" class="space-y-6">
${fieldsTemplate}

      <div>
        <button
          type="submit"
          :disabled="isLoading"
          class="${EXPORT_BUTTON_STYLES} disabled:opacity-50"
        >
          {{ isLoading ? 'Submitting...' : '${config.submitButtonText}' }}
        </button>
      </div>
  </form>
</template>`;
  }

  return `<script setup>
import { ref${hasUtmFields ? ", onMounted" : ""} } from 'vue'

${formDataRefs.join("\n")}
${utmOnMounted}</script>

<template>
  <form action="${config.action}" method="${config.method}" class="space-y-6">
${fieldsTemplate}

      <div>
        <button type="submit" class="${EXPORT_BUTTON_STYLES}">
          ${config.submitButtonText}
        </button>
      </div>
  </form>
</template>`;
}
