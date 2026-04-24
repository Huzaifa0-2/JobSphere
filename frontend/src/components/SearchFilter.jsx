import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { searchJobs } from "../features/jobs/jobSlice";
import { useSelector } from "react-redux";
import { MapPin, DollarSign, Search, X, Filter, Loader2 } from "lucide-react";

function SearchFilter({ setHasSearched }) {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [minSalary, setMinSalary] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.jobs);

    // Debounce search to avoid too many API calls(no search button needed, it searches as user types)
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            handleSearch();
        }, 500); // wait 500ms

        return () => clearTimeout(delayDebounce);
    }, [title, location, minSalary]);

    const handleSearch = async () => {
        if (!title && !location && !minSalary) {
            setHasSearched(false); // fallback to all jobs
            return;
        }

        setIsSearching(true);
        await dispatch(searchJobs({ title, location, minSalary }));
        setIsSearching(false);
        setHasSearched(true);
    };

    const handleClear = () => {
        setTitle("");
        setLocation("");
        setMinSalary("");
        setHasSearched(false);  // Reset to show all jobs
    };

    // Count active filters
    const activeFilterCount = [title, location, minSalary].filter(f => f && f.toString().trim() !== "").length;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-gray-400" />
                    <h2 className="text-lg font-semibold text-gray-900">Search Jobs</h2>
                    {activeFilterCount > 0 && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                            {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>
                
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                        showFilters 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    <Filter className="w-4 h-4" />
                    {showFilters ? "Hide Filters" : "More Filters"}
                </button>
            </div>

            {/* Main Search Input */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Job title, keywords, or company..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                />
                {title && (
                    <button
                        onClick={() => setTitle("")}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Expandable Filters */}
            {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="City, State, or Remote"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {location && (
                                <button
                                    onClick={() => setLocation("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Salary</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="number"
                                placeholder="Any amount"
                                value={minSalary}
                                onChange={(e) => setMinSalary(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {minSalary && (
                                <button
                                    onClick={() => setMinSalary("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Active Filters Chips */}
            {(title || location || minSalary) && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {title && (
                        <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
                            <Search className="w-3 h-3" />
                            Title: {title}
                            <button onClick={() => setTitle("")} className="hover:text-blue-900 ml-1">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                    {location && (
                        <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
                            <MapPin className="w-3 h-3" />
                            Location: {location}
                            <button onClick={() => setLocation("")} className="hover:text-blue-900 ml-1">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                    {minSalary && (
                        <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
                            <DollarSign className="w-3 h-3" />
                            Min Salary: ${Number(minSalary).toLocaleString()}
                            <button onClick={() => setMinSalary("")} className="hover:text-blue-900 ml-1">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                    <button
                        onClick={handleClear}
                        className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        Clear all
                    </button>
                </div>
            )}

            {/* Loading Indicator */}
            {isSearching && (
                <div className="flex items-center justify-center gap-2 py-2">
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    <span className="text-sm text-gray-500">Searching...</span>
                </div>
            )}
        </div>
    );
}

// Import missing icons at the top (add to your imports)
// You'll need to add MapPin and DollarSign to lucide-react import
export default SearchFilter;