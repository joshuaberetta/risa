// Content files are turned into data by the Vite plugin in vite.config.ts.
declare module '*.yml' {
  const data: Record<string, unknown>;
  export default data;
}

declare module 'virtual:codebook' {
  const codebook: {
    version: string;
    tables: { id: string; title: string; group: string; columns: string[]; rows: string[][] }[];
  };
  export default codebook;
}
