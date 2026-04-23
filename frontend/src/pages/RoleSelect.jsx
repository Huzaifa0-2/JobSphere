import { useUser } from "@clerk/clerk-react";

function RoleSelect({ setRole }) {
  const { user } = useUser();

  const selectRole = async (role) => {
    const res = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        clerkId: user.id,
        role
      })
    });

    const data = await res.json();
    setRole(data.role);
  };

  return (
    <div>
      <h2>Select Role</h2>

      <button onClick={() => selectRole("employer")}>
        Employer
      </button>

      <button onClick={() => selectRole("seeker")}>
        Seeker
      </button>
    </div>
  );
}

export default RoleSelect;