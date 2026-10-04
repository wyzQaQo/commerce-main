"""
Process factory photos: crop watermark strip, remove vest-back logos naturally.
Output: public/images/factory/factory-01.jpg ... factory-10.jpg
"""
from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "images" / "factory"
SRC_DIR = Path(r"e:\google下载")

SOURCES = [
    SRC_DIR / "imageye___-_imgi_61_O1CN01ZohXcq2CtFnDxLg3r_!!3417158531-2-cbucrm.png",
    SRC_DIR / "imageye___-_imgi_15_O1CN01OVvb8F2CtFnEbJ0t3_!!3417158531-0-cbucrm.jpg_Q75.jpg_.webp",
    SRC_DIR / "imageye___-_imgi_57_O1CN01jJMWW81yF2P0sm4iE_!!961496548-0-cbucrm.jpg",
    SRC_DIR / "imageye___-_imgi_14_O1CN01CgzW7q2CtFnDDTOMP_!!3417158531-0-cbucrm.jpg_Q75.jpg_.webp",
    SRC_DIR / "imageye___-_imgi_16_O1CN01nNq5uT2CtFn4DRj4X_!!3417158531-0-cbucrm.jpg_Q75.jpg_.webp",
    SRC_DIR / "imageye___-_imgi_12_O1CN01mubhzd1yF2UR6NuOU_!!961496548-0-cbucrm.jpg_Q75.jpg",
    SRC_DIR / "imageye___-_imgi_10_O1CN01AmX3MG1yF2URZVhu0_!!961496548-0-cbucrm.jpg_Q75.jpg",
    SRC_DIR / "imageye___-_imgi_9_O1CN01ksvlu31yF2OyfPJoe_!!961496548-0-cbucrm.jpg_Q75.jpg",
    SRC_DIR / "imageye___-_imgi_11_O1CN01t4dUCE1yF2UPy1e2Y_!!961496548-0-cbucrm.jpg_Q75.jpg",
    SRC_DIR / "imageye___-_imgi_13_O1CN01j2VWuH2CtFnBuXTvx_!!3417158531-0-cbucrm.jpg_Q75.jpg_.webp",
]

# crop_bottom: keep top fraction (removes 工厂实拍 strip)
# logos: box=logo area, donor=clean vest patch, mode=natural|solid
REGIONS: dict[int, dict] = {
    1: {"crop_bottom": 0.74, "logos": []},
    2: {"crop_bottom": 1.0, "logos": []},
    3: {"crop_bottom": 1.0, "logos": []},
    4: {"crop_bottom": 1.0, "logos": []},
    5: {"crop_bottom": 0.97, "logos": [{"box": (0.36, 0.18, 0.60, 0.34), "mode": "solid"}]},
    6: {"crop_bottom": 0.97, "logos": [{"box": (0.38, 0.14, 0.60, 0.30), "mode": "solid"}]},
    7: {"crop_bottom": 0.97, "logos": []},
    8: {
        "crop_bottom": 0.97,
        "logos": [
            {"box": (0.40, 0.18, 0.58, 0.34), "mode": "solid"},
            {"box": (0.64, 0.20, 0.80, 0.36), "mode": "solid"},
        ],
    },
    9: {"crop_bottom": 0.97, "logos": [{"box": (0.36, 0.16, 0.62, 0.32), "mode": "solid"}]},
    10: {"crop_bottom": 0.97, "logos": []},
}


def load_rgb(path: Path) -> np.ndarray:
    return np.array(Image.open(path).convert("RGB"))


def frac_rect(h: int, w: int, box: tuple[float, float, float, float]) -> tuple[int, int, int, int]:
    x1, y1, x2, y2 = box
    return int(x1 * w), int(y1 * h), int(x2 * w), int(y2 * h)


def crop_bottom(img: np.ndarray, keep_ratio: float) -> np.ndarray:
    if keep_ratio >= 1.0:
        return img
    h = int(img.shape[0] * keep_ratio)
    return img[:h, :].copy()


def _edge_feather_mask(h: int, w: int, border: int, softness: int = 15) -> np.ndarray:
    """Full-area mask that only fades at the outer border (rectangular logo coverage)."""
    mask = np.ones((h, w), dtype=np.float32)
    b = max(6, min(border, min(h, w) // 4))
    for i in range(b):
        t = (i + 1) / b
        mask[i, :] *= t
        mask[h - 1 - i, :] *= t
        mask[:, i] *= t
        mask[:, w - 1 - i] *= t
    k = softness | 1
    return cv2.GaussianBlur(mask, (k, k), 0)


def _resize_patch(donor: np.ndarray, target_h: int, target_w: int) -> np.ndarray:
    return cv2.resize(donor, (target_w, target_h), interpolation=cv2.INTER_CUBIC)


def _sample_vest_green(roi: np.ndarray, mask: np.ndarray) -> np.ndarray:
    g = roi[:, :, 1].astype(np.int16)
    r = roi[:, :, 0].astype(np.int16)
    b = roi[:, :, 2].astype(np.int16)
    green_ref = (g > r + 8) & (g > b + 8) & (g > 85) & mask
    if green_ref.sum() < 30:
        green_ref = mask
    return np.median(roi[green_ref].reshape(-1, 3), axis=0).astype(np.uint8)


def _ink_mask(roi: np.ndarray, threshold: int = 82, *, require_green: bool = False) -> np.ndarray:
    gray = cv2.cvtColor(roi, cv2.COLOR_RGB2GRAY)
    ink = gray < threshold
    if require_green:
        g = roi[:, :, 1].astype(np.int16)
        r = roi[:, :, 0].astype(np.int16)
        b = roi[:, :, 2].astype(np.int16)
        near_green = (g >= r - 10) & (g >= b - 10)
        ink = ink & near_green
    return cv2.dilate(ink.astype(np.uint8), np.ones((2, 2), np.uint8), iterations=1).astype(bool)


def _match_patch_tone(patch: np.ndarray, reference: np.ndarray) -> np.ndarray:
    pm = patch.reshape(-1, 3).astype(np.float32).mean(axis=0)
    rm = reference.reshape(-1, 3).astype(np.float32).mean(axis=0)
    scale = rm / np.maximum(pm, 1.0)
    return np.clip(patch.astype(np.float32) * scale, 0, 255).astype(np.uint8)


def _fix_mask(original: np.ndarray, patch: np.ndarray, *, ink_only: bool) -> np.ndarray:
    ink = _ink_mask(original, threshold=108)
    ink = cv2.dilate(ink.astype(np.uint8), np.ones((2, 2), np.uint8), iterations=1).astype(bool)
    if ink_only:
        return ink

    gray_o = cv2.cvtColor(original, cv2.COLOR_RGB2GRAY)
    gray_p = cv2.cvtColor(patch, cv2.COLOR_RGB2GRAY)
    embossed = (gray_o.astype(np.int16) - gray_p.astype(np.int16)) < -10
    return ink | embossed | np.ones(ink.shape, dtype=bool)


def remove_vest_natural(
    img: np.ndarray,
    box: tuple[float, float, float, float],
    donor_box: tuple[float, float, float, float],
    *,
    ink_only: bool = True,
) -> None:
    """Mesh vests: replace ink pixels only. Solid panels: full patch with thin edge blend."""
    h, w = img.shape[:2]
    lx1, ly1, lx2, ly2 = frac_rect(h, w, box)
    dx1, dy1, dx2, dy2 = frac_rect(h, w, donor_box)
    lh, lw = ly2 - ly1, lx2 - lx1
    if lh < 4 or lw < 4:
        return

    donor = img[dy1:dy2, dx1:dx2]
    if donor.size == 0:
        return

    original = img[ly1:ly2, lx1:lx2].copy()
    patch = _match_patch_tone(_resize_patch(donor, lh, lw), original)
    fix = _fix_mask(original, patch, ink_only=ink_only)

    blended = original.copy()
    blended[fix] = patch[fix]

    if not ink_only:
        border = max(5, min(lh, lw) // 16)
        alpha = _edge_feather_mask(lh, lw, border, softness=9)[..., np.newaxis]
        full = (patch.astype(np.float32) * alpha + original.astype(np.float32) * (1.0 - alpha)).astype(np.uint8)
        inner = border + 1
        blended = full
        blended[inner : lh - inner, inner : lw - inner] = patch[inner : lh - inner, inner : lw - inner]

    img[ly1:ly2, lx1:lx2] = blended


def _logo_ink_mask(roi: np.ndarray, threshold: int = 62) -> np.ndarray:
    """Black print only — mesh holes are brighter than ink."""
    gray = cv2.cvtColor(roi, cv2.COLOR_RGB2GRAY)
    ink = gray < threshold
    ink = cv2.morphologyEx(ink.astype(np.uint8), cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
    ink = cv2.dilate(ink, np.ones((2, 2), np.uint8), iterations=1)
    return ink.astype(bool)


def remove_vest_inpaint(
    img: np.ndarray,
    box: tuple[float, float, float, float],
    *,
    threshold: int = 62,
    radius: int = 2,
    passes: int = 2,
) -> None:
    """Remove logo ink strokes only — preserves surrounding mesh texture."""
    h, w = img.shape[:2]
    x1, y1, x2, y2 = frac_rect(h, w, box)
    roi = img[y1:y2, x1:x2]
    if roi.size == 0:
        return

    for _ in range(passes):
        clean = _logo_ink_mask(roi, threshold)
        if not clean.any():
            break
        mask = np.zeros((h, w), dtype=np.uint8)
        mask[y1:y2, x1:x2] = clean.astype(np.uint8) * 255
        bgr = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
        cleaned = cv2.inpaint(bgr, mask, inpaintRadius=radius, flags=cv2.INPAINT_TELEA)
        img[:] = cv2.cvtColor(cleaned, cv2.COLOR_BGR2RGB)
        roi = img[y1:y2, x1:x2]


def _vest_green_ratio(patch: np.ndarray) -> float:
    g = patch[:, :, 1].astype(np.int16)
    r = patch[:, :, 0].astype(np.int16)
    b = patch[:, :, 2].astype(np.int16)
    green = (g > r + 8) & (g > b + 8) & (g > 85)
    return float(green.mean())


def remove_vest_smart_shift(
    img: np.ndarray,
    box: tuple[float, float, float, float],
    *,
    border: int = 4,
    ink_threshold: int = 70,
) -> None:
    """Auto-pick a nearby clean vest patch and shift it over the logo."""
    h, w = img.shape[:2]
    lx1, ly1, lx2, ly2 = frac_rect(h, w, box)
    lh, lw = ly2 - ly1, lx2 - lx1
    if lh < 8 or lw < 8:
        return

    best_patch: np.ndarray | None = None
    best_score = -1.0
    shift_candidates = [(sy, 0.0) for sy in (-0.04, -0.06, -0.08, -0.10, -0.12, -0.14, -0.16)]

    for sy, sx in shift_candidates:
            oy = ly1 + int(sy * h)
            ox = lx1 + int(sx * w)
            if oy < 0 or oy + lh > h or ox < 0 or ox + lw > w:
                continue
            patch = img[oy : oy + lh, ox : ox + lw]
            score = _vest_green_ratio(patch)
            if score > best_score:
                best_score = score
                best_patch = patch.copy()

    if best_patch is None or best_score < 0.35:
        return

    original = img[ly1:ly2, lx1:lx2].astype(np.float32)
    alpha = _edge_feather_mask(lh, lw, border, softness=5)[..., np.newaxis]
    blended = (best_patch.astype(np.float32) * alpha + original * (1.0 - alpha)).astype(np.uint8)

    ink = _logo_ink_mask(blended, ink_threshold)
    ink = cv2.dilate(ink.astype(np.uint8), np.ones((2, 2), np.uint8), iterations=1).astype(bool)
    if ink.any():
        blended[ink] = best_patch[ink]

    img[ly1:ly2, lx1:lx2] = blended


def remove_vest_texture_clone(
    img: np.ndarray,
    box: tuple[float, float, float, float],
    donor_box: tuple[float, float, float, float],
    *,
    feather: int = 8,
    post_ink: bool = True,
    ink_threshold: int = 68,
) -> None:
    """Copy clean vest fabric from donor patch and Poisson-blend over logo area."""
    h, w = img.shape[:2]
    lx1, ly1, lx2, ly2 = frac_rect(h, w, box)
    dx1, dy1, dx2, dy2 = frac_rect(h, w, donor_box)
    lh, lw = ly2 - ly1, lx2 - lx1
    if lh < 8 or lw < 8:
        return

    donor = img[dy1:dy2, dx1:dx2]
    if donor.size == 0:
        return

    original = img[ly1:ly2, lx1:lx2].copy()
    patch = _match_patch_tone(_resize_patch(donor, lh, lw), original)

    dst_bgr = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    src_bgr = cv2.cvtColor(patch, cv2.COLOR_RGB2BGR)
    alpha = _edge_feather_mask(lh, lw, feather, softness=7)
    mask = (alpha * 255).astype(np.uint8)
    center = (lx1 + lw // 2, ly1 + lh // 2)

    try:
        blended_bgr = cv2.seamlessClone(src_bgr, dst_bgr, mask, center, cv2.NORMAL_CLONE)
    except cv2.error:
        roi = dst_bgr[ly1:ly2, lx1:lx2].astype(np.float32)
        a = alpha[..., np.newaxis]
        dst_bgr[ly1:ly2, lx1:lx2] = (src_bgr.astype(np.float32) * a + roi * (1.0 - a)).astype(np.uint8)
        blended_bgr = dst_bgr

    result = cv2.cvtColor(blended_bgr, cv2.COLOR_BGR2RGB)
    roi = result[ly1:ly2, lx1:lx2].copy()

    if post_ink:
        ink = _logo_ink_mask(roi, ink_threshold)
        if ink.any():
            roi[ink] = patch[ink]

    result[ly1:ly2, lx1:lx2] = roi
    img[:] = result


def remove_vest_shift(
    img: np.ndarray,
    box: tuple[float, float, float, float],
    *,
    shift_y: float = 0.0,
    shift_x: float = 0.0,
    border: int = 5,
) -> None:
    """Direct vertical/horizontal shift of clean fabric onto logo (true 平移)."""
    h, w = img.shape[:2]
    lx1, ly1, lx2, ly2 = frac_rect(h, w, box)
    lh, lw = ly2 - ly1, lx2 - lx1
    sy1 = ly1 + int(shift_y * h)
    sy2 = sy1 + lh
    sx1 = lx1 + int(shift_x * w)
    sx2 = sx1 + lw
    if sy1 < 0 or sy2 > h or sx1 < 0 or sx2 > w or lh < 8 or lw < 8:
        return

    original = img[ly1:ly2, lx1:lx2].astype(np.float32)
    patch = img[sy1:sy2, sx1:sx2].astype(np.float32)
    alpha = _edge_feather_mask(lh, lw, border, softness=5)[..., np.newaxis]
    img[ly1:ly2, lx1:lx2] = (patch * alpha + original * (1.0 - alpha)).astype(np.uint8)


def remove_vest_ink_fill(
    img: np.ndarray,
    box: tuple[float, float, float, float],
    donor_box: tuple[float, float, float, float],
    *,
    threshold: int = 65,
) -> None:
    """Fill ink pixels with clean donor fabric — no whole-patch mosaic."""
    h, w = img.shape[:2]
    lx1, ly1, lx2, ly2 = frac_rect(h, w, box)
    dx1, dy1, dx2, dy2 = frac_rect(h, w, donor_box)
    lh, lw = ly2 - ly1, lx2 - lx1
    if lh < 4 or lw < 4:
        return

    donor = img[dy1:dy2, dx1:dx2]
    if donor.size == 0:
        return

    original = img[ly1:ly2, lx1:lx2].copy()
    patch = _match_patch_tone(_resize_patch(donor, lh, lw), original)
    ink = _logo_ink_mask(original, threshold)
    out = original.copy()
    out[ink] = patch[ink]
    img[ly1:ly2, lx1:lx2] = out


def remove_vest_solid(img: np.ndarray, box: tuple[float, float, float, float]) -> None:
    h, w = img.shape[:2]
    x1, y1, x2, y2 = frac_rect(h, w, box)
    roi = img[y1:y2, x1:x2]
    rh, rw = roi.shape[:2]
    if roi.size == 0:
        return

    margin = max(2, min(rh, rw) // 24)
    edge_mask = np.ones((rh, rw), dtype=bool)
    edge_mask[margin : rh - margin, margin : rw - margin] = False
    fill = _sample_vest_green(roi, edge_mask)
    inner = roi[margin : rh - margin, margin : rw - margin]
    inner[:] = fill
    noise = np.random.default_rng(42).integers(-5, 6, inner.shape, endpoint=True)
    inner[:] = np.clip(inner.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    img[y1:y2, x1:x2] = roi


def remove_vest_logo(img: np.ndarray, entry: dict) -> None:
    box = entry["box"]
    mode = entry.get("mode", "solid")
    if mode == "inpaint":
        remove_vest_inpaint(
            img,
            box,
            threshold=entry.get("threshold", 62),
            radius=entry.get("radius", 2),
        )
        return
    if mode == "smart_shift":
        remove_vest_smart_shift(
            img,
            box,
            border=entry.get("border", 4),
            ink_threshold=entry.get("threshold", 70),
        )
        return
    if mode == "clone":
        donor = entry.get("donor")
        if donor:
            remove_vest_texture_clone(
                img,
                box,
                donor,
                feather=entry.get("feather", 8),
                post_ink=entry.get("post_ink", True),
                ink_threshold=entry.get("threshold", 68),
            )
        return
    if mode == "shift":
        remove_vest_shift(
            img,
            box,
            shift_y=entry.get("shift_y", 0.0),
            shift_x=entry.get("shift_x", 0.0),
            border=entry.get("border", 5),
        )
        return
    if mode == "ink_fill":
        donor = entry.get("donor")
        if donor:
            remove_vest_ink_fill(img, box, donor, threshold=entry.get("threshold", 65))
        return
    if mode == "natural":
        donor = entry.get("donor")
        if donor:
            remove_vest_natural(img, box, donor, ink_only=entry.get("ink_only", True))
        return
    remove_vest_solid(img, box)


def process(img: np.ndarray, idx: int) -> np.ndarray:
    cfg = REGIONS.get(idx, {})
    out = crop_bottom(img, cfg.get("crop_bottom", 1.0))
    for entry in cfg.get("logos", []):
        remove_vest_logo(out, entry)
    return out


def save_jpg(img: np.ndarray, path: Path, max_side: int = 1920, quality: int = 90) -> None:
    h, w = img.shape[:2]
    scale = min(1.0, max_side / max(h, w))
    if scale < 1.0:
        img = cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
    Image.fromarray(img).save(path, "JPEG", quality=quality, optimize=True)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for i, src in enumerate(SOURCES, start=1):
        if not src.exists():
            raise FileNotFoundError(src)
        print(f"Processing {i}/10: {src.name}")
        cleaned = process(load_rgb(src), i)
        out = OUT_DIR / f"factory-{i:02d}.jpg"
        save_jpg(cleaned, out)
        print(f"  -> {out} ({out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
