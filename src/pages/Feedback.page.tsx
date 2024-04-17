import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { FStore, auth } from "../common/config/firebase/firebase.config";
import { useEffect, useState } from "react";
import { Button, Radio, Space, Spin, message } from "antd";
import styled from "styled-components";
import { FieldValueDTO } from "../types/input.type";
import { useNavigate, useParams } from "react-router-dom";
import {
  CurrentActiveFeedbackAtom,
  AtomLangauge,
} from "../store/atom/atom.store";
import { useRecoilValue } from "recoil";
import hindi from "../translation/hindi.json";
import english from "../translation/english.json";

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
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState([]);
  const [loader, setLoader] = useState(false);
  const [fieldValue, setFieldValue] = useState({});
  const currentActiveFeedback = useRecoilValue(CurrentActiveFeedbackAtom);
  const [totalPoints, setTotalPoints] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const langauge = useRecoilValue(AtomLangauge);
  const translation = langauge == "enUS" ? english : hindi;
  useEffect(() => {
    if (!currentActiveFeedback.id) {
      return navigate("/activefeedbackforms");
    }
    getFeedbackForm();
  }, [id]);
  useEffect(() => {
    if (submitted) AddData();
  }, [submitted]);
  const handleChange = (e: any) => {
    let { name, value } = e.target;

    setFieldValue((prev) => ({ ...prev, [name]: value }));
  };

  const getFeedbackForm = async () => {
    setLoader(true);
    const _data: any = [];
    const querySnapshot = await getDocs(collection(FStore, "FEEDBACK"));
    querySnapshot.forEach((doc) => {
      const x = doc.data();
      x.id = doc.id;
      _data.push(x);
    });
    setFormValue(_data as any);
    setDataLoaded(true);
    setLoader(false);
  };
  const handleSubmit = () => {
    setLoader(true);
    let hasError;
    Object.entries(formValue && formValue[0]["formData"]).forEach(([key]) => {
      if (!fieldValue.hasOwnProperty(key)) {
        setLoader(false);
        hasError = true;
        return;
      }
    });

    if (hasError) {
      setLoader(false);
      message.error("Please select an option for each question.");

      return;
    }
    setLoader(true);
    let totalPoints = 0;

    Object.entries(fieldValue).forEach(([question, selectedOption]) => {
      const questionData: FieldValueDTO = formValue[0]["formData"][question];
      const selectedOptionData: any = questionData.Options.find(
        (option: any) => option.value === selectedOption
      );
      if (selectedOptionData && selectedOptionData.point) {
        totalPoints += selectedOptionData.point;
      }
    });
    setTotalPoints(totalPoints);
    setSubmitted(true);
  };

  const AddData = async () => {
    const responseRef = doc(
      FStore,
      "RESPONSES",
      id as string,
      currentActiveFeedback.activeRound.id,
      currentActiveFeedback.activeParticipant.id as string
    );
    await setDoc(
      responseRef,
      {
        response: {
          participantDetail: {
            email: currentActiveFeedback.activeParticipant.email,
            name: currentActiveFeedback.activeParticipant.uname,
          },
          [auth.currentUser?.email as any]: {
            fieldValue: fieldValue,
            totalPoints: totalPoints,
          },
        },
      },
      { merge: true }
    )
      .then(() => {
        message.success("From Submitted Successfully");
        setLoader(false);
        navigate("/activefeedbackforms");
      })
      .catch((error) => {
        setLoader(false);
        message.error(error);
      });
  };

  return (
    <Spin spinning={loader} style={{ marginTop: "100px" }}>
      {dataLoaded && (
        <>
          <div style={{}}>
            <div>
              <h2>{`${currentActiveFeedback.selectedCompetition?.cname} ${translation.feedbackform}`}</h2>
            </div>
            <div>
              <div>
                <b>{translation.presentername}</b> :
                <span style={{ margin: "2px" }}></span>
                {currentActiveFeedback.activeParticipant?.uname}
              </div>
            </div>
            <div style={{ padding: "5px" }}></div>
            <div>{translation.feedbackdescription}</div>
          </div>
          <div style={{ padding: "5px" }}></div>
          {Object.entries(formValue && formValue[0]["formData"]).map(
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
                      <Space direction="vertical">
                        {value.Options.map((option: any) => (
                          <div>
                            <Radio value={option.value}>
                              <div>{option.value}</div>
                            </Radio>
                          </div>
                        ))}
                      </Space>
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
        </>
      )}
    </Spin>
  );
};

export default Feedback;
