import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

const NatDataList = () => {
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedRespondent, setEditedRespondent] = useState("");
  const [editedAge, setEditedAge] = useState("");
  const [editedSex, setEditedSex] = useState("");
  const [editedEthnic, setEditedEthnic] = useState("");
  const [editedAcademicPerformance, setEditedAcademicPerformance] = useState("");
  const [editedAcademicDescription, setEditedAcademicDescription] = useState("");
  const [editedIq, setEditedIq] = useState("");
  const [editedTypeSchool, setEditedTypeSchool] = useState("");
  const [editedSocioEconomicStatus, setEditedSocioEconomicStatus] = useState("");
  const [editedStudyHabit, setEditedStudyHabit] = useState("");
  const [editedNatResults, setEditedNatResults] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "natData"));
      const dataList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(dataList);
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "natData", id));
      alert("Data deleted successfully!");
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      alert("Error deleting document: ", error);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setEditedRespondent(item.respondent);
    setEditedAge(item.age);
    setEditedSex(item.sex);
    setEditedEthnic(item.ethnic);
    setEditedAcademicPerformance(item.academicPerformance);
    setEditedAcademicDescription(item.academicDescription);
    setEditedIq(item.iq);
    setEditedTypeSchool(item.typeSchool);
    setEditedSocioEconomicStatus(item.socioEconomicStatus);
    setEditedStudyHabit(item.studyHabit);
    setEditedNatResults(item.natResults);
  };

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, "natData", editId);
      await updateDoc(docRef, {
        respondent: editedRespondent,
        age: editedAge,
        sex: editedSex,
        ethnic: editedEthnic,
        academicPerformance: editedAcademicPerformance,
        academicDescription: editedAcademicDescription,
        iq: editedIq,
        typeSchool: editedTypeSchool,
        socioEconomicStatus: editedSocioEconomicStatus,
        studyHabit: editedStudyHabit,
        natResults: editedNatResults,
      });
      alert("Data updated successfully!");
      setEditId(null);
      setEditedRespondent("");
      setEditedAge("");
      setEditedSex("");
      setEditedEthnic("");
      setEditedAcademicPerformance("");
      setEditedAcademicDescription("");
      setEditedIq("");
      setEditedTypeSchool("");
      setEditedSocioEconomicStatus("");
      setEditedStudyHabit("");
      setEditedNatResults("");
      setData(
        data.map((item) =>
          item.id === editId
            ? {
                ...item,
                respondent: editedRespondent,
                age: editedAge,
                sex: editedSex,
                ethnic: editedEthnic,
                academicPerformance: editedAcademicPerformance,
                academicDescription: editedAcademicDescription,
                iq: editedIq,
                typeSchool: editedTypeSchool,
                socioEconomicStatus: editedSocioEconomicStatus,
                studyHabit: editedStudyHabit,
                natResults: editedNatResults,
              }
            : item
        )
      );
    } catch (error) {
      alert("Error updating document: ", error);
    }
  };

  return (
    <div>
      <h2>List of NAT Data</h2>
      <table>
        <thead>
          <tr>
            <th>Respondent</th>
            <th>Age</th>
            <th>Sex</th>
            <th>Ethnic</th>
            <th>Academic Performance</th>
            <th>Academic Description</th>
            <th>IQ</th>
            <th>Type of School</th>
            <th>Socio-Economic Status</th>
            <th>Study Habit</th>
            <th>NAT Results</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.respondent}</td>
              <td>{item.age}</td>
              <td>{item.sex}</td>
              <td>{item.ethnic}</td>
              <td>{item.academicPerformance}</td>
              <td>{item.academicDescription}</td>
              <td>{item.iq}</td>
              <td>{item.typeSchool}</td>
              <td>{item.socioEconomicStatus}</td>
              <td>{item.studyHabit}</td>
              <td>{item.natResults}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editId && (
        <div>
          <h3>Edit NAT Data</h3>
          <form onSubmit={handleUpdate}>
            <label>
              Respondent:
              <input
                type="text"
                value={editedRespondent}
                onChange={(e) => setEditedRespondent(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Age:
              <input
                type="number"
                value={editedAge}
                onChange={(e) => setEditedAge(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Sex:
              <input
                type="text"
                value={editedSex}
                onChange={(e) => setEditedSex(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Ethnic:
              <input
                type="text"
                value={editedEthnic}
                onChange={(e) => setEditedEthnic(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Academic Performance:
              <input
                type="text"
                value={editedAcademicPerformance}
                onChange={(e) => setEditedAcademicPerformance(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Academic Description:
              <input
                type="text"
                value={editedAcademicDescription}
                onChange={(e) => setEditedAcademicDescription(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              IQ:
              <input
                type="number"
                value={editedIq}
                onChange={(e) => setEditedIq(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Type of School:
              <input
                type="text"
                value={editedTypeSchool}
                onChange={(e) => setEditedTypeSchool(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Socio-Economic Status:
              <input
                type="text"
                value={editedSocioEconomicStatus}
                onChange={(e) => setEditedSocioEconomicStatus(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Study Habit:
              <input
                type="text"
                value={editedStudyHabit}
                onChange={(e) => setEditedStudyHabit(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              NAT Results:
              <input
                type="text"
                value={editedNatResults}
                onChange={(e) => setEditedNatResults(e.target.value)}
                required
              />
            </label>
            <br />
            <button type="submit">Update Data</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default NatDataList;
