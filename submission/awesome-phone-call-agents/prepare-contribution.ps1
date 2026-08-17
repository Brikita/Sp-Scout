[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$UpstreamRoot
)

$ErrorActionPreference = "Stop"
$sourceRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..\..")).Path
$resolvedUpstream = (Resolve-Path -LiteralPath $UpstreamRoot).Path

if (-not (Test-Path -LiteralPath (Join-Path $resolvedUpstream "README.md") -PathType Leaf)) {
  throw "The upstream root must contain README.md."
}
if (-not (Test-Path -LiteralPath (Join-Path $resolvedUpstream ".git"))) {
  throw "The upstream root must be a Git working tree."
}

$target = [IO.Path]::GetFullPath((Join-Path $resolvedUpstream "apps\typescript\sparescout"))
$relativeTarget = [IO.Path]::GetRelativePath($resolvedUpstream, $target)
if ($relativeTarget.StartsWith("..") -or [IO.Path]::IsPathRooted($relativeTarget)) {
  throw "Resolved contribution target is outside the upstream repository."
}
if (Test-Path -LiteralPath $target) {
  throw "Target already exists: $target"
}

New-Item -ItemType Directory -Path $target | Out-Null

$directories = @("app", "build", "db", "docs", "drizzle", "lib", "public", "tests", "worker")
foreach ($directory in $directories) {
  Copy-Item -LiteralPath (Join-Path $sourceRoot $directory) -Destination (Join-Path $target $directory) -Recurse
}

$files = @(
  ".env.example",
  ".gitignore",
  "drizzle.config.ts",
  "eslint.config.mjs",
  "next-env.d.ts",
  "next.config.ts",
  "package-lock.json",
  "package.json",
  "postcss.config.mjs",
  "tsconfig.json",
  "vite.config.ts"
)
foreach ($file in $files) {
  Copy-Item -LiteralPath (Join-Path $sourceRoot $file) -Destination (Join-Path $target $file)
}

Copy-Item -LiteralPath (Join-Path $PSScriptRoot "APP_README.md") -Destination (Join-Path $target "README.md")
New-Item -ItemType Directory -Path (Join-Path $target ".openai") | Out-Null
@"
{
  "d1": "DB",
  "r2": null
}
"@ | Set-Content -LiteralPath (Join-Path $target ".openai\hosting.json") -Encoding utf8NoBOM

Write-Output "Prepared: $target"
Write-Output "Next: add the row from README_ENTRY.md, run npm ci and npm run check in the app directory, then run python3 scripts/validate_repository.py from the upstream root."
