# Cloud CNC
Core monorepo

## Core Packages
* [Command relay](packages/relay)
* [API server](packages/server)
* [User interface](packages/ui)

## Auxillary Packages
* [API specifications](packages/api)
* [Human-centric search language](packages/search)

### FAQ
* Q: Why does this use both [`tsc-alias`](https://github.com/justkey007/tsc-alias) and
  [`tsconfig-paths`](https://github.com/dividab/tsconfig-paths)?
* A: `tsc-alias` runs at compile-time for production builds, while `tsconfig-paths` runs at runtime
  for debugging and testing.