import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"info" | "category" | "subscription">("info");
  const [formData, setFormData] = useState({
    // Informatat
    firstName: "Lekë",
    lastName: "Rudi",
    company: "Binns",
    fiscalNumber: "",
    vatNumber: "",
    phone: "+383 44 152 232",
    email: "egektrimi@binns.eu",
    email2: "egektrimi@binns.eu",
    address: "Prishtinë",
    password: "",
    confirmPassword: "",
    // Kategoria
    category1: "",
    category2: "",
    category3: "",
    category4: "",
    category5: "",
    // Abonimi
    startDate: "01.01.2025",
    endDate: "01.01.2025",
    packageActive: "3/M",
    packageEnds: "01.01.2025",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Profili im</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "info"
                ? "border-b-2 border-[#f0c419] text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Informatat
          </button>
          <button
            onClick={() => setActiveTab("category")}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "category"
                ? "border-b-2 border-[#f0c419] text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Kategoria
          </button>
          <button
            onClick={() => setActiveTab("subscription")}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "subscription"
                ? "border-b-2 border-[#f0c419] text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Abonimi juaj
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === "info" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emri / Mbiemri
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="flex-1"
                      placeholder="Emri"
                    />
                    <Input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="flex-1"
                      placeholder="Mbiemri"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kompania
                  </label>
                  <Input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Kompania"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numri Fiskal / NIPT
                  </label>
                  <Input
                    type="text"
                    name="fiscalNumber"
                    value={formData.fiscalNumber}
                    onChange={handleInputChange}
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
                    value={formData.phone}
                    onChange={handleInputChange}
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
                    value={formData.email}
                    onChange={handleInputChange}
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
                    value={formData.email2}
                    onChange={handleInputChange}
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
                    value={formData.address}
                    onChange={handleInputChange}
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
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Fjalëkalimi i ri"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Përserit Kontaktuesin
                  </label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Përserit fjalëkalimin"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    className="bg-[#f0c419] hover:bg-[#f0c419]/90 text-white px-8"
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                </div>

                <a href="#" className="text-blue-500 hover:underline text-sm">
                  Harrova Fjallëkalimin
                </a>
              </div>
            </div>
          )}

          {activeTab === "category" && (
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategoria 1
                </label>
                <select
                  name="category1"
                  value={formData.category1}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f0c419]"
                >
                  <option value="">Telekomunikim</option>
                  <option value="telekom">Telekomunikim</option>
                  <option value="ndertim">Ndërtim</option>
                  <option value="teknologji">Teknologji</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategoria 2
                </label>
                <select
                  name="category2"
                  value={formData.category2}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f0c419]"
                >
                  <option value="">Tekstil</option>
                  <option value="tekstil">Tekstil</option>
                  <option value="mobilje">Mobilje</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategoria 3
                </label>
                <select
                  name="category3"
                  value={formData.category3}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f0c419]"
                >
                  <option value="">Automobilit</option>
                  <option value="auto">Automobilit</option>
                  <option value="transport">Transport</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategoria 4
                </label>
                <select
                  name="category4"
                  value={formData.category4}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f0c419]"
                >
                  <option value="">Përshtërie & Drektime Qytetare</option>
                  <option value="drektime">Përshtërie & Drektime Qytetare</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategoria 5
                </label>
                <select
                  name="category5"
                  value={formData.category5}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f0c419]"
                >
                  <option value="">Teknologji Informative</option>
                  <option value="it">Teknologji Informative</option>
                  <option value="software">Software</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  className="bg-[#f0c419] hover:bg-[#f0c419]/90 text-white px-8"
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {activeTab === "subscription" && (
            <div className="space-y-6 max-w-md">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Pako Aktive:</span>
                  <span className="text-sm font-semibold text-gray-900">{formData.packageActive}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Pako Përfundon:</span>
                  <span className="text-sm font-semibold text-gray-900">{formData.packageEnds}</span>
                </div>
              </div>

              <Button
                className="w-full bg-[#f0c419] hover:bg-[#f0c419]/90 text-white py-3"
              >
                Vazhdо
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};