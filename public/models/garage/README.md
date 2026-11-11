# Garage models

These models belong to their original artists and are licensed under [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/). Credit the artist, link the source and license, and indicate the changes whenever the models are displayed publicly. The website should expose these credits in the garage's asset credits.

| Local file | Model | Artist | Original source | Bytes |
| --- | --- | --- | --- | ---: |
| `mazda-rx-7-fd.glb` | Mazda RX-7 FD | [Lexyc16](https://sketchfab.com/Lexyc16) | [Sketchfab](https://sketchfab.com/3d-models/mazda-rx-7-fd-d35ff630df614771b82e7b2f59035b1e) | 3,941,268 |
| `nissan-skyline-r34.glb` | Nissan Skyline R34 GT-R | [Lexyc16](https://sketchfab.com/Lexyc16) | [Sketchfab](https://sketchfab.com/3d-models/nissan-skyline-r34-gt-r-ff8fb2251dfa4bb9979e7022c5a6666c) | 3,060,072 |
| `toyota-supra-mk.glb` | Toyota Supra MK IV (1994) | Martin Trafas | [Sketchfab](https://sketchfab.com/3d-models/toyota-supra-mk-iv-1994-eb9bb1eb41db431cb078088ae1ce45f8) | 10,697,472 |

Downloaded from the public [pedrosoandre/carros catalog](https://github.com/pedrosoandre/carros/tree/main/assets). The catalog author optimized geometry using weld, simplify, prune, and meshopt compression; see its [processing and license record](https://github.com/pedrosoandre/carros/blob/main/LICENSE-3D-MODELS.md). Original artist and license metadata are also embedded in each GLB's `asset.extras`. The original Sketchfab public metadata API confirmed each artist and CC BY 4.0 license at acquisition.

The website normalizes scale and position for display. All three models retain their original front +Z orientation, confirmed in the rendered workshop. At runtime, the named body paint material is cloned and its roughness, metallic response and clearcoat are adjusted for workshop reflections. Geometry and texture files remain unchanged. These display changes are also disclosed in the in-page credits.

All files are binary glTF 2.0 with embedded image data (RX-7: six images, Skyline: six, Supra: 26). There are no external texture or buffer URLs. All require `EXT_meshopt_compression` and `KHR_mesh_quantization`; use Three.js `GLTFLoader` with `MeshoptDecoder`, or Drei `useGLTF` with its default meshopt support. Draco and KTX2 are not needed. Optional material extensions include clearcoat, transmission, specular, and emissive strength, handled by the installed Three.js loader.

All models are Y-up, with length along Z. Use `new Box3().setFromObject(scene, true)` for precise bounds before centering and scaling. Non-precise transformed bounding boxes overestimate the RX-7's height. Original precise sizes in author units:

| Model | X | Y | Z | Minimum Y | Yaw for front +Z |
| --- | ---: | ---: | ---: | ---: | ---: |
| RX-7 | 1.24695 | 0.85364 | 2.88439 | -1.15966 | 0 |
| Skyline | 1.36734 | 0.97317 | 3.34032 | 0.26562 | 0 |
| Supra | 1.95696 | 1.27031 | 4.51290 | -0.01104 | 0 |

`attribution.json` provides a combined machine-readable manifest. Per-file `*.source.json` preserves attribution and original description evidence. No Mitsubishi model was downloaded: available exact candidates required an authenticated download, had unclear provenance, or were not suitable for this scene. The existing five-car content data was not changed.
