// Compatibility bridge while the V2 codebase migrates from React Flow 11 to XYFlow 12.
// Keeping this bridge lets existing store/node imports continue to work while the
// editor uses the current package and avoids the React 19 snapshot issues seen with
// the older React Flow integration.
export * from '@xyflow/react'
