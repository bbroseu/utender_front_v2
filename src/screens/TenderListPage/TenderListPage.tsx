import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { FooterSection } from "../UtenderHomePage/sections/FooterSection/FooterSection";
import { TenderModal } from "../../components/TenderModal";
import { AdvancedSearchModal } from "../../components/AdvancedSearchModal";
import { Menu, X } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import { useLogoutMutation } from "../../store/api/authApi";
import { useGetTendersQuery, useLazyGetTendersQuery, useSearchTendersQuery, useGetMonthlyTenderStatsQuery, useGetCategoriesQuery, type TendersQueryParams } from "../../store/api/tendersApi";
import type { SearchFilters } from "../../components/AdvancedSearchModal";

export const TenderListPage = (): JSX.Element => {
 const navigate = useNavigate();
 const dispatch = useAppDispatch();
 const { user } = useAppSelector((state) => state.auth);
 const [logoutMutation] = useLogoutMutation();
 const [searchQuery, setSearchQuery] = useState("");
 const [currentPage, setCurrentPage] = useState(1);
 const [selectedTender, setSelectedTender] = useState(null);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
 const [advancedFilters, setAdvancedFilters] = useState<SearchFilters>({});
 const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
 const [categorySearchQuery, setCategorySearchQuery] = useState("");
 const [sortField, setSortField] = useState<'publication_date' | 'expiry_date' | null>('publication_date');
 const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

 const handleLogout = async () => {
  try {
   await logoutMutation().unwrap();
  } catch (error) {
   console.error('Logout failed:', error);
  } finally {
   dispatch(logout());
   navigate('/');
  }
 };

 // Debounce search query
 React.useEffect(() => {
  const timer = setTimeout(() => {
   setDebouncedSearchQuery(searchQuery);
  }, 500);

  return () => clearTimeout(timer);
 }, [searchQuery]);

 // Reset page to 1 when search query, category, or sorting changes
 React.useEffect(() => {
  setCurrentPage(1);
 }, [debouncedSearchQuery, selectedCategoryId, sortField, sortOrder]);

 // Use appropriate query based on search
 const shouldUseSearch = debouncedSearchQuery.trim().length > 0;
 const hasAdvancedFilters = Object.keys(advancedFilters).length > 0;

 // Build query params - now always using getTenders endpoint
 const queryParams = React.useMemo(() => {
   console.log('🔍 Building query params - sortField:', sortField, 'sortOrder:', sortOrder);

   let params: any = {
     page: currentPage,
     limit: 50
   };

   // Add search term if searching
   if (shouldUseSearch) {
     params.searchTerm = debouncedSearchQuery;
   }

   // Add advanced filters if present
   if (hasAdvancedFilters) {
     params = { ...params, ...advancedFilters };
   }

   // Add category filter if selected
   if (selectedCategoryId) {
     params.category_id = selectedCategoryId;
   }

   // Always add sorting parameters if they are set
   if (sortField) {
     params.sortBy = sortField;
     params.sortOrder = sortOrder;
   }

   console.log('📊 Final query params:', JSON.stringify(params));
   return params;
 }, [shouldUseSearch, hasAdvancedFilters, debouncedSearchQuery, currentPage, selectedCategoryId, sortField, sortOrder, advancedFilters]);

 // Log which endpoint is being used
 console.log('🎯 Using endpoint: GET_TENDERS (unified)', 'with params:', queryParams);

 // Create a unique key for RTK Query to force refetching
 // This ensures RTK Query treats each sort change as a new query
 const queryKey = React.useMemo(() => {
   return JSON.stringify(queryParams);
 }, [queryParams]);

 // Use lazy query for manual control
 const [getTenders, { data: tendersData, isLoading, isFetching, isError, error, isSuccess }] = useLazyGetTendersQuery();

 // Trigger the query whenever params change
 React.useEffect(() => {
   console.log('🚀 Triggering getTenders with params:', queryParams);
   getTenders(queryParams)
     .then((result) => {
       console.log('✅ Query result:', result);
       if (result.data) {
         console.log('📦 Data received:', result.data.data?.length, 'tenders');
       }
     })
     .catch((err) => {
       console.error('❌ Query error:', err);
     });
 }, [queryParams]);

 // Debug loading states and data
 React.useEffect(() => {
   console.log('📊 Query state - isLoading:', isLoading, 'isFetching:', isFetching, 'isSuccess:', isSuccess, 'isError:', isError);
   if (error) {
     console.error('❌ Error details:', error);
   }
 }, [isLoading, isFetching, isSuccess, isError, error]);


 const tenders = tendersData?.data || [];
 const totalPages = tendersData?.pagination?.totalPages || 0;
 const totalTenders = tendersData?.pagination?.total || 0;

 // Debug: Log the received data
 React.useEffect(() => {
   console.log('🎯 Frontend - Received tendersData:', tendersData);
   console.log('🎯 Frontend - Extracted tenders array:', tenders);
   console.log('🎯 Frontend - Tenders count:', tenders.length);
   if (tenders.length > 0) {
     console.log('🎯 Frontend - First tender sample:', tenders[0]);
   }
 }, [tendersData, tenders]);

 // Log when sort parameters change
 React.useEffect(() => {
   console.log('🔄 Sort parameters changed in useEffect - sortField:', sortField, 'sortOrder:', sortOrder);
   // The lazy query will be triggered automatically via queryParams change
 }, [sortField, sortOrder]);

 // Get monthly stats (with error handling for missing endpoint)
 const { data: monthlyStatsData, isError: isMonthlyStatsError } = useGetMonthlyTenderStatsQuery({});
 const monthlyTenderCount = isMonthlyStatsError ? 0 : (monthlyStatsData?.data?.count || 0);

 // Albanian month names
 const getAlbanianMonth = () => {
  const monthNames = [
   'Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor',
   'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'
  ];
  return monthNames[new Date().getMonth()];
 };
 const currentMonth = getAlbanianMonth();

 // Get categories
 const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategoriesQuery();
 const categories = React.useMemo(() => {
  const data = categoriesData?.data || [];
  return [...data].sort((a, b) => a.name.localeCompare(b.name, 'sq'));
 }, [categoriesData]);

 // Filter categories based on search query
 const filteredCategories = React.useMemo(() => {
  if (!categorySearchQuery.trim()) {
   return categories;
  }
  return categories.filter(category =>
   category.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );
 }, [categories, categorySearchQuery]);

 const getDisplayName = () => {
  if (user?.firstName && user?.lastName) {
   return `${user.firstName} ${user.lastName}`;
  }
  if (user?.firstName) {
   return user.firstName;
  }
  if (user?.lastName) {
   return user.lastName;
  }
  if (user?.username) {
   return user.username;
  }
  if (user?.email) {
   return user.email.split('@')[0];
  }
  return 'User';
 };

 const getInitials = () => {
  if (user?.firstName && user?.lastName) {
   return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }
  if (user?.firstName) {
   return user.firstName.charAt(0).toUpperCase();
  }
  if (user?.lastName) {
   return user.lastName.charAt(0).toUpperCase();
  }
  if (user?.username) {
   return user.username.charAt(0).toUpperCase();
  }
  if (user?.email) {
   return user.email.charAt(0).toUpperCase();
  }
  return 'U';
 };

 // Helper function to format dates
 const formatDate = (timestamp: number) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp * 1000).toLocaleDateString('en-GB');
 };

 // Helper function to get display values for tender fields
 const getTenderDisplayData = (tender: any) => {
  console.log('🔧 Frontend - Processing tender:', tender);
  const result = {
    authority: tender.contracting_authority_name || 'Unknown Authority',
    title: tender.title || 'No Title',
    dataPublished: formatDate(tender.publication_date),
    dataDeadline: formatDate(tender.expiry_date),
    category: tender.category_name || 'Uncategorized',
    status: 'Kosovë',
    procedure: tender.procedure_name || 'Unknown Procedure'
  };
  console.log('🔧 Frontend - Processed display data:', result);
  return result;
 };

 const openTenderModal = (tender: any) => {
  setSelectedTender(tender);
  setIsModalOpen(true);
 };

 const closeTenderModal = () => {
  setIsModalOpen(false);
  setSelectedTender(null);
 };

 const handleAdvancedSearch = (filters: SearchFilters) => {
  console.log("Advanced search filters received:", filters);
  setAdvancedFilters(filters);
  setCurrentPage(1);
 };

 const handleSort = (field: 'publication_date' | 'expiry_date') => {
  console.log('🔄 SORT BUTTON CLICKED!');
  console.log('  📍 Field clicked:', field);
  console.log('  📍 Current state - sortField:', sortField, 'sortOrder:', sortOrder);

  // Reset to page 1 first
  setCurrentPage(1);

  if (sortField === field) {
   // Toggle sort order if clicking the same field
   const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
   console.log('  ➡️ Same field clicked - toggling order from', sortOrder, 'to', newOrder);
   setSortOrder(newOrder);
  } else {
   // Set new field with default desc order
   console.log('  ➡️ Different field clicked - changing from', sortField, 'to', field);
   console.log('  ➡️ Setting order to desc');
   setSortField(field);
   setSortOrder('desc');
  }

  // Force an immediate log of what will be sent
  setTimeout(() => {
   console.log('  ✅ State after update - sortField:', sortField, 'sortOrder:', sortOrder);
  }, 100);
 };

 const handleCategoryClick = (categoryId: number) => {
  if (selectedCategoryId === categoryId) {
   // Clicking the same category again will clear the filter
   setSelectedCategoryId(null);
  } else {
   setSelectedCategoryId(categoryId);
  }
 };

 return (
  <div className="min-h-screen bg-white font-questrial">
   {/* Header */}
   <header className="bg-white py-4">
    <div className="tenders-container  mx-auto px-4 lg:px-[148px]">
     <div className="border border-gray-200 rounded-lg px-3 md:px-6 py-4">
      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between relative">
       <div className="flex items-center gap-2">
        <div className="bg-[#f0c419] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">{getInitials()}</div>
        <span className="text-[#1b2631] text-xs cursor-pointer hover:text-[#f0c419]" onClick={() => navigate("/profile")}>
         {getDisplayName()}
        </span>
        <button className="text-gray-400 ml-1 text-xs hover:text-gray-600" onClick={() => navigate("/profile")}>
         ✏️
        </button>
       </div>

       <div className="absolute left-1/2 -translate-x-1/2 flex items-center cursor-pointer" onClick={() => navigate("/")}>
        <img className="w-[35px] h-[42px]" alt="Group" src="/group-1321316878.png" />
       </div>

       <div className="flex items-center gap-4">
        <div className="flex flex-col gap-1 text-xs text-right">
         <div>
          <span className="text-gray-600">Pako Aktive: </span>
          <span className="font-semibold text-[#1b2631]">{user?.pako_name || 'N/A'}</span>
         </div>
         <div>
          <span className="text-gray-600">Pako përfundon: </span>
          <span className="font-semibold text-[#1b2631]">
           {user?.valid_time ? new Date(user.valid_time * 1000).toLocaleDateString('en-GB') : 'N/A'}
          </span>
         </div>
        </div>
        <Button onClick={handleLogout} className="bg-[#f0c419] hover:bg-[#f0c419]/90 text-white px-3 py-1 rounded-md text-xs">Çkyçu</Button>
       </div>
      </div>

      {/* Mobile/Tablet Header */}
      <div className="lg:hidden">
       <div className="flex items-center justify-between">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 hover:text-gray-800 z-50">
         <Menu className="h-6 w-6" />
        </button>

        <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
         <img className="w-[30px] h-[36px]" alt="Group" src="/group-1321316878.png" />
        </div>

        <div className="flex items-center gap-2">
         <div className="bg-[#f0c419] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">{getInitials()}</div>
        </div>
       </div>
      </div>
     </div>
    </div>
   </header>

   {/* Mobile Menu Overlay */}
   {isMobileMenuOpen && (
    <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300" onClick={() => setIsMobileMenuOpen(false)} />
   )}

   {/* Mobile Menu Drawer */}
   <div
    className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
     isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
    }`}
   >
    <div className="p-4 h-full flex flex-col">
     <div className="flex items-center justify-between mb-6">
      <img className="w-[30px] h-[36px]" alt="Group" src="/group-1321316878.png" />
      <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-600 hover:text-gray-800">
       <X className="h-6 w-6" />
      </button>
     </div>

     {/* User Info */}
     <div className="pb-6 border-b border-gray-200">
      <div className="flex items-center gap-3 mb-4">
       <div className="bg-[#f0c419] text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-medium">{getInitials()}</div>
       <div>
        <div
         className="text-[#1b2631] font-semibold cursor-pointer hover:text-[#f0c419]"
         onClick={() => {
          navigate("/profile");
          setIsMobileMenuOpen(false);
         }}
        >
         {getDisplayName()}
        </div>
        <button
         className="text-gray-400 text-xs hover:text-gray-600"
         onClick={() => {
          navigate("/profile");
          setIsMobileMenuOpen(false);
         }}
        >
         ✏️ Ndrysho
        </button>
       </div>
      </div>

      <div className="space-y-2 text-sm">
       <div className="flex justify-between">
        <span className="text-gray-600">Pako Aktive:</span>
        <span className="font-semibold text-[#1b2631]">{user?.pako_name || 'N/A'}</span>
       </div>
       <div className="flex justify-between">
        <span className="text-gray-600">Pako përfundon:</span>
        <span className="font-semibold text-[#1b2631]">
         {user?.valid_time ? new Date(user.valid_time * 1000).toLocaleDateString('en-GB') : 'N/A'}
        </span>
       </div>
      </div>
     </div>

     {/* Navigation */}
     <nav className="flex-1 py-6 space-y-1">
      <div
       className="px-4 py-3 rounded-lg cursor-pointer transition-colors bg-[#f0c419]/10 text-[#f0c419] font-semibold"
       onClick={() => navigate('/tenders')}
      >
       Tenderët
      </div>
      <div
       className="px-4 py-3 rounded-lg cursor-pointer transition-colors text-[#1b2631] hover:bg-gray-50"
       onClick={() => navigate('/packages')}
      >
       Pakot
      </div>
      <div
       className="px-4 py-3 rounded-lg cursor-pointer transition-colors text-[#1b2631] hover:bg-gray-50"
       onClick={() => navigate('/contact')}
      >
       Kontakto
      </div>
     </nav>

     {/* Logout Button */}
     <div className="pt-6 border-t border-gray-200">
      <Button onClick={handleLogout} className="w-full bg-[#f0c419] hover:bg-[#f0c419]/90 text-white py-2.5 rounded-lg font-semibold">Çkyçu</Button>
     </div>
    </div>
   </div>

   {/* Yellow Banner */}
   <div className="tenders-tenders-container  mx-auto px-4 lg:px-[148px] py-4">
    <div className="bg-[#f0c419] text-white rounded-lg px-4 md:px-6 py-4">
     {/* Desktop Version */}
     <div className="hidden md:flex items-center justify-between">
      <div className="flex items-center gap-2">
       <img src="/material-symbols_settings.svg" alt="Categories" className="w-5 h-5 brightness-0 invert" />
       <span className="font-medium">Zgjedh Kategorinë</span>
      </div>

      <div className="text-center flex-1">
       <span className="font-medium">Tenderë të postur gjatë muajt {currentMonth} : {monthlyTenderCount}</span>
      </div>

      <button onClick={() => setIsAdvancedSearchOpen(true)} className="flex items-center gap-2">
       <span className="text-white">⚙️</span>
       <span className="font-medium">Kërkim i Avancuar</span>
      </button>
     </div>

     {/* Mobile Version */}
     <div className="md:hidden space-y-3">
      <div className="text-center">
       <span className="font-medium text-sm">Tenderë të postur gjatë muajt {currentMonth} : {monthlyTenderCount}</span>
      </div>
      <div className="flex gap-2">
       <button className="flex-1 flex items-center justify-center gap-1 bg-white/20 rounded-md py-2 px-3">
        <img src="/material-symbols_settings.svg" alt="Categories" className="w-4 h-4 brightness-0 invert" />
        <span className="text-sm font-medium">Kategoritë</span>
       </button>
       <button
        onClick={() => setIsAdvancedSearchOpen(true)}
        className="flex-1 flex items-center justify-center gap-1 bg-white/20 rounded-md py-2 px-3"
       >
        <span className="text-white text-sm">⚙️</span>
        <span className="text-sm font-medium">Kërkim Avancuar</span>
       </button>
      </div>
     </div>
    </div>
   </div>

   {/* Categories */}
   <div className="tenders-container  mx-auto px-4 lg:px-[148px] py-2">
    <div className="bg-white py-3">
     <div className="flex flex-col gap-3">
      {/* Category Header with Search */}
      <div className="flex items-center gap-2 md:gap-4">
       <span className="font-medium text-[#1B2631] text-sm md:text-md whitespace-nowrap">Kategoritë:</span>
       <div className="flex-1 max-w-xs">
        <Input
         type="text"
         placeholder="Kërko kategori..."
         value={categorySearchQuery}
         onChange={(e) => setCategorySearchQuery(e.target.value)}
         className="h-8 text-xs border-gray-300 focus:border-[#f0c419] focus:ring-[#f0c419]"
        />
       </div>
      </div>

      {/* Category Pills */}
      <div className="flex-1 overflow-x-auto scrollbar-hide">
       <div className="flex items-center gap-2 md:gap-3">
        <button
         onClick={() => setSelectedCategoryId(null)}
         className={`text-xs md:text-sm transition-colors border rounded-full px-2 md:px-3 py-1 whitespace-nowrap flex-shrink-0 ${
          selectedCategoryId === null
           ? "bg-[#f0c419] text-white border-[#f0c419]"
           : "text-gray-500 border-gray-300 hover:text-[#f0c419] hover:border-[#f0c419]"
         }`}
        >
         Të gjitha
        </button>
        {filteredCategories.map((category) => (
         <button
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          className={`text-xs md:text-sm transition-colors border rounded-full px-2 md:px-3 py-1 whitespace-nowrap flex-shrink-0 ${
           selectedCategoryId === category.id
            ? "bg-[#f0c419] text-white border-[#f0c419]"
            : "text-gray-500 border-gray-300 hover:text-[#f0c419] hover:border-[#f0c419]"
          }`}
         >
          {category.name}
         </button>
        ))}
       </div>
      </div>
     </div>
    </div>
   </div>

   {/* Search Bar */}
   <div className="tenders-tenders-container   mx-auto px-4 lg:px-[148px] py-4">
    <div className="bg-white py-4">
     <div className="relative">
      <Input
       type="text"
       placeholder="Kërko"
       value={searchQuery}
       onChange={(e) => setSearchQuery(e.target.value)}
       className="pl-10 pr-4 py-5 w-full border border-gray-200 rounded-lg bg-white"
      />
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
     </div>
    </div>
   </div>

   {/* Mobile Cards (visible on mobile) */}
   <div className="block md:hidden tenders-container  mx-auto px-4 py-4">
    {/* Mobile Sorting Controls */}
    <div className="mb-4 flex gap-2">
     <button
      onClick={() => handleSort('publication_date')}
      className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
       sortField === 'publication_date'
        ? 'bg-[#f0c419] text-white border-[#f0c419]'
        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
      }`}
     >
      Data e Publikimit {sortField === 'publication_date' && (sortOrder === 'asc' ? '↑' : '↓')}
     </button>
     <button
      onClick={() => handleSort('expiry_date')}
      className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
       sortField === 'expiry_date'
        ? 'bg-[#f0c419] text-white border-[#f0c419]'
        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
      }`}
     >
      Data e Perfundimit {sortField === 'expiry_date' && (sortOrder === 'asc' ? '↑' : '↓')}
     </button>
    </div>

    {isLoading && (
     <div className="text-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f0c419] mx-auto"></div>
      <p className="mt-2 text-gray-600">Loading tenders...</p>
     </div>
    )}
    {isError && (
     <div className="text-center py-8">
      <p className="text-red-600">Error loading tenders. Please try again.</p>
     </div>
    )}
    {!isLoading && !isError && tenders.length === 0 && (
     <div className="text-center py-8">
      <p className="text-gray-600">No tenders found.</p>
     </div>
    )}
    {!isLoading && !isError && tenders.map((tender, index) => {
     const displayData = getTenderDisplayData(tender);
     return (
      <motion.div
       key={tender.id || index}
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.4, delay: index * 0.1 }}
       className="bg-white border border-gray-200 rounded-lg p-4 mb-3"
      >
       <div
        className="font-bold text-xs text-gray-900 mb-2 cursor-pointer hover:text-[#f0c419] transition-colors"
        onClick={() => openTenderModal(tender)}
       >
        {displayData.title}
       </div>
       <div className="text-xs text-gray-700 mb-1">
        <span className="font-semibold">Autoriteti:</span> {displayData.authority}
       </div>
       <div className="text-xs text-gray-600 mb-1">
        <span className="font-semibold">Data Publikimit:</span> {displayData.dataPublished}
       </div>
       <div className="text-xs text-gray-600 mb-1">
        <span className="font-semibold">Data Skadimit:</span> {displayData.dataDeadline}
       </div>
       <div className="text-xs text-gray-600 mb-1">
        <span className="font-semibold">Kategoria:</span> {displayData.category}
       </div>
       <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-gray-600">{displayData.procedure}</span>
        <button onClick={() => openTenderModal(tender)} className="text-white rounded-full flex items-center justify-center">
         <img src="/arrow.svg" alt="Arrow" className="w-6 h-6" />
        </button>
       </div>
      </motion.div>
     );
    })}
   </div>

   {/* Table tenders-container  (hidden on mobile) */}
   <div className="hidden md:block tenders-container  mx-auto px-4 lg:px-[148px]">
    <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     transition={{ duration: 0.5 }}
     className="bg-white border-t border-b border-gray-200"
    >
     <div className="overflow-x-auto">
      <table className="w-full min-w-[768px]">
       <motion.thead
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gray-50 border-b border-gray-200"
       >
        <tr>
         <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Autoriteti Kontraktues</th>
         <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Titulli i Tenderit</th>
         <th
          className="px-4 py-3 text-left text-xs font-bold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors select-none"
          onClick={() => handleSort('publication_date')}
         >
          <div className="flex items-center gap-1">
           Data e Publikimit
           <span className={sortField === 'publication_date' ? 'text-[#f0c419]' : 'text-gray-400'}>
            {sortField === 'publication_date' && sortOrder === 'asc' ? '↑' : '↓'}
           </span>
          </div>
         </th>
         <th
          className="px-4 py-3 text-left text-xs font-bold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors select-none"
          onClick={() => handleSort('expiry_date')}
         >
          <div className="flex items-center gap-1">
           Data e Perfundimit
           <span className={sortField === 'expiry_date' ? 'text-[#f0c419]' : 'text-gray-400'}>
            {sortField === 'expiry_date' && sortOrder === 'asc' ? '↑' : '↓'}
           </span>
          </div>
         </th>
         <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Nënkategoria</th>
         <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Shteti</th>
         <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Procedura</th>
        </tr>
       </motion.thead>
       <tbody>
        {isLoading && (
         <tr>
          <td colSpan={7} className="px-4 py-8 text-center">
           <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f0c419] mb-2"></div>
            <p className="text-gray-600">Loading tenders...</p>
           </div>
          </td>
         </tr>
        )}
        {isError && (
         <tr>
          <td colSpan={7} className="px-4 py-8 text-center">
           <p className="text-red-600">Error loading tenders. Please try again.</p>
          </td>
         </tr>
        )}
        {!isLoading && !isError && tenders.length === 0 && (
         <tr>
          <td colSpan={7} className="px-4 py-8 text-center">
           <p className="text-gray-600">No tenders found.</p>
          </td>
         </tr>
        )}
        {!isLoading && !isError && tenders.map((tender, index) => {
         const displayData = getTenderDisplayData(tender);
         return (
          <motion.tr
           key={tender.id || index}
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.3, delay: index * 0.05 }}
           className="border-b border-gray-100 hover:bg-gray-50"
          >
           <td className="px-4 py-4 text-xs text-gray-900">{displayData.authority}</td>
           <td
            className="px-4 py-4 text-xs text-gray-900 font-bold max-w-[250px] cursor-pointer hover:text-[#f0c419] transition-colors"
            onClick={() => openTenderModal(tender)}
           >
            {displayData.title}
           </td>
           <td className="px-4 py-4 text-xs text-gray-600">{displayData.dataPublished}</td>
           <td className="px-4 py-4 text-xs text-gray-600">{displayData.dataDeadline}</td>
           <td className="px-4 py-4 text-xs text-gray-600 max-w-[150px]">{displayData.category}</td>
           <td className="px-4 py-4 text-xs text-gray-600">{displayData.status}</td>
           <td className="px-4 py-4 text-xs">
            <div className="flex items-center justify-between">
             <span className="text-xs text-gray-600">{displayData.procedure}</span>
             <button onClick={() => openTenderModal(tender)} className="text-white rounded-full flex items-center justify-center ml-2">
              <img src="/arrow.svg" alt="Arrow" className="w-6 h-6" />
             </button>
            </div>
           </td>
          </motion.tr>
         );
        })}
       </tbody>
      </table>
     </div>
    </motion.div>
   </div>

   {/* Pagination */}
   {totalPages > 1 && (
    <div className="tenders-container  mx-auto px-4 lg:px-[148px] py-8">
     <div className="flex items-center justify-center gap-1 flex-wrap">
      <button
       onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
       disabled={currentPage === 1}
       className="px-2.5 py-1.5 border border-gray-300 text-sm text-gray-600 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
       ‹
      </button>

      {/* Dynamic pagination buttons */}
      {(() => {
       const pages = [];
       const startPage = Math.max(1, currentPage - 2);
       const endPage = Math.min(totalPages, currentPage + 2);

       // First page
       if (startPage > 1) {
        pages.push(
         <button
          key={1}
          onClick={() => setCurrentPage(1)}
          className="px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded"
         >
          1
         </button>
        );
        if (startPage > 2) {
         pages.push(<span key="start-ellipsis" className="px-1.5 text-sm text-gray-400">...</span>);
        }
       }

       // Current page range
       for (let i = startPage; i <= endPage; i++) {
        pages.push(
         <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-2.5 py-1.5 text-sm rounded ${
           i === currentPage
            ? "bg-blue-500 text-white"
            : "text-gray-600 hover:bg-gray-50"
          }`}
         >
          {i}
         </button>
        );
       }

       // Last page
       if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
         pages.push(<span key="end-ellipsis" className="px-1.5 text-sm text-gray-400">...</span>);
        }
        pages.push(
         <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className="px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded"
         >
          {totalPages}
         </button>
        );
       }

       return pages;
      })()}

      <button
       onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
       disabled={currentPage === totalPages}
       className="px-2.5 py-1.5 border border-gray-300 text-sm text-gray-600 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
       ›
      </button>
     </div>

     {/* Page info */}
     <div className="text-center mt-4 text-sm text-gray-600">
      Showing page {currentPage} of {totalPages} ({totalTenders} total tenders)
     </div>
    </div>
   )}

   {/* Footer */}
   <FooterSection />

   {/* Tender Modal */}
   {selectedTender && <TenderModal isOpen={isModalOpen} onClose={closeTenderModal} tender={selectedTender} />}

   {/* Advanced Search Modal */}
   <AdvancedSearchModal isOpen={isAdvancedSearchOpen} onClose={() => setIsAdvancedSearchOpen(false)} onSearch={handleAdvancedSearch} />
  </div>
 );
};
