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

  // Fetch goal by ID
  const fetchGoal = async () => {
    try {
      setLoading(true);

      const data = await getGoal(id);

      setGoal(data);
    } catch (error) {
      toast.error(error.message);
      navigate("/app/goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoal();
  }, [id]);

  // Loading state
  if (loading) {
    return <div className="p-6 text-gray-500">Loading...</div>;
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
