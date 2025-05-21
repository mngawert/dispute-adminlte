import { DOCUMENT_TYPE } from "../contexts/Constants";
import AdjustMinusInvoice from "./AdjustMinusInvoice";

const AdjustP32 = () => {
  return (
    <AdjustMinusInvoice documentType={DOCUMENT_TYPE.P32} documentTypeName="P32" adjustmentTypeNames={['P32']} />
  );
}

export default AdjustP32;
