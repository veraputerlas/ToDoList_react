import { useCallback, useEffect, useMemo, useState } from "react";
import { timeList } from "./utils";
import "./todoList.css";

function TodoListFunc(props) {
  const [select, setSelect] = useState(6);
  const [inputValue, setInputValue] = useState("");
  const [recordList, setRecordList] = useState([]);

  function addRecord() {
    const currentTime = recordList.find((record) => record.time === select);
    if (inputValue !== "" && currentTime === undefined) {
      setRecordList([...recordList, { time: select, notice: inputValue }]);
      setLocalStorage(select, inputValue);
    }
    if (currentTime !== undefined) {
      const newRecordList = recordList
        .map((record) => {
          if (record.time === select) {
            return { time: record.time, notice: inputValue };
          }
          return record;
        })
        .sort((a, b) => a.time - b.time);
      setRecordList(newRecordList);
      setLocalStorage(select, inputValue);
    }
    return;
  }

  useEffect(() => {
    initialRecordList();
  }, []);

  const result = useMemo(() => {
    return recordList.filter((record) => record.time === select);
  });

  const result2 = useCallback(() => {
    return recordList.filter((record) => record.time === select);
  });

  function deleteRecord(time) {
    const newRecordList = recordList.filter((record) => record.time !== time);
    setRecordList(newRecordList);
    deleteLocalStorage(time);
  }

  function setLocalStorage(key, title) {
    localStorage.setItem(`record_${key}`, JSON.stringify(title));
  }
  function getLocalStorage(key) {
    const record = JSON.parse(localStorage.getItem(`record_${key}`));
    return record;
  }
  function deleteLocalStorage(key) {
    localStorage.removeItem(`record_${key}`);
  }

  function initialRecordList() {
    const newRecordList = [];
    for (let i = 0; i < timeList.length; i++) {
      const localValue = getLocalStorage(timeList[i].time);
      if (localValue !== null) {
        newRecordList.push({ time: timeList[i].time, notice: localValue });
      }
    }
    setRecordList(newRecordList);
  }
  return (
    <div className="todo-list">
      <div className="todo-list__wrapper">
        <Select value={select} setSelect={setSelect} />
        <Input value={inputValue} setInput={setInputValue} />
        <Button addRecord={addRecord} />
      </div>

      <List
        recordList={recordList}
        setRecordList={setRecordList}
        deleteRecord={deleteRecord}
      />
    </div>
  );
}

const Select = ({ value, setSelect }) => {
  return (
    <select
      onChange={(e) => setSelect(e.target.value)}
      value={value}
      className="select"
    >
      {timeList.map((record) => {
        return (
          <option key={record.time} value={record.time}>
            {record.time}.00
          </option>
        );
      })}
    </select>
  );
};
const Input = ({ setInput }) => {
  return (
    <input
      className="record-input"
      placeholder="Ведите задачу!"
      type="text"
      onInput={(e) => setInput(e.target.value)}
    />
  );
};
const Button = ({ addRecord }) => {
  return (
    <button onClick={() => addRecord()} className="record-btn-add">
      Добавить!
    </button>
  );
};
const List = ({ recordList, deleteRecord }) => {
  let newRecordlist = [];
  if (recordList !== []) {
    newRecordlist = recordList.map((record) => {
      return (
        <div className="record" key={record.time}>
          <div className="time">{record.time}.00</div>
          <div className="notice">{record.notice}</div>
          <button className="delete" onClick={() => deleteRecord(record.time)}>
            x
          </button>
        </div>
      );
    });
  }

  return <div className="list">{newRecordlist} </div>;
};

export default TodoListFunc;