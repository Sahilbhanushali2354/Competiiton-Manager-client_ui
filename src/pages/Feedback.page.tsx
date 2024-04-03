import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { FStore, auth } from "../common/config/firebase/firebase.config";
import { useEffect, useState } from "react";
import { Button, Radio, Spin, message } from "antd";
import styled from "styled-components";
import { FieldValueDTO } from "../types/input.type";
import { useParams } from "react-router-dom";
import { CurrentActiveFeedbackAtom } from "../store/atom/atom.store";
import { useRecoilValue } from "recoil";

const FeedbackContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const FeedbackItem = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
`;

const Feedback = () => {
  const { id } = useParams();

  const [formValue, setFormValue] = useState([]);
  const [loader, setLoader] = useState(false);
  const [fieldValue, setFieldValue] = useState({});
  const currentActiveFeedback = useRecoilValue(CurrentActiveFeedbackAtom);
  const [feedbackResponse, setFeedbackResponse] = useState({});
  useEffect(() => {
    getFeedbackForm();
  }, [id]);

  const handleChange = (e: any) => {
    let { name, value } = e.target;

    setFieldValue((prev) => ({ ...prev, [name]: value }));
  };

  const getFeedbackForm = async () => {
    const _data: any = [];
    const querySnapshot = await getDocs(collection(FStore, "FEEDBACK"));
    querySnapshot.forEach((doc) => {
      const x = doc.data();
      x.id = doc.id;
      console.log(doc.data());
      console.log(doc.id);
      _data.push(x);
    });
    setFormValue(_data as any);
    setLoader(true);
    console.log(Object.entries(_data[0]["formData"]));

    Object.entries(_data[0]["formData"]).map(([key, value]) => {
      console.log(key);
      console.log(value);
    });
  };
  const handleSubmit = () => {
    // const unansweredQuestions = Object.entries(fieldValue).filter(
    //   ([question, selectedOption]) => !selectedOption
    // );
    // console.log(typeof unansweredQuestions);
    // if (!unansweredQuestions.length) {
    //   message.error("Please select an option for each question.");
    //   return;
    // }

    for (const [question, answer] in fieldValue) {
      if (!fieldValue[answer] === "") {
        message.error("Please select an option for each question.");
        return;
      }
    }

    let totalPoints = 0;

    Object.entries(fieldValue).forEach(([question, selectedOption]) => {
      const questionData: FieldValueDTO = formValue[0]["formData"][question];
      const selectedOptionData: any = questionData.Options.find(
        (option: any) => option.value === selectedOption
      );
      if (selectedOptionData && selectedOptionData.point) {
        totalPoints += selectedOptionData.point;
      }
      setFeedbackResponse(totalPoints);
    });
    AddData();
  };

  const AddData = async () => {
    try {
      const responseRef = doc(
        FStore,
        "RESPONSES",
        id as string,
        currentActiveFeedback.selectedParticipant.activeRound.id,
        currentActiveFeedback.selectedParticipant.activeSelectedPartcipant
          .id as string
      );
      await setDoc(responseRef, {
        totalPoints: feedbackResponse,
        response: fieldValue,
        userEmail: auth.currentUser?.email,
      });

      console.log("Document successfully written!");
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  };
  return (
    <Spin spinning={!loader} style={{ marginTop: "100px" }}>
      <div style={{}}>
        <div>
          <h2>{`${currentActiveFeedback.selectedParticipant.selectedCompetition.cname} Feedback Form`}</h2>
        </div>
        <div>
          <div>
            <b>Presenter's Name</b> :{" "}
            {
              currentActiveFeedback.selectedParticipant.activeSelectedPartcipant
                .uname
            }
          </div>
        </div>
        <div style={{ padding: "5px" }}></div>
        <div>
          We value your honest feedback to ensure a fair evaluation of the
          presenter's performance. Your response to each question will help us
          gauge how effectively the presenter conveyed their message through
          their speech. Thank you for taking the time! We value your honest
          feedback to ensure a fair evaluation of the presenter's performance.
          Your response to each question will help us gauge how effectively the
          presenter conveyed their message through their speech. Than k you for
          taking the time!
        </div>
      </div>
      <div style={{ padding: "5px" }}></div>
      {loader &&
        Object.entries(formValue && formValue[0]["formData"]).map(
          ([key, value]: [string, any], index: number) => (
            <FeedbackContainer>
              <FeedbackItem>
                <span>
                  {`Question ${index + 1} .`}
                  <b>{key}</b>
                </span>
                <div style={{ padding: "5px" }}></div>
                <div>
                  <b>{value.Description}</b>
                </div>
                <div style={{ padding: "5px" }}></div>
                <div>
                  <Radio.Group onChange={handleChange} name={key}>
                    <div>
                      {value.Options.map((option: any) => (
                        <Radio value={option.value}>
                          <div>{option.value}</div>
                        </Radio>
                      ))}
                    </div>
                  </Radio.Group>
                </div>
              </FeedbackItem>
            </FeedbackContainer>
          )
        )}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button type="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </Spin>
  );
};

export default Feedback;
