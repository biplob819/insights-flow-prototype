'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Filter, ArrowUpDown, Download, Calculator, Eye, Code, Search, ChevronDown, ChevronRight, X, Hash, Type, Calendar, Layers, Group, Sigma, TrendingUp, SortAsc, SortDesc, GripVertical, Edit, Trash2, EyeOff, Info, Lock, Percent, DollarSign, FileText, Settings, BarChart3, Database, Play, Save, Users, Globe, Shield, Share, History, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Palette } from 'lucide-react';
import { formatNumber, formatNumberWithDecimals } from '@/utils/formatters';
import { getDataTypeIcon } from '../utils/dataTypeIcons';

interface Column {
  id: string;
  name: string;
  type: 'Text' | 'Number' | 'Date' | 'Logical' | 'Variant' | 'Geography' | 'formula';
  formula?: string;
  width: number;
  visible: boolean;
  sortable: boolean;
  grouped?: boolean;
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'none';
  description?: string;
  format?: {
    type: 'currency' | 'percentage' | 'decimal' | 'text' | 'date';
    decimals?: number;
    currency?: string;
    dateFormat?: string;
  };
  frozen?: boolean;
}

interface Row {
  id: string;
  [key: string]: string | number | boolean | Date;
}

export default function ViewTab() {
  const [columns, setColumns] = useState<Column[]>([
    { id: '1', name: 'Store Region', type: 'Text', width: 120, visible: true, sortable: true, aggregation: 'none' },
    { id: '2', name: 'Brand', type: 'Text', width: 100, visible: true, sortable: true, aggregation: 'none' },
    { id: '3', name: 'Order Number', type: 'Number', width: 120, visible: true, sortable: true, aggregation: 'count' },
    { id: '4', name: 'Month of Date', type: 'Date', width: 130, visible: true, sortable: true, aggregation: 'none' },
    { id: '5', name: 'Sku Number', type: 'Text', width: 140, visible: true, sortable: true, aggregation: 'none' },
    { id: '6', name: 'Quantity', type: 'Number', width: 100, visible: true, sortable: true, aggregation: 'sum' },
    { id: '7', name: 'Cost', type: 'Number', width: 100, visible: true, sortable: true, aggregation: 'sum' },
    { id: '8', name: 'Price', type: 'Number', width: 100, visible: true, sortable: true, aggregation: 'sum' },
    { id: '9', name: 'Sales', type: 'formula', formula: '[Price] * [Quantity]', width: 120, visible: true, sortable: true, aggregation: 'sum' },
    { id: '10', name: 'COGs', type: 'Number', width: 100, visible: true, sortable: true, aggregation: 'sum' },
    { id: '11', name: 'Profit', type: 'formula', formula: '[Sales] - [COGs]', width: 100, visible: true, sortable: true, aggregation: 'sum' },
  ]);

  const [data, setData] = useState<Row[]>([
    { id: '1', 'Store Region': 'Midwest', 'Brand': 'LG', 'Order Number': 546150, 'Month of Date': '2021-02', 'Sku Number': 'SP610849178Z', 'Quantity': 2, 'Cost': 48.54, 'Price': 578.20, 'COGs': 897.08, 'Profit': 230.70 },
    { id: '2', 'Store Region': 'Midwest', 'Brand': 'LG', 'Order Number': 567688, 'Month of Date': '2023-02', 'Sku Number': 'SP610849178Z', 'Quantity': 1, 'Cost': 57.71, 'Price': 863.54, 'COGs': 863.54, 'Profit': 57.71 },
    { id: '3', 'Store Region': 'West', 'Brand': 'LG', 'Order Number': 37182, 'Month of Date': '2023-02', 'Sku Number': 'SP610849178Z', 'Quantity': 2, 'Cost': 267.82, 'Price': 190.64, 'COGs': 381.28, 'Profit': 535.64 },
    { id: '4', 'Store Region': 'East', 'Brand': 'LG', 'Order Number': 440050, 'Month of Date': '2024-02', 'Sku Number': 'SP610849178Z', 'Quantity': 3, 'Cost': 252.05, 'Price': 170.85, 'COGs': 512.55, 'Profit': 756.15 },
    { id: '5', 'Store Region': 'East', 'Brand': 'LG', 'Order Number': 560258, 'Month of Date': '2025-03', 'Sku Number': 'SP610849178Z', 'Quantity': 2, 'Cost': 848.54, 'Price': 578.20, 'COGs': 1156.58, 'Profit': 535.64 },
    { id: '6', 'Store Region': 'East', 'Brand': 'LG', 'Order Number': 451424, 'Month of Date': '2023-02', 'Sku Number': 'SP610849178Z', 'Quantity': 2, 'Cost': 48.54, 'Price': 578.20, 'COGs': 1156.58, 'Profit': 535.64 },
    { id: '7', 'Store Region': 'Midwest', 'Brand': 'LG', 'Order Number': 545689, 'Month of Date': '2022-02', 'Sku Number': 'SP610849178Z', 'Quantity': 1, 'Cost': 48.54, 'Price': 578.20, 'COGs': 578.20, 'Profit': 535.64 },
    { id: '8', 'Store Region': 'West', 'Brand': 'LG', 'Order Number': 591561, 'Month of Date': '2024-02', 'Sku Number': 'SP610849178Z', 'Quantity': 3, 'Cost': 848.54, 'Price': 578.20, 'COGs': 1734.60, 'Profit': 535.64 },
    { id: '9', 'Store Region': 'South', 'Brand': 'LG', 'Order Number': 89590, 'Month of Date': '2021-02', 'Sku Number': 'SP610849178Z', 'Quantity': 1, 'Cost': 28.57, 'Price': 578.20, 'COGs': 578.20, 'Profit': 535.64 },
    { id: '10', 'Store Region': 'South', 'Brand': 'LG', 'Order Number': 133062, 'Month of Date': '2025-02', 'Sku Number': 'SP610849178Z', 'Quantity': 2, 'Cost': 178.57, 'Price': 578.20, 'COGs': 1156.40, 'Profit': 535.64 },
    { id: '11', 'Store Region': 'South', 'Brand': 'LG', 'Order Number': 336211, 'Month of Date': '2025-02', 'Sku Number': 'SP610849178Z', 'Quantity': 2, 'Cost': 178.57, 'Price': 578.20, 'COGs': 1156.40, 'Profit': 535.64 },
    { id: '12', 'Store Region': 'West', 'Brand': 'Samsung', 'Order Number': 789123, 'Month of Date': '2023-03', 'Sku Number': 'SM789456123A', 'Quantity': 1, 'Cost': 125.00, 'Price': 299.99, 'COGs': 299.99, 'Profit': 174.99 },
    { id: '13', 'Store Region': 'Midwest', 'Brand': 'Sony', 'Order Number': 456789, 'Month of Date': '2023-01', 'Sku Number': 'SN456789012B', 'Quantity': 4, 'Cost': 89.99, 'Price': 199.99, 'COGs': 799.96, 'Profit': 440.00 },
    { id: '14', 'Store Region': 'East', 'Brand': 'Apple', 'Order Number': 123456, 'Month of Date': '2023-04', 'Sku Number': 'AP123456789C', 'Quantity': 1, 'Cost': 599.99, 'Price': 999.99, 'COGs': 999.99, 'Profit': 400.00 },
    { id: '15', 'Store Region': 'South', 'Brand': 'Dell', 'Order Number': 987654, 'Month of Date': '2023-02', 'Sku Number': 'DL987654321D', 'Quantity': 2, 'Cost': 450.00, 'Price': 799.99, 'COGs': 1599.98, 'Profit': 699.98 },
  ]);

  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [showFormulaBuilder, setShowFormulaBuilder] = useState(false);
  const [currentFormula, setCurrentFormula] = useState('');
  const [showColumnMenu, setShowColumnMenu] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ column: string; direction: 'asc' | 'desc' } | null>(null);
  const [groupedColumns, setGroupedColumns] = useState<string[]>(['1', '2']); // Store Region and Brand initially grouped
  const [showGroupingPanel, setShowGroupingPanel] = useState(false);
  const [formulaBarValue, setFormulaBarValue] = useState('');
  const [formulaSuggestions, setFormulaSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; columnId: string } | null>(null);
  const [editingColumnName, setEditingColumnName] = useState<string | null>(null);
  const [editingColumnValue, setEditingColumnValue] = useState('');
  const [showColumnDetails, setShowColumnDetails] = useState<string | null>(null);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [frozenColumns, setFrozenColumns] = useState<string[]>([]);
  const [columnDescriptions, setColumnDescriptions] = useState<{[key: string]: string}>({});
  const [showDescriptionEdit, setShowDescriptionEdit] = useState<string | null>(null);
  const [descriptionValue, setDescriptionValue] = useState('');
  const [_showDateTruncateMenu, _setShowDateTruncateMenu] = useState<string | null>(null);
  const [_showFormatMenu, _setShowFormatMenu] = useState<string | null>(null);
  const [showColumnFilter, setShowColumnFilter] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [hoveredMenuItem, setHoveredMenuItem] = useState<string | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [columnFormats, setColumnFormats] = useState<{[key: string]: {type: string; decimals?: number; currency?: string}}>({});
  const [showHiddenColumns, setShowHiddenColumns] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showMetricsPanel, setShowMetricsPanel] = useState(false);
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [rightPanelType, setRightPanelType] = useState<'formula' | 'query' | 'metrics'>('formula');
  const [formulaApplied, setFormulaApplied] = useState(false);
  const [viewStage, setViewStage] = useState<'Draft' | 'Published' | 'Deprecated'>('Draft');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const [showSQLModal, setShowSQLModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showQueryInfo, setShowQueryInfo] = useState(false);
  const [queryInfo] = useState({
    requestId: 'g925c08f64c3e4034bde256d270b11b0a',
    status: 'Completed',
    runTime: '888 ms (3:47:19 PM - 3:47:20 PM)',
    rowCount: 15
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [savedViews, setSavedViews] = useState<string[]>([]);
  const [currentViewName, setCurrentViewName] = useState('Untitled View');
  const [showSaveViewModal, setShowSaveViewModal] = useState(false);
  const [saveViewName, setSaveViewName] = useState('');
  const [isEditingViewName, setIsEditingViewName] = useState(false);
  const [versionHistory, setVersionHistory] = useState([
    { id: 1, version: 'v1.0', timestamp: '2024-01-15 10:30 AM', author: 'John Doe', description: 'Initial view creation' },
    { id: 2, version: 'v1.1', timestamp: '2024-01-16 02:15 PM', author: 'Jane Smith', description: 'Added profit calculation column' },
    { id: 3, version: 'v1.2', timestamp: '2024-01-17 09:45 AM', author: 'John Doe', description: 'Updated filters and grouping' }
  ]);
  const [draggedGroupColumn, setDraggedGroupColumn] = useState<string | null>(null);
  
  // Formatting options state
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [fontSize, setFontSize] = useState(12);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [_textColor, _setTextColor] = useState('#000000');
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedCellRange, setSelectedCellRange] = useState<{startRow: number, endRow: number, startCol: number, endCol: number} | null>(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      _setShowDateTruncateMenu(null);
      _setShowFormatMenu(null);
      setShowColumnFilter(null);
      setHoveredMenuItem(null);
      setShowFontSizeDropdown(false);
      setShowColorPicker(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  const [showDateTruncateSubmenu, setShowDateTruncateSubmenu] = useState<string | null>(null);
  const [showFormatSubmenu, setShowFormatSubmenu] = useState<string | null>(null);

  const tableRef = useRef<HTMLDivElement>(null);
  const formulaBarRef = useRef<HTMLInputElement>(null);
  const stageDropdownRef = useRef<HTMLDivElement>(null);

  // Close stage dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stageDropdownRef.current && !stageDropdownRef.current.contains(event.target as Node)) {
        setShowStageDropdown(false);
      }
    };

    if (showStageDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStageDropdown]);

  // Close submenus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.relative')) {
        setShowDateTruncateSubmenu(null);
        setShowFormatSubmenu(null);
      }
    };

    if (showDateTruncateSubmenu || showFormatSubmenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDateTruncateSubmenu, showFormatSubmenu]);

  const handleSaveView = () => {
    if (saveViewName.trim()) {
      setSavedViews(prev => [...prev, saveViewName.trim()]);
      setCurrentViewName(saveViewName.trim());
      setShowSaveViewModal(false);
      setSaveViewName('');
      // Show success message
      alert(`View "${saveViewName.trim()}" saved to Views!`);
    }
  };

  const _handleViewNameEdit = () => {
    setIsEditingViewName(true);
  };

  const _handleViewNameSave = (newName: string) => {
    if (newName.trim()) {
      setCurrentViewName(newName.trim());
    }
    setIsEditingViewName(false);
  };

  const getAggregationIcon = (aggregation: string) => {
    switch (aggregation) {
      case 'sum':
        return <Sigma className="w-3 h-3 text-blue-600" />;
      case 'avg':
        return <TrendingUp className="w-3 h-3 text-green-600" />;
      case 'count':
        return <Hash className="w-3 h-3 text-purple-600" />;
      case 'min':
      case 'max':
        return <ArrowUpDown className="w-3 h-3 text-orange-600" />;
      default:
        return null;
    }
  };

  const handleDragStart = (e: React.DragEvent, columnId: string) => {
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', columnId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    const draggedColumnId = e.dataTransfer.getData('text/plain');
    
    if (draggedColumnId && draggedColumnId !== targetColumnId) {
      const draggedIndex = columns.findIndex(col => col.id === draggedColumnId);
      const targetIndex = columns.findIndex(col => col.id === targetColumnId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newColumns = [...columns];
        const [draggedColumn] = newColumns.splice(draggedIndex, 1);
        newColumns.splice(targetIndex, 0, draggedColumn);
        setColumns(newColumns);
      }
    }
    
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  // Safe expression evaluator to replace eval()
  const safeEvaluate = (expression: string): number | boolean => {
    // Remove whitespace
    expression = expression.trim();
    
    // Handle basic arithmetic and comparison operations
    const numberRegex = /^-?\d+(\.\d+)?$/;
    
    // If it's just a number, return it
    if (numberRegex.test(expression)) {
      return parseFloat(expression);
    }
    
    // Handle basic comparisons
    const comparisonMatch = expression.match(/^(-?\d+(?:\.\d+)?)\s*([><=!]+)\s*(-?\d+(?:\.\d+)?)$/);
    if (comparisonMatch) {
      const [, left, operator, right] = comparisonMatch;
      const leftNum = parseFloat(left);
      const rightNum = parseFloat(right);
      
      switch (operator) {
        case '>': return leftNum > rightNum;
        case '<': return leftNum < rightNum;
        case '>=': return leftNum >= rightNum;
        case '<=': return leftNum <= rightNum;
        case '==': case '=': return leftNum === rightNum;
        case '!=': return leftNum !== rightNum;
        default: return false;
      }
    }
    
    // Handle basic arithmetic
    const arithmeticMatch = expression.match(/^(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)$/);
    if (arithmeticMatch) {
      const [, left, operator, right] = arithmeticMatch;
      const leftNum = parseFloat(left);
      const rightNum = parseFloat(right);
      
      switch (operator) {
        case '+': return leftNum + rightNum;
        case '-': return leftNum - rightNum;
        case '*': return leftNum * rightNum;
        case '/': return rightNum !== 0 ? leftNum / rightNum : 0;
        default: return 0;
      }
    }
    
    return 0;
  };

  // Calculate formula values
  const calculateFormula = (formula: string, row: Row): string | number => {
    try {
      // Simple formula parser - safe replacement for eval
      let expression = formula;
      
      // Replace column references with actual values
      columns.forEach(col => {
        const regex = new RegExp(`\\[${col.name}\\]`, 'g');
        const value = row[col.name];
        const numValue = typeof value === 'number' ? value.toString() : (parseFloat(value?.toString() || '0') || 0).toString();
        expression = expression.replace(regex, numValue);
      });
      
      // Handle IF statements
      expression = expression.replace(/IF\(([^,]+),\s*"([^"]+)",\s*(?:IF\(([^,]+),\s*"([^"]+)",\s*"([^"]+)"\)|"([^"]+)")\)/g, 
        (match, condition, trueVal, nestedCondition, nestedTrueVal, nestedFalseVal, falseVal) => {
          if (nestedCondition) {
            // Nested IF
            const outerResult = safeEvaluate(condition);
            if (outerResult) return `"${trueVal}"`;
            const innerResult = safeEvaluate(nestedCondition);
            return innerResult ? `"${nestedTrueVal}"` : `"${nestedFalseVal}"`;
          } else {
            const result = safeEvaluate(condition);
            return result ? `"${trueVal}"` : `"${falseVal || ''}"`;
          }
        });
      
      // If the expression is wrapped in quotes, return as string
      if (expression.startsWith('"') && expression.endsWith('"')) {
        return expression.slice(1, -1);
      }
      
      // Try to evaluate as a safe arithmetic expression
      const result = safeEvaluate(expression);
      return typeof result === 'boolean' ? (result ? 'TRUE' : 'FALSE') : result;
    } catch {
      return '#ERROR';
    }
  };

  // Get processed data with calculated formulas
  const processedData = data.map(row => {
    const processedRow = { ...row };
    columns.forEach(col => {
      if (col.type === 'formula' && col.formula) {
        processedRow[col.name] = calculateFormula(col.formula, row);
      }
    });
    return processedRow;
  });

  const handleCellClick = (rowIndex: number, colIndex: number, isShiftKey: boolean = false) => {
    handleCellSelection(rowIndex, colIndex, isShiftKey);
    setEditingCell(null);
    
    // Add column reference to formula bar when cell is clicked
    const column = columns.filter(col => col.visible)[colIndex];
    if (column) {
      handleColumnClick(column.name, 'Table');
    }
  };

  const handleCellDoubleClick = (rowIndex: number, colIndex: number) => {
    setEditingCell({ row: rowIndex, col: colIndex });
    setSelectedCell(null);
  };

  const handleSort = (columnName: string) => {
    const direction = sortConfig?.column === columnName && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ column: columnName, direction });
    
    const sortedData = [...data].sort((a, b) => {
      const aVal = a[columnName];
      const bVal = b[columnName];
      
      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    setData(sortedData);
  };

  const formatCellValue = (value: string | number | boolean | Date, type: string, columnId?: string) => {
    if (value === null || value === undefined) return '';
    
    // Check for custom column formatting
    const customFormat = columnId ? columnFormats[columnId] : null;
    
    if (customFormat && typeof value === 'number') {
      switch (customFormat.type) {
        case 'currency':
          return `$${value.toFixed(customFormat.decimals || 2)}`;
        case 'percentage':
          return `${(value * 100).toFixed(customFormat.decimals || 1)}%`;
        case 'decimal':
          return value.toFixed(customFormat.decimals || 2);
      }
    }
    
    switch (type) {
      case 'Number':
        return typeof value === 'number' ? formatNumber(value) : value;
      case 'Date':
        return typeof value === 'string' ? new Date(value).toLocaleDateString() : value;
      case 'Logical':
        return typeof value === 'boolean' ? (value ? 'True' : 'False') : value;
      case 'formula':
        if (typeof value === 'number') {
          return formatNumberWithDecimals(value, 2, 2);
        }
        return value;
      default:
        return value;
    }
  };

  const generateFormulaSuggestions = (input: string): string[] => {
    const suggestions: string[] = [];
    const lowerInput = input.toLowerCase();
    
    // Function suggestions
    const functions = [
      'SUM', 'AVERAGE', 'COUNT', 'MAX', 'MIN', 'IF', 'CONCAT', 'ROUND', 
      'UPPER', 'LOWER', 'DATE', 'YEAR', 'MONTH', 'DAY', 'TODAY', 'NOW'
    ];
    
    functions.forEach(func => {
      if (func.toLowerCase().includes(lowerInput)) {
        suggestions.push(`${func}(`);
      }
    });
    
    // Column suggestions with Table/Column format
    columns.forEach(col => {
      if (col.name.toLowerCase().includes(lowerInput)) {
        suggestions.push(`[Table/${col.name}]`);
      }
    });
    
    return suggestions.slice(0, 8); // Limit to 8 suggestions
  };

  const handleFormulaBarChange = (value: string) => {
    setFormulaBarValue(value);
    
    if (value.length > 0) {
      const lastWord = value.split(/[\s\(\)\[\]]+/).pop() || '';
      if (lastWord.length > 0) {
        const suggestions = generateFormulaSuggestions(lastWord);
        setFormulaSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleColumnClick = (columnName: string, tableName: string = 'Table') => {
    const columnReference = `[${tableName}/${columnName}]`;
    const currentValue = formulaBarValue;
    const cursorPosition = formulaBarRef.current?.selectionStart || currentValue.length;
    
    // Insert the column reference at cursor position
    const newValue = currentValue.slice(0, cursorPosition) + columnReference + currentValue.slice(cursorPosition);
    setFormulaBarValue(newValue);
    
    // Focus back to formula bar and set cursor position
    setTimeout(() => {
      if (formulaBarRef.current) {
        formulaBarRef.current.focus();
        formulaBarRef.current.setSelectionRange(
          cursorPosition + columnReference.length,
          cursorPosition + columnReference.length
        );
      }
    }, 0);
  };

  const handleCellSelection = (rowIndex: number, colIndex: number, isRangeSelection: boolean = false) => {
    if (isRangeSelection && selectedCellRange) {
      // Extend selection range
      setSelectedCellRange({
        startRow: Math.min(selectedCellRange.startRow, rowIndex),
        endRow: Math.max(selectedCellRange.endRow, rowIndex),
        startCol: Math.min(selectedCellRange.startCol, colIndex),
        endCol: Math.max(selectedCellRange.endCol, colIndex)
      });
    } else {
      // Single cell selection
      setSelectedCell({ row: rowIndex, col: colIndex });
      setSelectedCellRange({
        startRow: rowIndex,
        endRow: rowIndex,
        startCol: colIndex,
        endCol: colIndex
      });
    }
  };

  const isCellInSelection = (rowIndex: number, colIndex: number): boolean => {
    if (!selectedCellRange) return false;
    return rowIndex >= selectedCellRange.startRow && 
           rowIndex <= selectedCellRange.endRow && 
           colIndex >= selectedCellRange.startCol && 
           colIndex <= selectedCellRange.endCol;
  };

  const applySuggestion = (suggestion: string) => {
    const words = formulaBarValue.split(/[\s\(\)\[\]]+/);
    words[words.length - 1] = suggestion;
    const newValue = words.join(' ');
    setFormulaBarValue(newValue);
    setShowSuggestions(false);
    formulaBarRef.current?.focus();
  };

  const addNewColumn = () => {
    const newColumn: Column = {
      id: (columns.length + 1).toString(),
      name: `New Column ${columns.length + 1}`,
      type: 'Text',
      width: 150,
      visible: true,
      sortable: true,
      aggregation: 'none'
    };
    setColumns([...columns, newColumn]);
    
    // Add empty data for the new column
    setData(prevData => 
      prevData.map(row => ({
        ...row,
        id: row.id,
        [newColumn.name]: ''
      }))
    );
  };

  const _handleExport = () => {
    const csvContent = [
      // Header row
      columns.filter(col => col.visible).map(col => col.name).join(','),
      // Data rows
      ...processedData.map(row => 
        columns.filter(col => col.visible).map(col => {
          const value = row[col.name];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data-export.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleColumnRightClick = (e: React.MouseEvent, columnId: string) => {
    console.log('Right click detected on column:', columnId);
    e.preventDefault();
    const menuPosition = {
      x: e.clientX,
      y: e.clientY,
      columnId
    };
    console.log('Setting context menu:', menuPosition);
    setContextMenu(menuPosition);
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const addColumnToLeft = (columnId: string) => {
    const columnIndex = columns.findIndex(col => col.id === columnId);
    const newColumn: Column = {
      id: (columns.length + 1).toString(),
      name: `New Column ${columns.length + 1}`,
      type: 'Text',
      width: 150,
      visible: true,
      sortable: true,
      aggregation: 'none'
    };
    
    const newColumns = [...columns];
    newColumns.splice(columnIndex, 0, newColumn);
    setColumns(newColumns);
    
    // Add empty data for the new column
    setData(prevData => 
      prevData.map(row => ({
        ...row,
        id: row.id,
        [newColumn.name]: ''
      }))
    );
    closeContextMenu();
  };

  const addColumnToRight = (columnId: string) => {
    const columnIndex = columns.findIndex(col => col.id === columnId);
    const newColumn: Column = {
      id: (columns.length + 1).toString(),
      name: `New Column ${columns.length + 1}`,
      type: 'Text',
      width: 150,
      visible: true,
      sortable: true,
      aggregation: 'none'
    };
    
    const newColumns = [...columns];
    newColumns.splice(columnIndex + 1, 0, newColumn);
    setColumns(newColumns);
    
    // Add empty data for the new column
    setData(prevData => 
      prevData.map(row => ({
        ...row,
        id: row.id,
        [newColumn.name]: ''
      }))
    );
    closeContextMenu();
  };

  const hideColumn = (columnId: string) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, visible: false } : col
    ));
    closeContextMenu();
  };

  const deleteColumn = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (column) {
      setColumns(prev => prev.filter(col => col.id !== columnId));
      setData(prevData => 
        prevData.map(row => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [column.name]: _unused, ...rest } = row;
          return { ...rest, id: row.id };
        })
      );
    }
    closeContextMenu();
  };

  const startEditingColumnName = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (column) {
      setEditingColumnName(columnId);
      setEditingColumnValue(column.name);
    }
    closeContextMenu();
  };

  const saveColumnName = () => {
    if (editingColumnName && editingColumnValue.trim()) {
      const oldColumn = columns.find(col => col.id === editingColumnName);
      if (oldColumn) {
        // Update column name
        setColumns(prev => prev.map(col => 
          col.id === editingColumnName ? { ...col, name: editingColumnValue.trim() } : col
        ));
        
        // Update data keys
        setData(prevData => 
          prevData.map(row => {
            const { [oldColumn.name]: value, ...rest } = row;
            return {
              ...rest,
              id: row.id,
              [editingColumnValue.trim()]: value
            };
          })
        );
      }
    }
    setEditingColumnName(null);
    setEditingColumnValue('');
  };

  const cancelEditingColumnName = () => {
    setEditingColumnName(null);
    setEditingColumnValue('');
  };

  const sigmaFunctions = [
    { name: 'SUM', description: 'Sum of values', syntax: 'SUM([Column])' },
    { name: 'AVERAGE', description: 'Average of values', syntax: 'AVERAGE([Column])' },
    { name: 'COUNT', description: 'Count of values', syntax: 'COUNT([Column])' },
    { name: 'MAX', description: 'Maximum value', syntax: 'MAX([Column])' },
    { name: 'MIN', description: 'Minimum value', syntax: 'MIN([Column])' },
    { name: 'IF', description: 'Conditional logic', syntax: 'IF(condition, true_value, false_value)' },
    { name: 'CONCAT', description: 'Concatenate text', syntax: 'CONCAT([Column1], [Column2])' },
    { name: 'ROUND', description: 'Round number', syntax: 'ROUND([Column], decimals)' },
    { name: 'UPPER', description: 'Convert to uppercase', syntax: 'UPPER([Column])' },
    { name: 'LOWER', description: 'Convert to lowercase', syntax: 'LOWER([Column])' },
    { name: 'DATE', description: 'Date functions', syntax: 'DATE([Column])' },
    { name: 'YEAR', description: 'Extract year', syntax: 'YEAR([Column])' },
    { name: 'MONTH', description: 'Extract month', syntax: 'MONTH([Column])' },
    { name: 'DAY', description: 'Extract day', syntax: 'DAY([Column])' },
  ];

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu) {
        closeContextMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu]);

  return (
    <div className="h-full flex flex-col">

      {/* View Title Row */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isEditingViewName ? (
              <input
                type="text"
                value={currentViewName}
                onChange={(e) => setCurrentViewName(e.target.value)}
                onBlur={() => setIsEditingViewName(false)}
                onKeyPress={(e) => e.key === 'Enter' && setIsEditingViewName(false)}
                className="text-lg font-semibold text-slate-900 bg-transparent border-b border-slate-300 focus:border-cyan-500 outline-none"
                autoFocus
              />
            ) : (
              <h1 
                onClick={() => setIsEditingViewName(true)}
                className="text-lg font-semibold text-slate-900 cursor-pointer hover:text-cyan-600"
              >
                {currentViewName}
              </h1>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => {
                setShowRightPanel(true);
                setRightPanelType('query');
              }}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center"
            >
              <Info className="w-4 h-4 mr-2" />
              Query Info
            </button>
            
            <button 
              onClick={() => setShowSQLModal(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center"
            >
              <Code className="w-4 h-4 mr-2" />
              View SQL
            </button>
            
            <button 
              onClick={() => {
                setShowRightPanel(true);
                setRightPanelType('metrics');
              }}
              className="px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Add Metric
            </button>
            
            {/* Stage Dropdown */}
            <div className="relative" ref={stageDropdownRef}>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500">Stage:</span>
                <button
                  onClick={() => setShowStageDropdown(!showStageDropdown)}
                  className={`px-2 py-1 text-xs font-medium rounded flex items-center ${
                    viewStage === 'Draft' ? 'bg-yellow-100 text-yellow-700' :
                    viewStage === 'Published' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}
                >
                  {viewStage}
                  <ChevronDown className="w-3 h-3 ml-1" />
                </button>
              </div>
              
              {showStageDropdown && (
                <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setViewStage('Draft');
                        setShowStageDropdown(false);
                      }}
                      className="w-full text-left p-3 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <div className="font-medium text-slate-900">Draft</div>
                      <div className="text-sm text-slate-600">Work in progress, not visible to others</div>
                    </button>
                    <button
                      onClick={() => {
                        setViewStage('Published');
                        setShowStageDropdown(false);
                      }}
                      className="w-full text-left p-3 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <div className="font-medium text-slate-900">Published</div>
                      <div className="text-sm text-slate-600">Live and available to users</div>
                    </button>
                    <button
                      onClick={() => {
                        setViewStage('Deprecated');
                        setShowStageDropdown(false);
                      }}
                      className="w-full text-left p-3 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <div className="font-medium text-slate-900">Deprecated</div>
                      <div className="text-sm text-slate-600">No longer maintained, will be removed</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setShowShareModal(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center"
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </button>
            
            <button 
              onClick={() => setShowVersionHistory(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center"
              title="Version History"
            >
              <History className="w-4 h-4" />
            </button>
            
            <button 
              onClick={() => {
                setSaveViewName(currentViewName);
                setShowSaveViewModal(true);
              }}
              className="px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save View
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            
            <button 
              onClick={addNewColumn}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Column
            </button>
            
            {/* Group By Button - Clean without inline columns */}
            <button 
              onClick={() => setShowGroupingPanel(!showGroupingPanel)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center"
            >
              <Group className="w-4 h-4 mr-2" />
              Group By
            </button>
            
            {columns.some(col => !col.visible) && (
              <button 
                onClick={() => setShowHiddenColumns(!showHiddenColumns)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                Show Hidden ({columns.filter(col => !col.visible).length})
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">{processedData.length} rows</span>
            <button 
              onClick={() => setShowJoinModal(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center"
            >
              <Layers className="w-4 h-4 mr-2" />
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Excel-like Formula Bar with Formatting Options */}
      <div className="bg-white border-b border-slate-200 px-6 py-2">
        <div className="flex items-center space-x-3">
          {/* Formatting Options */}
          <div className="flex items-center space-x-1 border-r border-slate-200 pr-3">
            {/* Bold, Italic, Underline */}
            <button
              onClick={() => setIsBold(!isBold)}
              className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${
                isBold ? 'bg-slate-200 text-slate-900' : 'text-slate-600'
              }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsItalic(!isItalic)}
              className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${
                isItalic ? 'bg-slate-200 text-slate-900' : 'text-slate-600'
              }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsUnderline(!isUnderline)}
              className={`p-1.5 rounded hover:bg-slate-100 transition-colors ${
                isUnderline ? 'bg-slate-200 text-slate-900' : 'text-slate-600'
              }`}
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
            
            {/* Font Size */}
            <div className="relative">
              <button
                onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
                className="px-2 py-1.5 text-xs border border-slate-300 rounded hover:bg-slate-50 transition-colors min-w-[40px] text-center"
                title="Font Size"
              >
                {fontSize}
              </button>
              {showFontSizeDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-30 min-w-[60px]">
                  {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24].map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setFontSize(size);
                        setShowFontSizeDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Text Alignment */}
            <button
              onClick={() => setTextAlign(textAlign === 'left' ? 'center' : textAlign === 'center' ? 'right' : 'left')}
              className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-600"
              title={`Align ${textAlign}`}
            >
              {textAlign === 'left' && <AlignLeft className="w-4 h-4" />}
              {textAlign === 'center' && <AlignCenter className="w-4 h-4" />}
              {textAlign === 'right' && <AlignRight className="w-4 h-4" />}
            </button>
            
            {/* Text Color */}
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-1.5 rounded hover:bg-slate-100 transition-colors text-slate-600"
                title="Text Color"
              >
                <Palette className="w-4 h-4" />
              </button>
              {showColorPicker && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-30 p-3">
                  <div className="grid grid-cols-6 gap-1">
                    {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#FFC0CB', '#A52A2A'].map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          _setTextColor(color);
                          setShowColorPicker(false);
                        }}
                        className="w-6 h-6 rounded border border-slate-300 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Cell Reference */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-slate-700 w-16">
              {selectedCell ? `${String.fromCharCode(65 + selectedCell.col)}${selectedCell.row + 1}` : 'A1'}
            </span>
            <Calculator className="w-4 h-4 text-slate-500" />
          </div>
          
          {/* Formula Input */}
          <div className="flex-1 relative">
            <input
              ref={formulaBarRef}
              type="text"
              value={formulaBarValue}
              onChange={(e) => handleFormulaBarChange(e.target.value)}
              placeholder="Enter formula or value..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm font-mono"
              onFocus={() => setShowSuggestions(formulaSuggestions.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            
            {/* Formula Suggestions */}
            {showSuggestions && formulaSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                {formulaSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => applySuggestion(suggestion)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 transition-colors font-mono"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button 
            onClick={() => {
              setFormulaApplied(true);
              setTimeout(() => setFormulaApplied(false), 2000);
            }}
            className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
              formulaApplied 
                ? 'bg-green-500 text-white' 
                : 'bg-cyan-500 hover:bg-cyan-600 text-white'
            }`}
          >
            {formulaApplied ? '✓ Applied' : '✓ Apply'}
          </button>
        </div>
      </div>

      {/* Grouping Panel */}
      {showGroupingPanel && (
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-slate-700">Group by:</span>
              
              {/* Selected Group By Columns - Draggable Row */}
              {groupedColumns.length > 0 && (
                <div className="flex items-center space-x-1 bg-white rounded-lg p-2 border border-slate-200">
                  <span className="text-xs text-slate-500 mr-2">Drag to reorder:</span>
                  {groupedColumns.map((columnId, _index) => {
                    const column = columns.find(col => col.id === columnId);
                    return (
                      <div
                        key={columnId}
                        draggable
                        onDragStart={(e) => {
                          setDraggedGroupColumn(columnId);
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = 'move';
                        }}
                        onDragEnter={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggedGroupColumn && draggedGroupColumn !== columnId) {
                            const draggedIndex = groupedColumns.indexOf(draggedGroupColumn);
                            const targetIndex = groupedColumns.indexOf(columnId);
                            const newGroupedColumns = [...groupedColumns];
                            newGroupedColumns.splice(draggedIndex, 1);
                            newGroupedColumns.splice(targetIndex, 0, draggedGroupColumn);
                            setGroupedColumns(newGroupedColumns);
                          }
                          setDraggedGroupColumn(null);
                        }}
                        className={`flex items-center space-x-1 px-2 py-1 bg-cyan-100 border border-cyan-300 rounded text-xs cursor-move hover:bg-cyan-200 transition-all ${
                          draggedGroupColumn === columnId ? 'opacity-50 scale-95' : ''
                        }`}
                      >
                        <GripVertical className="w-3 h-3 text-cyan-600" />
                        {getDataTypeIcon(column?.type || 'Text')}
                        <span className="text-cyan-700 font-medium">{column?.name}</span>
                        <button
                          onClick={() => {
                            setGroupedColumns(prev => prev.filter(id => id !== columnId));
                            setColumns(prev => prev.map(col => 
                              col.id === columnId ? { ...col, grouped: false } : col
                            ));
                          }}
                          className="text-cyan-600 hover:text-cyan-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Available Columns to Group By */}
              <div className="flex items-center space-x-2">
                {columns.filter(col => col.visible && col.type !== 'formula' && !groupedColumns.includes(col.id)).map((column) => (
                  <button
                    key={column.id}
                    onClick={() => {
                      setGroupedColumns(prev => [...prev, column.id]);
                      setColumns(prev => prev.map(col => 
                        col.id === column.id ? { ...col, grouped: true } : col
                      ));
                    }}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                  >
                    {getDataTypeIcon(column.type)}
                    <span>{column.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => setShowGroupingPanel(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Query Info Panel */}
      {showQueryInfo && (
        <div className="bg-white border-b border-slate-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700">Status: {queryInfo.status}</span>
              </div>
              <div className="text-sm text-slate-600">
                <span className="font-medium">Request ID:</span> {queryInfo.requestId}
              </div>
              <div className="text-sm text-slate-600">
                <span className="font-medium">Run Time:</span> {queryInfo.runTime}
              </div>
              <div className="text-sm text-slate-600">
                <span className="font-medium">Rows:</span> {queryInfo.rowCount.toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => setShowQueryInfo(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Data Table Container */}
      <div className="flex-1 flex overflow-hidden bg-slate-50">
        {/* Main Table */}
        <div className="flex-1 bg-white border border-slate-200 rounded-lg m-4 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto" ref={tableRef}>
        <table className="w-full border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              {columns.filter(col => col.visible).map((column) => (
                <th
                  key={column.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, column.id)}
                  onDragOver={(e) => handleDragOver(e, column.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, column.id)}
                  onContextMenu={(e) => handleColumnRightClick(e, column.id)}
                  onMouseEnter={() => setHoveredColumn(column.id)}
                  onMouseLeave={() => setHoveredColumn(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (e.ctrlKey || e.metaKey) {
                      // Multi-select with Ctrl/Cmd
                      setSelectedColumns(prev => 
                        prev.includes(column.id) 
                          ? prev.filter(id => id !== column.id)
                          : [...prev, column.id]
                      );
                    } else {
                      // Single select
                      setSelectedColumns([column.id]);
                      // Add column reference to formula bar
                      handleColumnClick(column.name, 'Table');
                    }
                  }}
                  className={`border border-slate-200 px-2 py-1 text-left text-sm font-medium text-slate-700 relative group cursor-pointer transition-all ${
                    draggedColumn === column.id ? 'opacity-50' : ''
                  } ${
                    dragOverColumn === column.id ? 'bg-cyan-100 border-cyan-300' : ''
                  } ${
                    selectedColumns.includes(column.id) ? 'bg-cyan-50 border-cyan-300 shadow-sm' : ''
                  } ${
                    hoveredColumn === column.id ? 'bg-slate-50 shadow-sm' : ''
                  }`}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <GripVertical className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {getDataTypeIcon(column.type)}
                      {editingColumnName === column.id ? (
                        <input
                          type="text"
                          value={editingColumnValue}
                          onChange={(e) => setEditingColumnValue(e.target.value)}
                          onBlur={saveColumnName}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveColumnName();
                            if (e.key === 'Escape') cancelEditingColumnName();
                          }}
                          className="bg-white border border-cyan-300 rounded px-1 py-0.5 text-sm font-medium min-w-0 flex-1"
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center space-x-1">
                          <span 
                            onDoubleClick={() => startEditingColumnName(column.id)}
                            className="cursor-pointer hover:bg-slate-100 px-1 py-0.5 rounded"
                          >
                            {column.name}
                          </span>
                          {columnDescriptions[column.id] && (
                            <div title={columnDescriptions[column.id]}>
                              <Info className="w-3 h-3 text-slate-400" />
                            </div>
                          )}
                        </div>
                      )}
                      {column.aggregation && column.aggregation !== 'none' && getAggregationIcon(column.aggregation)}
                      {groupedColumns.includes(column.name) && (
                        <Group className="w-3 h-3 text-purple-500" />
                      )}
                      {columnFormats[column.id] && (
                        <div className="flex items-center">
                          {columnFormats[column.id].type === 'currency' && <DollarSign className="w-3 h-3 text-green-600" />}
                          {columnFormats[column.id].type === 'percentage' && <Percent className="w-3 h-3 text-blue-600" />}
                          {columnFormats[column.id].type === 'decimal' && <Hash className="w-3 h-3 text-orange-600" />}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      {column.sortable && (
                        <button
                          onClick={() => handleSort(column.name)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded"
                        >
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => setShowColumnMenu(showColumnMenu === column.id ? null : column.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Column Menu */}
                  {showColumnMenu === column.id && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 min-w-48 max-h-80 overflow-y-auto">
                      <div className="p-2">
                        <button 
                          onClick={() => addColumnToLeft(column.id)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Column to Left
                        </button>
                        
                        <button 
                          onClick={() => addColumnToRight(column.id)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Column to Right
                        </button>
                        
                        <hr className="my-2" />
                        
                        <button 
                          onClick={() => handleSort(column.name)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded flex items-center"
                        >
                          <SortAsc className="w-4 h-4 mr-2" />
                          Sort Ascending
                        </button>
                        <button 
                          onClick={() => handleSort(column.name)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded flex items-center"
                        >
                          <SortDesc className="w-4 h-4 mr-2" />
                          Sort Descending
                        </button>
                        
                        <hr className="my-2" />
                        
                        <button 
                          onClick={() => {
                            setShowFiltersPanel(true);
                            setShowColumnMenu(null);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded flex items-center"
                        >
                          <Filter className="w-4 h-4 mr-2" />
                          Filter Column
                        </button>
                        
                        <button 
                          onClick={() => startEditingColumnName(column.id)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded flex items-center"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Rename Column
                        </button>
                        
                        <button 
                          onClick={() => {
                            setShowDescriptionEdit(column.id);
                            setDescriptionValue(columnDescriptions[column.id] || '');
                            setShowColumnMenu(null);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Set Description
                        </button>
                        
                        <button 
                          onClick={() => hideColumn(column.id)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded flex items-center"
                        >
                          <EyeOff className="w-4 h-4 mr-2" />
                          Hide Column
                        </button>
                        
                        <button 
                          onClick={() => {
                            const columnIndex = columns.findIndex(col => col.id === column.id);
                            const columnsToFreeze = columns.slice(0, columnIndex + 1).map(col => col.id);
                            setFrozenColumns(columnsToFreeze);
                            setShowColumnMenu(null);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded flex items-center"
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Freeze up to Column
                        </button>
                        
                        {column.type === 'Date' && (
                          <div className="relative">
                            <button 
                              onClick={() => {
                                setShowDateTruncateSubmenu(showDateTruncateSubmenu === column.id ? null : column.id);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                Truncate Date
                              </div>
                              <ChevronDown className="w-3 h-3" />
                            </button>
                            
                            {showDateTruncateSubmenu === column.id && (
                              <div className="absolute left-full top-0 ml-1 bg-white border border-slate-200 rounded-lg shadow-lg z-30 min-w-32">
                                <div className="p-1">
                                  {['Year', 'Quarter', 'Month', 'Week', 'Day'].map((period) => (
                                    <button
                                      key={period}
                                      onClick={() => {
                                        // Handle date truncation
                                        console.log(`Truncate ${column.name} to ${period}`);
                                        setShowDateTruncateSubmenu(null);
                                        setShowColumnMenu(null);
                                      }}
                                      className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded"
                                    >
                                      {period}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="relative">
                          <button 
                            onClick={() => {
                              setShowFormatSubmenu(showFormatSubmenu === column.id ? null : column.id);
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <Settings className="w-4 h-4 mr-2" />
                              Format Column
                            </div>
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          
                          {showFormatSubmenu === column.id && (
                            <div className="absolute left-full top-0 ml-1 bg-white border border-slate-200 rounded-lg shadow-lg z-30 min-w-40">
                              <div className="p-1">
                                {column.type === 'Number' && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setColumnFormats(prev => ({
                                          ...prev,
                                          [column.id]: { type: 'currency', decimals: 2 }
                                        }));
                                        setShowFormatSubmenu(null);
                                        setShowColumnMenu(null);
                                      }}
                                      className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded flex items-center"
                                    >
                                      <DollarSign className="w-4 h-4 mr-2" />
                                      Currency
                                    </button>
                                    <button
                                      onClick={() => {
                                        setColumnFormats(prev => ({
                                          ...prev,
                                          [column.id]: { type: 'percentage', decimals: 1 }
                                        }));
                                        setShowFormatSubmenu(null);
                                        setShowColumnMenu(null);
                                      }}
                                      className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded flex items-center"
                                    >
                                      <Percent className="w-4 h-4 mr-2" />
                                      Percentage
                                    </button>
                                    <button
                                      onClick={() => {
                                        setColumnFormats(prev => ({
                                          ...prev,
                                          [column.id]: { type: 'decimal', decimals: 2 }
                                        }));
                                        setShowFormatSubmenu(null);
                                        setShowColumnMenu(null);
                                      }}
                                      className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded flex items-center"
                                    >
                                      <Hash className="w-4 h-4 mr-2" />
                                      Number
                                    </button>
                                  </>
                                )}
                                {column.type === 'Text' && (
                                  <button
                                    onClick={() => {
                                      setColumnFormats(prev => ({
                                        ...prev,
                                        [column.id]: { type: 'text' }
                                      }));
                                      setShowFormatSubmenu(null);
                                      setShowColumnMenu(null);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded flex items-center"
                                  >
                                    <Type className="w-4 h-4 mr-2" />
                                    Text
                                  </button>
                                )}
                                {column.type === 'Date' && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setColumnFormats(prev => ({
                                          ...prev,
                                          [column.id]: { type: 'date', dateFormat: 'MM/DD/YYYY' }
                                        }));
                                        setShowFormatSubmenu(null);
                                        setShowColumnMenu(null);
                                      }}
                                      className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded"
                                    >
                                      MM/DD/YYYY
                                    </button>
                                    <button
                                      onClick={() => {
                                        setColumnFormats(prev => ({
                                          ...prev,
                                          [column.id]: { type: 'date', dateFormat: 'DD/MM/YYYY' }
                                        }));
                                        setShowFormatSubmenu(null);
                                        setShowColumnMenu(null);
                                      }}
                                      className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded"
                                    >
                                      DD/MM/YYYY
                                    </button>
                                    <button
                                      onClick={() => {
                                        setColumnFormats(prev => ({
                                          ...prev,
                                          [column.id]: { type: 'date', dateFormat: 'YYYY-MM-DD' }
                                        }));
                                        setShowFormatSubmenu(null);
                                        setShowColumnMenu(null);
                                      }}
                                      className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded"
                                    >
                                      YYYY-MM-DD
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <hr className="my-2" />
                        
                        {/* Aggregation Options */}
                        {(column.type === 'Number' || column.type === 'formula') && (
                          <>
                            <div className="px-3 py-1 text-xs font-medium text-slate-500 uppercase tracking-wide">
                              Aggregation
                            </div>
                            {['sum', 'avg', 'count', 'min', 'max', 'none'].map((agg) => (
                              <button
                                key={agg}
                                onClick={() => {
                                  setColumns(prev => prev.map(col => 
                                    col.id === column.id 
                                      ? { ...col, aggregation: agg as 'sum' | 'avg' | 'count' | 'min' | 'max' | 'none' }
                                      : col
                                  ));
                                  setShowColumnMenu(null);
                                }}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded flex items-center ${
                                  column.aggregation === agg ? 'bg-cyan-50 text-cyan-700' : ''
                                }`}
                              >
                                {getAggregationIcon(agg)}
                                <span className="ml-2 capitalize">{agg === 'none' ? 'No Aggregation' : agg}</span>
                              </button>
                            ))}
                            <hr className="my-2" />
                          </>
                        )}
                        
                        <button 
                          onClick={() => {
                            setShowColumnDetails(column.id);
                            setShowColumnMenu(null);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded flex items-center"
                        >
                          <Info className="w-4 h-4 mr-2" />
                          Column Details
                        </button>
                        
                        {column.type === 'formula' && (
                          <>
                            <hr className="my-2" />
                            <button className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded flex items-center">
                              <Calculator className="w-4 h-4 mr-2" />
                              Edit Formula
                            </button>
                          </>
                        )}
                        
                        <hr className="my-2" />
                        
                        <button 
                          onClick={() => deleteColumn(column.id)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded flex items-center text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Column
                        </button>
                      </div>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processedData.map((row, rowIndex) => (
              <tr key={row.id} className="hover:bg-slate-50">
                {columns.filter(col => col.visible).map((column, colIndex) => (
                  <td
                    key={`${row.id}-${column.id}`}
                    className={`border border-slate-200 px-2 py-1 text-sm cursor-cell transition-colors ${
                      isCellInSelection(rowIndex, colIndex)
                        ? 'bg-cyan-100 border-cyan-500'
                        : selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                        ? 'bg-cyan-200 border-cyan-600'
                        : 'hover:bg-slate-50'
                    } ${frozenColumns.includes(column.id) ? 'sticky left-0 bg-white z-10' : ''}`}
                    onClick={(e) => handleCellClick(rowIndex, colIndex, e.shiftKey)}
                    onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
                  >
                    {editingCell?.row === rowIndex && editingCell?.col === colIndex ? (
                      <input
                        type="text"
                        defaultValue={String(row[column.name] || '')}
                        className="w-full bg-transparent border-none outline-none"
                        autoFocus
                        onBlur={() => setEditingCell(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setEditingCell(null);
                        }}
                      />
                    ) : (
                      <span className={column.type === 'formula' ? 'font-medium' : ''}>
                        {String(formatCellValue(row[column.name], column.type, column.id))}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          
          {/* Table Totals */}
          <tfoot className="bg-slate-100 border-t-2 border-slate-300 sticky bottom-0">
            <tr>
              {columns.filter(col => col.visible).map((column) => {
                const columnData = processedData.map(row => row[column.name]).filter(val => val !== null && val !== undefined);
                const numericData = columnData.filter(val => typeof val === 'number');
                
                let totalValue = '';
                if (column.aggregation && column.aggregation !== 'none' && numericData.length > 0) {
                  switch (column.aggregation) {
                    case 'sum':
                      totalValue = formatNumber(numericData.reduce((acc, val) => acc + val, 0));
                      break;
                    case 'avg':
                      totalValue = formatNumber(numericData.reduce((acc, val) => acc + val, 0) / numericData.length);
                      break;
                    case 'count':
                      totalValue = columnData.length.toString();
                      break;
                    case 'min':
                      totalValue = formatNumber(Math.min(...numericData));
                      break;
                    case 'max':
                      totalValue = formatNumber(Math.max(...numericData));
                      break;
                  }
                } else if (column.name === columns.filter(col => col.visible)[0]?.name) {
                  totalValue = 'Total';
                }
                
                return (
                  <td
                    key={`total-${column.id}`}
                    className={`border border-slate-200 px-3 py-2 text-sm font-semibold ${
                      frozenColumns.includes(column.id) ? 'sticky left-0 bg-slate-100 z-10' : ''
                    }`}
                  >
                    {totalValue}
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
          </div>
        </div>

        {/* Enhanced Right Panel */}
        {showRightPanel && (
          <div className="w-96 bg-white border-l border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {rightPanelType === 'formula' ? 'Formula Builder' : 
                     rightPanelType === 'query' ? 'Query Information' : 'Metrics'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowRightPanel(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Panel Type Tabs */}
              <div className="flex items-center space-x-1 mt-3">
                <button
                  onClick={() => setRightPanelType('formula')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    rightPanelType === 'formula' 
                      ? 'bg-cyan-100 text-cyan-700' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Formula
                </button>
                <button
                  onClick={() => setRightPanelType('metrics')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    rightPanelType === 'metrics' 
                      ? 'bg-cyan-100 text-cyan-700' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Metrics
                </button>
                <button
                  onClick={() => setRightPanelType('query')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    rightPanelType === 'query' 
                      ? 'bg-cyan-100 text-cyan-700' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Query Info
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {rightPanelType === 'formula' && (
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Column Name</label>
                    <input
                      type="text"
                      placeholder="Enter column name"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Formula</label>
                    <textarea
                      value={currentFormula}
                      onChange={(e) => setCurrentFormula(e.target.value)}
                      placeholder="Enter your formula here..."
                      className="w-full h-32 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 font-mono text-sm"
                    />
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-slate-700 mb-2">Available Columns</h5>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {columns.filter(col => col.type !== 'formula').map((col) => (
                        <button
                          key={col.id}
                          onClick={() => setCurrentFormula(prev => prev + `[${col.name}]`)}
                          className="w-full text-left px-2 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded text-sm flex items-center space-x-2"
                        >
                          {getDataTypeIcon(col.type)}
                          <span>{col.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-slate-700 mb-2">Functions</h5>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {sigmaFunctions.map((func) => (
                        <div
                          key={func.name}
                          className="p-2 border border-slate-200 rounded-lg hover:border-cyan-300 cursor-pointer"
                          onClick={() => setCurrentFormula(prev => prev + func.syntax)}
                        >
                          <div className="font-medium text-sm text-slate-900">{func.name}</div>
                          <div className="text-xs text-slate-600 mt-1">{func.description}</div>
                          <div className="text-xs text-cyan-600 mt-1 font-mono">{func.syntax}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200">
                    <button 
                      onClick={() => {
                        setShowRightPanel(false);
                        // Apply formula logic here
                      }}
                      className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Generate Query
                    </button>
                  </div>
                </div>
              )}

              {rightPanelType === 'metrics' && (
                <div className="p-4 space-y-4">
                  <button
                    onClick={() => {
                      setRightPanelType('formula');
                    }}
                    className="w-full px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Metric
                  </button>
                  
                  {/* Sample Metrics Cards */}
                  <div className="space-y-3">
                    <div className="p-3 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-slate-900">Total Sales</h4>
                        <span className="text-lg font-bold text-green-600">$2.4M</span>
                      </div>
                      <p className="text-xs text-slate-600">SUM([Sales])</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-green-600">↗ +12.5%</span>
                        <button className="text-xs text-cyan-600 hover:text-cyan-700">
                          <Code className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-3 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-slate-900">Avg Order Value</h4>
                        <span className="text-lg font-bold text-blue-600">$156</span>
                      </div>
                      <p className="text-xs text-slate-600">AVG([Price] * [Quantity])</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-red-600">↘ -2.1%</span>
                        <button className="text-xs text-cyan-600 hover:text-cyan-700">
                          <Code className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {rightPanelType === 'query' && (
                <div className="p-4 space-y-6">
                  {/* Query Status */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-900">Query Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Status</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-slate-900">{queryInfo.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Request ID</span>
                        <span className="text-sm font-mono text-slate-900">{queryInfo.requestId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Run Time</span>
                        <span className="text-sm text-slate-900">{queryInfo.runTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Rows</span>
                        <span className="text-sm font-medium text-slate-900">{queryInfo.rowCount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-900">Performance</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-slate-600">Query Execution</span>
                          <span className="text-sm text-slate-900">650ms</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-slate-600">Data Transfer</span>
                          <span className="text-sm text-slate-900">238ms</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Source Info */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-900">Data Sources</h4>
                    <div className="space-y-2">
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Database className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-900">Sales Database</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">PostgreSQL • 125K records</p>
                      </div>
                    </div>
                  </div>

                  {/* Browser vs System Calculations */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-900">Calculations</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">System Calculated</span>
                        <span className="text-sm text-green-600 font-medium">8 columns</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Browser Calculated</span>
                        <span className="text-sm text-blue-600 font-medium">3 columns</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Metrics Panel */}
        {showMetricsPanel && (
          <div className="w-80 bg-white border-l border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Metrics</h3>
                <button
                  onClick={() => setShowMetricsPanel(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                <button
                  onClick={() => setShowFormulaBuilder(true)}
                  className="w-full px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Metric
                </button>
                
                {/* Sample Metrics Cards */}
                <div className="space-y-3">
                  {[
                    { name: 'Total Sales', value: '$125,430', trend: '+12.5%', color: 'text-green-600' },
                    { name: 'Avg Order Value', value: '$156.25', trend: '+8.3%', color: 'text-green-600' },
                    { name: 'Customer Count', value: '1,247', trend: '-2.1%', color: 'text-red-600' }
                  ].map((metric, index) => (
                    <div key={index} className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-slate-900">{metric.name}</h4>
                        <div className="flex items-center space-x-1">
                          <button className="p-1 text-slate-400 hover:text-slate-600">
                            <Edit className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this metric? This action cannot be undone.')) {
                                // Delete metric logic
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-slate-900">{metric.value}</div>
                      <div className={`text-xs ${metric.color} flex items-center`}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {metric.trend}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>


      {/* Formula Builder Modal */}
      {showFormulaBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl h-3/4 flex flex-col">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Formula Builder</h3>
                <button
                  onClick={() => setShowFormulaBuilder(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex">
              {/* Functions Panel */}
              <div className="w-1/3 border-r border-slate-200 p-4">
                <h4 className="font-medium text-slate-900 mb-3">Available Functions</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {sigmaFunctions.map((func) => (
                    <div
                      key={func.name}
                      className="p-3 border border-slate-200 rounded-lg hover:border-cyan-300 cursor-pointer"
                      onClick={() => setCurrentFormula(prev => prev + func.syntax)}
                    >
                      <div className="font-medium text-sm text-slate-900">{func.name}</div>
                      <div className="text-xs text-slate-600 mt-1">{func.description}</div>
                      <div className="text-xs text-cyan-600 mt-1 font-mono">{func.syntax}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formula Editor */}
              <div className="flex-1 p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Column Name</label>
                    <input
                      type="text"
                      placeholder="Enter column name"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Formula</label>
                    <textarea
                      value={currentFormula}
                      onChange={(e) => setCurrentFormula(e.target.value)}
                      placeholder="Enter your formula here..."
                      className="w-full h-32 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 font-mono text-sm"
                    />
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-slate-700 mb-2">Available Columns</h5>
                    <div className="flex flex-wrap gap-2">
                      {columns.filter(col => col.type !== 'formula').map((col) => (
                        <button
                          key={col.id}
                          onClick={() => setCurrentFormula(prev => prev + `[${col.name}]`)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-sm"
                        >
                          {col.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-slate-700 mb-2">Preview</h5>
                    <div className="text-sm text-slate-600 font-mono">
                      {currentFormula || 'Enter a formula to see preview'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowFormulaBuilder(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
                Add Column
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Context Menu */}
      {contextMenu && (() => {
        console.log('Rendering context menu at:', contextMenu);
        return (
        <div
          className="fixed bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-2 min-w-48 backdrop-blur-sm"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => addColumnToLeft(contextMenu.columnId)}
            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center"
          >
            <Plus className="w-4 h-4 mr-3" />
            Add Column to Left
          </button>
          
          <button
            onClick={() => addColumnToRight(contextMenu.columnId)}
            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center"
          >
            <Plus className="w-4 h-4 mr-3" />
            Add Column to Right
          </button>
          
          <hr className="my-2" />
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              setDropdownPosition({ x: rect.right + 10, y: rect.top });
              setShowColumnFilter(contextMenu.columnId);
              closeContextMenu();
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center"
          >
            <Filter className="w-4 h-4 mr-3" />
            Filter Column
          </button>
          
          <button
            onClick={() => {
              const column = columns.find(col => col.id === contextMenu.columnId);
              if (column) handleSort(column.name);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center"
          >
            <SortAsc className="w-4 h-4 mr-3" />
            Sort Ascending
          </button>
          
          <button
            onClick={() => {
              const column = columns.find(col => col.id === contextMenu.columnId);
              if (column) handleSort(column.name);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center"
          >
            <SortDesc className="w-4 h-4 mr-3" />
            Sort Descending
          </button>
          
          <hr className="my-2" />
          
          <button
            onClick={() => startEditingColumnName(contextMenu.columnId)}
            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center"
          >
            <Edit className="w-4 h-4 mr-3" />
            Rename Column
          </button>
          
          <button
            onClick={() => {
              const column = columns.find(col => col.id === contextMenu.columnId);
              if (column) {
                setShowDescriptionEdit(contextMenu.columnId);
                setDescriptionValue(columnDescriptions[contextMenu.columnId] || '');
              }
              closeContextMenu();
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center"
          >
            <FileText className="w-4 h-4 mr-3" />
            Set Description
          </button>
          
          <button
            onClick={() => hideColumn(contextMenu.columnId)}
            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center"
          >
            <EyeOff className="w-4 h-4 mr-3" />
            Hide Column
          </button>
          
          <button
            onClick={() => {
              const columnIndex = columns.findIndex(col => col.id === contextMenu.columnId);
              const columnsToFreeze = columns.slice(0, columnIndex + 1).map(col => col.id);
              setFrozenColumns(columnsToFreeze);
              closeContextMenu();
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center"
          >
            <Lock className="w-4 h-4 mr-3" />
            Freeze up to Column
          </button>
          
          <div
            className="relative"
            onMouseEnter={(e) => {
              console.log('Truncate Date area hovered');
              const column = columns.find(col => col.id === contextMenu.columnId);
              console.log('Column found:', column);
              if (column && (column.type === 'Date' || column.type.includes('Date'))) {
                const rect = e.currentTarget.getBoundingClientRect();
                console.log('Container rect:', rect);
                const newPosition = { x: rect.right + 5, y: rect.top };
                console.log('Setting submenu position:', newPosition);
                setSubmenuPosition(newPosition);
                setHoveredMenuItem('truncate-date');
              }
            }}
            onMouseLeave={() => {
              console.log('Truncate Date area left');
              setTimeout(() => {
                setHoveredMenuItem(null);
              }, 150);
            }}
          >
            <button 
              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center justify-between"
              disabled={!columns.find(col => col.id === contextMenu.columnId)?.type.includes('Date')}
            >
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-3" />
                Truncate Date
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div
            className="relative"
            onMouseEnter={(e) => {
              console.log('Format Column area hovered');
              const rect = e.currentTarget.getBoundingClientRect();
              console.log('Container rect:', rect);
              const newPosition = { x: rect.right + 5, y: rect.top };
              console.log('Setting submenu position:', newPosition);
              setSubmenuPosition(newPosition);
              setHoveredMenuItem('format-column');
            }}
            onMouseLeave={() => {
              console.log('Format Column area left');
              setTimeout(() => {
                setHoveredMenuItem(null);
              }, 150);
            }}
          >
            <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center justify-between">
              <div className="flex items-center">
                <Settings className="w-4 h-4 mr-3" />
                Format Column
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={() => {
              setShowColumnDetails(contextMenu.columnId);
              closeContextMenu();
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center"
          >
            <Info className="w-4 h-4 mr-3" />
            Column Details
          </button>
          
          <hr className="my-2" />
          
          <button
            onClick={() => {
              const column = columns.find(col => col.id === contextMenu.columnId);
              if (column) {
                const confirmed = window.confirm(`Are you sure you want to delete the column "${column.name}"? This action cannot be undone.`);
                if (confirmed) {
                  deleteColumn(contextMenu.columnId);
                }
              }
              closeContextMenu();
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 flex items-center text-red-600"
          >
            <Trash2 className="w-4 h-4 mr-3" />
            Delete Column
          </button>
        </div>
        );
      })()}


      {/* Format Submenu */}
      {hoveredMenuItem === 'format-column' && contextMenu && (() => {
        console.log('Rendering Format Submenu', { hoveredMenuItem, contextMenu, submenuPosition });
        const column = columns.find(col => col.id === contextMenu.columnId);
        if (!column) return null;
        
        return (
          <div
            data-submenu="format-column"
            className="fixed bg-white border border-slate-200 rounded-lg shadow-lg z-[60] py-1 min-w-48 backdrop-blur-sm"
            style={{
              left: submenuPosition.x,
              top: submenuPosition.y,
            }}
            onMouseEnter={() => {
              console.log('Format submenu entered');
              setHoveredMenuItem('format-column');
            }}
            onMouseLeave={() => {
              console.log('Format submenu left');
              setHoveredMenuItem(null);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => {
                setColumnFormats(prev => ({
                  ...prev,
                  [column.id]: { type: 'currency', currency: 'USD', decimals: 2 }
                }));
                setHoveredMenuItem(null);
                closeContextMenu();
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition-colors flex items-center"
            >
              <DollarSign className="w-4 h-4 mr-3" />
              Currency ($)
            </button>
            <button 
              onClick={() => {
                setColumnFormats(prev => ({
                  ...prev,
                  [column.id]: { type: 'percentage', decimals: 1 }
                }));
                setHoveredMenuItem(null);
                closeContextMenu();
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition-colors flex items-center"
            >
              <Percent className="w-4 h-4 mr-3" />
              Percentage (%)
            </button>
            <button 
              onClick={() => {
                setColumnFormats(prev => ({
                  ...prev,
                  [column.id]: { type: 'decimal', decimals: 2 }
                }));
                setHoveredMenuItem(null);
                closeContextMenu();
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition-colors flex items-center"
            >
              <Hash className="w-4 h-4 mr-3" />
              Number (.00)
            </button>
            <button 
              onClick={() => {
                setColumnFormats(prev => ({
                  ...prev,
                  [column.id]: { type: 'decimal', decimals: 0 }
                }));
                setHoveredMenuItem(null);
                closeContextMenu();
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition-colors flex items-center"
            >
              <Hash className="w-4 h-4 mr-3" />
              Number (123)
            </button>
            <button 
              onClick={() => {
                setColumns(prev => prev.map(col => 
                  col.id === column.id ? { ...col, type: 'Text' } : col
                ));
                setHoveredMenuItem(null);
                closeContextMenu();
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition-colors flex items-center"
            >
              <Type className="w-4 h-4 mr-3" />
              Text (abc)
            </button>
            <button 
              onClick={() => {
                setColumns(prev => prev.map(col => 
                  col.id === column.id ? { ...col, type: 'Date' } : col
                ));
                setHoveredMenuItem(null);
                closeContextMenu();
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition-colors flex items-center"
            >
              <Calendar className="w-4 h-4 mr-3" />
              Date
            </button>
          </div>
        );
      })()}

      {/* Truncate Date Submenu */}
      {hoveredMenuItem === 'truncate-date' && contextMenu && (() => {
        console.log('Rendering Truncate Date Submenu', { hoveredMenuItem, contextMenu, submenuPosition });
        const column = columns.find(col => col.id === contextMenu.columnId);
        if (!column || column.type !== 'Date') return null;
        
        return (
          <div
            data-submenu="truncate-date"
            className="fixed bg-white border border-slate-200 rounded-lg shadow-lg z-[60] py-1 min-w-48 backdrop-blur-sm"
            style={{
              left: submenuPosition.x,
              top: submenuPosition.y,
            }}
            onMouseEnter={() => {
              console.log('Truncate submenu entered');
              setHoveredMenuItem('truncate-date');
            }}
            onMouseLeave={() => {
              console.log('Truncate submenu left');
              setHoveredMenuItem(null);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {['Year', 'Quarter', 'Month', 'Week', 'Day', 'Hour', 'Minute', 'Second'].map((period) => (
              <button
                key={period}
                onClick={() => {
                  // Apply date truncation logic here
                  console.log(`Truncating ${column.name} to ${period}`);
                  setHoveredMenuItem(null);
                  closeContextMenu();
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition-colors"
              >
                {period}
              </button>
            ))}
          </div>
        );
      })()}

      {/* Column Details Modal */}
      {showColumnDetails && (() => {
        const column = columns.find(col => col.id === showColumnDetails);
        if (!column) return null;
        
        const columnData = processedData.map(row => row[column.name]).filter(val => val !== null && val !== undefined);
        const numericData = columnData.filter(val => typeof val === 'number');
        
        const stats = {
          total: columnData.length,
          nulls: processedData.length - columnData.length,
          distinct: new Set(columnData).size,
          sum: numericData.reduce((acc, val) => acc + val, 0),
          min: numericData.length > 0 ? Math.min(...numericData) : 0,
          max: numericData.length > 0 ? Math.max(...numericData) : 0,
          avg: numericData.length > 0 ? numericData.reduce((acc, val) => acc + val, 0) / numericData.length : 0,
          median: numericData.length > 0 ? numericData.sort((a, b) => a - b)[Math.floor(numericData.length / 2)] : 0,
          percentile25: numericData.length > 0 ? numericData.sort((a, b) => a - b)[Math.floor(numericData.length * 0.25)] : 0,
          percentile75: numericData.length > 0 ? numericData.sort((a, b) => a - b)[Math.floor(numericData.length * 0.75)] : 0,
          stdDev: numericData.length > 0 ? Math.sqrt(numericData.reduce((acc, val) => acc + Math.pow(val - (numericData.reduce((a, b) => a + b, 0) / numericData.length), 2), 0) / numericData.length) : 0
        };
        
        const topValues = Object.entries(
          columnData.reduce((acc: Record<string, number>, val) => {
            const key = String(val);
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {})
        ).sort(([,a], [,b]) => (b as number) - (a as number)).slice(0, 10);
        
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl h-3/4 flex flex-col">
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
              
              <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - About */}
                <div className="w-1/2 p-6 border-r border-slate-200 overflow-y-auto">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-slate-900 mb-3">ABOUT</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {getDataTypeIcon(column.type)}
                          <span className="font-medium">{column.name}</span>
                        </div>
                        {column.formula && (
                          <div className="text-sm text-slate-600 font-mono bg-slate-50 p-2 rounded">
                            {column.formula}
                          </div>
                        )}
                        {columnDescriptions[column.id] && (
                          <p className="text-sm text-slate-600">{columnDescriptions[column.id]}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-slate-900 mb-3">TOP VALUES</h4>
                      <div className="space-y-2">
                        {topValues.map(([value, count], index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 bg-slate-200 rounded"></div>
                              <span className="text-sm">{String(value)}</span>
                            </div>
                            <span className="text-sm text-slate-500">{String(count)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Panel - Summary */}
                <div className="w-1/2 p-6 overflow-y-auto">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-slate-900 mb-3">SUMMARY</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Values</span>
                          <span className="text-sm font-medium">{((stats.total / processedData.length) * 100).toFixed(1)}%</span>
                          <span className="text-sm text-slate-500">{stats.total.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Nulls</span>
                          <span className="text-sm font-medium">{((stats.nulls / processedData.length) * 100).toFixed(1)}%</span>
                          <span className="text-sm text-slate-500">{stats.nulls}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Row count</span>
                          <span className="text-sm font-medium">100.0%</span>
                          <span className="text-sm text-slate-500">{processedData.length.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Distinct values</span>
                          <span className="text-sm font-medium">{((stats.distinct / stats.total) * 100).toFixed(1)}%</span>
                          <span className="text-sm text-slate-500">{stats.distinct.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {numericData.length > 0 && (
                      <div>
                        <h4 className="font-medium text-slate-900 mb-3">STATISTICS</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600">Sum</span>
                            <span className="text-sm font-medium">{formatNumber(stats.sum)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600">Minimum</span>
                            <span className="text-sm font-medium">{formatNumber(stats.min)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600">25th percentile</span>
                            <span className="text-sm font-medium">{formatNumber(stats.percentile25)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600">Median</span>
                            <span className="text-sm font-medium">{formatNumber(stats.median)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600">75th percentile</span>
                            <span className="text-sm font-medium">{formatNumber(stats.percentile75)}</span>
                          </div>
                          
                          <div className="flex justify-between border-b border-slate-200 pb-2">
                            <span className="text-sm text-slate-600 font-medium">Maximum</span>
                            <span className="text-sm font-bold">{formatNumber(stats.max)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600">Average</span>
                            <span className="text-sm font-medium">{formatNumber(stats.avg)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600">Standard deviation</span>
                            <span className="text-sm font-medium">{formatNumber(stats.stdDev)}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600">Variance</span>
                            <span className="text-sm font-medium">{formatNumber(stats.stdDev * stats.stdDev)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}



      {/* Column-Specific Filter Dropdown */}
      {showColumnFilter && (() => {
        const column = columns.find(col => col.id === showColumnFilter);
        if (!column) return null;
        
        // Get unique values for this column
        const columnData = processedData.map(row => row[column.name]).filter(val => val !== null && val !== undefined);
        const uniqueValues = Array.from(new Set(columnData)).slice(0, 10); // Show top 10 values
        
        return (
          <div
            className="fixed bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-2 min-w-64 max-w-80 backdrop-blur-sm"
            style={{
              left: dropdownPosition.x,
              top: dropdownPosition.y,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-2 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                {getDataTypeIcon(column.type)}
                <h3 className="text-sm font-semibold text-slate-900">Filter: {column.name}</h3>
              </div>
            </div>
            
            <div className="p-3">
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Search values..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              
              <div className="space-y-1 max-h-48 overflow-y-auto">
                <label className="flex items-center space-x-2 text-sm p-2 hover:bg-slate-50 rounded">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="font-medium">All</span>
                  <span className="text-slate-500 ml-auto">{columnData.length}</span>
                </label>
                
                {uniqueValues.map((value, index) => {
                  const count = columnData.filter(v => v === value).length;
                  return (
                    <label key={index} className="flex items-center space-x-2 text-sm p-2 hover:bg-slate-50 rounded">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span>{String(value)}</span>
                      <span className="text-slate-500 ml-auto">{count}</span>
                    </label>
                  );
                })}
                
                {uniqueValues.length === 10 && (
                  <div className="text-xs text-slate-500 p-2 text-center">
                    Showing top 10 values...
                  </div>
                )}
              </div>
            </div>
            
            <div className="px-3 pb-3 pt-2 border-t border-slate-200 flex justify-end space-x-2">
              <button
                onClick={() => setShowColumnFilter(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Apply filter logic here
                  setShowColumnFilter(null);
                }}
                className="px-3 py-1.5 text-xs bg-cyan-500 hover:bg-cyan-600 text-white rounded transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        );
      })()}

      {/* Description Edit Modal */}
      {showDescriptionEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Set Description</h3>
              <button
                onClick={() => setShowDescriptionEdit(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={descriptionValue}
                  onChange={(e) => setDescriptionValue(e.target.value)}
                  placeholder="Enter column description..."
                  className="w-full h-24 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDescriptionEdit(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (showDescriptionEdit) {
                    setColumnDescriptions(prev => ({
                      ...prev,
                      [showDescriptionEdit]: descriptionValue
                    }));
                  }
                  setShowDescriptionEdit(null);
                  setDescriptionValue('');
                }}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters Panel */}
      {showFiltersPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl h-3/4 flex flex-col">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Filters & Controls</h3>
                <button
                  onClick={() => setShowFiltersPanel(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-slate-900">FILTERS</h4>
                    <button className="p-2 hover:bg-slate-100 rounded-lg">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {columns.filter(col => col.visible).map((column) => (
                    <div key={column.id} className="mb-4 p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getDataTypeIcon(column.type)}
                          <span className="font-medium text-sm">{column.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-slate-400 hover:text-slate-600">
                            <Settings className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                          <option value="">Select values</option>
                          <option value="all">All</option>
                          <option value="null">null</option>
                        </select>
                        
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {/* Sample filter values */}
                          <label className="flex items-center space-x-2 text-sm">
                            <input type="checkbox" className="rounded" />
                            <span>All</span>
                            <span className="text-slate-500 ml-auto">4,584,628</span>
                          </label>
                          <label className="flex items-center space-x-2 text-sm">
                            <input type="checkbox" className="rounded" />
                            <span>West</span>
                            <span className="text-slate-500 ml-auto">1,171,653</span>
                          </label>
                          <label className="flex items-center space-x-2 text-sm">
                            <input type="checkbox" className="rounded" />
                            <span>Midwest</span>
                            <span className="text-slate-500 ml-auto">1,002,421</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowFiltersPanel(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Columns Panel */}
      {showHiddenColumns && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Hidden Columns</h3>
              <button
                onClick={() => setShowHiddenColumns(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {columns.filter(col => !col.visible).map((column) => (
                <div key={column.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    {getDataTypeIcon(column.type)}
                    <span className="text-sm font-medium">{column.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      setColumns(prev => prev.map(col => 
                        col.id === column.id ? { ...col, visible: true } : col
                      ));
                    }}
                    className="px-3 py-1 bg-cyan-500 hover:bg-cyan-600 text-white rounded text-sm"
                  >
                    Show
                  </button>
                </div>
              ))}
            </div>
            
            {columns.filter(col => !col.visible).length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No hidden columns</p>
            )}
          </div>
        </div>
      )}

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-slate-900/10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl h-3/4 flex flex-col">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Join Data Source</h3>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 flex overflow-hidden">
              {/* Data Source Selection */}
              <div className="w-1/2 border-r border-slate-200 p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">1. Select Data Source</h4>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search data sources..."
                        className="w-full px-3 py-2 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      />
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    <div className="p-3 border border-slate-200 rounded-lg hover:border-cyan-300 cursor-pointer transition-colors">
                      <div className="flex items-center space-x-3">
                        <Database className="w-5 h-5 text-blue-600" />
                        <div>
                          <h5 className="font-medium text-slate-900">Sales Database</h5>
                          <p className="text-xs text-slate-600">PostgreSQL • 3 tables</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 border border-slate-200 rounded-lg hover:border-cyan-300 cursor-pointer transition-colors">
                      <div className="flex items-center space-x-3">
                        <Database className="w-5 h-5 text-green-600" />
                        <div>
                          <h5 className="font-medium text-slate-900">Inventory System</h5>
                          <p className="text-xs text-slate-600">MySQL • 5 tables</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 border border-slate-200 rounded-lg hover:border-cyan-300 cursor-pointer transition-colors">
                      <div className="flex items-center space-x-3">
                        <Database className="w-5 h-5 text-purple-600" />
                        <div>
                          <h5 className="font-medium text-slate-900">Customer Analytics</h5>
                          <p className="text-xs text-slate-600">Snowflake • 8 tables</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">2. Select Table</h4>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search tables..."
                        className="w-full px-3 py-2 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      />
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    <div className="p-2 border border-slate-200 rounded-lg hover:border-cyan-300 cursor-pointer transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-900">orders</span>
                        </div>
                        <span className="text-xs text-slate-500">45K rows</span>
                      </div>
                    </div>
                    
                    <div className="p-2 border border-slate-200 rounded-lg hover:border-cyan-300 cursor-pointer transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-900">products</span>
                        </div>
                        <span className="text-xs text-slate-500">1.2K rows</span>
                      </div>
                    </div>
                    
                    <div className="p-2 border border-slate-200 rounded-lg hover:border-cyan-300 cursor-pointer transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-900">customers</span>
                        </div>
                        <span className="text-xs text-slate-500">15K rows</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Join Configuration */}
              <div className="w-1/2 p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-900">3. Configure Join</h4>
                    <button 
                      className="p-2 text-slate-400 hover:text-cyan-600 transition-colors"
                      title="Show Generated Query"
                    >
                      <Code className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Join Type</label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
                      <option value="left">Left Outer Join</option>
                      <option value="inner">Inner Join</option>
                      <option value="right">Right Outer Join</option>
                      <option value="full">Full Outer Join</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Join Keys</label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <select className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
                          <option value="">Select column from current table</option>
                          {columns.map(col => (
                            <option key={col.id} value={col.name}>{col.name}</option>
                          ))}
                        </select>
                        <span className="text-slate-500">=</span>
                        <select className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
                          <option value="">Select column from joined table</option>
                          <option value="sku_number">Sku Number</option>
                          <option value="product_key">Product Key</option>
                          <option value="customer_id">Customer ID</option>
                          <option value="order_id">Order ID</option>
                        </select>
                      </div>
                      
                      <button className="text-cyan-600 hover:text-cyan-700 text-sm flex items-center">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Join Condition
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-slate-900">Join Preview</h5>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-slate-600">Valid</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Matched records</span>
                        <span className="text-sm font-medium text-green-600">1,096</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Unmatched records</span>
                        <span className="text-sm font-medium text-red-600">0</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Expected output rows</span>
                        <span className="text-sm font-medium text-slate-900">1,096</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-medium text-slate-900 mb-2">Generated SQL</h5>
                    <div className="bg-slate-900 rounded p-3 text-xs font-mono text-green-400">
                      SELECT * FROM current_table ct<br/>
                      LEFT JOIN selected_table st<br/>
                      ON ct.column = st.column
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowJoinModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
                Preview Output
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-slate-900/10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Share View</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Share with
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input type="radio" name="shareType" value="members" className="text-cyan-600" defaultChecked />
                      <Users className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-700">Specific Members</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="radio" name="shareType" value="team" className="text-cyan-600" />
                      <Shield className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-700">Team</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="radio" name="shareType" value="all" className="text-cyan-600" />
                      <Globe className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-700">All Users</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email addresses (comma separated)
                  </label>
                  <textarea
                    placeholder="user1@company.com, user2@company.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Permission Level
                  </label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
                    <option value="view">View Only</option>
                    <option value="edit">Can Edit</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
                Share View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showVersionHistory && (
        <div className="fixed inset-0 backdrop-blur-md bg-slate-900/10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <History className="w-5 h-5 text-cyan-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Version History</h3>
                </div>
                <button
                  onClick={() => setShowVersionHistory(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-600 mt-1">View history for: {currentViewName}</p>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="space-y-4">
                {versionHistory.map((version, _index) => (
                  <div key={version.id} className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-cyan-700">{version.version}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-slate-900">{version.version}</h4>
                        <span className="text-xs text-slate-500">{version.timestamp}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{version.description}</p>
                      <p className="text-xs text-slate-500 mt-1">by {version.author}</p>
                    </div>
                    <div className="flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() => {
                          // Add version restore functionality
                          alert(`Restoring to ${version.version}`);
                          setShowVersionHistory(false);
                        }}
                        className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => {
                          // Add version compare functionality
                          alert(`Comparing with ${version.version}`);
                        }}
                        className="px-3 py-1 text-xs bg-cyan-100 hover:bg-cyan-200 text-cyan-700 rounded transition-colors"
                      >
                        Compare
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-200 flex justify-between">
              <button
                onClick={() => {
                  // Add new version functionality
                  const newVersion = {
                    id: versionHistory.length + 1,
                    version: `v1.${versionHistory.length}`,
                    timestamp: new Date().toLocaleString(),
                    author: 'Current User',
                    description: 'Manual version save'
                  };
                  setVersionHistory(prev => [newVersion, ...prev]);
                  alert('New version created');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                Create New Version
              </button>
              <button
                onClick={() => setShowVersionHistory(false)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SQL Modal */}
      {showSQLModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-slate-900/10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Code className="w-5 h-5 text-cyan-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Generated SQL Query</h3>
                </div>
                <button
                  onClick={() => setShowSQLModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-600 mt-1">SQL query for: {currentViewName}</p>
            </div>
            
            <div className="p-6">
              <div className="bg-slate-900 rounded-lg p-4 mb-4 overflow-x-auto">
                <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
{`SELECT 
    store_region,
    brand,
    order_number,
    month_of_date,
    sku_number,
    quantity,
    cost,
    price,
    (price * quantity) AS sales,
    cogs,
    (sales - cogs) AS profit
FROM sales_database.retail_schema.orders o
LEFT JOIN sales_database.retail_schema.products p 
    ON o.sku_number = p.sku_number
WHERE o.created_date >= '2021-01-01'
    AND o.status = 'completed'
ORDER BY o.order_date DESC;`}
                </pre>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Query validated</span>
                  </div>
                  <span>Estimated rows: 125,000</span>
                  <span>Estimated runtime: ~2.3s</span>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Copy
                  </button>
                  <button className="px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center">
                    <Play className="w-4 h-4 mr-2" />
                    Execute
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save View Modal */}
      {showSaveViewModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-slate-900/10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Save View</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    View Name
                  </label>
                  <input
                    type="text"
                    value={saveViewName}
                    onChange={(e) => setSaveViewName(e.target.value)}
                    placeholder="Enter view name..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    autoFocus
                  />
                </div>
                <div className="text-sm text-slate-600">
                  This view will be saved to the Views menu and can be accessed later.
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowSaveViewModal(false);
                  setSaveViewName('');
                }}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveView}
                disabled={!saveViewName.trim()}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
