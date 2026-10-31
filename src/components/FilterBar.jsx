import { Calendar, MapPin, RefreshCw } from 'lucide-react';
import DropdownSelect from './DropdownSelect.jsx';

function Select({ id, label, icon: Icon, value, onChange, options, multiple = false, allSelectedLabel, placeholder }) {
  return (
    <DropdownSelect
      id={id}
      value={value}
      label={label}
      icon={Icon}
      onChange={onChange}
      options={options}
      multiple={multiple}
      allSelectedLabel={allSelectedLabel}
      placeholder={placeholder}
      wrapperClassName="min-w-0 flex-1 sm:flex-none sm:w-44 xl:w-36 2xl:w-40"
      buttonClassName="font-medium"
    />
  );
}

export default function FilterBar({ range, onRangeChange, rangeOptions, region, onRegionChange, regionOptions, onRefresh, refreshing }) {
  return (
    <div className="flex w-full flex-wrap items-center gap-2 sm:w-full sm:flex-nowrap xl:w-auto">
      <Select id="date-range" label="Date range" icon={Calendar} value={range} onChange={onRangeChange} options={rangeOptions} />
      <Select id="region" label="Region" icon={MapPin} value={region} onChange={onRegionChange} options={regionOptions} multiple allSelectedLabel="All Regions" placeholder="No regions" />
      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-line bg-white px-3.5 text-sm font-medium text-ink shadow-sm hover:bg-slate-50 disabled:opacity-60"
        aria-label="Refresh dashboard"
      >
        <RefreshCw className={`size-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
        <span className="hidden sm:inline">Refresh</span>
      </button>
    </div>
  );
}
