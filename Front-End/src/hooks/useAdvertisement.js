import { useSelector} from "react-redux";

const useAdvertisement = () => {
  const advertisementData = useSelector((state) => state.advertisement.advertisementData);

   const fetchAdvertisement = (payload) => ({
    type: 'FETCH_ADVERTISEMENT',
    payload,
  });

   const clearAdvertisements = () => ({
    type: 'CLEAR_ADVERTISEMENTS',
  });

  return { advertisementData, fetchAdvertisement, clearAdvertisements};
};

export default useAdvertisement;