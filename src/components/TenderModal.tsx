import React from "react";
import { X, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  tender: any; // Full tender object from API
}

export const TenderModal: React.FC<TenderModalProps> = ({ isOpen, onClose, tender }) => {
  // Helper function to format dates
  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString('en-GB');
  };

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
            className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white px-6 py-4 flex items-start justify-between">
          <h2 className="text-lg font-bold text-gray-900 pr-4">
            {tender.title || 'No Title'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 flex-shrink-0"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
            <tbody>
              <tr className="bg-gray-50 border-b border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-600 font-medium border-r border-gray-200">Autoriteti Kontraktues</td>
                <td className="px-4 py-3 text-sm text-gray-900">{tender.contracting_authority_name || 'N/A'}</td>
              </tr>

              <tr className="bg-white border-b border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-600 font-medium border-r border-gray-200">Kategoria</td>
                <td className="px-4 py-3 text-sm text-gray-900">{tender.category_name || 'N/A'}</td>
              </tr>

              <tr className="bg-gray-50 border-b border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-600 font-medium border-r border-gray-200">Data e Publikimit</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatDate(tender.publication_date)}</td>
              </tr>

              <tr className="bg-white border-b border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-600 font-medium border-r border-gray-200">Data e Skadimit</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatDate(tender.expiry_date)}</td>
              </tr>

              <tr className="bg-gray-50 border-b border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-600 font-medium border-r border-gray-200">Numri i Prokurimit</td>
                <td className="px-4 py-3 text-sm text-gray-900">{tender.procurement_number || 'N/A'}</td>
              </tr>

              <tr className="bg-white border-b border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-600 font-medium border-r border-gray-200">Lloji i Kontratës</td>
                <td className="px-4 py-3 text-sm text-gray-900">{tender.contract_type_name || 'N/A'}</td>
              </tr>

              <tr className="bg-gray-50 border-b border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-600 font-medium border-r border-gray-200">Procedura</td>
                <td className="px-4 py-3 text-sm text-gray-900">{tender.procedure_name || 'N/A'}</td>
              </tr>

              <tr className="bg-white border-b border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-600 font-medium border-r border-gray-200">Lloji i njoftimit</td>
                <td className="px-4 py-3 text-sm text-gray-900">{tender.notice_type_name || 'N/A'}</td>
              </tr>

              <tr className="bg-gray-50 border-b border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-600 font-medium border-r border-gray-200">Shteti</td>
                <td className="px-4 py-3 text-sm text-gray-900">{tender.state_name || 'Kosovë'}</td>
              </tr>

              <tr className="bg-white border-b border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-600 font-medium border-r border-gray-200">Rajoni</td>
                <td className="px-4 py-3 text-sm text-gray-900">{tender.region_name || 'N/A'}</td>
              </tr>

              {tender.description && (
                <tr className="bg-gray-50 border-b border-gray-200">
                  <td className="px-4 py-3 text-sm text-gray-600 font-medium border-r border-gray-200">Përshkrimi</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{tender.description}</td>
                </tr>
              )}

              {tender.email && (
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-4 py-3 text-sm text-gray-600 font-medium border-r border-gray-200">Email</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{tender.email}</td>
                </tr>
              )}

              {tender.cmimi && (
                <tr className="bg-gray-50 border-b border-gray-200">
                  <td className="px-4 py-3 text-sm text-gray-600 font-medium border-r border-gray-200">Çmimi</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{tender.cmimi}</td>
                </tr>
              )}

              {tender.file && (
                <tr className="bg-white">
                  <td className="px-4 py-3 text-sm text-gray-600 font-medium border-r border-gray-200">Dokumentet</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <a href={tender.file} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                        Shiko Dokumentin
                      </a>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};