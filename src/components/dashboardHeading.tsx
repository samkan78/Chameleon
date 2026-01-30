import React from "react";
import "../screens/dashboard.css";

interface DashboardInformationProps {
  petName: string;
  petType: string;
}
// Component to display the dashboard heading with pet name and type
export const DashboardInformation: React.FC<DashboardInformationProps> = ({
  petName,
  petType,
}) => {
  return (
    <div className="dashboard-heading">
      <h1>Chameleon Dashboard</h1>
      <h2>Pet Name: {petName}</h2>
      <h2>Pet Type: {petType}</h2>
    </div>
  );
};

export default DashboardInformation;
