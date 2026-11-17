/* eslint-disable -- Vendored Alex Wang renderer; see README.md. */
import { createRendererScope } from './renderer-scope'
import { paperColor } from './paper-color'
// The kea's body as individual feathers, on a canvas under the head's (kea3d.js).
// body-feathers.png says which feather each body pixel was painted on (tools/bake-kea-body.py makes it and
// the rest). Each feather is a rigid piece of the painting hinged at its root, which lies hidden under the
// feathers above it (ids run from the top of the stack down). Run the pointer over the body and the patch
// of feathers under it ruffles, each feather lifting and swinging on its own damped spring: where one
// lifts, more of the feather under it shows, in its shade. At rest every feather lies where it was
// painted, so the render is the painting. ruffle() plays a rouse of the whole bird (the lab page's button).
export function mountKeaBody(
	container,
	{
		body = '/images/kea/body.webp',
		feathers = '/images/kea/body-feathers.png',
		cells = '/images/kea/body-cells.png',
		meta: metaUrl = '/images/kea/body.json',
		onFail,
	} = {}
) {
	const scope = createRendererScope()
	const {
		addEventListener,
		setTimeout,
		clearTimeout,
		requestAnimationFrame,
		cancelAnimationFrame,
		IntersectionObserver,
	} = scope
	const canvas = document.createElement('canvas')
	scope.registerCanvas(canvas)
	canvas.className = 'c-keabody__canvas'
	const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, antialias: false })
	if (!gl) {
		scope.dispose()
		return onFail && onFail('no webgl2')
	}

	const vs = `#version 300 es
    in vec2 aPos; void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`

	const fs = `#version 300 es
    precision highp float;
    uniform vec2 uRes, uSize;               // canvas px; the body rectangle, painting px
    uniform int uSlots, uCell, uMap;
    uniform vec3 uPaper;
    uniform vec2 uLight;                    // how far a lifted point's shadow falls, per px of height
    uniform sampler2D uBody, uLab, uCand, uData;
    out vec4 frag;

    // Per feather, one column of uData: 0 root, axis | 1 length, half width, painted length |
    // 2 undo its motion (mat2) | 3 shift, lift, reach | 4 undo its motion, for its shadow
    vec4 row(int i, int r) { return texelFetch(uData, ivec2(i, r), 0); }
    int labelAt(vec2 r) {
        ivec2 c = ivec2(floor(r));
        if (c.x < 0 || c.y < 0 || c.x >= int(uSize.x) || c.y >= int(uSize.y)) return 0;
        return int(texelFetch(uLab, c, 0).r * 255. + .5);
    }
    // How far r lies inside its feather from where the painting was cut to make it, px
    float cutAt(vec2 r) { return texelFetch(uLab, ivec2(floor(r)), 0).g * 255. / 16.; }
    float lod;
    vec4 paint(vec2 r) { return textureLod(uBody, r / uSize, lod); }
    // A premultiplied colour under a wash of shadow k, paper included
    vec4 dim(vec4 c, float k) { return vec4(c.rgb * (1. - k), c.a + (1. - c.a) * k); }
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        f = f * f * (3. - 2. * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + 1.), f.x), f.y);
    }
    // How much of a feather covers rest position r: lying flat it is whole, as painted, but as it lifts
    // the edges where it was cut from its neighbours fray into barbs, streaks slanting out toward the tip
    float fray(vec2 r, float lift, vec2 ax) {
        float amp = lift * 10.;
        if (amp < .02) return 1.;
        vec2 b = vec2(dot(r, ax), dot(r, vec2(-ax.y, ax.x)));
        float n = .65 * noise(vec2(b.x * .15 + b.y * .25, b.y * .7)) + .35 * noise(r * .9);
        return smoothstep(0., .7 + amp * .4, cutAt(r) - amp * n);
    }

    // Where on feather id the rest position r is: 1 its painted part, 2 the part hidden under the
    // feathers above it (an ellipse from root to tip), 0 off it
    int onFeather(vec2 r, int id, vec4 s0, vec4 s1) {
        int lab = labelAt(r);
        if (lab == id) return 1;
        if (lab == 0 || lab > id) return 0;
        vec2 d = r - s0.xy;
        float h = s1.x * .5, u = (dot(d, s0.zw) - h) / (h + 1.), v = dot(d, vec2(-s0.w, s0.z)) / s1.y;
        return u * u + v * v < 1. ? 2 : 0;
    }

    void main() {
        vec2 scale = uSize / uRes;
        vec2 pc = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) * scale;    // painting px, y down
        lod = max(log2(scale.x * .5), 0.);
        // four samples a pixel, so feather edges stay smooth as they move
        vec2 q[4] = vec2[4](pc + vec2(-.25, -.25) * scale, pc + vec2(.25, -.25) * scale,
                            pc + vec2(-.25, .25) * scale, pc + vec2(.25, .25) * scale);
        const float PEN[4] = float[4](-.6, -.2, .2, .6);          // spread of the shadow's soft edge
        vec4 col[4] = vec4[4](vec4(0), vec4(0), vec4(0), vec4(0));
        float cov[4] = float[4](0., 0., 0., 0.), shade[4] = float[4](0., 0., 0., 0.);
        int hit[4] = int[4](0, 0, 0, 0);
        int left = 4;
        ivec2 cell = ivec2(pc) / uCell;
        float slack = scale.x + 1.;
        // Every feather that can reach this cell, top of the stack first. Each sample takes the feathers
        // found there front to back until they cover it (a frayed edge covers only partly), and each
        // lifted feather passed on the way may shade what lies under it
        for (int k = 0; k < 256; k++) {
            if (k >= uSlots) break;
            int id = int(texelFetch(uCand, ivec2(cell.x, cell.y * uSlots + k), 0).r * 255. + .5);
            if (id == 0) break;
            int i = id - 1;
            vec4 mv = row(i, 3), s0 = row(i, 0);
            vec2 at = s0.xy + mv.xy;
            if (distance(pc, at) > mv.w + slack) continue;
            vec4 s1 = row(i, 1);
            mat2 inv = mat2(row(i, 2)), sinv = mat2(row(i, 4));
            for (int j = 0; j < 4; j++) {
                if (cov[j] > .995) continue;
                vec2 r = s0.xy + inv * (q[j] - at);
                int on = onFeather(r, id, s0, s1);
                float w = 0.;
                vec4 c;
                if (on == 1) { c = paint(r); w = fray(r, mv.z, s0.zw); }
                else if (on == 2) {
                    // more of the same feather: the body of its painted part (short of the tip and its
                    // outline) drawn out toward the root, soft and in the shade of the feathers above
                    float u = dot(r - s0.xy, s0.zw), from = s1.x - s1.z;
                    vec2 r2 = r + s0.zw * (from + s1.z * (.15 + .3 * clamp(u / max(from, 1.), 0., 1.)) - u);
                    vec4 c2 = textureLod(uBody, r2 / uSize, lod + 1.5);
                    c = dim(vec4(c2.rgb + uPaper * (1. - c2.a), 1.), .1);
                    w = 1.;
                }
                if (w > 0.) {
                    col[j] += (1. - cov[j]) * w * dim(c, shade[j] * .2);
                    cov[j] += (1. - cov[j]) * w;
                    if (hit[j] == 0) hit[j] = id;
                    if (cov[j] > .995) left--;
                } else if (mv.z > .004) {
                    vec2 rs = s0.xy + sinv * (q[j] - at - uLight * mv.z * s1.x * .5 * PEN[j]);
                    if (onFeather(rs, id, s0, s1) > 0) shade[j] = max(shade[j], min(mv.z * 2.4, 1.));
                }
            }
            if (left == 0) break;
        }
        vec4 sum = vec4(0);
        for (int j = 0; j < 4; j++) {
            vec4 c = col[j];
            // what no feather covers: the body under its feathers (a dim blur of what lies over it), or off
            // the body, the paper, on which no shadow falls
            if (cov[j] < .995 && labelAt(q[j]) != 0) {
                vec4 b = textureLod(uBody, q[j] / uSize, 4.);
                c += (1. - cov[j]) * dim(vec4((b.rgb + uPaper * (1. - b.a)) * .82, 1.), shade[j] * .2);
            }
            if (uMap == 1 && hit[j] != 0) {
                vec3 h = fract(sin(float(hit[j]) * vec3(12.9898, 78.233, 37.719)) * 43758.5453);
                c = vec4(mix(c.rgb + uPaper * (1. - c.a), h, .55), 1.);
            }
            sum += c;
        }
        frag = sum * .25;
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
		console.error('kea-body:', e.message)
		return onFail && onFail(e.message)
	}
	gl.useProgram(prog)
	gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
	const loc = gl.getAttribLocation(prog, 'aPos')
	gl.enableVertexAttribArray(loc)
	gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
	const U = (name) => gl.getUniformLocation(prog, name)
	;['uBody', 'uLab', 'uCand', 'uData'].forEach((n, i) => gl.uniform1i(U(n), i))

	function texture(unit, filter) {
		gl.activeTexture(gl.TEXTURE0 + unit)
		gl.bindTexture(gl.TEXTURE_2D, gl.createTexture())
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter === gl.NEAREST ? gl.NEAREST : gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
		gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE)
	}
	// Ids are data, never premultiplied or filtered: the candidates one byte each, the feather map an id
	// and a distance
	function ids(unit, img, rg) {
		texture(unit, gl.NEAREST)
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
		gl.texImage2D(gl.TEXTURE_2D, 0, rg ? gl.RG8 : gl.R8, rg ? gl.RG : gl.RED, gl.UNSIGNED_BYTE, img)
	}

	// ---------- feathers ----------
	const TAU = 2 * Math.PI
	const SPINE = [0.56, 0.83].map((c) => c / Math.hypot(0.56, 0.83)) // neck to tail, painting px, y down
	const ACROSS = [SPINE[1], -SPINE[0]] // where rolling about the spine carries the side facing us
	const LIGHT = [0.2, 0.46] // a lifted edge's shadow falls down and back
	// The rouse, seconds: the feathers stand up, the body shakes, and they snap back down flat
	const ERECT = 0.2,
		SHAKE_AT = 0.22,
		SHAKE_LEN = 0.44,
		SHAKE_HZ = 8.5,
		SETTLE_AT = 0.74,
		STEP = 1 / 480
	const sstep = (a, b, x) => {
		const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
		return t * t * (3 - 2 * t)
	}
	function shakeEnv(t) {
		const u = t - SHAKE_AT
		return u < 0 || u > SHAKE_LEN ? 0 : sstep(0, 0.06, u) * (1 - sstep(SHAKE_LEN * 0.45, SHAKE_LEN, u))
	}
	const roll = (t) => ROLL * shakeEnv(t) * Math.sin(TAU * SHAKE_HZ * (t - SHAKE_AT))
	let ROLL = 0.11,
		COAT = 6

	let meta,
		N = 0,
		F = [],
		data,
		W = 0,
		H = 0,
		ready = false
	let t = 1e3,
		clock = 0,
		rousing = false,
		raf = 0,
		last = 0,
		timeScale = 1,
		map = 0,
		hand = null

	function rng(seed) {
		// mulberry32
		return () => {
			seed |= 0
			seed = (seed + 0x6d2b79f5) | 0
			let x = Math.imul(seed ^ (seed >>> 15), 1 | seed)
			x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x
			return ((x ^ (x >>> 14)) >>> 0) / 4294967296
		}
	}
	// Every feather gets its own stiffness, damping, reach and timing, so no two move alike
	function setup() {
		const r = rng(7),
			rnd = (a, b) => a + (b - a) * r()
		F = meta.feathers.map((f, i) => {
			const a = f.a,
				p = [-a[1], a[0]],
				depth = i / meta.feathers.length
			let g = f.g.slice()
			const ga = g[0] * a[0] + g[1] * a[1]
			if (ga < -0.6) {
				g[0] -= a[0] * (ga + 0.6)
				g[1] -= a[1] * (ga + 0.6)
			} // never folds flat
			const k = f.kind,
				long = k === 'long',
				tuft = k === 'tuft'
			return {
				...f,
				p,
				g,
				lift: f.th * f.pin * (long ? rnd(0.3, 0.6) : rnd(0.5, 0.85)),
				splay: f.ph * f.pin * rnd(-0.5, 0.5),
				// at most ~14 Hz even when snapping down: faster than that flickers at 60 frames a second
				w: TAU * (tuft ? rnd(5, 7.5) : long ? rnd(7, 9.5) : rnd(6, 8.5)),
				zeta: tuft ? rnd(0.28, 0.42) : rnd(0.35, 0.55),
				erect: 0.07 * depth + rnd(0, 0.05),
				settle: 0.09 * depth + rnd(0, 0.07),
				flut: [rnd(7, 11), rnd(0, TAU), rnd(10, 14), rnd(0, TAU)],
				coat: long ? 0.3 : 1, // flight feathers hardly fluff
				thCap: f.th,
				phCap: f.ph,
				th: 0,
				thv: 0,
				ph: 0,
				phv: 0,
				near: 0,
				stir: 0,
			}
		})
	}
	function rest() {
		for (const f of F) f.th = f.thv = f.ph = f.phv = f.stir = 0
	}

	// Returns whether anything is still moving
	function step(dt) {
		if (rousing) t += dt
		clock += dt
		const env = shakeEnv(t),
			h = 1e-3,
			calm = Math.exp(-dt / 0.1)
		const acc = (roll(t + h) - 2 * roll(t) + roll(t - h)) / (h * h) // the roll's angular acceleration
		let moving = false
		for (const f of F) {
			const down = t >= SETTLE_AT + f.settle
			// raised, fluttering loose in the shake; then pressed down flat, faster than they rose
			const up = down ? 0 : sstep(f.erect, f.erect + ERECT, t)
			const flutter =
				env * (Math.sin(TAU * f.flut[0] * t + f.flut[1]) + 0.6 * Math.sin(TAU * f.flut[2] * t + f.flut[3]))
			// A patch the pointer has stirred jostles for a moment, each feather to its own beat; where the
			// pointer rests among them, the feathers stay parted a little
			f.stir *= calm
			const jig =
				Math.sin(TAU * f.flut[0] * clock + f.flut[1]) + 0.6 * Math.sin(TAU * f.flut[2] * clock + f.flut[3])
			const th0 = Math.max(
				f.lift * (up + 0.25 * flutter * up),
				f.thCap * (0.35 * f.near + 0.3 * f.stir * (1 + 0.6 * jig))
			)
			// stirred by the pointer they settle quickly, with one small overshoot; the rouse is looser
			const w = f.w * (rousing && down ? 1.5 : 1),
				zeta = rousing ? f.zeta : Math.min(0.85, f.zeta * 1.6),
				c = 2 * zeta * w
			f.thv += (w * w * (th0 - f.th) - c * f.thv) * dt
			f.th += f.thv * dt
			if (f.th < 0) {
				f.th = 0
				f.thv *= -0.25
			} // a feather cannot sink into the body: it taps down
			if (f.th > f.thCap) {
				f.th = f.thCap
				f.thv = 0
			}
			// The shake flings each feather sideways against its root: the root's acceleration across it
			const across = acc * f.z * f.pin * (ACROSS[0] * f.p[0] + ACROSS[1] * f.p[1])
			const wp = w * 0.8,
				ph0 =
					(down ? 0 : f.splay * up) +
					f.phCap * 0.6 * f.stir * Math.sin(TAU * 0.7 * f.flut[0] * clock + f.flut[3])
			f.phv += (wp * wp * (ph0 - f.ph) - 2 * zeta * wp * f.phv - (across / (f.l * 0.6)) * 0.35) * dt
			f.ph += f.phv * dt
			if (Math.abs(f.ph) > f.phCap) {
				f.ph = Math.sign(f.ph) * f.phCap
				f.phv = 0
			}
			moving ||=
				f.stir > 0.01 ||
				Math.abs(f.thv) > 0.01 ||
				Math.abs(f.phv) > 0.01 ||
				Math.abs(f.th - th0) > 5e-4 ||
				Math.abs(f.ph - ph0) > 5e-4
		}
		if (rousing && t > SETTLE_AT + 0.3 && !moving) {
			rousing = false
			t = 1e3
		}
		return moving || rousing
	}

	// Each feather's motion as a 2D map of its rest position to the screen, for the shader to undo
	function pack() {
		const rl = roll(t)
		for (let i = 0; i < N; i++) {
			const f = F[i],
				o = i * 4,
				a = f.a,
				p = f.p
			const c = Math.cos(f.th),
				s = Math.sin(f.th),
				cr = Math.cos(f.ph),
				sr = Math.sin(f.ph)
			// lifting by th about its root tips the feather out of the body's surface: along its length it
			// foreshortens (cos th) and leans out along the surface normal as seen on screen (g sin th)
			const put = (row, ux, uy) => {
				// M = R(ph) (u a^T + p p^T); store its inverse, column-major
				const m00 = ux * a[0] + p[0] * p[0],
					m01 = ux * a[1] + p[0] * p[1]
				const m10 = uy * a[0] + p[1] * p[0],
					m11 = uy * a[1] + p[1] * p[1]
				const r00 = cr * m00 - sr * m10,
					r01 = cr * m01 - sr * m11,
					r10 = sr * m00 + cr * m10,
					r11 = sr * m01 + cr * m11
				const det = r00 * r11 - r01 * r10
				data.set([r11 / det, -r10 / det, -r01 / det, r00 / det], row * N * 4 + o)
			}
			let ux = a[0] * c + f.g[0] * s,
				uy = a[1] * c + f.g[1] * s
			const ul = Math.hypot(ux, uy)
			if (ul > 1.05) {
				ux *= 1.05 / ul
				uy *= 1.05 / ul
			} // it tilts out, never stretches
			put(2, ux, uy)
			put(4, ux + LIGHT[0] * s, uy + LIGHT[1] * s)
			// the shake rolls the body about its spine; and as a feather stands, its root rises off the
			// body with the thickening coat, which on screen carries the feathers at the outline outward
			const shift = rl * f.z * f.pin,
				coat = (COAT * f.coat * f.th) / Math.max(f.thCap, 1e-3)
			data.set(
				[
					ACROSS[0] * shift + f.nxy[0] * coat,
					ACROSS[1] * shift + f.nxy[1] * coat,
					s,
					(f.l + f.ev) * (1.1 + LIGHT[1] * s) + 3,
				],
				3 * N * 4 + o
			)
		}
	}

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
		gl.uniform2f(U('uRes'), w, h)
		gl.uniform1i(U('uMap'), map)
		pack()
		gl.activeTexture(gl.TEXTURE3)
		gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, N, 5, gl.RGBA, gl.FLOAT, data)
		gl.clearColor(0, 0, 0, 0)
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.drawArrays(gl.TRIANGLES, 0, 3)
	}

	// ---------- playing ----------
	let acc = 0
	function tick(now) {
		acc += Math.min((now - last) / 1000, 0.05) * timeScale
		last = now
		let moving = true
		while (acc >= STEP) {
			moving = step(STEP)
			acc -= STEP
		}
		// everything back down: exactly flat, so the body is the painting again
		if (!moving && F.every((f) => !f.near)) rest()
		draw()
		raf = moving ? requestAnimationFrame(tick) : 0
	}
	function wake() {
		if (!ready || raf) return
		acc = 0
		last = performance.now()
		raf = requestAnimationFrame(tick)
	}
	// The whole bird rouses: every feather stands, the body shakes, and they snap back flat
	function ruffle() {
		if (!ready || rousing) return
		rousing = true
		t = 0
		wake()
	}
	// The pose t seconds into a rouse, stepped from the start exactly as it plays
	function at(time) {
		cancelAnimationFrame(raf)
		raf = 0
		rest()
		F.forEach((f) => (f.near = 0))
		rousing = true
		t = 0
		while (t + STEP <= time) step(STEP)
		draw()
		rousing = false
		t = 1e3
	}

	// The pointer among the feathers, like a finger run through them: the small patch around it ruffles
	// as it arrives, and a moving pointer flicks the feathers it passes up and sideways, most when it
	// brushes against the grain (toward their roots) and hardly at all with it. Each feather answers on
	// its own spring, so the patch ruffles together but never as one sheet. Where the pointer rests, the
	// patch under it stays parted a little.
	function pointer(e) {
		if (!ready) return
		const r = container.getBoundingClientRect()
		const k = 2048 / r.width // painting px per screen px
		const x = (e.clientX - r.left) * k - meta.rect[0],
			y = (e.clientY - r.top) * k - meta.rect[1]
		const reach = 80 // painting px: a patch of a few feathers
		const prev = hand,
			dt = prev ? (e.timeStamp - prev.time) / 1000 : 0
		let vx = 0,
			vy = 0
		if (prev && dt > 0 && dt < 0.1) {
			vx = (x - prev.x) / dt
			vy = (y - prev.y) / dt
		}
		if (prev && dt < 0.1) {
			vx = 0.5 * vx + 0.5 * prev.vx
			vy = 0.5 * vy + 0.5 * prev.vy
		}
		hand = { x, y, vx, vy, time: e.timeStamp }
		const speed = Math.hypot(vx, vy),
			fast = Math.min(speed / k / 400, 1.5) // 400 screen px a second
		const dx = speed ? vx / speed : 0,
			dy = speed ? vy / speed : 0
		let any = false
		for (const f of F) {
			const d = Math.hypot(x - f.c[0], y - f.c[1])
			const near = d < reach ? (1 - (d / reach) ** 2) ** 2 * f.pin : 0
			if (near !== f.near) any = true
			const arrived = near - f.near
			f.near = e.pointerType === 'mouse' ? near : 0 // a finger lifts away; a mouse stays
			if (!near) continue
			if (arrived > 0) {
				// the pointer coming over the patch ruffles it
				f.thv += arrived * 20
				f.phv += arrived * (Math.random() - 0.5) * 12 // each jostled its own way
			}
			f.stir = Math.min(1, f.stir + Math.max(arrived, 0) * 1.2 + near * fast * 0.25)
			if (e.type === 'pointerdown' && e.pointerType !== 'mouse') f.thv += near * 9 // a tap pokes them up
			const against = Math.max(0, -(dx * f.a[0] + dy * f.a[1]))
			f.thv += near * fast * (6 + 16 * against)
			f.phv += near * fast * 5 * (dx * f.p[0] + dy * f.p[1]) // the tip is carried along
			any = true
		}
		if (any) wake()
	}
	addEventListener('pointermove', pointer, { passive: true })
	addEventListener('pointerdown', pointer, { passive: true })
	scope.listen(document.documentElement, 'mouseleave', () => {
		hand = null
		F.forEach((f) => (f.near = 0))
		wake()
	})
	addEventListener('resize', () => draw())

	// onload rather than decode(), which waits for the page to be shown
	const load = (src) =>
		new Promise((ok, fail) => {
			const i = new Image()
			i.onload = () => ok(i)
			i.onerror = fail
			i.src = src
		})
	const loaded = Promise.all([
		fetch(metaUrl, { signal: scope.signal }).then((r) => r.json()),
		load(body),
		load(feathers),
		load(cells),
	]).then(([m, body, lab, cand]) => {
		if (scope.disposed) return
		meta = m
		N = m.feathers.length
		;[, , W, H] = m.rect
		ROLL = m.shake * 0.6
		COAT = m.coat
		Object.assign(canvas.style, {
			position: 'absolute',
			pointerEvents: 'none',
			visibility: 'hidden',
			left: `${(100 * m.rect[0]) / 2048}%`,
			top: `${(100 * m.rect[1]) / 2048}%`,
			width: `${(100 * W) / 2048}%`,
			height: `${(100 * H) / 2048}%`,
		})
		setup()
		// the body as painted: premultiplied, so its mip levels average properly at the edges
		texture(0, gl.LINEAR_MIPMAP_LINEAR)
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, body)
		gl.generateMipmap(gl.TEXTURE_2D)
		ids(1, lab, true)
		ids(2, cand)
		data = new Float32Array(N * 5 * 4)
		m.feathers.forEach((f, i) => {
			data.set([f.b[0], f.b[1], f.a[0], f.a[1]], i * 4)
			data.set([f.l, f.ev, f.lv, 0], (N + i) * 4)
		})
		texture(3, gl.NEAREST)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, N, 5, 0, gl.RGBA, gl.FLOAT, data)
		gl.uniform2f(U('uSize'), W, H)
		gl.uniform1i(U('uSlots'), m.slots)
		gl.uniform1i(U('uCell'), m.cell)
		gl.uniform2f(U('uLight'), LIGHT[0], LIGHT[1])
		gl.uniform3fv(U('uPaper'), paperColor)
		ready = true
		container.append(canvas)
		// Shown from inside frames, as the head is: a canvas drawn while the next page of a view transition
		// is not yet on screen may never be shown. Ready once it has drawn in two.
		return new Promise((done) =>
			requestAnimationFrame(() => {
				draw()
				canvas.style.visibility = ''
				requestAnimationFrame(() => {
					draw()
					done()
				})
			})
		)
	})
	loaded.catch((e) => {
		if (scope.disposed) return
		scope.dispose()
		canvas.remove()
		onFail && onFail(String(e))
	})

	return {
		destroy: () => scope.dispose(),
		canvas,
		ready: loaded,
		draw,
		ruffle,
		at,
		get running() {
			return raf !== 0
		},
		setTimeScale(s) {
			timeScale = s
		},
		advance(sec) {
			for (let u = STEP; u <= sec + 1e-9; u += STEP) step(STEP)
			draw()
		}, // for stills
		setMap(on) {
			map = on ? 1 : 0
			draw()
		},
		feathers: () => F,
	}
}
