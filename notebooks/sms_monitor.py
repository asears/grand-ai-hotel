#!/usr/bin/env python3
"""
VoIP.ms SMS Monitor - Listen for Inbound SMS Messages

This script listens for incoming SMS messages via VoIP.ms SIP MESSAGE protocol
and displays them in the terminal in real-time.

Usage:
    python sms_monitor.py [--verbose]

Environment Variables Required:
    VOIPMS_SERVER   - VoIP.ms SIP server (e.g., seattle.voip.ms)
    VOIPMS_USERNAME - VoIP.ms username
    VOIPMS_PASSWORD - VoIP.ms password
    VOIPMS_DID      - Your VoIP.ms phone number

Author: M. Gustave & Zero
License: CC0-1.0
Last Updated: January 31, 2026
"""

import os
import sys
import socket
import hashlib
import datetime
import signal
import time
from typing import Optional

# Try to load from .env file
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("✅ Loaded environment variables from .env file")
except ImportError:
    print("⚠️  python-dotenv not installed. Using system environment variables only.")


class VoIPMSMessageListener:
    """
    Listen for incoming SMS messages via VoIP.ms SIP MESSAGE protocol.
    
    This implements a simple SIP server that responds to MESSAGE requests
    and displays the received SMS content.
    """
    
    def __init__(
        self,
        server: str,
        username: str,
        password: str,
        port: int = 5060,
        verbose: bool = False,
    ) -> None:
        """
        Initialize VoIP.ms SMS listener.
        
        Args:
            server: VoIP.ms SIP server hostname
            username: VoIP.ms username
            password: VoIP.ms password
            port: SIP port to listen on (default 5060)
            verbose: Enable verbose output
        """
        self.server = server
        self.username = username
        self.password = password
        self.port = port
        self.verbose = verbose
        self.running = False
        self.sock: Optional[socket.socket] = None
        
        # Get local IP
        self.local_ip = self._get_local_ip()
        
    def _get_local_ip(self) -> str:
        """Get local IP address."""
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try:
            s.connect(('10.255.255.255', 1))
            ip = s.getsockname()[0]
        except Exception:
            ip = '0.0.0.0'
        finally:
            s.close()
        return ip
    
    def start(self) -> None:
        """Start listening for incoming SMS messages."""
        print("=" * 70)
        print("📱 VoIP.ms SMS Monitor")
        print("=" * 70)
        print(f"   Server: {self.server}")
        print(f"   Username: {self.username}")
        print(f"   Listening on: {self.local_ip}:{self.port}")
        print(f"   Started: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)
        print("\n🔊 Listening for incoming SMS messages... (Press Ctrl+C to stop)\n")
        
        # Create UDP socket
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        
        try:
            # Bind to specific local interface to avoid listening on all interfaces
            self.sock.bind((self.local_ip, self.port))
            self.running = True
            
            # Listen for messages
            while self.running:
                try:
                    data, addr = self.sock.recvfrom(4096)
                    message = data.decode('utf-8', errors='ignore')
                    
                    if self.verbose:
                        print("\n" + "=" * 70)
                        print(f"📥 Received packet from {addr}")
                        print("=" * 70)
                        print(message)
                        print("=" * 70)
                    
                    # Process SIP MESSAGE
                    if message.startswith('MESSAGE '):
                        self._handle_message(message, addr)
                    elif message.startswith('OPTIONS '):
                        self._handle_options(message, addr)
                    elif self.verbose:
                        print(f"⚠️  Received non-MESSAGE SIP request from {addr}")
                        
                except socket.timeout:
                    continue
                except KeyboardInterrupt:
                    break
                except Exception as e:
                    print(f"❌ Error receiving message: {e}")
                    if self.verbose:
                        import traceback
                        traceback.print_exc()
                    
        except OSError as e:
            print(f"❌ Failed to bind to port {self.port}: {e}")
            print(f"   Make sure port {self.port} is not in use.")
            print(f"   Try running with sudo/admin privileges.")
        finally:
            self.stop()
    
    def _handle_message(self, message: str, addr: tuple) -> None:
        """
        Handle incoming SIP MESSAGE request.
        
        Args:
            message: SIP MESSAGE content
            addr: Source address (ip, port)
        """
        lines = message.split('\r\n')
        
        # Extract headers
        headers = {}
        body_start = 0
        for i, line in enumerate(lines):
            if line == '':
                body_start = i + 1
                break
            if ':' in line:
                key, value = line.split(':', 1)
                headers[key.strip().lower()] = value.strip()
        
        # Extract message body
        body = '\r\n'.join(lines[body_start:]).strip()
        
        # Parse FROM header
        from_header = headers.get('from', 'Unknown')
        from_number = self._extract_phone(from_header)
        
        # Parse TO header
        to_header = headers.get('to', 'Unknown')
        to_number = self._extract_phone(to_header)
        
        # Get timestamp
        timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Display SMS
        print("\n" + "🟢" * 35)
        print(f"📨 NEW SMS MESSAGE")
        print("🟢" * 35)
        print(f"   Time: {timestamp}")
        print(f"   From: {from_number}")
        print(f"   To: {to_number}")
        print(f"   Message:")
        print(f"   {'-' * 66}")
        for line in body.split('\n'):
            print(f"   {line}")
        print(f"   {'-' * 66}")
        print("🟢" * 35 + "\n")
        
        # Send 200 OK response
        self._send_ok_response(message, addr)
    
    def _handle_options(self, message: str, addr: tuple) -> None:
        """
        Handle SIP OPTIONS request (keepalive/ping).
        
        Args:
            message: SIP OPTIONS content
            addr: Source address (ip, port)
        """
        if self.verbose:
            print(f"📡 Received OPTIONS request from {addr}")
        
        # Send 200 OK response
        self._send_ok_response(message, addr)
    
    def _send_ok_response(self, request: str, addr: tuple) -> None:
        """
        Send SIP 200 OK response.
        
        Args:
            request: Original SIP request
            addr: Destination address (ip, port)
        """
        lines = request.split('\r\n')
        
        # Extract headers
        headers = {}
        for line in lines[1:]:
            if line == '':
                break
            if ':' in line:
                key, value = line.split(':', 1)
                headers[key.strip().lower()] = value.strip()
        
        # Build response
        response = (
            f"SIP/2.0 200 OK\r\n"
            f"Via: {headers.get('via', '')}\r\n"
            f"From: {headers.get('from', '')}\r\n"
            f"To: {headers.get('to', '')}\r\n"
            f"Call-ID: {headers.get('call-id', '')}\r\n"
            f"CSeq: {headers.get('cseq', '')}\r\n"
            f"Content-Length: 0\r\n"
            f"User-Agent: voipms-monitor/1.0\r\n"
            f"\r\n"
        )
        
        if self.verbose:
            print(f"📤 Sending 200 OK to {addr}")
            print(response)
        
        # Send response
        try:
            self.sock.sendto(response.encode('utf-8'), addr)
        except Exception as e:
            print(f"❌ Failed to send response: {e}")
    
    def _extract_phone(self, header: str) -> str:
        """
        Extract phone number from SIP header.
        
        Args:
            header: SIP From/To header
            
        Returns:
            Phone number or 'Unknown'
        """
        # Format: <sip:1234567890@server.com>
        if 'sip:' in header:
            try:
                start = header.index('sip:') + 4
                end = header.index('@', start)
                phone = header[start:end]
                # Remove any non-digit characters
                phone = ''.join(c for c in phone if c.isdigit())
                if phone:
                    return phone
            except (ValueError, IndexError):
                pass
        return 'Unknown'
    
    def stop(self) -> None:
        """Stop listening for messages."""
        self.running = False
        if self.sock:
            self.sock.close()
            self.sock = None
        print("\n" + "=" * 70)
        print(f"🛑 SMS Monitor Stopped at {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("=" * 70)


def main() -> int:
    """Main entry point."""
    # Load credentials
    server = os.getenv('VOIPMS_SERVER', '')
    username = os.getenv('VOIPMS_USERNAME', '')
    password = os.getenv('VOIPMS_PASSWORD', '')
    did = os.getenv('VOIPMS_DID', '')
    
    # Validate credentials
    missing = []
    if not server:
        missing.append('VOIPMS_SERVER')
    if not username:
        missing.append('VOIPMS_USERNAME')
    if not password:
        missing.append('VOIPMS_PASSWORD')
    if not did:
        missing.append('VOIPMS_DID')
    
    if missing:
        print("❌ Missing required environment variables:")
        for var in missing:
            print(f"   - {var}")
        print("\n⚠️  Set these in your .env file or environment.")
        return 1
    
    # Create listener
    listener = VoIPMSMessageListener(
        server=server,
        username=username,
        password=password,
        verbose='--verbose' in sys.argv or '-v' in sys.argv,
    )
    
    # Handle Ctrl+C gracefully
    def signal_handler(sig, frame):
        print("\n\n⚠️  Received interrupt signal...")
        listener.stop()
        sys.exit(0)
    
    signal.signal(signal.SIGINT, signal_handler)
    
    # Start listening
    try:
        listener.start()
    except KeyboardInterrupt:
        listener.stop()
    
    return 0


if __name__ == '__main__':
    sys.exit(main())
