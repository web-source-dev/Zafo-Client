'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLanguage } from '../../../../i18n/language-context';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '../../../../components/ui/Card';
import Badge from '../../../../components/ui/Badge';
import { User, KeyRound, Mail, UserCog, Save, ArrowLeft, Trash, Ban, CheckCircle, AlertCircle } from 'lucide-react';
import adminService, { UserFormData } from '../../../../services/admin-service';

export default function UserDetailPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const isNewUser = userId === 'new';
  
  // Form state
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    firstName: '',
    lastName: '',
    role: 'user',
    isActive: true
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    firstName?: string;
    lastName?: string;
  }>({});
  
  // UI state
  const [isLoading, setIsLoading] = useState(!isNewUser);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Fetch user data if editing existing user
  useEffect(() => {
    if (isNewUser) {
      setIsLoading(false);
      return;
    }
    
    const fetchUser = async () => {
      try {
        const response = await adminService.getUserById(userId);
        
        if (response.success && response.data) {
          setFormData({
            email: response.data.email,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            role: response.data.role,
            isActive: response.data.isActive
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
    
    fetchUser();
  }, [isNewUser, userId, t]);
  
  // Validate form
  const validateForm = (): boolean => {
    const errors: {
      email?: string;
      firstName?: string;
      lastName?: string;
    } = {};
    
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('admin.validEmailRequired');
    }
    
    if (!formData.firstName.trim()) {
      errors.firstName = t('admin.firstNameRequired');
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = t('admin.lastNameRequired');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement & { name: string, value: string, type: string };
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev: UserFormData) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev: UserFormData) => ({ ...prev, [name]: value }));
    }
    
    // Clear previous messages
    setError(null);
    setSuccess(null);
    
    // Clear specific field error
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      let response;
      
      if (isNewUser) {
        // Generate a random secure password
        const tempPassword = `Temp${Math.random().toString(36).substring(2, 8)}${Math.floor(Math.random() * 10000)}!`;
        
        response = await adminService.createUser({
          ...formData,
          password: tempPassword
        });
        
        if (response.success) {
          // Store the generated password to show to the admin
          const newUserId = response.data?._id;
          setSuccess(t('admin.userCreatedWithPassword', { password: tempPassword }));
          
          // If it's a new user, navigate to the user detail page after brief delay
          setTimeout(() => {
            router.push(newUserId ? `/admin/users/${newUserId}` : '/admin/users');
          }, 3000);
        }
      } else {
        response = await adminService.updateUser(userId, formData);
        
        if (response.success) {
          // Update the local form data with the returned data to reflect any server-side changes
          setFormData({
            email: response.data?.email || formData.email,
            firstName: response.data?.firstName || formData.firstName,
            lastName: response.data?.lastName || formData.lastName,
            role: response.data?.role || formData.role,
            isActive: response.data?.isActive ?? formData.isActive
          });
          
          setSuccess(t('admin.userUpdated'));
        }
      }
      
      if (!response.success) {
        setError(response.message || (isNewUser ? t('admin.createUserError') : t('admin.updateUserError')));
      }
    } catch (err: unknown) {
      console.error('Error saving user:', err);
      setError((isNewUser ? t('admin.createUserError') : t('admin.updateUserError')));
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!userId || isNewUser) return;
    
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await adminService.deleteUser(userId);
      
      if (response.success) {
        setSuccess(t('admin.userDeleted'));
        
        // Navigate back to users list after brief delay
        setTimeout(() => {
          router.push('/admin/users');
        }, 1500);
      } else {
        setError(response.message || t('admin.deleteUserError'));
        setShowDeleteConfirm(false);
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(t('admin.deleteUserError'));
      setShowDeleteConfirm(false);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle reset password
  const handleResetPassword = () => {
    if (!userId || isNewUser) return;
    router.push(`/admin/users/${userId}/reset-password`);
  };
  
  // Return to users list
  const handleCancel = () => {
    router.push('/admin/users');
  };
  
  return (
    <>
      <div className="pb-5 border-b border-[var(--cognac)]">
        <div className="flex justify-between">
          <div>
            <h2 className="text-2xl leading-6 font-bold text-[var(--sage-green)]">
              {isNewUser ? t('admin.addUser') : t('admin.editUser')}
            </h2>
            <p className="mt-2 max-w-4xl text-sm text-black">
              {isNewUser ? t('admin.createUserDescription') : t('admin.editUserDescription')}
            </p>
          </div>
          <div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCancel}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('admin.backToUsers')}
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
        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded">
          {success}
        </div>
      )}
      
      {isLoading ? (
        <div className="mt-6 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--sage-green)]"></div>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* User Form */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isNewUser ? t('admin.userDetails') : formData.firstName + ' ' + formData.lastName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 gap-x-4">
                      {/* Email field */}
                      <div className="sm:col-span-6">
                        <div className="flex items-center mb-1">
                          <Mail className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium text-black">{t('admin.email')}</span>
                        </div>
                        <Input
                          type="email"
                          name="email"
                          id="email"
                          required
                          disabled={isSaving}
                          value={formData.email}
                          onChange={handleInputChange}
                          fullWidth
                          error={formErrors.email}
                        />
                      </div>
                      
                      {/* First name field */}
                      <div className="sm:col-span-3">
                        <div className="flex items-center mb-1">
                          <User className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium text-black">{t('admin.firstName')}</span>
                        </div>
                        <Input
                          type="text"
                          name="firstName"
                          id="firstName"
                          required
                          disabled={isSaving}
                          value={formData.firstName}
                          onChange={handleInputChange}
                          fullWidth
                          error={formErrors.firstName}
                        />
                      </div>
                      
                      {/* Last name field */}
                      <div className="sm:col-span-3">
                        <div className="flex items-center mb-1">
                          <User className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium text-black">{t('admin.lastName')}</span>
                        </div>
                        <Input
                          type="text"
                          name="lastName"
                          id="lastName"
                          required
                          disabled={isSaving}
                          value={formData.lastName}
                          onChange={handleInputChange}
                          fullWidth
                          error={formErrors.lastName}
                        />
                      </div>
                      
                      {/* Role selection */}
                      <div className="sm:col-span-3">
                        <div className="flex items-center mb-1">
                          <UserCog className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium text-black">{t('admin.role')}</span>
                        </div>
                        <Select
                          id="role"
                          name="role"
                          required
                          disabled={isSaving}
                          value={formData.role}
                          onChange={handleInputChange}
                          fullWidth
                          options={[
                            { value: 'user', label: t('role.user') },
                            { value: 'admin', label: t('role.admin') },
                            { value: 'guest', label: t('role.guest') }
                          ]}
                        />
                      </div>
                      
                      {/* Status toggle */}
                      <div className="sm:col-span-3">
                        <div className="flex items-center mb-1">
                          {formData.isActive ? (
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          ) : (
                            <Ban className="h-4 w-4 mr-2 text-red-500" />
                          )}
                          <span className="text-sm font-medium text-black">{t('admin.status')}</span>
                        </div>
                        <Select
                          id="isActive"
                          name="isActive"
                          required
                          disabled={isSaving}
                          value={formData.isActive ? 'true' : 'false'}
                          onChange={(e) => setFormData((prev: UserFormData) => ({ ...prev, isActive: e.target.value === 'true' }))}
                          fullWidth
                          options={[
                            { value: 'true', label: t('admin.statusActive') },
                            { value: 'false', label: t('admin.statusInactive') }
                          ]}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end space-x-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        disabled={isSaving}
                        onClick={handleCancel}
                      >
                        {t('common.cancel')}
                      </Button>
                      <Button 
                        type="submit" 
                        isLoading={isSaving}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isNewUser ? t('admin.createUser') : t('admin.saveChanges')}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Actions sidebar */}
            <div className="md:col-span-1">
              {!isNewUser && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('admin.userActions')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-xs text-[var(--sage-green)] uppercase tracking-wider mb-2">{t('admin.currentStatus')}</h3>
                      <Badge variant={formData.isActive ? 'success' : 'danger'}>
                        {formData.isActive ? t('admin.statusActive') : t('admin.statusInactive')}
                      </Badge>
                    </div>
                    
                    <div>
                      <Button 
                        variant="outline" 
                        fullWidth 
                        onClick={handleResetPassword}
                        disabled={isSaving}
                      >
                        <KeyRound className="h-4 w-4 mr-2" />
                        {t('admin.resetPassword')}
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-[var(--cognac)] px-4 py-3">
                    <div className="w-full">
                      {!showDeleteConfirm ? (
                        <Button 
                          variant="secondary" 
                          fullWidth
                          onClick={() => setShowDeleteConfirm(true)}
                          disabled={isSaving}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          {t('admin.deleteUser')}
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs text-red-600 mb-2">{t('admin.deleteConfirmation')}</p>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              fullWidth
                              onClick={() => setShowDeleteConfirm(false)}
                              disabled={isSaving}
                            >
                              {t('common.cancel')}
                            </Button>
                            <Button 
                              variant="danger" 
                              fullWidth
                              onClick={handleDeleteUser}
                              isLoading={isSaving}
                            >
                              {t('common.confirm')}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}