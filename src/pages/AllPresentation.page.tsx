import { collection, getDocs, query, where } from "firebase/firestore";
import { FStore, auth } from "../common/config/firebase/firebase.config";
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
    // debugger
    getAllPresentations();
  }, [window.localStorage.getItem("auth")]);

  const getAllPresentations = async () => {
    // debugger
    console.log(auth);

    setLoader(true);
    let _presentationData: PresentationDTO[] = [] as PresentationDTO[];
    const q = query(
      collection(FStore, "PRESENTATION"),
      where("email", "==", window.localStorage.getItem("auth"))
    );
    setLoader(false)
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      setLoader(false);
      const _data = doc.data();
      _data.id = doc.id;
      _presentationData.push(_data as any);
    });
    setAllPresentations(_presentationData);
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
        <div style={{ display: "flex", flexDirection: "row" }}>
          {AllPresentations.map((user, index) => (
            <Link
              to={`/allpresentation/edit/${user.id}`}
              onClick={() => {
                setLoader(true);
                setCurrentPresentationData(user);
                setLoader(false);
              }}
            >
              <div style={{ padding: "5px" }}>
                <Card key={user.id ?? index} style={{ width: "200px" }}>
                  <div style={{ justifyContent: "center" }}>
                    <div>
                      <b>TOPIC </b>: {user.topic}
                    </div>
                    <div>
                      <b>CATEGORY </b>: {user.category}
                    </div>
                    <div>
                      <b>FILE </b>: {user.fileName}
                    </div>
                  </div>
                </Card>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Spin>
  );
};
export default AllPresentation;
