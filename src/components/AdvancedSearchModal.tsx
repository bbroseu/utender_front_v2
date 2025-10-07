import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown, Search, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useGetCategoriesQuery, useGetContractingAuthoritiesQuery, useGetNoticeTypesQuery } from "../store/api/tendersApi";

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  category_id?: number;
  contracting_authority_id?: number;
  notice_type_id?: number;
  from_date?: number;
  to_date?: number;
}

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
  const selectRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 300; // Approximate height of dropdown

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isOpen]);

  React.useEffect(() => {
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
      {label && <label className="block text-sm text-gray-700 mb-2">{label}</label>}
      <div
        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg cursor-pointer flex items-center justify-between bg-white hover:border-gray-300 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: dropdownPosition === 'top' ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: dropdownPosition === 'top' ? 10 : -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute z-20 w-full ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} bg-white border border-gray-200 rounded-lg shadow-lg`}
          >
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Kërko..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 transition-colors"
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DatePicker: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
  const datePickerRef = React.useRef<HTMLDivElement>(null);

  const months = [
    "Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor",
    "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"
  ];

  const weekDays = ["D", "H", "M", "M", "E", "P", "S"];

  const currentDate = new Date();
  const [displayMonth, setDisplayMonth] = useState(currentDate.getMonth());
  const [displayYear, setDisplayYear] = useState(currentDate.getFullYear());

  React.useEffect(() => {
    if (isOpen && datePickerRef.current) {
      const rect = datePickerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const calendarHeight = 350; // Approximate height of calendar

      if (spaceBelow < calendarHeight && spaceAbove > calendarHeight) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (day: number, month: number, year: number) => {
    const d = new Date(year, month, day);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return 'Zgjedh datën';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(displayMonth, displayYear);
    const firstDay = getFirstDayOfMonth(displayMonth, displayYear);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(day, displayMonth, displayYear);
      const isSelected = dateStr === value;
      const isToday = dateStr === formatDate(currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear());

      days.push(
        <button
          key={day}
          onClick={() => {
            const newDate = formatDate(day, displayMonth, displayYear);
            onChange(newDate);
            setIsOpen(false);
          }}
          className={`p-2 text-sm rounded-lg hover:bg-gray-100 transition-colors
            ${isSelected ? 'bg-[#f0c419] text-white hover:bg-[#f0c419]/90' : ''}
            ${isToday && !isSelected ? 'bg-blue-50 text-blue-600' : ''}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="relative" ref={datePickerRef}>
      <label className="block text-sm text-gray-700 mb-2">{label}</label>
      <div
        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg cursor-pointer flex items-center justify-between bg-white hover:border-gray-300 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {formatDisplayDate(value)}
        </span>
        <Calendar className="h-4 w-4 text-gray-400" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: dropdownPosition === 'top' ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: dropdownPosition === 'top' ? 10 : -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute z-20 w-full ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} bg-white border border-gray-200 rounded-lg shadow-lg p-3`}
          >
            {/* Month/Year Navigation */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (displayMonth === 0) {
                    setDisplayMonth(11);
                    setDisplayYear(displayYear - 1);
                  } else {
                    setDisplayMonth(displayMonth - 1);
                  }
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium">
                {months[displayMonth]} {displayYear}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (displayMonth === 11) {
                    setDisplayMonth(0);
                    setDisplayYear(displayYear + 1);
                  } else {
                    setDisplayMonth(displayMonth + 1);
                  }
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Week days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-xs text-gray-500 font-medium p-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({ isOpen, onClose, onSearch }) => {
  const [searchData, setSearchData] = useState({
    category: "",
    authority: "",
    notification: "",
    tender: "",
    fromDate: "",
    toDate: "",
    publishStatus: ""
  });

  // Fetch data from APIs
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: authoritiesData } = useGetContractingAuthoritiesQuery();
  const { data: noticeTypesData } = useGetNoticeTypesQuery();

  // Transform API data to SelectOption format
  const categories: SelectOption[] = (categoriesData?.data || []).map(cat => ({
    value: cat.id.toString(),
    label: cat.name
  }));

  const authorities: SelectOption[] = (authoritiesData?.data || []).map(auth => ({
    value: auth.id.toString(),
    label: auth.name
  }));

  const notifications: SelectOption[] = (noticeTypesData?.data || []).map(notice => ({
    value: notice.id.toString(),
    label: notice.name
  }));

  const handleSearch = () => {
    console.log("Searching with:", searchData);

    // Build filters object
    const filters: SearchFilters = {};

    if (searchData.category) {
      filters.category_id = parseInt(searchData.category);
    }
    if (searchData.authority) {
      filters.contracting_authority_id = parseInt(searchData.authority);
    }
    if (searchData.notification) {
      filters.notice_type_id = parseInt(searchData.notification);
    }
    if (searchData.fromDate) {
      filters.from_date = Math.floor(new Date(searchData.fromDate).getTime() / 1000);
    }
    if (searchData.toDate) {
      filters.to_date = Math.floor(new Date(searchData.toDate).getTime() / 1000);
    }

    console.log("Filters being sent:", filters);
    onSearch(filters);
    onClose();
  };

  // Tender status based on state: 1 - hapur (open), 0 - mbyllur (closed)
  const tenders: SelectOption[] = [
    { value: "1", label: "Tenderë të hapur" },
    { value: "0", label: "Tenderë të mbyllur" },
  ];

  const publishPeriods: SelectOption[] = [
    { value: "today", label: "Sot" },
    { value: "week", label: "Kjo javë" },
    { value: "month", label: "Ky muaj" },
    { value: "custom", label: "Zgjedh Javen" },
    { value: "3months", label: "3 muajt e fundit" },
    { value: "6months", label: "6 muajt e fundit" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
        {/* Modal Header */}
        <div className="px-8 pt-6 pb-3 relative">
          <h2 className="text-2xl font-semibold text-gray-900 text-center">
            Kërkim i Avancuar
          </h2>
          <button
            onClick={onClose}
            className="absolute right-8 top-6 text-gray-400 hover:text-gray-500 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Subtitle */}
        <div className="px-8 pb-6">
          <p className="text-center text-sm text-gray-500">
            Lorem ipsum dolor sit amet consectetur. Nunc volutpat tortor mattis sed. Ultricies
          </p>
        </div>

        {/* Modal Body */}
        <div className="px-8 pb-8">
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-5">
              <SearchableSelect
                label="Të gjitha autoritetet"
                placeholder="Zgjedh autoritetin"
                options={authorities}
                value={searchData.authority}
                onChange={(value) => setSearchData({...searchData, authority: value})}
              />

              <SearchableSelect
                label="Të gjitha Tenderët"
                placeholder="Zgjedh tenderin"
                options={tenders}
                value={searchData.tender}
                onChange={(value) => setSearchData({...searchData, tender: value})}
              />

              <DatePicker
                label="Prej datës"
                value={searchData.fromDate}
                onChange={(value) => setSearchData({...searchData, fromDate: value})}
              />

              <div>
                <label className="block text-sm text-blue-500 mb-2">
                  Tenderët e publikuar gjatë:
                </label>
                <SearchableSelect
                  label=""
                  placeholder="Zgjedh Javen"
                  options={publishPeriods}
                  value={searchData.publishStatus}
                  onChange={(value) => setSearchData({...searchData, publishStatus: value})}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <SearchableSelect
                label="Të gjitha kategoritë"
                placeholder="Zgjedh kategorinë"
                options={categories}
                value={searchData.category}
                onChange={(value) => setSearchData({...searchData, category: value})}
              />

              <SearchableSelect
                label="Të gjitha njoftimet"
                placeholder="Zgjedh njoftimin"
                options={notifications}
                value={searchData.notification}
                onChange={(value) => setSearchData({...searchData, notification: value})}
              />

              <DatePicker
                label="Deri në datën"
                value={searchData.toDate}
                onChange={(value) => setSearchData({...searchData, toDate: value})}
              />
            </div>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="w-full mt-8 bg-[#f0c419] hover:bg-[#f0c419]/90 text-white py-3 rounded-lg font-medium text-base"
          >
            Kërko
          </Button>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};