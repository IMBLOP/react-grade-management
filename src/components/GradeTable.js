import React from "react";
import './GradeTable.css'; // CSS 파일 임포트

const GradeTable = ({ grades, selectedRows, setSelectedRows }) => {
  // 체크박스 선택 처리
  const handleCheckboxChange = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((rowId) => rowId !== id)
        : [...prevSelectedRows, id]
    );
  };

  // 총점 계산 (학점이 1인 경우 점수 계산하지 않음)
  const calculateTotal = (grade) => {
    if (grade.학점 === "1") {
      return 0; // 학점이 1인 경우 총점은 0으로 처리
    }
    return (
      parseInt(grade.출석점수 || 0) +
      parseInt(grade.과제점수 || 0) +
      parseInt(grade.중간고사 || 0) +
      parseInt(grade.기말고사 || 0)
    );
  };

  // 성적 계산
  const calculateGrade = (total) => {
    if (total >= 95) return "A+";
    if (total >= 90) return "A0";
    if (total >= 85) return "B+";
    if (total >= 80) return "B0";
    if (total >= 75) return "C+";
    if (total >= 70) return "C0";
    if (total >= 60) return "D+";
    return "F";
  };

  // 합계 계산 (학점이 1인 과목은 점수에서 제외하지만 학점 총합에는 포함)
  const totals = grades.reduce(
    (acc, grade) => {
      const total = calculateTotal(grade);
      acc.학점 += parseInt(grade.학점 || 0); // 학점 총합에 학점 1인 과목도 포함
      if (grade.학점 !== "1") {  // 학점이 1인 과목은 점수 계산에만 영향을 미침
        acc.출석점수 += parseInt(grade.출석점수 || 0);
        acc.과제점수 += parseInt(grade.과제점수 || 0);
        acc.중간고사 += parseInt(grade.중간고사 || 0);
        acc.기말고사 += parseInt(grade.기말고사 || 0);
        acc.총점 += total;
        acc.과목수 += 1; // 학점이 1이 아닌 과목만 과목 수에 포함
      }
      return acc;
    },
    {
      학점: 0,
      출석점수: 0,
      과제점수: 0,
      중간고사: 0,
      기말고사: 0,
      총점: 0,
      과목수: 0, // 학점이 1인 과목 제외한 과목 수
    }
  );

  // 평균 계산 (학점이 1인 과목을 제외하고 계산)
  const averageScore = totals.과목수 > 0 ? totals.총점 / totals.과목수 : 0;
  const totalGrade = calculateGrade(averageScore);

  // 과목 추가 후 정렬된 grades 반환
  const sortedGrades = [...grades].sort((a, b) => {
    if (a.이수 !== b.이수) {
      return a.이수.localeCompare(b.이수); // 이수 기준 정렬
    } else if (a.필수 !== b.필수) {
      return a.필수.localeCompare(b.필수); // 필수 기준 정렬
    } else {
      return a.과목명.localeCompare(b.과목명); // 과목명 기준 정렬
    }
  });

  return (
    <table>
      <thead>
        <tr>
          <th>선택</th>
          <th>이수</th>
          <th>필수</th>
          <th>과목명</th>
          <th>학점</th>
          <th>출석점수</th>
          <th>과제점수</th>
          <th>중간고사</th>
          <th>기말고사</th>
          <th>총점</th>
          <th>평균</th>
          <th>성적</th>
        </tr>
      </thead>
      <tbody>
        {sortedGrades.map((grade) => {
          const total = calculateTotal(grade); // 총점 계산
          const gradeValue = grade.학점 === "1" ? grade.성적 : calculateGrade(total);

          return (
            <tr key={grade.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(grade.id)}
                  onChange={() => handleCheckboxChange(grade.id)}
                />
              </td>
              <td>{grade.이수}</td>
              <td>{grade.필수}</td>
              <td className="left-align">{grade.과목명}</td> 
              <td>{grade.학점}</td>
              <td>{grade.학점 === "1" ? "-" : grade.출석점수}</td>
              <td>{grade.학점 === "1" ? "-" : grade.과제점수}</td>
              <td>{grade.학점 === "1" ? "-" : grade.중간고사}</td>
              <td>{grade.학점 === "1" ? "-" : grade.기말고사}</td>
              <td>{grade.학점 === "1" ? "-" : total}</td>
              <td>-</td>
              <td className={grade.학점 === "1" ? "" : total === 0 ? "red" : ""}>
                {gradeValue}
              </td>
            </tr>
          );
        })}
        {/* 합계 행 */}
        <tr>
          <td colSpan="4">합계</td>
          <td>{totals.학점}</td>
          <td>{totals.출석점수}</td>
          <td>{totals.과제점수}</td>
          <td>{totals.중간고사}</td>
          <td>{totals.기말고사}</td>
          <td>{totals.총점}</td>
          <td>{totals.과목수 > 0 ? (totals.총점 / totals.과목수).toFixed(2) : 0}</td>
          <td className={totalGrade === "F" ? "red" : ""}>{totalGrade}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default GradeTable;
