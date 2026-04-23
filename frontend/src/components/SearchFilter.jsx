import { useState } from "react";

function SearchFilter({ setJobs, setHasSearched }) {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [minSalary, setMinSalary] = useState("");

    const handleSearch = async () => {
        const query = new URLSearchParams({
            title,
            location,
            minSalary
        }).toString();

        const res = await fetch(`http://localhost:5000/jobs/search?${query}`);
        const data = await res.json();
        
        setHasSearched(true);
        setJobs(data);
    };

    const handleClear = () => {
        setTitle("");
        setLocation("");
        setMinSalary("");
        setHasSearched(false);  // Reset to show all jobs
        setJobs([]);             // Clear search results
    };

    return (
        <div>
            <h2>Search Jobs</h2>

            <input
                placeholder="Job Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />

            <input
                type="number"
                placeholder="Min Salary"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
            />

            <button onClick={handleSearch}>Search</button>
            <button onClick={handleClear}>Clear Search</button>
        </div>
    );
}

export default SearchFilter;