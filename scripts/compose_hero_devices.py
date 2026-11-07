"""
Compose real screenshots into the green-screen device render for /paginas-web hero.

Setup (one-time, outside the repo):
    python3 -m venv ~/.venvs/delta-paginas-web-cv
    source ~/.venvs/delta-paginas-web-cv/bin/activate
    pip install opencv-python-headless numpy pillow

Run:
    source ~/.venvs/delta-paginas-web-cv/bin/activate
    python3 scripts/compose_hero_devices.py

Inputs:
    _ref/devices-hero.png                   - green-screen laptop+phone render
    _ref/casos-source/lapuerta-laptop.png   - 1440x900 desktop screenshot (2x = 2880x1800)
    _ref/casos-source/lapuerta-mobile.png   - 390x844 mobile screenshot (2x = 780x1688)

Outputs:
    _ref/devices-debug-corners.png   - corner/quad overlay for visual verification
    public/paginas-web/devices-hero.webp - final composed RGBA image used by the Hero
"""
import cv2
import numpy as np
from PIL import Image

SRC = "_ref/devices-hero.png"
DESKTOP_SHOT = "_ref/casos-source/lapuerta-laptop.png"
MOBILE_SHOT = "_ref/casos-source/lapuerta-mobile.png"
DEBUG_OUT = "_ref/devices-debug-corners.png"
FINAL_PNG = "_ref/devices-composed.png"
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


def extreme_point(contour, key):
    pts = contour.reshape(-1, 2)
    idx = np.argmax([key(p[0], p[1]) for p in pts])
    return pts[idx].astype(np.float64)


def fit_line_xy(points):
    """Fit x = a*y + b from (y, x) samples via least squares."""
    ys = points[:, 0]
    xs = points[:, 1]
    A = np.vstack([ys, np.ones_like(ys)]).T
    a, b = np.linalg.lstsq(A, xs, rcond=None)[0]
    return a, b  # x = a*y + b


def laptop_corners(contour, mask):
    pts = contour.reshape(-1, 2)
    tl = extreme_point(contour, lambda x, y: -(x + y))
    tr = extreme_point(contour, lambda x, y: (x - y))
    bl = extreme_point(contour, lambda x, y: (y - x))

    # Right edge profile: for each row y in the upper half (unoccluded by phone),
    # take the max x of the mask in that row -> points on the true right edge.
    y_top = int(tl[1])
    y_bottom = int(bl[1])
    y_mid = y_top + int(0.55 * (y_bottom - y_top))
    right_pts = []
    for y in range(y_top + 5, y_mid):
        row = np.where(mask[y] > 0)[0]
        if row.size:
            right_pts.append((y, row.max()))
    right_pts = np.array(right_pts, dtype=np.float64)
    a_r, b_r = fit_line_xy(right_pts)  # x = a_r*y + b_r

    # Bottom edge profile: for each column x in the left half (unoccluded by phone),
    # take the max y of the mask in that column -> points on the true bottom edge.
    x_left = int(tl[0])
    x_right = int(tr[0])
    x_mid = x_left + int(0.5 * (x_right - x_left))
    bottom_pts = []
    for x in range(x_left + 5, x_mid):
        col = np.where(mask[:, x] > 0)[0]
        if col.size:
            bottom_pts.append((col.max(), x))
    bottom_pts = np.array(bottom_pts, dtype=np.float64)
    # fit x = c*y + d too (same form), but here we sampled (y=col.max(), x=x) i.e. (bottom_y, x)
    # we want y as function of x: y = c*x + d
    xs = bottom_pts[:, 1]
    ys = bottom_pts[:, 0]
    A = np.vstack([xs, np.ones_like(xs)]).T
    c, d = np.linalg.lstsq(A, ys, rcond=None)[0]  # y = c*x + d

    # Intersect: x = a_r*y + b_r  and y = c*x + d
    # x = a_r*(c*x + d) + b_r  => x*(1 - a_r*c) = a_r*d + b_r
    x_br = (a_r * d + b_r) / (1 - a_r * c)
    y_br = c * x_br + d
    br = np.array([x_br, y_br])

    return tl, tr, bl, br


def phone_corners(contour):
    hull = cv2.convexHull(contour).reshape(-1, 2)
    tl = hull[np.argmin(hull[:, 0] + hull[:, 1])].astype(np.float64)
    tr = hull[np.argmax(hull[:, 0] - hull[:, 1])].astype(np.float64)
    bl = hull[np.argmax(hull[:, 1] - hull[:, 0])].astype(np.float64)
    br = hull[np.argmax(hull[:, 0] + hull[:, 1])].astype(np.float64)
    return tl, tr, bl, br


def order_quad(tl, tr, bl, br):
    return np.array([tl, tr, br, bl], dtype=np.float32)


def warp_into(src_img, dst_quad, canvas_shape):
    h, w = src_img.shape[:2]
    src_quad = np.array([[0, 0], [w, 0], [w, h], [0, h]], dtype=np.float32)
    M = cv2.getPerspectiveTransform(src_quad, dst_quad.astype(np.float32))
    warped = cv2.warpPerspective(
        src_img, M, (canvas_shape[1], canvas_shape[0]),
        flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0),
    )
    return warped


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

    tl, tr, bl, br = laptop_corners(laptop_cnt, laptop_mask)
    laptop_quad = order_quad(tl, tr, bl, br)

    ptl, ptr, pbl, pbr = phone_corners(phone_cnt)
    phone_quad = order_quad(ptl, ptr, pbl, pbr)

    debug = img.copy()
    draw_quad(debug, laptop_quad, (0, 0, 255))
    draw_quad(debug, phone_quad, (255, 0, 0))
    cv2.imwrite(DEBUG_OUT, debug)

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
    phone_alpha = soft_alpha(phone_mask)[:, :, None]

    composed = base.astype(np.float32)
    composed = composed * (1 - lap_alpha) + warped_laptop.astype(np.float32) * lap_alpha
    composed = composed * (1 - phone_alpha) + warped_phone.astype(np.float32) * phone_alpha
    composed = np.clip(composed, 0, 255).astype(np.uint8)

    # --- 3) subtle diagonal sheen over each screen ---
    composed = add_sheen(composed, laptop_mask, strength=0.08)
    composed = add_sheen(composed, phone_mask, strength=0.06)

    # --- 4) soft halo around the laptop silhouette ---
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    x_limit = int(phone_quad[:, 0].min()) + 10
    body = laptop_body_mask(gray, laptop_mask, x_limit)
    halo_src = cv2.dilate(body, np.ones((25, 25), np.uint8), iterations=1)
    halo = cv2.GaussianBlur(halo_src, (0, 0), sigmaX=35)
    halo_f = (halo.astype(np.float32) / 255.0) * 0.16
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

    # --- 6) export optimized WebP (RGBA) via Pillow ---
    rgba = cv2.cvtColor(bgra, cv2.COLOR_BGRA2RGBA)
    # q95 avoids visible banding in the dark gradient / beam area (q82 measurably
    # reduced the number of distinct luminance levels there vs the lossless PNG)
    Image.fromarray(rgba).save(FINAL_WEBP, "WEBP", quality=95, method=6)
    print("wrote", FINAL_WEBP)


if __name__ == "__main__":
    main()
