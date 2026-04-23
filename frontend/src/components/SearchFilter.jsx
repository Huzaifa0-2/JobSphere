import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { searchJobs } from "../features/jobs/jobSlice";
import { useSelector } from "react-redux";

function SearchFilter({ setHasSearched }) {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [minSalary, setMinSalary] = useState("");


    const dispatch = useDispatch();

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

        // const query = new URLSearchParams({
        //     title,
        //     location,
        //     minSalary
        // }).toString();

        // const res = await fetch(`http://localhost:5000/jobs/search?${query}`);
        // const data = await res.json();

        dispatch(searchJobs({ title, location, minSalary }));
        setHasSearched(true);
    };

    const handleClear = () => {
        setTitle("");
        setLocation("");
        setMinSalary("");
        setHasSearched(false);  // Reset to show all jobs
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

            {/* <button onClick={handleSearch}>Search</button> */}
            <button onClick={handleClear}>Clear Search</button>
        </div>
    );
}

export default SearchFilter;