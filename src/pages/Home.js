import React from "react";
import ContentHeader from "../components/ContentHeader";

export default function Home() {
  console.log("process.env.REACT_APP_API_URL", process.env);

  return (
    <>
      <ContentHeader title="Home" />
      
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="invoice p-3 mb-3">
                <div className="row">
                  <div className="col-12">
                    <h4>
                      <i className="fas fa-globe" /> ระบบปรับปรุงบิล (Web Adjustor)
                      <small className="float-right">Date: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</small>
                    </h4>
                    <br />
                  </div>
                </div>
                <div className="row ml-4">
                  <div className="col-12">
                    <h5>ข่าวสาร/ประชาสัมพันธ์ :</h5>
                    <ul>
                      <li>ระบบปรับปรุงบิล (Web Adjustor) เปิดใช้งาน Adjust+,Adjust-,P3+,P3-,B1+/-,รายงาน  ในวันที่ 11 กันยายน 2568</li>
                      <li>ระบบปรับปรุงบิล (Web Adjustor) เปิดใช้งาน P35,P36 ในวันที่ 23 เม.ย. 2568</li>
                    </ul>
                    <h5>เอกสาร Download :</h5>
                    <ul>
                      <li>
                        <a href="/NTAdjustor/files/Adjust_Ph2_present_100868.pdf" target="_blank" rel="noopener noreferrer">
                          เอกสารนำเสนอระบบปรับปรุงบิล Adjust+,Adjust-,P3+,P3-,B1+/-,รายงาน 
                        </a>
                      </li>
                      <li>
                        <a href="/NTAdjustor/files/NT_Adjustment_Manual_Ph2_User.pdf" target="_blank" rel="noopener noreferrer">
                          คู่มือการใช้งานระบบปรับปรุงบิล Adjust+,Adjust-,P3+,P3-,B1+/- ,รายงาน
                        </a>
                      </li>                      
                      <li>
                        <a href="/NTAdjustor/files/adj_present220468_intro.pdf" target="_blank" rel="noopener noreferrer">
                          เอกสารนำเสนอระบบปรับปรุงบิล (Web Adjustor) P35, P36
                        </a>
                      </li>
                      <li>
                        <a href="/NTAdjustor/files/adj_present220468_use.pdf" target="_blank" rel="noopener noreferrer">
                          เอกสารการใช้งานระบบปรับปรุงบิล (Web Adjustor) P35, P36
                        </a>
                      </li>
                      <li>
                        <a href="/NTAdjustor/files/adj_present_p35p36220468_manual.pdf" target="_blank" rel="noopener noreferrer">
                          คู่มือการใช้งานระบบปรับปรุงบิล (Web Adjustor) P35, P36
                        </a>
                      </li>
                      <li>
                        <a href="/NTAdjustor/files/Adjust_user_password.doc" target="_blank" rel="noopener noreferrer">
                          แบบฟอร์มขอ Username/Password Adjustment
                        </a>
                      </li>
                    </ul>
                    <h5>Streaming สอนการใช้งานระบบปรับปรุงบิล :</h5>
                    <ul>
                      <li>
                        <a href="/NTAdjustor/files/Login_P35P36.mp4" target="_blank" rel="noopener noreferrer">
                          การเข้าใช้งานระบบปรับปรุงบิล
                        </a>
                      </li>
                      <li>
                        <a href="/NTAdjustor/files/CreateP36Usage.mp4" target="_blank" rel="noopener noreferrer">
                          การสร้าง Create รายการปรับปรุงบิล P35, P36
                        </a>
                      </li>                      
                      <li>
                        <a href="/NTAdjustor/files/ReviewApproveAdjustment.mp4" target="_blank" rel="noopener noreferrer">
                          การใช้งาน Review, Approval P35, P36
                        </a>
                      </li>
                    </ul>
                    <h5>ระเบียบ/วิธีปฏิบัติ :</h5>
                    <ul>
                      <li>
                        <a href="/NTAdjustor/files/order_business_P31_P32.pdf" target="_blank" rel="noopener noreferrer">
                        หลักเกณฑ์การบันทึกรายการรายการปรับปรุงบิล โดย P31/P31M (เดิม)
                        </a>
                      </li>
                    </ul>
                    <h5>ติดต่อ ประสานงาน :</h5>
                    <ul>
                      <li>งาน User ผู้ใช้งาน ติดต่อ : 02 505 2217</li>
                      <li>ปัญหาการใช้งานระบบ ติดต่อ : 02 574 8544 (พรชัย), 02 574 8216 (นำพล)</li>
                      <li>ก่อน Adjust+ กรุณาติดต่อกลับ ติดต่อ : 02 574 8544 (พรชัย), 02 574 8927 (ศิริฤทัย), 02 575 5427 (สุลาวรรณ)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
