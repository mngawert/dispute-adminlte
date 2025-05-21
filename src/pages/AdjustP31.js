import { DOCUMENT_TYPE } from "../contexts/Constants";
import AdjustMinusInvoice from "./AdjustMinusInvoice";

const AdjustP31 = () => {
  return (
    <AdjustMinusInvoice documentType={DOCUMENT_TYPE.P31} documentTypeName="P31" adjustmentTypeNames={['P31']}  />
  );
}

export default AdjustP31;
