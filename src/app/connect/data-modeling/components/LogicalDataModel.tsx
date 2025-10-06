'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Table, Plus, Link, Trash2, Settings, ChevronDown, ChevronRight, Key, ExternalLink, ZoomIn, ZoomOut, RotateCcw, Save, Database, Search, X, Play, ArrowRight } from 'lucide-react';
import { getDataTypeIcon } from '../utils/dataTypeIcons';

interface Column {
  name: string;
  type: 'Text' | 'Number' | 'Date' | 'Logical' | 'Variant' | 'Geography';
  nullable: boolean;
  primaryKey?: boolean;
  foreignKey?: boolean;
  description?: string;
}

interface TableNode {
  id: string;
  name: string;
  x: number;
  y: number;
  columns: Column[];
  expanded: boolean;
  selected?: boolean;
}

interface Relationship {
  id: string;
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type: 'inner' | 'left' | 'right' | 'full' | 'cross';
  joinType: 'one-to-one' | 'one-to-many' | 'many-to-many';
  name?: string;
  conditions?: JoinCondition[];
}

interface JoinCondition {
  id: string;
  leftColumn: string;
  operator: '=' | '!=' | '<' | '>' | '<=' | '>=' | 'LIKE' | 'IN';
  rightColumn: string;
}

interface ConnectionPoint {
  tableId: string;
  columnName: string;
  x: number;
  y: number;
}

export default function LogicalDataModel() {
  const [tables, setTables] = useState<TableNode[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);

  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [draggedTable, setDraggedTable] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [showTableSelector, setShowTableSelector] = useState(false);
  const [showJoinBuilder, setShowJoinBuilder] = useState(false);
  const [showPreviewOutput, setShowPreviewOutput] = useState(false);
  const [showSaveModel, setShowSaveModel] = useState(false);
  const [currentJoin, setCurrentJoin] = useState<Partial<Relationship>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJoinType, setSelectedJoinType] = useState<'inner' | 'left' | 'right' | 'full' | 'cross'>('left');
  const [joinConditions, setJoinConditions] = useState<JoinCondition[]>([]);
  const [modelName, setModelName] = useState('');
  const [pendingConnection, setPendingConnection] = useState<ConnectionPoint | null>(null);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [showTableSettings, setShowTableSettings] = useState<string | null>(null);
  const [selectedTablesForAdd, setSelectedTablesForAdd] = useState<string[]>([]);
  const [showSQL, setShowSQL] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);


  const getRelationshipIcon = (joinType: string) => {
    switch (joinType) {
      case 'one-to-one':
        return '1:1';
      case 'one-to-many':
        return '1:N';
      case 'many-to-many':
        return 'N:N';
      default:
        return '1:N';
    }
  };

  const getJoinTypeIcon = (type: string) => {
    switch (type) {
      case 'inner':
        return '⋈';
      case 'left':
        return '⟕';
      case 'right':
        return '⟖';
      case 'full':
        return '⟗';
      case 'cross':
        return '×';
      default:
        return '⟕';
    }
  };

  const handleTableMouseDown = (e: React.MouseEvent, tableId: string) => {
    if (e.button !== 0) return; // Only handle left click
    
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDraggedTable(tableId);
    setDragOffset({
      x: (e.clientX - rect.left) / zoom - panOffset.x - table.x,
      y: (e.clientY - rect.top) / zoom - panOffset.y - table.y
    });

    // Select table
    if (!selectedTables.includes(tableId)) {
      if (e.ctrlKey || e.metaKey) {
        setSelectedTables(prev => [...prev, tableId]);
      } else {
        setSelectedTables([tableId]);
      }
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (draggedTable && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = (e.clientX - rect.left) / zoom - panOffset.x - dragOffset.x;
      const newY = (e.clientY - rect.top) / zoom - panOffset.y - dragOffset.y;

      setTables(prev => prev.map(table => 
        table.id === draggedTable 
          ? { ...table, x: Math.max(0, newX), y: Math.max(0, newY) }
          : table
      ));
    } else if (isPanning && canvasRef.current) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      
      setPanOffset(prev => ({
        x: prev.x + deltaX / zoom,
        y: prev.y + deltaY / zoom
      }));
      
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [draggedTable, dragOffset, zoom, panOffset, isPanning, lastPanPoint]);

  const handleMouseUp = useCallback(() => {
    setDraggedTable(null);
    setIsPanning(false);
  }, []);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) { // Middle click or Alt+click for panning
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    } else if (e.button === 0 && e.target === e.currentTarget) {
      // Clear selection when clicking on empty canvas
      setSelectedTables([]);
      // Close any open settings menus
      setShowTableSettings(null);
    }
  };

  const handleZoom = (delta: number, centerX?: number, centerY?: number) => {
    const newZoom = Math.max(0.25, Math.min(2, zoom + delta));
    if (newZoom !== zoom) {
      if (centerX !== undefined && centerY !== undefined && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = (centerX - rect.left) / zoom - panOffset.x;
        const mouseY = (centerY - rect.top) / zoom - panOffset.y;
        
        setPanOffset(prev => ({
          x: prev.x + mouseX * (1 - newZoom / zoom),
          y: prev.y + mouseY * (1 - newZoom / zoom)
        }));
      }
      setZoom(newZoom);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    handleZoom(delta, e.clientX, e.clientY);
  };

  const resetView = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const removeTable = (tableId: string) => {
    // Remove the table
    setTables(prev => prev.filter(table => table.id !== tableId));
    
    // Remove any relationships involving this table
    const tableToRemove = tables.find(t => t.id === tableId);
    if (tableToRemove) {
      setRelationships(prev => prev.filter(rel => 
        rel.fromTable !== tableToRemove.name && rel.toTable !== tableToRemove.name
      ));
    }
    
    // Close settings menu
    setShowTableSettings(null);
  };

  const copyTable = (tableId: string) => {
    const tableToCopy = tables.find(t => t.id === tableId);
    if (tableToCopy) {
      const newTable: TableNode = {
        ...tableToCopy,
        id: (Math.max(...tables.map(t => parseInt(t.id)), 0) + 1).toString(),
        name: `${tableToCopy.name}_copy`,
        x: tableToCopy.x + 50,
        y: tableToCopy.y + 50,
        expanded: false // Start copies as collapsed
      };
      setTables(prev => [...prev, newTable]);
    }
    
    // Close settings menu
    setShowTableSettings(null);
  };

  const generateSQL = () => {
    if (tables.length === 0) return 'SELECT 1 as placeholder;';
    
    if (relationships.length === 0) {
      // No joins, just select from first table
      const firstTable = tables[0];
      const columns = firstTable.columns.map(col => `${firstTable.name}.${col.name}`).join(',\n    ');
      return `SELECT\n    ${columns}\nFROM ${firstTable.name};`;
    }
    
    // Build SQL with joins
    const mainTable = tables[0];
    let sql = 'SELECT\n';
    
    // Add all columns from all tables
    const allColumns = tables.flatMap(table => 
      table.columns.map(col => `    ${table.name}.${col.name}`)
    ).join(',\n');
    
    sql += allColumns + '\n';
    sql += `FROM ${mainTable.name}`;
    
    // Add joins
    relationships.forEach(rel => {
      const joinType = rel.type.toUpperCase();
      sql += `\n${joinType} JOIN ${rel.toTable}`;
      
      if (rel.conditions && rel.conditions.length > 0) {
        const conditions = rel.conditions.map(cond => 
          `${rel.fromTable}.${cond.leftColumn} ${cond.operator} ${rel.toTable}.${cond.rightColumn}`
        ).join(' AND ');
        sql += ` ON ${conditions}`;
      } else {
        sql += ` ON ${rel.fromTable}.${rel.fromColumn} = ${rel.toTable}.${rel.toColumn}`;
      }
    });
    
    sql += ';';
    return sql;
  };

  // Sample data sources (in a real app, this would come from props or context)
  const availableDataSources = [
    {
      id: '1',
      name: 'Sales Database',
      tables: [
        {
          id: 'customers',
          name: 'customers',
          columns: [
            { name: 'id', type: 'Number' as const, nullable: false, primaryKey: true, description: 'Customer ID' },
            { name: 'first_name', type: 'Text' as const, nullable: false, description: 'First name' },
            { name: 'last_name', type: 'Text' as const, nullable: false, description: 'Last name' },
            { name: 'email', type: 'Text' as const, nullable: false, description: 'Email address' },
            { name: 'created_at', type: 'Date' as const, nullable: false, description: 'Creation date' },
          ]
        },
        {
          id: 'orders',
          name: 'orders',
          columns: [
            { name: 'id', type: 'Number' as const, nullable: false, primaryKey: true, description: 'Order ID' },
            { name: 'customer_id', type: 'Number' as const, nullable: false, foreignKey: true, description: 'Customer reference' },
            { name: 'order_date', type: 'Date' as const, nullable: false, description: 'Order date' },
            { name: 'total_amount', type: 'Number' as const, nullable: false, description: 'Total amount' },
            { name: 'status', type: 'Text' as const, nullable: false, description: 'Order status' },
          ]
        },
        {
          id: 'products',
          name: 'products',
          columns: [
            { name: 'id', type: 'Number' as const, nullable: false, primaryKey: true, description: 'Product ID' },
            { name: 'name', type: 'Text' as const, nullable: false, description: 'Product name' },
            { name: 'price', type: 'Number' as const, nullable: false, description: 'Product price' },
            { name: 'category', type: 'Text' as const, nullable: false, description: 'Product category' },
            { name: 'in_stock', type: 'Logical' as const, nullable: false, description: 'Stock status' },
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Analytics Database',
      tables: [
        {
          id: 'events',
          name: 'events',
          columns: [
            { name: 'id', type: 'Number' as const, nullable: false, primaryKey: true, description: 'Event ID' },
            { name: 'user_id', type: 'Number' as const, nullable: false, foreignKey: true, description: 'User reference' },
            { name: 'event_type', type: 'Text' as const, nullable: false, description: 'Event type' },
            { name: 'timestamp', type: 'Date' as const, nullable: false, description: 'Event timestamp' },
            { name: 'properties', type: 'Variant' as const, nullable: true, description: 'Event properties' },
          ]
        },
        {
          id: 'user_sessions',
          name: 'user_sessions',
          columns: [
            { name: 'id', type: 'Number' as const, nullable: false, primaryKey: true, description: 'Session ID' },
            { name: 'user_id', type: 'Number' as const, nullable: false, foreignKey: true, description: 'User reference' },
            { name: 'start_time', type: 'Date' as const, nullable: false, description: 'Session start' },
            { name: 'end_time', type: 'Date' as const, nullable: true, description: 'Session end' },
            { name: 'location', type: 'Geography' as const, nullable: true, description: 'User location' },
          ]
        }
      ]
    }
  ];

  const addTableFromDataSource = (_dataSourceId: string, _tableId: string) => {
    const dataSource = availableDataSources.find(ds => ds.id === _dataSourceId);
    const sourceTable = dataSource?.tables.find(t => t.id === _tableId);
    
    if (sourceTable) {
      const newTable: TableNode = {
        id: (tables.length + 1).toString(),
        name: sourceTable.name,
        x: 200 + (tables.length * 50),
        y: 200 + (tables.length * 50),
        expanded: false, // New tables start collapsed
        columns: sourceTable.columns
      };
      setTables([...tables, newTable]);
    }
  };

  const addSelectedTables = () => {
    const newTables: TableNode[] = [];
    let currentTableCount = tables.length;
    
    selectedTablesForAdd.forEach((tableKey) => {
      const [dataSourceId, tableId] = tableKey.split('|');
      const dataSource = availableDataSources.find(ds => ds.id === dataSourceId);
      const sourceTable = dataSource?.tables.find(t => t.id === tableId);
      
      if (sourceTable) {
        const newTable: TableNode = {
          id: (currentTableCount + 1).toString(),
          name: sourceTable.name,
          x: 200 + (currentTableCount * 80),
          y: 200 + (Math.floor(currentTableCount / 3) * 150),
          expanded: false,
          columns: sourceTable.columns
        };
        newTables.push(newTable);
        currentTableCount++;
      }
    });
    
    setTables(prev => [...prev, ...newTables]);
    setSelectedTablesForAdd([]);
    setShowTableSelector(false);
  };

  const toggleTableSelection = (dataSourceId: string, tableId: string) => {
    const tableKey = `${dataSourceId}|${tableId}`;
    setSelectedTablesForAdd(prev => 
      prev.includes(tableKey) 
        ? prev.filter(key => key !== tableKey)
        : [...prev, tableKey]
    );
  };

  const toggleTableExpansion = (tableId: string) => {
    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { ...table, expanded: !table.expanded }
        : table
    ));
  };

  const handleColumnClick = (tableId: string, columnName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const table = tables.find(t => t.id === tableId);
    const column = table?.columns.find(c => c.name === columnName);
    
    if (!column?.foreignKey && !column?.primaryKey) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const connectionPoint: ConnectionPoint = {
      tableId,
      columnName,
      x: (e.clientX - rect.left) / zoom - panOffset.x,
      y: (e.clientY - rect.top) / zoom - panOffset.y
    };

    if (pendingConnection) {
      // Create relationship
      const newRelationship: Relationship = {
        id: Date.now().toString(),
        fromTable: pendingConnection.tableId,
        fromColumn: pendingConnection.columnName,
        toTable: tableId,
        toColumn: columnName,
        type: 'left',
        joinType: 'one-to-many',
        name: `${pendingConnection.tableId} → ${tableId}`
      };
      
      setRelationships(prev => [...prev, newRelationship]);
      setPendingConnection(null);
    } else {
      setPendingConnection(connectionPoint);
    }
  };

  const renderRelationshipLine = (relationship: Relationship) => {
    const fromTable = tables.find(t => t.name === relationship.fromTable);
    const toTable = tables.find(t => t.name === relationship.toTable);
    
    if (!fromTable || !toTable) {
      return null;
    }

    // Calculate connection points based on table state (expanded or collapsed)
    const fromTableHeight = fromTable.expanded ? 40 + (fromTable.columns.length * 28) : 80; // Header + columns or header + preview
    const toTableHeight = toTable.expanded ? 40 + (toTable.columns.length * 28) : 80;
    
    // For collapsed tables, connect to the center-right and center-left
    const fromX = fromTable.x + 280; // Right edge of table
    const fromY = fromTable.expanded 
      ? fromTable.y + 40 + (fromTable.columns.findIndex(c => c.name === relationship.fromColumn) * 28) + 14
      : fromTable.y + fromTableHeight / 2; // Center of collapsed table
      
    const toX = toTable.x; // Left edge of table
    const toY = toTable.expanded 
      ? toTable.y + 40 + (toTable.columns.findIndex(c => c.name === relationship.toColumn) * 28) + 14
      : toTable.y + toTableHeight / 2; // Center of collapsed table

    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    
    // Generate tooltip content for join conditions
    const joinConditionsText = relationship.conditions?.map(condition => 
      `${relationship.fromTable}.${condition.leftColumn} ${condition.operator} ${relationship.toTable}.${condition.rightColumn}`
    ).join(' AND ') || `${relationship.fromTable}.${relationship.fromColumn} = ${relationship.toTable}.${relationship.toColumn}`;
    
    return (
      <g key={relationship.id} className="relationship-line group">
        {/* Main relationship path */}
        <path
          d={`M ${fromX} ${fromY} C ${midX} ${fromY} ${midX} ${toY} ${toX} ${toY}`}
          stroke="#3b82f6"
          strokeWidth="3"
          fill="none"
          className="hover:stroke-cyan-500 transition-all duration-200 cursor-pointer"
          strokeDasharray="0"
        />
        
        {/* Hover area for better interaction */}
        <path
          d={`M ${fromX} ${fromY} C ${midX} ${fromY} ${midX} ${toY} ${toX} ${toY}`}
          stroke="transparent"
          strokeWidth="12"
          fill="none"
          className="cursor-pointer"
        >
          <title>{`${relationship.name || 'Join'}\nType: ${relationship.type.toUpperCase()} JOIN\nCondition: ${joinConditionsText}`}</title>
        </path>
        
        {/* Lineage node in the middle */}
        <g className="lineage-node">
          {/* Node background - larger to accommodate more info */}
          <rect
            x={midX - 40}
            y={midY - 20}
            width="80"
            height="40"
            rx="8"
            fill="white"
            stroke="#3b82f6"
            strokeWidth="2"
            className="group-hover:fill-cyan-50 group-hover:stroke-cyan-500 transition-all duration-200 cursor-pointer drop-shadow-lg"
          />
          
          {/* Join type icon and text */}
          <text
            x={midX}
            y={midY - 5}
            textAnchor="middle"
            className="text-xs fill-slate-700 font-bold pointer-events-none select-none"
            style={{ fontSize: '10px' }}
          >
            {getJoinTypeIcon(relationship.type)} {relationship.type.toUpperCase()}
          </text>
          
          {/* Join keys */}
          <text
            x={midX}
            y={midY + 8}
            textAnchor="middle"
            className="text-xs fill-slate-600 pointer-events-none select-none"
            style={{ fontSize: '8px' }}
          >
            {relationship.fromColumn} = {relationship.toColumn}
          </text>
          
          {/* Enhanced hover tooltip */}
          <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            {/* Tooltip background */}
            <rect
              x={midX - 140}
              y={midY - 80}
              width="280"
              height="60"
              rx="8"
              fill="rgba(15, 23, 42, 0.95)"
              stroke="rgba(148, 163, 184, 0.3)"
              strokeWidth="1"
              className="drop-shadow-xl"
            />
            
            {/* Tooltip content */}
            <text
              x={midX}
              y={midY - 60}
              textAnchor="middle"
              className="fill-white text-sm font-semibold"
              style={{ fontSize: '12px' }}
            >
              {relationship.name || `${relationship.fromTable} → ${relationship.toTable}`}
            </text>
            <text
              x={midX}
              y={midY - 45}
              textAnchor="middle"
              className="fill-cyan-300 text-xs"
              style={{ fontSize: '10px' }}
            >
              {relationship.type.toUpperCase()} JOIN • {getRelationshipIcon(relationship.joinType)}
            </text>
            <text
              x={midX}
              y={midY - 30}
              textAnchor="middle"
              className="fill-slate-300 text-xs"
              style={{ fontSize: '9px' }}
            >
              {joinConditionsText}
            </text>
          </g>
        </g>
        
        {/* Connection points with enhanced styling */}
        <circle 
          cx={fromX} 
          cy={fromY} 
          r="5" 
          fill="#3b82f6" 
          stroke="white" 
          strokeWidth="2"
          className="group-hover:fill-cyan-500 transition-colors duration-200 drop-shadow-sm"
        />
        <circle 
          cx={toX} 
          cy={toY} 
          r="5" 
          fill="#3b82f6" 
          stroke="white" 
          strokeWidth="2"
          className="group-hover:fill-cyan-500 transition-colors duration-200 drop-shadow-sm"
        />
        
        {/* Relationship cardinality indicators */}
        <text
          x={fromX - 15}
          y={fromY - 8}
          textAnchor="middle"
          className="text-xs fill-slate-500 font-medium pointer-events-none"
          style={{ fontSize: '9px' }}
        >
          {relationship.joinType === 'one-to-many' ? '1' : relationship.joinType === 'many-to-many' ? 'N' : '1'}
        </text>
        <text
          x={toX + 15}
          y={toY - 8}
          textAnchor="middle"
          className="text-xs fill-slate-500 font-medium pointer-events-none"
          style={{ fontSize: '9px' }}
        >
          {relationship.joinType === 'one-to-many' ? 'N' : relationship.joinType === 'many-to-many' ? 'N' : '1'}
        </text>
      </g>
    );
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-slate-900">Logical Data Model</h2>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowTableSelector(true)}
                className="px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Table
              </button>
              <button 
                onClick={() => setShowJoinBuilder(true)}
                disabled={tables.length < 2}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed text-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center"
                title={tables.length < 2 ? "Add at least 2 tables to create joins" : "Join tables"}
              >
                <Link className="w-4 h-4 mr-2" />
                Join Tables
              </button>
              <button 
                onClick={() => setShowPreviewOutput(true)}
                className="px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center"
              >
                <Play className="w-4 h-4 mr-2" />
                Preview Output
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => handleZoom(-0.25)}
                className="p-1 hover:bg-white rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 text-sm font-medium text-slate-700">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => handleZoom(0.25)}
                className="p-1 hover:bg-white rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={resetView}
                className="p-1 hover:bg-white rounded transition-colors"
                title="Reset View"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              onClick={() => setShowSaveModel(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Model
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleCanvasMouseDown}
        onWheel={handleWheel}
        style={{ 
          backgroundImage: `radial-gradient(circle, #e2e8f0 1px, transparent 1px)`,
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          backgroundPosition: `${panOffset.x * zoom}px ${panOffset.y * zoom}px`
        }}
      >
        {/* SVG for relationships */}
        <svg
          ref={svgRef}
          className="absolute inset-0 pointer-events-none"
          width="100%"
          height="100%"
          style={{
            transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: '0 0',
            zIndex: 10
          }}
        >
           {relationships.map(renderRelationshipLine)}
        </svg>

        {/* Tables */}
        <div
          className="absolute inset-0"
          style={{
            transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: '0 0'
          }}
        >
          {tables.map((table) => (
            <div
              key={table.id}
              className={`absolute bg-white rounded-lg shadow-lg border-2 transition-all ${
                selectedTables.includes(table.id)
                  ? 'border-cyan-500 shadow-cyan-200'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              style={{
                left: table.x,
                top: table.y,
                width: 280,
                cursor: draggedTable === table.id ? 'grabbing' : 'grab'
              }}
              onMouseDown={(e) => handleTableMouseDown(e, table.id)}
            >
              {/* Table Header */}
              <div className="p-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-white rounded-md shadow-sm">
                      <Table className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">{table.name}</span>
                      {!table.expanded && (
                        <div className="text-xs text-slate-500 mt-0.5">
                          {table.columns.length} columns
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTableExpansion(table.id);
                      }}
                      className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all duration-200 group"
                      title={table.expanded ? 'Collapse table' : 'Expand table'}
                    >
                      {table.expanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-600 group-hover:text-slate-800" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-800" />
                      )}
                    </button>
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowTableSettings(showTableSettings === table.id ? null : table.id);
                        }}
                        className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all duration-200 group"
                        title="Table settings"
                      >
                        <Settings className="w-4 h-4 text-slate-600 group-hover:text-slate-800" />
                      </button>
                      
                      {/* Settings Dropdown */}
                      {showTableSettings === table.id && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyTable(table.id);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2 rounded-t-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Copy Table</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTable(table.id);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 rounded-b-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Remove Table</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Columns */}
              {table.expanded ? (
                <div className="max-h-64 overflow-y-auto scrollbar-thin">
                  {table.columns.map((column, index) => (
                    <div
                      key={index}
                      onClick={(e) => handleColumnClick(table.id, column.name, e)}
                      className={`p-2 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors ${
                        (column.primaryKey || column.foreignKey) ? 'cursor-pointer' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getDataTypeIcon(column.type)}
                          <span className="text-sm font-medium text-slate-900">
                            {column.name}
                          </span>
                          {column.primaryKey && (
                            <Key className="w-3 h-3 text-blue-600" />
                          )}
                          {column.foreignKey && (
                            <ExternalLink className="w-3 h-3 text-purple-600" />
                          )}
                          {!column.nullable && (
                            <span className="px-1 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                              NOT NULL
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {column.type} {column.description && `• ${column.description}`}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Collapsed state - show key columns preview */
                <div className="p-3 bg-slate-25">
                  <div className="space-y-1.5">
                    {table.columns
                      .filter(col => col.primaryKey || col.foreignKey)
                      .slice(0, 3)
                      .map((column, index) => (
                        <div key={index} className="flex items-center space-x-2 text-xs">
                          {getDataTypeIcon(column.type)}
                          <span className="text-slate-700 font-medium">{column.name}</span>
                          {column.primaryKey && (
                            <Key className="w-2.5 h-2.5 text-blue-600" />
                          )}
                          {column.foreignKey && (
                            <ExternalLink className="w-2.5 h-2.5 text-purple-600" />
                          )}
                        </div>
                      ))}
                    {table.columns.filter(col => col.primaryKey || col.foreignKey).length > 3 && (
                      <div className="text-xs text-slate-500 italic">
                        +{table.columns.filter(col => col.primaryKey || col.foreignKey).length - 3} more key columns
                      </div>
                    )}
                    {table.columns.filter(col => col.primaryKey || col.foreignKey).length === 0 && (
                      <div className="text-xs text-slate-500 italic">
                        Click to expand and view columns
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Instructions */}
        {tables.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Table className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-3">Start Building Your Data Model</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Add tables from your data sources to create relationships and build a comprehensive logical data model. 
                Once you have tables, you can join them together and preview the results.
              </p>
              <button 
                onClick={() => setShowTableSelector(true)}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors font-medium flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Add Your First Table</span>
              </button>
            </div>
          </div>
        )}


        {/* Pending connection indicator */}
        {pendingConnection && (
          <div className="absolute top-4 left-4 bg-cyan-500 text-white px-3 py-2 rounded-lg text-sm font-medium">
            Click on another column to create relationship
          </div>
        )}
      </div>

      {/* Relationship Modal */}
      {showRelationshipModal && (
        <div className="modal-overlay">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Create Relationship</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">From Table</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
                  <option value="">Select table...</option>
                  {tables.map(table => (
                    <option key={table.id} value={table.name}>{table.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">To Table</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
                  <option value="">Select table...</option>
                  {tables.map(table => (
                    <option key={table.id} value={table.name}>{table.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Relationship Type</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
                  <option value="one-to-many">One to Many (1:N)</option>
                  <option value="one-to-one">One to One (1:1)</option>
                  <option value="many-to-many">Many to Many (N:N)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowRelationshipModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
                Create Relationship
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Builder Modal */}
      {showJoinBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl h-5/6 flex flex-col">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Join Tables</h3>
                <button
                  onClick={() => setShowJoinBuilder(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-600 mt-1">Create relationships between tables with advanced join conditions</p>
            </div>
            
            <div className="flex-1 flex overflow-hidden">
              {/* Left Panel - Join Configuration */}
              <div className="w-1/2 border-r border-slate-200 p-6 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Join Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'left', label: 'Left Join', icon: '⟕' },
                        { value: 'inner', label: 'Inner Join', icon: '⋈' },
                        { value: 'right', label: 'Right Join', icon: '⟖' },
                        { value: 'full', label: 'Full Join', icon: '⟗' }
                      ].map((joinType) => (
                        <button
                          key={joinType.value}
                          onClick={() => setSelectedJoinType(joinType.value as 'inner' | 'left' | 'right' | 'full' | 'cross')}
                          className={`p-3 border rounded-lg text-left transition-colors ${
                            selectedJoinType === joinType.value
                              ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{joinType.icon}</span>
                            <span className="text-sm font-medium">{joinType.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">From Table</label>
                    <select 
                      value={currentJoin.fromTable || ''}
                      onChange={(e) => setCurrentJoin(prev => ({ ...prev, fromTable: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    >
                      <option value="">Select table...</option>
                      {tables.map(table => (
                        <option key={table.id} value={table.name}>{table.name}</option>
                      ))}
                    </select>
                    {tables.length === 0 && (
                      <p className="text-xs text-slate-500 mt-1">Add tables to the canvas first</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">To Table</label>
                    <select 
                      value={currentJoin.toTable || ''}
                      onChange={(e) => setCurrentJoin(prev => ({ ...prev, toTable: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    >
                      <option value="">Select table...</option>
                      {tables.map(table => (
                        <option key={table.id} value={table.name}>{table.name}</option>
                      ))}
                    </select>
                    {tables.length === 0 && (
                      <p className="text-xs text-slate-500 mt-1">Add tables to the canvas first</p>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-slate-700">Join Conditions</label>
                      <button
                        onClick={() => {
                          const newCondition: JoinCondition = {
                            id: Date.now().toString(),
                            leftColumn: '',
                            operator: '=',
                            rightColumn: ''
                          };
                          setJoinConditions(prev => [...prev, newCondition]);
                        }}
                        className="px-2 py-1 bg-cyan-500 hover:bg-cyan-600 text-white rounded text-xs flex items-center"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Condition
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {joinConditions.map((condition, index) => (
                        <div key={condition.id} className="flex items-center space-x-2">
                          <select 
                            value={condition.leftColumn}
                            onChange={(e) => {
                              const updated = [...joinConditions];
                              updated[index].leftColumn = e.target.value;
                              setJoinConditions(updated);
                            }}
                            className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                          >
                            <option value="">Left Column</option>
                            {currentJoin.fromTable && tables.find(t => t.name === currentJoin.fromTable)?.columns.map(col => (
                              <option key={col.name} value={col.name}>{col.name}</option>
                            ))}
                          </select>
                          
                          <select 
                            value={condition.operator}
                            onChange={(e) => {
                              const updated = [...joinConditions];
                              updated[index].operator = e.target.value as '=' | '!=' | '<' | '>' | '<=' | '>=' | 'LIKE' | 'IN';
                              setJoinConditions(updated);
                            }}
                            className="px-2 py-1 border border-slate-300 rounded text-sm"
                          >
                            <option value="=">=</option>
                            <option value="!=">!=</option>
                            <option value="<">&lt;</option>
                            <option value=">">&gt;</option>
                            <option value="<=">&lt;=</option>
                            <option value=">=">&gt;=</option>
                            <option value="LIKE">LIKE</option>
                          </select>
                          
                          <select 
                            value={condition.rightColumn}
                            onChange={(e) => {
                              const updated = [...joinConditions];
                              updated[index].rightColumn = e.target.value;
                              setJoinConditions(updated);
                            }}
                            className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm"
                          >
                            <option value="">Right Column</option>
                            {currentJoin.toTable && tables.find(t => t.name === currentJoin.toTable)?.columns.map(col => (
                              <option key={col.name} value={col.name}>{col.name}</option>
                            ))}
                          </select>
                          
                          <button
                            onClick={() => {
                              setJoinConditions(prev => prev.filter(c => c.id !== condition.id));
                            }}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      
                      {joinConditions.length === 0 && (
                        <div className="text-sm text-slate-500 text-center py-4 border-2 border-dashed border-slate-200 rounded-lg">
                          No join conditions added yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Panel - Preview */}
              <div className="w-1/2 p-6 overflow-y-auto">
                <h4 className="font-medium text-slate-900 mb-4">Join Preview</h4>
                
                {currentJoin.fromTable && currentJoin.toTable ? (
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-slate-700 mb-2">Generated SQL</h5>
                      <pre className="text-xs text-slate-600 font-mono whitespace-pre-wrap">
                        {`SELECT *
FROM ${currentJoin.fromTable} t1
${selectedJoinType.toUpperCase()} JOIN ${currentJoin.toTable} t2
  ON ${joinConditions.map(c => `t1.${c.leftColumn} ${c.operator} t2.${c.rightColumn}`).join(' AND ') || 't1.id = t2.id'}`}
                      </pre>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h5 className="text-sm font-medium text-slate-700 mb-2">Result Schema</h5>
                      <div className="space-y-2">
                        {tables.find(t => t.name === currentJoin.fromTable)?.columns.map(col => (
                          <div key={col.name} className="flex items-center space-x-2 text-xs">
                            {getDataTypeIcon(col.type)}
                            <span className="text-slate-600">{currentJoin.fromTable}.{col.name}</span>
                          </div>
                        ))}
                        {tables.find(t => t.name === currentJoin.toTable)?.columns.map(col => (
                          <div key={col.name} className="flex items-center space-x-2 text-xs">
                            {getDataTypeIcon(col.type)}
                            <span className="text-slate-600">{currentJoin.toTable}.{col.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Link className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>Select tables to preview join</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowJoinBuilder(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!currentJoin.fromTable || !currentJoin.toTable}
                onClick={() => {
                  // Find primary key columns for default join if no conditions specified
                  const fromTable = tables.find(t => t.name === currentJoin.fromTable);
                  const toTable = tables.find(t => t.name === currentJoin.toTable);
                  
                  const fromPK = fromTable?.columns.find(c => c.primaryKey)?.name || 'id';
                  const toPK = toTable?.columns.find(c => c.primaryKey)?.name || 'id';
                  
                  const defaultConditions = joinConditions.length > 0 ? joinConditions : [
                    { 
                      id: Date.now().toString(), 
                      leftColumn: fromPK, 
                      operator: '=' as '=' | '!=' | '<' | '>' | '<=' | '>=' | 'LIKE' | 'IN', 
                      rightColumn: toPK 
                    }
                  ];
                  
                  const newRelationship: Relationship = {
                    id: Date.now().toString(),
                    fromTable: currentJoin.fromTable!,
                    fromColumn: defaultConditions[0].leftColumn,
                    toTable: currentJoin.toTable!,
                    toColumn: defaultConditions[0].rightColumn,
                    type: selectedJoinType,
                    joinType: 'one-to-many',
                    name: `${currentJoin.fromTable} → ${currentJoin.toTable}`,
                    conditions: defaultConditions
                  };
                  
                   setRelationships(prev => [...prev, newRelationship]);
                  
                  setShowJoinBuilder(false);
                  setCurrentJoin({});
                  setJoinConditions([]);
                }}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-300 text-white rounded-lg transition-colors"
              >
                Create Join
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Output Modal */}
      {showPreviewOutput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl h-5/6 flex flex-col">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Preview Output</h3>
                  <p className="text-sm text-slate-600 mt-1">Preview the joined data from your logical model</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowSQL(!showSQL)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <span>{showSQL ? 'Hide SQL' : 'View SQL'}</span>
                  </button>
                  <button
                    onClick={() => setShowPreviewOutput(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              {showSQL ? (
                /* SQL View */
                <div className="space-y-4">
                  <div className="bg-slate-900 rounded-lg p-4 overflow-auto">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-slate-300">Generated SQL Query</h4>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generateSQL());
                          alert('SQL copied to clipboard!');
                        }}
                        className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs transition-colors"
                      >
                        Copy SQL
                      </button>
                    </div>
                    <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap overflow-auto">
                      {generateSQL()}
                    </pre>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Query Explanation</h4>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div><strong>Tables:</strong> {tables.map(t => t.name).join(', ')}</div>
                      <div><strong>Joins:</strong> {relationships.length} relationship{relationships.length !== 1 ? 's' : ''}</div>
                      <div><strong>Columns:</strong> {tables.reduce((sum, t) => sum + t.columns.length, 0)} total columns selected</div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Data Preview */
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto overflow-y-auto max-h-96">
                    <table className="w-full">
                      <thead className="bg-slate-50 sticky top-0">
                        <tr>
                          {/* Sample joined columns */}
                          <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 border-b border-slate-200">customer_id</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 border-b border-slate-200">first_name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 border-b border-slate-200">last_name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 border-b border-slate-200">order_id</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 border-b border-slate-200">order_date</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 border-b border-slate-200">total_amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Sample joined data */}
                        {Array.from({ length: 10 }, (_, rowIndex) => (
                          <tr key={rowIndex} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-sm text-slate-600 border-b border-slate-100">1001</td>
                            <td className="px-4 py-3 text-sm text-slate-600 border-b border-slate-100">John</td>
                            <td className="px-4 py-3 text-sm text-slate-600 border-b border-slate-100">Doe</td>
                            <td className="px-4 py-3 text-sm text-slate-600 border-b border-slate-100">{2001 + rowIndex}</td>
                            <td className="px-4 py-3 text-sm text-slate-600 border-b border-slate-100">2024-01-{15 + rowIndex}</td>
                            <td className="px-4 py-3 text-sm text-slate-600 border-b border-slate-100">${(Math.random() * 500 + 100).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <h5 className="text-sm font-medium text-slate-700 mb-2">Query Statistics</h5>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Rows:</span>
                    <span className="ml-2 font-medium">1,247</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Columns:</span>
                    <span className="ml-2 font-medium">12</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Execution Time:</span>
                    <span className="ml-2 font-medium">0.45s</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Action Bar */}
            <div className="p-6 border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={() => setShowPreviewOutput(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowPreviewOutput(false);
                  // Navigate to View tab - in a real app this would use router
                  window.location.hash = '#view';
                  alert('Navigating to View tab...');
                }}
                className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <span>Go to View</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Model Modal */}
      {showSaveModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Save Model as View</h3>
                <button
                  onClick={() => setShowSaveModel(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">View Name</label>
                  <input
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="Enter view name..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    placeholder="Optional description for this view..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 h-20"
                  />
                </div>
                
                <div className="bg-slate-50 p-3 rounded-lg">
                  <h5 className="text-sm font-medium text-slate-700 mb-1">Model Summary</h5>
                  <div className="text-sm text-slate-600">
                    <p>{tables.length} tables, {relationships.length} joins</p>
                    <p>Tables: {tables.map(t => t.name).join(', ')}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowSaveModel(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={!modelName.trim()}
                  onClick={() => {
                    // Save model logic here
                    alert(`Model "${modelName}" saved to Data Sets!`);
                    setShowSaveModel(false);
                    setModelName('');
                  }}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-300 text-white rounded-lg transition-colors"
                >
                  Save to Data Sets
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table Selector Modal */}
      {showTableSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-3/4 flex flex-col">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Add Table from Data Sources</h3>
                  <p className="text-sm text-slate-600 mt-1">Select a table from your connected data sources</p>
                </div>
                <button
                  onClick={() => setShowTableSelector(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Search Bar */}
              <div className="mt-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tables and data sources..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              <div className="space-y-6">
                {availableDataSources.map((dataSource) => (
                  <div key={dataSource.id} className="border border-slate-200 rounded-lg">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                      <div className="flex items-center space-x-2">
                        <Database className="w-4 h-4 text-slate-600" />
                        <h4 className="font-medium text-slate-900">{dataSource.name}</h4>
                        <span className="text-xs text-slate-500">({dataSource.tables.length} tables)</span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="grid grid-cols-1 gap-3">
                        {dataSource.tables.map((table) => {
                          const tableKey = `${dataSource.id}|${table.id}`;
                          const isSelected = selectedTablesForAdd.includes(tableKey);
                          
                          return (
                            <div
                              key={table.id}
                              onClick={() => toggleTableSelection(dataSource.id, table.id)}
                              className={`flex items-center justify-between p-3 border rounded-lg transition-colors text-left cursor-pointer ${
                                isSelected 
                                  ? 'border-cyan-500 bg-cyan-50 ring-2 ring-cyan-200' 
                                  : 'border-slate-200 hover:border-cyan-300 hover:bg-cyan-50'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {}} // Handled by parent onClick
                                    className="w-4 h-4 text-cyan-600 border-slate-300 rounded focus:ring-cyan-500"
                                  />
                                  <Table className="w-4 h-4 text-slate-600 ml-3" />
                                </div>
                                <div>
                                  <div className="font-medium text-slate-900">{table.name}</div>
                                  <div className="text-xs text-slate-500">{table.columns.length} columns</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                {table.columns.slice(0, 3).map((column, index) => (
                                  <div key={index} className="flex items-center space-x-1">
                                    {getDataTypeIcon(column.type)}
                                    <span className="text-xs text-slate-600">{column.name}</span>
                                  </div>
                                ))}
                                {table.columns.length > 3 && (
                                  <span className="text-xs text-slate-400">+{table.columns.length - 3} more</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 flex justify-between items-center">
              <div className="text-sm text-slate-600">
                {selectedTablesForAdd.length > 0 && (
                  <span>{selectedTablesForAdd.length} table{selectedTablesForAdd.length !== 1 ? 's' : ''} selected</span>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setSelectedTablesForAdd([]);
                    setShowTableSelector(false);
                  }}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addSelectedTables}
                  disabled={selectedTablesForAdd.length === 0}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Add Selected Tables
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}