import { useAuth } from "../context/AuthContext";
import { DEFAULT_DATE_FORMAT } from "../utils/dateFormatting";

const useDateFormat = () => {
  const { user } = useAuth();
  return user?.preferences?.dateFormat || DEFAULT_DATE_FORMAT;
};

export default useDateFormat;
