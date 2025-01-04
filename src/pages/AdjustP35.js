import { DOCUMENT_TYPE } from "../contexts/Constants";
import AdjustMinus from "./AdjustMinus";

const AdjustP35 = () => {
  return (
    <AdjustMinus documentType={DOCUMENT_TYPE.P35} documentTypeName="P35" />
  );
}

export default AdjustP35;
