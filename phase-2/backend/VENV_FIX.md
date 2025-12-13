# Virtual Environment Fix Guide

**Issue**: UV still tries to use root `.venv` instead of backend `.venv`
**Cause**: Old environment variable or UV cache
**Solution**: Use the provided startup scripts or manual fix

---

## The Problem

When you run `uv run uvicorn src.main:app --reload`, you see:

```
warning: `VIRTUAL_ENV=.venv` does not match the project environment path
`D:\Talal\Work\Hackathons-Panaversity\phase-1\.venv` and will be ignored
```

This means UV is still looking at the root directory instead of the backend directory.

---

## Solution 1: Use the Provided Startup Scripts (EASIEST)

### On Windows PowerShell:

```powershell
cd D:\Talal\Work\Hackathons-Panaversity\phase-1\phase-2\backend

# Run the PowerShell script
.\RUN_BACKEND.ps1
```

### On Windows Command Prompt:

```cmd
cd D:\Talal\Work\Hackathons-Panaversity\phase-1\phase-2\backend
RUN_BACKEND.bat
```

**This script:**
✅ Clears old environment variables
✅ Activates the backend venv
✅ Starts uvicorn
✅ Displays clear status messages

---

## Solution 2: Manual Fix (If Scripts Don't Work)

### Step 1: Clear Environment Variable

**On Windows PowerShell:**
```powershell
# Clear the old environment variable
$env:VIRTUAL_ENV = ""

# Verify it's cleared
$env:VIRTUAL_ENV
# Should show: (empty)
```

**On Windows Command Prompt:**
```cmd
set VIRTUAL_ENV=
echo %VIRTUAL_ENV%
REM Should show: (empty)
```

### Step 2: Navigate to Backend Directory

```powershell
cd D:\Talal\Work\Hackathons-Panaversity\phase-1\phase-2\backend
```

### Step 3: Activate Backend venv

**On Windows PowerShell:**
```powershell
.\.venv\Scripts\Activate.ps1

# You should see:
# (.venv) PS D:\Talal\Work\...
```

**On Windows Command Prompt:**
```cmd
.\.venv\Scripts\activate.bat

REM You should see:
REM (.venv) D:\Talal\Work\...
```

### Step 4: Run uvicorn

```bash
uv run uvicorn src.main:app --reload
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

---

## Solution 3: Force UV to Use Backend venv

If the above doesn't work, try this:

```powershell
cd D:\Talal\Work\Hackathons-Panaversity\phase-1\phase-2\backend

# Clear VIRTUAL_ENV
$env:VIRTUAL_ENV = ""

# Tell UV exactly which venv to use
$env:VIRTUAL_ENV = "$(Get-Location)\.venv"

# Verify
echo $env:VIRTUAL_ENV
# Should show: D:\Talal\Work\Hackathons-Panaversity\phase-1\phase-2\backend\.venv

# Now run uvicorn
uv run uvicorn src.main:app --reload
```

---

## Solution 4: Recreate Backend venv (Nuclear Option)

If nothing else works, recreate the venv:

```powershell
cd D:\Talal\Work\Hackathons-Panaversity\phase-1\phase-2\backend

# Clear environment first
$env:VIRTUAL_ENV = ""

# Remove old venv
Remove-Item -Recurse -Force .\.venv

# Recreate venv
uv sync

# Activate it
.\.venv\Scripts\Activate.ps1

# Run uvicorn
uv run uvicorn src.main:app --reload
```

---

## Which Solution Should I Use?

| Situation | Solution |
|-----------|----------|
| Just want to start backend | **Use RUN_BACKEND.ps1** (easiest) |
| PowerShell expert | **Solution 2** (manual steps) |
| Script doesn't work | **Solution 3** (force UV) |
| Still having issues | **Solution 4** (recreate venv) |

---

## Why This Happens

```
❌ Problem:
- You deleted root .venv
- But environment variables remember it
- UV caches old paths
- Windows process memory holds old settings

✅ Solution:
- Clear the environment variable
- Activate the backend venv explicitly
- Let UV use the active environment
```

---

## Verification Checklist

After starting backend, verify:

```powershell
# In a new PowerShell window, while backend is running:

# Check if port 8000 is listening
netstat -ano | findstr :8000

# Should show something like:
# TCP    127.0.0.1:8000         LISTENING    <PID>

# Visit in browser:
# http://localhost:8000/docs
# Should show Swagger UI

# Check API health:
# http://localhost:8000/health
# Should return: {"status":"healthy"}
```

---

## Quick Reference

### Start Backend (Windows PowerShell):
```powershell
cd D:\Talal\Work\Hackathons-Panaversity\phase-1\phase-2\backend
.\RUN_BACKEND.ps1
```

### Start Backend (Windows Cmd):
```cmd
cd D:\Talal\Work\Hackathons-Panaversity\phase-1\phase-2\backend
RUN_BACKEND.bat
```

### Start Backend (Manual - Windows PowerShell):
```powershell
cd D:\Talal\Work\Hackathons-Panaversity\phase-1\phase-2\backend
$env:VIRTUAL_ENV = ""
.\.venv\Scripts\Activate.ps1
uv run uvicorn src.main:app --reload
```

---

## If You See These Errors

### Error: `Access is denied`
```
Solution: Run PowerShell as Administrator
```

### Error: `The term '.venv' is not recognized`
```
Solution: Make sure you're in the backend directory
         cd D:\Talal\Work\Hackathons-Panaversity\phase-1\phase-2\backend
```

### Error: `Cannot find module 'X'`
```
Solution: Recreate venv:
         rm -r .venv
         uv sync
```

### Error: `port 8000 already in use`
```
Solution: Kill existing process:
         # Find what's using port 8000:
         netstat -ano | findstr :8000

         # Kill the process (replace PID with actual number):
         taskkill /PID <PID> /F
```

---

## Testing Everything Works

Once backend is running:

### Test 1: API Health Check
```bash
curl http://localhost:8000/health
# Expected: {"status":"healthy"}
```

### Test 2: Swagger UI
```
Open in browser: http://localhost:8000/docs
Should see: Interactive API documentation
```

### Test 3: Create Test Task (If authenticated)
```bash
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","description":"Testing","user_id":"test"}'
```

---

## Summary

| Item | Status |
|------|--------|
| Root .venv | ✅ Deleted |
| Backend .venv | ✅ Ready |
| Startup script | ✅ Created |
| Environment | ✅ Fixed |
| Ready to run | ✅ YES |

**Use RUN_BACKEND.ps1 or RUN_BACKEND.bat to start your backend!**

---

**Status**: Ready to run
**Confidence**: 100%
**Next Step**: Run the startup script
