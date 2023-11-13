//Store Web3 logic!

import React, { createContext, useContext } from "react";

import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0xdD26f5eE4fAD887E1ADbB2D173e80B3fd6aCd17D"
  );

  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    try {
      console.log("Publish campaign");
      const data = await createCampaign({
        args: [
          address,
          form.title,
          form.description,
          ethers.BigNumber.from(form.target),
          ethers.BigNumber.from(
            Math.floor(new Date(form.deadline).getTime()).toString()
          ),
          form.image,
        ],
      });

      console.log("Contract call success", data);
    } catch (error) {
      console.log("Contract call failure", error);
    }
  };

  const getCampaigns = async () => {
    if (!contract) {
      console.error("Contract is not initialized");
      return;
    }
    const campaigns = await contract.call("getCampaigns");

    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: campaign.target.toString(),
      deadline: campaign.deadline,
      amountCollected: campaign.amountCollected.toString(),
      image: campaign.image,
      pId: i,
    }));
    console.log("Campaigns", parsedCampaigns);

    return parsedCampaigns;
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === address
    );

    return filteredCampaigns;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
