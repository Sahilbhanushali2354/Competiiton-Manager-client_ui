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
        {allActiveFeedback.map((activeFeedback) => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "5px",
            }}
          >
            {activeFeedback.selectedCompetition?.cname &&
            activeFeedback.activeParticipant?.uname &&
            activeFeedback.activeRound?.label ? (
              <Card
                style={{ width: "100%" }}
                key={activeFeedback.activeRound.id}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <div>
                      <b>Competition Name : </b>
                      {activeFeedback.selectedCompetition.cname}
                    </div>
                    <div>
                      <b>Participant Name : </b>
                      {activeFeedback.activeParticipant.uname}
                    </div>
                    <div>
                      <b>Active Round : </b>
                      {activeFeedback.activeRound.label}
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Link
                      to={`/activefeedbackforms/new/${activeFeedback.id}`}
                      onClick={() => setCurrentActiveFeedback(activeFeedback)}
                    >
                      <Button type="primary" style={{ width: "100%" }}>
                        Give Feedback
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ) : null}
          </div>
        ))}
      </div>
    </Spin>
  );
};

export default ActiveFeedbacks;
