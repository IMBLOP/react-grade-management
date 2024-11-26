import React, { useState, useEffect } from "react";
import "./AddGradePopup.css"; // CSS 파일 추가

const AddGradePopup = ({ onClose, onSubmit }) => {
  const [newGrade, setNewGrade] = useState({
    이수: "교양",
    필수: "필수",
    과목명: "",
    학점: 0,
    출석점수: "0",
    과제점수: "0",
    중간고사: "0",
    기말고사: "0",
    성적: "P", // 기본 성적은 P로 설정
  });

  // 학점 값이 변경될 때마다 필드 업데이트
  useEffect(() => {
    if (newGrade.학점 === "1") {
      setNewGrade((prev) => ({
        ...prev,
        출석점수: "0",
        과제점수: "0",
        중간고사: "0",
        기말고사: "0",
        성적: "P", // 기본 성적은 P로 설정
      }));
    }
  }, [newGrade.학점]);

  // 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGrade((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 범위 제한을 적용한 값 처리
  const handleLimitRange = (e, min, max) => {
    let value = parseInt(e.target.value);
    if (value < min) value = min;
    if (value > max) value = max;
    e.target.value = value;
    handleChange(e);
  };

  // 입력필드 포커스 시 0 지우기
  const handleFocus = (e) => {
    if (e.target.value === "0") {
      e.target.value = "";
    }
  };

  // 입력필드 포커스 아웃 시 0으로 설정
  const handleBlur = (e) => {
    if (e.target.value === "") {
      e.target.value = "0";
    }
  };

  // 과목 추가 처리
  const handleAddGrade = () => {
    onSubmit(newGrade); // 부모 컴포넌트로 데이터 전달
    onClose(); // 팝업 닫기
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>과목 추가</h2>
        <div className="popup-form">
          <label>
            이수:
            <select name="이수" value={newGrade.이수} onChange={handleChange}>
              <option value="교양">교양</option>
              <option value="전공">전공</option>
            </select>
          </label>
          <label>
            필수:
            <select name="필수" value={newGrade.필수} onChange={handleChange}>
              <option value="필수">필수</option>
              <option value="선택">선택</option>
            </select>
          </label>
          <label>
            과목명:
            <input
              type="text"
              name="과목명"
              value={newGrade.과목명}
              onChange={handleChange}
            />
          </label>
          <label>
            학점:
            <input
              type="number"
              name="학점"
              value={newGrade.학점}
              onChange={handleChange}
              onFocus={handleFocus}  // 포커스 시 0 지우기
              onBlur={handleBlur}    // 포커스 아웃 시 0으로 설정
            />
          </label>

          {/* 학점이 1인 경우 성적 선택 (P/NP) */}
          {newGrade.학점 === "1" ? (
            <label>
              성적:
              <select
                name="성적"
                value={newGrade.성적}
                onChange={handleChange}
              >
                <option value="P">P</option>
                <option value="NP">NP</option>
              </select>
            </label>
          ) : null}

          {/* 학점이 2 이상인 경우 점수 입력 필드 */}
          {newGrade.학점 >= 2 ? (
            <>
              <label>
                출석점수:
                <input
                  type="number"
                  name="출석점수"
                  value={newGrade.출석점수}
                  onChange={(e) => handleLimitRange(e, 0, 20)}  // 출석점수 범위 제한
                  onFocus={handleFocus}  // 포커스 시 0 지우기
                  onBlur={handleBlur}    // 포커스 아웃 시 0으로 설정
                />
              </label>
              <label>
                과제점수:
                <input
                  type="number"
                  name="과제점수"
                  value={newGrade.과제점수}
                  onChange={(e) => handleLimitRange(e, 0, 20)}  // 과제점수 범위 제한
                  onFocus={handleFocus}  // 포커스 시 0 지우기
                  onBlur={handleBlur}    // 포커스 아웃 시 0으로 설정
                />
              </label>
              <label>
                중간고사:
                <input
                  type="number"
                  name="중간고사"
                  value={newGrade.중간고사}
                  onChange={(e) => handleLimitRange(e, 0, 30)}  // 중간고사 범위 제한
                  onFocus={handleFocus}  // 포커스 시 0 지우기
                  onBlur={handleBlur}    // 포커스 아웃 시 0으로 설정
                />
              </label>
              <label>
                기말고사:
                <input
                  type="number"
                  name="기말고사"
                  value={newGrade.기말고사}
                  onChange={(e) => handleLimitRange(e, 0, 30)}  // 기말고사 범위 제한
                  onFocus={handleFocus}  // 포커스 시 0 지우기
                  onBlur={handleBlur}    // 포커스 아웃 시 0으로 설정
                />
              </label>
            </>
          ) : null}
        </div>
        <div className="popup-buttons">
          <button onClick={onClose}>닫기</button>
          <button onClick={handleAddGrade}>추가</button>
        </div>
      </div>
    </div>
  );
};

export default AddGradePopup;
