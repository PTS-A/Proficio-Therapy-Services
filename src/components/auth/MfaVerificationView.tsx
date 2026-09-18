import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Key, 
  Smartphone, 
  Copy, 
  Check, 
  AlertTriangle, 
  Download, 
  RefreshCw, 
  LifeBuoy,
  Lock,
  Eye,
  EyeOff,
  FileText,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { AppAccount } from '../../types';
import { useCredentialing } from '../../context/CredentialingContext';
import { generateMfaEnrollment, MfaSetupData } from '../../utils/totp';
import { ProficioLogo } from '../common/ProficioLogo';

interface MfaVerificationViewProps {
  account: AppAccount;
  onCancel: () => void;
}

export const MfaVerificationView: React.FC<MfaVerificationViewProps> = ({
  account,
  onCancel,
}) => {
  const { verifyMfaTotp, verifyMfaBackup, completeMfaEnrollment } = useCredentialing();

  // QR code shows only ONCE for that specific account during first login
  const isEnrolled = Boolean(account.mfaEnabled && account.mfaSecret);

  // Challenge State (for already enrolled users)
  const [totpCode, setTotpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Backup code mode toggle
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [backupCodeInput, setBackupCodeInput] = useState('');

  // First-time Enrollment State
  const [enrollmentData, setEnrollmentData] = useState<MfaSetupData | null>(null);
  const [isLoadingEnrollment, setIsLoadingEnrollment] = useState(!isEnrolled);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Password-Protected Recovery PDF State
  const [pdfPassword, setPdfPassword] = useState('');
  const [showPdfPassword, setShowPdfPassword] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // TOTP 30-second interval countdown
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    const epoch = Math.floor(Date.now() / 1000);
    return 30 - (epoch % 30);
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const epoch = Math.floor(Date.now() / 1000);
      setSecondsRemaining(30 - (epoch % 30));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize enrollment if not yet enrolled - QR code is generated ONLY during first setup
  useEffect(() => {
    if (!isEnrolled) {
      let isMounted = true;
      setIsLoadingEnrollment(true);
      generateMfaEnrollment(account.email)
        .then((data) => {
          if (isMounted) {
            setEnrollmentData(data);
            setIsLoadingEnrollment(false);
          }
        })
        .catch((err) => {
          if (isMounted) {
            setError('Could not generate MFA setup key: ' + (err.message || 'Unknown error'));
            setIsLoadingEnrollment(false);
          }
        });
      return () => {
        isMounted = false;
      };
    }
  }, [account.email, isEnrolled]);

  const handleVerifyTotpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (useBackupCode) {
      if (!backupCodeInput.trim()) {
        setError('Please enter your 8-character emergency backup code.');
        return;
      }
      setIsVerifying(true);
      const res = await verifyMfaBackup(backupCodeInput.trim());
      setIsVerifying(false);
      if (!res.success) {
        setError(res.error || 'Invalid or previously used backup recovery code.');
      }
      return;
    }

    const clean = totpCode.replace(/\s+/g, '').trim();
    if (clean.length !== 6) {
      setError('Please enter the 6-digit code shown in Google Authenticator.');
      return;
    }

    setIsVerifying(true);
    const res = await verifyMfaTotp(clean);
    setIsVerifying(false);
    if (!res.success) {
      setError(res.error || 'Invalid code. Please ensure your phone clock is synced and try again.');
    }
  };

  const handleCompleteEnrollmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!enrollmentData) {
      setError('Enrollment data is not ready.');
      return;
    }

    if (!pdfDownloaded) {
      setError('For security compliance, please generate and download your password-protected recovery PDF before continuing.');
      return;
    }

    const clean = totpCode.replace(/\s+/g, '').trim();
    if (clean.length !== 6) {
      setError('Please enter the 6-digit verification code from your Google Authenticator app.');
      return;
    }

    setIsVerifying(true);
    const res = await completeMfaEnrollment(enrollmentData.secret, clean, enrollmentData.backupCodes);
    setIsVerifying(false);
    if (!res.success) {
      setError(res.error || 'Verification failed. Please verify the code and try again.');
    } else {
      // Immediately wipe enrollment data and QR code from component state
      setEnrollmentData(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  // Generate & Download Password-Protected PDF (Backup codes are NEVER displayed on-screen)
  const handleDownloadProtectedPdf = async () => {
    if (!enrollmentData) return;
    if (!pdfPassword || pdfPassword.length < 6) {
      setPdfError('Please provide a document password of at least 6 characters to encrypt your recovery keys.');
      return;
    }
    setPdfError(null);
    setIsGeneratingPdf(true);

    try {
      const response = await fetch('/api/mfa/generate-recovery-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: account.email,
          backupCodes: enrollmentData.backupCodes,
          password: pdfPassword,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to generate password-protected PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Proficio_MFA_Recovery_Keys_${account.email.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setPdfDownloaded(true);
    } catch (err: any) {
      console.error('PDF download error:', err);
      setPdfError(err.message || 'Error generating encrypted PDF. Please check server status.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center mb-6">
        <div className="flex justify-center mb-4">
          <ProficioLogo size="lg" />
        </div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>45 CFR §164.312(a)(2)(i) MFA Enforced</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {isEnrolled ? 'Two-Factor Authentication' : 'Set Up Google Authenticator'}
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Secured access for <span className="text-white font-medium">{account.name}</span> ({account.email})
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4 sm:px-0">
        <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-200">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2.5 animate-in fade-in duration-200">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* ========================================================= */}
          {/* FLOW A: USER IS ALREADY ENROLLED IN TOTP */}
          {/* ========================================================= */}
          {isEnrolled ? (
            <div>
              {!useBackupCode ? (
                <form onSubmit={handleVerifyTotpSubmit} className="space-y-5">
                  <div className="text-center py-2">
                    <div className="w-14 h-14 bg-indigo-500/15 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-indigo-400 shadow-inner">
                      <Smartphone className="w-7 h-7" />
                    </div>
                    <p className="text-sm text-slate-300 font-medium">
                      Enter the 6-digit code from Google Authenticator
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Open your authenticator app to view the temporary passcode.
                    </p>
                  </div>

                  <div>
                    <label className="block text-center text-xs font-semibold text-slate-400 mb-2 tracking-wide uppercase">
                      6-Digit Authenticator Code
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      autoFocus
                      className="w-full text-center text-3xl font-mono tracking-[0.4em] px-4 py-3 bg-slate-900/90 border border-slate-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 rounded-xl text-white outline-none transition-all placeholder:text-slate-600 placeholder:tracking-[0.4em]"
                    />
                    {/* Time Step Indicator */}
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
                      <span className="flex items-center space-x-1.5">
                        <RefreshCw className={`w-3 h-3 ${secondsRemaining <= 5 ? 'text-amber-400 animate-spin' : 'text-slate-400'}`} />
                        <span>Code refreshes in {secondsRemaining}s</span>
                      </span>
                      <div className="w-20 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${secondsRemaining <= 5 ? 'bg-amber-400' : 'bg-indigo-400'}`}
                          style={{ width: `${(secondsRemaining / 30) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={totpCode.length !== 6 || isVerifying}
                    className="w-full py-3 px-4 bg-[#2B4C9D] hover:bg-[#223d7d] disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-900/30 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isVerifying ? (
                      <span className="flex items-center space-x-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying Security Token...</span>
                      </span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify & Sign In</span>
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setUseBackupCode(true);
                        setError(null);
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer inline-flex items-center space-x-1"
                    >
                      <LifeBuoy className="w-3.5 h-3.5" />
                      <span>Lost your phone? Use an emergency recovery code</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Emergency Backup Recovery Code Mode */
                <form onSubmit={handleVerifyTotpSubmit} className="space-y-5">
                  <div className="text-center py-2">
                    <div className="w-14 h-14 bg-amber-500/15 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-amber-400 shadow-inner">
                      <Key className="w-7 h-7" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Emergency Backup Recovery Code</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Enter one of the 8-character single-use recovery codes saved when you enrolled your authenticator.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                      Emergency Recovery Code
                    </label>
                    <input
                      type="text"
                      value={backupCodeInput}
                      onChange={(e) => setBackupCodeInput(e.target.value.toUpperCase())}
                      placeholder="XXXX-XXXX"
                      autoFocus
                      className="w-full text-center text-xl font-mono tracking-widest px-4 py-3 bg-slate-900/90 border border-slate-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl text-white outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!backupCodeInput.trim() || isVerifying}
                    className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isVerifying ? 'Validating Recovery Code...' : 'Consume Recovery Code & Sign In'}
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setUseBackupCode(false);
                        setError(null);
                      }}
                      className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      &larr; Back to Google Authenticator Code
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* ========================================================= */
            /* FLOW B: FIRST TIME ENROLLMENT WIZARD */
            /* ========================================================= */
            <div>
              {isLoadingEnrollment || !enrollmentData ? (
                <div className="py-12 text-center">
                  <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-300">Generating Secure RFC 6238 TOTP Key...</p>
                  <p className="text-xs text-slate-500 mt-1">Establishing cryptographic pairing parameters</p>
                </div>
              ) : (
                <form onSubmit={handleCompleteEnrollmentSubmit} className="space-y-6">
                  {/* Step 1: Scan QR Code */}
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-indigo-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        1
                      </div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Scan QR Code with Google Authenticator
                      </h4>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl inline-block mx-auto border-2 border-slate-700 shadow-lg text-center flex flex-col items-center justify-center">
                      <img
                        src={enrollmentData.qrCodeDataUrl}
                        alt="Google Authenticator Pairing QR Code"
                        className="w-48 h-48 rounded-lg"
                      />
                      <span className="text-[10px] text-slate-700 font-mono font-medium mt-1">
                        Proficio: {account.email}
                      </span>
                    </div>
                  </div>

                  {/* Step 2: Manual Key Fallback */}
                  <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-3 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-slate-400 font-medium">Or enter key manually:</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(enrollmentData.secret)}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1 cursor-pointer"
                      >
                        {copiedSecret ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied Key!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Key</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="font-mono text-white bg-slate-800 px-2.5 py-1.5 rounded-lg select-all text-center tracking-wider text-[11px] break-all border border-slate-700">
                      {enrollmentData.secret}
                    </div>
                  </div>

                  {/* Step 2: Emergency Backup Keys (Password-Protected Encrypted PDF) */}
                  <div className="bg-slate-900/80 border border-slate-700/90 rounded-xl p-4 text-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          2
                        </div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-1.5">
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Download Encrypted Recovery Keys</span>
                        </h4>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        HIPAA § 164.312
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      To prevent unauthorized shoulder-surfing, backup codes are <strong className="text-slate-200">never displayed on-screen</strong>. Enter a password to encrypt and download your emergency recovery keys PDF.
                    </p>

                    {pdfError && (
                      <div className="p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] flex items-center space-x-2">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                        <span>{pdfError}</span>
                      </div>
                    )}

                    {!pdfDownloaded ? (
                      <div className="space-y-2.5 pt-1">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-300 mb-1">
                            Set PDF Document Password:
                          </label>
                          <div className="relative">
                            <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              type={showPdfPassword ? 'text' : 'password'}
                              value={pdfPassword}
                              onChange={(e) => setPdfPassword(e.target.value)}
                              placeholder="Choose document password (min 6 chars)"
                              className="w-full pl-8 pr-10 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPdfPassword(!showPdfPassword)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                              title={showPdfPassword ? 'Hide password' : 'Show password'}
                            >
                              {showPdfPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleDownloadProtectedPdf}
                          disabled={isGeneratingPdf || pdfPassword.length < 6}
                          className="w-full py-2.5 px-3 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                        >
                          {isGeneratingPdf ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Generating Encrypted PDF...</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5" />
                              <span>Download Password-Protected PDF (.pdf)</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-lg flex items-start justify-between text-emerald-300">
                        <div className="flex items-start space-x-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-xs text-emerald-200">
                              Recovery PDF Generated & Downloaded
                            </p>
                            <p className="text-[11px] text-emerald-400/90 mt-0.5">
                              Protected with 128-bit AES encryption. Only openable with your chosen document password.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPdfDownloaded(false)}
                          className="text-[10px] text-emerald-400 hover:text-emerald-200 underline cursor-pointer shrink-0 ml-2"
                        >
                          Re-download
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Step 3: Verify First 6-digit Code */}
                  <div className="pt-2 border-t border-slate-700/70">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        3
                      </div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Confirm 6-digit Code from Authenticator
                      </h4>
                    </div>

                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      className="w-full text-center text-2xl font-mono tracking-[0.3em] px-4 py-2.5 bg-slate-900 border border-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 rounded-xl text-white outline-none transition-all placeholder:text-slate-600"
                    />

                    {!pdfDownloaded && (
                      <p className="text-[11px] text-amber-400 mt-2 text-center flex items-center justify-center space-x-1">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span>Please download your password-protected recovery PDF before activating MFA.</span>
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={totpCode.length !== 6 || isVerifying || !pdfDownloaded}
                      className="mt-3 w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      {isVerifying ? (
                        <span>Activating Multi-Factor Authentication...</span>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Activate MFA & Access Application</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Cancel / Switch User Action */}
          <div className="mt-6 pt-4 border-t border-slate-700/60 text-center">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Cancel and sign in as different user</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
