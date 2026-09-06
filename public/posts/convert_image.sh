#!/usr/bin/env bash
# 画像（.jpg, .jpeg, .png 等）をまとめてWebPに変換するスクリプト
#
# 使い方:
#   chmod +x convert_image.sh
#   ./convert_image.sh               # カレントディレクトリ配下を処理
#   ./convert_image.sh /path/to/dir  # 指定ディレクトリ配下を処理
#   ./convert_image.sh -d /path/to/dir
#   ./convert_image.sh /path/to/image.jpg # 単一ファイルを処理
#
# 環境変数:
#   DRY_RUN=1          -> 実行せずコマンド表示
#   QUALITY=80         -> 出力品質（デフォルト80）
#   MAXSIZE=1920x1920> -> リサイズ指定（デフォルト '1920x1920>'）

set -euo pipefail
IFS=$'\n\t'

DRY_RUN=${DRY_RUN:-0}
QUALITY=${QUALITY:-80}
MAXSIZE=${MAXSIZE:-'1920x1920>'}
TARGET_PATH='.'

usage() {
  cat <<EOF
Usage: $(basename "$0") [PATH] | -d PATH
  PATH: 対象ディレクトリまたは画像ファイル（省略時はカレントディレクトリ）
Environment:
  DRY_RUN=1          実行せずコマンド表示
  QUALITY=80         出力品質（デフォルト80）
  MAXSIZE=1920x1920> リサイズ指定（デフォルト '1920x1920>')
EOF
}

# 引数解析（-d/--dir または 位置引数）
while [ $# -gt 0 ]; do
  case "$1" in
    -d|--dir)
      if [ -z "${2:-}" ]; then
        echo "Error: ディレクトリを指定してください。" >&2
        usage
        exit 2
      fi
      TARGET_PATH="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --) shift; break ;;
    -*)
      echo "Unknown option: $1" >&2
      usage
      exit 2
      ;;
    *)
      TARGET_PATH="$1"
      shift
      ;;
  esac
done

if [ ! -e "$TARGET_PATH" ]; then
  echo "Error: 指定されたパスが存在しません: $TARGET_PATH" >&2
  exit 1
fi

if command -v magick >/dev/null 2>&1; then
  IM_CMD=(magick)
elif command -v convert >/dev/null 2>&1; then
  IM_CMD=(convert)
else
  echo "Error: ImageMagick ('magick' または 'convert') が見つかりません。" >&2
  exit 1
fi

converted_count=0
skipped_count=0
failed_count=0
total_found=0

convert_single() {
  local file="$1"
  local ext="${file##*.}"
  local lc_ext="${ext,,}"

  if [ "$lc_ext" = "webp" ]; then
    echo "skip (already webp): $file"
    skipped_count=$((skipped_count + 1))
    return 0
  fi

  local dir
  local base
  local name
  local out
  dir=$(dirname "$file")
  base=$(basename "$file")
  name="${base%.*}"
  out="$dir/${name}.webp"

  if [ -e "$out" ]; then
    echo "skip (exists): $out"
    skipped_count=$((skipped_count + 1))
    return 0
  fi

  local cmd=("${IM_CMD[@]}" "$file" -quality "$QUALITY" -resize "$MAXSIZE" "$out")

  if [ "$DRY_RUN" = "1" ]; then
    echo "DRY RUN: ${cmd[@]}"
    converted_count=$((converted_count + 1))
  else
    echo "convert: $file -> $out"
    if "${cmd[@]}"; then
      converted_count=$((converted_count + 1))
    else
      echo "failed: $file" >&2
      failed_count=$((failed_count + 1))
    fi
  fi
}

if [ -f "$TARGET_PATH" ]; then
  total_found=1
  convert_single "$TARGET_PATH"
else
  # 一般的な画像拡張子（.jpg, .jpeg, .png, .bmp, .tiff, .gif）を検索
  while IFS= read -r -d '' file; do
    total_found=$((total_found + 1))
    convert_single "$file"
  done < <(find "$TARGET_PATH" -type f \( \
    -iname '*.jpg' -o \
    -iname '*.jpeg' -o \
    -iname '*.png' -o \
    -iname '*.bmp' -o \
    -iname '*.tiff' -o \
    -iname '*.gif' \
  \) -print0)
fi

echo "----------------------------------------"
if [ "$total_found" -eq 0 ]; then
  echo "対象となる画像ファイルが見つかりませんでした: $TARGET_PATH"
else
  echo "処理完了: 検出 $total_found 件 / 変換 $converted_count 件 / スキップ $skipped_count 件 / 失敗 $failed_count 件"
fi
