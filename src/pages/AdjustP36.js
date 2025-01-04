import { DOCUMENT_TYPE } from "../contexts/Constants";
import AdjustMinus from "./AdjustMinus";

const AdjustP36 = () => {
  return (
    <AdjustMinus documentType={DOCUMENT_TYPE.P36} documentTypeName="P36" />
  );
}

export default AdjustP36;
