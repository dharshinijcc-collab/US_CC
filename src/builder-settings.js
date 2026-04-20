import { builder, Builder } from '@builder.io/react';

// Securely initialize Builder with your Public API Key
const BUILDER_API_KEY = process.env.REACT_APP_BUILDER_PUBLIC_KEY || 'YOUR_PUBLIC_API_KEY';
builder.init(BUILDER_API_KEY);


// Custom Components registration
// This allows your CEO to drag and drop these sections in the Builder.io editor

Builder.registerComponent(({ title, description, children }) => (
  <div className="sys-card cc-shine">
    <div className="card-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    </div>
    <h4 className="card-title">{title}</h4>
    <p className="card-description">{description}</p>
    {children}
  </div>
), {
  name: 'System Card',
  inputs: [
    { name: 'title', type: 'string', defaultValue: 'New Title' },
    { name: 'description', type: 'longText', defaultValue: 'Enter description here...' },
  ],
});

Builder.registerComponent(({ children }) => (
  <section className="section-light">
    <div className="section-container">
      {children}
    </div>
  </section>
), {
  name: 'Section Container',
  inputs: [
    { name: 'children', type: 'ui-blocks' },
  ],
});
