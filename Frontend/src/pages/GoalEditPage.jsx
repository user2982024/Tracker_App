import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/UI/Spinner";
import FormModal from "../components/UI/FormModal";

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
    return <Spinner fullPage size={40} />;
  }

  // Safety check
  if (!goal) return null;

  return (
    <FormModal
      isOpen
      title="Edit Goal"
      subtitle="Update the details of this goal"
      onClose={() => navigate(-1)}
    >
      <GoalForm mode="edit" initialData={goal} goalId={goal._id} />
    </FormModal>
  );
};

export default GoalEditPage;
