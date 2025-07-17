'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../i18n/language-context';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '../../../components/ui/Card';
import { Search, UserPlus, Filter, ChevronLeft, ChevronRight, Mail, Calendar, UserCog, Edit, Users } from 'lucide-react';
import adminService, { AdminUser } from '../../../services/admin-service';

// Filters for user list
const filters = [
  { id: 'all', name: 'admin.allUsers', label: 'admin.allUsers' },
  { id: 'active', name: 'admin.activeUsers', label: 'admin.activeUsers' },
  { id: 'inactive', name: 'admin.inactiveUsers', label: 'admin.inactiveUsers' }
];

// Sort options for user list
const sortOptions = [
  { value: 'name_asc', label: 'admin.nameAZ' },
  { value: 'name_desc', label: 'admin.nameZA' },
  { value: 'email_asc', label: 'admin.emailAZ' },
  { value: 'email_desc', label: 'admin.emailZA' },
  { value: 'created_desc', label: 'admin.newestFirst' },
  { value: 'created_asc', label: 'admin.oldestFirst' }
];

export default function UsersPage() {
  const { t } = useLanguage();
  const router = useRouter();
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name_asc');
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const pageSize = 10;
  
  // Wrap these functions in their own useCallback hooks
  const getFilterParams = useCallback(() => {
    const params: Record<string, string> = {};
    if (activeFilter !== 'all') {
      params.role = activeFilter;
    }
    return params;
  }, [activeFilter]);

  const getSortParams = useCallback(() => {
    const [field, direction] = sortBy.split('_');
    let sortField = field;
    
    if (field === 'name') {
      sortField = 'firstName';
    } else if (field === 'created') {
      sortField = 'createdAt';
    }
    
    return {
      sortBy: sortField,
      sortOrder: direction
    };
  }, [sortBy]);
  
  // Fetch users function
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const filterParams = getFilterParams();
      const sortParams = getSortParams();
      const response = await adminService.getUsers({
        page: currentPage,
        limit: pageSize,
        search: searchQuery,
        ...filterParams,
        ...sortParams
      });
      
      if (response.success && response.data) {
        setUsers(response.data.users);
        setTotalUsers(response.data.total);
        setTotalPages(Math.ceil(response.data.total / pageSize));
        setError(null);
      } else {
        setError(response.message || t('admin.usersLoadError'));
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(t('admin.usersLoadError'));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, getFilterParams, getSortParams, t]);
  
  // Fetch users on mount and when filters/sort/page changes
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchUsers();
  };
  
  // Handle filter change
  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset to first page on sort change
  };
  
  // Handle page navigation
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Format date based on the current language
  const formatDate = (date: string) => {
    if (!date) return '';
    
    return new Date(date).toLocaleDateString();
  };
  
  // Navigate to add user page
  const handleAddUser = () => {
    router.push('/admin/users/new');
  };
  
  // Navigate to edit user page
  const handleEditUser = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };
  
  // Toggle filters visibility on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // User card component for mobile view
  const UserCard = ({ user }: { user: AdminUser }) => (
    <div 
      className="bg-white rounded-lg shadow-sm border border-[var(--cognac)] mb-4 overflow-hidden cursor-pointer"
      onClick={() => handleEditUser(user._id)}
    >
      <div className="p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[var(--taupe)] flex items-center justify-center">
            <span className="text-[var(--sage-green)] font-medium">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </span>
          </div>
          <div className="ml-4 flex-1">
            <div className="text-base font-medium text-black">
              {user.firstName} {user.lastName}
            </div>
            <Badge variant={user.isActive ? 'success' : 'danger'} className="mt-1">
              {user.isActive ? t('admin.statusActive') : t('admin.statusInactive')}
            </Badge>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 mr-2 text-[var(--sage-green)]" />
            <span className="text-[var(--sage-green)]">{user.email}</span>
          </div>
          <div className="flex items-center text-sm">
            <UserCog className="h-4 w-4 mr-2 text-[var(--sage-green)]" />
            <span>{t(`role.${user.role.toLowerCase()}`)}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-[var(--sage-green)]" />
            <span>{formatDate(user.createdAt)}</span>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button 
            size="sm" 
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleEditUser(user._id);
            }}
          >
            <Edit className="h-4 w-4 mr-1" />
            {t('common.edit')}
          </Button>
        </div>
      </div>
    </div>
  );
  
  return (
    <>
      <div className="pb-5 border-b border-[var(--cognac)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl leading-6 font-bold text-[var(--sage-green)]">
              {t('admin.userManagement')}
            </h2>
            <p className="mt-2 max-w-4xl text-sm text-black">
              {t('admin.userManagementDescription')}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button 
              onClick={handleAddUser}
              variant="primary"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {t('admin.addUser')}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>{t('admin.users')}</CardTitle>
              <CardDescription className="mt-1 sm:mt-0">
                {totalUsers > 0 && !isLoading && (
                  <span>
                    {t('admin.showingUsers', { 
                      from: ((currentPage - 1) * pageSize + 1).toString(), 
                      to: Math.min(currentPage * pageSize, totalUsers).toString(), 
                      total: totalUsers.toString() 
                    })}
                  </span>
                )}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {/* Mobile search and filter toggle */}
            <div className="flex items-center justify-between md:hidden">
              <form onSubmit={handleSearch} className="flex flex-1 mt-4">
                <Input
                  type="text"
                  placeholder={t('admin.searchUsers')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-r-none"
                />
                <Button type="submit" className="bg-[var(--sage-green)] text-white h-10.5 rounded-l-none" variant="secondary">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              <Button 
                variant="outline" 
                className="ml-2 h-10.5" 
                onClick={toggleFilters}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Responsive filters (collapsible on mobile) */}
            <div className={`${showFilters ? 'block' : 'hidden'} md:block mb-8`}>
              {/* Desktop filters layout */}
              <div className="hidden md:flex md:items-end md:space-x-6">
                {/* Search section */}
                <div className="flex-1 max-w-xs">
                  <form onSubmit={handleSearch} className="flex">
                    <Input
                      type="text"
                      placeholder={t('admin.searchUsers')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="rounded-r-none"
                    />
                    <Button type="submit" className="bg-[var(--sage-green)] text-white h-10.5 rounded-l-none" variant="secondary">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                </div>

                {/* Filter dropdown section */}
                <div className="flex-1 max-w-xs">
                  <Select
                    id="filter"
                    value={activeFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    options={filters.map(filter => ({
                      value: filter.id,
                      label: t(filter.label)
                    }))}
                    fullWidth
                  />
                </div>
                
                {/* Sort dropdown section */}
                <div className="flex-1 max-w-xs">
                  <Select
                    id="sort"
                    value={sortBy}
                    onChange={handleSortChange}
                    options={sortOptions.map(option => ({
                      value: option.value,
                      label: t(option.label)
                    }))}
                    fullWidth
                  />
                </div>
              </div>

              {/* Mobile filters layout */}
              <div className="md:hidden">
                <div className="space-y-4">

                  {/* Filter dropdown - mobile */}
                  <div>
                    <Select
                      id="filter"
                      value={activeFilter}
                      onChange={(e) => handleFilterChange(e.target.value)}
                      options={filters.map(filter => ({
                        value: filter.id,
                        label: t(filter.label)
                      }))}
                      fullWidth
                    />
                  </div>
                  
                  {/* Sort dropdown - mobile */}
                  <div>
                    <Select
                      id="sort"
                      value={sortBy}
                      onChange={handleSortChange}
                      options={sortOptions.map(option => ({
                        value: option.value,
                        label: t(option.label)
                      }))}
                      fullWidth
                    />
                  </div>
                </div>
              </div>
            </div>
          
            {/* Users display - loading, empty, or content */}
            {isLoading ? (
              <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--sage-green)]"></div>
              </div>
            ) : users.length > 0 ? (
              <>
                {/* Mobile cards view */}
                <div className="md:hidden">
                  {users.map((user) => (
                    <UserCard key={user._id} user={user} />
                  ))}
                </div>
                
                {/* Desktop table view */}
                <div className="hidden md:block">
                  <div className="overflow-hidden rounded-lg border border-[var(--cognac)]">
                    <table className="min-w-full divide-y divide-[var(--cognac)]">
                      <thead className="bg-[var(--taupe)]">
                        <tr>
                          <th scope="col" className="px-2 py-2 text-left text-xs font-semibold text-[var(--sage-green)] uppercase tracking-wider w-1/4">
                            {t('admin.name')}
                          </th>
                          <th scope="col" className="px-2 py-2 text-left text-xs font-semibold text-[var(--sage-green)] uppercase tracking-wider w-1/4">
                            {t('admin.email')}
                          </th>
                          <th scope="col" className="px-2 py-2 text-left text-xs font-semibold text-[var(--sage-green)] uppercase tracking-wider w-1/6">
                            {t('admin.role')}
                          </th>
                          <th scope="col" className="px-2 py-2 text-left text-xs font-semibold text-[var(--sage-green)] uppercase tracking-wider w-1/6">
                            {t('admin.status')}
                          </th>
                          <th scope="col" className="px-2 py-2 text-left text-xs font-semibold text-[var(--sage-green)] uppercase tracking-wider w-1/6">
                            {t('admin.created')}
                          </th>
                          <th scope="col" className="relative px-2 py-2 w-16">
                            <span className="sr-only">{t('common.edit')}</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-[var(--cognac)]">
                        {users.map((user) => (
                          <tr 
                            key={user._id} 
                            onClick={() => handleEditUser(user._id)}
                            className="cursor-pointer hover:bg-[var(--taupe-light)] transition-colors"
                          >
                            <td className="px-2 py-2 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[var(--taupe)] flex items-center justify-center">
                                  <span className="text-[var(--sage-green)] font-medium text-xs">
                                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                  </span>
                                </div>
                                <div className="ml-2">
                                  <div className="text-sm font-semibold text-black">
                                    {user.firstName} {user.lastName}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap">
                              <div className="text-sm text-[var(--sage-green)] font-medium">
                                {user.email}
                              </div>
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap">
                              <div className="text-sm text-black">
                                {t(`role.${user.role.toLowerCase()}`)}
                              </div>
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap">
                              <Badge variant={user.isActive ? 'success' : 'danger'}>
                                {user.isActive ? t('admin.statusActive') : t('admin.statusInactive')}
                              </Badge>
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap">
                              <div className="text-sm text-black">
                                {formatDate(user.createdAt)}
                              </div>
                            </td>
                            <td className="px-2 py-2 whitespace-nowrap text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditUser(user._id);
                                }}
                                className="text-[var(--sage-green)] hover:text-[#424b3c] font-medium text-sm transition-colors"
                              >
                                {t('common.edit')}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 text-center">
                <Users className="mx-auto h-12 w-12 text-[var(--cognac)]" />
                <h3 className="mt-2 text-sm font-medium text-black">{t('admin.noUsers')}</h3>
                <p className="mt-1 text-sm text-[var(--sage-green)]">{t('admin.noUsersDescription')}</p>
                <div className="mt-6">
                  <Button onClick={handleAddUser}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    {t('admin.addUser')}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          
          {/* Pagination */}
          {!isLoading && users.length > 0 && totalPages > 1 && (
            <CardFooter className="border-t border-[var(--cognac)] px-4 py-2">
              <div className="flex items-center justify-between w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">{t('admin.previous')}</span>
                </Button>
                
                <div className="text-sm text-black">
                  {t('admin.pageCount', { 
                    current: currentPage.toString(), 
                    total: totalPages.toString() 
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <span className="hidden sm:inline">{t('admin.next')}</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </>
  );
} 