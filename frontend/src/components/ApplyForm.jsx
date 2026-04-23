import { useState } from "react";
import { useUser } from "@clerk/clerk-react";


function ApplyForm({ jobId }) {
    const [file, setFile] = useState(null);
    
    const { user } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("resume", file);
        formData.append("jobId", jobId);
        formData.append("userId", user.id);

        try {
            await fetch("http://localhost:5000/applications/apply", {
                method: "POST",
                body: formData
            });

            alert("Applied successfully");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button type="submit">Submit Application</button>
        </form>
    );
}

export default ApplyForm;