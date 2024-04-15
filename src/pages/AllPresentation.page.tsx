import { collection, onSnapshot, query, where } from "firebase/firestore";
import { FStore } from "../common/config/firebase/firebase.config";
import { PresentationDTO } from "../types/input.type";
import { useEffect, useState } from "react";
import { Button, Card, Spin } from "antd";
import { Link } from "react-router-dom";
import {
  AtomAllPresentations,
  AtomCurrentPresentation,
} from "../store/atom/atom.store";
import { useRecoilState } from "recoil";

const AllPresentation = () => {
  const [loader, setLoader] = useState(false);

  const [AllPresentations, setAllPresentations] =
    useRecoilState(AtomAllPresentations);
  const [currentPresentationData, setCurrentPresentationData] = useRecoilState(
    AtomCurrentPresentation
  );
  useEffect(() => {
    getAllPresentations();
  }, [window.localStorage.getItem("auth")]);

  const getAllPresentations = () => {
    setLoader(true);
    const _presentationData: PresentationDTO[] = [] as PresentationDTO[];
    const q = query(
      collection(FStore, "PRESENTATION"),
      where("email", "==", window.localStorage.getItem("auth"))
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const _data: PresentationDTO = doc.data() as PresentationDTO;
        _data.id = doc.id;
        _presentationData.push(_data as any);
      });
      setAllPresentations(_presentationData);
      setLoader(false);
    });

    return unsubscribe;
  };

  return (
    <Spin spinning={loader}>
      <div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link
            key="sadsads"
            to={`/allpresentation/add`}
            onClick={() => console.log(currentPresentationData)}
          >
            <Button type="primary">ADD PRESENTATION</Button>
          </Link>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {!AllPresentations.length && !loader ? (
            <div>
              <h1>No Data Available ! </h1>
            </div>
          ) : (
            AllPresentations.map((user, index) => (
              <Link
                to={`/allpresentation/edit/${user.id}`}
                key={user.id ?? index}
                onClick={() => setCurrentPresentationData(user)}
              >
                <div style={{ flex: "0 0 200px", padding: "5px" }}>
                  <Card style={{ width: "100%" }}>
                    <div>
                      <div>
                        <b>TOPIC </b>: {user.topic}
                      </div>
                      <div>
                        <b>CATEGORY </b>: {user.category}
                      </div>
                      <div>
                        <b>FILE</b>: {user.fileName}
                      </div>
                    </div>
                  </Card>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </Spin>
  );
};
export default AllPresentation;
