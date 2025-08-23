const FeatureCard = ({ icon, color, title, description }) => {
  return (
    <div className="pt-6">
      <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg">
        <div className="-mt-6">
          <div className={`inline-flex items-center justify-center p-3 ${color} rounded-md shadow-lg`}>
            {icon}
          </div>
          <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{title}</h3>
          <p className="mt-2 text-base text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;