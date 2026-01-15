# Tailwind Form Builder

A free, visual form builder for creating Tailwind CSS forms. Build your forms with drag-and-drop, customize styling, and export clean code for HTML, React, or Vue.

**No login required. No data stored. Just build and export.**

## Features

- **Visual Form Builder** - Drag and drop fields to create your form layout
- **Multiple Field Types** - Text, email, phone, date, select, checkbox, radio, file upload, and more
- **Compound Fields** - Pre-built name and address fields with proper structure
- **Theme Options** - Choose from Default, Simple, Underline, or Solid input styles
- **Field Spacing Control** - Tight, Default, or Wide spacing presets
- **Dark Mode Support** - Preview your forms in light or dark mode
- **Multi-Format Export** - Export to HTML, React (JSX), or Vue (Composition API)
- **Copy to Clipboard** - One-click copy of generated code
- **Responsive Preview** - See how your form looks in real-time

## Field Types

### Basic Fields
- Text Input
- Paragraph (Textarea)
- Number
- Dropdown (Select)
- Checkbox
- Multi Choice (Radio)
- Hidden

### Advanced Fields
- Email
- Phone
- Date
- URL
- File Upload
- Name (First/Last)
- Address (Street, City, State, Zip)

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/levinunnink/tailwind-form-builder.git
cd tailwind-form-builder

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start building forms.

### Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS
- [@tailwindcss/forms](https://github.com/tailwindlabs/tailwindcss-forms) - Form styling plugin
- [@dnd-kit](https://dndkit.com/) - Drag and drop
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [Prism React Renderer](https://github.com/FormidableLabs/prism-react-renderer) - Syntax highlighting

## Usage

1. **Add Fields** - Click on field types in the right sidebar to add them to your form
2. **Configure Fields** - Click on any field to open the editor and customize label, placeholder, validation, etc.
3. **Reorder Fields** - Drag fields to rearrange their order
4. **Adjust Settings** - Click "Form Settings" to configure form action, method, theme, and spacing
5. **Export Code** - Click "Export Code" to get your form in HTML, React, or Vue format

## Export Formats

### HTML
Clean, semantic HTML with Tailwind classes. Ready to drop into any project.

### React
Functional component with useState hooks and form handling. TypeScript-friendly.

### Vue
Composition API with ref() for reactive form data. Vue 3 compatible.

## Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

## Sponsors

This project is sponsored by:

- [Sheet Monkey](https://sheetmonkey.io) - Save form submissions to Google Sheets
- [Smmall](https://smmall.io) - Simple website builder

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with Next.js and Tailwind CSS
