# 🚀 START HERE - How to Run Backend

**Status**: ✅ Backend environment is now properly configured
**Location**: Virtual environment is isolated in `backend/.venv` (NOT in root)
**Package Manager**: UV handles all dependencies automatically

---

## QUICK START (Choose Based on Your OS)

### Option 1: Linux / macOS (RECOMMENDED)

```bash
cd path/to/backend
./START_BACKEND.sh
```

✅ Automatically verifies Python installation
✅ Creates/updates virtual environment
✅ Verifies all dependencies
✅ Starts uvicorn with reload
✅ Shows clear status messages

---

### Option 2: Windows PowerShell

```powershell
cd D:\Talal\Work\Hackathons-Panaversity\phase-1\phase-2\backend
.\RUN_BACKEND.ps1
```

✅ Clears old environment variables
✅ Activates backend venv
✅ Starts uvicorn
✅ Shows clear status

---

### Option 3: Windows Command Prompt

```cmd
cd D:\Talal\Work\Hackathons-Panaversity\phase-1\phase-2\backend
RUN_BACKEND.bat
```

✅ Works in Command Prompt
✅ Same functionality as PowerShell
✅ Shows clear status

---

### Option 4: Manual (If Scripts Don't Work)

**Linux/macOS:**
```bash
cd path/to/backend
uv sync
uv run uvicorn src.main:app --reload
```

**Windows PowerShell:**
```powershell
cd D:\Talal\Work\Hackathons-Panaversity\phase-1\phase-2\backend
uv sync
$env:VIRTUAL_ENV = ""
uv run uvicorn src.main:app --reload
```

---

## What You'll See When It Works

```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Application startup complete
INFO:     Uvicorn running on http://127.0.0.1:8000
```

✅ **NO warning messages about venv paths**
✅ **Backend is running successfully**

---

## Verify It's Working

Open browser and go to:
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

Should show Swagger UI and health status.

---

## Troubleshooting

### If script says "Access denied"
→ Run PowerShell as Administrator

### If you see the VIRTUAL_ENV warning
→ Use one of the startup scripts above (they clear old environment variables)

### If port 8000 is already in use

**Linux/macOS:**
```bash
# Find what's using port 8000
lsof -i :8000

# Kill it
kill -9 <PID>
```

**Windows PowerShell:**
```powershell
# Find what's using port 8000
netstat -ano | findstr :8000

# Kill it (replace 12345 with actual PID)
taskkill /PID 12345 /F
```

---

## Next Steps

1. **Run the startup script**:
   - Linux/macOS: `./START_BACKEND.sh`
   - Windows: `.\RUN_BACKEND.ps1` or `RUN_BACKEND.bat`

2. **Open browser**: http://localhost:8000/docs

3. **Start auth-server**: In new terminal, `cd auth-server && npm run dev`

4. **Start frontend**: In new terminal, `cd frontend && npm run dev`

5. **Access app**: http://localhost:3000

---

## Available Startup Scripts

- **START_BACKEND.sh** - Bash startup script (Linux/macOS)
- **RUN_BACKEND.ps1** - PowerShell startup script (Windows)
- **RUN_BACKEND.bat** - Batch startup script (Windows Command Prompt)
- **VENV_FIX.md** - Detailed troubleshooting guide

---

## Key Points

✅ **Virtual environment is isolated** in `backend/.venv`
✅ **Root directory has no venv** (Phase I legacy removed)
✅ **UV automatically manages** Python dependencies
✅ **All services work together**: Better Auth (3001) + Backend (8000) + Frontend (3000)

**Status**: Ready to use
**Time to Start**: 10 seconds
