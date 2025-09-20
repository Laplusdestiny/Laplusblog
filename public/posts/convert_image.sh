# ...existing code...
#!/usr/bin/env bash
# IMGで始まる画像をまとめてWebPに変換するスクリプト
# 使い方:
#   chmod +x convert_image.sh
#   ./convert_image.sh               # カレントディレクトリ配下を処理
#   ./convert_image.sh /path/to/dir  # 指定ディレクトリ配下を処理
#   ./convert_image.sh -d /path/to/dir
# 環境変数:
#   DRY_RUN=1    -> 実行せずコマンド表示
#   QUALITY=80   -> 出力品質（デフォルト80）
#   MAXSIZE=1920x1920> -> リサイズ指定（デフォルト '1920x1920>'）

set -uo pipefail
IFS=$'\n\t'

DRY_RUN=${DRY_RUN:-0}
QUALITY=${QUALITY:-80}
MAXSIZE=${MAXSIZE:-'1920x1920>'}
TARGET_DIR='.'

usage() {
  cat <<EOF
Usage: $(basename "$0") [DIR] | -d DIR
  DIR: 対象ディレクトリ（省略時はカレントディレクトリ）
Environment:
  DRY_RUN=1    実行せずコマンド表示
  QUALITY=80   出力品質（デフォルト80）
  MAXSIZE=...  リサイズ指定（デフォルト '1920x1920>')
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
      TARGET_DIR="$2"
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
      TARGET_DIR="$1"
      shift
      ;;
  esac
done

if [ ! -d "$TARGET_DIR" ]; then
  echo "Error: 指定ディレクトリが存在しません: $TARGET_DIR" >&2
  exit 1
fi

if ! command -v convert >/dev/null 2>&1; then
  echo "Error: ImageMagick 'convert' が見つかりません。" >&2
  exit 1
fi

# findでIMGで始まるファイルを検索（大文字小文字区別せず）
find "$TARGET_DIR" -type f -iname 'IMG*' -print0 |
while IFS= read -r -d '' file; do
  # 拡張子がすでにwebpならスキップ
  ext="${file##*.}"
  lc_ext="${ext,,}"
  if [ "$lc_ext" = "webp" ]; then
    echo "skip (already webp): $file"
    continue
  fi

  dir=$(dirname "$file")
  base=$(basename "$file")
  name="${base%.*}"
  out="$dir/${name}.webp"

  if [ -e "$out" ]; then
    echo "skip (exists): $out"
    continue
  fi

  cmd=(convert "$file" -quality "$QUALITY" -resize "$MAXSIZE" "$out")

  if [ "$DRY_RUN" = "1" ]; then
    echo "DRY RUN: ${cmd[*]}"
  else
    echo "convert: $file -> $out"
    if ! "${cmd[@]}"; then
      echo "failed: $file" >&2
    fi
  fi
done
# ...existing code...
