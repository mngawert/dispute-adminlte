import { DOCUMENT_TYPE } from "../contexts/Constants";
import AdjustPlus from "./AdjustPlus";

const AdjustP3Plus = () => {
  return (
    <AdjustPlus documentType={DOCUMENT_TYPE.P3_PLUS} documentTypeName="P3+" initialAdjustmentTypeNames={['P3 +']} showAdjustmentTypeNamesFilter={false}  />
  );
}

export default AdjustP3Plus;
