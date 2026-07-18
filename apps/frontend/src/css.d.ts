// Global type declaration for CSS module side-effect imports
// This tells TypeScript that .css files are valid imports
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
