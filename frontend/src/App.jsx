import {
  SignedIn,
  SignedOut,
  SignIn,
  SignOutButton,
  useUser
} from "@clerk/clerk-react";

import { useEffect, useState } from "react";

import SeekerDashboard from "./pages/SeekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import RoleSelect from "./pages/RoleSelect";

function App() {
  const { user } = useUser();
  const [role, setRole] = useState(null);``

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/users/${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data) setRole(data.role);
      });
  }, [user]);

  return (
    <div>

      <SignedOut>
        <SignIn />
      </SignedOut>

      <SignedIn>
        {!role && <RoleSelect setRole={setRole} />}

        {role === "seeker" && <SeekerDashboard />}
        {role === "employer" && <EmployerDashboard />}

        <SignOutButton>
          <button>Sign Out</button>
        </SignOutButton>
      </SignedIn>

    </div>
  );
}

export default App;