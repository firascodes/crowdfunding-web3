import { ethers } from "ethers";

export const daysLeft = (deadline) => {
  // Convert BigNumber to a number
  const deadlineNumber = ethers.BigNumber.from(deadline).toNumber();

  // Convert the number to a Date
  const deadlineDate = new Date(deadlineNumber);

  const difference = deadlineDate.getTime() - Date.now();
  const remainingDays = difference / (1000 * 3600 * 24);

  return remainingDays.toFixed(0);
};

export const calculateBarPercentage = (goal, raisedAmount) => {
  const percentage = Math.round((raisedAmount * 100) / goal);

  return percentage;
};

export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};
