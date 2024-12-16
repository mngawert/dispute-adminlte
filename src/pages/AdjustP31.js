import { DOCUMENT_TYPE } from "../contexts/Constants";
import AdjustMinus from "./AdjustMinus";

const AdjustP31 = () => {
  return (
    <AdjustMinus documentType={DOCUMENT_TYPE.P31} documentTypeName="P31" />
  );
}

export default AdjustP31;
