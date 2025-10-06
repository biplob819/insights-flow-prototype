'use client';

import { useState } from 'react';
import { Play, Copy, Download, Save, Code, Eye, X, Check, AlertCircle } from 'lucide-react';

interface QueryBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  tables: string[];
}

export default function SQLQueryBuilder({ isOpen, onClose, initialQuery = '', tables }: QueryBuilderProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'builder' | 'sql' | 'results'>('builder');

  const [queryBuilder, setQueryBuilder] = useState({
    select: ['*'],
    from: tables[0] || '',
    joins: [] as Array<{ type: string; table: string; condition: string }>,
    where: [] as Array<{ column: string; operator: string; value: string; logic: string }>,
    groupBy: [] as string[],
    having: [] as Array<{ column: string; operator: string; value: string; logic: string }>,
    orderBy: [] as Array<{ column: string; direction: 'ASC' | 'DESC' }>,
    limit: ''
  });

  const joinTypes = ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'];
  const operators = ['=', '!=', '>', '<', '>=', '<=', 'LIKE', 'IN', 'NOT IN', 'IS NULL', 'IS NOT NULL'];
  const logicOperators = ['AND', 'OR'];

  const generateSQL = () => {
    let sql = 'SELECT ';
    
    // SELECT clause
    sql += queryBuilder.select.join(', ') + '\n';
    
    // FROM clause
    sql += `FROM ${queryBuilder.from}\n`;
    
    // JOIN clauses
    queryBuilder.joins.forEach(join => {
      sql += `${join.type} ${join.table} ON ${join.condition}\n`;
    });
    
    // WHERE clause
    if (queryBuilder.where.length > 0) {
      sql += 'WHERE ';
      queryBuilder.where.forEach((condition, index) => {
        if (index > 0) sql += ` ${condition.logic} `;
        sql += `${condition.column} ${condition.operator} ${condition.value}`;
      });
      sql += '\n';
    }
    
    // GROUP BY clause
    if (queryBuilder.groupBy.length > 0) {
      sql += `GROUP BY ${queryBuilder.groupBy.join(', ')}\n`;
    }
    
    // HAVING clause
    if (queryBuilder.having.length > 0) {
      sql += 'HAVING ';
      queryBuilder.having.forEach((condition, index) => {
        if (index > 0) sql += ` ${condition.logic} `;
        sql += `${condition.column} ${condition.operator} ${condition.value}`;
      });
      sql += '\n';
    }
    
    // ORDER BY clause
    if (queryBuilder.orderBy.length > 0) {
      sql += 'ORDER BY ';
      sql += queryBuilder.orderBy.map(order => `${order.column} ${order.direction}`).join(', ');
      sql += '\n';
    }
    
    // LIMIT clause
    if (queryBuilder.limit) {
      sql += `LIMIT ${queryBuilder.limit}`;
    }
    
    return sql.trim();
  };

  const executeQuery = async () => {
    setIsExecuting(true);
    setError(null);
    
    try {
      // Simulate query execution
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock results
      const mockResults = [
        { id: 1, name: 'John Doe', email: 'john@example.com', total_orders: 5, total_spent: 1250.00 },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', total_orders: 3, total_spent: 750.50 },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', total_orders: 8, total_spent: 2100.75 },
      ];
      
      setResults(mockResults);
      setActiveTab('results');
    } catch (err) {
      setError('Error executing query: ' + (err as Error).message);
    } finally {
      setIsExecuting(false);
    }
  };

  const addJoin = () => {
    setQueryBuilder(prev => ({
      ...prev,
      joins: [...prev.joins, { type: 'INNER JOIN', table: '', condition: '' }]
    }));
  };

  const addWhereCondition = () => {
    setQueryBuilder(prev => ({
      ...prev,
      where: [...prev.where, { column: '', operator: '=', value: '', logic: 'AND' }]
    }));
  };

  const addOrderBy = () => {
    setQueryBuilder(prev => ({
      ...prev,
      orderBy: [...prev.orderBy, { column: '', direction: 'ASC' }]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-lg w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">SQL Query Builder</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-6 mt-4">
            {[
              { id: 'builder', name: 'Visual Builder', icon: Eye },
              { id: 'sql', name: 'SQL Editor', icon: Code },
              { id: 'results', name: 'Results', icon: Check },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'builder' | 'sql' | 'results')}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-cyan-500 text-cyan-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'builder' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="space-y-6">
                {/* SELECT */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">SELECT</label>
                  <input
                    type="text"
                    value={queryBuilder.select.join(', ')}
                    onChange={(e) => setQueryBuilder(prev => ({ ...prev, select: e.target.value.split(', ') }))}
                    placeholder="column1, column2, ..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>

                {/* FROM */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">FROM</label>
                  <select
                    value={queryBuilder.from}
                    onChange={(e) => setQueryBuilder(prev => ({ ...prev, from: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  >
                    <option value="">Select table...</option>
                    {tables.map(table => (
                      <option key={table} value={table}>{table}</option>
                    ))}
                  </select>
                </div>

                {/* JOINS */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700">JOINS</label>
                    <button
                      onClick={addJoin}
                      className="px-3 py-1 bg-cyan-500 hover:bg-cyan-600 text-white rounded text-sm"
                    >
                      Add Join
                    </button>
                  </div>
                  {queryBuilder.joins.map((join, index) => (
                    <div key={index} className="grid grid-cols-3 gap-3 mb-3">
                      <select
                        value={join.type}
                        onChange={(e) => {
                          const newJoins = [...queryBuilder.joins];
                          newJoins[index].type = e.target.value;
                          setQueryBuilder(prev => ({ ...prev, joins: newJoins }));
                        }}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      >
                        {joinTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <select
                        value={join.table}
                        onChange={(e) => {
                          const newJoins = [...queryBuilder.joins];
                          newJoins[index].table = e.target.value;
                          setQueryBuilder(prev => ({ ...prev, joins: newJoins }));
                        }}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      >
                        <option value="">Select table...</option>
                        {tables.map(table => (
                          <option key={table} value={table}>{table}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={join.condition}
                        onChange={(e) => {
                          const newJoins = [...queryBuilder.joins];
                          newJoins[index].condition = e.target.value;
                          setQueryBuilder(prev => ({ ...prev, joins: newJoins }));
                        }}
                        placeholder="table1.id = table2.id"
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    </div>
                  ))}
                </div>

                {/* WHERE */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700">WHERE</label>
                    <button
                      onClick={addWhereCondition}
                      className="px-3 py-1 bg-cyan-500 hover:bg-cyan-600 text-white rounded text-sm"
                    >
                      Add Condition
                    </button>
                  </div>
                  {queryBuilder.where.map((condition, index) => (
                    <div key={index} className="grid grid-cols-5 gap-3 mb-3">
                      {index > 0 && (
                        <select
                          value={condition.logic}
                          onChange={(e) => {
                            const newWhere = [...queryBuilder.where];
                            newWhere[index].logic = e.target.value;
                            setQueryBuilder(prev => ({ ...prev, where: newWhere }));
                          }}
                          className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                        >
                          {logicOperators.map(op => (
                            <option key={op} value={op}>{op}</option>
                          ))}
                        </select>
                      )}
                      <input
                        type="text"
                        value={condition.column}
                        onChange={(e) => {
                          const newWhere = [...queryBuilder.where];
                          newWhere[index].column = e.target.value;
                          setQueryBuilder(prev => ({ ...prev, where: newWhere }));
                        }}
                        placeholder="column"
                        className={`px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${index === 0 ? 'col-span-2' : ''}`}
                      />
                      <select
                        value={condition.operator}
                        onChange={(e) => {
                          const newWhere = [...queryBuilder.where];
                          newWhere[index].operator = e.target.value;
                          setQueryBuilder(prev => ({ ...prev, where: newWhere }));
                        }}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      >
                        {operators.map(op => (
                          <option key={op} value={op}>{op}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={condition.value}
                        onChange={(e) => {
                          const newWhere = [...queryBuilder.where];
                          newWhere[index].value = e.target.value;
                          setQueryBuilder(prev => ({ ...prev, where: newWhere }));
                        }}
                        placeholder="value"
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      />
                    </div>
                  ))}
                </div>

                {/* ORDER BY */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700">ORDER BY</label>
                    <button
                      onClick={addOrderBy}
                      className="px-3 py-1 bg-cyan-500 hover:bg-cyan-600 text-white rounded text-sm"
                    >
                      Add Order
                    </button>
                  </div>
                  {queryBuilder.orderBy.map((order, index) => (
                    <div key={index} className="grid grid-cols-2 gap-3 mb-3">
                      <input
                        type="text"
                        value={order.column}
                        onChange={(e) => {
                          const newOrderBy = [...queryBuilder.orderBy];
                          newOrderBy[index].column = e.target.value;
                          setQueryBuilder(prev => ({ ...prev, orderBy: newOrderBy }));
                        }}
                        placeholder="column"
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      />
                      <select
                        value={order.direction}
                        onChange={(e) => {
                          const newOrderBy = [...queryBuilder.orderBy];
                          newOrderBy[index].direction = e.target.value as 'ASC' | 'DESC';
                          setQueryBuilder(prev => ({ ...prev, orderBy: newOrderBy }));
                        }}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                      >
                        <option value="ASC">ASC</option>
                        <option value="DESC">DESC</option>
                      </select>
                    </div>
                  ))}
                </div>

                {/* LIMIT */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">LIMIT</label>
                  <input
                    type="number"
                    value={queryBuilder.limit}
                    onChange={(e) => setQueryBuilder(prev => ({ ...prev, limit: e.target.value }))}
                    placeholder="100"
                    className="w-32 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="h-full p-6">
              <div className="h-full flex flex-col">
                <div className="mb-4">
                  <button
                    onClick={() => setQuery(generateSQL())}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
                  >
                    Generate from Builder
                  </button>
                </div>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your SQL query here..."
                  className="flex-1 w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 font-mono text-sm resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="h-full p-6">
              {error ? (
                <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                  <span className="text-red-700">{error}</span>
                </div>
              ) : results.length > 0 ? (
                <div className="overflow-auto">
                  <table className="w-full border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-slate-50">
                        {Object.keys(results[0]).map(key => (
                          <th key={key} className="border border-slate-300 px-4 py-2 text-left font-medium text-slate-700">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((row, index) => (
                        <tr key={`row-${index}`} className="hover:bg-slate-50">
                          {Object.values(row).map((value, i) => (
                            <td key={`col-${i}`} className="border border-slate-300 px-4 py-2 text-slate-900">
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <div className="text-center">
                    <Code className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p>No results yet. Execute a query to see results here.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex justify-between">
          <div className="flex space-x-3">
            <button
              onClick={() => navigator.clipboard.writeText(activeTab === 'sql' ? query : generateSQL())}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy SQL
            </button>
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center">
              <Save className="w-4 h-4 mr-2" />
              Save Query
            </button>
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </button>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={executeQuery}
              disabled={isExecuting}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-300 text-white rounded-lg transition-colors text-sm font-medium flex items-center"
            >
              {isExecuting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isExecuting ? 'Executing...' : 'Execute Query'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
