import { DOCUMENT_TYPE } from "../contexts/Constants";
import AdjustMinus from "./AdjustMinus";

const AdjustP32 = () => {
  return (
    <AdjustMinus documentType={DOCUMENT_TYPE.P32} documentTypeName="P32" />
  );
}

export default AdjustP32;
