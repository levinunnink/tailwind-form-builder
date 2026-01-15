import { FormTemplate } from './types';

export const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Form',
    description: 'Start from scratch with an empty form',
    fields: [],
  },
  {
    id: 'contact',
    name: 'Contact Form',
    description: 'A simple contact form with name, email, and message',
    fields: [
      {
        type: 'name',
        label: 'Your Name',
        name: 'name',
        placeholder: 'John Doe',
        validation: [{ type: 'required', message: 'Name is required' }],
      },
      {
        type: 'email',
        label: 'Email Address',
        name: 'email',
        placeholder: 'you@example.com',
        validation: [{ type: 'required', message: 'Email is required' }],
      },
      {
        type: 'textarea',
        label: 'Message',
        name: 'message',
        placeholder: 'How can we help you?',
        validation: [{ type: 'required', message: 'Message is required' }],
      },
    ],
  },
  {
    id: 'mailing-list',
    name: 'Mailing List',
    description: 'Collect email addresses for your newsletter',
    fields: [
      {
        type: 'text',
        label: 'First Name',
        name: 'firstName',
        placeholder: 'John',
        validation: [],
      },
      {
        type: 'email',
        label: 'Email Address',
        name: 'email',
        placeholder: 'you@example.com',
        validation: [{ type: 'required', message: 'Email is required' }],
      },
    ],
  },
  {
    id: 'survey',
    name: 'Survey',
    description: 'Gather feedback with multiple choice questions',
    fields: [
      {
        type: 'radio',
        label: 'How did you hear about us?',
        name: 'referral',
        validation: [{ type: 'required', message: 'Please select an option' }],
        options: [
          { label: 'Search Engine', value: 'search' },
          { label: 'Social Media', value: 'social' },
          { label: 'Friend or Colleague', value: 'friend' },
          { label: 'Other', value: 'other' },
        ],
      },
      {
        type: 'select',
        label: 'How would you rate your experience?',
        name: 'rating',
        validation: [{ type: 'required', message: 'Please select a rating' }],
        options: [
          { label: 'Excellent', value: '5' },
          { label: 'Good', value: '4' },
          { label: 'Average', value: '3' },
          { label: 'Below Average', value: '2' },
          { label: 'Poor', value: '1' },
        ],
      },
      {
        type: 'textarea',
        label: 'Additional Comments',
        name: 'comments',
        placeholder: 'Share your thoughts...',
        validation: [],
      },
    ],
  },
  {
    id: 'registration',
    name: 'Registration Form',
    description: 'User registration with name, email, and phone',
    fields: [
      {
        type: 'name',
        label: 'Full Name',
        name: 'fullName',
        validation: [{ type: 'required', message: 'Name is required' }],
      },
      {
        type: 'email',
        label: 'Email Address',
        name: 'email',
        placeholder: 'you@example.com',
        validation: [{ type: 'required', message: 'Email is required' }],
      },
      {
        type: 'phone',
        label: 'Phone Number',
        name: 'phone',
        placeholder: '(555) 123-4567',
        validation: [],
      },
      {
        type: 'checkbox',
        label: 'I agree to the terms and conditions',
        name: 'terms',
        validation: [{ type: 'required', message: 'You must agree to the terms' }],
      },
    ],
  },
  {
    id: 'feedback',
    name: 'Feedback Form',
    description: 'Collect product or service feedback',
    fields: [
      {
        type: 'email',
        label: 'Your Email (optional)',
        name: 'email',
        placeholder: 'you@example.com',
        validation: [],
      },
      {
        type: 'select',
        label: 'What are you providing feedback about?',
        name: 'topic',
        validation: [{ type: 'required', message: 'Please select a topic' }],
        options: [
          { label: 'Product', value: 'product' },
          { label: 'Service', value: 'service' },
          { label: 'Website', value: 'website' },
          { label: 'Support', value: 'support' },
          { label: 'Other', value: 'other' },
        ],
      },
      {
        type: 'textarea',
        label: 'Your Feedback',
        name: 'feedback',
        placeholder: 'Tell us what you think...',
        validation: [{ type: 'required', message: 'Please provide your feedback' }],
      },
    ],
  },
];
