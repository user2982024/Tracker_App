const StatCard = ({ title, value, icon: Icon, color }) => {

  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
  };

  return (
    <div className={`${colors[color]} text-white p-4 rounded-xl`}>

      <div className="flex justify-between items-center">

        <div>
          <p className="text-sm">{title}</p>
          <h2 className="text-2xl font-bold">{value}</h2>
        </div>

        <Icon size={28} />

      </div>

    </div>
  );
};

export default StatCard;