import { BeatLoader } from "react-spinners";
import { SpinnerWrapper } from "./styles";
import { useLoading } from "../../contexts/LoadingContext";

export const Spinner = () => {
  const { isLoading } = useLoading();
  return (
    <SpinnerWrapper>
      {isLoading && <BeatLoader color="#36d7b7"></BeatLoader>}
    </SpinnerWrapper>
  );
};
