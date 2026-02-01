# VoIP.ms SMS Monitor

Real-time SMS monitoring tool that listens for incoming SMS messages via VoIP.ms SIP protocol and displays them in the terminal.

## Features

- 📨 Real-time SMS monitoring
- 🔊 Terminal notifications for incoming messages
- 📞 Displays sender phone number and message content
- ⚙️ Configurable via environment variables
- 🔒 Secure credential management
- 🐛 Verbose mode for debugging

## Prerequisites

1. **VoIP.ms Account** with SMS-enabled DID
2. **Python 3.11+**
3. **Environment Variables** (see setup below)

## Installation

1. **Clone or download** the script:
   ```bash
   # Download to your project
   cd c:\projects\ai\copilot\notebooks
   ```

2. **Install dependencies** (optional):
   ```bash
   pip install python-dotenv  # For .env file support
   ```

3. **Configure environment variables**:

   Create a `.env` file in the same directory:
   ```env
   VOIPMS_SERVER=seattle.voip.ms
   VOIPMS_USERNAME=your_username_here
   VOIPMS_PASSWORD=your_password_here
   VOIPMS_DID=your_phone_number
   ```

   Or set them in PowerShell:
   ```powershell
   $env:VOIPMS_SERVER="seattle.voip.ms"
   $env:VOIPMS_USERNAME="your_username"
   $env:VOIPMS_PASSWORD="your_password"
   $env:VOIPMS_DID="1234567890"
   ```

## Usage

### Basic Usage

```bash
python sms_monitor.py
```

### Verbose Mode

Enable detailed SIP message logging:

```bash
python sms_monitor.py --verbose
```

Or:

```bash
python sms_monitor.py -v
```

### Running in Background (Windows)

```powershell
# Run in background
Start-Process python -ArgumentList "sms_monitor.py" -WindowStyle Hidden

# Or use nohup-like behavior
python sms_monitor.py > sms_log.txt 2>&1 &
```

### Running in Background (Linux/macOS)

```bash
# Run in background
nohup python sms_monitor.py > sms_log.txt 2>&1 &

# Or use screen/tmux
screen -S sms_monitor
python sms_monitor.py
# Press Ctrl+A then D to detach
```

## Example Output

```
======================================================================
📱 VoIP.ms SMS Monitor
======================================================================
   Server: seattle.voip.ms
   Username: your_username
   Listening on: 192.168.1.100:5060
   Started: 2026-01-31 14:30:00
======================================================================

🔊 Listening for incoming SMS messages... (Press Ctrl+C to stop)


🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
📨 NEW SMS MESSAGE
🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
   Time: 2026-01-31 14:32:15
   From: 4165551234
   To: 4164739200
   Message:
   ------------------------------------------------------------------
   Hey, are you free for dinner tonight?
   ------------------------------------------------------------------
🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
```

## Stopping the Monitor

Press **Ctrl+C** to gracefully stop the monitor:

```
⚠️  Received interrupt signal...

======================================================================
🛑 SMS Monitor Stopped at 2026-01-31 15:45:00
======================================================================
```

## Firewall Configuration

### Windows

The monitor needs to **receive** UDP traffic on port 5060. Add a firewall rule:

```powershell
# Run as Administrator
New-NetFirewallRule -DisplayName "Python SIP Inbound" `
   -Direction Inbound `
   -Program "C:\Path\To\python.exe" `
   -Protocol UDP `
   -LocalPort 5060 `
   -Action Allow
```

### Linux

```bash
# Allow UDP port 5060
sudo ufw allow 5060/udp
```

### macOS

```bash
# Add firewall rule (requires admin)
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/python3
```

## Troubleshooting

### Port Already in Use

**Error:** `Failed to bind to port 5060: Address already in use`

**Solution:**
1. Check what's using the port:
   ```powershell
   # Windows
   netstat -ano | findstr :5060
   
   # Linux/macOS
   lsof -i :5060
   ```

2. Kill the process or use a different port (modify the script)

### No Messages Received

**Possible Causes:**

1. **Firewall blocking** - Check firewall rules allow UDP port 5060
2. **VoIP.ms configuration** - Verify your DID is SMS-enabled
3. **Network/NAT issues** - Your router may be blocking SIP traffic
4. **Wrong credentials** - Verify username/password are correct

**Debug Steps:**

1. Run in verbose mode:
   ```bash
   python sms_monitor.py --verbose
   ```

2. Test with the sender script:
   ```bash
   # In the notebook, run the SMS sending cell
   ```

3. Check VoIP.ms portal for SMS logs

### Permission Denied (Port 5060)

**Error:** `Permission denied` when binding to port 5060

**Solution:**

Ports below 1024 require admin/root privileges:

```bash
# Linux/macOS
sudo python sms_monitor.py

# Or use a higher port (modify script)
```

## Integration Ideas

### Log to File

```python
# Modify _handle_message() to log to file
with open('sms_log.txt', 'a') as f:
    f.write(f"{timestamp} | From: {from_number} | {body}\n")
```

### Send Desktop Notifications

```bash
pip install plyer
```

```python
from plyer import notification

notification.notify(
    title=f"SMS from {from_number}",
    message=body,
    timeout=10
)
```

### Forward to Email

```python
import smtplib
from email.message import EmailMessage

msg = EmailMessage()
msg['Subject'] = f'SMS from {from_number}'
msg['From'] = 'sms@yourserver.com'
msg['To'] = 'you@example.com'
msg.set_content(body)

# Send via SMTP
```

### Integrate with Home Automation

- **Home Assistant:** Use REST API to trigger automations
- **IFTTT:** Forward to webhooks
- **Discord/Slack:** Post to channels

## Security Notes

1. **Never commit credentials** - Use `.gitignore` for `.env` files
2. **Use strong passwords** - Rotate VoIP.ms credentials regularly
3. **Firewall rules** - Only allow necessary traffic
4. **Monitor logs** - Check for unauthorized access attempts

## License

CC0-1.0 (Public Domain)

## Authors

- **M. Gustave** - Architecture & Design
- **Zero** - Implementation

## Related Files

- `voipms_sms_test.ipynb` - Jupyter notebook for sending SMS
- `sample_sms.py` - Original VoIP.ms SMS sender example

---

**Last Updated:** January 31, 2026  
**Version:** 1.0.0
