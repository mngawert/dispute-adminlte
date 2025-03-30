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
                      <li>ระบบปรับปรุงบิล (Web Adjustor) เปิดใช้งาน P35,P36 ในวันที่ 9 มี.ค. 2568</li>
                    </ul>
                    <h5>เอกสาร Download :</h5>
                    <ul>
                      <li>
                        <a href="/files/presentation_p35_p36.pdf" target="_blank" rel="noopener noreferrer">
                          เอกสารนำเสนอ ระบบปรับปรุงบิล (Web Adjustor) P35, P36
                        </a>
                      </li>
                      <li>
                        <a href="/files/user_manual_p35_p36.pdf" target="_blank" rel="noopener noreferrer">
                          คู่มือการใช้งาน ระบบปรับปรุงบิล (Web Adjustor) P35, P36
                        </a>
                      </li>
                      <li>
                        <a href="/files/username_password_form.pdf" target="_blank" rel="noopener noreferrer">
                          แบบฟอร์มขอ Username/Password Adjustment
                        </a>
                      </li>
                    </ul>
                    <h5>ระเบียบ/วิธีปฏิบัติ :</h5>
                    <ul>
                      <li>
                        <a href="/files/procedure_web_adjustor.pdf" target="_blank" rel="noopener noreferrer">
                          วิธีปฏิบัติ ระบบปรับปรุงบิล (Web Adjustor)
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
