# The 3D companion, parked

`raccoon-detective.glb` is the same detective as the hero photograph, modelled:
glTF 2.0, roughly 1.40 MB, 51,284 triangles, Y up, facing +Z, scene scale in
metres. It carries one six-second `Curious idle` clip on the head and magnifier
nodes; the feet and bin stay put.

Nothing in the site loads it. It lives here rather than in `public/` on purpose
— `public/` is copied verbatim into the static export, so a file parked there
would be deployed on every build for something no page ever fetches.

Using it means a WebGL viewer, an image fallback for when the context will not
initialise, a reduced-motion guard on the idle, and keeping every piece of real
content outside the canvas. That is a deliberate second pass, not a swap of the
`<img>` in `components/detective/SpecimenCard.tsx`.
