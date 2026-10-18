import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import GoalForm from "../components/Goals/GoalForm";

import { getGoal } from "../services/goalsServices";

import { toast } from "react-hot-toast";

const GoalEditPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [goal, setGoal] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchGoal = async () => {
      try {
        setLoading(true);
        const data = await getGoal(id);
        if (isMounted) {
          setGoal(data);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(error.message);
          navigate("/app/goals");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchGoal();

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  // Loading state
  if (loading) {
    return <div className="p-6 text-foreground-muted">Loading...</div>;
  }

  // Safety check
  if (!goal) return null;

  return (
    <div className="p-6">
      <GoalForm mode="edit" initialData={goal} goalId={goal._id} />
    </div>
  );
};

export default GoalEditPage;
