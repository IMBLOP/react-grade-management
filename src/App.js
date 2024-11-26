import React, { useState } from "react";
import GradeTable from "./components/GradeTable"; // 성적 테이블 컴포넌트
import PopupForm from "./components/PopupForm"; // 성적 추가 팝업 폼 컴포넌트
import "./App.css"; // CSS 파일 추가

const App = () => {
  const [selectedYear, setSelectedYear] = useState("1학년"); // 선택된 학년
  const [gradesByYear, setGradesByYear] = useState({
    "1학년": [],
    "2학년": [],
    "3학년": [],
  });
  const [selectedRows, setSelectedRows] = useState([]); // 체크된 행 ID 저장
  const [showPopup, setShowPopup] = useState(false); // 팝업 표시 상태
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setSelectedRows([]); // 학년 변경 시 체크박스 초기화
  };

  const handleAddGrade = (newGrade) => {
    const currentGrades = gradesByYear[selectedYear];

    const calculateGrade = (total, grade) => {
      if (grade.학점 === "1") return grade.성적;
      if (total >= 95) return "A+";
      if (total >= 90) return "A0";
      if (total >= 85) return "B+";
      if (total >= 80) return "B0";
      if (total >= 75) return "C+";
      if (total >= 70) return "C0";
      if (total >= 60) return "D+";
      return "F";
    };

    const calculateTotal = (grade) =>
      parseInt(grade.출석점수 || 0) +
      parseInt(grade.과제점수 || 0) +
      parseInt(grade.중간고사 || 0) +
      parseInt(grade.기말고사 || 0);

    const existingGrade = currentGrades.find(
      (grade) => grade.과목명 === newGrade.과목명
    );

    if (existingGrade) {
      if (existingGrade.성적 === "F") {
        setGradesByYear((prevGrades) => ({
          ...prevGrades,
          [selectedYear]: prevGrades[selectedYear].map((grade) =>
            grade.과목명 === newGrade.과목명
              ? {
                  id: grade.id, // 기존 ID 유지
                  ...newGrade, // 새로운 과목 데이터로 덮어쓰기
                  총점: calculateTotal(newGrade),
                  성적: calculateGrade(calculateTotal(newGrade), newGrade),
                }
              : grade
          ),
        }));
        setErrorMessage(""); // 에러 초기화
        setShowPopup(false); // 팝업 닫기
      } else {
        setErrorMessage("이미 등록된 과목입니다.");
      }
    } else {
      const total = calculateTotal(newGrade);
      const gradeLetter = calculateGrade(total, newGrade);

      setGradesByYear((prevGrades) => ({
        ...prevGrades,
        [selectedYear]: [
          ...prevGrades[selectedYear],
          {
            id: Date.now(), // 새로운 과목 ID (현재 시간으로 고유 ID 생성)
            ...newGrade, // 새 과목 데이터
            총점: total, // 계산된 총점
            성적: gradeLetter, // 계산된 성적
          },
        ],
      }));
      setErrorMessage(""); // 에러 초기화
      setShowPopup(false); // 팝업 닫기
    }
  };

  const handleDeleteSelectedRows = () => {
    setGradesByYear((prevGrades) => ({
      ...prevGrades,
      [selectedYear]: prevGrades[selectedYear].filter(
        (grade) => !selectedRows.includes(grade.id)
      ),
    }));
    setSelectedRows([]); // 선택 초기화
  };

  const handleShowPopup = () => setShowPopup(true);

  const handleHidePopup = () => setShowPopup(false);

  return (
    <div className="App">
      <h1>성적 관리 시스템</h1>
      <h3>202044099 곽대혁</h3>
      <div className="button-container">
        <select value={selectedYear} onChange={handleYearChange}>
          <option value="1학년">1학년</option>
          <option value="2학년">2학년</option>
          <option value="3학년">3학년</option>
        </select>
        <div className='btn-group'>
          <button className="add-btn" onClick={handleShowPopup}>
            추가
          </button>
          <button className="delete-btn" onClick={handleDeleteSelectedRows}>
            삭제
          </button>
          <button className="save-btn">저장</button>
        </div>
      </div>
      <GradeTable
        grades={gradesByYear[selectedYear]} // 선택된 학년의 성적 데이터 전달
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
      {showPopup && (
        <PopupForm
          onClose={handleHidePopup} // 팝업 닫기
          onSubmit={handleAddGrade} // 성적 추가 함수 전달
        />
      )}
      <div
        className={`modal ${errorMessage ? "show" : ""}`}
        onClick={() => setErrorMessage("")}
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3>오류</h3>
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>확인</button>
        </div>
      </div>
    </div>
  );
};

export default App;
