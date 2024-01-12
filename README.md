# Decentraland Godot CLI

## Requirement

It only works on Linux, it requires Xvfb installed.

### Running


```bash
  npm run build && node dist/index.js
  docker run -it --rm --network=host -v ./input.json:/app/avatars.json quay.io/decentraland/godot-explorer:f99a1ed32ab1cc7d7bb30c0f5ccf36b4840b4901
```
