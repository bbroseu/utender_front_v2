import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import * as Yup from "yup";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { FooterSection } from "../UtenderHomePage/sections/FooterSection/FooterSection";
import { ArrowLeft, ChevronDown, Search, AlertCircle, CheckCircle } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { loadUserFromStorage } from "../../store/slices/authSlice";
import { useGetProfileQuery, useUpdateProfileMutation } from "../../store/api/authApi";
import { useGetAllCategoriesQuery } from "../../store/api/categoriesApi";

interface SelectOption {
  value: string;
  label: string;
}

const SearchableSelect: React.FC<{
  label: string;
  placeholder: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
}> = ({ label, placeholder, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 300;

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={selectRef}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div
        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg cursor-pointer flex items-center justify-between bg-white hover:border-gray-300 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className={`absolute z-20 w-full ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} bg-white border border-gray-200 rounded-lg shadow-lg`}>
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Kërko..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f0c419]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                Nuk u gjet asnjë rezultat
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Form values interface
interface ProfileFormValues {
  firstName: string;
  lastName: string;
  company: string;
  fiscalNumber: string;
  vatNumber: string;
  phone: string;
  email: string;
  email2: string;
  address: string;
  password: string;
  confirmPassword: string;
  category1: string;
  category2: string;
  category3: string;
  category4: string;
  category5: string;
  startDate: string;
  endDate: string;
  packageActive: string;
  packageEnds: string;
}

// Yup validation schema
const validationSchema = Yup.object({
  firstName: Yup.string().required("Emri është i detyrueshëm"),
  lastName: Yup.string().required("Mbiemri është i detyrueshëm"),
  email: Yup.string().email("Email i pavlefshëm").required("Email është i detyrueshëm"),
  phone: Yup.string().required("Telefoni është i detyrueshëm"),
  company: Yup.string().required("Kompania është e detyrueshme"),
  fiscalNumber: Yup.string().required("Numri fiskal është i detyrueshëm"),
  password: Yup.string().min(8, "Fjalëkalimi duhet të ketë të paktën 8 karaktere"),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], "Fjalëkalimet nuk përputhen"),
  address: Yup.string().required("Adresa është e detyrueshme"),
});

export const ProfilePage = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated } = useAppSelector((state) => state.auth);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Function to get initial values from profile data
  const getInitialValues = (profileData: any): ProfileFormValues => {
    console.log("=== getInitialValues Debug ===");
    console.log("Raw profileData:", profileData);

    const profile = profileData?.data;
    console.log("Extracted profile data:", profile);

    // Also try to get user data from Redux state as fallback
    const fallbackProfile = user;
    console.log("Fallback user data from Redux:", fallbackProfile);

    // Also try parsed localStorage data as a third fallback
    const localStorageFallback = parsedStorageUser;
    console.log("LocalStorage fallback data:", localStorageFallback);

    // Use the best available data source
    const finalProfile = profile || fallbackProfile || localStorageFallback;
    console.log("Final profile to use:", finalProfile);

    // If we have localStorage data but no other data, use it directly
    if (!profile && !fallbackProfile && localStorageFallback) {
      console.log("Using localStorage data directly for form values");
    }

    // If no data at all, show a message and use empty form
    if (!finalProfile) {
      console.log("🚨 NO PROFILE DATA AVAILABLE - You need to login first!");
      console.log("All data sources are null/undefined:");
      console.log("- API profile data:", profile);
      console.log("- Redux user data:", fallbackProfile);
      console.log("- localStorage user data:", localStorageFallback);
    }

    const initialValues = {
      firstName: finalProfile?.firstName || finalProfile?.first_name || finalProfile?.username || "",
      lastName: finalProfile?.lastName || finalProfile?.last_name || "",
      company: finalProfile?.company || "",
      fiscalNumber: finalProfile?.fiscalNumber || finalProfile?.fiscal_number || "",
      vatNumber: "",
      phone: finalProfile?.phone || "",
      email: finalProfile?.email || "",
      email2: finalProfile?.email2 || finalProfile?.sec_email || "",
      address: finalProfile?.address || "",
      password: "",
      confirmPassword: "",
      category1: finalProfile?.category1 ? String(finalProfile.category1) : "",
      category2: finalProfile?.category2 ? String(finalProfile.category2) : "",
      category3: finalProfile?.category3 ? String(finalProfile.category3) : "",
      category4: finalProfile?.category4 ? String(finalProfile.category4) : "",
      category5: finalProfile?.category5 ? String(finalProfile.category5) : "",
      startDate: finalProfile?.registrationDate || finalProfile?.create_date_formatted
                  ? new Date(finalProfile.registrationDate || finalProfile.create_date_formatted).toLocaleDateString('en-GB') : "",
      endDate: "",
      packageActive: finalProfile?.account_status || finalProfile?.status_text || finalProfile?.status === 1 ? "Active" : "Inactive",
      packageEnds: finalProfile?.valid_time_formatted || finalProfile?.expire_date_formatted
                  ? new Date(finalProfile.valid_time_formatted || finalProfile.expire_date_formatted).toLocaleDateString('en-GB')
                  : finalProfile?.valid_time
                  ? new Date(finalProfile.valid_time * 1000).toLocaleDateString('en-GB')
                  : "N/A",
    };

    console.log("Computed initial values:", initialValues);
    return initialValues;
  };

  // Debug logs
  console.log("=== ProfilePage Debug ===");
  console.log("isAuthenticated:", isAuthenticated);
  console.log("user:", user);
  console.log("token:", token);
  console.log("user?.id:", user?.id);
  console.log("IMMEDIATE CHECK - Browser localStorage token:", localStorage.getItem('token'));
  console.log("IMMEDIATE CHECK - Browser localStorage user:", localStorage.getItem('user'));

  // Check localStorage directly
  console.log("=== LocalStorage Debug ===");
  const storageToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const storageUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  console.log("localStorage token:", storageToken);
  console.log("localStorage user (raw):", storageUser);

  let parsedStorageUser = null;
  if (storageUser) {
    try {
      parsedStorageUser = JSON.parse(storageUser);
      console.log("Parsed user from localStorage:", parsedStorageUser);
      console.log("Parsed user ID:", parsedStorageUser?.id);
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
    }
  } else {
    console.log("No user data in localStorage");
  }

  // Force load user from localStorage on component mount
  useEffect(() => {
    console.log("=== UseEffect for user loading ===");
    console.log("Current auth state - isAuthenticated:", isAuthenticated, "user:", user);

    // If authenticated but no user, force load from localStorage
    if (isAuthenticated && !user) {
      console.log("Authenticated but no user - force loading from localStorage...");
      dispatch(loadUserFromStorage());
    }

    // Also try if we have a token in localStorage but no user in Redux
    if (!user && storageToken && storageUser) {
      console.log("Token and user exist in localStorage but not in Redux - force loading...");
      dispatch(loadUserFromStorage());
    }
  }, [dispatch, user, isAuthenticated, storageToken, storageUser]);

  // Additional effect to handle authentication state changes
  useEffect(() => {
    console.log("=== Auth State Change Effect ===");
    console.log("isAuthenticated changed to:", isAuthenticated);
    console.log("user:", user);

    if (isAuthenticated && !user && storageUser) {
      console.log("Authenticated but no user data, reloading from storage...");
      dispatch(loadUserFromStorage());
    }
  }, [isAuthenticated, user, dispatch, storageUser]);

  // Since localStorage has no user data, we need you to login first
  // But let's try to make a profile query anyway if we have a token
  console.log("=== Solution Attempt ===");
  console.log("We need to login first since localStorage user is null");

  // Try to fetch profile data with a dummy userId if we have a token but no user
  // The backend profile endpoint might be able to identify the user from the token
  const hasTokenButNoUserData = storageToken && !user && !parsedStorageUser;
  console.log("hasTokenButNoUserData:", hasTokenButNoUserData);

  // Since backend now uses req.user.id from auth middleware, we can send any userId
  // The backend will get the real user ID from the token automatically
  const hasToken = !!storageToken;
  const profileQueryParams = { userId: 1 }; // Dummy value, backend uses token to get real user ID
  console.log("=== Profile Query Params ===", profileQueryParams);
  console.log("hasToken:", hasToken, "Will let backend identify user from token");

  const { data: profileData, isLoading, refetch, error } = useGetProfileQuery(
    profileQueryParams,
    { skip: !hasToken } // Only skip if no token at all
  );

  console.log("=== Profile Query Results ===");
  console.log("isLoading:", isLoading);
  console.log("profileData:", profileData);
  console.log("error:", error);
  console.log("skip condition (!user?.id):", !user?.id);

  // Debug RTK Query
  console.log("=== RTK Query Debug ===");
  console.log("Query params:", { userId: user?.id || 0 });
  console.log("Skip condition:", !user?.id);
  console.log("isLoading:", isLoading);
  console.log("profileData:", profileData);
  console.log("error:", error);

  // Test with hard-coded data for debugging
  console.log("=== Testing with hardcoded data ===");
  const testProfileData = {
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      company: "Test Company",
      phone: "+383 44 123 456",
      address: "Prishtina"
    }
  };
  console.log("Test data:", testProfileData);

  // Handle profile info update (first Save button)
  const handleProfileInfoUpdate = async (values: ProfileFormValues, { setSubmitting }: any) => {
    console.log('🚀 handleProfileInfoUpdate called!');
    console.log('📦 Form values:', values);
    console.log('👤 User ID:', user?.id);

    try {
      setErrorMessage("");
      setSuccessMessage("");

      console.log('💾 Updating profile info only (no categories)...');
      const requestData = {
        userId: user?.id || 0,
        username: values.email,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        company: values.company,
        fiscalNumber: values.fiscalNumber,
        phone: values.phone,
        address: values.address,
        password: values.password || undefined,
        // DO NOT send categories here
      };
      console.log('📤 Request data:', requestData);

      const result = await updateProfile(requestData).unwrap();
      console.log('✅ Profile info updated successfully:', result);

      setSuccessMessage("Informatat u perditësuan me sukses!");

      // Refetch profile data
      refetch();
    } catch (error: any) {
      console.error('❌ Profile update failed:', error);
      setErrorMessage(error.data?.message || "Ndodhi një gabim gjatë përditësimit të profilit");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle categories update (second Save button)
  const handleCategoriesUpdate = async (values: ProfileFormValues, { setSubmitting }: any) => {
    console.log('🚀 handleCategoriesUpdate called!');
    console.log('📋 Categories being sent:', {
      category1: values.category1,
      category2: values.category2,
      category3: values.category3,
      category4: values.category4,
      category5: values.category5
    });

    try {
      setErrorMessage("");
      setSuccessMessage("");

      console.log('💾 Updating categories only...');
      const requestData = {
        userId: user?.id || 0,
        category1: values.category1,
        category2: values.category2,
        category3: values.category3,
        category4: values.category4,
        category5: values.category5,
      };
      console.log('📤 Request data:', requestData);

      const result = await updateProfile(requestData).unwrap();
      console.log('✅ Categories updated successfully:', result);

      setSuccessMessage("Kategoritë u perditësuan me sukses!");

      // Refetch profile data
      refetch();
    } catch (error: any) {
      console.error('❌ Categories update failed:', error);
      setErrorMessage(error.data?.message || "Ndodhi një gabim gjatë përditësimit të kategorive");
    } finally {
      setSubmitting(false);
    }
  };

  // Main form submit handler (shouldn't be called, but keep for safety)
  const handleFormSubmit = async (values: ProfileFormValues, { setSubmitting }: any) => {
    console.log('⚠️  Main form submitted - this should not happen!');
    setSubmitting(false);
  };


  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Fetch all categories from API
  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetAllCategoriesQuery({ limit: 1000, page: 1 });

  // Map categories to SelectOption format
  const categoryOptions: SelectOption[] = React.useMemo(() => {
    if (!categoriesData?.data) return [];

    return categoriesData.data.map(category => ({
      value: String(category.id),
      label: category.name
    }));
  }, [categoriesData]);

  // Use the same options for all 5 category dropdowns
  const categoryOptions1: SelectOption[] = categoryOptions;
  const categoryOptions2: SelectOption[] = categoryOptions;
  const categoryOptions3: SelectOption[] = categoryOptions;
  const categoryOptions4: SelectOption[] = categoryOptions;
  const categoryOptions5: SelectOption[] = categoryOptions;

  return (
    <div className="min-h-screen bg-gray-50 font-questrial">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 lg:px-[148px] py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/tenders')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-[#1b2631]">Profili im</h1>
            </div>

            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <img className="w-[35px] h-[42px]" alt="Group" src="/group-1321316878.png" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-[148px] py-8">

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3 text-blue-700">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
            <span>Loading profile data...</span>
          </div>
        )}

    

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            Error loading profile: {error?.toString()}
          </div>
        )}

        <Formik
          initialValues={getInitialValues(profileData)}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
          enableReinitialize={true} // This allows the form to reinitialize when profileData changes
        >
          {(formik: FormikProps<ProfileFormValues>) => {
            console.log("=== Formik Render Debug ===");
            console.log("Formik values:", formik.values);
            console.log("Formik initial values:", formik.initialValues);
            console.log("Formik errors:", formik.errors);
            console.log("Formik touched:", formik.touched);
            console.log("Formik isValid:", formik.isValid);
            console.log("Formik isSubmitting:", formik.isSubmitting);
            console.log("Formik dirty:", formik.dirty);

            return (
              <Form>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-8">
                    {/* Informatat Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h2 className="text-xl font-bold text-[#1b2631] mb-6">Informatat</h2>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Emri / Mbiemri
                          </label>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <Field
                                as={Input}
                                type="text"
                                name="firstName"
                                className="w-full"
                                placeholder="Emri"
                              />
                              <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div className="flex-1">
                              <Field
                                as={Input}
                                type="text"
                                name="lastName"
                                className="w-full"
                                placeholder="Mbiemri"
                              />
                              <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kompania
                          </label>
                          <Field
                            as={Input}
                            type="text"
                            name="company"
                            placeholder="Kompania"
                          />
                          <ErrorMessage name="company" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Numri Fiskal / NIPT
                          </label>
                          <Input
                            type="text"
                            name="fiscalNumber"
                            value={formik.values.fiscalNumber}
                            onChange={formik.handleChange}
                            placeholder="xxxxxxxxx"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Numri telefoni
                          </label>
                          <Input
                            type="tel"
                            name="phone"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            placeholder="+383 44 152 232"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Adresa
                          </label>
                          <Input
                            type="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            placeholder="email@domain.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Adresa 2
                          </label>
                          <Input
                            type="email"
                            name="email2"
                            value={formik.values.email2}
                            onChange={formik.handleChange}
                            placeholder="email@domain.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Adresa
                          </label>
                          <Input
                            type="text"
                            name="address"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            placeholder="Prishtinë"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ndrysho Fjalëkalimin
                          </label>
                          <Input
                            type="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            placeholder="Fjalëkalimi i ri"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Përserit Fjalëkalimin
                          </label>
                          <Input
                            type="password"
                            name="confirmPassword"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            placeholder="Përserit fjalëkalimin"
                          />
                        </div>

                        <div className="flex gap-4 pt-4">
                          <Button
                            type="button"
                            disabled={formik.isSubmitting || isUpdating}
                            className="bg-[#f0c419] hover:bg-[#f0c419]/90 disabled:opacity-50 text-white px-8"
                            onClick={() => handleProfileInfoUpdate(formik.values, { setSubmitting: formik.setSubmitting })}
                          >
                            {formik.isSubmitting || isUpdating ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Saving...</span>
                              </div>
                            ) : (
                              "Save"
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/tenders')}
                          >
                            Cancel
                          </Button>
                        </div>

                        <a href="#" className="text-blue-500 hover:underline text-sm inline-block">
                          Harrova Fjalëkalimin
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">
                    {/* Kategoria Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h2 className="text-xl font-bold text-[#1b2631] mb-6">Kategoria</h2>

                      <div className="space-y-4">
                        <SearchableSelect
                          label="Kategoria 1"
                          placeholder="Zgjedh kategorinë"
                          options={categoryOptions1}
                          value={formik.values.category1}
                          onChange={(value) => formik.setFieldValue("category1", value)}
                        />

                        <SearchableSelect
                          label="Kategoria 2"
                          placeholder="Zgjedh kategorinë"
                          options={categoryOptions2}
                          value={formik.values.category2}
                          onChange={(value) => formik.setFieldValue("category2", value)}
                        />

                        <SearchableSelect
                          label="Kategoria 3"
                          placeholder="Zgjedh kategorinë"
                          options={categoryOptions3}
                          value={formik.values.category3}
                          onChange={(value) => formik.setFieldValue("category3", value)}
                        />

                        <SearchableSelect
                          label="Kategoria 4"
                          placeholder="Zgjedh kategorinë"
                          options={categoryOptions4}
                          value={formik.values.category4}
                          onChange={(value) => formik.setFieldValue("category4", value)}
                        />

                        <SearchableSelect
                          label="Kategoria 5"
                          placeholder="Zgjedh kategorinë"
                          options={categoryOptions5}
                          value={formik.values.category5}
                          onChange={(value) => formik.setFieldValue("category5", value)}
                        />

                        <div className="flex gap-4 pt-4">
                          <Button
                            type="button"
                            disabled={formik.isSubmitting || isUpdating}
                            className="bg-[#f0c419] hover:bg-[#f0c419]/90 disabled:opacity-50 text-white px-8"
                            onClick={() => handleCategoriesUpdate(formik.values, { setSubmitting: formik.setSubmitting })}
                          >
                            {formik.isSubmitting || isUpdating ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Saving...</span>
                              </div>
                            ) : (
                              "Save"
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/tenders')}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Abonimi Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h2 className="text-xl font-bold text-[#1b2631] mb-6">Abonimi juaj</h2>

                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Pako Aktive:</span>
                            <span className="text-sm font-semibold text-[#1b2631]">{formik.values.packageActive}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Pako Përfundon:</span>
                            <span className="text-sm font-semibold text-[#1b2631]">{formik.values.packageEnds}</span>
                          </div>
                        </div>

                        <Button
                          className="w-full bg-[#f0c419] hover:bg-[#f0c419]/90 text-white py-3"
                        >
                          Vazhdo
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
};