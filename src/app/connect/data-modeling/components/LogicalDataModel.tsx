'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Table, Plus, Link, Trash2, Settings, ChevronDown, ChevronRight, Key, ExternalLink, ZoomIn, ZoomOut, RotateCcw, Save, Database, Search, X, Play } from 'lucide-react';
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
  const [tables, setTables] = useState<TableNode[]>([
    {
      id: '1',
      name: 'customers',
      x: 100,
      y: 100,
      expanded: true,
      columns: [
        { name: 'id', type: 'Number', nullable: false, primaryKey: true, description: 'Unique customer identifier' },
        { name: 'first_name', type: 'Text', nullable: false, description: 'Customer first name' },
        { name: 'last_name', type: 'Text', nullable: false, description: 'Customer last name' },
        { name: 'email', type: 'Text', nullable: false, description: 'Customer email address' },
        { name: 'phone', type: 'Text', nullable: true, description: 'Customer phone number' },
        { name: 'created_at', type: 'Date', nullable: false, description: 'Account creation timestamp' },
        { name: 'is_active', type: 'Logical', nullable: false, description: 'Account status flag' },
      ]
    },
    {
      id: '2',
      name: 'orders',
      x: 450,
      y: 100,
      expanded: true,
      columns: [
        { name: 'id', type: 'Number', nullable: false, primaryKey: true },
        { name: 'customer_id', type: 'Number', nullable: false, foreignKey: true },
        { name: 'order_date', type: 'Date', nullable: false },
        { name: 'total_amount', type: 'Number', nullable: false },
        { name: 'status', type: 'Text', nullable: false },
        { name: 'metadata', type: 'Variant', nullable: true },
      ]
    },
    {
      id: '3',
      name: 'products',
      x: 100,
      y: 400,
      expanded: true,
      columns: [
        { name: 'id', type: 'Number', nullable: false, primaryKey: true },
        { name: 'name', type: 'Text', nullable: false },
        { name: 'description', type: 'Text', nullable: true },
        { name: 'price', type: 'Number', nullable: false },
        { name: 'category_id', type: 'Number', nullable: false, foreignKey: true },
        { name: 'location', type: 'Geography', nullable: true },
      ]
    },
    {
      id: '4',
      name: 'order_items',
      x: 450,
      y: 400,
      expanded: true,
      columns: [
        { name: 'id', type: 'Number', nullable: false, primaryKey: true },
        { name: 'order_id', type: 'Number', nullable: false, foreignKey: true },
        { name: 'product_id', type: 'Number', nullable: false, foreignKey: true },
        { name: 'quantity', type: 'Number', nullable: false },
        { name: 'unit_price', type: 'Number', nullable: false },
      ]
    }
  ]);

  const [relationships, setRelationships] = useState<Relationship[]>([
    {
      id: '1',
      fromTable: 'customers',
      fromColumn: 'id',
      toTable: 'orders',
      toColumn: 'customer_id',
      type: 'left',
      joinType: 'one-to-many',
      name: 'Customer Orders',
      conditions: [{ id: '1', leftColumn: 'id', operator: '=', rightColumn: 'customer_id' }]
    },
    {
      id: '2',
      fromTable: 'orders',
      fromColumn: 'id',
      toTable: 'order_items',
      toColumn: 'order_id',
      type: 'left',
      joinType: 'one-to-many',
      name: 'Order Items',
      conditions: [{ id: '2', leftColumn: 'id', operator: '=', rightColumn: 'order_id' }]
    },
    {
      id: '3',
      fromTable: 'products',
      fromColumn: 'id',
      toTable: 'order_items',
      toColumn: 'product_id',
      type: 'left',
      joinType: 'one-to-many',
      name: 'Product Orders',
      conditions: [{ id: '3', leftColumn: 'id', operator: '=', rightColumn: 'product_id' }]
    }
  ]);

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

  const addTableFromDataSource = (dataSourceId: string, tableId: string) => {
    const dataSource = availableDataSources.find(ds => ds.id === dataSourceId);
    const sourceTable = dataSource?.tables.find(t => t.id === tableId);
    
    if (sourceTable) {
      const newTable: TableNode = {
        id: (tables.length + 1).toString(),
        name: sourceTable.name,
        x: 200 + (tables.length * 50),
        y: 200 + (tables.length * 50),
        expanded: true,
        columns: sourceTable.columns
      };
      setTables([...tables, newTable]);
      setShowTableSelector(false);
    }
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
    
    if (!fromTable || !toTable) return null;

    const fromColumnIndex = fromTable.columns.findIndex(c => c.name === relationship.fromColumn);
    const toColumnIndex = toTable.columns.findIndex(c => c.name === relationship.toColumn);
    
    const fromX = fromTable.x + 280; // Right edge of table
    const fromY = fromTable.y + 40 + (fromColumnIndex * 28) + 14; // Column center
    const toX = toTable.x; // Left edge of table
    const toY = toTable.y + 40 + (toColumnIndex * 28) + 14; // Column center

    const midX = (fromX + toX) / 2;
    
    return (
      <g key={relationship.id} className="relationship-line">
        <path
          d={`M ${fromX} ${fromY} C ${midX} ${fromY} ${midX} ${toY} ${toX} ${toY}`}
          stroke="#3b82f6"
          strokeWidth="2"
          fill="none"
          className="hover:stroke-cyan-500 transition-colors"
        />
        
        {/* Relationship label */}
        <text
          x={midX}
          y={(fromY + toY) / 2 - 8}
          textAnchor="middle"
          className="text-xs fill-slate-600 font-medium"
          style={{ fontSize: '10px' }}
        >
          {getJoinTypeIcon(relationship.type)} {getRelationshipIcon(relationship.joinType)}
        </text>
        
        {/* Connection points */}
        <circle cx={fromX} cy={fromY} r="4" fill="#3b82f6" />
        <circle cx={toX} cy={toY} r="4" fill="#3b82f6" />
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
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center"
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
          style={{
            transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: '0 0'
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
              <div className="p-3 border-b border-slate-200 bg-slate-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Table className="w-4 h-4 text-slate-600" />
                    <span className="font-semibold text-slate-900">{table.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTableExpansion(table.id);
                      }}
                      className="p-1 hover:bg-slate-200 rounded transition-colors"
                    >
                      {table.expanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      )}
                    </button>
                    <button className="p-1 hover:bg-slate-200 rounded transition-colors">
                      <Settings className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Table Columns */}
              {table.expanded && (
                <div className="max-h-64 overflow-y-auto">
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
              )}
            </div>
          ))}
        </div>

        {/* Instructions */}
        {tables.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Table className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-500 mb-2">No Tables Added</h3>
              <p className="text-slate-400 text-sm mb-4">
                Add tables to start building your logical data model
              </p>
              <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
                Add Your First Table
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
                  const newRelationship: Relationship = {
                    id: Date.now().toString(),
                    fromTable: currentJoin.fromTable!,
                    fromColumn: joinConditions[0]?.leftColumn || 'id',
                    toTable: currentJoin.toTable!,
                    toColumn: joinConditions[0]?.rightColumn || 'id',
                    type: selectedJoinType,
                    joinType: 'one-to-many',
                    name: `${currentJoin.fromTable} → ${currentJoin.toTable}`,
                    conditions: joinConditions
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
                <h3 className="text-lg font-semibold text-slate-900">Preview Output</h3>
                <button
                  onClick={() => setShowPreviewOutput(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-600 mt-1">Preview the joined data from your logical model</p>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
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
                        {dataSource.tables.map((table) => (
                          <button
                            key={table.id}
                            onClick={() => addTableFromDataSource(dataSource.id, table.id)}
                            className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-cyan-300 hover:bg-cyan-50 transition-colors text-left"
                          >
                            <div className="flex items-center space-x-3">
                              <Table className="w-4 h-4 text-slate-600" />
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
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowTableSelector(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}