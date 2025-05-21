'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLanguage } from '../../../../../i18n/language-context';
import Button from '../../../../../components/ui/Button';
import Input from '../../../../../components/ui/Input';
import { Card, CardHeader, CardContent, CardTitle } from '../../../../../components/ui/Card';
import { KeyRound, Copy, Check, ArrowLeft, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import adminService from '../../../../../services/admin-service';

// Password strength levels
enum PasswordStrength {
  Weak = 'weak',
  Medium = 'medium',
  Strong = 'strong',
}

// Get password strength level
const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password || password.length < 8) {
    return PasswordStrength.Weak;
  }
  
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[^a-zA-Z0-9]/.test(password);
  
  if (hasLetters && hasNumbers && hasSpecialChars && password.length >= 12) {
    return PasswordStrength.Strong;
  }
  
  if ((hasLetters && hasNumbers) || (hasLetters && hasSpecialChars) || (hasNumbers && hasSpecialChars)) {
    return PasswordStrength.Medium;
  }
  
  return PasswordStrength.Weak;
};

export default function ResetPasswordPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  
  // User data
  const [userData, setUserData] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
  
  // Form state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRandom, setIsRandom] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordCopied, setPasswordCopied] = useState(false);
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Get password strength
  const passwordStrength = getPasswordStrength(isRandom ? generatedPassword : password);
  
  // Get strength label color & text
  const getStrengthInfo = () => {
    switch (passwordStrength) {
      case PasswordStrength.Strong:
        return { color: 'text-green-600', label: t('admin.passwordStrengthStrong') };
      case PasswordStrength.Medium:
        return { color: 'text-yellow-600', label: t('admin.passwordStrengthMedium') };
      case PasswordStrength.Weak:
      default:
        return { color: 'text-red-600', label: t('admin.passwordStrengthWeak') };
    }
  };
  
  // Generate a random password
  const generateRandomPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
    const length = 16;
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setGeneratedPassword(result);
    setIsRandom(true);
    setPasswordCopied(false);
  };
  
  // Copy generated password to clipboard
  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    setPasswordCopied(true);
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setPasswordCopied(false);
    }, 2000);
  };
  
  // Validate password fields
  const validatePasswords = (): boolean => {
    if (isRandom) {
      return true;
    }
    
    if (!password) {
      setError(t('admin.passwordRequired'));
      return false;
    }
    
    if (password.length < 8) {
      setError(t('admin.passwordTooShort'));
      return false;
    }
    
    if (password !== confirmPassword) {
      setError(t('admin.passwordsDoNotMatch'));
      return false;
    }
    
    return true;
  };
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      
      try {
        const response = await adminService.getUserById(userId);
        
        if (response.success && response.data) {
          setUserData({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email
          });
          setError(null);
        } else {
          setError(response.message || t('admin.userNotFound'));
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(t('admin.userFetchError'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [userId, t]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      const response = await adminService.changeUserPassword(userId, isRandom ? generatedPassword : password);
      
      if (response.success) {
        setSuccess(t('admin.passwordResetSuccess'));
        
        // Clear form
        if (!isRandom) {
          setPassword('');
          setConfirmPassword('');
        }
        
        // Navigate back to user page after delay
        setTimeout(() => {
          router.push(`/admin/users/${userId}`);
        }, 2000);
      } else {
        setError(response.message || t('admin.passwordResetError'));
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      setError(t('admin.passwordResetError'));
    } finally {
      setIsSaving(false);
    }
  };
  
  // Return to user details
  const handleCancel = () => {
    router.push(`/admin/users/${userId}`);
  };
  
  return (
    <>
      <div className="pb-5 border-b border-[var(--cognac)]">
        <div className="flex justify-between">
          <div>
            <h2 className="text-2xl leading-6 font-bold text-[var(--sage-green)]">
              {t('admin.resetPassword')}
            </h2>
            <p className="mt-2 max-w-4xl text-sm text-black">
              {t('admin.resetPasswordDescription')}
            </p>
          </div>
          <div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCancel}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('admin.backToUser')}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Alert messages */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
      
      {isLoading ? (
        <div className="mt-6 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--sage-green)]"></div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* User Info */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.userInfo')}</CardTitle>
              </CardHeader>
              <CardContent>
                {userData && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-[var(--sage-green)]">{t('admin.name')}</p>
                      <p className="mt-1 text-black">{userData.firstName} {userData.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--sage-green)]">{t('admin.email')}</p>
                      <p className="mt-1 text-black">{userData.email}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Reset Password Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.resetPasswordFor')} {userData?.firstName} {userData?.lastName}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {/* Password options */}
                    <div className="bg-[var(--taupe-light)] p-4 rounded-lg">
                      <h3 className="text-black font-medium mb-4 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-[var(--sage-green)]" />
                        {t('admin.passwordOptions')}
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Random password option */}
                        <div>
                          <div className="relative flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="random-password"
                                name="password-type"
                                type="checkbox"
                                checked={isRandom}
                                onChange={() => setIsRandom(!isRandom)}
                                className="h-4 w-4 text-[var(--sage-green)] border-gray-300 rounded focus:ring-[var(--sage-green)]"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="random-password" className="font-medium text-black">{t('admin.generateRandomPassword')}</label>
                            </div>
                          </div>
                          
                          {isRandom && (
                            <div className="mt-4">
                              <div className="flex">
                                <Button 
                                  type="button" 
                                  variant="primary" 
                                  onClick={generateRandomPassword}
                                  size="sm"
                                >
                                  <KeyRound className="h-4 w-4 mr-2" />
                                  {t('admin.generatePassword')}
                                </Button>
                              </div>
                              
                              {generatedPassword && (
                                <div className="mt-3">
                                  <div className="flex items-center">
                                    <div className="bg-gray-100 p-2 rounded font-mono text-black text-sm flex-grow">
                                      {generatedPassword}
                                    </div>
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      size="sm"
                                      onClick={copyPasswordToClipboard}
                                      className="ml-2 flex-shrink-0"
                                    >
                                      {passwordCopied ? (
                                        <Check className="h-4 w-4" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                  <div className="mt-2 flex items-center">
                                    <span className={`text-xs ${getStrengthInfo().color}`}>
                                      {getStrengthInfo().label}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Custom password fields */}
                        {!isRandom && (
                          <>
                            <div>
                              <Input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                label={t('admin.newPassword')}
                                required={!isRandom}
                                disabled={isSaving}
                                fullWidth
                              />
                              
                              {password && (
                                <div className="mt-2 flex items-center">
                                  <span className={`text-xs ${getStrengthInfo().color}`}>
                                    {getStrengthInfo().label}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <Input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                label={t('admin.confirmPassword')}
                                required={!isRandom}
                                disabled={isSaving}
                                fullWidth
                                error={
                                  confirmPassword && password !== confirmPassword 
                                    ? t('admin.passwordsDoNotMatch') 
                                    : undefined
                                }
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end space-x-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button 
                      type="submit" 
                      isLoading={isSaving}
                      disabled={isRandom && !generatedPassword}
                    >
                      <KeyRound className="h-4 w-4 mr-2" />
                      {t('admin.resetPassword')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
} 