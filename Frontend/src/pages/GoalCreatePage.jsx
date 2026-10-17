import { useNavigate } from "react-router-dom";
import FormModal from "../components/UI/FormModal";
import GoalForm from "../components/Goals/GoalForm";

const GoalCreatePage = () => {
  const navigate = useNavigate();

  return (
    <FormModal
      isOpen
      title="Create Goal"
      subtitle="Set a clear target to work toward"
      onClose={() => navigate("/app/goals")}
    >
      <GoalForm
        mode="create"
        onCancel={() => navigate("/app/goals")}
      />
    </FormModal>
  );
};

export default GoalCreatePage;
