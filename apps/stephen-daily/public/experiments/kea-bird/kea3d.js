/* eslint-disable -- Vendored Alex Wang renderer; see README.md. */
// The kea's head as a 3D object wrapped in the painting itself.
// The painted head's outline is inflated into a solid (see map()), and the painting is projected
// onto it from the viewer, so at rest the render is the painting pixel for pixel; when the head
// turns, the real brush strokes turn with it. Bare-paper parts of the head (face, eye ring) are
// solid paper, and rays composite front to back through the gaps between crest feathers.
// The rest of the bird is the painting itself, with the head removed (plate.webp). The plate is bare
// wherever the resting head covers it, so nothing is left hanging behind a turned head; what showed
// through the head's fade across the seam is baked into head.webp. Behind the head a neck joins it to the
// body once it turns, taking a share of the turn so it bends and twists instead of tearing (see
// neckSpace()), painted with the plate as it was before the erasing (neck.webp).
window.mountKea3D = function mountKea3D(
	container,
	{
		plate = '/images/kea/plate.webp',
		head = '/images/kea/head.webp',
		fill = '/images/kea/head-fill.webp',
		solid = '/images/kea/head-solid.webp',
		neck = '/images/kea/neck.webp',
		onFail,
	} = {}
) {
	// Painting-pixel rectangles: the canvas (room for the head to turn) and the head textures
	const VIEW = { x: 770, y: 420, w: 700, h: 520 }
	const TEX = { x: 862, y: 427, w: 440, h: 441 }

	const canvas = document.createElement('canvas')
	canvas.className = 'c-kea3d__canvas'
	Object.assign(canvas.style, {
		position: 'absolute',
		pointerEvents: 'none',
		visibility: 'hidden',
		left: `${(100 * VIEW.x) / 2048}%`,
		top: `${(100 * VIEW.y) / 2048}%`,
		width: `${(100 * VIEW.w) / 2048}%`,
		height: `${(100 * VIEW.h) / 2048}%`,
	})
	const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, antialias: false })
	if (!gl) return onFail && onFail('no webgl2')

	const vs = `#version 300 es
    in vec2 aPos; void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`

	const fs = `#version 300 es
    precision highp float;
    uniform vec2 uRes;
    uniform vec4 uView, uTex;
    uniform mat3 uHeadInv;                  // undoes the head's turn
    uniform vec4 uSwing;                    // the same turn as a swing that bends the neck (axis, angle)
    uniform float uTwist;                   // after a twist about the neck itself (angle)
    uniform vec3 uPaper;
    uniform float uTurn, uBlink;
    uniform sampler2D uHead, uFill, uSolid, uNeck;
    out vec4 frag;

    // Painting pixels (y down) to world units (y up, z toward the viewer)
    #define PP(x, y, z) vec3(((x) - 1200.) / 1000., (1000. - (y)) / 1000., (z) / 1000.)
    const vec3 PIVOT = PP(1112., 772., 0.);
    const vec4 NECK_TEX = vec4(710., 360., 820., 640.);   // neck.webp's rectangle, painting px
    // The painted head ends at a straight seam across the neck. NECK points up the neck, across the seam;
    // SIDE runs along the seam, from throat to nape.
    const vec3 SEAM = PP(870., 846., 0.), NECK = normalize(vec3(-.3205, .9473, 0.)), SIDE = vec3(NECK.y, -NECK.x, 0.);
    // The head turns rigidly. Below the seam the neck takes a shrinking share of the turn, down to none
    // NECK_LEN px below it, so its skin twists and stretches between head and body instead of tearing.
    const float NECK_LEN = 90.;
    float seamPx(vec3 q) { return dot(q - SEAM, NECK) * 1000.; }
    float share(float s) { return smoothstep(-NECK_LEN, 0., s); }
    vec3 rot(vec3 v, vec3 k, float a) {
        float c = cos(a), s = sin(a);
        return v * c + cross(k, v) * s + k * dot(k, v) * (1. - c);
    }
    vec3 headSpace(vec3 p) { return uHeadInv * (p - PIVOT) + PIVOT; }

    // The rest position of a point on the neck. The neck takes its share of both the twist and the swing.
    // Twisting about the neck's own axis keeps each point's height on the neck, so it undoes exactly;
    // the swing moves points up and down the neck, so solve swing = uSwing.w * share(rest(swing)) by
    // bisection. Twisting about any other axis (a turn about the vertical, say) would fold the neck.
    // Sets how far the point was twisted.
    float gTwist;
    vec3 neckSpace(vec3 p) {
        vec3 v = p - PIVOT, k = uSwing.xyz;
        float b = uSwing.w;
        // The swing axis is square to the neck, so swinging p back by a leaves it this high on the neck
        float A = dot(v, NECK) * 1000., B = dot(v, cross(k, NECK)) * 1000., s0 = seamPx(PIVOT);
        #define HEIGHT(a) (s0 + A * cos(a) + B * sin(a))
        gTwist = uTwist;
        if (HEIGHT(b) >= 0.) return PIVOT + rot(rot(v, k, -b), NECK, -uTwist);   // it turns with the head
        gTwist = 0.;
        if (seamPx(p) <= -NECK_LEN) return p;               // the body, which never moves
        float lo = 0., hi = b;
        for (int i = 0; i < 10 && b > .001; i++) {
            float m = .5 * (lo + hi);
            if (b * share(HEIGHT(m)) > m) lo = m; else hi = m;
        }
        float swing = .5 * (lo + hi);
        gTwist = uTwist * share(HEIGHT(swing));
        return PIVOT + rot(rot(v, k, -swing), NECK, -gTwist);
    }
    vec2 toTex(vec3 q) { return (vec2(q.x * 1000. + 1200., 1000. - q.y * 1000.) - uTex.xy) / uTex.zw; }

    // The head is the painted silhouette inflated into a solid. Red and blue hold the signed distance to
    // the outline (painting px, + inside); green holds the local thickness, the radius of the largest disc
    // inside the outline covering the point. Each point gets a round cross-section of that radius,
    // squashed in depth, so the skull is a dome, the beak a narrow wedge, each crest feather a quill.
    const float ASPECT = .65;
    // Distance to the outline, 16-bit (red high byte, blue low byte), interpolated by hand because
    // filtering the two bytes separately would be wrong
    float dist16(ivec2 c) {
        vec4 t = texelFetch(uFill, clamp(c, ivec2(0), ivec2(uTex.zw) - 1), 0);
        return (t.r * 65280. + t.b * 255.) / 256. - 128.;
    }
    float outline(vec2 uv) {
        vec2 st = uv * uTex.zw - .5, f = fract(st);
        ivec2 i = ivec2(floor(st));
        return mix(mix(dist16(i), dist16(i + ivec2(1, 0)), f.x), mix(dist16(i + ivec2(0, 1)), dist16(i + ivec2(1, 1)), f.x), f.y);
    }
    // Distance to the head, px, at rest position q
    float head(vec3 q) {
        vec2 uv = toTex(q);
        vec2 out2 = max(abs(uv - .5) - .5, 0.) * uTex.zw;
        float D = outline(uv) - length(out2);
        float r = max(textureLod(uFill, uv, 0.).g * 127.5, 1.);
        float Dc = clamp(D, 0., r);
        float h = ASPECT * sqrt(Dc * (2. * r - Dc));
        float z = abs(q.z) * 1000.;
        return D > 0. ? max(-D, z - h) : length(vec2(D, z));
    }
    // The neck, px at rest position q: a column as wide as the seam (220 px) and 120 deep, rising from
    // the body into the head and rounded off inside it. The painted head tapers to a sliver at the seam,
    // so without the neck a turned head shows the seam as a cut. Partway round a twist the neck fills out
    // towards round, so it keeps its width instead of pinching to its depth where it has turned side-on.
    const float NECK_R = 145.;                  // no rest point of the neck is further than this from PIVOT
    float neckDepth(float s) { float w = share(s); return 60. + 50. * abs(sin(uTwist * w)) * 4. * w * (1. - w); }
    float neck(vec3 q) {
        float s = seamPx(q);
        vec3 e = vec3(dot(q - PIVOT, SIDE) * 1000. / 110., q.z * 1000. / neckDepth(s), max(s - 20., 0.) / 40.);
        return max((length(e) - 1.) * 40., -NECK_LEN - 10. - s);
    }
    // Distance to the turned neck, px. Twist and swing turn points about PIVOT, keeping their distance to
    // it, so outside the ball holding the neck the distance to the ball is a safe step. Inside, the rest
    // distance shrinks by as much as the turn can stretch the neck within reach of p: by the steepest
    // share taken anywhere within d of its rest height.
    float neckDist(vec3 p) {
        float r = length(p - PIVOT) * 1000.;
        if (r > NECK_R + 10.) return r - NECK_R;
        vec3 q = neckSpace(p);
        float d = neck(q), s = seamPx(q);
        float t = clamp(.5, clamp((s - abs(d)) / NECK_LEN + 1., 0., 1.), clamp((s + abs(d)) / NECK_LEN + 1., 0., 1.));
        return d / (1. + r * (abs(uTwist) + uSwing.w) * 6. * t * (1. - t) / NECK_LEN);
    }
    float map(vec3 p) { return head(headSpace(p)) * .0005; }   // px to world units, with slack for the steep rim
    vec3 normal(vec3 p) {
        const vec2 k = vec2(1, -1) * .003;
        return normalize(k.xyy * map(p + k.xyy) + k.yyx * map(p + k.yyx) + k.yxy * map(p + k.yxy) + k.xxx * map(p + k.xxx));
    }

    // The painting projected onto the head: premultiplied colour and coverage at a surface point
    vec4 surface(vec3 p) {
        vec3 q = headSpace(p);
        vec2 uv = toTex(q);
        vec3 n = uTurn > 0. ? normal(p) : vec3(0, 0, 1);
        // Fixed mip level from the pixel footprint: automatic derivatives blow up at the hull's edges
        float lod = max(log2(uView.z / uRes.x), 0.);
        vec4 h = textureLod(uHead, uv, lod);
        if (uTurn > 0.) {
            // Surfaces the painting saw edge-on stretch its outline across the turned face; there, use
            // the painting with the paper gaps between strokes filled so no white seam shows
            float nz = abs((uHeadInv * n).z);
            float graze = smoothstep(.9, .35, nz) * uTurn;
            // one screen pixel covers many texels along the stretch, so blur to match instead of aliasing
            h = mix(h, textureLod(uSolid, uv, lod + log2(1. / max(nz, .12))), graze);
        }
        // Blink: the lid, made of the feathers just above the eye, slides down over it
        vec2 e = (vec2(q.x * 1000. + 1200., 1000. - q.y * 1000.) - vec2(1033., 673.)) / 17.;
        if (uBlink > 0. && length(e) < 1.) {
            float lid = smoothstep(1., .8, length(e)) * smoothstep(.12, -.12, e.y - mix(-1.1, 1.1, uBlink));
            vec4 above = textureLod(uHead, uv + vec2(0., -30. / uTex.w), lod);
            h = mix(h, vec4(above.rgb + uPaper * (1. - above.a), 1.), lid);
        }
        // Solid wherever the outline is, fading across the neck seam into the painted body (what showed
        // through the fade at rest is baked into head.webp)
        float a = max(h.a, smoothstep(-2.5, -.5, outline(uv)) * clamp((seamPx(q) + 22.) / 44. * 1.02, 0., 1.));
        vec3 prem = h.rgb + uPaper * (a - h.a);          // textures are premultiplied
        if (uTurn > 0.) {
            // once turned, a faint ink contour where the head curves away helps it read as a solid
            float rim = smoothstep(.45, .05, abs(n.z)) * smoothstep(.7, 1., a);   // none along the neck blend
            prem = mix(prem, vec3(.18, .17, .16) * a, uTurn * .35 * rim);
        }
        return vec4(prem, a);
    }

    // The neck at a point on it, painted with the body's own neck feathers from neck.webp (the plate as
    // painted, before the head's area was erased from it). The neck twists underneath them: they keep the
    // place the painting gives them, following only the swing, so they bend with the neck but never shear
    // into streaks. As the head turns away the bare parts fill in: above the seam the plate is bare beside
    // the head, so there the body's feathers below are mirrored up, keeping their size rather than
    // stretching; and higher up the gaps between strokes take the strokes' own colour. Barely turned, the
    // neck is just the plate as it lay behind the head, so the head's edges look as painted. The neck
    // never paints bare paper, which would not match the sheet behind it.
    vec4 neckSurface(vec3 p) {
        vec3 q = neckSpace(p);
        vec3 w = PIVOT + rot(q - PIVOT, NECK, gTwist);  // q with the twist put back: swing undone only
        vec2 at = vec2(w.x * 1000. + 1200., 1000. - w.y * 1000.);
        float s = seamPx(w), l = max(log2(uView.z / uRes.x) - 1., 0.);   // the plate is half the painting's size
        vec2 here = (at - NECK_TEX.xy) / NECK_TEX.zw;
        vec2 below = (at - vec2(NECK.x, -NECK.y) * 2. * max(s + 5., 0.) - NECK_TEX.xy) / NECK_TEX.zw;   // mirrored about 5 px below the seam
        float away = smoothstep(.3, 1.2, abs(uTwist) + uSwing.w);   // how far the head has turned away, radians
        vec4 b = textureLod(uNeck, here, l), soft = textureLod(uNeck, here, l + 3.), near = textureLod(uNeck, here, l + 1.);
        vec4 m = textureLod(uNeck, below, l) * away;
        b += m * (1. - b.a);
        soft += textureLod(uNeck, below, l + 3.) * (1. - soft.a);
        near += textureLod(uNeck, below, l + 1.) * away * (1. - near.a);
        // the gaps fill only among strokes, never out past the painted edge
        b += vec4(soft.rgb / max(soft.a, 1e-3), 1.) * (1. - b.a) * share(s) * smoothstep(.15, .4, near.a) * away;
        return b;
    }

    void main() {
        vec2 f = gl_FragCoord.xy / uRes;
        vec2 px = vec2(uView.x + f.x * uView.z, uView.y + (1. - f.y) * uView.w);
        vec3 ro = PP(px.x, px.y, 400.), rd = vec3(0., 0., -1.);
        vec4 acc = vec4(0.);
        float t = 0.;
        for (int layer = 0; layer < 4; layer++) {
            // march to where the ray enters the head
            bool hit = false;
            for (int i = 0; i < 120; i++) {
                float d = map(ro + rd * t);
                if (d < .0003) { hit = true; break; }
                t += max(d, .0004);
                if (t > .8) break;
            }
            if (!hit) break;
            acc += (1. - acc.a) * surface(ro + rd * t);
            if (acc.a > .99) break;
            // Partly transparent there (crest edges, the neck blend): cross the solid without
            // shading its back, then look for the next part behind it, e.g. another crest feather
            for (int i = 0; i < 80; i++) {
                float d = map(ro + rd * t);
                if (d > .0003) break;
                t += max(-d, .0004);
            }
        }
        // The neck is always behind the head, which sits on it: it shows only where the turned head no
        // longer covers. At rest the painting is there instead.
        if (uTurn > 0. && acc.a < .99) {
            t = 0.;
            for (int i = 0; i < 120; i++) {
                float d = neckDist(ro + rd * t) * .0005;
                if (d < .0003) { acc += (1. - acc.a) * neckSurface(ro + rd * t); break; }
                t += max(d, .0004);
                if (t > .8) break;
            }
        }
        frag = acc;
    }`

	function compile(type, src) {
		const s = gl.createShader(type)
		gl.shaderSource(s, src)
		gl.compileShader(s)
		if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s))
		return s
	}
	let prog
	try {
		prog = gl.createProgram()
		gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs))
		gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs))
		gl.linkProgram(prog)
		if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog))
	} catch (e) {
		console.error('kea3d:', e.message)
		return onFail && onFail(e.message)
	}
	gl.useProgram(prog)
	gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
	const loc = gl.getAttribLocation(prog, 'aPos')
	gl.enableVertexAttribArray(loc)
	gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
	const U = (name) => gl.getUniformLocation(prog, name)
	const uRes = U('uRes'),
		uView = U('uView'),
		uTex = U('uTex'),
		uHeadInv = U('uHeadInv'),
		uSwing = U('uSwing'),
		uTwist = U('uTwist'),
		uPaper = U('uPaper'),
		uTurn = U('uTurn'),
		uBlink = U('uBlink')
	gl.uniform1i(U('uHead'), 0)
	gl.uniform1i(U('uFill'), 1)
	gl.uniform1i(U('uSolid'), 2)
	gl.uniform1i(U('uNeck'), 3)

	// Colour textures are premultiplied so mip levels average correctly at transparent edges;
	// the data texture (outline distance, thickness, coverage) must keep its raw bytes
	function upload(unit, img, premultiply) {
		gl.activeTexture(gl.TEXTURE0 + unit)
		gl.bindTexture(gl.TEXTURE_2D, gl.createTexture())
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiply)
		gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
		gl.generateMipmap(gl.TEXTURE_2D)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
	}

	// ---------- head control ----------
	const DEG = Math.PI / 180
	const EYE = [(1033 - 1200) / 1000, (1000 - 674) / 1000, 0.06]
	const CURSOR_Z = 0.9 // the pointer is treated as a point this far in front of the painting
	const NECK = [-0.3205, 0.9473, 0].map((c) => c / Math.hypot(0.3205, 0.9473)) // up the neck, as in the shader
	const REST_PITCH = -20 // the painted head looks down this much
	const YAW_MIN = -40,
		YAW_MAX = 175,
		PITCH_MIN = -30,
		PITCH_MAX = 35
	// Parrots look at things with one eye, so the head settles showing a side, never face-on:
	// yaw targets inside this band snap to its edges and the head only passes through it mid-turn
	const FACE_ON = [48, 132]
	const spring = (k, zeta) => ({ value: 0, target: 0, velocity: 0, k, c: 2 * zeta * Math.sqrt(k) })
	const yaw = spring(150, 0.8),
		pitch = spring(140, 0.7),
		tilt = spring(60, 0.6)
	let frozen = false,
		blinkStart = -1,
		blinkHold = 0,
		pointer = null,
		fidgetYaw = 0,
		fidgetPitch = 0,
		raf = 0,
		last = 0,
		visible = true,
		restTimer = 0,
		ready = false
	const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

	function aim() {
		if (frozen) return
		if (!pointer) {
			yaw.target = fidgetYaw
			pitch.target = fidgetPitch
			return
		}
		const r = container.getBoundingClientRect()
		const px = ((pointer.x - r.left) / r.width) * 2048,
			py = ((pointer.y - r.top) / r.height) * 2048
		const dx = (px - 1200) / 1000 - EYE[0],
			dy = (1000 - py) / 1000 - EYE[1],
			dz = CURSOR_Z - EYE[2]
		const len = Math.hypot(dx, dy, dz)
		let y = clamp(Math.atan2(dz, -dx) / DEG + fidgetYaw, YAW_MIN, YAW_MAX)
		if (y > FACE_ON[0] && y < FACE_ON[1]) {
			// stay on the side it is already showing until the pointer is well past the middle
			const mid = (FACE_ON[0] + FACE_ON[1]) / 2,
				showingRight = yaw.target >= mid
			y = showingRight ? (y < mid - 12 ? FACE_ON[0] : FACE_ON[1]) : y > mid + 12 ? FACE_ON[1] : FACE_ON[0]
		}
		yaw.target = y
		pitch.target = clamp(Math.asin(dy / len) / DEG - REST_PITCH + fidgetPitch, PITCH_MIN, PITCH_MAX)
	}

	function headTurn() {
		// Ry(yaw) * Rz(-pitch) * Rx(roll) as a quaternion, split into a twist about the neck and a swing
		// that bends it (turn = swing * twist), so the neck can take a share of each. Angles run past 180
		// degrees rather than flipping the neck's twist direction.
		const roll = (10 * Math.sin(clamp(yaw.value, 0, 180) * DEG) + tilt.value) * DEG // curious tilt
		const qa = (x, y, z, ang) => {
			const s = Math.sin(ang / 2)
			return [x * s, y * s, z * s, Math.cos(ang / 2)]
		}
		const mul = (a, b) => [
			a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
			a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
			a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
			a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
		]
		const q = mul(mul(qa(0, 1, 0, yaw.value * DEG), qa(0, 0, 1, -pitch.value * DEG)), qa(1, 0, 0, roll))
		const twist = 2 * Math.atan2(q[0] * NECK[0] + q[1] * NECK[1] + q[2] * NECK[2], q[3])
		const t = qa(...NECK, twist),
			[x, y, z, w] = mul(q, [-t[0], -t[1], -t[2], t[3]])
		const len = Math.hypot(x, y, z)
		// The inverse of the whole turn is the transpose of its matrix: the matrix's rows, column-major
		const [a, b, c, d] = q
		return {
			swing: len < 1e-7 ? [0, 0, 1, 0] : [x / len, y / len, z / len, 2 * Math.atan2(len, w)],
			twist,
			inverse: [
				1 - 2 * (b * b + c * c),
				2 * (a * b - c * d),
				2 * (a * c + b * d),
				2 * (a * b + c * d),
				1 - 2 * (a * a + c * c),
				2 * (b * c - a * d),
				2 * (a * c - b * d),
				2 * (b * c + a * d),
				1 - 2 * (a * a + b * b),
			],
		}
	}

	function paperColor() {
		const c = getComputedStyle(document.documentElement).getPropertyValue('--color-bg-paper').trim() || '#F5F3EE'
		const m = c.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
		return m ? m.slice(1).map((h) => parseInt(h, 16) / 255) : [0.96, 0.953, 0.933]
	}
	const paper = paperColor()

	function draw() {
		if (!ready) return
		const dpr = Math.max(2, devicePixelRatio || 1)
		const w = Math.round(canvas.clientWidth * dpr),
			h = Math.round(canvas.clientHeight * dpr)
		if (!w || !h) return
		if (canvas.width !== w || canvas.height !== h) {
			canvas.width = w
			canvas.height = h
		}
		gl.viewport(0, 0, w, h)
		gl.uniform2f(uRes, w, h)
		gl.uniform4f(uView, VIEW.x, VIEW.y, VIEW.w, VIEW.h)
		gl.uniform4f(uTex, TEX.x, TEX.y, TEX.w, TEX.h)
		const turn = headTurn()
		gl.uniformMatrix3fv(uHeadInv, false, turn.inverse)
		gl.uniform4fv(uSwing, turn.swing)
		gl.uniform1f(uTwist, turn.twist)
		gl.uniform3fv(uPaper, paper)
		gl.uniform1f(uTurn, clamp(Math.hypot(yaw.value, pitch.value) / 25, 0, 1))
		gl.uniform1f(uBlink, blinkAmount(performance.now()))
		gl.drawArrays(gl.TRIANGLES, 0, 3)
	}

	function step(s, dt) {
		s.velocity += (s.k * (s.target - s.value) - s.c * s.velocity) * dt
		s.value += s.velocity * dt
	}
	function tick(now) {
		let dt = Math.min((now - last) / 1000, 0.05)
		last = now
		aim()
		while (dt > 0) {
			const h = Math.min(dt, 1 / 240)
			step(yaw, h)
			step(pitch, h)
			step(tilt, h)
			dt -= h
		}
		const settled =
			[yaw, pitch, tilt].every((s) => Math.abs(s.target - s.value) < 0.02 && Math.abs(s.velocity) < 0.02) &&
			blinkAmount(now) === 0
		draw()
		raf = settled ? 0 : requestAnimationFrame(tick)
	}
	function wake() {
		if (!raf && visible && ready) {
			last = performance.now()
			raf = requestAnimationFrame(tick)
		}
	}

	// A blink closes in 70ms, holds briefly and opens in 110ms
	function blinkAmount(now) {
		if (blinkStart < 0) return blinkHold
		const t = now - blinkStart
		if (t > 230) {
			blinkStart = -1
			return 0
		}
		return t < 70 ? t / 70 : t < 120 ? 1 : 1 - (t - 120) / 110
	}
	;(function blink() {
		setTimeout(
			() => {
				if (!document.hidden && visible) {
					blinkStart = performance.now()
					wake()
				}
				blink()
			},
			2500 + Math.random() * 5000
		)
	})()

	addEventListener(
		'pointerdown',
		(e) => {
			if (e.pointerType === 'mouse') return
			pointer = { x: e.clientX, y: e.clientY }
			clearTimeout(restTimer)
			restTimer = setTimeout(() => {
				pointer = null
				wake()
			}, 2500)
			wake()
		},
		{ passive: true }
	)
	addEventListener(
		'pointermove',
		(e) => {
			pointer = { x: e.clientX, y: e.clientY }
			clearTimeout(restTimer)
			if (e.pointerType !== 'mouse')
				restTimer = setTimeout(() => {
					pointer = null
					wake()
				}, 2500)
			wake()
		},
		{ passive: true }
	)
	document.documentElement.addEventListener('mouseleave', () => {
		clearTimeout(restTimer)
		restTimer = setTimeout(() => {
			pointer = null
			wake()
		}, 1200)
	})
	addEventListener('scroll', wake, { passive: true })
	addEventListener('resize', () => draw())
	new IntersectionObserver(([e]) => {
		visible = e.isIntersecting
		if (visible) wake()
	}).observe(container)
	;(function fidget() {
		setTimeout(
			() => {
				if (!document.hidden) {
					fidgetYaw = (Math.random() * 2 - 1) * 6
					fidgetPitch = (Math.random() * 2 - 1) * 4
					tilt.target = Math.random() < 0.35 ? (Math.random() * 2 - 1) * 14 : 0 // now and then, cock the head
					wake()
				}
				fidget()
			},
			2500 + Math.random() * 4000
		)
	})()

	// Load everything, then show the live head, and a frame later put the headless plate in behind it.
	// Both happen from inside frames: the next page during a view transition runs its scripts before it
	// is on screen, and a head drawn then may never be shown, while the plate would be, a flash of bare
	// sheet where the head goes. Until the swap the painted head sits under the live one, which at rest
	// matches it pixel for pixel.
	container.append(canvas)
	const painting = container.querySelector('.c-kea__painting')
	const load = (src) => {
		const i = new Image()
		i.src = src
		return i.decode().then(() => i)
	}
	Promise.all([load(plate), load(head), load(fill), load(solid), load(neck)]).then(
		([bg, h, f, sd, nk]) => {
			upload(0, h, true)
			upload(1, f, false)
			upload(2, sd, true)
			upload(3, nk, true)
			ready = true
			requestAnimationFrame(() => {
				draw()
				canvas.style.visibility = ''
				requestAnimationFrame(() => {
					draw()
					if (painting) painting.src = bg.src
				})
			})
		},
		() => {
			canvas.remove()
			onFail && onFail('images failed to load')
		}
	)

	// setHead and setBlink pose the bird for the lab page
	return {
		canvas,
		draw,
		setBlink(v) {
			blinkHold = v
			draw()
		},
		setHead(y, p) {
			frozen = y !== undefined
			if (frozen) {
				yaw.value = yaw.target = y
				pitch.value = pitch.target = p
			}
			draw()
		},
	}
}
