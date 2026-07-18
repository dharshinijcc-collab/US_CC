// Global type declarations for the project
// Allows TypeScript to accept .css files as side-effect imports from anywhere
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
