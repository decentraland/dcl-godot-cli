# Decentraland Godot CLI

## Requirement

It only works on Linux, it requires Xvfb installed.

### Running

```bash
  npm run build && node dist/index.js bafkreiagiqh6hej6dpr3shqsob54jcdec5mhbtrpvxnpi3dqovzsfmitke
  docker run -it --rm --network=host -v ./avatars.json:/app/avatars.json quay.io/decentraland/godot-explorer:f99a1ed32ab1cc7d7bb30c0f5ccf36b4840b4901
```
