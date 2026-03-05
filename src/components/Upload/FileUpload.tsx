import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { parseCSV, parseExcel } from '../../utils/dataProcessor';
import { DataRow, DataColumn } from '../../types';

interface FileUploadProps {
  onDataLoaded: (data: DataRow[], columns: DataColumn[], fileName: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      let result;
      if (file.name.endsWith('.csv')) {
        result = await parseCSV(file);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        result = await parseExcel(file);
      } else {
        throw new Error('Unsupported file format. Please upload CSV or Excel.');
      }
      onDataLoaded(result.data, result.columns, file.name);
    } catch (err: any) {
      setError(err.message || 'Failed to parse file');
    } finally {
      setLoading(false);
    }
  }, [onDataLoaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer
          flex flex-col items-center justify-center gap-4
          ${isDragActive ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'}
          ${loading ? 'opacity-50 cursor-wait' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
          {loading ? (
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload size={32} />
          )}
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold text-slate-900">
            {isDragActive ? 'Drop your file here' : 'Upload your data'}
          </h3>
          <p className="text-slate-500 mt-1">
            Drag and drop your CSV or Excel file, or click to browse
          </p>
        </div>

        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <FileText size={14} />
            <span>CSV</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <FileSpreadsheet size={14} />
            <span>Excel (.xlsx, .xls)</span>
          </div>
        </div>

        {error && (
          <div className="absolute -bottom-12 left-0 right-0 flex items-center justify-center gap-2 text-rose-500 text-sm font-medium">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};
