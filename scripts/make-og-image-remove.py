"""
Generate the arche.remove Open Graph image (1200×630 PNG).
Light theme variant to match the default.
"""
import os
from matplotlib.patches import FancyBboxPatch, Circle, Rectangle
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

plt.rcParams['font.sans-serif'] = ['DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

OUT = "/home/z/my-project/variants/remove/og-image.png"

# Light warm minimalist palette
BG = "#FAFAF7"
SURFACE = "#FFFFFF"
SURFACE_ELEVATED = "#F5F3EE"
BORDER = "#E8E5DD"
TEXT = "#1A1A1F"
MUTED = "#6B6B73"
AMBER = "#B8754A"
CREAM = "#C9944F"

W, H = 1200, 630

fig, ax = plt.subplots(figsize=(W / 100, H / 100), dpi=100)
ax.set_xlim(0, W)
ax.set_ylim(0, H)
ax.invert_yaxis()
ax.set_axis_off()
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)

glow = mpatches.Ellipse((200, -40), width=900, height=400, facecolor=AMBER, alpha=0.06, zorder=1)
ax.add_patch(glow)
glow2 = mpatches.Ellipse((1100, 50), width=500, height=300, facecolor=CREAM, alpha=0.04, zorder=1)
ax.add_patch(glow2)

# Brand mark
brand_box = FancyBboxPatch((60, 50), 60, 60, boxstyle="round,pad=2,rounding_size=14",
                           facecolor="#1b1b1f", edgecolor="#1b1b1f", linewidth=1.5, zorder=5)
ax.add_patch(brand_box)
ax.add_patch(Circle((78, 80), radius=6, color=AMBER, zorder=6))
ax.add_patch(Circle((102, 80), radius=6, fill=False, edgecolor="#F5F5F7", linewidth=2, zorder=6))
ax.plot([78, 102], [80, 80], color="#e6b87a", linewidth=2, zorder=6)

ax.text(140, 75, "arche.remove", fontsize=22, color=TEXT, weight="bold",
        ha="left", va="center", zorder=6, family="DejaVu Sans")
ax.text(140, 100, "Local · Private · Free", fontsize=11, color=MUTED,
        ha="left", va="center", zorder=6, family="DejaVu Sans")

# Tagline
ax.text(60, 200, "Remove backgrounds.\nKeep everything else.",
        fontsize=64, color=TEXT, weight="bold", ha="left", va="top", zorder=6,
        family="DejaVu Sans", linespacing=1.05)
ax.text(60, 350, "100% in your browser. No server uploads. No sign-up.",
        fontsize=22, color=MUTED, ha="left", va="top", zorder=6, family="DejaVu Sans")

badges = ["100% in browser", "No sign-up", "No limits", "No watermark"]
bx = 60
for b in badges:
    w = len(b) * 8 + 60
    box = FancyBboxPatch((bx, 430), w, 44, boxstyle="round,pad=2,rounding_size=22",
                         facecolor=SURFACE, edgecolor=BORDER, linewidth=1, zorder=5)
    ax.add_patch(box)
    ax.text(bx + w / 2, 452, b, fontsize=14, color=MUTED,
            ha="center", va="center", zorder=6, family="DejaVu Sans")
    bx += w + 14

# Right side: stylised before/after thumbnail
RIGHT_X = 800
THUMB_W = 360
THUMB_H = 360
THUMB_Y = 150

thumb_box = FancyBboxPatch((RIGHT_X, THUMB_Y), THUMB_W, THUMB_H,
                           boxstyle="round,pad=2,rounding_size=20",
                           facecolor=SURFACE, edgecolor=BORDER, linewidth=1.5, zorder=4)
ax.add_patch(thumb_box)

ax.add_patch(Rectangle((RIGHT_X, THUMB_Y), THUMB_W / 2, THUMB_H,
                       facecolor="#C9944F", edgecolor="none", zorder=5))
ax.add_patch(Circle((RIGHT_X + THUMB_W / 4, THUMB_Y + THUMB_H / 2),
                    radius=70, facecolor="#3a3a42", edgecolor="none", zorder=6))

sq = 18
for j in range(0, int(THUMB_W / 2), sq):
    for k in range(0, THUMB_H, sq):
        c = "#F5F3EE" if ((j // sq) + (k // sq)) % 2 == 0 else "#FFFFFF"
        ax.add_patch(Rectangle((RIGHT_X + THUMB_W / 2 + j, THUMB_Y + k), sq, sq,
                               facecolor=c, edgecolor="none", zorder=5))
ax.add_patch(Circle((RIGHT_X + THUMB_W * 3 / 4, THUMB_Y + THUMB_H / 2),
                    radius=70, facecolor="#3a3a42", edgecolor="none", zorder=6))

sx = RIGHT_X + THUMB_W / 2
ax.plot([sx, sx], [THUMB_Y, THUMB_Y + THUMB_H], color=TEXT, linewidth=2, zorder=8)
ax.add_patch(Circle((sx, THUMB_Y + THUMB_H / 2), 22, color=TEXT, zorder=9))
ax.add_patch(Circle((sx, THUMB_Y + THUMB_H / 2), 22, fill=False,
                    edgecolor="#FAFAF7", linewidth=2, zorder=10))
ax.text(sx - 7, THUMB_Y + THUMB_H / 2, "‹", color="#FAFAF7", fontsize=18,
        weight="bold", ha="center", va="center", zorder=11)
ax.text(sx + 7, THUMB_Y + THUMB_H / 2, "›", color="#FAFAF7", fontsize=18,
        weight="bold", ha="center", va="center", zorder=11)

ax.text(RIGHT_X + 14, THUMB_Y + 16, "ORIGINAL", fontsize=9, color="#FAFAF7",
        weight="bold", ha="left", va="top", zorder=11, family="DejaVu Sans")
ax.text(RIGHT_X + THUMB_W - 14, THUMB_Y + 16, "RESULT", fontsize=9, color=AMBER,
        weight="bold", ha="right", va="top", zorder=11, family="DejaVu Sans")

ax.text(60, 560, "Made with ♥ by Arche — arche-projects.pages.dev",
        fontsize=14, color=MUTED, ha="left", va="center", zorder=6, family="DejaVu Sans")

plt.savefig(OUT, facecolor=BG, dpi=100, bbox_inches=None, pad_inches=0)
plt.close()
print(f"Wrote {OUT}")
print(f"Size: {os.path.getsize(OUT)} bytes")
