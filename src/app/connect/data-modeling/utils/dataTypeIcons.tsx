import { Hash, Type, Calendar, ToggleLeft, Layers, MapPin, Calculator } from 'lucide-react';

export const getDataTypeIcon = (type: string, size: 'sm' | 'md' = 'sm') => {
  const sizeClass = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  
  switch (type) {
    case 'Text':
      return <Type className={`${sizeClass} text-slate-600`} />;
    case 'Number':
      return <Hash className={`${sizeClass} text-blue-600`} />;
    case 'Date':
      return <Calendar className={`${sizeClass} text-purple-600`} />;
    case 'Logical':
      return <ToggleLeft className={`${sizeClass} text-green-600`} />;
    case 'Variant':
      return <Layers className={`${sizeClass} text-orange-600`} />;
    case 'Geography':
      return <MapPin className={`${sizeClass} text-red-600`} />;
    case 'formula':
      return <Calculator className={`${sizeClass} text-cyan-600`} />;
    default:
      return <Type className={`${sizeClass} text-slate-400`} />;
  }
};

export const getDataTypeColor = (type: string) => {
  switch (type) {
    case 'Text':
      return 'text-slate-600';
    case 'Number':
      return 'text-blue-600';
    case 'Date':
      return 'text-purple-600';
    case 'Logical':
      return 'text-green-600';
    case 'Variant':
      return 'text-orange-600';
    case 'Geography':
      return 'text-red-600';
    case 'formula':
      return 'text-cyan-600';
    default:
      return 'text-slate-400';
  }
};

export const getDataTypeBadgeColor = (type: string) => {
  switch (type) {
    case 'Text':
      return 'bg-slate-100 text-slate-700';
    case 'Number':
      return 'bg-blue-100 text-blue-700';
    case 'Date':
      return 'bg-purple-100 text-purple-700';
    case 'Logical':
      return 'bg-green-100 text-green-700';
    case 'Variant':
      return 'bg-orange-100 text-orange-700';
    case 'Geography':
      return 'bg-red-100 text-red-700';
    case 'formula':
      return 'bg-cyan-100 text-cyan-700';
    default:
      return 'bg-slate-100 text-slate-500';
  }
};
