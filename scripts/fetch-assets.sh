#!/usr/bin/env bash
# Скачивает публичные ассеты исходного лендинга snapbuild.ru в public/assets,
# даёт им читаемые имена и уменьшает исходники шириной > 1600px (в оригинале
# часть картинок отдаётся в 5760px — для лендинга это избыточно).
#
# Запускать один раз: bash scripts/fetch-assets.sh
# Требуется: curl и sips (входит в macOS). На Linux замените sips на ImageMagick.
set -euo pipefail

SRC="https://snapbuild.ru/assets/images"
OUT="public/assets/images"
MAX_WIDTH=1600

mkdir -p "$OUT"

# исходное имя  ->  читаемое имя
FILES=(
  "582db07d8ccd60da.svg|logo-snapbuild.svg"
  "5cd01de0b6a5e001.svg|logo-ozon.svg"
  "ee341193d7cf46d6.svg|logo-t2.svg"
  "logo-avito.svg|logo-avito.svg"
  "logo-cian.svg|logo-cian.svg"
  "logo-lenta.svg|logo-lenta.svg"
  "a4ce0581ce7807b6.svg|icon-check.svg"
  "favicon.svg|favicon.svg"
  "favicon.png|favicon.png"
  "apple-touch-icon.png|apple-touch-icon.png"

  "hero-snapbuild-2026-08-07-v2.webp|hero-app.webp"

  "84a4450b3827bc21.webp|process-design-system.webp"
  "process-flexible-configuration.webp|process-configuration.webp"
  "afe03eb4a67d5dfb.webp|process-compliance.webp"

  "use-cases-tab1-item1-v2.webp|use-cases-sites-1.webp"
  "use-cases-tab1-item2.webp|use-cases-sites-2.webp"
  "use-cases-tab1-item3.webp|use-cases-sites-3.webp"
  "use-cases-web-04.webp|use-cases-sites-4.webp"
  "use-cases-img-01.webp|use-cases-images-1.webp"
  "use-cases-tab2-item2.webp|use-cases-images-2.webp"
  "use-cases-tab2-item3.webp|use-cases-images-3.webp"
  "use-cases-tab2-item4.webp|use-cases-images-4.webp"
  "use-cases-vid-01.webp|use-cases-video-1.webp"
  "use-cases-tab3-item2.webp|use-cases-video-2.webp"
  "use-cases-tab3-item3.webp|use-cases-video-3.webp"
  "use-cases-tab3-item4.webp|use-cases-video-4.webp"
  "use-cases-tab4-item1.webp|use-cases-banners-1.webp"
  "use-cases-tab4-item2.webp|use-cases-banners-2.webp"
  "use-cases-tab4-item3.webp|use-cases-banners-3.webp"
  "use-cases-tab4-item4.webp|use-cases-banners-4.webp"
  "use-cases-pres-01.jpg|use-cases-decks-1.jpg"
  "use-cases-tab5-item2.webp|use-cases-decks-2.webp"
  "use-cases-tab5-item3.webp|use-cases-decks-3.webp"
  "use-cases-tab5-item4.webp|use-cases-decks-4.webp"

  "security-approved-models.webp|security-models.webp"
  "security-private-cloud.webp|security-cloud.webp"
  "security-ai-stack.webp|security-stack.webp"

  "c3714c375a04149c.webp|cta-aurora-desktop.webp"
  "f38670cf14e4b7dd.webp|cta-aurora-tablet.webp"
  "a4285c4b0717be2b.webp|cta-aurora-mobile.webp"
)

for pair in "${FILES[@]}"; do
  src="${pair%%|*}"
  dst="${pair##*|}"
  if [ -f "$OUT/$dst" ]; then
    echo "skip  $dst"
    continue
  fi
  echo "fetch $src -> $dst"
  curl -sfL "$SRC/$src" -o "$OUT/$dst"
done

# Уменьшаем растровые исходники шире MAX_WIDTH
for f in "$OUT"/*.webp "$OUT"/*.jpg "$OUT"/*.png; do
  [ -f "$f" ] || continue
  w=$(sips -g pixelWidth "$f" | awk '/pixelWidth/{print $2}')
  if [ -n "$w" ] && [ "$w" -gt "$MAX_WIDTH" ]; then
    sips --resampleWidth "$MAX_WIDTH" "$f" >/dev/null
    echo "resize $(basename "$f") $w -> $MAX_WIDTH"
  fi
done

echo "готово: $(du -sh "$OUT" | cut -f1) в $OUT"
