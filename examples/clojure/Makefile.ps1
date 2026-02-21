# Clojure Verification Suite - PowerShell Makefile
# Usage: .\Makefile.ps1 <command>
#
# Available commands:
#   deps      - Download and verify dependencies
#   repl      - Start interactive REPL
#   test      - Run all tests
#   test-ns   - Run tests for specific namespace (use -Namespace parameter)
#   verify    - Run verification on sample files
#   quick     - Run quick verification check
#   clean     - Remove compiled artifacts
#   format    - Format code (if formatter installed)
#   lint      - Lint code (if linter installed)
#   help      - Show this help message

param(
    [Parameter(Position=0)]
    [string]$Command = "help",
    
    [string]$Namespace = "",
    [string]$SpecFile = "sample-requirements.md",
    [string]$CodeFile = "sample-python/auth.py"
)

function Show-Help {
    Write-Host @"

Clojure Verification Suite - Commands
======================================

Development:
  .\Makefile.ps1 deps          Download dependencies
  .\Makefile.ps1 repl          Start REPL with rebel-readline
  .\Makefile.ps1 clean         Remove compiled artifacts

Testing:
  .\Makefile.ps1 test          Run all tests
  .\Makefile.ps1 test-ns -Namespace specs.parser-test
                               Run specific test namespace

Verification:
  .\Makefile.ps1 verify        Full verification (sample files)
  .\Makefile.ps1 quick         Quick security & standards check
  .\Makefile.ps1 verify -SpecFile requirements.md -CodeFile code.py
                               Verify custom files

Code Quality:
  .\Makefile.ps1 format        Format source code
  .\Makefile.ps1 lint          Lint source code

Examples:
  .\Makefile.ps1 test
  .\Makefile.ps1 verify -CodeFile sample-python/insecure_db.py
  .\Makefile.ps1 test-ns -Namespace security.analyzer-test

"@
}

function Get-Dependencies {
    Write-Host "Downloading dependencies..." -ForegroundColor Cyan
    clj -Stree
}

function Start-REPL {
    Write-Host "Starting REPL with rebel-readline..." -ForegroundColor Cyan
    Write-Host "Tip: Use (require '[module.name :reload]) to reload code" -ForegroundColor Yellow
    clj -M:repl
}

function Run-Tests {
    if ($Namespace) {
        Write-Host "Running tests for namespace: $Namespace" -ForegroundColor Cyan
        clj -M:test -n $Namespace
    } else {
        Write-Host "Running all tests..." -ForegroundColor Cyan
        clj -M:test
    }
}

function Run-Verification {
    Write-Host "Running full verification..." -ForegroundColor Cyan
    Write-Host "  Spec: $SpecFile" -ForegroundColor Gray
    Write-Host "  Code: $CodeFile" -ForegroundColor Gray
    clj -M:verify --spec $SpecFile --python $CodeFile
}

function Run-Quick-Check {
    Write-Host "Running quick security & standards check..." -ForegroundColor Cyan
    clj -M:verify --spec $SpecFile --python $CodeFile --quick
}

function Clean-Artifacts {
    Write-Host "Cleaning compiled artifacts..." -ForegroundColor Cyan
    if (Test-Path ".cpcache") {
        Remove-Item -Recurse -Force .cpcache
        Write-Host "  Removed .cpcache/" -ForegroundColor Green
    }
    if (Test-Path "target") {
        Remove-Item -Recurse -Force target
        Write-Host "  Removed target/" -ForegroundColor Green
    }
    if (Test-Path ".nrepl-port") {
        Remove-Item .nrepl-port
        Write-Host "  Removed .nrepl-port" -ForegroundColor Green
    }
    Write-Host "Clean complete." -ForegroundColor Green
}

function Format-Code {
    Write-Host "Formatting code..." -ForegroundColor Cyan
    # Using cljfmt if available
    $cljfmt = Get-Command cljfmt -ErrorAction SilentlyContinue
    if ($cljfmt) {
        clj -M:format fix
    } else {
        Write-Host "cljfmt not installed. Install with: clj -Ttools install io.github.weavejester/cljfmt '{:git/tag \"0.11.2\"}' :as cljfmt" -ForegroundColor Yellow
    }
}

function Lint-Code {
    Write-Host "Linting code..." -ForegroundColor Cyan
    # Using clj-kondo if available
    $kondo = Get-Command clj-kondo -ErrorAction SilentlyContinue
    if ($kondo) {
        clj-kondo --lint src test
    } else {
        Write-Host "clj-kondo not installed. Install with: winget install clj-kondo" -ForegroundColor Yellow
    }
}

# Command dispatcher
switch ($Command.ToLower()) {
    "deps" { Get-Dependencies }
    "repl" { Start-REPL }
    "test" { Run-Tests }
    "test-ns" { Run-Tests }
    "verify" { Run-Verification }
    "quick" { Run-Quick-Check }
    "clean" { Clean-Artifacts }
    "format" { Format-Code }
    "lint" { Lint-Code }
    "help" { Show-Help }
    default {
        Write-Host "Unknown command: $Command" -ForegroundColor Red
        Show-Help
        exit 1
    }
}
