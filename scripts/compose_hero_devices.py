"""
Compose real screenshots into the green-screen device render for /paginas-web hero.

Setup (one-time, outside the repo):
    python3 -m venv ~/.venvs/delta-paginas-web-cv
    source ~/.venvs/delta-paginas-web-cv/bin/activate
    pip install opencv-python-headless numpy pillow

Run:
    source ~/.venvs/delta-paginas-web-cv/bin/activate
    python3 scripts/compose_hero_devices.py [site]   # site: lapuerta (default) | tla

Inputs:
    _ref/devices-hero.png                 - green-screen laptop+phone render
    _ref/casos-source/{site}-laptop.png   - 1440x900 desktop screenshot (2x = 2880x1800)
    _ref/casos-source/{site}-mobile.png   - 390x844 mobile screenshot (2x = 780x1688)

Outputs:
    _ref/devices-debug-corners.png        - corner/quad overlay for visual verification
    _ref/hero-{puerta|tla}.png            - composed preview for that site
    public/paginas-web/devices-hero.webp  - published asset, only written for `lapuerta`
                                             (the current live site) until a choice is made
"""
import sys
import cv2
import numpy as np
from PIL import Image

SITE = sys.argv[1] if len(sys.argv) > 1 else "tla"
OUTPUT_NAME = {"lapuerta": "puerta", "tla": "tla"}.get(SITE, SITE)
# tla is the published default until a choice is made; other sites only
# produce the _ref comparison PNG, they don't touch the published webp
WRITE_PUBLIC_WEBP = SITE == "tla"

SRC = "_ref/devices-hero.png"
DESKTOP_SHOT = f"_ref/casos-source/{SITE}-laptop.png"
MOBILE_SHOT = f"_ref/casos-source/{SITE}-mobile.png"
DEBUG_OUT = "_ref/devices-debug-corners.png"
FINAL_PNG = f"_ref/hero-{OUTPUT_NAME}.png"
FINAL_WEBP = "public/paginas-web/devices-hero.webp"

GREEN_LOWER = np.array([35, 90, 90])
GREEN_UPPER = np.array([75, 255, 255])


def green_mask(img):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, GREEN_LOWER, GREEN_UPPER)
    kernel = np.ones((5, 5), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=2)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)
    return mask


def order_points(pts):
    """Standard 4-point ordering: TL (min sum), BR (max sum), TR (min y-x),
    BL (max y-x)."""
    s = pts.sum(axis=1)
    d = (pts[:, 1] - pts[:, 0])  # y - x
    tl = pts[np.argmin(s)]
    br = pts[np.argmax(s)]
    tr = pts[np.argmin(d)]
    bl = pts[np.argmax(d)]
    return np.array([tl, tr, br, bl], dtype=np.float32)


def quad_from_mask(mask):
    """4 corners straight from the green mask: largest contour -> convex hull ->
    approxPolyDP down to 4 points (falls back to minAreaRect if that doesn't
    land on exactly 4)."""
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnt = max(contours, key=cv2.contourArea)
    hull = cv2.convexHull(cnt)
    peri = cv2.arcLength(hull, True)
    pts = None
    for eps_frac in (0.02, 0.03, 0.05, 0.08):
        approx = cv2.approxPolyDP(hull, eps_frac * peri, True)
        if len(approx) == 4:
            pts = approx.reshape(-1, 2).astype(np.float32)
            break
    if pts is None:
        pts = cv2.boxPoints(cv2.minAreaRect(cnt))
    return order_points(pts)


def warp_into(src_img, dst_quad, canvas_shape):
    q = dst_quad.astype(np.float32)
    h, w = src_img.shape[:2]
    # ancho real de la pantalla destino (borde mas largo, arriba o abajo)
    target_w = max(np.linalg.norm(q[1] - q[0]), np.linalg.norm(q[2] - q[3]))
    # 1) reducir primero con INTER_AREA (filtra de verdad, sin halos ni dientes)
    scale = min(1.0, (target_w * 1.25) / w)
    if scale < 1.0:
        src_img = cv2.resize(
            src_img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA
        )
    h, w = src_img.shape[:2]
    # 2) ya cerca del tamano final, aplicar la perspectiva con LINEAR
    src_quad = np.array([[0, 0], [w, 0], [w, h], [0, h]], dtype=np.float32)
    M = cv2.getPerspectiveTransform(src_quad, q)
    return cv2.warpPerspective(
        src_img, M, (canvas_shape[1], canvas_shape[0]),
        flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE,
    )


def despill(img, mask=None, ring_px=None):
    """Suppress green spill across the WHOLE frame (G capped to max(R,B) wherever
    G dominates). Spill can reach well beyond any fixed-radius ring around the
    chroma mask (e.g. green bouncing into the phone's notch cutout), so instead of
    a ring we despill everywhere; pixels with no spill are left untouched since
    G <= max(R,B) there already."""
    out = img.copy().astype(np.int16)
    b, g, r = out[:, :, 0], out[:, :, 1], out[:, :, 2]
    max_rb = np.maximum(r, b)
    g_new = np.where(g > max_rb, max_rb, g)
    out[:, :, 1] = g_new
    return out.astype(np.uint8)


def draw_quad(img, quad, color):
    pts = quad.astype(np.int32).reshape(-1, 1, 2)
    cv2.polylines(img, [pts], True, color, 4)
    for p in quad:
        cv2.circle(img, tuple(p.astype(int)), 10, color, -1)


def refine_quad(mask, quad, band=10, lo=0.2, hi=0.8):
    # Esquinas = interseccion de la recta de cada borde (las esquinas redondeadas
    # desplazan los vertices de approxPolyDP hacia adentro y rompen la perspectiva)
    cnts, _ = cv2.findContours((mask > 0).astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    pts = max(cnts, key=cv2.contourArea).reshape(-1, 2).astype(np.float32)
    q = quad.astype(np.float32)
    lines = []
    for i in range(4):
        a, b = q[i], q[(i + 1) % 4]
        d = b - a
        L = float(np.linalg.norm(d))
        u = d / L
        n = np.array([-u[1], u[0]], dtype=np.float32)
        rel = pts - a
        t = rel @ u / L
        dist = np.abs(rel @ n)
        sel = pts[(t > lo) & (t < hi) & (dist < band)]
        if len(sel) < 20:
            return quad
        vx, vy, x0, y0 = cv2.fitLine(sel, cv2.DIST_HUBER, 0, 0.01, 0.01).ravel()
        lines.append((np.array([x0, y0], np.float32), np.array([vx, vy], np.float32)))
    out = []
    for i in range(4):
        p1, d1 = lines[(i - 1) % 4]
        p2, d2 = lines[i]
        A = np.array([d1, -d2], dtype=np.float32).T
        if abs(np.linalg.det(A)) < 1e-6:
            return quad
        sol = np.linalg.solve(A, p2 - p1)
        out.append(p1 + sol[0] * d1)
    return np.array(out, dtype=np.float32)


def add_sheen(img, mask, strength=0.07):
    """Soft diagonal highlight confined to the screen's own bounding box."""
    ys, xs = np.where(mask > 0)
    y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    bh, bw = y1 - y0 + 1, x1 - x0 + 1

    xx, yy = np.meshgrid(np.arange(bw, dtype=np.float32), np.arange(bh, dtype=np.float32))
    diag = (xx / bw) - (yy / bh)  # -1..1 across this screen only
    diag = (diag - diag.min()) / (diag.max() - diag.min() + 1e-6)
    band = np.exp(-((diag - 0.6) ** 2) / (2 * 0.22 ** 2))  # soft single diagonal band, peak at 0.6
    sheen_local = (band * 255 * strength).astype(np.uint8)

    sheen_full = np.zeros(mask.shape, np.uint8)
    sheen_full[y0:y1 + 1, x0:x1 + 1] = sheen_local
    sheen_bgr = cv2.merge([sheen_full, sheen_full, sheen_full]).astype(np.int16)

    out = img.astype(np.int16)
    m = (mask > 0)[:, :, None]
    screen_blend = 255 - ((255 - out) * (255 - sheen_bgr) // 255)
    out = np.where(m, screen_blend, out)
    return np.clip(out, 0, 255).astype(np.uint8)


def laptop_body_mask(gray_img, laptop_mask, x_limit):
    """Rough silhouette of the whole laptop (screen+bezel+base), left of the phone."""
    region = np.zeros_like(gray_img)
    region[:, :x_limit] = gray_img[:, :x_limit]
    _, body = cv2.threshold(region, 18, 255, cv2.THRESH_BINARY)
    body = cv2.bitwise_or(body, laptop_mask[:, :])
    kernel = np.ones((9, 9), np.uint8)
    body = cv2.morphologyEx(body, cv2.MORPH_CLOSE, kernel, iterations=3)
    return body


def main():
    img = cv2.imread(SRC)
    mask = green_mask(img)

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)
    laptop_cnt, phone_cnt = contours[0], contours[1]

    laptop_mask = np.zeros(mask.shape, np.uint8)
    cv2.drawContours(laptop_mask, [laptop_cnt], -1, 255, -1)
    phone_mask = np.zeros(mask.shape, np.uint8)
    cv2.drawContours(phone_mask, [phone_cnt], -1, 255, -1)

    laptop_quad = quad_from_mask(laptop_mask)
    phone_quad = quad_from_mask(phone_mask)

    debug = img.copy()
    draw_quad(debug, laptop_quad, (0, 0, 255))
    draw_quad(debug, phone_quad, (255, 0, 0))
    cv2.imwrite(DEBUG_OUT, debug)
    phone_quad = refine_quad(phone_mask, phone_quad)
    # bordes limpios: ambas pantallas = poligonos desde lineas ajustadas (laptop: solo los tramos visibles de cada lado)
    phone_mask = cv2.bitwise_and(phone_mask, mask)
    _el = lambda n: cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (n, n))
    def _fit(pts, a, b, t0, t1, band=14):
        d = b - a; L = np.linalg.norm(d); u = d / L
        t = (pts - a) @ u / L
        dist = np.abs((pts - a) @ np.array([-u[1], u[0]]))
        sel = pts[(t > t0) & (t < t1) & (dist < band)]
        vx, vy, x0, y0 = cv2.fitLine(sel, cv2.DIST_HUBER, 0, 0.01, 0.01).ravel()
        return np.array([x0, y0]), np.array([vx, vy])
    def _cross(l1, l2):
        (p1, d1), (p2, d2) = l1, l2
        s_, _ = np.linalg.solve(np.array([d1, -d2]).T, p2 - p1)
        return p1 + s_ * d1
    _lp = laptop_cnt.reshape(-1, 2).astype(np.float32)
    _q = np.array(laptop_quad, np.float32)
    try:
        _top = _fit(_lp, _q[0], _q[1], 0.15, 0.85)
        _rig = _fit(_lp, _q[1], _q[2], 0.12, 0.34, band=40)
        _bot = _fit(_lp, _q[2], _q[3], 0.10, 0.85)
        _lef = _fit(_lp, _q[3], _q[0], 0.20, 0.80)
        _nq = np.array([_cross(_lef, _top), _cross(_top, _rig), _cross(_rig, _bot), _cross(_bot, _lef)], np.float32)
    except Exception as _e:
        _nq = _q + 1000
        print("laptop: no se pudo ajustar:", _e)
    print("laptop esquinas antes:", _q.round(0).tolist())
    print("laptop esquinas ahora:", _nq.round(0).tolist())
    if np.abs(_nq - _q).max() < 200:
        laptop_quad = _nq
        _lm = np.zeros(laptop_mask.shape, np.uint8)
        cv2.fillPoly(_lm, [_nq.astype(np.int32)], 255)
        _lm = cv2.dilate(cv2.erode(_lm, _el(41)), _el(41))
        _lm = cv2.erode(_lm, _el(3))
        laptop_mask = cv2.bitwise_and(_lm, cv2.dilate(laptop_mask, _el(5)))
    else:
        print("laptop: ajuste descartado, se queda el anterior")
    _pm = np.zeros(phone_mask.shape, np.uint8)
    cv2.fillPoly(_pm, [phone_quad.astype(np.int32)], 255)
    _pm = cv2.dilate(cv2.erode(_pm, _el(61)), _el(61))
    _pm = cv2.erode(_pm, _el(3))
    _hol = cv2.bitwise_and(cv2.erode(_pm, _el(17)), cv2.bitwise_not(phone_mask))
    _n, _lb, _st, _ = cv2.connectedComponentsWithStats(_hol)
    _isla = np.zeros_like(_pm)
    _cand = [_i for _i in range(1, _n) if _st[_i, cv2.CC_STAT_AREA] > 300]
    if _cand:
        _i = max(_cand, key=lambda k: _st[k, cv2.CC_STAT_AREA])
        _x, _y, _w, _h = [int(v) for v in _st[_i, :4]]
        _r = _h // 2 + 2
        cv2.rectangle(_isla, (_x + _r - 2, _y - 2), (_x + _w - _r + 2, _y + _h + 2), 255, -1)
        cv2.circle(_isla, (_x + _r - 2, _y + _h // 2), _r, 255, -1)
        cv2.circle(_isla, (_x + _w - _r + 2, _y + _h // 2), _r, 255, -1)
        print("isla dinamica detectada:", _w, "x", _h)
    _ys, _xs = np.nonzero(_isla)
    if len(_xs) > 0:
        _k = 0.86  # isla chica
        _cx = (int(_xs.min()) + int(_xs.max())) / 2.0
        _cy = (int(_ys.min()) + int(_ys.max())) / 2.0
        _hw = (int(_xs.max()) - int(_xs.min()) + 1) * _k / 2.0
        _hh = (int(_ys.max()) - int(_ys.min()) + 1) * _k / 2.0
        _S, _P = 4, 8
        _x0, _y0 = int(_cx - _hw) - _P, int(_cy - _hh) - _P
        _rw, _rh = int(2 * _hw) + 2 * _P + 2, int(2 * _hh) + 2 * _P + 2
        if _x0 >= 0 and _y0 >= 0 and _x0 + _rw <= _isla.shape[1] and _y0 + _rh <= _isla.shape[0]:
            _big = np.zeros((_rh * _S, _rw * _S), np.uint8)
            _bcx, _bcy = (_cx - _x0 + 0.5) * _S, (_cy - _y0 + 0.5) * _S
            _r = int(round(_hh * _S))
            cv2.rectangle(_big, (int(_bcx - _hw * _S + _r), int(_bcy - _r)), (int(_bcx + _hw * _S - _r), int(_bcy + _r)), 255, -1)
            cv2.circle(_big, (int(_bcx - _hw * _S + _r), int(_bcy)), _r, 255, -1)
            cv2.circle(_big, (int(_bcx + _hw * _S - _r), int(_bcy)), _r, 255, -1)
            _small = cv2.resize(_big, (_rw, _rh), interpolation=cv2.INTER_AREA)
            _isla = np.zeros_like(_isla)
            _isla[_y0:_y0 + _rh, _x0:_x0 + _rw] = _small
    _isla = cv2.erode(_isla, _el(5))  # isla mas fina
    phone_mask = cv2.bitwise_and(_pm, cv2.bitwise_not(_isla))
    # cobertura exacta de la pantalla del celular (4x + distancias): antialias real, sin escalones
    _S4 = 4
    _qq = np.asarray(phone_quad, np.float64).reshape(-1, 2)
    _bx0, _by0 = max(int(_qq[:, 0].min()) - 24, 0), max(int(_qq[:, 1].min()) - 24, 0)
    _bx1, _by1 = min(int(_qq[:, 0].max()) + 24, _pm.shape[1]), min(int(_qq[:, 1].max()) + 24, _pm.shape[0])
    _bw, _bh = _bx1 - _bx0, _by1 - _by0
    _bg = np.zeros((_bh * _S4, _bw * _S4), np.uint8)
    cv2.fillConvexPoly(_bg, np.round((_qq - [_bx0, _by0]) * _S4 + (_S4 - 1) / 2.0).astype(np.int32), 255)
    _d1 = cv2.distanceTransform(_bg, cv2.DIST_L2, cv2.DIST_MASK_PRECISE)
    _d2 = cv2.distanceTransform(np.where(_d1 >= 30.0 * _S4, 0, 255).astype(np.uint8), cv2.DIST_L2, cv2.DIST_MASK_PRECISE)
    _cov = np.where(_d2 <= 29.0 * _S4, 255, 0).astype(np.uint8)
    _pm_aa = np.zeros(_pm.shape, np.float32)
    _pm_aa[_by0:_by1, _bx0:_bx1] = cv2.resize(_cov, (_bw, _bh), interpolation=cv2.INTER_AREA).astype(np.float32) / 255.0
    # occ_cut: el cuerpo del celular tapa la laptop (6 px alrededor, ~28 px por el lateral izquierdo): no pintar ahi
    _poly = np.zeros(phone_mask.shape, np.uint8)
    cv2.fillPoly(_poly, [phone_quad.astype(np.int32)], 255)
    _base = cv2.dilate(_poly, _el(13))
    occ_cut = _base.copy()
    for _s in range(2, 23, 2):
        occ_cut = cv2.bitwise_or(occ_cut, np.roll(_base, -_s, axis=1))
    occ_round = cv2.dilate(cv2.erode(occ_cut, _el(69)), _el(69))  # esquinas redondeadas como el cuerpo real
    occ_cut = occ_round
    _antes = int((laptop_mask > 0).sum())
    import os as _os
    _UP = int(_os.environ.get('UP', '-1'))  # -1 = medirlo de la imagen
    if _UP < 0:
        # grosor real de filo+bezel arriba de la pantalla: de su borde superior hacia arriba hasta el primer
        # pixel verde de la laptop; asi el recorte llega justo al filo metalico y no lo pisa
        _meds = []
        for _c in range(int(phone_quad[:, 0].min()) + 60, int(phone_quad[:, 0].max()) - 60, 6):
            _yc = np.nonzero(_poly[:, _c])[0]
            if len(_yc) == 0:
                continue
            _yt = int(_yc.min())
            for _yy in range(_yt - 1, max(_yt - 60, 0), -1):
                if mask[_yy, _c] > 0:
                    _meds.append(_yt - _yy - 1)
                    break
        _M = int(np.median(_meds)) if len(_meds) >= 5 else None
        _UP = max(_M - 6, 0) if _M is not None else 8  # 6 = lo que ya cubre _base (dilate 13)
        print('grosor filo+bezel arriba:', _M, 'px (%d columnas) -> UP =' % len(_meds), _UP)
    _up = occ_cut.copy()
    for _k in range(1, _UP + 1):
        _up = np.maximum(_up, np.roll(occ_cut, -_k, axis=0))
    occ_cut = _up  # protege el marco superior
    # radio real de la esquina del celular: del borde exterior hacia la diagonal hasta tocar el cuerpo
    _rad_env = _os.environ.get('RAD')
    _RAD = 55
    if _rad_env is not None:
        _RAD = int(_rad_env)
    else:
        try:
            _qx, _qy = int(phone_quad[:, 0].min()), int(phone_quad[:, 1].min())
            _row, _col = _qy + 130, _qx + 90
            _X0 = next(x_ for x_ in range(_qx - 60, _qx + 10) if mask[_row, x_] == 0)
            _Y0 = next(y_ for y_ in range(_qy - 60, _qy + 10) if mask[y_, _col] == 0)
            _t = next(t_ for t_ in range(1, 60) if mask[_Y0 + t_, _X0 + t_] == 0)
            _RAD = int(min(max(round(_t * 3.414), 35), 70))
            print('radio real de la esquina del celular: X0=%d Y0=%d t=%d -> RAD = %d' % (_X0, _Y0, _t, _RAD))
        except StopIteration:
            print('radio de la esquina: no se pudo medir, RAD = 55')
    _RR = _RAD * 2 + 1
    occ_cut = cv2.dilate(cv2.erode(occ_cut, _el(_RR)), _el(_RR))  # esquina redonda como el celular
    laptop_mask[occ_cut > 0] = 0
    print("occ_cut: pixeles quitados a la laptop:", _antes - int((laptop_mask > 0).sum()))
    import os
    _rot = float(os.environ.get("PHONE_ROT", "0"))
    if _rot:
        _c = phone_quad.mean(axis=0)
        _t = np.deg2rad(_rot)
        _R = np.array([[np.cos(_t), -np.sin(_t)], [np.sin(_t), np.cos(_t)]], dtype=np.float32)
        phone_quad = ((phone_quad - _c) @ _R.T * 1.06 + _c).astype(np.float32)

    # --- 1) despill the whole photo (bezel edges + phone notch pick up green spill) ---
    base = despill(img)

    # --- 2) warp real screenshots into the detected quads (slightly oversized so the
    #     warped content fully covers the mask, incl. anti-aliased edge pixels) ---
    desktop_shot = cv2.imread(DESKTOP_SHOT)
    mobile_shot = cv2.imread(MOBILE_SHOT)

    def grow_quad(q, px):
        c = q.mean(axis=0)
        norms = np.linalg.norm(q - c, axis=1, keepdims=True)
        return c + (q - c) * (1 + px / norms)

    warped_laptop = warp_into(desktop_shot, grow_quad(laptop_quad, 3.0), img.shape)
    warped_phone = warp_into(mobile_shot, grow_quad(phone_quad, 3.0), img.shape)

    # darken screenshots ~10% before compositing
    warped_laptop = (warped_laptop.astype(np.float32) * 0.90).astype(np.uint8)
    warped_phone = (warped_phone.astype(np.float32) * 0.90).astype(np.uint8)

    # smooth signed-distance alpha centered exactly on the mask boundary: no gap,
    # monotonic ramp 0->1 across `feather` px on each side of the edge.
    def soft_alpha(mask, feather=4):
        dist_in = cv2.distanceTransform(mask, cv2.DIST_L2, 5)
        dist_out = cv2.distanceTransform(cv2.bitwise_not(mask), cv2.DIST_L2, 5)
        signed = dist_in - dist_out
        alpha = np.clip((signed + feather) / (2 * feather), 0, 1)
        return alpha.astype(np.float32)

    lap_alpha = soft_alpha(laptop_mask)[:, :, None]
    _LK = float(_os.environ.get('LK', '4'))
    lap_alpha = np.clip((lap_alpha - 0.5) * _LK + 0.5, 0.0, 1.0)  # borde nitido de la laptop
    phone_alpha = soft_alpha(phone_mask)[:, :, None]

    composed = base.astype(np.float32)
    _neg = np.array([8, 8, 10], np.float32)  # negro del marco
    _lring = cv2.dilate(laptop_mask, _el(17)); _lring[occ_cut > 0] = 0
    _lra = cv2.GaussianBlur(_lring.astype(np.float32) / 255.0, (0, 0), 1.2)[:, :, None]
    _lra[occ_cut > 0] = 0  # el negro del anillo (ya difuminado) no toca el filo del celular
    composed = composed * (1 - _lra) + _neg * _lra
    composed = composed * (1 - lap_alpha) + warped_laptop.astype(np.float32) * lap_alpha
    _pring = cv2.dilate(cv2.bitwise_or(phone_mask, _isla), _el(15))  # borde afilado
    _py = np.nonzero(phone_mask.any(axis=1))[0]
    if len(_py): _pring[:max(int(_py.min()) - 2, 0), :] = 0  # sin anillo extra arriba
    _pra = cv2.GaussianBlur(_pring.astype(np.float32) / 255.0, (0, 0), 0.7)[:, :, None]
    composed = composed * (1 - _pra) + _neg * _pra
    import os as _os
    _PHK = float(_os.environ.get('PHK', '2.5'))
    phone_alpha = np.clip((phone_alpha - 0.5) * _PHK + 0.5, 0.0, 1.0)  # borde de pantalla nitido
    phone_alpha = (_pm_aa * (1.0 - _isla.astype(np.float32) / 255.0))[:, :, None]  # borde con antialias real
    composed = composed * (1 - phone_alpha) + warped_phone.astype(np.float32) * phone_alpha
    _ia = cv2.GaussianBlur(cv2.dilate(_isla, _el(5)).astype(np.float32) / 255.0, (0, 0), 0.6)[:, :, None]
    composed = composed * (1 - _ia) + _neg * _ia
    composed = np.clip(composed, 0, 255).astype(np.uint8)   
    cv2.imwrite("_ref/dbg-composed.png", composed)

    # --- 3) near-invisible diagonal sheen: the screen must keep the site's
    #     real contrast, not look brightened/washed out ---
    # composed = add_sheen(composed, laptop_mask, strength=0.02)
    # composed = add_sheen(composed, phone_mask, strength=0.015)

    # --- 4) soft halo around the laptop silhouette (bezel/background only --
    #     excluded from both screens so it never washes out the site content) ---
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    x_limit = int(phone_quad[:, 0].min()) + 10
    body = laptop_body_mask(gray, laptop_mask, x_limit)
    halo_src = cv2.dilate(body, np.ones((25, 25), np.uint8), iterations=1)
    halo = cv2.GaussianBlur(halo_src, (0, 0), sigmaX=35)
    halo_f = (halo.astype(np.float32) / 255.0) * 0.16
    screens = cv2.bitwise_or(laptop_mask, phone_mask) > 0
    halo_f[screens] = 0.0
    warm = np.array([130, 170, 255], dtype=np.float32)  # BGR warm glow
    composed_f = composed.astype(np.float32)
    for c in range(3):
        composed_f[:, :, c] = composed_f[:, :, c] + halo_f * (warm[c] - composed_f[:, :, c]) * 0.5
    composed = np.clip(composed_f, 0, 255).astype(np.uint8)

    # --- 5) feather left/top edges to transparent (alpha channel) ---
    h, w = composed.shape[:2]
    xx = np.arange(w, dtype=np.float32) / w
    yy = np.arange(h, dtype=np.float32) / h
    ramp_x = np.clip((xx - 0.0) / 0.30, 0, 1)
    ramp_y = np.clip((yy - 0.0) / 0.22, 0, 1)
    alpha = np.outer(ramp_y, ramp_x)
    # smoothstep easing
    alpha = alpha * alpha * (3 - 2 * alpha)
    alpha_u8 = (alpha * 255).astype(np.uint8)

    bgra = cv2.cvtColor(composed, cv2.COLOR_BGR2BGRA)
    bgra[:, :, 3] = alpha_u8

    cv2.imwrite(FINAL_PNG, bgra)
    print("wrote", DEBUG_OUT)
    print("wrote", FINAL_PNG)

    # --- 6) export optimized WebP (RGBA) via Pillow, only for the live site ---
    if WRITE_PUBLIC_WEBP:
        rgba = cv2.cvtColor(bgra, cv2.COLOR_BGRA2RGBA)
        # q95 avoids visible banding in the dark gradient / beam area (q82 measurably
        # reduced the number of distinct luminance levels there vs the lossless PNG)
        Image.fromarray(rgba).save(FINAL_WEBP, "WEBP", quality=95, method=6)
        print("wrote", FINAL_WEBP)


if __name__ == "__main__":
    main()
