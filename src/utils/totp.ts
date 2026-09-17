import * as OTPAuth from 'otpauth';
import QRCode from 'qrcode';

export interface MfaSetupData {
  secret: string;
  uri: string;
  qrCodeDataUrl: string;
  backupCodes: string[];
}

const ISSUER_NAME = 'Proficio Credentialing';

/**
 * Generate standard 8-character backup recovery codes formatted as XXXX-XXXX
 */
export function generateBackupCodes(count = 6): string[] {
  const codes: string[] = [];
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // base32-like alphabet avoiding 0/O, 1/I confusion
  for (let i = 0; i < count; i++) {
    let code = '';
    for (let j = 0; j < 8; j++) {
      if (j === 4) code += '-';
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    codes.push(code);
  }
  return codes;
}

/**
 * Generates a brand-new TOTP Secret (Base32) and QR Code for Google Authenticator enrollment
 */
export async function generateMfaEnrollment(userEmail: string): Promise<MfaSetupData> {
  // Generate random 20-byte secret key (160-bit RFC 6238 standard)
  const secretObj = new OTPAuth.Secret({ size: 20 });
  const secretBase32 = secretObj.base32;

  const totp = new OTPAuth.TOTP({
    issuer: ISSUER_NAME,
    label: userEmail,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: secretObj,
  });

  const uri = totp.toString();

  // Generate crisp QR code SVG/PNG Data URL
  const qrCodeDataUrl = await QRCode.toDataURL(uri, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 260,
    color: {
      dark: '#1e293b',
      light: '#ffffff',
    },
  });

  const backupCodes = generateBackupCodes(6);

  return {
    secret: secretBase32,
    uri,
    qrCodeDataUrl,
    backupCodes,
  };
}

/**
 * Verifies a 6-digit TOTP token against the user's stored Base32 secret.
 * Allows a window of 1 (±30 seconds) to accommodate clock drift.
 */
export function verifyTotpToken(token: string, secretBase32: string): boolean {
  if (!token || !secretBase32) return false;
  const cleanToken = token.replace(/\s+/g, '').trim();
  if (cleanToken.length !== 6 || !/^\d{6}$/.test(cleanToken)) {
    return false;
  }

  try {
    const totp = new OTPAuth.TOTP({
      issuer: ISSUER_NAME,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secretBase32),
    });

    const delta = totp.validate({
      token: cleanToken,
      window: 1, // ±1 step window (60s grace period)
    });

    return delta !== null;
  } catch (err) {
    console.error('[TOTP Verification Error]', err);
    return false;
  }
}

/**
 * Verifies and consumes an emergency backup recovery code.
 */
export function verifyAndConsumeBackupCode(
  inputCode: string,
  backupCodes: string[] = []
): { valid: boolean; remainingCodes: string[] } {
  const normalizedInput = inputCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!normalizedInput || normalizedInput.length < 6) {
    return { valid: false, remainingCodes: backupCodes };
  }

  const matchIndex = backupCodes.findIndex((c) => {
    const cleanSaved = c.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    return cleanSaved === normalizedInput;
  });

  if (matchIndex >= 0) {
    const remainingCodes = [...backupCodes];
    remainingCodes.splice(matchIndex, 1);
    return { valid: true, remainingCodes };
  }

  return { valid: false, remainingCodes: backupCodes };
}
