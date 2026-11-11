import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Printer,
  FileText
} from 'lucide-react';
import { AgriculturalRecord } from '../types/agriculture';
import { SAMPLE_AGRICULTURAL_DATA, getSampleCsvString } from '../data/sampleDataset';

interface DataUploadTableProps {
  records: AgriculturalRecord[];
  onUpdateRecords: (newRecords: AgriculturalRecord[]) => void;
  onResetToSample: () => void;
  onGeneratePdfReport?: () => void;
}

export const DataUploadTable: React.FC<DataUploadTableProps> = ({
  records,
  onUpdateRecords,
  onResetToSample,
  onGeneratePdfReport
}) => {
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });

  const [tableSearch, setTableSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [sortField, setSortField] = useState<keyof AgriculturalRecord>('cropYear');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const data = results.data as Record<string, any>[];
        if (!data || data.length === 0) {
          setUploadStatus({ type: 'error', message: 'Uploaded CSV file contains no records.' });
          return;
        }

        // Validate mandatory columns
        const firstRow = data[0];
        const keys = Object.keys(firstRow).map((k) => k.trim().toLowerCase());
        const hasState = keys.some((k) => k.includes('state'));
        const hasCrop = keys.some((k) => k.includes('crop') && !k.includes('year'));

        if (!hasState || !hasCrop) {
          setUploadStatus({
            type: 'error',
            message: 'CSV is missing mandatory headers: State, District, Crop, Crop Year, Season, Area, Production, Yield.'
          });
          return;
        }

        const parsedRecords: AgriculturalRecord[] = data.map((row, idx) => {
          const getVal = (pattern: string) => {
            const key = Object.keys(row).find((k) => k.trim().toLowerCase().includes(pattern));
            return key ? row[key] : undefined;
          };

          const state = String(getVal('state') || 'Unknown');
          const district = String(getVal('district') || 'Central');
          const crop = String(getVal('crop') || 'Crop');
          const cropYear = Number(getVal('year')) || new Date().getFullYear();
          const season = (getVal('season') || 'Whole Year') as AgriculturalRecord['season'];
          const area = Number(getVal('area')) || 1000;
          const production = Number(getVal('prod')) || 3000;
          const yieldVal = Number(getVal('yield')) || (area > 0 ? production / area : 0);

          return {
            id: `UPLOAD-${idx + 1}`,
            state,
            district,
            crop,
            cropYear,
            season,
            area,
            production,
            yield: Math.round(yieldVal * 100) / 100
          };
        });

        onUpdateRecords(parsedRecords);
        setUploadStatus({
          type: 'success',
          message: `Successfully loaded ${parsedRecords.length} agricultural records from "${file.name}". All charts, maps, and Pig analytics updated!`
        });
      },
      error: (err) => {
        setUploadStatus({ type: 'error', message: `CSV Parsing Error: ${err.message}` });
      }
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadSample = () => {
    const csv = getSampleCsvString();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'agricultural_production_sample_dataset.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintPdf = () => {
    if (onGeneratePdfReport) {
      onGeneratePdfReport();
    } else {
      window.print();
    }
  };

  // Filter & Sort table data
  const filteredData = records.filter((r) => {
    if (!tableSearch) return true;
    const q = tableSearch.toLowerCase();
    return (
      r.state.toLowerCase().includes(q) ||
      r.district.toLowerCase().includes(q) ||
      r.crop.toLowerCase().includes(q) ||
      r.season.toLowerCase().includes(q) ||
      r.cropYear.toString().includes(q)
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortDirection === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
  });

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: keyof AgriculturalRecord) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload & Dataset Management Panel */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              Agricultural Dataset Management & CSV Processing
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Upload custom CSV datasets, validate schema columns, or download official sample templates
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePrintPdf}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Generate PDF Report</span>
            </button>
            <button
              onClick={handleDownloadSample}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Sample CSV</span>
            </button>
            <button
              onClick={onResetToSample}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 text-stone-800 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>Reset to Sample Dataset</span>
            </button>
          </div>
        </div>

        {/* Upload Zone */}
        <div className="border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-xl p-6 text-center hover:border-emerald-500 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all cursor-pointer">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csv-file-upload"
          />
          <label htmlFor="csv-file-upload" className="cursor-pointer block">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Click to upload Agricultural CSV or drag and drop
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-md mx-auto">
              Expected columns: <code className="font-mono text-stone-700 dark:text-stone-300">State, District, Crop, Crop Year, Season, Area, Production, Yield</code>
            </p>
          </label>
        </div>

        {/* Status Message */}
        {uploadStatus.type === 'success' && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{uploadStatus.message}</span>
          </div>
        )}
        {uploadStatus.type === 'error' && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-lg flex items-center gap-2 text-xs text-rose-800 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{uploadStatus.message}</span>
          </div>
        )}
      </div>

      {/* Dataset Table & Explorer */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Active Dataset Records ({sortedData.length})
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Showing agricultural survey records loaded into in-memory storage
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search table rows..."
                value={tableSearch}
                onChange={(e) => {
                  setTableSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg pl-8 pr-3 py-1.5 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white dark:focus:bg-stone-900"
              />
            </div>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-700 dark:text-stone-200 focus:outline-none"
            >
              <option value={10}>10 rows</option>
              <option value={15}>15 rows</option>
              <option value={25}>25 rows</option>
              <option value={50}>50 rows</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 rounded-xl">
          <table className="w-full text-left text-xs text-stone-700 dark:text-stone-300">
            <thead className="bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold border-b border-stone-200 dark:border-stone-700 select-none">
              <tr>
                <th
                  onClick={() => handleSort('state')}
                  className="px-3.5 py-3 cursor-pointer hover:bg-stone-200/70 dark:hover:bg-stone-700 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>State</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('district')}
                  className="px-3.5 py-3 cursor-pointer hover:bg-stone-200/70 dark:hover:bg-stone-700 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>District</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('crop')}
                  className="px-3.5 py-3 cursor-pointer hover:bg-stone-200/70 dark:hover:bg-stone-700 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Crop</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('cropYear')}
                  className="px-3.5 py-3 cursor-pointer hover:bg-stone-200/70 dark:hover:bg-stone-700 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Year</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('season')}
                  className="px-3.5 py-3 cursor-pointer hover:bg-stone-200/70 dark:hover:bg-stone-700 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Season</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('area')}
                  className="px-3.5 py-3 text-right cursor-pointer hover:bg-stone-200/70 dark:hover:bg-stone-700 whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Area (Ha)</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('production')}
                  className="px-3.5 py-3 text-right cursor-pointer hover:bg-stone-200/70 dark:hover:bg-stone-700 whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Production (MT)</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('yield')}
                  className="px-3.5 py-3 text-right cursor-pointer hover:bg-stone-200/70 dark:hover:bg-stone-700 whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Yield (MT/Ha)</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-400" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-stone-400">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((record) => (
                  <tr key={record.id} className="hover:bg-stone-50/70 dark:hover:bg-stone-800/50 transition-colors">
                    <td className="px-3.5 py-2.5 font-medium text-stone-900 dark:text-stone-100 whitespace-nowrap">
                      {record.state}
                    </td>
                    <td className="px-3.5 py-2.5 text-stone-600 dark:text-stone-400 whitespace-nowrap">
                      {record.district}
                    </td>
                    <td className="px-3.5 py-2.5 font-semibold text-emerald-800 dark:text-emerald-400 whitespace-nowrap">
                      {record.crop}
                    </td>
                    <td className="px-3.5 py-2.5 font-mono text-stone-600 dark:text-stone-400 whitespace-nowrap">
                      {record.cropYear}
                    </td>
                    <td className="px-3.5 py-2.5 text-stone-600 dark:text-stone-400 whitespace-nowrap">
                      {record.season}
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-mono tabular-nums text-stone-700 dark:text-stone-300 whitespace-nowrap">
                      {record.area.toLocaleString()}
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-mono tabular-nums font-semibold text-stone-900 dark:text-stone-100 whitespace-nowrap">
                      {record.production.toLocaleString()}
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-mono tabular-nums font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                      {record.yield.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-2">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} records
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-stone-200 dark:border-stone-700 disabled:opacity-40 hover:bg-stone-50 dark:hover:bg-stone-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-stone-800 dark:text-stone-200 px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-md border border-stone-200 dark:border-stone-700 disabled:opacity-40 hover:bg-stone-50 dark:hover:bg-stone-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
