import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Upload, X, FileText, CheckCircle, Loader2, AlertCircle } from "lucide-react";

function ApplyForm({ jobId, onSuccess }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    
    const { user } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!file) {
            setError("Please select a resume file");
            return;
        }

        setLoading(true);
        setError(null);
        
        const formData = new FormData();
        formData.append("resume", file);
        formData.append("jobId", jobId);
        formData.append("userId", user.id);

        try {
            const response = await fetch("http://localhost:5000/applications/apply", {
                method: "POST",
                body: formData
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Application failed");
            }
            
            setSuccess(true);
            setTimeout(() => {
                if (onSuccess) onSuccess();
            }, 1500);
        } catch (error) {
            console.log(error);
            setError(error.message || "Failed to submit application");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Validate file type
            if (selectedFile.type !== "application/pdf") {
                setError("Only PDF files are allowed");
                setFile(null);
                return;
            }
            // Validate file size (max 5MB)
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError("File size must be less than 5MB");
                setFile(null);
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const removeFile = () => {
        setFile(null);
        setError(null);
    };

    if (success) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-300">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Submitted!</h3>
                <p className="text-gray-500">Your application has been sent successfully.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">Submit Your Application</h3>
                <p className="text-sm text-gray-500 mt-1">Please upload your resume in PDF format</p>
            </div>

            {/* File Upload Area */}
            {!file ? (
                <label className="flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                            <Upload className="w-6 h-6 text-gray-500 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <p className="text-sm text-gray-600 font-medium">Click to upload your resume</p>
                        <p className="text-xs text-gray-400 mt-1">PDF only, Max 5MB</p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept=".pdf,application/pdf"
                        onChange={handleFileChange}
                    />
                </label>
            ) : (
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200 animate-in slide-in-from-top duration-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">
                                {(file.size / 1024).toFixed(0)} KB
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={removeFile}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove file"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200 animate-in slide-in-from-top duration-200">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!file || loading}
                className={`
                    w-full py-3 rounded-xl font-medium transition-all duration-200
                    ${!file || loading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transform hover:scale-[1.02]'
                    }
                `}
            >
                {loading ? (
                    <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Submitting Application...</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4" />
                        <span>Submit Application</span>
                    </div>
                )}
            </button>

            {/* Info Text */}
            <p className="text-xs text-center text-gray-400">
                By submitting, you confirm that the information provided is accurate
            </p>
        </form>
    );
}

export default ApplyForm;