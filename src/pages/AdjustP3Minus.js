import { DOCUMENT_TYPE } from "../contexts/Constants";
import AdjustMinusInvoice from "./AdjustMinusInvoice";

const AdjustP3Minus = () => {
  return (
    <AdjustMinusInvoice documentType={DOCUMENT_TYPE.P3_MINUS} documentTypeName="P3-" adjustmentTypeNames={['P3 -']}  />
  );
}

export default AdjustP3Minus;
