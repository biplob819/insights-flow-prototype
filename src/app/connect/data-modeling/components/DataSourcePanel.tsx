'use client';

import { useState } from 'react';
import { Upload, Database, FileText, Settings, ChevronRight, CheckCircle, AlertCircle, Trash2, Server, X, Code, Eye } from 'lucide-react';
import { getDataTypeIcon } from '../utils/dataTypeIcons';
import { formatNumber } from '@/utils/formatters';

interface DataSource {
  id: string;
  name: string;
  connectionName: string;
  type: 'csv' | 'database' | 'api';
  status: 'connected' | 'error' | 'pending';
  tables?: Table[];
  recordCount?: number;
  lastUpdated?: string;
  host?: string;
  schema?: string;
}

interface Table {
  id: string;
  name: string;
  schema: string;
  rowCount: number;
  columns: Column[];
  lastUpdated: string;
}

interface Column {
  name: string;
  type: 'Text' | 'Number' | 'Date' | 'Logical' | 'Variant' | 'Geography';
  nullable: boolean;
  primaryKey?: boolean;
  foreignKey?: boolean;
  description?: string;
}

export default function DataSourcePanel() {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: '1',
      name: 'Sales Database',
      connectionName: 'Production PostgreSQL',
      type: 'database',
      status: 'connected',
      host: 'prod-db.company.com',
      schema: 'sales_schema',
      recordCount: 125000,
      lastUpdated: '2 hours ago',
      tables: [
        {
          id: 't1',
          name: 'customers',
          schema: 'sales_schema',
          rowCount: 15420,
          lastUpdated: '2 hours ago',
          columns: [
            { name: 'id', type: 'Number', nullable: false, primaryKey: true, description: 'Unique customer identifier' },
            { name: 'first_name', type: 'Text', nullable: false, description: 'Customer first name' },
            { name: 'last_name', type: 'Text', nullable: false, description: 'Customer last name' },
            { name: 'email', type: 'Text', nullable: false, description: 'Customer email address' },
            { name: 'created_at', type: 'Date', nullable: false, description: 'Account creation date' },
            { name: 'is_active', type: 'Logical', nullable: false, description: 'Account status flag' }
          ]
        },
        {
          id: 't2',
          name: 'orders',
          schema: 'sales_schema',
          rowCount: 45230,
          lastUpdated: '1 hour ago',
          columns: [
            { name: 'id', type: 'Number', nullable: false, primaryKey: true },
            { name: 'customer_id', type: 'Number', nullable: false, foreignKey: true },
            { name: 'order_date', type: 'Date', nullable: false },
            { name: 'total_amount', type: 'Number', nullable: false },
            { name: 'status', type: 'Text', nullable: false },
            { name: 'metadata', type: 'Variant', nullable: true }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Customer Survey Data',
      connectionName: 'Survey CSV Upload',
      type: 'csv',
      status: 'connected',
      recordCount: 5420,
      lastUpdated: '1 day ago',
      tables: [
        {
          id: 't3',
          name: 'survey_responses',
          schema: 'default',
          rowCount: 5420,
          lastUpdated: '1 day ago',
          columns: [
            { name: 'response_id', type: 'Number', nullable: false, primaryKey: true },
            { name: 'customer_email', type: 'Text', nullable: false },
            { name: 'satisfaction_score', type: 'Number', nullable: true },
            { name: 'feedback_text', type: 'Text', nullable: true },
            { name: 'survey_date', type: 'Date', nullable: false }
          ]
        }
      ]
    },
    {
      id: '3',
      name: 'Marketing Analytics',
      connectionName: 'Google Analytics API',
      type: 'api',
      status: 'error',
      recordCount: 0,
      lastUpdated: 'Failed to sync'
    }
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDatabaseModal, setShowDatabaseModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showColumnDetails, setShowColumnDetails] = useState<Column | null>(null);
  const [showColumnSettings, setShowColumnSettings] = useState<Column | null>(null);
  const [showJsonParseModal, setShowJsonParseModal] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [parsedJsonData, setParsedJsonData] = useState<Record<string, unknown>[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(dataSources[0]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(dataSources[0]?.tables?.[0] || null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<string[][]>([]);
  const [parseOptions, setParseOptions] = useState({
    hasHeaders: true,
    delimiter: ',',
    quoteChar: '"',
    escapeChar: '\\'
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      setUploadedFile(file);
      
      // Read and parse CSV file
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          parseCSV(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n');
    const parsed: string[][] = [];
    
    for (let i = 0; i < Math.min(lines.length, 10); i++) { // Preview first 10 rows
      const line = lines[i].trim();
      if (line) {
        // Simple CSV parsing - in production, use a proper CSV parser
        const row = line.split(parseOptions.delimiter).map(cell => 
          cell.replace(new RegExp(`^${parseOptions.quoteChar}|${parseOptions.quoteChar}$`, 'g'), '')
        );
        parsed.push(row);
      }
    }
    
    setCsvPreview(parsed);
  };

  const handleParseOptionChange = (option: string, value: string | boolean) => {
    setParseOptions(prev => ({ ...prev, [option]: value }));
    
    // Re-parse if file is already uploaded
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          parseCSV(text);
        }
      };
      reader.readAsText(uploadedFile);
    }
  };

  const confirmUpload = () => {
    if (uploadedFile && csvPreview.length > 0) {
      // Create a new data source from the uploaded CSV
      const newDataSource: DataSource = {
        id: `csv_${Date.now()}`,
        name: uploadedFile.name.replace('.csv', ''),
        connectionName: 'CSV Upload',
        type: 'csv',
        status: 'connected',
        recordCount: csvPreview.length - (parseOptions.hasHeaders ? 1 : 0),
        lastUpdated: new Date().toLocaleString(),
        tables: [{
          id: '1',
          name: uploadedFile.name.replace('.csv', ''),
          schema: 'default',
          rowCount: csvPreview.length - (parseOptions.hasHeaders ? 1 : 0),
          lastUpdated: new Date().toLocaleString(),
          columns: parseOptions.hasHeaders && csvPreview[0] ? 
            csvPreview[0].map((header, index) => ({
              name: header || `Column ${index + 1}`,
              type: 'Text', // Default to Text, could be enhanced with type detection
              nullable: true,
              description: `Column from ${uploadedFile.name}`
            })) : 
            Array.from({ length: csvPreview[0]?.length || 0 }, (_, index) => ({
              name: `Column ${index + 1}`,
              type: 'Text',
              nullable: true,
              description: `Column ${index + 1} from ${uploadedFile.name}`
            }))
        }]
      };
      
      setDataSources(prev => [...prev, newDataSource]);
      setSelectedDataSource(newDataSource);
      setSelectedTable(newDataSource.tables?.[0] || null);
      setShowUploadModal(false);
      setUploadedFile(null);
      setCsvPreview([]);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'database':
        return <Database className="w-5 h-5 text-blue-500" />;
      case 'csv':
        return <FileText className="w-5 h-5 text-green-500" />;
      case 'api':
        return <Settings className="w-5 h-5 text-purple-500" />;
      default:
        return null;
    }
  };


  const handleDataSourceSelect = (dataSource: DataSource) => {
    setSelectedDataSource(dataSource);
    setSelectedTable(dataSource.tables?.[0] || null);
  };

  const handleTableSelect = (table: Table) => {
    setSelectedTable(table);
  };

  return (
    <div className="h-full flex">
      {/* Left Panel - Data Sources */}
      <div className="w-1/3 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Data Catalog</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload CSV
              </button>
              <button
                onClick={() => setShowJsonParseModal(true)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center"
              >
                <Code className="w-4 h-4 mr-2" />
                Parse JSON
              </button>
              <button
                onClick={() => setShowDatabaseModal(true)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center"
              >
                <Database className="w-4 h-4 mr-2" />
                Connect Data Source
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {dataSources.map((source) => (
              <div
                key={source.id}
                onClick={() => handleDataSourceSelect(source)}
                className={`p-4 border rounded-lg transition-all cursor-pointer ${
                  selectedDataSource?.id === source.id
                    ? 'border-cyan-500 bg-cyan-50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getTypeIcon(source.type)}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-slate-900 truncate">{source.name}</h3>
                      <p className="text-xs text-cyan-600 font-medium mt-1">
                        {source.connectionName}
                      </p>
                      {source.host && (
                        <p className="text-xs text-slate-500 mt-1 flex items-center">
                          <Server className="w-3 h-3 mr-1" />
                          {source.host}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 mt-1">
                        {formatNumber(source.recordCount || 0)} records
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Updated {source.lastUpdated}
                      </p>
                      {source.tables && (
                        <div className="mt-2">
                          <p className="text-xs text-slate-500 mb-1">Tables ({source.tables.length}):</p>
                          <div className="flex flex-wrap gap-1">
                            {source.tables.slice(0, 3).map((table) => (
                              <span key={table.id} className="px-2 py-1 bg-slate-100 text-xs text-slate-600 rounded">
                                {table.name}
                              </span>
                            ))}
                            {source.tables.length > 3 && (
                              <span className="px-2 py-1 bg-slate-100 text-xs text-slate-600 rounded">
                                +{source.tables.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(source.status)}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteConfirm(source.id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Data Preview */}
      <div className="flex-1 bg-slate-50 flex">
        {/* Tables List */}
        {selectedDataSource && selectedDataSource.tables && (
          <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900">Tables</h3>
              <p className="text-xs text-slate-600 mt-1">{selectedDataSource.name}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {selectedDataSource.tables.map((table) => (
                  <div
                    key={table.id}
                    onClick={() => handleTableSelect(table)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedTable?.id === table.id
                        ? 'bg-cyan-50 border border-cyan-200'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Database className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-900">{table.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {formatNumber(table.rowCount)} rows • {table.columns.length} columns
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Updated {table.lastUpdated}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Column Details */}
        <div className="flex-1 bg-white flex flex-col">
          {selectedTable ? (
            <>
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{selectedTable.name}</h3>
                    <p className="text-slate-600 text-sm mt-1">
                      {formatNumber(selectedTable.rowCount)} rows • {selectedTable.columns.length} columns • {selectedTable.schema}
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowPreviewModal(true)}
                    className="px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Data
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-auto">
                <div className="p-6">
                  <h4 className="text-sm font-semibold text-slate-900 mb-4">Columns</h4>
                  <div className="space-y-3">
                    {selectedTable.columns.map((column, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getDataTypeIcon(column.type)}
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-slate-900">{column.name}</span>
                              {column.primaryKey && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                  PK
                                </span>
                              )}
                              {column.foreignKey && (
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                                  FK
                                </span>
                              )}
                              {!column.nullable && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                                  NOT NULL
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              {column.type} {column.description && `• ${column.description}`}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => setShowColumnDetails(column)}
                            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                            title="View column details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setShowColumnSettings(column)}
                            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                            title="Column settings"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Database className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-slate-500 mb-2">
                  {selectedDataSource ? 'Select a Table' : 'No Data Source Selected'}
                </h4>
                <p className="text-slate-400 text-sm">
                  {selectedDataSource 
                    ? 'Choose a table from the left to see its columns and structure'
                    : 'Choose a data source from the left panel to see its preview and configure columns'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl h-3/4 flex flex-col">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Upload CSV File</h3>
            </div>
            
            <div className="flex-1 flex overflow-hidden">
              {/* Left Panel - Upload & Options */}
              <div className="w-1/3 border-r border-slate-200 p-6">
                {!uploadedFile ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">Drag and drop your CSV file here, or click to browse</p>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors cursor-pointer inline-block"
                    >
                      Choose File
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 mb-2">File Selected</h4>
                      <p className="text-sm text-slate-600">{uploadedFile.name}</p>
                      <p className="text-xs text-slate-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-slate-900">Parsing Options</h4>
                      
                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={parseOptions.hasHeaders}
                            onChange={(e) => handleParseOptionChange('hasHeaders', e.target.checked)}
                            className="rounded border-slate-300"
                          />
                          <span className="text-sm text-slate-700">First row contains headers</span>
                        </label>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Delimiter</label>
                        <select
                          value={parseOptions.delimiter}
                          onChange={(e) => handleParseOptionChange('delimiter', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        >
                          <option value=",">Comma (,)</option>
                          <option value=";">Semicolon (;)</option>
                          <option value="\t">Tab</option>
                          <option value="|">Pipe (|)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Quote Character</label>
                        <select
                          value={parseOptions.quoteChar}
                          onChange={(e) => handleParseOptionChange('quoteChar', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        >
                          <option value='"'>Double Quote (&quot;)</option>
                          <option value="'">Single Quote (&apos;)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Panel - Preview */}
              <div className="flex-1 p-6">
                <h4 className="font-medium text-slate-900 mb-4">Data Preview</h4>
                {csvPreview.length > 0 ? (
                  <div className="border border-slate-200 rounded-lg overflow-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          {csvPreview[0]?.map((header, index) => (
                            <th key={index} className="px-3 py-2 text-left font-medium text-slate-700 border-b border-slate-200">
                              {parseOptions.hasHeaders ? header : `Column ${index + 1}`}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {csvPreview.slice(parseOptions.hasHeaders ? 1 : 0).map((row, rowIndex) => (
                          <tr key={rowIndex} className="border-b border-slate-100">
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="px-3 py-2 text-slate-600">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
                    <p className="text-slate-500">Upload a CSV file to see preview</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadedFile(null);
                  setCsvPreview([]);
                }}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpload}
                disabled={!uploadedFile || csvPreview.length === 0}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Import Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Data Modal */}
      {showPreviewModal && selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl h-5/6 flex flex-col">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Preview Data - {selectedTable.name}</h3>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-600 mt-1">{formatNumber(selectedTable.rowCount)} rows • {selectedTable.columns.length} columns</p>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto overflow-y-auto max-h-96">
                  <table className="w-full">
                    <thead className="bg-slate-50 sticky top-0">
                      <tr>
                        {selectedTable.columns.map((column, index) => (
                          <th key={index} className="px-4 py-3 text-left text-sm font-medium text-slate-700 border-b border-slate-200 min-w-32">
                            <div className="flex items-center space-x-2">
                              {getDataTypeIcon(column.type)}
                              <span>{column.name}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Sample data rows */}
                      {Array.from({ length: 10 }, (_, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-slate-50">
                          {selectedTable.columns.map((column, colIndex) => (
                            <td key={colIndex} className="px-4 py-3 text-sm text-slate-600 border-b border-slate-100">
                              {/* Sample data based on column type */}
                              {column.type === 'Number' ? Math.floor(Math.random() * 1000) :
                               column.type === 'Date' ? '2024-01-15' :
                               column.type === 'Logical' ? (Math.random() > 0.5 ? 'True' : 'False') :
                               `Sample ${column.name} ${rowIndex + 1}`}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Column Details Modal */}
      {showColumnDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Column Details</h3>
                <button
                  onClick={() => setShowColumnDetails(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {getDataTypeIcon(showColumnDetails.type, 'md')}
                  <div>
                    <h4 className="text-lg font-medium text-slate-900">{showColumnDetails.name}</h4>
                    <p className="text-sm text-slate-600">{showColumnDetails.type}</p>
                  </div>
                </div>
                
                {showColumnDetails.description && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <p className="text-sm text-slate-600">{showColumnDetails.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nullable</label>
                    <p className="text-sm text-slate-600">{showColumnDetails.nullable ? 'Yes' : 'No'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Key Type</label>
                    <p className="text-sm text-slate-600">
                      {showColumnDetails.primaryKey ? 'Primary Key' : 
                       showColumnDetails.foreignKey ? 'Foreign Key' : 'None'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-slate-700 mb-2">Sample Values</h5>
                  <div className="space-y-1">
                    {Array.from({ length: 5 }, (_, index) => (
                      <div key={index} className="text-sm text-slate-600">
                        {showColumnDetails.type === 'Number' ? Math.floor(Math.random() * 1000) :
                         showColumnDetails.type === 'Date' ? `2024-01-${15 + index}` :
                         showColumnDetails.type === 'Logical' ? (Math.random() > 0.5 ? 'True' : 'False') :
                         `Sample ${showColumnDetails.name} ${index + 1}`}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Column Settings Modal */}
      {showColumnSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Column Settings</h3>
                <button
                  onClick={() => setShowColumnSettings(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Column Name</label>
                  <input
                    type="text"
                    defaultValue={showColumnSettings.name}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    defaultValue={showColumnSettings.description || ''}
                    placeholder="Enter column description..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 h-20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Data Type</label>
                  <select 
                    defaultValue={showColumnSettings.type}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  >
                    <option value="Text">Text</option>
                    <option value="Number">Number</option>
                    <option value="Date">Date</option>
                    <option value="Logical">Logical</option>
                    <option value="Variant">Variant</option>
                    <option value="Geography">Geography</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      defaultChecked={!showColumnSettings.nullable}
                      className="rounded border-slate-300"
                    />
                    <span className="text-sm text-slate-700">Required (Not Null)</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      defaultChecked={showColumnSettings.primaryKey}
                      className="rounded border-slate-300"
                    />
                    <span className="text-sm text-slate-700">Primary Key</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowColumnSettings(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JSON Parse Modal */}
      {showJsonParseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl h-3/4 flex flex-col">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Parse JSON to Table</h3>
                <button
                  onClick={() => setShowJsonParseModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 flex overflow-hidden">
              <div className="w-1/2 border-r border-slate-200 p-6">
                <h4 className="font-medium text-slate-900 mb-3">JSON Input</h4>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="Paste your JSON data here..."
                  className="w-full h-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 font-mono text-sm resize-none"
                />
              </div>
              
              <div className="w-1/2 p-6">
                <h4 className="font-medium text-slate-900 mb-3">Table Preview</h4>
                {parsedJsonData.length > 0 ? (
                  <div className="border border-slate-200 rounded-lg overflow-auto h-full">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          {Object.keys(parsedJsonData[0] || {}).map((key, index) => (
                            <th key={index} className="px-3 py-2 text-left font-medium text-slate-700 border-b border-slate-200">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {parsedJsonData.slice(0, 10).map((row, rowIndex) => (
                          <tr key={rowIndex} className="border-b border-slate-100">
                            {Object.values(row).map((cell, cellIndex) => (
                              <td key={cellIndex} className="px-3 py-2 text-slate-600">
                                {String(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center h-full flex items-center justify-center">
                    <p className="text-slate-500">Enter JSON data to see table preview</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 flex justify-between">
              <button
                onClick={() => {
                  try {
                    const parsed = JSON.parse(jsonInput);
                    const dataArray = Array.isArray(parsed) ? parsed : [parsed];
                    setParsedJsonData(dataArray);
                  } catch {
                    alert('Invalid JSON format');
                  }
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                Parse JSON
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowJsonParseModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={parsedJsonData.length === 0}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-300 text-white rounded-lg transition-colors"
                >
                  Import as Table
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Delete Data Source</h3>
                  <p className="text-sm text-slate-600">This action cannot be undone.</p>
                </div>
              </div>
              
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete this data source? This will permanently remove all associated tables and data connections.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setDataSources(prev => prev.filter(ds => ds.id !== showDeleteConfirm));
                    setShowDeleteConfirm(null);
                  }}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Database Connection Modal */}
      {showDatabaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Connect to Data Source</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Database Type</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
                  <option>PostgreSQL</option>
                  <option>MySQL</option>
                  <option>SQL Server</option>
                  <option>Oracle</option>
                  <option>MongoDB</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Host</label>
                  <input
                    type="text"
                    placeholder="localhost"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Port</label>
                  <input
                    type="text"
                    placeholder="5432"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Database Name</label>
                <input
                  type="text"
                  placeholder="my_database"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                  <input
                    type="text"
                    placeholder="username"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="password"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDatabaseModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
                Test Connection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
