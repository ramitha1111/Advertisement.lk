import { fetchAdvertisement, clearAdvertisement } from "../store/advertisementSlice";
import {useDispatch, useSelector} from "react-redux";

const useAdvertisement = () => {
  const dispatch = useDispatch();
  const advertisementData = useSelector((state) => state.advertisement.advertisementData);

  const fetchAdvertisementData = (data) => {
    dispatch(fetchAdvertisement({ advertisementData: data }));
  };

  const clearAdvertisementData = () => {
    dispatch(clearAdvertisement());
  };

  return { advertisementData, fetchAdvertisementData, clearAdvertisementData };
};

export default useAdvertisement;