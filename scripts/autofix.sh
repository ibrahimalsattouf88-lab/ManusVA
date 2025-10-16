scripts/autofix.sh#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-quick}"
echo "Autofix mode: $MODE"

# مثال: توحيد .gitattributes و .editorconfig لو ناقصين
added=0

ensure_file() {
  local path="$1"
  local content="$2"
  if [[ ! -f "$path" ]]; then
    echo "Creating $path"
    mkdir -p "$(dirname "$path")"
    printf "%s\n" "$content" > "$path"
    added=1
  fi
}

# 1) .editorconfig موحد
ensure_file ".editorconfig" "$(cat <<'EOF'
root = true

[*]
end_of_line = lf
insert_final_newline = true
charset = utf-8
trim_trailing_whitespace = true
indent_style = space
indent_size = 2
EOF
)"

# 2) .gitattributes بسيط
ensure_file ".gitattributes" "$(cat <<'EOF'
* text=auto eol=lf
*.sh text eol=lf
*.yaml text eol=lf
*.yml  text eol=lf
*.dart text eol=lf
EOF
)"

# 3) أمثلة place-holder: تأكد من وجود tools/initial_tasks.sql (إن كان ناقص)
ensure_file "tools/README.md" "# Tools\n\nInternal SQL/Migrations/ops helper files live here."

# اذا بدك حالات أكثر، زدها هون… مثلاً تجهيز سكربتات أو مسارات

if [[ "$added" -eq 0 ]]; then
  echo "No local changes to commit."
else
  echo "Changes added. Will be committed by create-pull-request action."
fi
