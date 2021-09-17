import { useAuth } from "context/AuthContext";

const HomePage: React.FC = () => {
  const auth = useAuth();

  return (
    <div>
      <h1>
        Connected as {auth.user?.first_name} {auth.user?.last_name}
      </h1>
    </div>
  );
};

export default HomePage;
