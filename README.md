# apaar-scene-assets

Static assets for the 3D UNext office shown on the APAAR Document Desk login and dashboard, served through jsDelivr:

```
https://cdn.jsdelivr.net/gh/msamar25/apaar-scene-assets@v1.0.0/office-scene.js
https://cdn.jsdelivr.net/gh/msamar25/apaar-scene-assets@v1.0.0/models/{approver,team1,team2}.glb
```

- `office-scene.js` — ES module; imports `three` and `three/addons/` through the host page's import map (three@0.184.0 from jsDelivr).
- `models/*.glb` — Mixamo characters with their clips (approver: typing, disappointed, phone · team1: typing, disappointed, cheer · team2: typing, clap, disappointed). Meshopt-compressed, WebP textures.

Built from the private app repo (`web/scene-assets`, `tools/scene`). Tags are immutable on jsDelivr — publish changes as a new tag.
