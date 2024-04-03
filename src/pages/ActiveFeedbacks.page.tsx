import { collection, query, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FStore } from "../common/config/firebase/firebase.config";
import { Button, Card, Spin } from "antd";
import { Link } from "react-router-dom";
import { AllActiveFeedbackDTO } from "../types/input.type";
import { CurrentActiveFeedbackAtom } from "../store/atom/atom.store";
import { useRecoilState } from "recoil";

const ActiveFeedbacks = () => {
  useEffect(() => {
    const unsubscribe = fetchAllActiveFeedback();
    return () => unsubscribe();
  }, []);
  const [loader, setLoader] = useState(false);
  const [allActiveFeedback, setAllActiveFeedback] = useState<
    AllActiveFeedbackDTO[]
  >([] as AllActiveFeedbackDTO[]);
  const [currentActiveFeedback, setCurrentActiveFeedback] = useRecoilState(
    CurrentActiveFeedbackAtom
  );

  const fetchAllActiveFeedback = () => {
    console.log(currentActiveFeedback);

    setLoader(true);
    const q = query(collection(FStore, "DEFAULT"));
    return onSnapshot(q, (snapshot) => {
      let _allActiveFeedback: any = [] as any;
      snapshot.forEach((doc) => {
        const _data = doc.data();
        console.log(_data);

        _data.id = doc.id;
        _allActiveFeedback.push(_data as any);
      });
      setAllActiveFeedback(_allActiveFeedback);
      setLoader(false);
    });
  };
  return (
    <Spin spinning={loader}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {allActiveFeedback.map((feedback) => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "5px",
            }}
          >
            <Card key={feedback.selectedParticipant.activeRound.id}>
              <div>
                <div>
                  <b>Competition Name : </b>
                  {feedback.selectedParticipant.selectedCompetition.cname}
                </div>
                <div>
                  <b>Participant Name : </b>
                  {feedback.selectedParticipant.activeSelectedPartcipant.uname}
                </div>
                <div>
                  <b>Active Round : </b>
                  {feedback.selectedParticipant.activeRound.label}
                </div>
              </div>
            </Card>

            <Link
              to={`/activefeedbackforms/new/${feedback.id}`}
              onClick={() => setCurrentActiveFeedback(feedback)}
            >
              <Button>Give Feedback</Button>
            </Link>
          </div>
        ))}
      </div>
    </Spin>
  );
};

export default ActiveFeedbacks;
