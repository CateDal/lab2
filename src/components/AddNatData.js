import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const AddNatData = () => {
  const [respondent, setRespondent] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [ethnic, setEthnic] = useState("");
  const [academicPerformance, setAcademicPerformance] = useState("");
  const [academicDescription, setAcademicDescription] = useState("");
  const [iq, setIq] = useState("");
  const [typeSchool, setTypeSchool] = useState("");
  const [socioEconomicStatus, setSocioEconomicStatus] = useState("");
  const [studyHabit, setStudyHabit] = useState("");
  const [natResults, setNatResults] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "natData"), {
        respondent,
        age,
        sex,
        ethnic,
        academicPerformance,
        academicDescription,
        iq,
        typeSchool,
        socioEconomicStatus,
        studyHabit,
        natResults,
      });
      alert("Data added successfully!");
      setRespondent("");
      setAge("");
      setSex("");
      setEthnic("");
      setAcademicPerformance("");
      setAcademicDescription("");
      setIq("");
      setTypeSchool("");
      setSocioEconomicStatus("");
      setStudyHabit("");
      setNatResults("");
    } catch (error) {
      alert("Error adding document: ", error);
    }
  };

  return (
    <div>
      <h2>Add New NAT Data</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Respondent:
          <input
            type="text"
            value={respondent}
            onChange={(e) => setRespondent(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Age:
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Sex:
          <input
            type="text"
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Ethnic:
          <input
            type="text"
            value={ethnic}
            onChange={(e) => setEthnic(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Academic Performance:
          <input
            type="text"
            value={academicPerformance}
            onChange={(e) => setAcademicPerformance(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Academic Description:
          <input
            type="text"
            value={academicDescription}
            onChange={(e) => setAcademicDescription(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          IQ:
          <input
            type="number"
            value={iq}
            onChange={(e) => setIq(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Type of School:
          <input
            type="text"
            value={typeSchool}
            onChange={(e) => setTypeSchool(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Socio-Economic Status:
          <input
            type="text"
            value={socioEconomicStatus}
            onChange={(e) => setSocioEconomicStatus(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Study Habit:
          <input
            type="text"
            value={studyHabit}
            onChange={(e) => setStudyHabit(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          NAT Results:
          <input
            type="text"
            value={natResults}
            onChange={(e) => setNatResults(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Add Data</button>
      </form>
    </div>
  );
};

export default AddNatData;
